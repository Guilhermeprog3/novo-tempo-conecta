"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Shield, Eye, Mail, Save, Edit3, Star, Heart, ArrowRight, Lock, AlertTriangle } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CFG_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.cfg {
  --navy: #002240;
  --gold: #F7B000;
  --cyan: #00CCFF;
  --bg: #F4F1EC;
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  min-height: 100vh;
}

.cfg-hero {
  background: var(--navy);
  padding: 2.5rem 1.5rem 5rem;
  position: relative; overflow: hidden;
}
.cfg-hero-orb1 {
  position: absolute; border-radius: 50%; pointer-events: none;
  width: 500px; height: 500px;
  background: var(--cyan); opacity: 0.07; filter: blur(90px);
  top: -180px; right: -100px;
}
.cfg-hero-orb2 {
  position: absolute; border-radius: 50%; pointer-events: none;
  width: 350px; height: 350px;
  background: var(--gold); opacity: 0.08; filter: blur(80px);
  bottom: -140px; left: -60px;
}
.cfg-hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 56px 56px;
}
.cfg-hero-inner {
  max-width: 1000px; margin: 0 auto;
  position: relative; z-index: 1;
}
.cfg-hero-eyebrow {
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(0,204,255,0.7); margin-bottom: 6px;
}
.cfg-hero-title {
  font-family: 'Syne', sans-serif;
  font-size: 2rem; font-weight: 800;
  color: #fff; margin-bottom: 4px;
}
.cfg-hero-sub { font-size: 0.875rem; color: rgba(255,255,255,0.5); font-weight: 300; }

/* ── BODY ──────────────────────────────────── */
.cfg-body {
  max-width: 1000px;
  margin: -3rem auto 0;
  padding: 0 1.5rem 4rem;
  position: relative; z-index: 10;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.5rem;
  align-items: start;
}

/* ── CARDS ─────────────────────────────────── */
.cfg-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 20px rgba(0,34,64,0.07);
  overflow: hidden;
  margin-bottom: 1.5rem;
}
.cfg-card:last-child { margin-bottom: 0; }

.cfg-card-header {
  padding: 1.3rem 1.6rem;
  border-bottom: 1px solid #f0ece5;
  display: flex; align-items: center; gap: 12px;
}
.cfg-card-icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.cfg-card-title {
  font-family: 'Syne', sans-serif;
  font-size: 0.97rem; font-weight: 700;
  color: var(--navy);
}
.cfg-card-sub { font-size: 0.75rem; color: #8a9aaa; margin-top: 2px; }

/* ── TOGGLE ROWS ───────────────────────────── */
.cfg-toggle-row {
  display: flex; align-items: center;
  justify-content: space-between; gap: 1rem;
  padding: 1.1rem 1.6rem;
  border-bottom: 1px solid #f8f6f2;
}
.cfg-toggle-row:last-child { border-bottom: none; }
.cfg-toggle-label {
  font-size: 0.9rem; font-weight: 500;
  color: var(--navy); margin-bottom: 2px;
}
.cfg-toggle-desc { font-size: 0.75rem; color: #8a9aaa; }

/* Custom toggle */
.cfg-switch {
  position: relative; width: 44px; height: 24px;
  flex-shrink: 0; cursor: pointer;
}
.cfg-switch input { opacity: 0; width: 0; height: 0; }
.cfg-switch-track {
  position: absolute; inset: 0;
  background: #e0dbd2; border-radius: 100px;
  transition: background 0.2s;
}
.cfg-switch input:checked + .cfg-switch-track { background: var(--cyan); }
.cfg-switch-thumb {
  position: absolute;
  width: 18px; height: 18px;
  border-radius: 50%; background: #fff;
  top: 3px; left: 3px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
.cfg-switch input:checked ~ .cfg-switch-thumb { transform: translateX(20px); }

/* Section label inside card */
.cfg-section-label {
  padding: 0.9rem 1.6rem 0.5rem;
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: #b0bec5;
  display: flex; align-items: center; gap: 6px;
}

/* ── SAVE BUTTON ───────────────────────────── */
.cfg-save-wrap {
  display: flex; justify-content: flex-end;
  padding: 0 0 2rem;
}
.cfg-save-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 24px; border-radius: 13px;
  background: var(--navy); color: var(--cyan);
  font-family: 'Syne', sans-serif;
  font-size: 0.9rem; font-weight: 700;
  border: 1.5px solid rgba(0,204,255,0.25);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(0,34,64,0.2);
}
.cfg-save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,34,64,0.3);
}

