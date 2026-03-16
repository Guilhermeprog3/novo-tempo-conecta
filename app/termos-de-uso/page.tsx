"use client"

import { 
  FileText, ShieldCheck, AlertCircle, UserCheck, MessageSquare, 
  AlertTriangle, Scale, Lock, Ban, Image as ImageIcon, ExternalLink,
  Gavel, Clock
} from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import React, { useEffect, useState } from "react"

const TERMOS_CSS = `
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
    color: #FFFFFF; 
    letter-spacing: 0.05em;
    opacity: 0.9;
  }

  .termos-main {
    background: var(--bg);
    padding: 3.5rem 1.5rem 5rem;
  }

  .termos-card {
    max-width: 860px; margin: 0 auto;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 4px 30px rgba(0,34,64,0.08);
    overflow: hidden;
  }

  .termos-lead {
    background: var(--navy);
    padding: 2.5rem 2.5rem;
  }

  .termos-lead p {
    color: #FFFFFF;
    font-size: 0.97rem; line-height: 1.75;
    font-weight: 300; margin: 0;
  }

  .termos-lead strong { color: #fff; font-weight: 600; }

  .termos-body {
    padding: 2.5rem 2.5rem 3rem;
  }

  .termos-section {
    margin-bottom: 3rem;
  }

  .termos-section:last-child { margin-bottom: 0; }

  .termos-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem; font-weight: 700;
    color: var(--navy);
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 1.2rem;
    padding-bottom: 0.75rem;
    border-bottom: 1.5px solid #f0ece5;
  }

  .termos-section-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .termos-p {
    font-size: 0.92rem; color: #334155;
    line-height: 1.8; margin-bottom: 1rem;
  }

  .termos-ul {
    list-style: none; padding: 0; margin: 0.8rem 0;
    display: flex; flex-direction: column; gap: 10px;
  }

  .termos-ul li {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 0.9rem; color: #475569; line-height: 1.6;
  }

  .termos-ul li::before {
    content: '';
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold); flex-shrink: 0; margin-top: 8px;
  }

  .highlight-box {
    background: #f1f5f9;
    border-left: 4px solid var(--cyan);
    padding: 1.25rem;
    margin: 1.5rem 0;
    border-radius: 0 12px 12px 0;
  }

  @media (max-width: 640px) {
    .termos-lead, .termos-body { padding: 1.5rem; }
    .termos-hero { padding: 4rem 1.5rem 3rem; }
  }
`;

