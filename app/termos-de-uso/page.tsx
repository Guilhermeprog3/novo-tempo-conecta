"use client"

import { FileText, ShieldCheck, AlertCircle, UserCheck, MessageSquare, AlertTriangle } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

export default function TermosDeUsoPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .termos-page {
          font-family: 'DM Sans', sans-serif;
          --navy: #002240;
          --gold: #F7B000;
          --cyan: #00CCFF;
          --bg: #F4F1EC;
        }

        .termos-hero {
          background: var(--navy);
          padding: 5.5rem 1.5rem 4rem;
          text-align: center; position: relative; overflow: hidden;
        }

        .termos-orb1 {
          position: absolute; border-radius: 50%; pointer-events: none;
          width: 450px; height: 450px;
          background: var(--gold); opacity: 0.08; filter: blur(90px);
          top: -150px; right: -80px;
        }

        .termos-orb2 {
          position: absolute; border-radius: 50%; pointer-events: none;
          width: 350px; height: 350px;
          background: var(--cyan); opacity: 0.1; filter: blur(70px);
          bottom: -130px; left: -60px;
        }

        .termos-icon-wrap {
          width: 72px; height: 72px; border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(247,176,0,0.12);
          border: 1px solid rgba(247,176,0,0.2);
          margin: 0 auto 1.4rem;
        }

        .termos-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 5vw, 3rem);
          color: #fff; margin-bottom: 0.6rem;
        }

        .termos-date {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.05em;
        }

        .termos-main {
          background: var(--bg);
          padding: 3.5rem 1.5rem 5rem;
        }

        .termos-card {
          max-width: 780px; margin: 0 auto;
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 4px 30px rgba(0,34,64,0.08);
          overflow: hidden;
        }

        .termos-lead {
          background: var(--navy);
          padding: 2rem 2.5rem;
        }

        .termos-lead p {
          color: rgba(255,255,255,0.7);
          font-size: 0.97rem; line-height: 1.75;
          font-weight: 300; margin: 0;
        }

        .termos-lead strong { color: #fff; font-weight: 600; }

        .termos-body {
          padding: 2.5rem 2.5rem 3rem;
        }

        .termos-section {
          margin-bottom: 2.5rem;
        }

        .termos-section:last-child { margin-bottom: 0; }

        .termos-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem; font-weight: 700;
          color: var(--navy);
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 0.9rem;
          padding-bottom: 0.75rem;
          border-bottom: 1.5px solid #f0ece5;
        }

        .termos-section-icon {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .termos-p {
          font-size: 0.92rem; color: #5a6878;
          line-height: 1.78; margin-bottom: 0.8rem;
        }

        .termos-p:last-child { margin-bottom: 0; }

        .termos-ul {
          list-style: none; padding: 0; margin: 0.6rem 0 0;
          display: flex; flex-direction: column; gap: 8px;
        }

        .termos-ul li {
          display: flex; align-items: flex-start; gap: 9px;
          font-size: 0.9rem; color: #5a6878; line-height: 1.6;
        }

        .termos-ul li::before {
          content: '';
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--gold); flex-shrink: 0; margin-top: 7px;
        }

        @media (max-width: 640px) {
          .termos-lead, .termos-body { padding: 1.5rem; }
          .termos-hero { padding: 4rem 1.5rem 3rem; }
        }
      `}</style>

      <div className="termos-page">
        <Header />

        <section className="termos-hero">
          <div className="termos-orb1" />
          <div className="termos-orb2" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="termos-icon-wrap">
              <FileText size={30} color="#F7B000" />
            </div>
            <h1 className="termos-title">Termos de Uso</h1>
            <p className="termos-date">Última atualização: 22 de Fevereiro de 2026</p>
          </div>
        </section>

        <main className="termos-main">
          <div className="termos-card">
            <div className="termos-lead">
              <p>
                Bem-vindo ao <strong>Novo Tempo Conecta</strong>. Ao aceder e utilizar a nossa plataforma,
                concorda em cumprir e ficar vinculado aos seguintes termos e condições de uso.
              </p>
            </div>

            <div className="termos-body">
              <div className="termos-section">
                <div className="termos-section-title">
                  <div className="termos-section-icon" style={{ background: "rgba(0,204,255,0.1)" }}>
                    <ShieldCheck size={15} color="#00CCFF" />
                  </div>
                  1. Aceitação dos Termos
                </div>
                <p className="termos-p">
                  Ao utilizar este site, você concorda com estes termos de uso na sua totalidade. Se discordar
                  de qualquer parte destes termos, não deverá utilizar o nosso website.
                </p>
              </div>

              <div className="termos-section">
                <div className="termos-section-title">
                  <div className="termos-section-icon" style={{ background: "rgba(247,176,0,0.1)" }}>
                    <AlertCircle size={15} color="#F7B000" />
                  </div>
                  2. Uso da Plataforma
                </div>
                <p className="termos-p">
                  O Novo Tempo Conecta destina-se a facilitar a conexão entre moradores e estabelecimentos comerciais
                  locais. Você concorda em usar a plataforma apenas para fins lícitos e de maneira que não infrinja
                  os direitos de terceiros ou restrinja o uso de outros.
                </p>
              </div>

              <div className="termos-section">
                <div className="termos-section-title">
                  <div className="termos-section-icon" style={{ background: "rgba(0,34,64,0.08)" }}>
                    <UserCheck size={15} color="#002240" />
                  </div>
                  3. Cadastro e Contas
                </div>
                <ul className="termos-ul">
                  <li>Você deve fornecer informações precisas e completas ao criar uma conta.</li>
                  <li>Você é responsável por manter a confidencialidade da sua senha.</li>
                  <li>Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos.</li>
                </ul>
              </div>

              <div className="termos-section">
                <div className="termos-section-title">
                  <div className="termos-section-icon" style={{ background: "rgba(34,197,94,0.1)" }}>
                    <MessageSquare size={15} color="#22c55e" />
                  </div>
                  4. Conteúdo do Usuário
                </div>
                <p className="termos-p">
                  Ao publicar avaliações ou informações comerciais, você garante que tem o direito de compartilhar
                  tal conteúdo e que ele não é difamatório, ofensivo ou ilegal.
                </p>
              </div>

              <div className="termos-section">
                <div className="termos-section-title">
                  <div className="termos-section-icon" style={{ background: "rgba(233,30,140,0.08)" }}>
                    <AlertTriangle size={15} color="#E91E8C" />
                  </div>
                  5. Limitação de Responsabilidade
                </div>
                <p className="termos-p">
                  Não nos responsabilizamos pelas transações realizadas entre usuários e estabelecimentos listados
                  na plataforma. As informações são fornecidas "como estão" sem garantias de qualquer tipo.
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