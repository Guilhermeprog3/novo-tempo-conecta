import { MapPin, FileText, Shield, Heart, ArrowRight, Instagram, Facebook, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <>
      <style>{`
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
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* BRAND COL */
        .ftr-brand-desc {
          font-size: 0.875rem; color: rgba(255,255,255,0.45);
          line-height: 1.75; margin: 1rem 0 1.5rem;
          font-weight: 300; max-width: 260px;
        }

        .ftr-social {
          display: flex; gap: 8px;
        }

        .ftr-social-btn {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.5);
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          text-decoration: none;
        }

        .ftr-social-btn:hover {
          background: rgba(0,204,255,0.1);
          border-color: rgba(0,204,255,0.3);
          color: var(--cyan);
        }

        /* COLS */
        .ftr-col-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 0.09em; text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 1.2rem;
        }

        .ftr-links {
          display: flex; flex-direction: column; gap: 10px;
        }

        .ftr-link {
          font-size: 0.875rem; color: rgba(255,255,255,0.55);
          text-decoration: none; font-weight: 400;
          display: flex; align-items: center; gap: 6px;
          transition: color 0.2s;
        }

        .ftr-link:hover { color: #fff; }

        .ftr-link-icon { opacity: 0.5; transition: opacity 0.2s; }
        .ftr-link:hover .ftr-link-icon { opacity: 1; }

        /* BOTTOM */
        .ftr-bottom {
          max-width: 1200px; margin: 0 auto;
          padding: 1.5rem 0;
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem;
        }

        .ftr-copyright {
          font-size: 0.78rem; color: rgba(255,255,255,0.25);
        }

        .ftr-made {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.78rem; color: rgba(255,255,255,0.25);
        }

        .ftr-made span { color: #E91E8C; }

        .ftr-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(0,204,255,0.08);
          border: 1px solid rgba(0,204,255,0.15);
          color: rgba(0,204,255,0.6);
          padding: 3px 10px; border-radius: 100px;
          font-size: 0.68rem; font-weight: 600; letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        @media (max-width: 960px) {
          .ftr-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }

        @media (max-width: 560px) {
          .ftr-grid { grid-template-columns: 1fr; }
          .ftr-bottom { flex-direction: column; text-align: center; gap: 6px; }
        }
      `}</style>

      <footer className="ftr">
        <div className="ftr-main">
          <div className="ftr-grid">

            {/* BRAND */}
            <div>
              <div style={{ marginBottom: 4 }}>
                <Image
                  src="/logo.png"
                  alt="Novo Tempo Conecta"
                  width={150}
                  height={42}
                />
              </div>
              <p className="ftr-brand-desc">
                Fortalecendo a economia local e conectando nossa comunidade. Uma iniciativa do IFMA Campus Timon.
              </p>
              <div className="ftr-social">
                <a href="#" className="ftr-social-btn" aria-label="Instagram">
                  <Instagram size={15} />
                </a>
                <a href="#" className="ftr-social-btn" aria-label="Facebook">
                  <Facebook size={15} />
                </a>
                <a href="/contato" className="ftr-social-btn" aria-label="Email">
                  <Mail size={15} />
                </a>
              </div>
            </div>

            {/* MORADORES */}
            <div>
              <div className="ftr-col-title">Para Moradores</div>
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

            {/* EMPRESÁRIOS */}
            <div>
              <div className="ftr-col-title">Para Empresários</div>
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
              <div style={{ marginTop: "1.5rem" }}>
                <div className="ftr-badge">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                  IFMA Campus Timon
                </div>
              </div>
            </div>

          </div>

          <div className="ftr-bottom">
            <div className="ftr-copyright">
              &copy; 2025 Novo Tempo Conecta. Todos os direitos reservados.
            </div>
            <div className="ftr-made">
              Feito com <span>♥</span> pelo IFMA
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}