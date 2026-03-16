"use client"

import { useState, useEffect } from "react"
import { Mail, Phone, User, Book, MessageSquare, Send } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { AUTH_CSS } from "../../components/Auth"

export default function ContatoPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      {isMounted && <style dangerouslySetInnerHTML={{ __html: AUTH_CSS }} />}
      
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
              <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#00CCFF" }}>Atendimento</span>
            </div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem,4vw,2.4rem)", color: "#ffffff", marginBottom: 8 }}>Fale Conosco</div>
            {/* Texto alterado de cinza para Branco Sólido */}
            <div style={{ fontSize: "0.9rem", color: "#ffffff", maxWidth: 480, margin: "0 auto" }}>Preencha o formulário ou utilize um dos nossos outros canais de atendimento.</div>
          </div>
        </div>

        <main style={{ flex: 1, background: "#F4F1EC", padding: "3rem 1.5rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "3fr 2fr", gap: "1.5rem", alignItems: "start" }}>

            {/* FORM CARD */}
            <div style={{ background: "#fff", borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,34,64,0.08)", border: "1px solid #f0ece5" }}>
              <div style={{ background: "#002240", padding: "1.6rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#ffffff", marginBottom: 4 }}>Envie uma mensagem</div>
                {/* Texto alterado de cinza para Branco Sólido */}
                <div style={{ fontSize: "0.8rem", color: "#ffffff" }}>Nossa equipe retornará o mais breve possível.</div>
              </div>
              <div style={{ padding: "2rem" }}>
                <form style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {[
                      { id: "name", label: "Seu Nome", placeholder: "Seu nome completo", Icon: User },
                      { id: "email", label: "Seu E-mail", placeholder: "seu@email.com", Icon: Mail, type: "email" },
                    ].map(f => (
                      <div key={f.id}>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#002240", marginBottom: 5 }}>{f.label}</label>
                        <div style={{ position: "relative" }}>
                          <f.Icon size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#002240", opacity: 0.5, pointerEvents: "none" }} />
                          <input id={f.id} type={f.type || "text"} placeholder={f.placeholder} required style={{ width: "100%", height: 42, paddingLeft: 36, paddingRight: 12, background: "#f8f6f2", border: "1.5px solid #ede9e0", borderRadius: 11, fontSize: "0.875rem", fontFamily: "'DM Sans',sans-serif", color: "#1a2a3a", outline: "none" }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#002240", marginBottom: 5 }}>Assunto</label>
                    <div style={{ position: "relative" }}>
                      <Book size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#002240", opacity: 0.5, pointerEvents: "none" }} />
                      <input placeholder="Ex: Dúvida sobre cadastro" required style={{ width: "100%", height: 42, paddingLeft: 36, paddingRight: 12, background: "#f8f6f2", border: "1.5px solid #ede9e0", borderRadius: 11, fontSize: "0.875rem", fontFamily: "'DM Sans',sans-serif", color: "#1a2a3a", outline: "none" }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#002240", marginBottom: 5 }}>Mensagem</label>
                    <div style={{ position: "relative" }}>
                      <MessageSquare size={14} style={{ position: "absolute", left: 12, top: 13, color: "#002240", opacity: 0.5, pointerEvents: "none" }} />
                      <textarea placeholder="Descreva sua dúvida ou sugestão..." required style={{ width: "100%", minHeight: 120, paddingLeft: 36, paddingRight: 12, paddingTop: 11, paddingBottom: 11, background: "#f8f6f2", border: "1.5px solid #ede9e0", borderRadius: 11, fontSize: "0.875rem", fontFamily: "'DM Sans',sans-serif", color: "#1a2a3a", outline: "none", resize: "vertical" }} />
                    </div>
                  </div>

                  <button type="submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", height: 48, background: "#002240", color: "#ffffff", border: "none", borderRadius: 13, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.92rem", cursor: "pointer" }}>
                    <Send size={15} /> Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "#002240", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 20px rgba(0,34,64,0.14)" }}>
                <div style={{ padding: "1.4rem 1.6rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.97rem", fontWeight: 700, color: "#ffffff", marginBottom: 3 }}>Outros canais</div>
                  {/* Texto alterado para Branco Sólido */}
                  <div style={{ fontSize: "0.78rem", color: "#ffffff" }}>Você também pode nos encontrar através dos canais abaixo.</div>
                </div>
                <div style={{ padding: "0.5rem 1.6rem 1.4rem" }}>
                  {[
                    { Icon: Mail, label: "E-mail", desc: "Para suporte geral e dúvidas.", val: "contato@novotempoconecta.com.br", href: "mailto:contato@novotempoconecta.com.br" },
                    { Icon: Phone, label: "Telefone / WhatsApp", desc: "Suporte durante horário comercial.", val: "(11) 99999-8888", href: "tel:+5511999998888" },
                  ].map((item, idx) => (
                    <div key={item.label} className="auth-contact-item" style={{ display: 'flex', gap: 12, marginTop: '1rem', borderBottom: idx === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none', paddingBottom: idx === 0 ? '1rem' : '0' }}>
                      <div className="auth-contact-icon">
                        <item.Icon size={18} color="#00CCFF" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>{item.label}</div>
                        {/* Descrição alterada para Branco Sólido */}
                        <div style={{ fontSize: '0.72rem', color: '#ffffff', marginBottom: 2 }}>{item.desc}</div>
                        <a href={item.href} style={{ color: "#00CCFF", textDecoration: "none", fontSize: '0.85rem', fontWeight: 500 }}>{item.val}</a>
                      </div>
                    </div>
                  ))}
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