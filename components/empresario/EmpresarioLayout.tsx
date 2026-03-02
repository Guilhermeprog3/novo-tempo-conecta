"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3, MessageSquare, Settings, Edit,
  Loader2, LogOut, Menu, MapPin, ChevronRight, X
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

const EMP_LAYOUT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.elayout {
  --navy: #002240;
  --gold: #F7B000;
  --cyan: #00CCFF;
  --sidebar-w: 260px;
  font-family: 'DM Sans', sans-serif;
  display: flex; height: 100vh; overflow: hidden;
}

/* ── SIDEBAR ───────────────────────────── */
.elayout-sidebar {
  width: var(--sidebar-w);
  background: var(--navy);
  border-right: 1px solid rgba(0,204,255,0.1);
  display: flex; flex-direction: column;
  height: 100vh; position: sticky; top: 0;
  flex-shrink: 0;
}
.elayout-sidebar-top {
  padding: 1.4rem 1.25rem 1.2rem;
  border-bottom: 1px solid rgba(0,204,255,0.1);
  display: flex; align-items: center; gap: 12px;
}
.elayout-biz-avatar {
  width: 40px; height: 40px; border-radius: 12px;
  background: rgba(0,204,255,0.15);
  border: 1.5px solid rgba(0,204,255,0.25);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-family: 'Syne', sans-serif;
  font-size: 0.9rem; font-weight: 800;
  color: var(--cyan); letter-spacing: -0.5px;
}
.elayout-biz-label {
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: rgba(0,204,255,0.5); margin-bottom: 2px;
}
.elayout-biz-name {
  font-family: 'Syne', sans-serif;
  font-size: 0.9rem; font-weight: 700;
  color: #fff; line-height: 1.2;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-width: 148px;
}

/* nav */
.elayout-nav {
  flex: 1; overflow-y: auto;
  padding: 1rem 0.75rem;
  display: flex; flex-direction: column; gap: 2px;
}
.elayout-nav-item {
  display: flex; align-items: center; gap: 11px;
  padding: 0.78rem 0.9rem;
  border-radius: 12px;
  font-size: 0.875rem; font-weight: 500;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  position: relative;
}
.elayout-nav-item:hover {
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.85);
}
.elayout-nav-item.active {
  background: rgba(0,204,255,0.1);
  color: #fff; font-weight: 600;
}
.elayout-nav-item.active::before {
  content: ''; position: absolute;
  left: 0; top: 6px; bottom: 6px;
  width: 3px; border-radius: 0 2px 2px 0;
  background: var(--gold);
}
.elayout-nav-icon-wrap {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
  flex-shrink: 0;
}
.elayout-nav-item:hover .elayout-nav-icon-wrap { background: rgba(0,204,255,0.08); }
.elayout-nav-item.active .elayout-nav-icon-wrap { background: rgba(247,176,0,0.12); }
.elayout-nav-arrow {
  margin-left: auto; opacity: 0;
  transition: opacity 0.15s;
}
.elayout-nav-item:hover .elayout-nav-arrow { opacity: 0.4; }

