"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Shield, Eye, Edit3, Star, Heart, ArrowRight,
  Lock, AlertTriangle, Loader2, KeyRound, Trash2, EyeOff,
  ShieldAlert, CheckCircle2
} from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { auth, db } from "@/lib/firebase"
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from "firebase/auth"
import { doc, deleteDoc } from "firebase/firestore"

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CFG_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.cfg {
  --navy: #002240; --gold: #F7B000; --cyan: #00CCFF; --bg: #F4F1EC;
  font-family: 'DM Sans', sans-serif;
  background: var(--bg); min-height: 100vh;
}

/* ── HERO ── */
.cfg-hero {
  background: var(--navy);
  padding: 2.5rem 1.5rem 5rem;
  position: relative; overflow: hidden;
}
.cfg-hero-orb1 { position:absolute;border-radius:50%;pointer-events:none;width:500px;height:500px;background:var(--cyan);opacity:0.07;filter:blur(90px);top:-180px;right:-100px; }
.cfg-hero-orb2 { position:absolute;border-radius:50%;pointer-events:none;width:350px;height:350px;background:var(--gold);opacity:0.08;filter:blur(80px);bottom:-140px;left:-60px; }
.cfg-hero-grid {
  position:absolute;inset:0;
  background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);
  background-size:56px 56px;
}
.cfg-hero-inner { max-width:1000px;margin:0 auto;position:relative;z-index:1; }
.cfg-hero-eyebrow { font-size:0.68rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(0,204,255,0.7);margin-bottom:6px; }
.cfg-hero-title { font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:#fff;margin-bottom:4px; }
.cfg-hero-sub { font-size:0.875rem;color:rgba(255,255,255,0.5);font-weight:300; }

/* ── BODY ── */
.cfg-body {
  max-width:1000px; margin:-3rem auto 0;
  padding:0 1.5rem 4rem;
  position:relative; z-index:10;
  display:grid; grid-template-columns:1fr 280px;
  gap:1.5rem; align-items:start;
}

/* ── CARD ── */
.cfg-card {
  background:#fff; border-radius:20px;
  box-shadow:0 2px 20px rgba(0,34,64,0.07);
  overflow:hidden; margin-bottom:1.5rem;
  border:1px solid #f0ece5;
}
.cfg-card:last-child { margin-bottom:0; }
.cfg-card-header {
  padding:1.3rem 1.6rem; border-bottom:1px solid #f0ece5;
  display:flex; align-items:center; gap:12px;
}
.cfg-card-icon { width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.cfg-card-title { font-family:'Syne',sans-serif;font-size:0.97rem;font-weight:700;color:var(--navy); }
.cfg-card-sub { font-size:0.75rem;color:#8a9aaa;margin-top:2px; }

/* ── TOGGLE ROWS ── */
.cfg-toggle-row {
  display:flex; align-items:center; justify-content:space-between; gap:1rem;
  padding:1.1rem 1.6rem; border-bottom:1px solid #f8f6f2;
}
.cfg-toggle-row:last-child { border-bottom:none; }
.cfg-toggle-label { font-size:0.9rem;font-weight:500;color:var(--navy);margin-bottom:2px; }
.cfg-toggle-desc { font-size:0.75rem;color:#8a9aaa; }
.cfg-section-label {
  padding:0.9rem 1.6rem 0.5rem;
  font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
  color:#b0bec5; display:flex;align-items:center;gap:6px;
}

/* Custom toggle switch */
.cfg-switch { position:relative;width:44px;height:24px;flex-shrink:0;cursor:pointer; }
.cfg-switch input { opacity:0;width:0;height:0; }
.cfg-switch-track { position:absolute;inset:0;background:#e0dbd2;border-radius:100px;transition:background 0.2s; }
.cfg-switch input:checked + .cfg-switch-track { background:var(--cyan); }
.cfg-switch-thumb {
  position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;
  top:3px;left:3px;box-shadow:0 1px 4px rgba(0,0,0,0.18);
  transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
.cfg-switch input:checked ~ .cfg-switch-thumb { transform:translateX(20px); }

/* ── PASSWORD FORM ── */
.cfg-form-body { padding:1.5rem 1.6rem; }
.cfg-fields { display:flex;flex-direction:column;gap:1rem;max-width:420px; }
.cfg-field label {
  display:block;font-size:0.72rem;font-weight:700;
  color:#5a6878;margin-bottom:6px;
  letter-spacing:0.05em;text-transform:uppercase;
}
.cfg-input-wrap { position:relative; }
.cfg-input {
  width:100%;height:46px;padding:0 46px 0 14px;
  background:#f8f6f2;border:1.5px solid #ede9e0;
  border-radius:12px;font-size:0.875rem;
  font-family:'DM Sans',sans-serif;color:var(--navy);
  outline:none;transition:border-color 0.2s,background 0.2s;
}
.cfg-input:focus { border-color:var(--cyan);background:#fff; }
.cfg-input.danger:focus { border-color:#ef4444; }
.cfg-eye-btn {
  position:absolute;right:0;top:0;width:46px;height:46px;
  display:flex;align-items:center;justify-content:center;
  background:none;border:none;cursor:pointer;color:#b0bec5;transition:color 0.15s;
}
.cfg-eye-btn:hover { color:#5a6878; }

/* ── BUTTONS ── */
.cfg-btn {
  display:inline-flex;align-items:center;gap:7px;
  padding:11px 22px;border-radius:12px;
  font-size:0.85rem;font-weight:700;cursor:pointer;border:none;
  font-family:'DM Sans',sans-serif;
  transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s;
  margin-top:0.5rem;
}
.cfg-btn-cyan { background:var(--cyan);color:var(--navy);box-shadow:0 4px 16px rgba(0,204,255,0.25); }
.cfg-btn-cyan:hover { transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,204,255,0.35); }
.cfg-btn-cyan:disabled { opacity:0.6;cursor:not-allowed;transform:none; }
.cfg-btn-navy {
  background:var(--navy);color:var(--cyan);
  border:1.5px solid rgba(0,204,255,0.25);
  box-shadow:0 4px 16px rgba(0,34,64,0.2);
}
.cfg-btn-navy:hover { transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,34,64,0.3); }
.cfg-btn-danger { background:rgba(239,68,68,0.08);color:#dc2626;border:1.5px solid rgba(239,68,68,0.2); }
.cfg-btn-danger:hover { background:rgba(239,68,68,0.14); }
.cfg-save-wrap { display:flex;justify-content:flex-end;padding:0 0 2rem; }

/* ── DANGER ZONE ── */
.cfg-danger-header {
  padding:1.2rem 1.6rem;border-bottom:1px solid rgba(239,68,68,0.12);
  background:rgba(239,68,68,0.03);display:flex;align-items:center;gap:10px;
}
.cfg-danger-body {
  padding:1.4rem 1.6rem;display:flex;align-items:center;
  justify-content:space-between;gap:1.5rem;flex-wrap:wrap;
}
.cfg-danger-title { font-family:'Syne',sans-serif;font-size:0.92rem;font-weight:700;color:#991b1b;margin-bottom:4px; }
.cfg-danger-desc { font-size:0.8rem;color:#6b7280;line-height:1.5;max-width:400px; }

/* ── MODAL ── */
.cfg-overlay {
  position:fixed;inset:0;z-index:50;
  background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);
  display:flex;align-items:center;justify-content:center;
  padding:1.5rem;animation:cfg-fade 0.15s ease;
}
@keyframes cfg-fade { from{opacity:0} to{opacity:1} }
.cfg-modal {
  background:#fff;border-radius:22px;
  width:100%;max-width:440px;
  box-shadow:0 30px 80px rgba(0,0,0,0.2);
  overflow:hidden;
  animation:cfg-slide 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes cfg-slide { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
.cfg-modal-header {
  background:rgba(239,68,68,0.04);border-bottom:1px solid rgba(239,68,68,0.12);
  padding:1.4rem 1.6rem;display:flex;align-items:flex-start;gap:12px;
}
.cfg-modal-icon { width:40px;height:40px;border-radius:12px;background:rgba(239,68,68,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.cfg-modal-title { font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:var(--navy);margin-bottom:3px; }
.cfg-modal-desc { font-size:0.8rem;color:#6b7280;line-height:1.5; }
.cfg-modal-body { padding:1.5rem 1.6rem; }
.cfg-modal-fields { display:flex;flex-direction:column;gap:1rem; }
.cfg-modal-footer { padding:1rem 1.6rem 1.4rem;display:flex;gap:10px;justify-content:flex-end; }
.cfg-modal-cancel {
  padding:10px 20px;border-radius:11px;background:#f8f6f2;border:1.5px solid #ede9e0;
  color:#5a6878;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;
  transition:background 0.15s;
}
.cfg-modal-cancel:hover { background:#f0ece5; }
.cfg-modal-confirm {
  padding:10px 20px;border-radius:11px;background:#dc2626;border:none;
  color:#fff;font-size:0.85rem;font-weight:700;cursor:pointer;
  font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:6px;
  transition:background 0.15s;
}
.cfg-modal-confirm:hover { background:#b91c1c; }
.cfg-modal-confirm:disabled { opacity:0.5;cursor:not-allowed; }

/* ── TOAST ── */
.cfg-toast {
  position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
  background:var(--navy);color:#fff;
  padding:12px 22px;border-radius:14px;
  display:flex;align-items:center;gap:8px;
  font-size:0.875rem;font-weight:500;
  box-shadow:0 12px 40px rgba(0,0,0,0.25);
  z-index:100;white-space:nowrap;
  animation:cfg-toast-in 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes cfg-toast-in { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

/* ── INFO BOX ── */
.cfg-info-box {
  background:rgba(0,204,255,0.06);border:1px solid rgba(0,204,255,0.15);
  border-radius:14px;padding:1rem 1.2rem;
  display:flex;align-items:flex-start;gap:10px;
}
.cfg-info-box-title { font-size:0.82rem;font-weight:600;color:var(--navy);margin-bottom:3px; }
.cfg-info-box-desc { font-size:0.75rem;color:#5a6878;line-height:1.5; }

/* ── SIDEBAR NAV ── */
.cfg-nav-card { background:#fff;border-radius:20px;box-shadow:0 2px 20px rgba(0,34,64,0.07);overflow:hidden;margin-bottom:1.25rem;border:1px solid #f0ece5; }
.cfg-nav-header { background:#faf8f5;padding:1rem 1.25rem;border-bottom:1px solid #f0ece5;font-family:'Syne',sans-serif;font-size:0.85rem;font-weight:700;color:var(--navy); }
.cfg-nav-item {
  display:flex;align-items:center;gap:12px;
  padding:0.85rem 1.25rem;
  font-size:0.875rem;font-weight:500;color:#5a6878;
  text-decoration:none;border-bottom:1px solid #f8f6f2;
  transition:background 0.15s,color 0.15s;
}
.cfg-nav-item:last-child { border-bottom:none; }
.cfg-nav-item:hover { background:rgba(0,204,255,0.06);color:var(--navy); }
.cfg-nav-item.active { background:rgba(0,204,255,0.08);color:var(--navy);font-weight:600; }
.cfg-nav-dot { width:6px;height:6px;border-radius:50%;background:var(--cyan);margin-left:auto;flex-shrink:0; }

.cfg-promo-card {
  background:var(--navy);border-radius:20px;padding:1.4rem;
  position:relative;overflow:hidden;
  box-shadow:0 8px 30px rgba(0,34,64,0.2);
}
.cfg-promo-orb { position:absolute;top:-10px;right:-10px;width:80px;height:80px;border-radius:50%;background:var(--gold);opacity:0.2;filter:blur(20px); }
.cfg-promo-title { font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:#fff;margin-bottom:6px;position:relative;z-index:1; }
.cfg-promo-text { font-size:0.8rem;color:rgba(255,255,255,0.6);line-height:1.6;margin-bottom:1rem;position:relative;z-index:1; }
.cfg-promo-btn {
  display:flex;align-items:center;justify-content:center;gap:6px;
  width:100%;padding:10px;background:var(--gold);color:var(--navy);
  border:none;border-radius:12px;font-family:'Syne',sans-serif;
  font-size:0.82rem;font-weight:700;cursor:pointer;text-decoration:none;
  transition:transform 0.2s;position:relative;z-index:1;
}
.cfg-promo-btn:hover { transform:translateY(-2px); }

@keyframes cfg-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

@media (max-width: 768px) {
  .cfg-body { grid-template-columns:1fr;margin-top:-1.5rem; }
}
`

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function Toggle({ id, checked, onChange }: { id: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="cfg-switch" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className="cfg-switch-track" />
      <div className="cfg-switch-thumb" />
    </label>
  )
}

function PasswordField({ id, label, value, show, onToggle, onChange, isDanger = false }: {
  id: string; label: string; value: string; show: boolean;
  onToggle: () => void; onChange: (v: string) => void; isDanger?: boolean
}) {
  return (
    <div className="cfg-field">
      <label htmlFor={id}>{label}</label>
      <div className="cfg-input-wrap">
        <input
          id={id} className={`cfg-input${isDanger ? " danger" : ""}`}
          type={show ? "text" : "password"}
          value={value} onChange={e => onChange(e.target.value)} required
        />
        <button type="button" className="cfg-eye-btn" onClick={onToggle}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function UsuarioConfiguracoes() {
  // Password change
  const [currentPwd, setCurrentPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showCurr, setShowCurr] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConf, setShowConf] = useState(false)

  // Delete account modal
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteInput, setDeleteInput] = useState("")
  const [pwdForDelete, setPwdForDelete] = useState("")
  const [showPwdDelete, setShowPwdDelete] = useState(false)

  // Toast
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3200)
  }

  const reauthenticate = async (password: string) => {
    const user = auth.currentUser
    if (!user?.email) throw new Error("Sessão inválida.")
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password))
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPwd !== confirmPwd) { showToast("As senhas não coincidem.", false); return }
    if (newPwd.length < 6) { showToast("Mínimo 6 caracteres.", false); return }
    setIsSaving(true)
    try {
      await reauthenticate(currentPwd)
      await updatePassword(auth.currentUser!, newPwd)
      showToast("Senha alterada com sucesso!")
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("")
    } catch (err: any) {
      showToast(err.code === "auth/wrong-password" ? "Senha atual incorreta." : "Erro ao alterar a senha.", false)
    } finally { setIsSaving(false) }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await reauthenticate(pwdForDelete)
      await deleteDoc(doc(db, "users", auth.currentUser!.uid))
      await deleteUser(auth.currentUser!)
      showToast("Conta excluída.")
      setTimeout(() => { window.location.href = "/" }, 2000)
    } catch (err: any) {
      showToast(err.code === "auth/wrong-password" ? "Senha incorreta." : "Erro ao excluir conta.", false)
      setIsDeleting(false)
      setDeleteOpen(false)
      setPwdForDelete(""); setDeleteInput("")
    }
  }

  const canDelete = deleteInput === "DELETAR" && !!pwdForDelete && !isDeleting

  const navItems = [
    { href: "/usuario/dashboard", label: "Meu Perfil",          icon: <Edit3 size={16} /> },
    { href: "/usuario/avaliacoes", label: "Minhas Avaliações",   icon: <Star size={16} color="#F7B000" /> },
    { href: "/usuario/favoritos",  label: "Locais Favoritos",    icon: <Heart size={16} color="#ef4444" /> },
    { href: "/usuario/configuracoes", label: "Configurações",    icon: <Shield size={16} />, active: true },
  ]

  return (
    <>
      <style>{CFG_CSS}</style>
      <div className="cfg">
        <Header />

        {/* ── HERO ── */}
        <div className="cfg-hero">
          <div className="cfg-hero-orb1" /><div className="cfg-hero-orb2" /><div className="cfg-hero-grid" />
          <div className="cfg-hero-inner">
            <div className="cfg-hero-eyebrow">Área do Usuário</div>
            <div className="cfg-hero-title">Configurações</div>
            <div className="cfg-hero-sub">Personalize sua experiência e gerencie sua conta</div>
          </div>
        </div>

        <div className="cfg-body">

          {/* ── MAIN COLUMN ── */}
          <div>

            {/* ALTERAR SENHA */}
            <div className="cfg-card">
              <div className="cfg-card-header">
                <div className="cfg-card-icon" style={{ background: "rgba(0,204,255,0.1)" }}>
                  <Lock size={17} color="#00CCFF" />
                </div>
                <div>
                  <div className="cfg-card-title">Alterar Senha</div>
                  <div className="cfg-card-sub">Informe sua senha atual para definir uma nova</div>
                </div>
              </div>

              <div className="cfg-form-body">
                <form onSubmit={handleChangePassword}>
                  <div className="cfg-fields">
                    <PasswordField id="curr" label="Senha Atual"         value={currentPwd} show={showCurr} onToggle={() => setShowCurr(p => !p)} onChange={setCurrentPwd} />
                    <PasswordField id="new"  label="Nova Senha"           value={newPwd}     show={showNew}  onToggle={() => setShowNew(p => !p)}  onChange={setNewPwd} />
                    <PasswordField id="conf" label="Confirmar Nova Senha" value={confirmPwd} show={showConf} onToggle={() => setShowConf(p => !p)} onChange={setConfirmPwd} />
                  </div>
                  <button type="submit" className="cfg-btn cfg-btn-cyan" disabled={isSaving}>
                    {isSaving
                      ? <Loader2 size={16} style={{ animation: "cfg-spin 1s linear infinite" }} />
                      : <KeyRound size={16} />}
                    {isSaving ? "Salvando..." : "Salvar Nova Senha"}
                  </button>
                </form>
              </div>
            </div>

            {/* ZONA DE PERIGO */}
            <div className="cfg-card" style={{ border: "1.5px solid rgba(239,68,68,0.18)" }}>
              <div className="cfg-danger-header">
                <div className="cfg-card-icon" style={{ background: "rgba(239,68,68,0.1)" }}>
                  <ShieldAlert size={17} color="#dc2626" />
                </div>
                <div>
                  <div className="cfg-card-title" style={{ color: "#dc2626" }}>Zona de Perigo</div>
                  <div className="cfg-card-sub">Ações irreversíveis para sua conta</div>
                </div>
              </div>
              <div className="cfg-danger-body">
                <div>
                  <div className="cfg-danger-title">Excluir minha conta</div>
                  <div className="cfg-danger-desc">
                    Todos os seus dados, avaliações e favoritos serão permanentemente removidos. Esta ação não pode ser desfeita.
                  </div>
                </div>
                <button className="cfg-btn cfg-btn-danger" style={{ marginTop: 0 }} onClick={() => setDeleteOpen(true)}>
                  <Trash2 size={15} /> Excluir Conta
                </button>
              </div>
            </div>

          </div>

          {/* ── SIDEBAR ── */}
          <div>
            <div className="cfg-nav-card">
              <div className="cfg-nav-header">Navegação</div>
              {navItems.map(item => (
                <Link key={item.href} href={item.href} className={`cfg-nav-item${item.active ? " active" : ""}`}>
                  {item.icon}
                  {item.label}
                  {item.active && <div className="cfg-nav-dot" />}
                </Link>
              ))}
            </div>

            <div className="cfg-info-box" style={{ marginBottom: "1.25rem" }}>
              <Shield size={18} color="#00CCFF" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div className="cfg-info-box-title">Segurança da Conta</div>
                <div className="cfg-info-box-desc">Nunca compartilhamos seus dados pessoais com terceiros sem sua permissão.</div>
              </div>
            </div>

            <div className="cfg-promo-card">
              <div className="cfg-promo-orb" />
              <div className="cfg-promo-title">Descubra Novos Lugares</div>
              <div className="cfg-promo-text">Explore o bairro e encontre os melhores estabelecimentos perto de você.</div>
              <Link href="/busca" className="cfg-promo-btn">
                Explorar <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* ── DELETE MODAL ── */}
      {deleteOpen && (
        <div className="cfg-overlay" onClick={e => { if (e.target === e.currentTarget) setDeleteOpen(false) }}>
          <div className="cfg-modal">
            <div className="cfg-modal-header">
              <div className="cfg-modal-icon"><AlertTriangle size={20} color="#dc2626" /></div>
              <div>
                <div className="cfg-modal-title">Você tem certeza absoluta?</div>
                <div className="cfg-modal-desc">
                  Esta ação é irreversível. Todos os seus dados, avaliações e favoritos serão permanentemente excluídos.
                </div>
              </div>
            </div>

            <div className="cfg-modal-body">
              <div className="cfg-modal-fields">
                <PasswordField
                  id="pwddelete" label="Confirme sua senha"
                  value={pwdForDelete} show={showPwdDelete}
                  onToggle={() => setShowPwdDelete(p => !p)}
                  onChange={setPwdForDelete} isDanger
                />
                <div className="cfg-field">
                  <label htmlFor="deleteinput">
                    Digite <strong style={{ color: "#dc2626" }}>DELETAR</strong> para confirmar
                  </label>
                  <div className="cfg-input-wrap">
                    <input
                      id="deleteinput" className="cfg-input danger"
                      type="text" value={deleteInput}
                      onChange={e => setDeleteInput(e.target.value)}
                      placeholder="DELETAR"
                      style={{ paddingRight: 14 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="cfg-modal-footer">
              <button className="cfg-modal-cancel" onClick={() => { setDeleteOpen(false); setPwdForDelete(""); setDeleteInput("") }}>
                Cancelar
              </button>
              <button className="cfg-modal-confirm" onClick={handleDeleteAccount} disabled={!canDelete}>
                {isDeleting && <Loader2 size={14} style={{ animation: "cfg-spin 1s linear infinite" }} />}
                Eu entendo, excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className="cfg-toast">
          {toast.ok
            ? <CheckCircle2 size={16} color="#22c55e" />
            : <AlertTriangle size={16} color="#f87171" />}
          {toast.msg}
        </div>
      )}
    </>
  )
}