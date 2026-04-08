import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Rutas públicas (no requieren autenticación)
  const publicPaths = ["/login", "/register", "/"];
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith("/products"),
  );

  // Si no hay token y la ruta no es pública, redirigir a login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si hay token y está en login/register, redirigir a home
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
