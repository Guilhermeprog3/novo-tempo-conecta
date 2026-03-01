"use client"

import { Shield, Lock, Eye, Database } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

export default function PoliticaPrivacidadePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .legal-page {
          font-family: 'DM Sans', sans-serif;
          --navy: #002240;
          --gold: #F7B000;
          --cyan: #00CCFF;
          --bg: #F4F1EC;
        }

        .legal-hero {
          background: var(--navy);
          padding: 5.5rem 1.5rem 4rem;
          text-align: center; position: relative; overflow: hidden;
        }

        .legal-orb1 {
          position: absolute; border-radius: 50%; pointer-events: none;
          width: 400px; height: 400px;
          background: var(--cyan); opacity: 0.1; filter: blur(80px);
          top: -150px; right: -100px;
        }

        .legal-orb2 {
          position: absolute; border-radius: 50%; pointer-events: none;
          width: 350px; height: 350px;
          background: var(--gold); opacity: 0.08; filter: blur(80px);
          bottom: -150px; left: -80px;
        }

        .legal-icon-wrap {
          width: 72px; height: 72px; border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,204,255,0.12);
          border: 1px solid rgba(0,204,255,0.2);
          margin: 0 auto 1.4rem;
        }

        .legal-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 5vw, 3rem);
          color: #fff; margin-bottom: 0.6rem;
        }

        .legal-date {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.05em;
        }

        .legal-main {
          background: var(--bg);
          padding: 3.5rem 1.5rem 5rem;
        }

        .legal-card {
          max-width: 780px; margin: 0 auto;
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 4px 30px rgba(0,34,64,0.08);
          overflow: hidden;
        }

        .legal-lead {
          background: var(--navy);
          padding: 2rem 2.5rem;
        }

        .legal-lead p {
          color: rgba(255,255,255,0.7);
          font-size: 0.97rem; line-height: 1.75;
          font-weight: 300; margin: 0;
        }

        .legal-lead strong { color: #fff; font-weight: 600; }

        .legal-body {
          padding: 2.5rem 2.5rem 3rem;
        }

        .legal-section {
          margin-bottom: 2.5rem;
        }

        .legal-section:last-child { margin-bottom: 0; }

        .legal-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem; font-weight: 700;
          color: var(--navy);
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 0.9rem;
          padding-bottom: 0.75rem;
          border-bottom: 1.5px solid #f0ece5;
        }

        .legal-section-icon {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .legal-p {
          font-size: 0.92rem; color: #5a6878;
          line-height: 1.78; margin-bottom: 0.8rem;
        }

        .legal-p:last-child { margin-bottom: 0; }

        .legal-ul {
          list-style: none; padding: 0; margin: 0.6rem 0 0;
          display: flex; flex-direction: column; gap: 8px;
        }

        .legal-ul li {
          display: flex; align-items: flex-start; gap: 9px;
          font-size: 0.9rem; color: #5a6878; line-height: 1.6;
        }

        .legal-ul li::before {
          content: '';
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--cyan); flex-shrink: 0; margin-top: 7px;
        }

        @media (max-width: 640px) {
          .legal-lead, .legal-body { padding: 1.5rem; }
          .legal-hero { padding: 4rem 1.5rem 3rem; }
        }
      `}</style>

      <div className="legal-page">
        <Header />

        <section className="legal-hero">
          <div className="legal-orb1" />
          <div className="legal-orb2" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="legal-icon-wrap">
              <Shield size={30} color="#00CCFF" />
            </div>
            <h1 className="legal-title">Política de Privacidade</h1>
            <p className="legal-date">Última atualização: 22 de Fevereiro de 2026</p>
          </div>
        </section>

        <main className="legal-main">
          <div className="legal-card">
            <div className="legal-lead">
              <p>
                A sua privacidade é importante para nós. Esta política explica como o{" "}
                <strong>Novo Tempo Conecta</strong> coleta, usa e protege as suas informações pessoais.
              </p>
            </div>

            <div className="legal-body">
              <div className="legal-section">
                <div className="legal-section-title">
                  <div className="legal-section-icon" style={{ background: "rgba(0,204,255,0.1)" }}>
                    <Database size={15} color="#00CCFF" />
                  </div>
                  1. Informações que Coletamos
                </div>
                <p className="legal-p">Coletamos informações que você nos fornece diretamente, como:</p>
                <ul className="legal-ul">
                  <li>Nome, e-mail e telefone ao criar uma conta.</li>
                  <li>Informações do seu negócio (caso seja um empresário).</li>
                  <li>Dados de localização (quando autorizado) para o mapa interativo.</li>
                </ul>
              </div>

              <div className="legal-section">
                <div className="legal-section-title">
                  <div className="legal-section-icon" style={{ background: "rgba(247,176,0,0.1)" }}>
                    <Eye size={15} color="#F7B000" />
                  </div>
                  2. Como Usamos as suas Informações
                </div>
                <p className="legal-p">Utilizamos os dados coletados para:</p>
                <ul className="legal-ul">
                  <li>Fornecer, operar e manter a plataforma.</li>
                  <li>Melhorar a sua experiência de usuário.</li>
                  <li>Comunicar atualizações importantes ou responder ao suporte.</li>
                </ul>
              </div>

              <div className="legal-section">
                <div className="legal-section-title">
                  <div className="legal-section-icon" style={{ background: "rgba(0,34,64,0.08)" }}>
                    <Lock size={15} color="#002240" />
                  </div>
                  3. Proteção de Dados
                </div>
                <p className="legal-p">
                  Implementamos medidas de segurança para proteger as suas informações pessoais contra
                  acessos não autorizados, alteração ou destruição. No entanto, nenhum método de
                  transmissão pela internet é 100% seguro.
                </p>
              </div>

              <div className="legal-section">
                <div className="legal-section-title">
                  <div className="legal-section-icon" style={{ background: "rgba(34,197,94,0.1)" }}>
                    <Shield size={15} color="#22c55e" />
                  </div>
                  4. Compartilhamento de Informações
                </div>
                <p className="legal-p">
                  Não vendemos, trocamos ou alugamos as suas informações pessoais. Podemos compartilhar
                  dados genéricos agregados que não o identifiquem pessoalmente. Os dados públicos
                  do seu negócio (empresários) serão exibidos na plataforma conforme o seu cadastro.
                </p>
              </div>

              <div className="legal-section">
                <div className="legal-section-title">
                  <div className="legal-section-icon" style={{ background: "rgba(233,30,140,0.08)" }}>
                    <Eye size={15} color="#E91E8C" />
                  </div>
                  5. Seus Direitos
                </div>
                <p className="legal-p">
                  Você tem o direito de acessar, corrigir ou excluir as suas informações pessoais.
                  Para exercer esses direitos, entre em contato conosco através da nossa página de suporte.
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}