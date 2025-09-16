"use client"

import { MapPin, Menu, X, User, Settings, LogOut, Heart, MessageSquare, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ title = "Novo Tempo Conecta", subtitle = "Seu bairro, seus negócios" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("userType")
    setUser(null)
    setIsLoggedIn(false)
    window.location.href = "/"
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const navItems = [
    { href: "/", label: "Início" },
    { href: "/mapa", label: "Mapa" },
    { href: "/sobre", label: "Sobre" },
  ]

  return (
    <header
      className="border-b sticky top-0 z-50 shadow-sm"
      style={{
        backgroundColor: "white",
        borderColor: "#e2e8f0",
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#059669" }}>
              <MapPin className="w-5 h-5" style={{ color: "white" }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "#0f172a" }}>
                {title}
              </h1>
              <p className="text-sm" style={{ color: "#64748b" }}>
                {subtitle}
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors font-medium"
                style={{
                  color: isActive(item.href) ? "#059669" : "#0f172a",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.avatar || "/avatar-mulher-brasileira.jpg"}
                        alt={user?.name || "Usuário"}
                      />
                      <AvatarFallback style={{ backgroundColor: "#059669", color: "white" }}>
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || "Usuário"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email || "usuario@email.com"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/usuario/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favoritos" className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Favoritos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/usuario/avaliacoes" className="flex items-center">
                      <Star className="mr-2 h-4 w-4" />
                      <span>Minhas Avaliações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/usuario/comentarios" className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Meus Comentários</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/usuario/configuracoes" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/cadastro">Cadastrar Negócio</Link>
                </Button>
              </>
            )}
          </div>

          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t" style={{ borderColor: "#e2e8f0" }}>
            <nav className="flex flex-col space-y-2 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2 py-2 rounded transition-colors font-medium"
                  style={{
                    color: isActive(item.href) ? "#059669" : "#0f172a",
                    backgroundColor: isActive(item.href) ? "#f0fdf4" : "transparent",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col space-y-2 mt-4">
              <div className="flex justify-center py-2">
                <ThemeToggle />
              </div>
              {isLoggedIn ? (
                <>
                  <div
                    className="flex items-center space-x-3 px-2 py-3 border rounded-lg"
                    style={{ borderColor: "#e2e8f0" }}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.avatar || "/avatar-mulher-brasileira.jpg"}
                        alt={user?.name || "Usuário"}
                      />
                      <AvatarFallback style={{ backgroundColor: "#059669", color: "white" }}>
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.name || "Usuário"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || "usuario@email.com"}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/usuario/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Meu Perfil
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/favoritos" onClick={() => setMobileMenuOpen(false)}>
                      <Heart className="mr-2 h-4 w-4" />
                      Favoritos
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/usuario/configuracoes" onClick={() => setMobileMenuOpen(false)}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Entrar
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/cadastro" onClick={() => setMobileMenuOpen(false)}>
                      Cadastrar Negócio
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
