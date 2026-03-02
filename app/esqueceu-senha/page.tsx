"use client"

import {
  Mail, ArrowLeft, Loader2, KeyRound,
  AlertTriangle, CheckCircle2
} from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Header } from "@/components/navigation/header"

const PASS_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.pass {
  --navy: #002240;
  --gold: #F7B000;
  --cyan: #00CCFF;
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  background: var(--navy);
  display: flex; flex-direction: column;
}

/* bg */
.pass-bg {
  position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0;
}
.pass-orb1 {
  position: absolute; border-radius: 50%;
  width: 600px; height: 600px;
  background: var(--cyan); opacity: 0.055; filter: blur(110px);
  top: -150px; right: -180px;
}
.pass-orb2 {
  position: absolute; border-radius: 50%;
  width: 450px; height: 450px;
  background: var(--gold); opacity: 0.06; filter: blur(90px);
  bottom: -120px; left: -120px;
}
.pass-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 56px 56px;
}

/* layout */
.pass-content {
  flex: 1; display: flex; align-items: center;
  justify-content: center; padding: 2.5rem 1.5rem;
  position: relative; z-index: 1;
}

.pass-box {
  width: 100%; max-width: 420px;
}

/* back btn */
.pass-back {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 0.83rem; font-weight: 600;
  color: rgba(255,255,255,0.45);
  text-decoration: none; margin-bottom: 2rem;
  transition: color 0.15s, gap 0.2s;
}
.pass-back:hover { color: rgba(255,255,255,0.8); gap: 10px; }

/* card */
.pass-card {
  background: rgba(255,255,255,0.04);
  border: 1.5px solid rgba(0,204,255,0.15);
  border-radius: 24px;
  padding: 2.5rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 80px rgba(0,0,0,0.3);
}

/* icon */
.pass-icon-wrap {
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(0,204,255,0.1);
  border: 2px solid rgba(0,204,255,0.2);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.6rem;
}

.pass-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.9rem; font-weight: 800;
  color: #fff; text-align: center;
  margin-bottom: 6px;
}
.pass-subtitle {
  font-size: 0.875rem; color: rgba(255,255,255,0.4);
  text-align: center; line-height: 1.65;
  margin-bottom: 2rem; font-weight: 300;
}

/* form */
.pass-label {
  display: block;
  font-size: 0.72rem; font-weight: 700;
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.08em; text-transform: uppercase;
  margin-bottom: 8px;
}
.pass-input-wrap { position: relative; margin-bottom: 1.5rem; }
.pass-input-icon {
  position: absolute; left: 14px; top: 50%;
  transform: translateY(-50%); pointer-events: none;
}
.pass-input {
  width: 100%; height: 50px;
  padding: 0 14px 0 44px;
  background: rgba(255,255,255,0.06);
  border: 1.5px solid rgba(0,204,255,0.2);
  border-radius: 13px;
  font-size: 0.9rem;
  font-family: 'DM Sans', sans-serif;
  color: #fff; outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.pass-input::placeholder { color: rgba(255,255,255,0.25); }
.pass-input:focus {
  border-color: var(--cyan);
  background: rgba(255,255,255,0.09);
}

/* submit */
.pass-submit {
  width: 100%; height: 52px;
  background: var(--cyan); color: var(--navy);
  border: none; border-radius: 14px;
  font-family: 'Syne', sans-serif;
  font-size: 0.95rem; font-weight: 800;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 6px 24px rgba(0,204,255,0.25);
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s, background 0.15s;
  margin-bottom: 1.5rem;
}
.pass-submit:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,204,255,0.35); }
.pass-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* alerts */
.pass-alert {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 14px 16px;
  border-radius: 13px; font-size: 0.85rem;
  line-height: 1.55; margin-bottom: 1.5rem;
  animation: pass-slide 0.25s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes pass-slide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
.pass-alert-success {
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.25);
  color: rgba(134,239,172,0.9);
}
.pass-alert-error {
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.25);
  color: rgba(252,165,165,0.9);
}

/* divider + signup */
.pass-divider {
  display: flex; align-items: center; gap: 12px; margin-bottom: 1.3rem;
}
.pass-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
.pass-divider-text { font-size: 0.7rem; color: rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 0.1em; }

.pass-signup {
  text-align: center; font-size: 0.85rem;
  color: rgba(255,255,255,0.35);
}
.pass-signup a {
  color: var(--gold); text-decoration: none; font-weight: 700;
  transition: color 0.15s;
}
.pass-signup a:hover { color: #ffc82c; }

@keyframes pass-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
`;

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({ type: 'success', text: 'E-mail de redefinição enviado! Verifique sua caixa de entrada (e a pasta de spam).' });
    } catch (error: any) {
      const map: Record<string, string> = {
        'auth/user-not-found': 'Não encontramos nenhuma conta com este e-mail.',
        'auth/invalid-email': 'O formato do e-mail é inválido.',
      };
      setMessage({ type: 'error', text: map[error.code] || 'Ocorreu um erro. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{PASS_CSS}</style>
      <div className="pass">
        <div className="pass-bg">
          <div className="pass-orb1" /><div className="pass-orb2" /><div className="pass-grid" />
        </div>

        <Header />

        <div className="pass-content">
          <div className="pass-box">

            <Link href="/login" className="pass-back">
              <ArrowLeft size={16} /> Voltar para o login
            </Link>

            <div className="pass-card">
              <div className="pass-icon-wrap">
                <KeyRound size={30} color="#00CCFF" strokeWidth={1.5} />
              </div>

              <h1 className="pass-title">Recuperar Senha</h1>
              <p className="pass-subtitle">
                Enviaremos as instruções de redefinição para o seu e-mail cadastrado.
              </p>

              {message && (
                <div className={`pass-alert ${message.type === 'success' ? 'pass-alert-success' : 'pass-alert-error'}`}>
                  {message.type === 'success'
                    ? <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                    : <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <label className="pass-label" htmlFor="email">E-mail cadastrado</label>
                <div className="pass-input-wrap">
                  <div className="pass-input-icon">
                    <Mail size={16} color="rgba(0,204,255,0.5)" />
                  </div>
                  <input
                    id="email" type="email"
                    className="pass-input"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="pass-submit" disabled={loading}>
                  {loading
                    ? <Loader2 size={18} style={{ animation: "pass-spin 1s linear infinite" }} />
                    : <Mail size={17} />}
                  {loading ? "Enviando..." : "Enviar instruções"}
                </button>
              </form>

              <div className="pass-divider">
                <div className="pass-divider-line" />
                <span className="pass-divider-text">ou</span>
                <div className="pass-divider-line" />
              </div>

              <p className="pass-signup">
                Ainda não tem uma conta?{" "}
                <Link href="/cadastro">Cadastre-se aqui</Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}