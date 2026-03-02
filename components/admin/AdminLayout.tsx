"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users, Building2, Star, LogOut, Menu, MapPin,
  Settings, LayoutDashboard, ChevronRight, X, Bell, Shield
} from "lucide-react"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

const ADM_LAYOUT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.admlayout {
  --navy: #002240;
  --navy-light: #003060;
  --gold: #F7B000;
  --cyan: #00CCFF;
  --bg: #F4F1EC;
  --sidebar-w: 260px;
  font-family: 'DM Sans', sans-serif;
  display: flex; height: 100vh; overflow: hidden;
}

/* ── SIDEBAR ───────────────────────────── */
.adml-sidebar {
  width: var(--sidebar-w);
  background: var(--navy);
  border-right: 1px solid rgba(0,204,255,0.1);
  display: flex; flex-direction: column;
  height: 100vh; flex-shrink: 0;
  position: relative;
}

/* subtle gradient overlay */
.adml-sidebar::before {
  content: ''; position: absolute;
  top: 0; left: 0; right: 0; height: 260px;
  background: linear-gradient(180deg, rgba(0,204,255,0.04) 0%, transparent 100%);
  pointer-events: none;
}

.adml-sidebar-brand {
  padding: 0 1.25rem;
  height: 64px;
  border-bottom: 1px solid rgba(0,204,255,0.1);
  display: flex; align-items: center; gap: 10px;
  flex-shrink: 0; position: relative; z-index: 1;
}
.adml-brand-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, var(--gold), #ffc82c);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(247,176,0,0.3);
}
.adml-brand-title {
  font-family: 'Syne', sans-serif;
  font-size: 0.92rem; font-weight: 800;
  color: #fff; line-height: 1.1;
}
.adml-brand-sub {
  font-size: 0.65rem; color: rgba(0,204,255,0.5);
  font-weight: 600; letter-spacing: 0.06em;
}

/* nav section */
.adml-nav-section {
  padding: 1.25rem 0.75rem 0.25rem;
}
.adml-nav-section-label {
  font-size: 0.62rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(255,255,255,0.2);
  padding: 0 0.75rem; margin-bottom: 0.4rem;
}

.adml-nav { flex: 1; overflow-y: auto; }

.adml-nav-item {
  display: flex; align-items: center; gap: 11px;
  padding: 0.78rem 0.9rem;
  border-radius: 12px;
  font-size: 0.875rem; font-weight: 500;
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  position: relative; margin-bottom: 2px;
}
.adml-nav-item:hover {
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.85);
}
.adml-nav-item.active {
  background: rgba(0,204,255,0.1);
  color: #fff; font-weight: 600;
}
.adml-nav-item.active::before {
  content: ''; position: absolute;
  left: 0; top: 7px; bottom: 7px;
  width: 3px; border-radius: 0 2px 2px 0;
  background: var(--gold);
}
.adml-nav-icon {
  width: 32px; height: 32px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s; flex-shrink: 0;
}
.adml-nav-item:hover .adml-nav-icon { background: rgba(0,204,255,0.08); }
.adml-nav-item.active .adml-nav-icon { background: rgba(247,176,0,0.12); }
.adml-nav-chevron { margin-left: auto; opacity: 0; transition: opacity 0.15s; }
.adml-nav-item:hover .adml-nav-chevron { opacity: 0.4; }
.adml-nav-item.active .adml-nav-chevron { opacity: 0; }

