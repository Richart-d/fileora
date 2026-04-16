import { NextRequest } from "next/server";
import { PDFDocument } from "pdf-lib";
import { logPdfActivity } from "@/lib/pdfLogger";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const level = (formData.get("level") as string) || "medium"; // low, medium, high

    if (!file) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > 20 * 1024 * 1024) {
      return Response.json(
        { error: "File exceeds the 20MB maximum size" },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return Response.json(
        { error: "Please upload a PDF file" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let pdfDoc: PDFDocument;
    try {
      // Ignore encryption check bypasses for standard files
      pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    } catch (err) {
      console.error("Error loading PDF:", err);
      return Response.json(
        { error: "Could not read the PDF file. It might be corrupted or severely encrypted." },
        { status: 400 }
      );
    }

    // -- Compression Logic (via pdf-lib mechanisms) --
    
    // 1. Flatten Forms (Removes interactive Widget annotations and appearance streams overhead)
    if (level === "medium" || level === "high") {
      try {
        const form = pdfDoc.getForm();
        form.flatten();
      } catch {
        // Form might not exist or failed to flatten, ignore
      }
    }

    // 2. Remove Metadata / Rebuild Document
    let finalDoc = pdfDoc;
    if (level === "high") {
      // Wiping metadata fields
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("Fileora");
      pdfDoc.setCreator("Fileora");

      // To clear orphaned/unused objects (which happens in heavily edited PDFs),
      // we can copy all pages into a completely fresh document.
      try {
        const rebuiltDoc = await PDFDocument.create();
        const pages = await rebuiltDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach((page) => rebuiltDoc.addPage(page));
        finalDoc = rebuiltDoc;
      } catch {
        // Fallback to original doc if rebuilding fails for some complex structural reason
        finalDoc = pdfDoc;
      }
    }

    // 3. Save with useObjectStreams
    // useObjectStreams: true compresses the PDF objects into streams, saving significant space.
    const compressedPdfBytes = await finalDoc.save({ useObjectStreams: true });

    const baseName = file.name.replace(/\.pdf$/i, "");

    await logPdfActivity(
      "Compress",
      [file.name],
      `${baseName}-compressed.pdf`,
      "success"
    );

    return new Response(new Uint8Array(compressedPdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(baseName)}-compressed.pdf"`,
        "Content-Length": String(compressedPdfBytes.length),
        // Send the new size back in headers so the client can display savings
        "X-Original-Size": String(file.size),
        "X-Compressed-Size": String(compressedPdfBytes.length),
      },
    });
  } catch (err) {
    console.error("[pdf-compress] Compression failed:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "PDF compression failed" },
      { status: 500 }
    );
  }
}
