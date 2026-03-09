"use client"

import { Menu, X, User, Settings, LogOut, Heart, Star, ChevronDown, Sprout } from "lucide-react"
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

const headerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .hdr {
    font-family: 'DM Sans', sans-serif;
    --navy: #002240; --gold: #F7B000; --cyan: #00CCFF;
  }

  .hdr-bar {
    position: sticky; top: 0; z-index: 9999;
    background: rgba(0,34,64,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(247,176,0,0.12);
    transition: box-shadow 0.3s;
  }
  .hdr-bar.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,0.35); }

  .hdr-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 1.5rem; height: 68px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 1.5rem;
  }

  .hdr-nav { display: flex; align-items: center; gap: 4px; }

  .hdr-nav-link {
    position: relative;
    padding: 6px 14px; border-radius: 100px;
    font-size: 0.88rem; font-weight: 500;
    color: rgba(255,255,255,0.7); text-decoration: none;
    transition: color 0.2s, background 0.2s;
  }
  .hdr-nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
  .hdr-nav-link.active { color: var(--gold); background: rgba(247,176,0,0.1); }
  .hdr-nav-link.active::after {
    content: ''; position: absolute; bottom: -1px; left: 50%; transform: translateX(-50%);
    width: 16px; height: 2px; background: var(--gold); border-radius: 2px;
  }

  /* ── SOLIDÁRIA BUTTON ── */
  .hdr-solidaria {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 100px;
    font-size: 0.83rem; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    color: #002240;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    text-decoration: none;
    box-shadow: 0 3px 12px rgba(34,197,94,0.35);
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
    white-space: nowrap;
  }
  .hdr-solidaria:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(34,197,94,0.5);
  }
  .hdr-solidaria.active {
    background: linear-gradient(135deg, #16a34a, #15803d);
    box-shadow: 0 4px 18px rgba(34,197,94,0.55);
  }

  .hdr-auth { display: flex; align-items: center; gap: 8px; }

  .hdr-btn-ghost {
    padding: 7px 16px; border-radius: 10px;
    font-size: 0.85rem; font-weight: 500; color: rgba(255,255,255,0.75);
    background: none; border: none; cursor: pointer; text-decoration: none;
    transition: background 0.2s, color 0.2s;
  }
  .hdr-btn-ghost:hover { background: rgba(255,255,255,0.08); color: #fff; }

  .hdr-btn-outline {
    padding: 7px 16px; border-radius: 10px;
    font-size: 0.85rem; font-weight: 500; color: rgba(255,255,255,0.8);
    background: none; border: 1px solid rgba(255,255,255,0.2); cursor: pointer; text-decoration: none;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .hdr-btn-outline:hover { border-color: rgba(247,176,0,0.5); color: var(--gold); background: rgba(247,176,0,0.06); }

  .hdr-btn-primary {
    padding: 7px 16px; border-radius: 10px;
    font-family: 'Syne', sans-serif; font-size: 0.83rem; font-weight: 700;
    color: var(--navy); background: var(--gold); border: none; cursor: pointer; text-decoration: none;
    box-shadow: 0 4px 14px rgba(247,176,0,0.3);
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
  }
  .hdr-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(247,176,0,0.45); }

  .hdr-avatar-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 4px 10px 4px 4px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 100px; cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .hdr-avatar-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(247,176,0,0.3); }
  .hdr-avatar-name {
    font-size: 0.83rem; font-weight: 500; color: rgba(255,255,255,0.85);
    max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  .hdr-mobile-btn {
    display: none;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 8px; color: #fff; cursor: pointer; transition: background 0.2s;
  }

  .hdr-mobile {
    border-top: 1px solid rgba(247,176,0,0.1);
    background: rgba(0,26,52,0.98);
    padding: 1.2rem 1.5rem 1.5rem;
  }
  .hdr-mobile-nav { display: flex; flex-direction: column; gap: 4px; margin-bottom: 1.2rem; }
  .hdr-mobile-link {
    padding: 10px 14px; border-radius: 12px;
    font-size: 0.92rem; font-weight: 500;
    color: rgba(255,255,255,0.75); text-decoration: none;
    transition: background 0.15s, color 0.15s;
  }
  .hdr-mobile-link:hover, .hdr-mobile-link.active { background: rgba(247,176,0,0.1); color: var(--gold); }

  /* Mobile solidária */
  .hdr-mobile-solidaria {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 14px; border-radius: 12px;
    font-size: 0.92rem; font-weight: 700;
    color: #fff; text-decoration: none;
    background: rgba(34,197,94,0.12);
    border: 1px solid rgba(34,197,94,0.25);
    transition: background 0.15s;
  }
  .hdr-mobile-solidaria:hover, .hdr-mobile-solidaria.active {
    background: rgba(34,197,94,0.2); color: #4ade80;
  }

  .hdr-mobile-divider { height: 1px; background: rgba(255,255,255,0.07); margin-bottom: 1.2rem; }
  .hdr-mobile-actions { display: flex; flex-direction: column; gap: 8px; }
  .hdr-mobile-user {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px; border-radius: 14px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 8px;
  }
  .hdr-mobile-user-name { font-size: 0.9rem; font-weight: 600; color: #fff; }
  .hdr-mobile-user-email { font-size: 0.72rem; color: var(--gold); }

  .hdr-dropdown-item {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 12px; border-radius: 8px;
    font-size: 0.85rem; color: rgba(255,255,255,0.8);
    text-decoration: none; cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .hdr-dropdown-item:hover { background: rgba(247,176,0,0.12); color: var(--gold); }
  .hdr-dropdown-item.danger { color: #f87171; }
  .hdr-dropdown-item.danger:hover { background: rgba(239,68,68,0.1); color: #fca5a5; }

  @media (max-width: 768px) {
    .hdr-nav, .hdr-auth { display: none !important; }
    .hdr-mobile-btn { display: flex; }
  }
`

export function Header({ title = "Novo Tempo Conecta", subtitle = "Seu bairro, seus negócios" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try { setUser(JSON.parse(userData)); setIsLoggedIn(true) }
      catch (e) { console.error("Erro ao ler dados do usuário") }
    }
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("userType")
    setUser(null); setIsLoggedIn(false)
    window.location.href = "/"
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const navItems = [
    { href: "/",       label: "Início"  },
    { href: "/sobre",  label: "Sobre"   },
    { href: "/mapa",   label: "Mapa"    },
    { href: "/contato",label: "Contato" },
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: headerStyles }} />

      <header className={`hdr hdr-bar ${scrolled ? "scrolled" : ""}`}>
        <div className="hdr-inner">
          {/* LOGO */}
          <Link href="/" style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <Image src="/logo.png" alt="Logo Novo Tempo Conecta" width={160} height={44} priority />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hdr-nav">
            {navItems.map(item => (
              <Link key={item.href} href={item.href}
                className={`hdr-nav-link ${isActive(item.href) ? "active" : ""}`}>
                {item.label}
              </Link>
            ))}

            {/* ── ECONOMIA SOLIDÁRIA BUTTON ── */}
            <Link
              href="/empreendimento-solidario"
              className={`hdr-solidaria ${isActive("/empreendimento-solidario") ? "active" : ""}`}
            >
              <Sprout size={14} />
              Economia Solidária
            </Link>
          </nav>

          {/* DESKTOP AUTH */}
          <div className="hdr-auth">
            {!isMounted ? (
              <div style={{ width: 100 }} />
            ) : isLoggedIn ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="hdr-avatar-btn">
                    <Avatar style={{ width: 30, height: 30, border: "1.5px solid rgba(247,176,0,0.4)" }}>
                      <AvatarImage src={user?.avatar} alt={user?.name || "Usuário"} />
                      <AvatarFallback style={{ background: "#F7B000", color: "#002240", fontWeight: 700, fontSize: "0.8rem" }}>
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hdr-avatar-name">{user?.name?.split(" ")[0] || "Usuário"}</span>
                    <ChevronDown size={13} color="rgba(255,255,255,0.5)" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={10}
                  className="w-56 bg-[#001830] border-rgba(247,176,0,0.15) text-white"
                  style={{ zIndex: 999999 }}>
                  <DropdownMenuLabel>
                    <div className="font-semibold">{user?.name}</div>
                    <div className="text-xs text-[#F7B000] truncate">{user?.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild>
                    <Link href="/usuario/dashboard" className="hdr-dropdown-item"><User size={14} /> Meu Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/usuario/favoritos" className="hdr-dropdown-item"><Heart size={14} /> Favoritos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/usuario/avaliacoes" className="hdr-dropdown-item"><Star size={14} /> Minhas Avaliações</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild>
                    <Link href="/usuario/configuracoes" className="hdr-dropdown-item"><Settings size={14} /> Configurações</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="hdr-dropdown-item danger">
                    <LogOut size={14} /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login" className="hdr-btn-ghost">Entrar</Link>
                <Link href="/cadastro" className="hdr-btn-outline">Cidadão</Link>
                <Link href="/cadastro-emp" className="hdr-btn-primary">Negócio</Link>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button className="hdr-mobile-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="hdr-mobile">
            <nav className="hdr-mobile-nav">
              {navItems.map(item => (
                <Link key={item.href} href={item.href}
                  className={`hdr-mobile-link ${isActive(item.href) ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}

              {/* ── ECONOMIA SOLIDÁRIA (mobile) ── */}
              <Link
                href="/empreendimento-solidario"
                className={`hdr-mobile-solidaria ${isActive("/empreendimento-solidario") ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sprout size={16} />
                Economia Solidária
              </Link>
            </nav>

            <div className="hdr-mobile-divider" />

            <div className="hdr-mobile-actions">
              {isLoggedIn ? (
                <>
                  <div className="hdr-mobile-user">
                    <Avatar style={{ width: 36, height: 36 }}>
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-[#F7B000] text-[#002240]">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="hdr-mobile-user-name">{user?.name}</div>
                      <div className="hdr-mobile-user-email">{user?.email}</div>
                    </div>
                  </div>
                  <Link href="/usuario/dashboard" className="hdr-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                    Meu Perfil
                  </Link>
                  <button onClick={handleLogout} className="hdr-mobile-link text-red-400 border border-red-900/30">
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hdr-mobile-link border border-white/10 text-center" onClick={() => setMobileMenuOpen(false)}>
                    Entrar
                  </Link>
                  <Link href="/cadastro-emp" className="hdr-btn-primary block text-center" onClick={() => setMobileMenuOpen(false)}>
                    Cadastrar Negócio
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export default Header