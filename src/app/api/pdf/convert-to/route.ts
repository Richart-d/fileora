import { NextRequest } from "next/server";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/* ── Helpers ── */

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN = 50;
const TEXT_WIDTH = A4_WIDTH - 2 * MARGIN;

/**
 * Render an array of plain-text lines into a multi-page pdf-lib document.
 */
async function textToPdfBuffer(text: string, title?: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 11;
  const lineHeight = fontSize * 1.5;

  // Word-wrap the full text
  const paragraphs = text.split(/\n/);
  const wrappedLines: { text: string; bold: boolean }[] = [];

  for (const para of paragraphs) {
    if (para.trim() === "") {
      wrappedLines.push({ text: "", bold: false });
      continue;
    }
    const words = para.split(/\s+/);
    let currentLine = "";
    for (const word of words) {
      const test = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(test, fontSize);
      if (width > TEXT_WIDTH && currentLine) {
        wrappedLines.push({ text: currentLine, bold: false });
        currentLine = word;
      } else {
        currentLine = test;
      }
    }
    if (currentLine) wrappedLines.push({ text: currentLine, bold: false });
  }

  // Render pages
  let page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - MARGIN;

  // Optional title
  if (title) {
    page.drawText(title, {
      x: MARGIN,
      y,
      size: 16,
      font: boldFont,
      color: rgb(0.118, 0.227, 0.373), // Navy
    });
    y -= 28;
  }

  for (const line of wrappedLines) {
    if (y < MARGIN + lineHeight) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      y = A4_HEIGHT - MARGIN;
    }
    if (line.text !== "") {
      page.drawText(line.text, {
        x: MARGIN,
        y,
        size: fontSize,
        font: line.bold ? boldFont : font,
        color: rgb(0.1, 0.1, 0.1),
      });
    }
    y -= lineHeight;
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/* ── DOCX → PDF ── */
async function convertDocxToPdf(buffer: Buffer, fileName: string): Promise<Buffer> {
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value;
  if (!text || text.trim().length === 0) {
    throw new Error("The DOCX file appears to be empty.");
  }
  return textToPdfBuffer(text, fileName.replace(/\.docx?$/i, ""));
}

/* ── XLSX → PDF ── */
async function convertXlsxToPdf(buffer: Buffer): Promise<Buffer> {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 9;
  const headerFontSize = 10;
  const rowHeight = 18;
  const cellPadding = 6;

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
    if (!data || data.length === 0) continue;

    // Calculate column widths based on content
    const numCols = Math.max(...data.map((row) => (row as string[]).length));
    const colWidth = Math.min(
      (A4_WIDTH - 2 * MARGIN) / Math.max(numCols, 1),
      180
    );
    const tableWidth = colWidth * numCols;

    let page = pdfDoc.addPage([
      Math.max(A4_WIDTH, tableWidth + 2 * MARGIN),
      A4_HEIGHT,
    ]);
    let y = A4_HEIGHT - MARGIN;

    // Sheet title
    page.drawText(sheetName, {
      x: MARGIN,
      y,
      size: 14,
      font: boldFont,
      color: rgb(0.118, 0.227, 0.373),
    });
    y -= 24;

    for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
      const row = data[rowIdx] as string[];
      if (y < MARGIN + rowHeight) {
        page = pdfDoc.addPage([
          Math.max(A4_WIDTH, tableWidth + 2 * MARGIN),
          A4_HEIGHT,
        ]);
        y = A4_HEIGHT - MARGIN;
      }

      const isHeader = rowIdx === 0;
      const activeFont = isHeader ? boldFont : font;
      const activeFontSize = isHeader ? headerFontSize : fontSize;

      // Draw row background for header
      if (isHeader) {
        page.drawRectangle({
          x: MARGIN,
          y: y - rowHeight + 4,
          width: tableWidth,
          height: rowHeight,
          color: rgb(0.93, 0.95, 0.97),
        });
      }

      // Draw cells
      for (let colIdx = 0; colIdx < numCols; colIdx++) {
        const cellValue = row[colIdx] != null ? String(row[colIdx]) : "";
        const x = MARGIN + colIdx * colWidth;

        // Truncate text if too wide
        let displayText = cellValue;
        const maxTextWidth = colWidth - 2 * cellPadding;
        while (
          activeFont.widthOfTextAtSize(displayText, activeFontSize) >
            maxTextWidth &&
          displayText.length > 1
        ) {
          displayText = displayText.slice(0, -1);
        }

        page.drawText(displayText, {
          x: x + cellPadding,
          y: y - 12,
          size: activeFontSize,
          font: activeFont,
          color: rgb(0.1, 0.1, 0.1),
        });

        // Cell border
        page.drawRectangle({
          x,
          y: y - rowHeight + 4,
          width: colWidth,
          height: rowHeight,
          borderColor: rgb(0.8, 0.84, 0.88),
          borderWidth: 0.5,
        });
      }

      y -= rowHeight;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/* ── JPG / PNG → PDF ── */
async function convertImageToPdf(
  buffer: Buffer,
  fileName: string
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const isJpg =
    fileName.endsWith(".jpg") || fileName.endsWith(".jpeg");
  const image = isJpg
    ? await pdfDoc.embedJpg(buffer)
    : await pdfDoc.embedPng(buffer);

  // Scale image to fit A4 while preserving aspect ratio
  const imgWidth = image.width;
  const imgHeight = image.height;
  const scaleX = A4_WIDTH / imgWidth;
  const scaleY = A4_HEIGHT / imgHeight;
  const scale = Math.min(scaleX, scaleY, 1); // never upscale

  const scaledW = imgWidth * scale;
  const scaledH = imgHeight * scale;

  const page = pdfDoc.addPage([
    Math.max(scaledW, A4_WIDTH),
    Math.max(scaledH, A4_HEIGHT),
  ]);

  // Centre the image on the page
  const x = (page.getWidth() - scaledW) / 2;
  const y = (page.getHeight() - scaledH) / 2;

  page.drawImage(image, { x, y, width: scaledW, height: scaledH });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/* ── HTML → PDF ── */
async function convertHtmlToPdf(
  buffer: Buffer,
  fileName: string
): Promise<Buffer> {
  const html = buffer.toString("utf-8");

  // Smart HTML-to-text: preserve paragraphs, headings, list items
  const text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "  • ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return textToPdfBuffer(text, fileName.replace(/\.html?$/i, ""));
}

/* ── Route Handler ── */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json(
        { error: "File exceeds the 10MB maximum size" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    let pdfBuffer: Buffer;

    if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      pdfBuffer = await convertDocxToPdf(buffer, file.name);
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      pdfBuffer = await convertXlsxToPdf(buffer);
    } else if (
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileName.endsWith(".png")
    ) {
      pdfBuffer = await convertImageToPdf(buffer, fileName);
    } else if (fileName.endsWith(".html") || fileName.endsWith(".htm")) {
      pdfBuffer = await convertHtmlToPdf(buffer, file.name);
    } else {
      return Response.json(
        { error: "Unsupported file format. Accepted: DOCX, XLSX, JPG, PNG, HTML" },
        { status: 400 }
      );
    }

    const outputName = file.name.replace(/\.[^/.]+$/, "") + ".pdf";

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(outputName)}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err) {
    console.error("[convert-to] Conversion failed:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Conversion failed" },
      { status: 500 }
    );
  }
}
