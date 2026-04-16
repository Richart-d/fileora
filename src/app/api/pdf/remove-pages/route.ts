import { NextRequest } from "next/server";
import { PDFDocument } from "pdf-lib";
import { logPdfActivity } from "@/lib/pdfLogger";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const pagesToRemoveStr = formData.get("pages") as string | null;

    if (!file) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!pagesToRemoveStr) {
      return Response.json(
        { error: "No pages specified for removal" },
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

    // Parse the page indices to remove (0-indexed from client)
    let pagesToRemove: number[];
    try {
      pagesToRemove = JSON.parse(pagesToRemoveStr);
      if (!Array.isArray(pagesToRemove) || pagesToRemove.length === 0) {
        throw new Error("Invalid page selection");
      }
    } catch {
      return Response.json(
        { error: "Invalid page selection format" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let sourcePdf: PDFDocument;
    try {
      sourcePdf = await PDFDocument.load(buffer);
    } catch {
      return Response.json(
        { error: "Could not read the PDF. It might be corrupted or password protected." },
        { status: 400 }
      );
    }

    const totalPages = sourcePdf.getPageCount();

    // Validate indices
    const removeSet = new Set(pagesToRemove);
    for (const idx of Array.from(removeSet)) {
      if (idx < 0 || idx >= totalPages) {
        return Response.json(
          { error: `Page index ${idx} is out of bounds (document has ${totalPages} pages)` },
          { status: 400 }
        );
      }
    }

    if (removeSet.size >= totalPages) {
      return Response.json(
        { error: "Cannot remove all pages from the document" },
        { status: 400 }
      );
    }

    // Build list of pages to KEEP (indices not in the remove set)
    const keepIndices = [];
    for (let i = 0; i < totalPages; i++) {
      if (!removeSet.has(i)) {
        keepIndices.push(i);
      }
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(sourcePdf, keepIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    const baseName = file.name.replace(/\.pdf$/i, "");

    await logPdfActivity(
      "Remove Pages",
      [file.name],
      `${baseName}-edited.pdf`,
      "success"
    );

    return new Response(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(baseName)}-edited.pdf"`,
        "Content-Length": String(pdfBytes.length),
      },
    });
  } catch (err) {
    console.error("[pdf-remove-pages] Failed:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Page removal failed" },
      { status: 500 }
    );
  }
}
