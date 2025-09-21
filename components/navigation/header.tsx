// components/navigation/header.tsx
"use client"

import { MapPin, Menu, X, User, Settings, LogOut, Heart } from "lucide-react"
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
    // Simulação
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const isActive = (path: string) => (pathname === path)

  const navItems = [
    { href: "/", label: "Início" },
    { href: "/mapa", label: "Mapa" },
    { href: "/sobre", label: "Sobre" },
  ]

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-foreground">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
              <p className="text-sm text-primary-foreground/80">{subtitle}</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
               <Button key={item.href} variant={isActive(item.href) ? "secondary" : "ghost"} asChild className={!isActive(item.href) ? "text-primary-foreground hover:bg-primary-foreground/10" : ""}>
                 <Link href={item.href}>{item.label}</Link>
               </Button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-primary-foreground/10">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                   {/* Conteúdo do Dropdown aqui */}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="text-primary-foreground hover:bg-primary-foreground/10">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="sm" asChild variant="secondary">
                  <Link href="/empresario/cadastro">Cadastrar Negócio</Link>
                </Button>
              </>
            )}
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary-foreground/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-primary-foreground/20">
             {/* Conteúdo do menu mobile aqui */}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header