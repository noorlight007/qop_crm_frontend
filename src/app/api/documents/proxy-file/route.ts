import { authoption } from "@/app/api/auth/[...nextauth]/authOption";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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

  // Protocol-relative URL (e.g. //cdn.example.com/file)
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  // Scheme-less absolute URL (e.g. api.example.com/path)
  // Treat as https by default.
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // Absolute URL
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      throw new Error("Unsupported URL protocol");
    }
    return u.toString();
  } catch {
    // Relative URL -> resolve against backend base URL if available
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (base) {
      return new URL(trimmed, base).toString();
    }
    // Fallback to request origin (less ideal, but prevents crashes)
    const origin = new URL(req.url).origin;
    return new URL(trimmed, origin).toString();
  }
};

export async function POST(req: NextRequest) {
  try {
    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 },
      );
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

    const resolvedUrl = resolveRemoteUrl(fileUrl, req);

    const headers: Record<string, string> = {
      Accept: "*/*",
    };

    if (accessToken) {
      headers.Authorization = `JWT ${accessToken}`;
    }
    if (subdomain) {
      headers["X-TENANT-SUBDOMAIN"] = subdomain;
    }

    // Fetch the file from the external URL
    const response = await fetch(resolvedUrl, {
      cache: "no-store",
      redirect: "follow",
      headers,
    });

    if (!response.ok) {
      let upstreamPreview: string | undefined;
      try {
        const text = await response.text();
        upstreamPreview = text.slice(0, 1000);
      } catch {
        // ignore
      }

      return NextResponse.json(
        {
          error: `Failed to fetch file: ${response.statusText}`,
          url: resolvedUrl,
          status: response.status,
          authForwarded: !!accessToken,
          subdomainForwarded: !!subdomain,
          upstreamPreview,
        },
        { status: response.status },
      );
    }

    // Get the file data as buffer
    const buffer = await response.arrayBuffer();

    // Get content type from the original response
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = response.headers.get("content-disposition");

    // Return the file with appropriate headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        ...(contentDisposition
          ? { "Content-Disposition": contentDisposition }
          : {}),
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error proxying file:", error);
    return NextResponse.json(
      { error: "Failed to proxy file" },
      { status: 500 },
    );
  }
}
