"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Mail, Lock, Loader2, AlertTriangle, LogIn } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Header } from "@/components/navigation/header"
import { AUTH_CSS } from "./AUTH_CSS"

export default function LoginPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const uid = cred.user.uid

      const bizSnap = await getDoc(doc(db, "businesses", uid))
      if (bizSnap.exists()) {
        const d = bizSnap.data()
        localStorage.setItem("user", JSON.stringify({ name: d.businessName, email: d.email, avatar: d.avatar || null }))
        localStorage.setItem("userType", "business")
        router.push('/empresario/dashboard'); return
      }

      const userSnap = await getDoc(doc(db, "users", uid))
      if (userSnap.exists()) {
        const d = userSnap.data()
        localStorage.setItem("user", JSON.stringify({ name: d.name, email: d.email, avatar: d.avatar || null, role: d.role || 'user' }))
        if (d.role === 'admin') {
          localStorage.setItem("userType", "admin"); router.push('/admin/dashboard')
        } else {
          localStorage.setItem("userType", "user"); router.push('/')
        }
        return
      }
      throw new Error("no-profile")
    } catch (err: any) {
      const code = err.code || err.message
      if (code === 'auth/user-disabled') setError("Esta conta foi desativada.")
      else if (code === 'auth/network-request-failed') setError("Sem conexão com a internet.")
      else if (code === 'no-profile') setError("Perfil não encontrado. Entre em contato com o suporte.")
      else setError("E-mail ou senha inválidos.")
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
            {/* TOP */}
            <div className="auth-card-top">
              <div className="auth-card-top-orb" />
              <div className="auth-icon-wrap" style={{ background: "rgba(0,204,255,0.1)", border: "1px solid rgba(0,204,255,0.18)" }}>
                <Lock size={25} color="#00CCFF" />
              </div>
              <div className="auth-eyebrow">Área do Usuário</div>
              <div className="auth-title">Bem-vindo de volta</div>
              <div className="auth-subtitle">Acesse sua conta para continuar</div>
            </div>

            {/* BODY */}
            <div className="auth-body">
              <form onSubmit={handleSubmit}>
                <div className="auth-form-grid" style={{ gap: "1rem", marginBottom: "0.2rem" }}>
                  {/* Email */}
                  <div className="auth-field">
                    <label className="auth-label">E-mail</label>
                    <div className="auth-input-wrap">
                      <Mail size={14} className="ai" />
                      <input className="auth-input" type="email" placeholder="seu@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>
                  {/* Senha */}
                  <div className="auth-field">
                    <label className="auth-label">Senha</label>
                    <div className="auth-input-wrap">
                      <Lock size={14} className="ai" />
                      <input className="auth-input pr" type={showPass ? "text" : "password"} placeholder="Sua senha" required value={password} onChange={e => setPassword(e.target.value)} />
                      <button type="button" className="auth-eye-btn" onClick={() => setShowPass(p => !p)}>
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="auth-row">
                  <label className="auth-check-lbl">
                    <Checkbox className="border-[rgba(255,255,255,0.18)] data-[state=checked]:bg-[#00CCFF] data-[state=checked]:border-[#00CCFF]" />
                    Lembrar de mim
                  </label>
                  <Link href="/esqueceu-senha" className="auth-forgot">Esqueceu a senha?</Link>
                </div>

                {error && (
                  <div className="auth-error" style={{ marginBottom: "1rem" }}>
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} /> {error}
                  </div>
                )}

                <button type="submit" className="auth-btn auth-btn-cyan" disabled={loading}>
                  {loading ? <Loader2 size={17} style={{ animation: "auth-spin 1s linear infinite" }} /> : <LogIn size={16} />}
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>

              <div className="auth-divider" style={{ marginTop: "1.8rem" }}>
                <span className="auth-divider-text">Nova por aqui?</span>
              </div>

              <div className="auth-foot">
                É morador? <Link href="/cadastro">Cadastre-se aqui</Link><br />
                É empresário? <Link href="/cadastro-emp">Cadastre seu negócio</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}