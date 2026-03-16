import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const userRole = request.cookies.get("userRole")?.value

  // 1. Proteção de Rotas de Administração
  if (url.pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // 2. Proteção de Rotas de Empresário
  if (url.pathname.startsWith("/empresario") && userRole !== "business") {
    // Se for admin, pode opcionalmente entrar, se não, redireciona
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // 3. Proteção de Rotas de Utilizador Comum (Dashboard de Cidadão)
  if (url.pathname.startsWith("/usuario") && !userRole) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirecionamentos de SEO/Estrutura existentes
  if (url.pathname.startsWith("/business/")) {
    url.pathname = url.pathname.replace("/business/", "/estabelecimento/")
    return NextResponse.redirect(url)
  }

  if (url.pathname === "/search") {
    url.pathname = "/busca"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Aplicar middleware a todas as rotas exceto ficheiros estáticos e API
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}