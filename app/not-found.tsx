"use client"

import { Home, Search, MapPin, Compass, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/navigation/header"

const NF_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.nf {
  --navy: #002240;
  --gold: #F7B000;
  --cyan: #00CCFF;
  --bg: #F4F1EC;
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  background: var(--navy);
  display: flex;
  flex-direction: column;
}

/* ── BACKGROUND ────────────────────────── */
.nf-bg {
  position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0;
}
.nf-orb1 {
  position: absolute; border-radius: 50%;
  width: 700px; height: 700px;
  background: var(--cyan); opacity: 0.055; filter: blur(120px);
  top: -200px; right: -200px;
}
.nf-orb2 {
  position: absolute; border-radius: 50%;
  width: 500px; height: 500px;
  background: var(--gold); opacity: 0.06; filter: blur(100px);
  bottom: -150px; left: -150px;
}
.nf-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ── CONTENT ───────────────────────────── */
.nf-content {
  flex: 1; display: flex;
  align-items: center; justify-content: center;
  padding: 3rem 1.5rem;
  position: relative; z-index: 1;
}

.nf-card {
  width: 100%; max-width: 460px;
  text-align: center;
}

/* 404 number */
.nf-number {
  font-family: 'Syne', sans-serif;
  font-size: clamp(7rem, 20vw, 11rem);
  font-weight: 800; line-height: 1;
  color: transparent;
  -webkit-text-stroke: 2px rgba(0,204,255,0.25);
  letter-spacing: -4px;
  margin-bottom: -1rem;
  position: relative;
  animation: nf-float 4s ease-in-out infinite;
}
@keyframes nf-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.nf-icon-wrap {
  width: 80px; height: 80px; border-radius: 50%;
  background: rgba(0,204,255,0.08);
  border: 1.5px solid rgba(0,204,255,0.2);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.5rem;
  animation: nf-pulse 3s ease-in-out infinite;
}
@keyframes nf-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,204,255,0.12); }
  50% { box-shadow: 0 0 0 14px rgba(0,204,255,0); }
}

.nf-eyebrow {
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: rgba(0,204,255,0.6); margin-bottom: 0.7rem;
}

.nf-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  font-weight: 800; color: #fff;
  line-height: 1.1; margin-bottom: 0.9rem;
}

.nf-desc {
  font-size: 0.92rem; color: rgba(255,255,255,0.45);
  line-height: 1.7; max-width: 320px; margin: 0 auto 2.5rem;
  font-weight: 300;
}

/* ── BUTTONS ───────────────────────────── */
.nf-btns {
  display: flex; flex-direction: column; gap: 10px;
  max-width: 320px; margin: 0 auto;
}

.nf-btn {
  display: flex; align-items: center; justify-content: center;
  gap: 9px; padding: 14px 24px;
  border-radius: 14px; text-decoration: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem; font-weight: 700;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
  border: none; cursor: pointer;
}
.nf-btn:hover { transform: translateY(-3px); }
.nf-btn-primary {
  background: var(--gold); color: var(--navy);
  box-shadow: 0 6px 24px rgba(247,176,0,0.3);
}
.nf-btn-primary:hover { box-shadow: 0 12px 34px rgba(247,176,0,0.4); }
.nf-btn-outline {
  background: rgba(255,255,255,0.06);
  border: 1.5px solid rgba(255,255,255,0.12) !important;
  color: rgba(255,255,255,0.75);
}
.nf-btn-outline:hover { background: rgba(255,255,255,0.1); }
.nf-btn-arrow { margin-left: auto; opacity: 0.5; transition: opacity 0.15s, margin 0.2s; }
.nf-btn:hover .nf-btn-arrow { opacity: 1; margin-left: 4px; }

/* divider */
.nf-divider {
  display: flex; align-items: center; gap: 12px;
  margin: 0.5rem 0;
}
.nf-divider-line {
  flex: 1; height: 1px; background: rgba(255,255,255,0.08);
}
.nf-divider-text {
  font-size: 0.72rem; color: rgba(255,255,255,0.25);
  text-transform: uppercase; letter-spacing: 0.1em;
}
`;

export default function NotFound() {
  return (
    <>
      <style>{NF_CSS}</style>
      <div className="nf">
        <div className="nf-bg">
          <div className="nf-orb1" /><div className="nf-orb2" /><div className="nf-grid" />
        </div>

        <Header />

        <div className="nf-content">
          <div className="nf-card">

            <div className="nf-number">404</div>

            <div className="nf-icon-wrap">
              <Compass size={34} color="#00CCFF" strokeWidth={1.5} />
            </div>

            <div className="nf-eyebrow">Página não encontrada</div>
            <h1 className="nf-title">Você se perdeu<br />no caminho?</h1>
            <p className="nf-desc">
              A página que você está procurando não existe ou foi movida.
              Explore os estabelecimentos do bairro Novo Tempo.
            </p>

            <div className="nf-btns">
              <Link href="/" className="nf-btn nf-btn-primary">
                <Home size={17} />
                Voltar ao Início
                <ArrowRight size={15} className="nf-btn-arrow" />
              </Link>

              <div className="nf-divider">
                <div className="nf-divider-line" />
                <span className="nf-divider-text">ou</span>
                <div className="nf-divider-line" />
              </div>

              <Link href="/busca" className="nf-btn nf-btn-outline">
                <Search size={16} /> Buscar Estabelecimentos
              </Link>
              <Link href="/mapa" className="nf-btn nf-btn-outline">
                <MapPin size={16} /> Ver no Mapa
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}