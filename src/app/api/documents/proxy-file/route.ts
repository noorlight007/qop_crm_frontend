import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }

    // Fetch the file from the external URL
    const response = await fetch(fileUrl, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch file: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the file data as buffer
    const buffer = await response.arrayBuffer();

    // Get content type from the original response
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    // Return the file with appropriate headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error proxying file:", error);
    return NextResponse.json(
      { error: "Failed to proxy file" },
      { status: 500 }
    );
  }
}
