"use client"

import { MapPin, FileText, Shield, Heart, ArrowRight, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .ftr {
    font-family: 'DM Sans', sans-serif;
    --navy: #002240;
    --navy2: #001830;
    --gold: #F7B000;
    --cyan: #00CCFF;
  }

  .ftr-main {
    background: var(--navy2);
    border-top: 1px solid rgba(0,204,255,0.1);
    padding: 4rem 1.5rem 0;
  }

  .ftr-grid {
    max-width: 1200px; margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
    padding-bottom: 3.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  /* BRAND COL */
  .ftr-brand-desc {
    font-size: 0.875rem; 
    color: #ffffff; 
    line-height: 1.75; margin: 1rem 0 1.5rem;
    font-weight: 400; max-width: 260px;
  }

  .ftr-social {
    display: flex; gap: 8px;
  }

  .ftr-social-btn {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    color: #ffffff;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    text-decoration: none;
  }

  .ftr-social-btn:hover {
    background: rgba(0,204,255,0.2);
    border-color: var(--cyan);
    color: var(--cyan);
  }

  /* COLS */
  .ftr-col-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.09em; text-transform: uppercase;
    color: #ffffff; 
    margin-bottom: 1.2rem;
  }

  .ftr-links {
    display: flex; flex-direction: column; gap: 10px;
  }

  .ftr-link {
    font-size: 0.875rem; 
    color: #ffffff; 
    text-decoration: none; font-weight: 400;
    display: flex; align-items: center; gap: 6px;
    transition: color 0.2s, opacity 0.2s;
  }

  .ftr-link:hover { opacity: 0.8; color: var(--cyan); }

  .ftr-link-icon { color: #ffffff; opacity: 1; }

  /* BOTTOM */
  .ftr-bottom {
    max-width: 1200px; margin: 0 auto;
    padding: 1.5rem 0;
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem;
  }

  .ftr-copyright {
    font-size: 0.78rem; 
    color: #ffffff; 
  }

  @media (max-width: 960px) {
    .ftr-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
  }

  @media (max-width: 560px) {
    .ftr-grid { grid-template-columns: 1fr; }
    .ftr-bottom { flex-direction: column; text-align: center; gap: 6px; }
  }
`;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: footerStyles }} />

      <footer className="ftr">
        <div className="ftr-main">
          <div className="ftr-grid">

            {/* BRAND */}
            <div>
              <div style={{ marginBottom: 15 }}>
                <Image
                  src="/logo.png"
                  alt="Novo Tempo Conecta"
                  width={150}
                  height={42}
                  priority
                />
              </div>
              <p className="ftr-brand-desc">
                Fortalecendo a economia local e conectando nossa comunidade através da tecnologia.
              </p>
              <div className="ftr-social">
                {/* Ícone de WhatsApp adicionado */}
                <a href="https://wa.me/SEUNUMERO" target="_blank" rel="noopener noreferrer" className="ftr-social-btn" aria-label="WhatsApp">
                  <MessageCircle size={18} />
                </a>
                <a href="/contato" className="ftr-social-btn" aria-label="Email">
                  <Mail size={15} />
                </a>
              </div>
            </div>

            {/* COMUNIDADE */}
            <div>
              <div className="ftr-col-title">Para a Comunidade</div>
              <div className="ftr-links">
                <Link href="/busca" className="ftr-link">
                  <ArrowRight size={12} className="ftr-link-icon" />
                  Buscar Negócios
                </Link>
                <Link href="/mapa" className="ftr-link">
                  <MapPin size={12} className="ftr-link-icon" />
                  Mapa Interativo
                </Link>
                <Link href="/empreendimento-solidario" className="ftr-link">
                  <Heart size={12} className="ftr-link-icon" />
                  Economia Solidária
                </Link>
              </div>
            </div>

            {/* EMPREENDEDORES */}
            <div>
              <div className="ftr-col-title">Para Empreendedores</div>
              <div className="ftr-links">
                <Link href="/cadastro-emp" className="ftr-link">
                  <ArrowRight size={12} className="ftr-link-icon" />
                  Cadastrar Negócio
                </Link>
                <Link href="/contato" className="ftr-link">
                  <Mail size={12} className="ftr-link-icon" />
                  Contato
                </Link>
                <Link href="/sobre" className="ftr-link">
                  <ArrowRight size={12} className="ftr-link-icon" />
                  Sobre o Projeto
                </Link>
              </div>
            </div>

            {/* LEGAL */}
            <div>
              <div className="ftr-col-title">Legal</div>
              <div className="ftr-links">
                <Link href="/termos-de-uso" className="ftr-link">
                  <FileText size={12} className="ftr-link-icon" />
                  Termos de Uso
                </Link>
                <Link href="/politica-de-privacidade" className="ftr-link">
                  <Shield size={12} className="ftr-link-icon" />
                  Política de Privacidade
                </Link>
              </div>
            </div>

          </div>

          <div className="ftr-bottom">
            <div className="ftr-copyright">
              &copy; {currentYear} Novo Tempo Conecta. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer;