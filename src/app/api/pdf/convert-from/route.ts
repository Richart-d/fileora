import { NextRequest } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

/* ── Text extraction helper ── */

async function extractTextFromPdf(
  buffer: Buffer
): Promise<{ text: string; numPages: number; info: Record<string, string> }> {
  // Dynamic import for pdf-parse
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod = await import("pdf-parse") as any;
  const pdfParse = mod.default || mod;
  const data = await pdfParse(buffer);
  return {
    text: data.text || "",
    numPages: data.numpages || 1,
    info: (data.info as Record<string, string>) || {},
  };
}

/* ── PDF → HTML ── */

async function convertPdfToHtml(buffer: Buffer): Promise<Buffer> {
  const { text, numPages, info } = await extractTextFromPdf(buffer);
  const title = info.Title || "Converted Document";
  const paragraphs = text.split(/\n+/).filter((p) => p.trim());

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      line-height: 1.6;
      color: #1E293B;
      background: #F8FAFC;
    }
    .header {
      border-bottom: 2px solid #0D9488;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .header h1 { color: #1E3A5F; font-size: 1.5rem; margin: 0 0 4px; }
    .header .meta { color: #64748B; font-size: 0.875rem; }
    p { margin: 0 0 12px; }
    .notice {
      background: #FFF7ED;
      border: 1px solid #FDBA74;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.8rem;
      color: #9A3412;
      margin-bottom: 24px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(title)}</h1>
    <p class="meta">${numPages} page${numPages > 1 ? "s" : ""} &middot; Extracted by Fileora</p>
  </div>
  <div class="notice">
    Note: This is a text-based extraction. Original formatting, images, and layout may not be fully preserved.
  </div>
  ${paragraphs.map((p) => `  <p>${escapeHtml(p)}</p>`).join("\n")}
</body>
</html>`;

  return Buffer.from(html, "utf-8");
}

/* ── PDF → DOCX ── */

async function convertPdfToDocx(buffer: Buffer): Promise<Buffer> {
  const { text, info } = await extractTextFromPdf(buffer);
  const title = info.Title || "Converted Document";
  const paragraphs = text.split(/\n+/).filter((p) => p.trim());

  const doc = new Document({
    title,
    description: "Converted from PDF by Fileora",
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 32,
                color: "1E3A5F",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }),
          // Notice
          new Paragraph({
            children: [
              new TextRun({
                text: "Note: This document was extracted from a PDF. Original formatting, images, and layout may not be fully preserved.",
                italics: true,
                size: 18,
                color: "9A3412",
              }),
            ],
            spacing: { after: 300 },
          }),
          // Body paragraphs
          ...paragraphs.map(
            (p) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: p,
                    size: 22,
                  }),
                ],
                spacing: { after: 120 },
                alignment: AlignmentType.LEFT,
              })
          ),
        ],
      },
    ],
  });

  const docxBuffer = await Packer.toBuffer(doc);
  return Buffer.from(docxBuffer);
}

/* ── PDF → JPG/PNG (text extraction for client-side rendering) ── */

async function extractPdfForImage(
  buffer: Buffer
): Promise<{ text: string; numPages: number }> {
  const { text, numPages } = await extractTextFromPdf(buffer);
  return { text, numPages };
}

/* ── Utilities ── */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ── Route Handler ── */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const outputFormat = (formData.get("format") as string) || "html";

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

    // Verify it's a PDF
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".pdf")) {
      return Response.json(
        { error: "Please upload a PDF file" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const baseName = file.name.replace(/\.pdf$/i, "");

    switch (outputFormat) {
      case "html": {
        const htmlBuffer = await convertPdfToHtml(buffer);
        return new Response(new Uint8Array(htmlBuffer), {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Content-Disposition": `attachment; filename="${encodeURIComponent(baseName)}.html"`,
            "Content-Length": String(htmlBuffer.length),
          },
        });
      }

      case "docx": {
        const docxBuffer = await convertPdfToDocx(buffer);
        return new Response(new Uint8Array(docxBuffer), {
          status: 200,
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": `attachment; filename="${encodeURIComponent(baseName)}.docx"`,
            "Content-Length": String(docxBuffer.length),
          },
        });
      }

      case "jpg":
      case "png": {
        // Return extracted text as JSON — client handles image rendering
        const { text, numPages } = await extractPdfForImage(buffer);
        return Response.json({
          text,
          numPages,
          baseName,
          format: outputFormat,
        });
      }

      default:
        return Response.json(
          { error: "Unsupported output format. Accepted: html, docx, jpg, png" },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("[convert-from] Conversion failed:", err);
    return Response.json(
      {
        error:
          err instanceof Error ? err.message : "Conversion failed",
      },
      { status: 500 }
    );
  }
}