/* ── INFO BOX ──────────────────────────────── */
.cfg-info-box {
  background: rgba(0,204,255,0.06);
  border: 1px solid rgba(0,204,255,0.15);
  border-radius: 14px; padding: 1rem 1.2rem;
  display: flex; align-items: flex-start; gap: 10px;
}
.cfg-info-box-title {
  font-size: 0.82rem; font-weight: 600;
  color: var(--navy); margin-bottom: 3px;
}
.cfg-info-box-desc { font-size: 0.75rem; color: #5a6878; line-height: 1.5; }

/* ── SIDEBAR ───────────────────────────────── */
.cfg-nav-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 20px rgba(0,34,64,0.07);
  overflow: hidden;
  margin-bottom: 1.25rem;
}
.cfg-nav-header {
  background: #faf8f5;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f0ece5;
  font-family: 'Syne', sans-serif;
  font-size: 0.85rem; font-weight: 700;
  color: var(--navy);
}
.cfg-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 0.85rem 1.25rem;
  font-size: 0.875rem; font-weight: 500;
  color: #5a6878; text-decoration: none;
  border-bottom: 1px solid #f8f6f2;
  transition: background 0.15s, color 0.15s;
}
.cfg-nav-item:last-child { border-bottom: none; }
.cfg-nav-item:hover { background: rgba(0,204,255,0.06); color: var(--navy); }
.cfg-nav-item.active {
  background: rgba(0,204,255,0.08);
  color: var(--navy); font-weight: 600;
}
.cfg-nav-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--cyan); margin-left: auto; flex-shrink: 0;
}
.cfg-promo-card {
  background: var(--navy);
  border-radius: 20px; padding: 1.4rem;
  position: relative; overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,34,64,0.2);
}
.cfg-promo-orb {
  position: absolute; top: -10px; right: -10px;
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--gold); opacity: 0.2; filter: blur(20px);
}
.cfg-promo-title {
  font-family: 'Syne', sans-serif;
  font-size: 1rem; font-weight: 700;
  color: #fff; margin-bottom: 6px; position: relative; z-index: 1;
}
.cfg-promo-text {
  font-size: 0.8rem; color: rgba(255,255,255,0.6);
  line-height: 1.6; margin-bottom: 1rem; position: relative; z-index: 1;
}
.cfg-promo-btn {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  width: 100%; padding: 10px;
  background: var(--gold); color: var(--navy);
  border: none; border-radius: 12px;
  font-family: 'Syne', sans-serif;
  font-size: 0.82rem; font-weight: 700;
  cursor: pointer; text-decoration: none;
  transition: transform 0.2s; position: relative; z-index: 1;
}
.cfg-promo-btn:hover { transform: translateY(-2px); }