/* sidebar footer */
.adml-sidebar-foot {
  padding: 0.75rem;
  border-top: 1px solid rgba(0,204,255,0.1);
  flex-shrink: 0;
}
.adml-logout {
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 0.78rem 0.9rem; border-radius: 12px;
  background: none; border: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem; font-weight: 500;
  color: rgba(255,100,100,0.6);
  transition: background 0.15s, color 0.15s;
}
.adml-logout:hover { background: rgba(239,68,68,0.1); color: #ff8080; }

/* ── MAIN ──────────────────────────────── */
.adml-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

/* header */
.adml-header {
  height: 64px;
  background: var(--navy);
  border-bottom: 1px solid rgba(0,204,255,0.1);
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem; flex-shrink: 0;
  box-shadow: 0 2px 20px rgba(0,0,0,0.15);
  z-index: 10; position: relative;
}

.adml-header-left { display: flex; align-items: center; gap: 14px; }
.adml-mobile-btn {
  display: none;
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(0,204,255,0.15);
  align-items: center; justify-content: center;
  cursor: pointer; color: rgba(255,255,255,0.6);
  transition: background 0.15s, color 0.15s;
}
.adml-mobile-btn:hover { background: rgba(0,204,255,0.1); color: #00CCFF; }

.adml-header-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.05rem; font-weight: 700;
  color: #fff;
}
.adml-header-breadcrumb {
  display: flex; align-items: center; gap: 7px;
  font-size: 0.72rem; color: rgba(0,204,255,0.45);
}
.adml-header-breadcrumb-sep { color: rgba(255,255,255,0.15); }

.adml-header-right { display: flex; align-items: center; gap: 10px; }

/* notification btn */
.adml-notif-btn {
  width: 38px; height: 38px; border-radius: 11px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(0,204,255,0.12);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: rgba(255,255,255,0.45);
  transition: background 0.15s, color 0.15s;
}
.adml-notif-btn:hover { background: rgba(0,204,255,0.1); color: #00CCFF; }

/* admin avatar */
.adml-admin-pill {
  display: flex; align-items: center; gap: 10px;
  padding: 5px 12px 5px 6px;
  background: rgba(255,255,255,0.06);
  border: 1.5px solid rgba(0,204,255,0.15);
  border-radius: 12px; cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  position: relative;
}
.adml-admin-pill:hover { background: rgba(0,204,255,0.1); border-color: rgba(0,204,255,0.3); }
.adml-admin-avatar {
  width: 32px; height: 32px; border-radius: 9px;
  background: linear-gradient(135deg, var(--cyan), #0099cc);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif;
  font-size: 0.8rem; font-weight: 800;
  color: var(--navy); flex-shrink: 0;
}
.adml-admin-info { display: none; }
.adml-admin-name {
  font-family: 'Syne', sans-serif;
  font-size: 0.85rem; font-weight: 700; color: #fff;
  line-height: 1; margin-bottom: 1px;
}
.adml-admin-role {
  font-size: 0.68rem; color: rgba(0,204,255,0.55);
  font-weight: 600;
}

/* dropdown */
.adml-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: #fff; border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  min-width: 200px; overflow: hidden;
  animation: adml-pop 0.2s cubic-bezier(0.34,1.56,0.64,1);
  z-index: 100;
}
@keyframes adml-pop { from{opacity:0;transform:scale(0.95) translateY(-6px)} to{opacity:1;transform:scale(1) translateY(0)} }
.adml-dropdown-head {
  padding: 1rem 1.1rem 0.8rem;
  border-bottom: 1px solid #f0ece5;
  display: flex; align-items: center; gap: 10px;
}
.adml-dropdown-head-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, #00CCFF, #0099cc);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif;
  font-size: 0.82rem; font-weight: 800; color: var(--navy);
  flex-shrink: 0;
}
.adml-dropdown-name {
  font-family: 'Syne', sans-serif;
  font-size: 0.9rem; font-weight: 700;
  color: var(--navy);
}
.adml-dropdown-role { font-size: 0.72rem; color: #8a9aaa; }

.adml-dropdown-item {
  display: flex; align-items: center; gap: 9px;
  padding: 0.75rem 1.1rem;
  font-size: 0.85rem; font-weight: 500;
  color: #3a4a5a; text-decoration: none;
  transition: background 0.12s; cursor: pointer;
  border: none; background: none;
  width: 100%; font-family: 'DM Sans', sans-serif;
}
.adml-dropdown-item:hover { background: #faf8f5; }
.adml-dropdown-item.danger { color: #dc2626; }
.adml-dropdown-item.danger:hover { background: rgba(239,68,68,0.05); }
.adml-dropdown-sep { height: 1px; background: #f0ece5; }

/* ── CONTENT ───────────────────────────── */
.adml-content {
  flex: 1; overflow-y: auto;
  background: #F4F1EC;
  padding: 2rem 1.5rem;
}
.adml-content-inner {
  max-width: 1300px; margin: 0 auto;
  animation: adml-fade 0.35s ease;
}
@keyframes adml-fade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* ── MOBILE OVERLAY ────────────────────── */
.adml-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.65); backdrop-filter: blur(4px);
  z-index: 40; animation: adml-fade 0.2s ease;
}
.adml-drawer {
  position: fixed; left: 0; top: 0; bottom: 0;
  width: min(280px, 88vw);
  background: var(--navy);
  border-right: 1px solid rgba(0,204,255,0.15);
  display: flex; flex-direction: column;
  z-index: 41;
  animation: adml-drawer-in 0.25s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes adml-drawer-in { from{transform:translateX(-100%)} to{transform:translateX(0)} }
.adml-drawer-close {
  position: absolute; top: 1rem; right: 1rem;
  width: 32px; height: 32px; border-radius: 9px;
  background: rgba(255,255,255,0.08); border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: rgba(255,255,255,0.5);
  transition: background 0.15s, color 0.15s;
}
.adml-drawer-close:hover { background: rgba(255,255,255,0.14); color: #fff; }

@media (max-width: 768px) {
  .adml-sidebar { display: none; }
  .adml-mobile-btn { display: flex; }
}
@media (min-width: 900px) {
  .adml-admin-info { display: block; }
}
@media (min-width: 769px) {
  .adml-overlay, .adml-drawer { display: none !important; }
}
`;

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Visão Geral", icon: LayoutDashboard, section: "PRINCIPAL" },
  { href: "/admin/usuarios", label: "Usuários", icon: Users, section: "GESTÃO" },
  { href: "/admin/empresas", label: "Empresas", icon: Building2, section: "GESTÃO" },
  { href: "/admin/destaques", label: "Destaques Home", icon: Star, section: "GESTÃO" },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings, section: "SISTEMA" },
];

function AdminNavLink({ href, label, icon: Icon, isActive, onClick }: {
  href: string; label: string; icon: any; isActive: boolean; onClick?: () => void
}) {
  const iconColor = isActive ? "#F7B000" : "rgba(255,255,255,0.45)";
  return (
    <Link href={href} className={`adml-nav-item${isActive ? " active" : ""}`} onClick={onClick}>
      <div className="adml-nav-icon">
        <Icon size={16} color={iconColor} />
      </div>
      {label}
      <ChevronRight size={13} className="adml-nav-chevron" />
    </Link>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentPage = NAV_LINKS.find(l => l.href === pathname)?.label || "Painel";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      window.location.href = '/login';
    } catch (e) { console.error(e); }
  };

  // Group by section
  const sections = Array.from(new Set(NAV_LINKS.map(l => l.section)));

  const SidebarContent = ({ onNavClick }: { onNavClick?: () => void }) => (
    <>
      <div className="adml-sidebar-brand">
        <div className="adml-brand-icon">
          <MapPin size={18} color="#002240" strokeWidth={2.5} />
        </div>
        <div>
          <div className="adml-brand-title">Novo Tempo</div>
          <div className="adml-brand-sub">Painel Admin</div>
        </div>
      </div>

      <div className="adml-nav">
        {sections.map(section => {
          const links = NAV_LINKS.filter(l => l.section === section);
          return (
            <div key={section} className="adml-nav-section">
              <div className="adml-nav-section-label">{section}</div>
              {links.map(link => (
                <AdminNavLink
                  key={link.href}
                  {...link}
                  isActive={pathname === link.href}
                  onClick={onNavClick}
                />
              ))}
            </div>
          );
        })}
      </div>

      <div className="adml-sidebar-foot">
        <button className="adml-logout" onClick={handleLogout}>
          <LogOut size={16} /> Sair da Conta
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{ADM_LAYOUT_CSS}</style>
      <div className="admlayout">

        {/* SIDEBAR DESKTOP */}
        <aside className="adml-sidebar">
          <SidebarContent />
        </aside>

        {/* MOBILE DRAWER */}
        {drawerOpen && (
          <>
            <div className="adml-overlay" onClick={() => setDrawerOpen(false)} />
            <div className="adml-drawer">
              <button className="adml-drawer-close" onClick={() => setDrawerOpen(false)}>
                <X size={16} />
              </button>
              <SidebarContent onNavClick={() => setDrawerOpen(false)} />
            </div>
          </>
        )}

        {/* MAIN AREA */}
        <div className="adml-main">

          {/* HEADER */}
          <header className="adml-header">
            <div className="adml-header-left">
              <button className="adml-mobile-btn" onClick={() => setDrawerOpen(true)}>
                <Menu size={18} />
              </button>
              <div>
                <div className="adml-header-title">{currentPage}</div>
                <div className="adml-header-breadcrumb">
                  <span>Admin</span>
                  <span className="adml-header-breadcrumb-sep">/</span>
                  <span>{currentPage}</span>
                </div>
              </div>
            </div>

            <div className="adml-header-right">
              <button className="adml-notif-btn" title="Notificações">
                <Bell size={16} />
              </button>

              <div
                className="adml-admin-pill"
                onClick={() => setDropdownOpen(p => !p)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                tabIndex={0}
              >
                <div className="adml-admin-avatar">AD</div>
                <div className="adml-admin-info">
                  <div className="adml-admin-name">Administrador</div>
                  <div className="adml-admin-role">Gestão Geral</div>
                </div>

                {dropdownOpen && (
                  <div className="adml-dropdown">
                    <div className="adml-dropdown-head">
                      <div className="adml-dropdown-head-icon">AD</div>
                      <div>
                        <div className="adml-dropdown-name">Administrador</div>
                        <div className="adml-dropdown-role">Gestão Geral</div>
                      </div>
                    </div>
                    <Link href="/admin/configuracoes" className="adml-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <Settings size={14} /> Configurações
                    </Link>
                    <Link href="/admin/dashboard" className="adml-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <Shield size={14} /> Painel Admin
                    </Link>
                    <div className="adml-dropdown-sep" />
                    <button className="adml-dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={14} /> Sair da Conta
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="adml-content">
            <div className="adml-content-inner">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}