"use client"

import React, { useState, useEffect } from 'react'
import { Loader2, KeyRound, Trash2, Eye, EyeOff, AlertTriangle, Lock, ShieldAlert, Globe, EyeOff as EyeOffIcon, CheckCircle2 } from 'lucide-react'
import { auth, db } from '@/lib/firebase'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from 'firebase/auth'
import { doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const ECFG_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.ecfg {
  --navy: #002240; --gold: #F7B000; --cyan: #00CCFF;
  font-family: 'DM Sans', sans-serif;
}

/* ── CARDS ── */
.ecfg-card {
  background: #fff; border-radius: 20px;
  box-shadow: 0 2px 20px rgba(0,34,64,0.07);
  overflow: hidden; margin-bottom: 1.5rem;
  border: 1px solid #f0ece5;
}
.ecfg-card:last-child { margin-bottom: 0; }
.ecfg-card-header {
  padding: 1.2rem 1.6rem; border-bottom: 1px solid #f0ece5;
  display: flex; align-items: center; gap: 10px;
}
.ecfg-card-icon { width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.ecfg-card-title { font-family:'Syne',sans-serif;font-size:0.95rem;font-weight:700;color:var(--navy); }
.ecfg-card-sub { font-size:0.75rem;color:#8a9aaa;margin-top:1px; }

/* ── VISIBILITY TOGGLE ROW ── */
.ecfg-vis-body { padding: 1.4rem 1.6rem; }
.ecfg-vis-row {
  display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
  padding: 1.1rem 1.4rem; border-radius: 14px;
  border: 2px solid #f0ece5; background: #faf8f5;
  cursor: pointer; transition: border-color 0.2s, background 0.2s;
  margin-bottom: 1rem;
}
.ecfg-vis-row:last-child { margin-bottom: 0; }
.ecfg-vis-row.public  { border-color: rgba(34,197,94,0.35); background: rgba(34,197,94,0.04); }
.ecfg-vis-row.private { border-color: rgba(176,190,197,0.4); background: #faf8f5; }
.ecfg-vis-icon {
  width: 42px; height: 42px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ecfg-vis-label { font-family:'Syne',sans-serif;font-size:0.92rem;font-weight:700;margin-bottom:3px; }
.ecfg-vis-desc { font-size:0.78rem;color:#6b7280;line-height:1.4; }

/* Toggle pill */
.ecfg-switch { position:relative;width:46px;height:25px;flex-shrink:0;cursor:pointer; }
.ecfg-switch input { opacity:0;width:0;height:0; }
.ecfg-switch-track { position:absolute;inset:0;background:#ddd;border-radius:100px;transition:background 0.2s; }
.ecfg-switch input:checked + .ecfg-switch-track { background: #22c55e; }
.ecfg-switch-thumb {
  position:absolute;width:19px;height:19px;border-radius:50%;background:#fff;
  top:3px;left:3px;box-shadow:0 1px 4px rgba(0,0,0,0.18);
  transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
.ecfg-switch input:checked ~ .ecfg-switch-thumb { transform:translateX(21px); }

/* Status badge */
.ecfg-vis-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 100px;
  font-size: 0.7rem; font-weight: 700; margin-top: 1rem;
}
.ecfg-vis-badge.public  { background: rgba(34,197,94,0.1); color: #16a34a; border: 1px solid rgba(34,197,94,0.22); }
.ecfg-vis-badge.private { background: rgba(176,190,197,0.15); color: #64748b; border: 1px solid rgba(176,190,197,0.25); }
.ecfg-vis-save {
  display: inline-flex; align-items: center; gap: 7px;
  margin-top: 1.2rem; padding: 10px 22px; border-radius: 12px;
  background: var(--navy); color: var(--cyan);
  border: 1.5px solid rgba(0,204,255,0.25);
  font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 700;
  cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(0,34,64,0.18);
}
.ecfg-vis-save:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(0,34,64,0.28); }
.ecfg-vis-save:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

/* ── FORM ── */
.ecfg-form { padding: 1.5rem 1.6rem; }
.ecfg-fields { display:flex;flex-direction:column;gap:1rem;max-width:420px; }
.ecfg-field label {
  display:block;font-size:0.72rem;font-weight:700;color:#5a6878;
  margin-bottom:6px;letter-spacing:0.05em;text-transform:uppercase;
}
.ecfg-input-wrap { position:relative; }
.ecfg-input {
  width:100%;height:46px;padding:0 46px 0 14px;
  background:#f8f6f2;border:1.5px solid #ede9e0;border-radius:12px;
  font-size:0.875rem;font-family:'DM Sans',sans-serif;color:var(--navy);
  outline:none;transition:border-color 0.2s,background 0.2s;
}
.ecfg-input:focus { border-color:var(--cyan);background:#fff; }
.ecfg-input.danger:focus { border-color:#ef4444; }
.ecfg-eye-btn {
  position:absolute;right:0;top:0;width:46px;height:46px;
  display:flex;align-items:center;justify-content:center;
  background:none;border:none;cursor:pointer;color:#b0bec5;transition:color 0.15s;
}
.ecfg-eye-btn:hover { color:#5a6878; }

/* ── BUTTONS ── */
.ecfg-btn {
  display:inline-flex;align-items:center;gap:7px;
  padding:11px 22px;border-radius:12px;
  font-size:0.85rem;font-weight:700;cursor:pointer;border:none;
  font-family:'DM Sans',sans-serif;
  transition:transform 0.2s,box-shadow 0.2s,background 0.15s;
  margin-top:0.5rem;
}
.ecfg-btn-cyan { background:var(--cyan);color:var(--navy);box-shadow:0 4px 16px rgba(0,204,255,0.25); }
.ecfg-btn-cyan:hover { transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,204,255,0.35); }
.ecfg-btn-cyan:disabled { opacity:0.6;cursor:not-allowed;transform:none; }
.ecfg-btn-danger { background:rgba(239,68,68,0.08);color:#dc2626;border:1.5px solid rgba(239,68,68,0.2); }
.ecfg-btn-danger:hover { background:rgba(239,68,68,0.14); }

/* ── DANGER ── */
.ecfg-danger-header {
  padding:1.2rem 1.6rem;border-bottom:1px solid rgba(239,68,68,0.12);
  background:rgba(239,68,68,0.03);display:flex;align-items:center;gap:10px;
}
.ecfg-danger-body {
  padding:1.4rem 1.6rem;display:flex;align-items:center;
  justify-content:space-between;gap:1.5rem;flex-wrap:wrap;
}
.ecfg-danger-title { font-family:'Syne',sans-serif;font-size:0.92rem;font-weight:700;color:#991b1b;margin-bottom:4px; }
.ecfg-danger-desc { font-size:0.8rem;color:#6b7280;line-height:1.5;max-width:400px; }

/* ── MODAL ── */
.ecfg-overlay {
  position:fixed;inset:0;z-index:50;background:rgba(0,0,0,0.55);
  backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;
  padding:1.5rem;animation:ecfg-fade-in 0.15s ease;
}
@keyframes ecfg-fade-in { from{opacity:0} to{opacity:1} }
.ecfg-modal {
  background:#fff;border-radius:22px;width:100%;max-width:440px;
  box-shadow:0 30px 80px rgba(0,0,0,0.2);overflow:hidden;
  animation:ecfg-slide-up 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes ecfg-slide-up { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
.ecfg-modal-header {
  background:rgba(239,68,68,0.04);border-bottom:1px solid rgba(239,68,68,0.12);
  padding:1.4rem 1.6rem;display:flex;align-items:flex-start;gap:12px;
}
.ecfg-modal-icon { width:40px;height:40px;border-radius:12px;background:rgba(239,68,68,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.ecfg-modal-title { font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:var(--navy);margin-bottom:3px; }
.ecfg-modal-desc { font-size:0.8rem;color:#6b7280;line-height:1.5; }
.ecfg-modal-body { padding:1.5rem 1.6rem; }
.ecfg-modal-fields { display:flex;flex-direction:column;gap:1rem; }
.ecfg-modal-footer { padding:1rem 1.6rem 1.4rem;display:flex;gap:10px;justify-content:flex-end; }
.ecfg-modal-cancel {
  padding:10px 20px;border-radius:11px;background:#f8f6f2;border:1.5px solid #ede9e0;
  color:#5a6878;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background 0.15s;
}
.ecfg-modal-cancel:hover { background:#f0ece5; }
.ecfg-modal-confirm {
  padding:10px 20px;border-radius:11px;background:#dc2626;border:none;
  color:#fff;font-size:0.85rem;font-weight:700;cursor:pointer;
  font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:6px;transition:background 0.15s;
}
.ecfg-modal-confirm:hover { background:#b91c1c; }
.ecfg-modal-confirm:disabled { opacity:0.5;cursor:not-allowed; }

/* ── TOAST ── */
.ecfg-toast {
  position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
  background:var(--navy);color:#fff;padding:12px 22px;border-radius:14px;
  display:flex;align-items:center;gap:8px;font-size:0.875rem;font-weight:500;
  box-shadow:0 12px 40px rgba(0,0,0,0.25);z-index:100;white-space:nowrap;
  animation:ecfg-toast-in 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes ecfg-toast-in { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

@keyframes ecfg-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
`

function PasswordField({ id, label, value, show, onToggle, onChange, className = "" }: {
  id: string; label: string; value: string; show: boolean;
  onToggle: () => void; onChange: (v: string) => void; className?: string
}) {
  return (
    <div className="ecfg-field">
      <label htmlFor={id}>{label}</label>
      <div className="ecfg-input-wrap">
        <input id={id} className={`ecfg-input ${className}`}
          type={show ? "text" : "password"}
          value={value} onChange={e => onChange(e.target.value)} required />
        <button type="button" className="ecfg-eye-btn" onClick={onToggle}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

export default function EmpresarioConfiguracoesPage() {
  // Visibility
  const [isPublic, setIsPublic]       = useState(true)
  const [visSaving, setVisSaving]     = useState(false)
  const [visLoading, setVisLoading]   = useState(true)

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSaving, setIsSaving]               = useState(false)
  const [showCurr, setShowCurr]               = useState(false)
  const [showNew, setShowNew]                 = useState(false)
  const [showConf, setShowConf]               = useState(false)

  // Delete
  const [isDialogOpen, setIsDialogOpen]           = useState(false)
  const [isDeleting, setIsDeleting]               = useState(false)
  const [deleteInput, setDeleteInput]             = useState('')
  const [passwordForDelete, setPasswordForDelete] = useState('')
  const [showPassForDelete, setShowPassForDelete] = useState(false)

  // Toast
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3200)
  }

  // Load current isPublic value
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "businesses", user.uid))
        if (snap.exists()) setIsPublic(snap.data().isPublic !== false)
      }
      setVisLoading(false)
    })
    return () => unsub()
  }, [])

  const handleSaveVisibility = async () => {
    if (!auth.currentUser) return
    setVisSaving(true)
    try {
      await updateDoc(doc(db, "businesses", auth.currentUser.uid), { isPublic })
      showToast(isPublic ? "Negócio agora está público!" : "Negócio ocultado do diretório.")
    } catch {
      showToast("Erro ao salvar. Tente novamente.", false)
    } finally { setVisSaving(false) }
  }

  const reauthenticate = async (password: string) => {
    const user = auth.currentUser
    if (!user?.email) throw new Error("Sessão inválida.")
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password))
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) { showToast("As senhas não coincidem.", false); return }
    if (newPassword.length < 6) { showToast("Mínimo 6 caracteres.", false); return }
    setIsSaving(true)
    try {
      await reauthenticate(currentPassword)
      await updatePassword(auth.currentUser!, newPassword)
      showToast("Senha alterada com sucesso!")
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch (err: any) {
      showToast(err.code === 'auth/wrong-password' ? "Senha atual incorreta." : "Erro ao alterar a senha.", false)
    } finally { setIsSaving(false) }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await reauthenticate(passwordForDelete)
      await deleteDoc(doc(db, "businesses", auth.currentUser!.uid))
      await deleteUser(auth.currentUser!)
      showToast("Conta excluída.")
      setTimeout(() => { window.location.href = '/' }, 2000)
    } catch (err: any) {
      showToast(err.code === 'auth/wrong-password' ? "Senha incorreta." : "Erro ao excluir conta.", false)
      setIsDeleting(false)
      setIsDialogOpen(false)
      setPasswordForDelete(''); setDeleteInput('')
    }
  }

  const canDelete = deleteInput === 'DELETAR' && !!passwordForDelete && !isDeleting

  return (
    <>
      <style>{ECFG_CSS}</style>

      <div className="ecfg">

        {/* ── VISIBILIDADE DO NEGÓCIO ── */}
        <div className="ecfg-card">
          <div className="ecfg-card-header">
            <div className="ecfg-card-icon" style={{ background: "rgba(34,197,94,0.1)" }}>
              <Globe size={17} color="#22c55e" />
            </div>
            <div>
              <div className="ecfg-card-title">Visibilidade do Negócio</div>
              <div className="ecfg-card-sub">Controle se seu estabelecimento aparece no diretório público</div>
            </div>
          </div>

          <div className="ecfg-vis-body">
            {visLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.5rem 0", color: "#8a9aaa", fontSize: "0.85rem" }}>
                <Loader2 size={16} style={{ animation: "ecfg-spin 1s linear infinite" }} /> Carregando...
              </div>
            ) : (
              <>
                {/* PUBLIC option */}
                <div
                  className={`ecfg-vis-row ${isPublic ? "public" : ""}`}
                  onClick={() => setIsPublic(true)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div className="ecfg-vis-icon" style={{ background: isPublic ? "rgba(34,197,94,0.12)" : "#f0ece5" }}>
                      <Globe size={20} color={isPublic ? "#22c55e" : "#b0bec5"} />
                    </div>
                    <div>
                      <div className="ecfg-vis-label" style={{ color: isPublic ? "#15803d" : "#5a6878" }}>
                        Público
                      </div>
                      <div className="ecfg-vis-desc">
                        Seu negócio aparece nas buscas e no mapa para todos os usuários.
                      </div>
                    </div>
                  </div>
                  <label className="ecfg-switch" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
                    <div className="ecfg-switch-track" />
                    <div className="ecfg-switch-thumb" />
                  </label>
                </div>

                {/* PRIVATE option */}
                <div
                  className={`ecfg-vis-row ${!isPublic ? "private" : ""}`}
                  style={{ borderColor: !isPublic ? "rgba(100,116,139,0.4)" : "#f0ece5", background: !isPublic ? "rgba(100,116,139,0.05)" : "#faf8f5" }}
                  onClick={() => setIsPublic(false)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div className="ecfg-vis-icon" style={{ background: !isPublic ? "rgba(100,116,139,0.1)" : "#f0ece5" }}>
                      <EyeOffIcon size={20} color={!isPublic ? "#64748b" : "#b0bec5"} />
                    </div>
                    <div>
                      <div className="ecfg-vis-label" style={{ color: !isPublic ? "#334155" : "#5a6878" }}>
                        Privado
                      </div>
                      <div className="ecfg-vis-desc">
                        Seu negócio fica oculto do diretório. Somente você consegue visualizá-lo.
                      </div>
                    </div>
                  </div>
                  <label className="ecfg-switch" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={!isPublic} onChange={e => setIsPublic(!e.target.checked)} />
                    <div className="ecfg-switch-track" style={{ background: !isPublic ? "#64748b" : "" }} />
                    <div className="ecfg-switch-thumb" />
                  </label>
                </div>

                {/* Status + save */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <div className={`ecfg-vis-badge ${isPublic ? "public" : "private"}`}>
                    {isPublic
                      ? <><Globe size={11} /> Visível no diretório</>
                      : <><EyeOffIcon size={11} /> Oculto do diretório</>
                    }
                  </div>
                  <button className="ecfg-vis-save" onClick={handleSaveVisibility} disabled={visSaving}>
                    {visSaving
                      ? <Loader2 size={15} style={{ animation: "ecfg-spin 1s linear infinite" }} />
                      : <CheckCircle2 size={15} />}
                    {visSaving ? "Salvando..." : "Salvar Visibilidade"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── ALTERAR SENHA ── */}
        <div className="ecfg-card">
          <div className="ecfg-card-header">
            <div className="ecfg-card-icon" style={{ background: "rgba(0,204,255,0.1)" }}>
              <Lock size={17} color="#00CCFF" />
            </div>
            <div>
              <div className="ecfg-card-title">Alterar Senha</div>
              <div className="ecfg-card-sub">Informe sua senha atual para definir uma nova</div>
            </div>
          </div>
          <div className="ecfg-form">
            <form onSubmit={handleChangePassword}>
              <div className="ecfg-fields">
                <PasswordField id="curr" label="Senha Atual"         value={currentPassword} show={showCurr} onToggle={() => setShowCurr(p => !p)} onChange={setCurrentPassword} />
                <PasswordField id="new"  label="Nova Senha"           value={newPassword}     show={showNew}  onToggle={() => setShowNew(p => !p)}  onChange={setNewPassword} />
                <PasswordField id="conf" label="Confirmar Nova Senha" value={confirmPassword} show={showConf} onToggle={() => setShowConf(p => !p)} onChange={setConfirmPassword} />
              </div>
              <button type="submit" className="ecfg-btn ecfg-btn-cyan" disabled={isSaving}>
                {isSaving ? <Loader2 size={16} style={{ animation: "ecfg-spin 1s linear infinite" }} /> : <KeyRound size={16} />}
                {isSaving ? "Salvando..." : "Salvar Nova Senha"}
              </button>
            </form>
          </div>
        </div>

        {/* ── ZONA DE PERIGO ── */}
        <div className="ecfg-card" style={{ border: "1.5px solid rgba(239,68,68,0.15)" }}>
          <div className="ecfg-danger-header">
            <div className="ecfg-card-icon" style={{ background: "rgba(239,68,68,0.1)" }}>
              <ShieldAlert size={17} color="#dc2626" />
            </div>
            <div>
              <div className="ecfg-card-title" style={{ color: "#dc2626" }}>Zona de Perigo</div>
              <div className="ecfg-card-sub">Ações irreversíveis para sua conta</div>
            </div>
          </div>
          <div className="ecfg-danger-body">
            <div>
              <div className="ecfg-danger-title">Excluir este negócio</div>
              <div className="ecfg-danger-desc">
                Uma vez que sua conta for excluída, todos os dados serão permanentemente removidos. Esta ação não pode ser desfeita.
              </div>
            </div>
            <button className="ecfg-btn ecfg-btn-danger" onClick={() => setIsDialogOpen(true)}>
              <Trash2 size={15} /> Excluir Negócio
            </button>
          </div>
        </div>

      </div>

      {/* ── MODAL ── */}
      {isDialogOpen && (
        <div className="ecfg-overlay" onClick={e => { if (e.target === e.currentTarget) setIsDialogOpen(false) }}>
          <div className="ecfg-modal">
            <div className="ecfg-modal-header">
              <div className="ecfg-modal-icon"><AlertTriangle size={20} color="#dc2626" /></div>
              <div>
                <div className="ecfg-modal-title">Você tem certeza absoluta?</div>
                <div className="ecfg-modal-desc">Esta ação é irreversível. Isso excluirá permanentemente seu negócio, avaliações e todos os dados associados.</div>
              </div>
            </div>
            <div className="ecfg-modal-body">
              <div className="ecfg-modal-fields">
                <PasswordField id="passdelete" label="Confirme sua senha"
                  value={passwordForDelete} show={showPassForDelete}
                  onToggle={() => setShowPassForDelete(p => !p)}
                  onChange={setPasswordForDelete} className="danger" />
                <div className="ecfg-field">
                  <label htmlFor="deleteinput">
                    Digite <strong style={{ color: "#dc2626" }}>DELETAR</strong> para confirmar
                  </label>
                  <div className="ecfg-input-wrap">
                    <input id="deleteinput" className="ecfg-input danger"
                      type="text" value={deleteInput}
                      onChange={e => setDeleteInput(e.target.value)}
                      placeholder="DELETAR"
                      style={{ paddingRight: 14 }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="ecfg-modal-footer">
              <button className="ecfg-modal-cancel" onClick={() => { setIsDialogOpen(false); setPasswordForDelete(''); setDeleteInput('') }}>
                Cancelar
              </button>
              <button className="ecfg-modal-confirm" onClick={handleDeleteAccount} disabled={!canDelete}>
                {isDeleting && <Loader2 size={14} style={{ animation: "ecfg-spin 1s linear infinite" }} />}
                Eu entendo, excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className="ecfg-toast">
          {toast.ok
            ? <CheckCircle2 size={16} color="#22c55e" />
            : <AlertTriangle size={16} color="#f87171" />}
          {toast.msg}
        </div>
      )}
    </>
  )
}