/* logout */
.elayout-sidebar-foot {
  padding: 0.75rem;
  border-top: 1px solid rgba(0,204,255,0.1);
}
.elayout-logout {
  width: 100%; display: flex; align-items: center; gap: 11px;
  padding: 0.78rem 0.9rem; border-radius: 12px;
  background: none; border: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem; font-weight: 500;
  color: rgba(255,100,100,0.7);
  transition: background 0.15s, color 0.15s;
}
.elayout-logout:hover { background: rgba(239,68,68,0.1); color: #ff8080; }

/* ── MAIN ──────────────────────────────── */
.elayout-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

/* header */
.elayout-header {
  height: 60px;
  background: var(--navy);
  border-bottom: 1px solid rgba(0,204,255,0.1);
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 1px 20px rgba(0,0,0,0.15);
  z-index: 10; position: relative;
}

.elayout-header-left { display: flex; align-items: center; gap: 12px; }

.elayout-mobile-btn {
  display: none; width: 36px; height: 36px;
  border-radius: 10px; background: rgba(255,255,255,0.06);
  border: 1px solid rgba(0,204,255,0.15);
  align-items: center; justify-content: center;
  cursor: pointer; color: rgba(255,255,255,0.7);
}

.elayout-header-title {
  font-family: 'Syne', sans-serif;
  font-size: 1rem; font-weight: 700;
  color: #fff;
}

.elayout-header-right { display: flex; align-items: center; gap: 12px; }

.elayout-header-biz {
  text-align: right; display: none;
}
.elayout-header-biz-label {
  font-size: 0.72rem; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: rgba(0,204,255,0.5);
}
.elayout-header-biz-name {
  font-family: 'Syne', sans-serif;
  font-size: 0.88rem; font-weight: 700; color: #fff;
}

.elayout-avatar-btn {
  width: 38px; height: 38px; border-radius: 12px;
  background: rgba(0,204,255,0.1);
  border: 1.5px solid rgba(0,204,255,0.25);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-family: 'Syne', sans-serif;
  font-size: 0.8rem; font-weight: 800;
  color: var(--cyan); letter-spacing: -0.5px;
  transition: background 0.15s, border-color 0.15s;
  position: relative;
}
.elayout-avatar-btn:hover { background: rgba(0,204,255,0.18); border-color: rgba(0,204,255,0.4); }

/* dropdown */
.elayout-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: #fff; border-radius: 16px;
  box-shadow: 0 16px 50px rgba(0,0,0,0.18);
  min-width: 200px; overflow: hidden;
  animation: elayout-pop 0.2s cubic-bezier(0.34,1.56,0.64,1);
  z-index: 100;
}
@keyframes elayout-pop { from{opacity:0;transform:scale(0.95) translateY(-6px)} to{opacity:1;transform:scale(1) translateY(0)} }
.elayout-dropdown-header {
  padding: 1rem 1.1rem 0.7rem;
  border-bottom: 1px solid #f0ece5;
}
.elayout-dropdown-biz {
  font-family: 'Syne', sans-serif;
  font-size: 0.9rem; font-weight: 700;
  color: var(--navy); margin-bottom: 1px;
}
.elayout-dropdown-role {
  font-size: 0.72rem; color: #8a9aaa;
}
.elayout-dropdown-item {
  display: flex; align-items: center; gap: 10px;
  padding: 0.75rem 1.1rem;
  font-size: 0.85rem; font-weight: 500;
  color: #3a4a5a; text-decoration: none;
  transition: background 0.12s;
  cursor: pointer; border: none; background: none;
  width: 100%; font-family: 'DM Sans', sans-serif;
}
.elayout-dropdown-item:hover { background: #faf8f5; }
.elayout-dropdown-item.danger { color: #dc2626; }
.elayout-dropdown-item.danger:hover { background: rgba(239,68,68,0.05); }
.elayout-dropdown-sep { height: 1px; background: #f0ece5; }

/* ── CONTENT ───────────────────────────── */
.elayout-content {
  flex: 1; overflow-y: auto;
  background: #F4F1EC;
  padding: 2rem 1.5rem;
}
.elayout-content-inner {
  max-width: 1100px; margin: 0 auto;
  animation: elayout-fade 0.35s ease;
}
@keyframes elayout-fade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* ── MOBILE DRAWER ─────────────────────── */
.elayout-overlay {
  display: none; position: fixed; inset: 0;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
  z-index: 50; animation: elayout-fade 0.2s ease;
}
.elayout-drawer {
  position: fixed; left: 0; top: 0; bottom: 0;
  width: min(280px, 90vw);
  background: var(--navy);
  border-right: 1px solid rgba(0,204,255,0.15);
  display: flex; flex-direction: column;
  z-index: 51;
  animation: elayout-slide-in 0.25s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes elayout-slide-in { from{transform:translateX(-100%)} to{transform:translateX(0)} }
.elayout-drawer-close {
  position: absolute; top: 1rem; right: 1rem;
  width: 32px; height: 32px; border-radius: 9px;
  background: rgba(255,255,255,0.08); border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: rgba(255,255,255,0.5);
  transition: background 0.15s, color 0.15s;
}
.elayout-drawer-close:hover { background: rgba(255,255,255,0.14); color: #fff; }

/* loading */
.elayout-loading {
  min-height: 100vh; display: flex;
  align-items: center; justify-content: center;
  background: var(--navy);
}
@keyframes elayout-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

@media (max-width: 768px) {
  .elayout-sidebar { display: none; }
  .elayout-mobile-btn { display: flex; }
  .elayout-header-biz { display: block; }
}
@media (min-width: 769px) {
  .elayout-overlay, .elayout-drawer { display: none !important; }
}
@media (min-width: 900px) {
  .elayout-header-biz { display: block; }
}
`;

type BusinessSidebarData = { businessName: string };

const NAV_LINKS = [
  { href: "/empresario/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/empresario/perfil", label: "Editar Perfil", icon: Edit },
  { href: "/empresario/avaliacoes", label: "Avaliações", icon: MessageSquare },
  { href: "/empresario/configuracoes", label: "Configurações", icon: Settings },
];

function getInitials(name = "") {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??';
}

function NavLink({ href, label, icon: Icon, isActive, onClick }: {
  href: string; label: string; icon: any; isActive: boolean; onClick?: () => void
}) {
  const iconColor = isActive ? "#F7B000" : "rgba(255,255,255,0.5)";
  return (
    <Link href={href} className={`elayout-nav-item${isActive ? " active" : ""}`} onClick={onClick}>
      <div className="elayout-nav-icon-wrap">
        <Icon size={16} color={iconColor} />
      </div>
      {label}
      <ChevronRight size={13} className="elayout-nav-arrow" />
    </Link>
  );
}

export function EmpresarioLayout({ children }: { children: React.ReactNode }) {
  const [bizData, setBizData] = useState<BusinessSidebarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  const currentPage = NAV_LINKS.find(l => l.href === pathname)?.label || "Painel";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "businesses", user.uid));
        if (snap.exists()) setBizData(snap.data() as BusinessSidebarData);
      } else {
        window.location.href = '/empresario/login';
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try { await signOut(auth); window.location.href = '/'; }
    catch (e) { console.error(e); }
  };

  const initials = getInitials(bizData?.businessName);

  if (loading) return (
    <>
      <style>{EMP_LAYOUT_CSS}</style>
      <div className="elayout-loading">
        <Loader2 style={{ width: 44, height: 44, color: "#00CCFF", animation: "elayout-spin 1s linear infinite" }} />
      </div>
    </>
  );

  const SidebarContent = ({ onNavClick }: { onNavClick?: () => void }) => (
    <>
      <div className="elayout-sidebar-top">
        <div className="elayout-biz-avatar">{initials}</div>
        <div style={{ overflow: "hidden" }}>
          <div className="elayout-biz-label">Painel do Negócio</div>
          <div className="elayout-biz-name">{bizData?.businessName || "Carregando..."}</div>
        </div>
      </div>

      <nav className="elayout-nav">
        {NAV_LINKS.map(link => (
          <NavLink
            key={link.href}
            {...link}
            isActive={pathname === link.href}
            onClick={onNavClick}
          />
        ))}
      </nav>

      <div className="elayout-sidebar-foot">
        <button className="elayout-logout" onClick={handleLogout}>
          <LogOut size={16} />
          Sair da Conta
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{EMP_LAYOUT_CSS}</style>
      <div className="elayout">

        {/* SIDEBAR DESKTOP */}
        <aside className="elayout-sidebar">
          <SidebarContent />
        </aside>

        {/* MOBILE DRAWER */}
        {drawerOpen && (
          <>
            <div className="elayout-overlay" onClick={() => setDrawerOpen(false)} />
            <div className="elayout-drawer">
              <button className="elayout-drawer-close" onClick={() => setDrawerOpen(false)}>
                <X size={16} />
              </button>
              <SidebarContent onNavClick={() => setDrawerOpen(false)} />
            </div>
          </>
        )}

        {/* MAIN */}
        <div className="elayout-main">

          {/* HEADER */}
          <header className="elayout-header">
            <div className="elayout-header-left">
              <button className="elayout-mobile-btn" onClick={() => setDrawerOpen(true)}>
                <Menu size={18} />
              </button>
              <Link href="/empresario/dashboard" style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none" }}>
                <MapPin size={18} color="#F7B000" />
                <span className="elayout-header-title">{currentPage}</span>
              </Link>
            </div>

            <div className="elayout-header-right">
              <div className="elayout-header-biz">
                <div className="elayout-header-biz-label">Logado como</div>
                <div className="elayout-header-biz-name">{bizData?.businessName}</div>
              </div>

              <div style={{ position: "relative" }}>
                <div className="elayout-avatar-btn"
                  onClick={() => setDropdownOpen(p => !p)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}>
                  {initials}
                </div>

                {dropdownOpen && (
                  <div className="elayout-dropdown">
                    <div className="elayout-dropdown-header">
                      <div className="elayout-dropdown-biz">{bizData?.businessName}</div>
                      <div className="elayout-dropdown-role">Empresário</div>
                    </div>
                    <Link href="/empresario/configuracoes" className="elayout-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <Settings size={14} /> Configurações
                    </Link>
                    <div className="elayout-dropdown-sep" />
                    <button className="elayout-dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={14} /> Sair da conta
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="elayout-content">
            <div className="elayout-content-inner">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}