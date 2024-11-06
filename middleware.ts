import { type NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }

  return NextResponse.next();
}

function isAuthenticated(req: NextRequest) {
  if (process.env.BASIC_AUTH_ENABLED === "false") {
    return true;
  }
  const authheader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authheader) {
    return false;
  }

  const auth = Buffer.from(authheader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const user = auth[0];
  const pass = auth[1];

  if (
    user == process.env.BASIC_AUTH_USERNAME &&
    pass == process.env.BASIC_AUTH_PASSWORD
  ) {
    return true;
  } else {
    return false;
  }
}
