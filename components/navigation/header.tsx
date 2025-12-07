// components/navigation/header.tsx
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
import Image from "next/image"

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ title = "Novo Tempo Conecta", subtitle = "Seu bairro, seus negócios" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false); 
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
    setIsMounted(true); 
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
    { href: "/contato", label: "Contato" },
  ]

  return (
    <header className="border-b sticky top-0 z-[9999] shadow-sm bg-gradient-to-r from-[#1E3A8A] to-[#254A9E]">
      <div className="container mx-auto px-4 py-4">
        
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo Novo Tempo Conecta"
              width={180}
              height={50}
              priority
            />
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors font-medium ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-white hover:text-white/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* USER AREA DESKTOP */}
          <div className="hidden md:flex items-center space-x-2">

            {!isMounted ? (
              <div className="h-10 w-48" />
            ) : isLoggedIn ? (
              
              <DropdownMenu modal={false}>
                
                <DropdownMenuTrigger asChild>
                  <button className="relative h-10 w-10 rounded-full overflow-hidden hover:opacity-80 transition">
                    <Avatar className="h-10 w-10 border border-gray-600">
                      <AvatarImage
                        src={user?.avatar || "/avatar-mulher-brasileira.jpg"}
                        alt={user?.name || "Usuário"}
                      />
                      <AvatarFallback className="bg-blue-600 text-white font-bold">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
  align="end"
  sideOffset={8}
  className="
    w-56 
    rounded-xl 
    border border-white/10 
    bg-[#14285a] 
    text-white 
    shadow-lg shadow-black/40
    backdrop-blur-md
    animate-in fade-in-0 zoom-in-95
  "
  style={{ zIndex: 999999 }}
>
  <DropdownMenuLabel className="px-4 py-3 text-sm text-white/90">
    <div className="flex flex-col leading-tight">
      <span className="font-semibold">{user?.name || "Usuário"}</span>
      <span className="text-xs text-white/60">{user?.email}</span>
    </div>
  </DropdownMenuLabel>

  <DropdownMenuSeparator className="bg-white/10" />

  <DropdownMenuItem asChild>
    <Link
      href="/usuario/dashboard"
      className="
        flex items-center px-3 py-2 rounded-md transition 
        hover:bg-blue-600/40 hover:text-white
      "
    >
      <User className="mr-2 h-4 w-4" /> Meu Perfil
    </Link>
  </DropdownMenuItem>

  <DropdownMenuItem asChild>
    <Link
      href="/favoritos"
      className="
        flex items-center px-3 py-2 rounded-md transition 
        hover:bg-blue-600/40 hover:text-white
      "
    >
      <Heart className="mr-2 h-4 w-4" /> Favoritos
    </Link>
  </DropdownMenuItem>

  <DropdownMenuItem asChild>
    <Link
      href="/usuario/avaliacoes"
      className="
        flex items-center px-3 py-2 rounded-md transition 
        hover:bg-blue-600/40 hover:text-white
      "
    >
      <Star className="mr-2 h-4 w-4" /> Minhas Avaliações
    </Link>
  </DropdownMenuItem>

  <DropdownMenuItem asChild>
    <Link
      href="/usuario/comentarios"
      className="
        flex items-center px-3 py-2 rounded-md transition 
        hover:bg-blue-600/40 hover:text-white
      "
    >
      <MessageSquare className="mr-2 h-4 w-4" /> Meus Comentários
    </Link>
  </DropdownMenuItem>

  <DropdownMenuSeparator className="bg-white/10" />

  <DropdownMenuItem asChild>
    <Link
      href="/usuario/configuracoes"
      className="
        flex items-center px-3 py-2 rounded-md transition 
        hover:bg-blue-600/40 hover:text-white
      "
    >
      <Settings className="mr-2 h-4 w-4" /> Configurações
    </Link>
  </DropdownMenuItem>

  <DropdownMenuSeparator className="bg-white/10" />

  <DropdownMenuItem
    onClick={handleLogout}
    className="
      flex items-center px-3 py-2 text-red-400 rounded-md transition 
      hover:bg-red-600/20 hover:text-red-300 cursor-pointer
    "
  >
    <LogOut className="mr-2 h-4 w-4" /> Sair
  </DropdownMenuItem>
</DropdownMenuContent>

              </DropdownMenu>

            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10 hover:text-white">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white">
                  <Link href="/cadastro">Cadastrar Cidadão</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/empresario/cadastro">Cadastrar Negócio</Link>
                </Button>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-white/10 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-700/50 bg-[#1E3A8A] -mx-4 px-4">
            <nav className="flex flex-col space-y-2 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded transition-colors font-medium ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-blue-700/50">
              {!isMounted ? (
                <div className="h-10 w-full" />
              ) : isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-3 px-2 py-3 border rounded-lg border-blue-700/50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.avatar || "/avatar-mulher-brasileira.jpg"}
                        alt={user?.name || "Usuário"}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">{user?.name || "Usuário"}</p>
                      <p className="text-xs text-white/80">{user?.email}</p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" asChild className="bg-transparent text-white border-white/50">
                    <Link href="/usuario/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" /> Meu Perfil
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="text-red-400 border-red-400/50 bg-transparent"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild className="bg-transparent text-white border-white/50">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Entrar
                    </Link>
                  </Button>

                  <Button variant="outline" size="sm" asChild className="bg-transparent text-white border-white/50">
                    <Link href="/cadastro" onClick={() => setMobileMenuOpen(false)}>
                      Cadastrar Cidadão
                    </Link>
                  </Button>

                  <Button size="sm" asChild>
                    <Link href="/empresario/cadastro" onClick={() => setMobileMenuOpen(false)}>
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
