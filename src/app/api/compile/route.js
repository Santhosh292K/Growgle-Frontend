import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(req) {
  try {
    const latex = await req.text();
    const forward = process.env.NEXT_PUBLIC_COMPILE_FORWARD_URL || (process.env.NEXT_PUBLIC_API_BASE_URL ? `${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "")}/compile` : "");
    if (forward) {
      try {
        const r = await fetch(forward, { method: "POST", headers: { "Content-Type": "text/plain" }, body: latex });
        const buf = Buffer.from(await r.arrayBuffer());
        const ct = r.headers.get("content-type") || "application/pdf";
        if (r.ok && ct.includes("pdf")) {
          return new NextResponse(buf, { status: r.status, headers: { "Content-Type": ct } });
        }
      } catch {}
    }
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 10;
    const margin = 40;
    const maxWidth = page.getWidth() - margin * 2;
    const lines = wrapText(latex, font, fontSize, maxWidth);
    let y = page.getHeight() - margin;
    for (const line of lines) {
      if (y < margin) { const p = pdfDoc.addPage([595.28, 841.89]); y = p.getHeight() - margin; p.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) }); y -= fontSize * 1.4; continue; }
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
      y -= fontSize * 1.4;
    }
    const bytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(bytes), { headers: { "Content-Type": "application/pdf" } });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Compile failed" }, { status: 500 });
  }
}

function wrapText(text, font, size, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    const width = font.widthOfTextAtSize(test, size);
    if (width > maxWidth) { if (line) lines.push(line); line = w; } else { line = test; }
  }
  if (line) lines.push(line);
  return lines;
}
