"use client"

import { 
  FileText, ShieldCheck, AlertCircle, UserCheck, MessageSquare, 
  AlertTriangle, Scale, Lock, Ban, Image as ImageIcon, ExternalLink,
  Gavel, Clock, Target, Users, Eye, RefreshCw
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

  .termos-p:last-child { margin-bottom: 0; }

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

const sections = [
  {
    icon: <ShieldCheck size={16} color="#00CCFF" />,
    iconBg: "rgba(0,204,255,0.1)",
    title: "1. Sobre a plataforma",
    content: (
      <p className="termos-p">
        O Novo Tempo Conecta é uma plataforma digital voltada à divulgação de negócios, serviços e iniciativas comunitárias locais. Seu propósito é ampliar a visibilidade dos empreendimentos da comunidade, facilitar conexões entre moradores e empreendedores e incentivar o desenvolvimento local sustentável.
      </p>
    ),
  },
  {
    icon: <Target size={16} color="#F7B000" />,
    iconBg: "rgba(247,176,0,0.1)",
    title: "2. Finalidade de uso",
    content: (
      <p className="termos-p">
        A plataforma destina-se à divulgação de informações sobre negócios, serviços, produtos e iniciativas comunitárias. O uso da plataforma deve ocorrer de forma ética, responsável e em conformidade com a legislação brasileira.
      </p>
    ),
  },
  {
    icon: <UserCheck size={16} color="#22c55e" />,
    iconBg: "rgba(34,197,94,0.1)",
    title: "3. Cadastro e veracidade das informações",
    content: (
      <p className="termos-p">
        Ao cadastrar informações na plataforma, o usuário declara que todos os dados fornecidos são verdadeiros, completos e atualizados, responsabilizando-se integralmente pelo conteúdo inserido, incluindo nome do negócio, descrição, contatos, imagens, localização, horários e demais informações publicadas.
      </p>
    ),
  },
  {
    icon: <AlertCircle size={16} color="#7c3aed" />,
    iconBg: "rgba(124,58,237,0.1)",
    title: "4. Responsabilidade do anunciante ou prestador de serviço",
    content: (
      <p className="termos-p">
        Cada anunciante, empreendedor ou prestador de serviço é exclusivamente responsável pelas informações divulgadas, pela qualidade dos produtos e serviços oferecidos, pelos preços praticados, pelas condições negociadas e pelo cumprimento das obrigações assumidas perante os usuários.
      </p>
    ),
  },
  {
    icon: <Eye size={16} color="#00CCFF" />,
    iconBg: "rgba(0,204,255,0.1)",
    title: "5. Papel da plataforma",
    content: (
      <>
        <p className="termos-p">
          O Novo Tempo Conecta atua como ambiente de divulgação e conexão entre as partes. A plataforma não realiza intermediação financeira, não processa pagamentos e não participa diretamente das contratações realizadas entre usuários e anunciantes, salvo disposição futura expressamente informada.
        </p>
      </>
    ),
  },
  {
    icon: <Ban size={16} color="#ef4444" />,
    iconBg: "rgba(239,68,68,0.1)",
    title: "6. Condutas proibidas",
    content: (
      <>
        <p className="termos-p">Não será permitido utilizar a plataforma para:</p>
        <ul className="termos-ul">
          <li>publicar informações falsas ou enganosas;</li>
          <li>divulgar conteúdo ofensivo, discriminatório, ilícito ou fraudulento;</li>
          <li>violar direitos autorais, marcas ou direitos de terceiros;</li>
          <li>praticar atos que comprometam a segurança, a estabilidade ou o funcionamento da plataforma;</li>
          <li>utilizar a plataforma para finalidades contrárias à sua proposta comunitária e social.</li>
        </ul>
      </>
    ),
  },
  {
    icon: <ImageIcon size={16} color="#F7B000" />,
    iconBg: "rgba(247,176,0,0.1)",
    title: "7. Conteúdo enviado pelos usuários",
    content: (
      <p className="termos-p">
        O usuário que inserir textos, imagens, logotipos ou outros materiais declara possuir os direitos ou autorizações necessários para sua utilização. Ao publicar esse conteúdo na plataforma, autoriza sua exibição no ambiente digital do Novo Tempo Conecta para fins de divulgação institucional e comunitária relacionados ao projeto.
      </p>
    ),
  },
  {
    icon: <AlertTriangle size={16} color="#f97316" />,
    iconBg: "rgba(249,115,22,0.1)",
    title: "8. Moderação e remoção de conteúdo",
    content: (
      <p className="termos-p">
        O Novo Tempo Conecta poderá, a qualquer momento e sem aviso prévio, revisar, suspender, editar ou remover conteúdos que estejam em desacordo com estes Termos, com a legislação aplicável ou com a finalidade da plataforma.
      </p>
    ),
  },
  {
    icon: <Clock size={16} color="#00CCFF" />,
    iconBg: "rgba(0,204,255,0.1)",
    title: "9. Disponibilidade da plataforma",
    content: (
      <p className="termos-p">
        Serão empregados esforços razoáveis para manter a plataforma acessível e funcional. No entanto, não há garantia de disponibilidade contínua, ausência de falhas, interrupções temporárias ou indisponibilidades por razões técnicas, operacionais, de manutenção ou força maior.
      </p>
    ),
  },
  {
    icon: <ExternalLink size={16} color="#475569" />,
    iconBg: "rgba(0,0,0,0.05)",
    title: "10. Links externos e serviços de terceiros",
    content: (
      <p className="termos-p">
        A plataforma poderá conter links para aplicativos, redes sociais, serviços de mensagens, mapas ou páginas externas. O Novo Tempo Conecta não se responsabiliza pelo conteúdo, funcionamento, políticas ou práticas adotadas por terceiros.
      </p>
    ),
  },
  {
    icon: <Lock size={16} color="#7c3aed" />,
    iconBg: "rgba(124,58,237,0.1)",
    title: "11. Privacidade e proteção de dados",
    content: (
      <p className="termos-p">
        O tratamento de dados pessoais realizado no âmbito da plataforma observará a legislação aplicável, especialmente a Lei Geral de Proteção de Dados Pessoais (LGPD). Informações mais detalhadas estão disponíveis na Política de Privacidade.
      </p>
    ),
  },
  {
    icon: <RefreshCw size={16} color="#22c55e" />,
    iconBg: "rgba(34,197,94,0.1)",
    title: "12. Alterações nos Termos de Uso",
    content: (
      <p className="termos-p">
        Os presentes Termos poderão ser atualizados periodicamente para refletir mudanças legais, técnicas, operacionais ou institucionais. A versão vigente estará sempre disponível para consulta na própria plataforma.
      </p>
    ),
  },
  {
    icon: <MessageSquare size={16} color="#F7B000" />,
    iconBg: "rgba(247,176,0,0.1)",
    title: "13. Contato",
    content: (
      <p className="termos-p">
        Em caso de dúvidas, solicitações ou comunicações relacionadas a estes Termos de Uso, o usuário poderá utilizar os canais oficiais disponibilizados pela equipe responsável pela plataforma.
      </p>
    ),
  },
  {
    icon: <Gavel size={16} color="#ef4444" />,
    iconBg: "rgba(239,68,68,0.1)",
    title: "14. Legislação aplicável",
    content: (
      <p className="termos-p">
        Estes Termos de Uso são regidos pela legislação brasileira. Sempre que possível, eventuais conflitos deverão ser resolvidos de forma amigável. Não sendo possível, será competente o foro legalmente aplicável.
      </p>
    ),
  },
]

export default function TermosDeUsoPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
            <p className="termos-date">Última atualização: 31 de março de 2026</p>
          </div>
        </section>

        <main className="termos-main">
          <div className="termos-card">
            <div className="termos-lead">
              <p>
                Bem-vindo ao <strong>Novo Tempo Conecta</strong>. Estes Termos de Uso regulam o acesso e a utilização da plataforma e ao acessar ou utilizar a plataforma, o usuário declara que leu, compreendeu e concorda com os presentes Termos de Uso.
              </p>
            </div>

            <div className="termos-body">
              {sections.map((section, i) => (
                <div className="termos-section" key={i}>
                  <div className="termos-section-title">
                    <div className="termos-section-icon" style={{ background: section.iconBg }}>
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