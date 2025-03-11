import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  //   return NextResponse.redirect(new URL("/auth", request.url));
  const path = req.nextUrl.pathname;

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!session && path !== "/auth") {
    return NextResponse.redirect(new URL("/auth", req.url));
  } else if (session && path === "/auth") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: "/((?!_next|favicon.ico|api/auth|public|images).*)",
};
