import { NextRequest, NextResponse } from "next/server";

const PATHS_TO_CLEAR = ["/", "/auth", "/api"]; // cover common cookie paths

function setExpiredCookie(
  response: NextResponse,
  name: string,
  path: string,
  domain?: string,
) {
  const options: Parameters<typeof response.cookies.set>[2] = {
    path,
    expires: new Date(0),
    maxAge: 0,
  };

  if (domain) {
    options.domain = domain;
  }

  response.cookies.set(name, "", options);
}

function clearAllRequestCookies(request: NextRequest) {
  const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  const domainsToClear = cookieDomain ? [undefined, cookieDomain] : [undefined];

  const cookies = request.cookies.getAll();
  const response = new NextResponse(null, { status: 204 });

  for (const cookie of cookies) {
    for (const path of PATHS_TO_CLEAR) {
      for (const domain of domainsToClear) {
        setExpiredCookie(response, cookie.name, path, domain);
      }
    }
  }

  return response;
}

export function POST(request: NextRequest) {
  return clearAllRequestCookies(request);
}

// Handy for simple link-based logout flows.
export function GET(request: NextRequest) {
  return clearAllRequestCookies(request);
}
