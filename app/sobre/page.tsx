"use client"

import { 
  GraduationCap, Lightbulb, CheckCircle2, ArrowRight, Sparkles, Users, Globe, Heart
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

export default function SobrePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .sobre {
          font-family: 'DM Sans', sans-serif;
          --navy: #002240;
          --gold: #F7B000;
          --cyan: #00CCFF;
          --green: #22c55e;
          --bg: #F4F1EC;
        }

        /* HERO */
        .sobre-hero {
          background: var(--navy);
          position: relative; overflow: hidden;
          padding: 7rem 1.5rem 5.5rem;
          text-align: center;
        }

        .sobre-orb1 {
          position: absolute; border-radius: 50%; pointer-events: none;
          width: 550px; height: 550px;
          background: var(--cyan); opacity: 0.1; filter: blur(90px);
          top: -200px; right: -100px;
        }

        .sobre-orb2 {
          position: absolute; border-radius: 50%; pointer-events: none;
          width: 400px; height: 400px;
          background: var(--green); opacity: 0.1; filter: blur(80px);
          bottom: -150px; left: -80px;
        }

        .sobre-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        .sobre-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(0,204,255,0.1);
          border: 1px solid rgba(0,204,255,0.25);
          color: var(--cyan);
          padding: 6px 16px; border-radius: 100px;
          font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.09em; text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        .sobre-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.4rem, 5.5vw, 4rem);
          line-height: 1.06; color: #fff;
          margin-bottom: 1.3rem;
        }

        .sobre-title em { font-style: normal; color: var(--gold); }

        .sobre-subtitle {
          color: rgba(255,255,255,0.6);
          font-size: 1.1rem; font-weight: 300;
          max-width: 540px; margin: 0 auto 3rem;
          line-height: 1.75;
        }

        .sobre-hero-stats {
          display: flex; justify-content: center;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 2.5rem; gap: 0;
        }

        .sobre-stat {
          text-align: center; padding: 0 2.5rem;
          border-right: 1px solid rgba(255,255,255,0.08);
        }

        .sobre-stat:last-child { border-right: none; }

        .sobre-stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 2rem; font-weight: 800;
          color: var(--gold); line-height: 1;
        }

        .sobre-stat-label {
          font-size: 0.72rem; letter-spacing: 0.08em;
          text-transform: uppercase; color: rgba(255,255,255,0.4);
          margin-top: 5px;
        }

        /* IFMA SECTION */
        .sobre-ifma {
          background: var(--bg);
          padding: 6rem 1.5rem;
        }

        .sobre-ifma-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 5rem; align-items: center;
        }

        .sobre-ifma-visual {
          display: flex; justify-content: center;
        }

        .sobre-icon-card {
          background: #fff;
          border-radius: 28px;
          padding: 3.5rem;
          box-shadow: 0 20px 60px rgba(0,34,64,0.1);
          position: relative;
          display: flex; align-items: center; justify-content: center;
        }

        .sobre-icon-glow {
          position: absolute; inset: -20px; border-radius: 50%;
          background: radial-gradient(circle, rgba(34,197,94,0.15), transparent 70%);
          pointer-events: none;
        }

        .sobre-float-card {
          position: absolute; bottom: -20px; right: -20px;
          background: var(--navy); border-radius: 16px;
          padding: 14px 18px;
          display: flex; align-items: center; gap: 12px;
          box-shadow: 0 12px 40px rgba(0,34,64,0.25);
        }

        .sobre-float-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: var(--gold);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .sobre-float-label {
          font-size: 0.68rem; color: var(--cyan);
          font-weight: 600; letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .sobre-float-value {
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem; font-weight: 700; color: #fff;
        }

        .sobre-tag {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.25);
          color: #16a34a;
          padding: 6px 16px; border-radius: 100px;
          font-size: 0.78rem; font-weight: 600;
          margin-bottom: 1.2rem;
        }

        .sobre-section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.7rem, 3.5vw, 2.4rem);
          font-weight: 800; color: var(--navy);
          line-height: 1.1; margin-bottom: 1rem;
        }

        .sobre-section-title span { color: #16a34a; }

        .sobre-body {
          font-size: 1rem; color: #5a6878;
          line-height: 1.75; margin-bottom: 2rem;
        }

        .sobre-checklist {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 12px;
        }

        .sobre-checklist li {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 0.92rem; color: #3a4a5a; line-height: 1.55;
        }

        /* VALUES */
        .sobre-values {
          background: #fff;
          padding: 5.5rem 1.5rem;
        }

        .sobre-values-header {
          max-width: 1100px; margin: 0 auto 3rem;
          text-align: center;
        }

        .sobre-values-grid {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .sobre-value-card {
          border-radius: 20px;
          padding: 2rem 1.75rem;
          border: 1.5px solid #f0ece5;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
        }

        .sobre-value-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,34,64,0.1);
        }

        .sobre-value-icon {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.2rem;
        }

        .sobre-value-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem; font-weight: 700;
          color: var(--navy); margin-bottom: 0.5rem;
        }

        .sobre-value-desc {
          font-size: 0.875rem; color: #7a8a9a; line-height: 1.65;
        }

        /* CTA */
        .sobre-cta {
          background: var(--navy);
          padding: 5rem 1.5rem; text-align: center;
          position: relative; overflow: hidden;
        }

        .sobre-cta-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
          width: 400px; height: 400px;
          background: var(--cyan); opacity: 0.08; filter: blur(80px);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
        }

        .sobre-cta-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800; color: #fff;
          margin-bottom: 1rem;
        }

        .sobre-cta-sub {
          color: rgba(255,255,255,0.55);
          font-size: 1rem; font-weight: 300;
          max-width: 460px; margin: 0 auto 2.2rem;
          line-height: 1.7;
        }

        .sobre-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--gold); color: var(--navy);
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 0.95rem;
          padding: 14px 28px; border-radius: 14px;
          text-decoration: none;
          box-shadow: 0 8px 30px rgba(247,176,0,0.3);
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
        }

        .sobre-cta-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 14px 40px rgba(247,176,0,0.45);
        }

        @media (max-width: 768px) {
          .sobre-ifma-inner { grid-template-columns: 1fr; gap: 2.5rem; }
          .sobre-ifma-visual { order: -1; }
          .sobre-values-grid { grid-template-columns: 1fr; }
          .sobre-stat { padding: 0 1.2rem; }
        }
      `}</style>

      <div className="sobre">
        <Header />

        {/* HERO */}
        <section className="sobre-hero">
          <div className="sobre-orb1" />
          <div className="sobre-orb2" />
          <div className="sobre-grid" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="sobre-eyebrow">
              <Sparkles size={12} />
              Conectando Pessoas e Negócios
            </div>
            <h1 className="sobre-title">
              Impulsionando o Desenvolvimento<br />do <em>Novo Tempo</em>
            </h1>
            <p className="sobre-subtitle">
              Uma plataforma digital criada para fortalecer o comércio local,
              dar visibilidade aos empreendedores e facilitar a vida dos moradores.
            </p>
            <div className="sobre-hero-stats">
              <div className="sobre-stat">
                <div className="sobre-stat-num">IFMA</div>
                <div className="sobre-stat-label">Origem</div>
              </div>
              <div className="sobre-stat">
                <div className="sobre-stat-num">100%</div>
                <div className="sobre-stat-label">Gratuito</div>
              </div>
              <div className="sobre-stat">
                <div className="sobre-stat-num">Local</div>
                <div className="sobre-stat-label">Impacto</div>
              </div>
            </div>
          </div>
        </section>

        {/* IFMA */}
        <section className="sobre-ifma">
          <div className="sobre-ifma-inner">
            <div className="sobre-ifma-visual">
              <div className="sobre-icon-card" style={{ width: 280, height: 280 }}>
                <div className="sobre-icon-glow" />
                <GraduationCap size={110} color="#22c55e" strokeWidth={1.25} />
                <div className="sobre-float-card">
                  <div className="sobre-float-icon">
                    <Lightbulb size={18} color="#002240" />
                  </div>
                  <div>
                    <div className="sobre-float-label">Inovação</div>
                    <div className="sobre-float-value">Tecnologia Social</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="sobre-tag">
                <GraduationCap size={14} />
                Iniciativa Acadêmica
              </div>
              <h2 className="sobre-section-title">
                Uma realização do<br /><span>IFMA</span> Campus Timon
              </h2>
              <p className="sobre-body">
                O <strong>Novo Tempo Conecta</strong> nasceu dentro dos laboratórios do Instituto Federal
                do Maranhão (IFMA). É fruto de um projeto de extensão tecnológica dedicado a aplicar o
                conhecimento acadêmico para resolver desafios reais da comunidade e fomentar o empreendedorismo local.
              </p>
              <ul className="sobre-checklist">
                {[
                  "Fomento ao desenvolvimento empresarial do bairro.",
                  "Inclusão digital para pequenos comerciantes.",
                  "Fortalecimento da economia circular local.",
                  "Integração entre tecnologia e comunidade."
                ].map((item, i) => (
                  <li key={i}>
                    <CheckCircle2 size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="sobre-values">
          <div className="sobre-values-header">
            <div className="sobre-eyebrow" style={{ background: "rgba(247,176,0,0.1)", borderColor: "rgba(247,176,0,0.25)", color: "#b07d00" }}>
              <Heart size={12} />
              Nossos Pilares
            </div>
            <h2 className="sobre-section-title">O que nos move</h2>
          </div>
          <div className="sobre-values-grid">
            {[
              { icon: <Globe size={22} color="#00CCFF" />, bg: "rgba(0,204,255,0.1)", name: "Conexão", desc: "Unimos pessoas, negócios e comunidade em um único espaço digital inclusivo." },
              { icon: <Heart size={22} color="#E91E8C" />, bg: "rgba(233,30,140,0.1)", name: "Solidariedade", desc: "Valorizamos iniciativas que têm impacto real e positivo na vida das pessoas." },
              { icon: <Users size={22} color="#F7B000" />, bg: "rgba(247,176,0,0.1)", name: "Comunidade", desc: "Construído para e pela comunidade do Novo Tempo, com transparência total." },
            ].map((v, i) => (
              <div className="sobre-value-card" key={i}>
                <div className="sobre-value-icon" style={{ background: v.bg }}>{v.icon}</div>
                <div className="sobre-value-name">{v.name}</div>
                <div className="sobre-value-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="sobre-cta">
          <div className="sobre-cta-orb" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className="sobre-cta-title">Faça parte do Novo Tempo</h2>
            <p className="sobre-cta-sub">
              Cadastre seu negócio ou encontre serviços locais que fazem a diferença na sua vizinhança.
            </p>
            <Link href="/" className="sobre-cta-btn">
              Explorar a plataforma <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}