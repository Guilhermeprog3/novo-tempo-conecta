"use client"

import { Mail, Phone, MapPin, User, Book, MessageSquare, Send, ArrowRight } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { AUTH_CSS } from "../../components/Auth"

export default function ContatoPage() {
  return (
    <>
      <style>{AUTH_CSS}</style>
      <div className="auth-page" style={{ background: "#F4F1EC" }}>
        <Header title="Fale Conosco" subtitle="Estamos aqui para ajudar" />

        {/* HERO */}
        <div style={{ background: "#001830", padding: "3rem 2rem 3.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", borderRadius: "50%", width: 500, height: 500, background: "#00CCFF", opacity: 0.06, filter: "blur(100px)", top: -200, right: -100, pointerEvents: "none" }} />
          <div style={{ position: "absolute", borderRadius: "50%", width: 400, height: 400, background: "#F7B000", opacity: 0.05, filter: "blur(90px)", bottom: -150, left: -80, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.016) 1px,transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,204,255,0.1)", border: "1px solid rgba(0,204,255,0.2)", borderRadius: 100, padding: "4px 14px", marginBottom: 14 }}>
              <MessageSquare size={12} color="#00CCFF" />
              <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(0,204,255,0.8)" }}>Atendimento</span>
            </div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem,4vw,2.4rem)", color: "#fff", marginBottom: 8 }}>Fale Conosco</div>
            <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "0 auto" }}>Preencha o formulário ou utilize um dos nossos outros canais de atendimento.</div>
          </div>
        </div>

        <main style={{ flex: 1, background: "#F4F1EC", padding: "3rem 1.5rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "3fr 2fr", gap: "1.5rem", alignItems: "start" }}>

            {/* FORM CARD */}
            <div style={{ background: "#fff", borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,34,64,0.08)", border: "1px solid #f0ece5" }}>
              <div style={{ background: "#002240", padding: "1.6rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>Envie uma mensagem</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>Nossa equipe retornará o mais breve possível.</div>
              </div>
              <div style={{ padding: "2rem" }}>
                <form style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {[
                      { id: "name", label: "Seu Nome", placeholder: "Seu nome completo", Icon: User },
                      { id: "email", label: "Seu E-mail", placeholder: "seu@email.com", Icon: Mail, type: "email" },
                    ].map(f => (
                      <div key={f.id}>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#5a6878", marginBottom: 5 }}>{f.label}</label>
                        <div style={{ position: "relative" }}>
                          <f.Icon size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#b0bec5", pointerEvents: "none" }} />
                          <input id={f.id} type={f.type || "text"} placeholder={f.placeholder} required style={{ width: "100%", height: 42, paddingLeft: 36, paddingRight: 12, background: "#f8f6f2", border: "1.5px solid #ede9e0", borderRadius: 11, fontSize: "0.875rem", fontFamily: "'DM Sans',sans-serif", color: "#1a2a3a", outline: "none" }}
                            onFocus={e => (e.currentTarget.style.borderColor = "#00CCFF")}
                            onBlur={e => (e.currentTarget.style.borderColor = "#ede9e0")} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#5a6878", marginBottom: 5 }}>Assunto</label>
                    <div style={{ position: "relative" }}>
                      <Book size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#b0bec5", pointerEvents: "none" }} />
                      <input placeholder="Ex: Dúvida sobre cadastro" required style={{ width: "100%", height: 42, paddingLeft: 36, paddingRight: 12, background: "#f8f6f2", border: "1.5px solid #ede9e0", borderRadius: 11, fontSize: "0.875rem", fontFamily: "'DM Sans',sans-serif", color: "#1a2a3a", outline: "none" }}
                        onFocus={e => (e.currentTarget.style.borderColor = "#00CCFF")}
                        onBlur={e => (e.currentTarget.style.borderColor = "#ede9e0")} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#5a6878", marginBottom: 5 }}>Mensagem</label>
                    <div style={{ position: "relative" }}>
                      <MessageSquare size={14} style={{ position: "absolute", left: 12, top: 13, color: "#b0bec5", pointerEvents: "none" }} />
                      <textarea placeholder="Descreva sua dúvida ou sugestão..." required style={{ width: "100%", minHeight: 120, paddingLeft: 36, paddingRight: 12, paddingTop: 11, paddingBottom: 11, background: "#f8f6f2", border: "1.5px solid #ede9e0", borderRadius: 11, fontSize: "0.875rem", fontFamily: "'DM Sans',sans-serif", color: "#1a2a3a", outline: "none", resize: "vertical" }}
                        onFocus={e => (e.currentTarget.style.borderColor = "#00CCFF")}
                        onBlur={e => (e.currentTarget.style.borderColor = "#ede9e0")} />
                    </div>
                  </div>

                  <button type="submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", height: 48, background: "#002240", color: "#fff", border: "none", borderRadius: 13, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.92rem", cursor: "pointer", transition: "background 0.2s, transform 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#003060"; e.currentTarget.style.transform = "translateY(-1px)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#002240"; e.currentTarget.style.transform = "translateY(0)" }}>
                    <Send size={15} /> Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "#002240", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,34,64,0.14)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ padding: "1.4rem 1.6rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.97rem", fontWeight: 700, color: "#fff", marginBottom: 3 }}>Outros canais</div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Você também pode nos encontrar através dos canais abaixo.</div>
                </div>
                <div style={{ padding: "0.5rem 1.6rem 1.4rem" }}>
                  {[
                    { Icon: Mail, label: "E-mail", desc: "Para suporte geral e dúvidas.", val: "contato@novotempoconecta.com.br", href: "mailto:contato@novotempoconecta.com.br" },
                    { Icon: Phone, label: "Telefone / WhatsApp", desc: "Suporte durante horário comercial.", val: "(11) 99999-8888", href: "tel:+5511999998888" },
                    { Icon: MapPin, label: "Endereço", desc: "Bairro Novo Tempo", val: "São Paulo — SP, Brasil" },
                  ].map(item => (
                    <div key={item.label} className="auth-contact-item">
                      <div className="auth-contact-icon">
                        <item.Icon size={18} color="#00CCFF" />
                      </div>
                      <div>
                        <div className="auth-contact-label">{item.label}</div>
                        <div className="auth-contact-text">{item.desc}</div>
                        {item.href ? (
                          <a href={item.href} className="auth-contact-val" style={{ color: "#fff", textDecoration: "none" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#00CCFF")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#fff")}>
                            {item.val}
                          </a>
                        ) : (
                          <div className="auth-contact-val">{item.val}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* IFMA BADGE */}
              <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 16, padding: "1.2rem 1.4rem", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.6)" }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.82rem", fontWeight: 700, color: "#22c55e", marginBottom: 2 }}>Projeto IFMA</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>Desenvolvido como projeto de extensão pelo Instituto Federal do Maranhão.</div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}