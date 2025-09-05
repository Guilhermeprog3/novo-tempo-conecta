import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Redirect old URLs to new structure
  const url = request.nextUrl.clone()

  // Redirect /business/* to /estabelecimento/*
  if (url.pathname.startsWith("/business/")) {
    url.pathname = url.pathname.replace("/business/", "/estabelecimento/")
    return NextResponse.redirect(url)
  }

  // Redirect /search to /busca
  if (url.pathname === "/search") {
    url.pathname = "/busca"
    return NextResponse.redirect(url)
  }

  // Redirect /categories to /categorias
  if (url.pathname === "/categories") {
    url.pathname = "/categorias"
    return NextResponse.redirect(url)
  }

  // Redirect /about to /sobre
  if (url.pathname === "/about") {
    url.pathname = "/sobre"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