export default function TermosDeUsoPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && <style dangerouslySetInnerHTML={{ __html: TERMOS_CSS }} />}
      
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
            <p className="termos-date">Versão Completa - Atualizada em 15 de Março de 2026</p>
          </div>
        </section>

        <main className="termos-main">
          <div className="termos-card">
            <div className="termos-lead">
              <p>
                Bem-vindo ao <strong>Novo Tempo Conecta</strong>. Este documento rege o uso da nossa plataforma.
                Ao utilizar nossos serviços, você aceita integralmente as condições abaixo descritas.
              </p>
            </div>

            <div className="termos-body">
              {/* 1. OBJETIVO */}
              <div className="termos-section">
                <div className="termos-section-title">
                  <div className="termos-section-icon" style={{ background: "rgba(0,204,255,0.1)" }}>
                    <ShieldCheck size={16} color="#00CCFF" />
                  </div>
                  1. Objeto da Plataforma
                </div>
                <p className="termos-p">
                  O Novo Tempo Conecta é uma plataforma de tecnologia que atua como vitrine digital de empresas e prestadores de serviços. Nosso papel é puramente informativo e de intermediação de contato, não fazendo parte da cadeia de venda ou prestação direta de serviços físicos.
                </p>
              </div>

              {/* 2. VERACIDADE DAS INFORMAÇÕES */}
              <div className="termos-section">
                <div className="termos-section-title">
                  <div className="termos-section-icon" style={{ background: "rgba(247,176,0,0.1)" }}>
                    <ImageIcon size={16} color="#F7B000" />
                  </div>
                  2. Conteúdo e Imagens
                </div>
                <p className="termos-p">Ao inserir conteúdo na plataforma, seja você morador ou empresário, você declara que:</p>
                <ul className="termos-ul">
                  <li>As fotos de estabelecimentos ou produtos são reais e não induzem o consumidor ao erro.</li>
                  <li>Você possui os direitos autorais ou autorização de uso das imagens publicadas.</li>
                  <li>O uso de fotos que contenham nudez, violência ou apologia a crimes resultará em banimento imediato.</li>
                </ul>
              </div>

              {/* 3. RELAÇÃO CONSUMO */}
              <div className="termos-section">
                <div className="termos-section-title">
                  <div className="termos-section-icon" style={{ background: "rgba(34,197,94,0.1)" }}>
                    <Scale size={16} color="#22c55e" />
                  </div>
                  3. Relação entre Usuários e Empresas
                </div>
                <div className="highlight-box">
                  <p className="termos-p" style={{ margin: 0, fontWeight: 500 }}>
                    O Novo Tempo Conecta não é parte contratante de nenhuma transação feita entre você e o lojista.
                  </p>
                </div>
                <p className="termos-p">
                  Qualquer reclamação sobre qualidade de produtos, atrasos em entregas ou reembolsos deve ser tratada diretamente com o estabelecimento responsável. Não possuímos ingerência sobre o estoque ou logística dos anunciantes.
                </p>
              </div>

              {/* 4. PROPRIEDADE INTELECTUAL */}
              <div className="termos-section">
                <div className="termos-section-title">
                  <div className="termos-section-icon" style={{ background: "rgba(124,58,237,0.1)" }}>
                    <Lock size={16} color="#7c3aed" />
                  </div>
                  4. Propriedade Intelectual
                </div>
                <p className="termos-p">
                  Toda a interface, logotipos, códigos-fonte e design do "Novo Tempo Conecta" são de propriedade exclusiva de seus desenvolvedores. É proibida a reprodução, cópia ou engenharia reversa de qualquer elemento da plataforma sem autorização expressa.
                </p>
              </div>

              {/* 5. LINKS DE TERCEIROS */}
              <div className="termos-section">
                <div className="termos-section-title">
                  <div className="termos-section-icon" style={{ background: "rgba(0,0,0,0.05)" }}>
                    <ExternalLink size={16} color="#000" />
                  </div>
                  5. Links para Sites Externos
                </div>
                <p className="termos-p">
                  Nossos anúncios podem conter links para WhatsApp, Instagram ou sites próprios de empresas. Não controlamos as políticas de privacidade desses sites terceiros e não nos responsabilizamos por conteúdos ou vírus em links externos.
                </p>
              </div>

              {/* 6. DISPONIBILIDADE DO SISTEMA */}
              <div className="termos-section">
                <div className="termos-section-title">
                  <div className="termos-section-icon" style={{ background: "rgba(0,204,255,0.1)" }}>
                    <Clock size={16} color="#00CCFF" />
                  </div>
                  6. Estabilidade e Manutenção
                </div>
                <p className="termos-p">
                  Embora busquemos manter a plataforma 24/7 online, o serviço pode ser interrompido para manutenções programadas ou devido a falhas de servidores externos. Não garantimos que a plataforma estará livre de erros ou interrupções.
                </p>
              </div>

              {/* 7. FORO JURÍDICO */}
              <div className="termos-section">
                <div className="termos-section-title">
                  <div className="termos-section-icon" style={{ background: "rgba(239,68,68,0.1)" }}>
                    <Gavel size={16} color="#ef4444" />
                  </div>
                  7. Lei Aplicável e Foro
                </div>
                <p className="termos-p">
                  Estes Termos são regidos pelas leis da República Federativa do Brasil. Para dirimir quaisquer controvérsias oriundas deste contrato, as partes elegem o Foro da Comarca de Timon, Estado do Maranhão, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
                </p>
              </div>

              {/* FINAL NOTE */}
              <div className="termos-section">
                <div className="termos-section-title">
                  <div className="termos-section-icon" style={{ background: "rgba(247,176,0,0.1)" }}>
                    <MessageSquare size={16} color="#F7B000" />
                  </div>
                  Dúvidas e Contato
                </div>
                <p className="termos-p">
                  Caso tenha dúvidas sobre estes termos, entre em contato através do e-mail oficial: <strong>contato@novotempoconecta.com.br</strong>.
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