@media (max-width: 768px) {
  .cfg-body { grid-template-columns: 1fr; margin-top: -1.5rem; }
}
`;

// Custom Switch Component
function Toggle({ id, checked, onChange }: { id: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="cfg-switch" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className="cfg-switch-track" />
      <div className="cfg-switch-thumb" />
    </label>
  );
}

export default function UsuarioConfiguracoes() {
  const [notifications, setNotifications] = useState({
    emailReviews: true, emailPromotions: false, pushReviews: true, pushPromotions: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true, showEmail: false, showPhone: false, allowMessages: true,
  });

  const notifRows = [
    { id: "emailReviews", label: "Respostas às minhas avaliações", desc: "Seja notificado quando um estabelecimento responder.", key: "emailReviews" as const },
    { id: "emailPromotions", label: "Novidades e Destaques", desc: "Receba notícias sobre novos locais no bairro.", key: "emailPromotions" as const },
  ];

  const privacyRows = [
    { id: "profileVisible", label: "Perfil Público", desc: "Permitir que outros usuários vejam suas avaliações.", key: "profileVisible" as const },
    { id: "showEmail", label: "Mostrar E-mail", desc: "Exibir seu e-mail no perfil público.", key: "showEmail" as const },
  ];

  const navItems = [
    { href: "/usuario/dashboard", label: "Meu Perfil", icon: <Edit3 size={16} /> },
    { href: "/usuario/avaliacoes", label: "Minhas Avaliações", icon: <Star size={16} color="#F7B000" /> },
    { href: "/usuario/favoritos", label: "Locais Favoritos", icon: <Heart size={16} color="#ef4444" /> },
    { href: "/usuario/configuracoes", label: "Configurações", icon: <Shield size={16} />, active: true },
  ];

  return (
    <>
      <style>{CFG_CSS}</style>
      <div className="cfg">
        <Header />

        <div className="cfg-hero">
          <div className="cfg-hero-orb1" /><div className="cfg-hero-orb2" /><div className="cfg-hero-grid" />
          <div className="cfg-hero-inner">
            <div className="cfg-hero-eyebrow">Área do Usuário</div>
            <div className="cfg-hero-title">Configurações</div>
            <div className="cfg-hero-sub">Personalize sua experiência na plataforma</div>
          </div>
        </div>

        <div className="cfg-body">

          {/* MAIN */}
          <div>
            {/* NOTIFICAÇÕES */}
            <div className="cfg-card">
              <div className="cfg-card-header">
                <div className="cfg-card-icon" style={{ background: "rgba(0,204,255,0.1)" }}>
                  <Bell size={17} color="#00CCFF" />
                </div>
                <div>
                  <div className="cfg-card-title">Notificações</div>
                  <div className="cfg-card-sub">Controle o que você recebe por e-mail</div>
                </div>
              </div>

              <div className="cfg-section-label">
                <Mail size={11} /> Por E-mail
              </div>

              {notifRows.map(row => (
                <div key={row.id} className="cfg-toggle-row">
                  <div>
                    <div className="cfg-toggle-label">{row.label}</div>
                    <div className="cfg-toggle-desc">{row.desc}</div>
                  </div>
                  <Toggle id={row.id} checked={notifications[row.key]} onChange={v => setNotifications(p => ({ ...p, [row.key]: v }))} />
                </div>
              ))}
            </div>

            {/* PRIVACIDADE */}
            <div className="cfg-card">
              <div className="cfg-card-header">
                <div className="cfg-card-icon" style={{ background: "rgba(247,176,0,0.1)" }}>
                  <Eye size={17} color="#F7B000" />
                </div>
                <div>
                  <div className="cfg-card-title">Privacidade</div>
                  <div className="cfg-card-sub">Gerencie a visibilidade das suas informações</div>
                </div>
              </div>

              {privacyRows.map(row => (
                <div key={row.id} className="cfg-toggle-row">
                  <div>
                    <div className="cfg-toggle-label">{row.label}</div>
                    <div className="cfg-toggle-desc">{row.desc}</div>
                  </div>
                  <Toggle id={row.id} checked={privacy[row.key]} onChange={v => setPrivacy(p => ({ ...p, [row.key]: v }))} />
                </div>
              ))}
            </div>

            <div className="cfg-save-wrap">
              <button className="cfg-save-btn">
                <Save size={16} /> Salvar Alterações
              </button>
            </div>
          </div>

          {/* SIDEBAR */}
          <div>
            <div className="cfg-nav-card">
              <div className="cfg-nav-header">Navegação</div>
              {navItems.map(item => (
                <Link key={item.href} href={item.href} className={`cfg-nav-item${item.active ? " active" : ""}`}>
                  {item.icon}
                  {item.label}
                  {item.active && <div className="cfg-nav-dot" />}
                </Link>
              ))}
            </div>

            <div className="cfg-info-box" style={{ marginBottom: "1.25rem" }}>
              <Shield size={18} color="#00CCFF" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div className="cfg-info-box-title">Segurança da Conta</div>
                <div className="cfg-info-box-desc">Nunca compartilhamos seus dados pessoais com terceiros sem sua permissão.</div>
              </div>
            </div>

            <div className="cfg-promo-card">
              <div className="cfg-promo-orb" />
              <div className="cfg-promo-title">Descubra Novos Lugares</div>
              <div className="cfg-promo-text">Explore o bairro e encontre os melhores estabelecimentos perto de você.</div>
              <Link href="/busca" className="cfg-promo-btn">
                Ir para o Mapa <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}