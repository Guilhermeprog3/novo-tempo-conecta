"use client"

import { 
  GraduationCap, Lightbulb, CheckCircle2, ArrowRight, Sparkles, Users, Globe, Heart,
  Target, Search, TrendingUp, Store
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

        /* TÍTULO COM HIERARQUIA */
        .sobre-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          line-height: 1.4;
          color: #fff;
          margin-bottom: 1.3rem;
          max-width: 760px;
          margin-left: auto;
          margin-right: auto;
        }

        .sobre-title-big {
          display: block;
          font-size: clamp(1.9rem, 3.5vw, 2.8rem);
          line-height: 1.15;
        }

        .sobre-title-small {
          display: block;
          font-size: clamp(1rem, 1.8vw, 1.35rem);
          font-weight: 400;
          color: rgba(255,255,255,0.7);
          margin-top: 0.65rem;
          line-height: 1.55;
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
          line-height: 1.75; margin-bottom: 1.1rem;
        }

        .sobre-checklist {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 12px;
        }

        .sobre-checklist li {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 0.92rem; color: #3a4a5a; line-height: 1.55;
        }

        /* ── GENERIC CONTENT SECTIONS ── */
        .sobre-content-section {
          padding: 4.5rem 1.5rem;
        }

        .sobre-content-section.white { background: #fff; }
        .sobre-content-section.beige { background: var(--bg); }

        .sobre-content-inner {
          max-width: 900px; margin: 0 auto;
        }

        .sobre-content-inner-wide {
          max-width: 1100px; margin: 0 auto;
        }

        .sobre-section-label {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 14px; border-radius: 100px;
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .sobre-section-label.cyan  { background: rgba(0,204,255,0.1); color: var(--cyan); border: 1px solid rgba(0,204,255,0.25); }
        .sobre-section-label.gold  { background: rgba(247,176,0,0.1);  color: #b07d00;    border: 1px solid rgba(247,176,0,0.25); }
        .sobre-section-label.green { background: rgba(34,197,94,0.1);  color: #16a34a;    border: 1px solid rgba(34,197,94,0.25); }

        .sobre-content-h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.45rem, 2.8vw, 1.9rem);
          font-weight: 800; color: var(--navy);
          margin-bottom: 1rem; line-height: 1.2;
        }

        .sobre-content-text {
          font-size: 1rem; color: #5a6878;
          line-height: 1.8;
        }

        /* ── O QUE ENCONTRA: MINI CARDS ── */
        .sobre-find-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 1.1rem;
          margin-top: 2rem;
        }

        .sobre-find-card {
          background: #fff;
          border: 1px solid rgba(0,34,64,0.08);
          border-radius: 16px; padding: 1.4rem;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
        }

        .sobre-find-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(0,34,64,0.09); }

        .sobre-find-icon {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 0.85rem;
        }

        .sobre-find-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem; font-weight: 700;
          color: var(--navy); margin-bottom: 0.35rem;
        }

        .sobre-find-text {
          font-size: 0.84rem; color: #7a8a9a; line-height: 1.6;
        }

        /* ── MISSÃO BLOCK ── */
        .sobre-mission-block {
          background: linear-gradient(135deg, var(--navy), #003a6e);
          border-radius: 20px;
          padding: 2.5rem 2.25rem;
          border: 1px solid rgba(0,204,255,0.15);
          position: relative; overflow: hidden;
          margin-top: 1.5rem;
        }

        .sobre-mission-block::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at top right, rgba(0,204,255,0.12), transparent 60%);
          pointer-events: none;
        }

        .sobre-mission-text {
          font-family: 'Syne', sans-serif;
          font-size: clamp(0.95rem, 2vw, 1.2rem);
          font-weight: 600; line-height: 1.65;
          color: #fff; position: relative; z-index: 1;
          margin: 0;
        }

        .sobre-mission-text em { font-style: normal; color: var(--cyan); }

        /* ── COMO FUNCIONA STEPS ── */
        .sobre-steps {
          display: flex; flex-direction: column; gap: 0.9rem;
          margin-top: 1.75rem;
        }

        .sobre-step {
          display: flex; align-items: flex-start; gap: 1rem;
          background: rgba(0,34,64,0.03);
          border: 1px solid rgba(0,34,64,0.07);
          border-radius: 13px; padding: 1.1rem 1.3rem;
          transition: background 0.2s;
        }

        .sobre-step:hover { background: rgba(0,34,64,0.06); }

        .sobre-step-num {
          flex-shrink: 0;
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--cyan); color: var(--navy);
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.8rem;
          display: flex; align-items: center; justify-content: center;
        }

        .sobre-step-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.88rem; font-weight: 700;
          color: var(--navy); margin-bottom: 0.2rem;
        }

        .sobre-step-text {
          font-size: 0.855rem; color: #5a6878; line-height: 1.65;
        }

        /* ── CLOSING QUOTE ── */
        .sobre-closing {
          background: var(--bg);
          padding: 4rem 1.5rem;
        }

        .sobre-closing-inner {
          max-width: 820px; margin: 0 auto;
          border-left: 4px solid var(--gold);
          padding-left: 1.75rem;
        }

        .sobre-closing-text {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1rem, 1.9vw, 1.15rem);
          font-weight: 600; color: var(--navy);
          line-height: 1.72; margin: 0;
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
          .sobre-find-cards { grid-template-columns: 1fr; }
          .sobre-mission-block { padding: 1.75rem 1.4rem; }
          .sobre-closing-inner { padding-left: 1.1rem; }
          .sobre-title-big { font-size: clamp(1.5rem, 6vw, 2rem); }
          .sobre-title-small { font-size: clamp(0.9rem, 4vw, 1.1rem); }
        }
      `}</style>

      <div className="sobre">
        <Header />

        {/* ── HERO ── */}
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
              <span className="sobre-title-big">
                Uma plataforma para divulgar empreendimentos locais,
              </span>
              <span className="sobre-title-small">
                estimular o consumo consciente e fortalecer a economia solidária do <em>Novo Tempo</em>.
              </span>
            </h1>
          </div>
        </section>

        {/* ── O QUE É ── */}
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
                O <span>Novo Tempo Conecta</span>
              </h2>
              <p className="sobre-body">
                O <strong>Novo Tempo Conecta</strong> é uma plataforma digital criada para fortalecer os empreendimentos locais do Residencial Novo Tempo, em Timon (MA). Mais do que divulgar produtos e serviços, o projeto busca incentivar a economia solidária, ampliar a visibilidade dos trabalhadores e pequenos negócios da comunidade, estimular o consumo local e fortalecer redes de cooperação entre moradores.
              </p>
              <p className="sobre-body">
                A iniciativa nasce como uma tecnologia social voltada ao desenvolvimento comunitário, unindo inovação, inclusão digital e valorização do território.
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

        {/* ── POR QUE EXISTE ── */}
        <section className="sobre-content-section white">
          <div className="sobre-content-inner">
            <span className="sobre-section-label gold">
              <Target size={12} /> Motivação
            </span>
            <h2 className="sobre-content-h2">Por que o Novo Tempo Conecta existe?</h2>
            <p className="sobre-content-text">
              O Residencial Novo Tempo reúne trabalhadores, empreendedores e iniciativas comunitárias com grande potencial de geração de renda e desenvolvimento local. A plataforma surge com a necessidade de criar um canal acessível e intuitivo que facilite a divulgação, a oferta e a procura de produtos e serviços locais, fortalecendo vínculos comunitários e apoiando o desenvolvimento local sustentável.
            </p>
          </div>
        </section>

        {/* ── O QUE VOCÊ ENCONTRA ── */}
        <section className="sobre-content-section beige">
          <div className="sobre-content-inner-wide">
            <span className="sobre-section-label cyan">
              <Search size={12} /> Conteúdo da plataforma
            </span>
            <h2 className="sobre-content-h2">O que você encontra aqui</h2>
            <p className="sobre-content-text">
              No Novo Tempo Conecta, você pode encontrar negócios locais, serviços oferecidos por moradores, iniciativas comunitárias e empreendimentos que ajudam a movimentar a economia do bairro e ampliar oportunidades para a comunidade.
            </p>
            <div className="sobre-find-cards">
              {[
                { icon: <Store size={18} color="#00CCFF" />, bg: "rgba(0,204,255,0.1)", title: "Negócios Locais", text: "Comércios, restaurantes e prestadores de serviço do bairro em um só lugar." },
                { icon: <Heart size={18} color="#E91E8C" />, bg: "rgba(233,30,140,0.1)", title: "Iniciativas Comunitárias", text: "Projetos e ações coletivas que fortalecem a comunidade e geram oportunidades." },
                { icon: <Users size={18} color="#F7B000" />, bg: "rgba(247,176,0,0.1)", title: "Serviços de Moradores", text: "Trabalhadores locais que oferecem serviços de qualidade dentro do próprio bairro." },
                { icon: <TrendingUp size={18} color="#22c55e" />, bg: "rgba(34,197,94,0.1)", title: "Oportunidades", text: "Conexões que geram renda, parcerias e desenvolvimento sustentável no território." },
              ].map((card) => (
                <div className="sobre-find-card" key={card.title}>
                  <div className="sobre-find-icon" style={{ background: card.bg }}>{card.icon}</div>
                  <div className="sobre-find-title">{card.title}</div>
                  <div className="sobre-find-text">{card.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MISSÃO ── */}
        <section className="sobre-content-section white">
          <div className="sobre-content-inner">
            <span className="sobre-section-label green">
              <Target size={12} /> Nossa missão
            </span>
            <h2 className="sobre-content-h2">Missão</h2>
            <div className="sobre-mission-block">
              <p className="sobre-mission-text">
                Fortalecer a economia local por meio da <em>conexão entre moradores, empreendedores e iniciativas comunitárias</em>, valorizando o trabalho local, a cooperação e o desenvolvimento sustentável.
              </p>
            </div>
          </div>
        </section>

        {/* ── PARA QUEM É ── */}
        <section className="sobre-content-section beige">
          <div className="sobre-content-inner">
            <span className="sobre-section-label gold">
              <Users size={12} /> Público
            </span>
            <h2 className="sobre-content-h2">Para quem é a plataforma?</h2>
            <p className="sobre-content-text">
              O Novo Tempo Conecta é para moradores, trabalhadores, pequenos empreendedores, prestadores de serviço e iniciativas comunitárias que desejam divulgar seu trabalho, ampliar conexões e fortalecer a comunidade.
            </p>
          </div>
        </section>

        {/* ── COMO FUNCIONA ── */}
        <section className="sobre-content-section white">
          <div className="sobre-content-inner">
            <span className="sobre-section-label cyan">
              <Globe size={12} /> Como funciona
            </span>
            <h2 className="sobre-content-h2">Como funciona</h2>
            <p className="sobre-content-text">
              A plataforma reúne negócios, serviços e iniciativas da comunidade em um só lugar.
            </p>
            <div className="sobre-steps">
              {[
                { num: "01", title: "Reúne a comunidade", text: "Os moradores podem conhecer e entrar em contato com empreendedores locais com mais facilidade." },
                { num: "02", title: "Amplifica a visibilidade", text: "Os empreendedores ganham mais visibilidade e ampliam suas oportunidades de atendimento e comercialização." },
                { num: "03", title: "Fortalece a economia local", text: "A comunidade fortalece sua própria economia por meio da conexão entre oferta e demanda local." },
              ].map((step) => (
                <div className="sobre-step" key={step.num}>
                  <div className="sobre-step-num">{step.num}</div>
                  <div>
                    <div className="sobre-step-title">{step.title}</div>
                    <div className="sobre-step-text">{step.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FRASE DE FECHAMENTO ── */}
        <section className="sobre-closing">
          <div className="sobre-closing-inner">
            <p className="sobre-closing-text">
              Mais do que uma plataforma digital, o Novo Tempo Conecta é um instrumento de valorização da comunidade, do trabalho local e das redes de solidariedade que ajudam a transformar o território.
            </p>
          </div>
        </section>

        {/* ── VALUES ── */}
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

        {/* ── CTA ── */}
        <section className="sobre-cta">
          <div className="sobre-cta-orb" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className="sobre-cta-title">Faça parte da rede local do Novo Tempo</h2>
            <p className="sobre-cta-sub">
              Cadastre e divulgue seu negócio na comunidade.
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