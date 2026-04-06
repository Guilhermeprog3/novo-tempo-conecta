"use client"

import {
  Shield, Lock, Eye, Database, Trash2, Server, UserCheck, Mail,
  Info, Target, Globe, AlertCircle, Cookie, Clock, RefreshCw, Users
} from "lucide-react"
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

  .legal-p:last-child { margin-bottom: 0; }

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
`

const sections = [
  {
    icon: <Info size={16} color="#00CCFF" />,
    iconBg: "rgba(0,204,255,0.1)",
    title: "1. Apresentação",
    content: (
      <p className="legal-p">
        O Novo Tempo Conecta é uma plataforma digital voltada à divulgação de empreendimentos, serviços e iniciativas comunitárias do Residencial Novo Tempo com foco no fortalecimento da economia local, da cooperação comunitária e do desenvolvimento sustentável.
      </p>
    ),
  },
  {
    icon: <Database size={16} color="#F7B000" />,
    iconBg: "rgba(247,176,0,0.1)",
    title: "2. Quais dados podem ser coletados?",
    content: (
      <>
        <p className="legal-p">
          A plataforma poderá coletar dados informados diretamente pelos usuários, como nome, telefone, e-mail, nome do negócio, categoria, descrição, endereço, imagens, localização aproximada, redes sociais e demais informações necessárias à divulgação do empreendimento ou serviço.
        </p>
        <p className="legal-p">
          Também poderão ser coletados dados técnicos de navegação, como endereço IP, navegador utilizado, tipo de dispositivo, páginas acessadas, data e horário de acesso, conforme os recursos tecnológicos empregados pela plataforma.
        </p>
      </>
    ),
  },
  {
    icon: <Target size={16} color="#22c55e" />,
    iconBg: "rgba(34,197,94,0.1)",
    title: "3. Como os dados são utilizados",
    content: (
      <>
        <p className="legal-p">Os dados poderão ser utilizados para:</p>
        <ul className="legal-ul">
          <li>permitir o cadastro e a divulgação de negócios, serviços e iniciativas;</li>
          <li>facilitar o contato entre usuários e empreendedores;</li>
          <li>responder mensagens, dúvidas ou solicitações enviadas pelos usuários;</li>
          <li>melhorar o funcionamento, a navegação e a segurança da plataforma;</li>
          <li>produzir estatísticas de uso e desempenho;</li>
          <li>cumprir obrigações legais e regulatórias, quando aplicável.</li>
        </ul>
      </>
    ),
  },
  {
    icon: <Eye size={16} color="#7c3aed" />,
    iconBg: "rgba(124,58,237,0.1)",
    title: "4. Divulgação pública de informações comerciais",
    content: (
      <p className="legal-p">
        As informações fornecidas para fins de divulgação de negócios e serviços, como nome comercial, descrição da atividade, telefone de contato, imagens, horário de atendimento e localização, poderão ficar visíveis publicamente na plataforma, em razão da própria finalidade do projeto.
      </p>
    ),
  },
  {
    icon: <Globe size={16} color="#00CCFF" />,
    iconBg: "rgba(0,204,255,0.1)",
    title: "5. Compartilhamento de dados",
    content: (
      <p className="legal-p">
        O Novo Tempo Conecta não comercializa dados pessoais. O compartilhamento poderá ocorrer apenas quando necessário para a operação da plataforma, com serviços de hospedagem, armazenamento, formulários, ferramentas de análise, mapas ou outros recursos tecnológicos, sempre observadas as finalidades legítimas do projeto e medidas adequadas de proteção.
      </p>
    ),
  },
  {
    icon: <Lock size={16} color="#F7B000" />,
    iconBg: "rgba(247,176,0,0.1)",
    title: "6. Base legal para o tratamento",
    content: (
      <p className="legal-p">
        O tratamento de dados poderá ocorrer com base no consentimento do titular, no legítimo interesse, no cumprimento de obrigação legal ou regulatória e em outras hipóteses autorizadas pela legislação aplicável, especialmente pela Lei nº 13.709/2018.
      </p>
    ),
  },
  {
    icon: <Cookie size={16} color="#f97316" />,
    iconBg: "rgba(249,115,22,0.1)",
    title: "7. Cookies e tecnologias semelhantes",
    content: (
      <p className="legal-p">
        A plataforma poderá utilizar cookies e tecnologias semelhantes para funcionamento técnico, segurança, personalização da navegação e análise de desempenho. O usuário poderá, quando aplicável, gerenciar essas preferências no navegador ou nos mecanismos disponibilizados pela plataforma.
      </p>
    ),
  },
  {
    icon: <Clock size={16} color="#22c55e" />,
    iconBg: "rgba(34,197,94,0.1)",
    title: "8. Armazenamento e retenção dos dados",
    content: (
      <p className="legal-p">
        Os dados serão mantidos pelo tempo necessário para cumprir as finalidades descritas nesta Política, atender obrigações legais, preservar a segurança da plataforma e viabilizar a continuidade do serviço. Quando possível e cabível, os dados serão excluídos, anonimizados ou bloqueados.
      </p>
    ),
  },
  {
    icon: <Server size={16} color="#00CCFF" />,
    iconBg: "rgba(0,204,255,0.1)",
    title: "9. Segurança das informações",
    content: (
      <p className="legal-p">
        Serão adotadas medidas técnicas e administrativas razoáveis para proteger os dados pessoais contra acessos não autorizados, perdas, alterações, destruição ou qualquer forma de tratamento inadequado. Apesar disso, nenhum sistema digital é totalmente imune a riscos.
      </p>
    ),
  },
  {
    icon: <UserCheck size={16} color="#E91E8C" />,
    iconBg: "rgba(233,30,140,0.1)",
    title: "10. Direitos do titular",
    content: (
      <>
        <p className="legal-p">Nos termos da legislação aplicável, o titular dos dados poderá solicitar:</p>
        <ul className="legal-ul">
          <li>confirmação da existência de tratamento;</li>
          <li>acesso aos dados pessoais;</li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>informação sobre compartilhamento de dados;</li>
          <li>revogação do consentimento, quando essa for a base legal aplicável;</li>
          <li>eliminação de dados tratados com consentimento, observadas as hipóteses legais de retenção.</li>
        </ul>
      </>
    ),
  },
  {
    icon: <Users size={16} color="#7c3aed" />,
    iconBg: "rgba(124,58,237,0.1)",
    title: "11. Crianças e adolescentes",
    content: (
      <p className="legal-p">
        A plataforma não se destina ao tratamento intencional de dados pessoais de crianças e adolescentes em desacordo com a legislação. Caso seja identificada coleta inadequada, as medidas cabíveis poderão ser adotadas para remoção ou regularização dessas informações.
      </p>
    ),
  },
  {
    icon: <RefreshCw size={16} color="#22c55e" />,
    iconBg: "rgba(34,197,94,0.1)",
    title: "12. Alterações nesta Política",
    content: (
      <p className="legal-p">
        Esta Política de Privacidade poderá ser atualizada periodicamente para refletir mudanças legais, técnicas, operacionais ou institucionais. A versão vigente estará sempre disponível na plataforma.
      </p>
    ),
  },
  {
    icon: <Mail size={16} color="#F7B000" />,
    iconBg: "rgba(247,176,0,0.1)",
    title: "13. Contato sobre privacidade",
    content: (
      <p className="legal-p">
        Solicitações, dúvidas ou comunicações relacionadas à privacidade e à proteção de dados poderão ser encaminhadas pelos canais oficiais informados na plataforma.
      </p>
    ),
  },
]

export default function PoliticaPrivacidadePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
            <h1 className="legal-title">Política de Privacidade</h1>
            <p className="legal-date">Conformidade com a LGPD • Última atualização: 31 de março de 2026</p>
          </div>
        </section>

        <main className="legal-main">
          <div className="legal-card">
            <div className="legal-lead">
              <p>
                O <strong>Novo Tempo Conecta</strong> valoriza a privacidade, a transparência e o tratamento responsável das informações dos usuários. Esta Política de Privacidade explica como dados pessoais podem ser coletados, utilizados, armazenados e protegidos no contexto da plataforma.
              </p>
            </div>

            <div className="legal-body">
              {sections.map((section, i) => (
                <div className="legal-section" key={i}>
                  <div className="legal-section-title">
                    <div className="legal-section-icon" style={{ background: section.iconBg }}>
                      {section.icon}
                    </div>
                    {section.title}
                  </div>
                  {section.content}
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}