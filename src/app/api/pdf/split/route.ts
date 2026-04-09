import { NextRequest } from "next/server";
import { PDFDocument } from "pdf-lib";

/**
 * Parses a range string like "1-3,5,7-9" into an array of 0-indexed page numbers.
 * @param rangeStr The user input range string
 * @param maxPages Total number of pages in the document
 * @returns Array of 0-indexed page numbers, sorted, or throws an error if invalid
 */
function parsePageRanges(rangeStr: string, maxPages: number): number[] {
  const pages: Set<number> = new Set();
  const parts = rangeStr.split(",").map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (isNaN(start) || isNaN(end) || start > end || start < 1) {
        throw new Error(`Invalid range format: ${part}`);
      }
      for (let i = start; i <= end; i++) {
        pages.add(i - 1); // 0-indexed
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        throw new Error(`Invalid page number: ${part}`);
      }
      pages.add(pageNum - 1); // 0-indexed
    }
  }

  const result = Array.from(pages).sort((a, b) => a - b);
  
  if (result.length === 0) {
    throw new Error("No valid pages specified");
  }

  // Validate against max pages
  for (const p of result) {
    if (p >= maxPages) {
      throw new Error(`Page ${p + 1} is out of bounds (document has ${maxPages} pages)`);
    }
  }

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const ranges = formData.get("ranges") as string | null;

    if (!file) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }
    if (!ranges) {
      return Response.json(
        { error: "No page ranges provided" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json(
        { error: "File exceeds the 10MB maximum size" },
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
    
    let sourcePdf: PDFDocument;
    try {
      sourcePdf = await PDFDocument.load(buffer);
    } catch (err) {
      console.error("Error loading PDF:", err);
      return Response.json(
        { error: "Could not read the PDF file. It might be corrupted or password protected." },
        { status: 400 }
      );
    }

    const totalPages = sourcePdf.getPageCount();
    let pageIndicesToExtract: number[];
    
    try {
      pageIndicesToExtract = parsePageRanges(ranges, totalPages);
    } catch (err) {
      return Response.json(
        { error: err instanceof Error ? err.message : "Invalid page range" },
        { status: 400 }
      );
    }

    const splitPdf = await PDFDocument.create();
    const copiedPages = await splitPdf.copyPages(sourcePdf, pageIndicesToExtract);
    copiedPages.forEach((page) => splitPdf.addPage(page));

    const splitPdfBytes = await splitPdf.save();
    const baseName = file.name.replace(/\.pdf$/i, "");

    return new Response(new Uint8Array(splitPdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(baseName)}-split.pdf"`,
        "Content-Length": String(splitPdfBytes.length),
      },
    });
  } catch (err) {
    console.error("[pdf-split] Split failed:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "PDF split failed" },
      { status: 500 }
    );
  }
}
