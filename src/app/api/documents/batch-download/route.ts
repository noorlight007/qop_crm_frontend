import JSZip from "jszip";
import { NextResponse } from "next/server";

type FileItem = { url: string; name?: string };

export async function POST(req: Request) {
  try {
    const { files } = (await req.json()) as { files: FileItem[] };
    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const zip = new JSZip();
    const nameCounts = new Map<string, number>();

    const ensureUniqueName = (name: string) => {
      // sanitize filename and ensure uniqueness inside zip
      const clean = name.replace(/[\\:*?"<>|]/g, "_");
      const count = nameCounts.get(clean) ?? 0;
      nameCounts.set(clean, count + 1);
      if (count === 0) return clean;
      const dot = clean.lastIndexOf(".");
      if (dot > 0) {
        return `${clean.slice(0, dot)}(${count})${clean.slice(dot)}`;
      }
      return `${clean}(${count})`;
    };

    await Promise.all(
      files.map(async (f) => {
        if (!f?.url) return;
        let baseName = f.name;
        if (!baseName) {
          try {
            const u = new URL(f.url);
            baseName = decodeURIComponent(
              u.pathname.split("/").pop() || "file"
            );
          } catch {
            baseName = "file";
          }
        }
        const filename = ensureUniqueName(baseName);
        try {
          const res = await fetch(f.url, { cache: "no-store" });
          if (!res.ok)
            throw new Error(`Failed to fetch ${f.url}: ${res.status}`);
          const buf = await res.arrayBuffer();
          zip.file(filename, buf);
        } catch (err) {
          // Add a small error note file instead of failing entire zip
          zip.file(`${filename}.error.txt`, `Could not download ${f.url}`);
        }
      })
    );

    const zipArrayBuffer = await zip.generateAsync({ type: "arraybuffer" });
    return new NextResponse(zipArrayBuffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=documents.zip",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create zip" },
      { status: 500 }
    );
  }
}
