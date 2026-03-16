"use client"

import { Shield, Lock, Eye, Database, Trash2, Server, UserCheck, Mail } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import React, { useEffect, useState } from "react"

const PRIVACIDADE_CSS = `
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
    color: #FFFFFF;
    opacity: 0.7;
    letter-spacing: 0.05em;
  }

  .legal-main {
    background: var(--bg);
    padding: 3.5rem 1.5rem 5rem;
  }

  .legal-card {
    max-width: 840px; margin: 0 auto;
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
    color: #FFFFFF;
    font-size: 0.97rem; line-height: 1.75;
    font-weight: 300; margin: 0;
  }

  .legal-lead strong { color: #fff; font-weight: 600; }

  .legal-body {
    padding: 2.5rem 2.5rem 3rem;
  }

  .legal-section {
    margin-bottom: 3rem;
  }

  .legal-section:last-child { margin-bottom: 0; }

  .legal-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem; font-weight: 700;
    color: var(--navy);
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 1.1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1.5px solid #f0ece5;
  }

  .legal-section-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .legal-p {
    font-size: 0.92rem; color: #334155;
    line-height: 1.8; margin-bottom: 1rem;
  }

  .legal-ul {
    list-style: none; padding: 0; margin: 0.8rem 0;
    display: flex; flex-direction: column; gap: 10px;
  }

  .legal-ul li {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 0.9rem; color: #475569; line-height: 1.6;
  }

  .legal-ul li::before {
    content: '';
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--cyan); flex-shrink: 0; margin-top: 8px;
  }

  .highlight-box {
    background: #f8fafc;
    border-left: 4px solid var(--gold);
    padding: 1.25rem;
    margin: 1.5rem 0;
    border-radius: 0 12px 12px 0;
  }

  @media (max-width: 640px) {
    .legal-lead, .legal-body { padding: 1.5rem; }
    .legal-hero { padding: 4rem 1.5rem 3rem; }
  }
`;

export default function PoliticaPrivacidadePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && <style dangerouslySetInnerHTML={{ __html: PRIVACIDADE_CSS }} />}
      
      <div className="legal-page">
        <Header />

        <section className="legal-hero">
          <div className="legal-orb1" />
          <div className="legal-orb2" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="legal-icon-wrap">
              <Shield size={30} color="#00CCFF" />
            </div>
            <h1 className="legal-title">Privacidade e Dados</h1>
            <p className="legal-date">Conformidade com a LGPD • Atualizada em 15 de Março de 2026</p>
          </div>
        </section>

        <main className="legal-main">
          <div className="legal-card">
            <div className="legal-lead">
              <p>
                No <strong>Novo Tempo Conecta</strong>, a transparência é o nosso alicerce. Esta política descreve como tratamos seus dados pessoais e quais são seus direitos como titular.
              </p>
            </div>

            <div className="legal-body">
              {/* 1. COLETA */}
              <div className="legal-section">
                <div className="legal-section-title">
                  <div className="legal-section-icon" style={{ background: "rgba(0,204,255,0.1)" }}>
                    <Database size={16} color="#00CCFF" />
                  </div>
                  1. Coleta de Dados Pessoais
                </div>
                <p className="legal-p">Nós coletamos apenas as informações estritamente necessárias para o funcionamento da plataforma:</p>
                <ul className="legal-ul">
                  <li><strong>Identificação:</strong> Nome completo e e-mail fornecidos no cadastro.</li>
                  <li><strong>Comunicação:</strong> Número de telefone/WhatsApp para facilitar o contato com os estabelecimentos.</li>
                  <li><strong>Dados do Negócio:</strong> Informações públicas de empresas para exibição no guia comercial.</li>
                  <li><strong>Geolocalização:</strong> Coletamos sua localização apenas com sua autorização explícita para o funcionamento do mapa.</li>
                </ul>
              </div>

              {/* 2. FINALIDADE */}
              <div className="legal-section">
                <div className="legal-section-title">
                  <div className="legal-section-icon" style={{ background: "rgba(247,176,0,0.1)" }}>
                    <UserCheck size={16} color="#F7B000" />
                  </div>
                  2. Finalidade do Tratamento
                </div>
                <p className="legal-p">Seus dados não são vendidos para terceiros. Eles são usados para:</p>
                <ul className="legal-ul">
                  <li>Operar as funcionalidades da plataforma e prevenir fraudes.</li>
                  <li>Permitir que os empresários gerenciem seus anúncios e vitrines.</li>
                  <li>Responder a solicitações de suporte e enviar comunicações técnicas.</li>
                  <li>Melhorar a experiência de busca e localização de comércios na região.</li>
                </ul>
              </div>

              {/* 3. ARMAZENAMENTO E SEGURANÇA */}
              <div className="legal-section">
                <div className="legal-section-title">
                  <div className="legal-section-icon" style={{ background: "rgba(34,197,94,0.1)" }}>
                    <Server size={16} color="#22c55e" />
                  </div>
                  3. Armazenamento e Segurança
                </div>
                <p className="legal-p">
                  Seus dados são armazenados em servidores de nuvem seguros com protocolos de criptografia ativos (SSL/TLS). 
                </p>
                <div className="highlight-box">
                  <p className="legal-p" style={{ margin: 0, fontSize: '0.88rem' }}>
                    Mantemos seus dados enquanto sua conta estiver ativa ou conforme exigido por obrigações legais de manutenção de registros.
                  </p>
                </div>
              </div>

              {/* 4. SEUS DIREITOS LGPD */}
              <div className="legal-section">
                <div className="legal-section-title">
                  <div className="legal-section-icon" style={{ background: "rgba(233,30,140,0.1)" }}>
                    <Trash2 size={16} color="#E91E8C" />
                  </div>
                  4. Seus Direitos (LGPD)
                </div>
                <p className="legal-p">Você tem controle total sobre seus dados e pode solicitar a qualquer momento:</p>
                <ul className="legal-ul">
                  <li><strong>Acesso e Correção:</strong> Visualizar ou editar seus dados pessoais no perfil.</li>
                  <li><strong>Exclusão:</strong> Solicitar o encerramento da conta e a remoção dos seus dados.</li>
                  <li><strong>Revogação:</strong> Desativar permissões de localização diretamente nas configurações do seu dispositivo.</li>
                </ul>
              </div>

              {/* 5. CONTATO */}
              <div className="legal-section">
                <div className="legal-section-title">
                  <div className="legal-section-icon" style={{ background: "rgba(124,58,237,0.1)" }}>
                    <Mail size={16} color="#7c3aed" />
                  </div>
                  Dúvidas sobre Privacidade?
                </div>
                <p className="legal-p">
                  Para qualquer questão relacionada à privacidade de seus dados, entre em contato através do e-mail oficial: <strong>contato@novotempoconecta.com.br</strong>.
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