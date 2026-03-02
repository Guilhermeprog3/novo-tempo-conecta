"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Mail, Lock, Loader2, AlertTriangle, Shield, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Header } from "@/components/navigation/header"
import { AUTH_CSS } from "../../components/Auth"

export default function AdminCadastroPage() {
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' })

  const set = (k: string, v: string) => {
    setFormData(p => ({ ...p, [k]: v }))
    setErrors(p => { const n = { ...p }; delete n[k]; delete n.form; return n })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErrors({}); setLoading(true)
    const fe: Record<string, string> = {}
    if (formData.password.length < 6) fe.password = "Mínimo 6 caracteres."
    if (formData.password !== formData.confirmPassword) fe.confirmPassword = "As senhas não coincidem."
    if (Object.keys(fe).length > 0) { setErrors({ ...fe, form: "Corrija os campos acima." }); setLoading(false); return }
    try {
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      await setDoc(doc(db, "users", cred.user.uid), { uid: cred.user.uid, email: formData.email, name: "Administrador", role: "admin", createdAt: new Date() })
      setIsSuccess(true)
      setFormData({ email: '', password: '', confirmPassword: '' })
    } catch (err: any) {
      const e: Record<string, string> = {}
      if (err.code === 'auth/email-already-in-use') e.email = "Este e-mail já está em uso."
      else if (err.code === 'auth/invalid-email') e.email = "Formato de e-mail inválido."
      else if (err.code === 'auth/weak-password') e.password = "Mínimo 6 caracteres."
      else e.form = "Ocorreu um erro inesperado."
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

          <div className="auth-card">
            <div className="auth-card-top">
              <div className="auth-card-top-orb" />

              {isSuccess ? (
                <>
                  <div className="auth-success-icon">
                    <CheckCircle2 size={30} color="#22c55e" />
                  </div>
                  <div className="auth-title" style={{ fontSize: "1.4rem" }}>Admin Cadastrado!</div>
                  <div className="auth-subtitle">A nova conta de administrador foi criada com sucesso.</div>
                </>
              ) : (
                <>
                  <div className="auth-icon-wrap" style={{ background: "rgba(0,204,255,0.1)", border: "1px solid rgba(0,204,255,0.18)" }}>
                    <Shield size={25} color="#00CCFF" />
                  </div>
                  <div className="auth-eyebrow">Acesso Restrito</div>
                  <div className="auth-title">Cadastro de Admin</div>
                  <div className="auth-subtitle">Crie uma conta com permissão de administrador</div>
                </>
              )}
            </div>

            <div className="auth-body">
              {isSuccess ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Link href="/login">
                    <button className="auth-btn auth-btn-cyan"><Shield size={16} /> Ir para o Login</button>
                  </Link>
                  <button className="auth-btn auth-btn-outline" onClick={() => setIsSuccess(false)}>
                    Cadastrar outro Admin
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="auth-form-grid" style={{ gap: "1rem", marginBottom: "1.4rem" }}>
                    {/* Email */}
                    <div className="auth-field">
                      <label className="auth-label">E-mail do Administrador</label>
                      <div className="auth-input-wrap">
                        <Mail size={14} className="ai" />
                        <input className="auth-input" type="email" placeholder="admin@email.com" required value={formData.email} onChange={e => set('email', e.target.value)} />
                      </div>
                      {errors.email && <div className="auth-field-err"><AlertTriangle size={11} />{errors.email}</div>}
                    </div>

                    {/* Senha */}
                    <div className="auth-field">
                      <label className="auth-label">Senha</label>
                      <div className="auth-input-wrap">
                        <Lock size={14} className="ai" />
                        <input className="auth-input pr" type={showPass ? "text" : "password"} placeholder="Mínimo 6 caracteres" required value={formData.password} onChange={e => set('password', e.target.value)} />
                        <button type="button" className="auth-eye-btn" onClick={() => setShowPass(p => !p)}>
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {errors.password && <div className="auth-field-err"><AlertTriangle size={11} />{errors.password}</div>}
                    </div>

                    {/* Confirmar */}
                    <div className="auth-field">
                      <label className="auth-label">Confirmar Senha</label>
                      <div className="auth-input-wrap">
                        <Lock size={14} className="ai" />
                        <input className="auth-input pr" type={showConf ? "text" : "password"} placeholder="Confirme a senha" required value={formData.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
                        <button type="button" className="auth-eye-btn" onClick={() => setShowConf(p => !p)}>
                          {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <div className="auth-field-err"><AlertTriangle size={11} />{errors.confirmPassword}</div>}
                    </div>
                  </div>

                  {errors.form && (
                    <div className="auth-error" style={{ marginBottom: "1rem" }}>
                      <AlertTriangle size={14} style={{ flexShrink: 0 }} /> {errors.form}
                    </div>
                  )}

                  <button type="submit" className="auth-btn auth-btn-cyan" disabled={loading}>
                    {loading ? <Loader2 size={17} style={{ animation: "auth-spin 1s linear infinite" }} /> : <Shield size={16} />}
                    {loading ? "Cadastrando..." : "Cadastrar Administrador"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}