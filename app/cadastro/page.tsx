"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Loader2, AlertTriangle, Info, UserPlus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Header } from "@/components/navigation/header"
import { AUTH_CSS } from "../../components/Auth"

export default function CadastroPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', terms: false })

  const set = (k: string, v: any) => setFormData(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErrors({}); setLoading(true)
    if (!formData.terms) { setErrors({ form: "Você deve aceitar os termos de uso." }); setLoading(false); return }
    if (formData.password !== formData.confirmPassword) { setErrors({ confirmPassword: "As senhas não coincidem!" }); setLoading(false); return }
    try {
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      await setDoc(doc(db, "users", cred.user.uid), { uid: cred.user.uid, name: formData.name, email: formData.email, phone: formData.phone, role: 'user', createdAt: new Date() })
      localStorage.setItem("user", JSON.stringify({ name: formData.name, email: formData.email, avatar: null }))
      localStorage.setItem("userType", "user")
      router.push('/')
    } catch (err: any) {
      const e: Record<string, string> = {}
      if (err.code === 'auth/email-already-in-use') e.email = "Este e-mail já está em uso."
      else if (err.code === 'auth/weak-password') e.password = "Mínimo 6 caracteres."
      else e.form = "Ocorreu um erro inesperado. Tente novamente."
      setErrors(e)
    } finally { setLoading(false) }
  }

  return (
    <>
      <style>{AUTH_CSS}</style>
      <div className="auth-page">
        <Header />
        <div className="auth-bg">
          <div className="auth-orb1" /><div className="auth-orb2" /><div className="auth-grid" />

          <div className="auth-card auth-card-wide">
            {/* TOP */}
            <div className="auth-card-top">
              <div className="auth-card-top-orb" />
              <div className="auth-icon-wrap" style={{ background: "rgba(247,176,0,0.1)", border: "1px solid rgba(247,176,0,0.2)" }}>
                <UserPlus size={25} color="#F7B000" />
              </div>
              <div className="auth-eyebrow">Novo Tempo Conecta</div>
              <div className="auth-title">Criar sua conta</div>
              <div className="auth-subtitle">Junte-se à comunidade e conecte-se com o comércio local</div>
            </div>

            {/* BODY */}
            <div className="auth-body">
              <form onSubmit={handleSubmit}>

                {/* DADOS PESSOAIS */}
                <div className="auth-section-label">
                  <Info size={12} /> Dados Pessoais
                </div>
                <div className="auth-form-grid cols2" style={{ marginBottom: "1rem" }}>
                  <div className="auth-field">
                    <label className="auth-label">Nome completo *</label>
                    <div className="auth-input-wrap">
                      <User size={14} className="ai" />
                      <input className="auth-input" type="text" placeholder="Seu nome completo" required value={formData.name} onChange={e => set('name', e.target.value)} />
                    </div>
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Telefone *</label>
                    <div className="auth-input-wrap">
                      <Phone size={14} className="ai" />
                      <input className="auth-input" type="tel" placeholder="(11) 99999-9999" required value={formData.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="auth-field" style={{ marginBottom: "0.5rem" }}>
                  <label className="auth-label">E-mail *</label>
                  <div className="auth-input-wrap">
                    <Mail size={14} className="ai" />
                    <input className="auth-input" type="email" placeholder="seu@email.com" required value={formData.email} onChange={e => set('email', e.target.value)} />
                  </div>
                  {errors.email && <div className="auth-field-err"><AlertTriangle size={11} />{errors.email}</div>}
                </div>

                <div className="auth-sep" />

                {/* SEGURANÇA */}
                <div className="auth-section-label">
                  <Lock size={12} /> Segurança
                </div>
                <div className="auth-form-grid cols2" style={{ marginBottom: "1.5rem" }}>
                  <div className="auth-field">
                    <label className="auth-label">Senha *</label>
                    <div className="auth-input-wrap">
                      <Lock size={14} className="ai" />
                      <input className="auth-input pr" type={showPass ? "text" : "password"} placeholder="Mínimo 6 caracteres" required value={formData.password} onChange={e => set('password', e.target.value)} />
                      <button type="button" className="auth-eye-btn" onClick={() => setShowPass(p => !p)}>
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {errors.password && <div className="auth-field-err"><AlertTriangle size={11} />{errors.password}</div>}
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Confirmar senha *</label>
                    <div className="auth-input-wrap">
                      <Lock size={14} className="ai" />
                      <input className="auth-input pr" type={showConf ? "text" : "password"} placeholder="Repita sua senha" required value={formData.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
                      <button type="button" className="auth-eye-btn" onClick={() => setShowConf(p => !p)}>
                        {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <div className="auth-field-err"><AlertTriangle size={11} />{errors.confirmPassword}</div>}
                  </div>
                </div>

                {/* TERMS */}
                <div className="auth-terms" style={{ marginBottom: "1.4rem" }}>
                  <Checkbox
                    className="border-[rgba(255,255,255,0.18)] data-[state=checked]:bg-[#00CCFF] data-[state=checked]:border-[#00CCFF] mt-0.5 flex-shrink-0"
                    checked={formData.terms}
                    onCheckedChange={v => set('terms', !!v)}
                  />
                  <span>
                    Concordo com os{" "}
                    <Link href="/termos-de-uso" target="_blank" className="auth-lnk">Termos de Uso</Link>
                    {" "}e a{" "}
                    <Link href="/politica-de-privacidade" target="_blank" className="auth-lnk">Política de Privacidade</Link>
                  </span>
                </div>

                {errors.form && (
                  <div className="auth-error" style={{ marginBottom: "1rem" }}>
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} /> {errors.form}
                  </div>
                )}

                <button type="submit" className="auth-btn auth-btn-gold" disabled={loading}>
                  {loading ? <Loader2 size={17} style={{ animation: "auth-spin 1s linear infinite" }} /> : <UserPlus size={16} />}
                  {loading ? "Criando conta..." : "Criar minha conta"}
                </button>
              </form>

              <div className="auth-divider" style={{ marginTop: "1.8rem" }}>
                <span className="auth-divider-text">Já tem conta?</span>
              </div>
              <div className="auth-foot">
                <Link href="/login">Faça login aqui</Link><br />
                É empresário? <Link href="/cadastro-emp">Cadastre seu negócio</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}