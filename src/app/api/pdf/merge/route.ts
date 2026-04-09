import { NextRequest } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return Response.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return Response.json(
        { error: "Maximum of 10 files allowed" },
        { status: 400 }
      );
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        return Response.json(
          { error: "All files must be PDFs" },
          { status: 400 }
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        return Response.json(
          { error: "Individual file size cannot exceed 10MB" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      
      try {
        const pdfDoc = await PDFDocument.load(buffer);
        const copiedPages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } catch (err) {
        console.error("Error loading/merging a PDF:", err);
        return Response.json(
          { error: `Error processing file: ${file.name}. It might be corrupted or password protected.` },
          { status: 400 }
        );
      }
    }

    const pdfBytes = await mergedPdf.save();

    return new Response(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="merged-document.pdf"`,
        "Content-Length": String(pdfBytes.length),
      },
    });
  } catch (err) {
    console.error("[pdf-merge] Merge failed:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Merge failed" },
      { status: 500 }
    );
  }
}
