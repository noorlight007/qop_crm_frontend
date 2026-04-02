import { authoption } from "@/app/api/auth/[...nextauth]/authOption";
import JSZip from "jszip";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

type FileItem = { url: string; name?: string };

const getSubdomainFromHost = (hostHeader: string | null): string => {
  const hostname = (hostHeader || "").split(":")[0].toLowerCase();
  if (!hostname) return "";

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || "";
  }

  const parts = hostname.split(".");
  if (parts.length > 2) {
    const sub = parts[0];
    return sub && sub !== "www" ? sub : "";
  }

  if (parts.length === 2 && parts[1] === "localhost") {
    const sub = parts[0];
    return sub && sub !== "www" ? sub : "";
  }

  return "";
};

const resolveRemoteUrl = (rawUrl: string, req: Request): string => {
  const trimmed = rawUrl.trim();

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  try {
    const u = new URL(trimmed);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      throw new Error("Unsupported URL protocol");
    }
    return u.toString();
  } catch {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (base) {
      return new URL(trimmed, base).toString();
    }
    const origin = new URL(req.url).origin;
    return new URL(trimmed, origin).toString();
  }
};

export async function POST(req: NextRequest) {
  try {
    const { files } = (await req.json()) as { files: FileItem[] };
    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const session = await getServerSession(authoption);
    const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const accessToken =
      session?.user?.accessToken || (jwt?.accessToken as string | undefined);
    const hostHeader =
      req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    const subdomain =
      session?.user?.subdomain ||
      (jwt?.subdomain as string | undefined) ||
      getSubdomainFromHost(hostHeader);

    const headers: Record<string, string> = {
      Accept: "*/*",
    };
    if (accessToken) {
      headers.Authorization = `JWT ${accessToken}`;
    }
    if (subdomain) {
      headers["X-TENANT-SUBDOMAIN"] = subdomain;
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
              u.pathname.split("/").pop() || "file",
            );
          } catch {
            baseName = "file";
          }
        }
        const filename = ensureUniqueName(baseName);
        try {
          const resolvedUrl = resolveRemoteUrl(f.url, req);
          const res = await fetch(resolvedUrl, {
            cache: "no-store",
            redirect: "follow",
            headers,
          });
          if (!res.ok)
            throw new Error(`Failed to fetch ${resolvedUrl}: ${res.status}`);
          const buf = await res.arrayBuffer();
          zip.file(filename, buf);
        } catch (err) {
          // Add a small error note file instead of failing entire zip
          zip.file(`${filename}.error.txt`, `Could not download ${f.url}`);
        }
      }),
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
      { status: 500 },
    );
  }
}
