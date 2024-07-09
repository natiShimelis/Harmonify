import { auth } from "@/auth";

export const middleware = auth(async (req) => {
  const pathname = req.nextUrl.pathname;
  if (req.auth) {
    if (pathname.startsWith("/login")) {
      return Response.redirect(new URL("/", req.url));
    }
  } else {
    if (!pathname.startsWith("/login")) {
      return Response.redirect(new URL("/login", req.url));
    }
  }
});
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

