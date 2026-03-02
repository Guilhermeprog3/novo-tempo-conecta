"use client"

import React, { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Mail, KeyRound, Edit, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { auth } from "@/lib/firebase"
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, User as FirebaseUser } from "firebase/auth"
import { Toaster, toast } from "sonner"
import { ADMIN_CSS } from "../dashboard/page"

const SETTINGS_CSS = `
.cfg-profile{display:flex;align-items:center;gap:1.5rem;padding:2rem;border-bottom:1px solid #f0ece5;}
.cfg-badges{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;}
.cfg-badge-gold{background:rgba(247,176,0,0.12);color:#a06000;border:1px solid rgba(247,176,0,0.25);padding:4px 12px;border-radius:100px;font-size:0.72rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;}
.cfg-badge-outline{background:#f8f6f2;color:#5a6878;border:1px solid #e0dbd2;padding:4px 12px;border-radius:100px;font-size:0.72rem;font-weight:600;}
.cfg-row{display:flex;align-items:center;justify-content:space-between;padding:1.5rem 2rem;border-bottom:1px solid #f5f3f0;gap:1rem;flex-wrap:wrap;}
.cfg-row:last-child{border-bottom:none;}
.cfg-row-title{font-family:'Syne',sans-serif;font-size:0.92rem;font-weight:700;color:#002240;margin-bottom:3px;}
.cfg-row-desc{font-size:0.78rem;color:#8a9aaa;}
.cfg-pass-input-wrap{position:relative;}
.cfg-pass-input-wrap input{padding-right:42px;}
.cfg-eye-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#b0bec5;padding:0;}
.cfg-eye-btn:hover{color:#5a6878;}
`

export default function AdminSettingsPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurr, setShowCurr] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => { if (auth.currentUser) setUser(auth.currentUser) }, [])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    if (newPassword !== confirmPassword) { toast.error("Senhas não coincidem."); setLoading(false); return }
    if (newPassword.length < 6) { toast.error("Mínimo 6 caracteres."); setLoading(false); return }
    if (!auth.currentUser?.email) { toast.error("Sessão inválida."); setLoading(false); return }
    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword)
      await reauthenticateWithCredential(auth.currentUser, cred)
      await updatePassword(auth.currentUser, newPassword)
      toast.success("Senha alterada com sucesso!")
      setIsDialogOpen(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') toast.error("Senha atual incorreta.")
      else if (err.code === 'auth/too-many-requests') toast.error("Muitas tentativas. Aguarde.")
      else toast.error("Erro ao atualizar senha.")
    } finally { setLoading(false) }
  }

  const initials = (name: string | null | undefined) => name ? name.substring(0, 2).toUpperCase() : "AD"

  return (
    <>
      <style>{ADMIN_CSS}{SETTINGS_CSS}</style>
      <Toaster />
      <div className="adm">
        <div className="adm-hero">
          <div className="adm-hero-orb1" /><div className="adm-hero-orb2" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="adm-hero-eyebrow">Administração</div>
            <div className="adm-hero-title">Configurações</div>
            <div className="adm-hero-sub">Gerencie suas preferências e configurações de conta administrativa.</div>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="adm-card" style={{ marginBottom: "1.5rem" }}>
          <div className="cfg-profile">
            <Avatar style={{ width: 72, height: 72, border: "3px solid #f0ece5", flexShrink: 0 }}>
              <AvatarImage src={user?.photoURL || ""} />
              <AvatarFallback style={{ background: "#f8f6f2", color: "#5a6878", fontSize: "1.3rem", fontWeight: 700 }}>
                {initials(user?.displayName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#002240" }}>
                {user?.displayName || "Administrador"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#8a9aaa", fontSize: "0.85rem", marginTop: 4 }}>
                <Mail size={13} /> {user?.email}
              </div>
              <div className="cfg-badges">
                <span className="cfg-badge-gold"><ShieldCheck size={10} style={{ display: "inline", marginRight: 4 }} />Super Admin</span>
                <span className="cfg-badge-outline">Acesso Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* SETTINGS */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div><div className="adm-card-title">Conta</div><div className="adm-card-sub">Gerencie suas informações de acesso e segurança.</div></div>
          </div>

          <div className="cfg-row">
            <div>
              <div className="cfg-row-title">Informações Pessoais</div>
              <div className="cfg-row-desc">Nome de exibição e e-mail de contato.</div>
            </div>
            <button className="adm-btn adm-btn-outline" disabled style={{ opacity: 0.5 }}>
              <Edit size={14} /> Editar (Indisponível)
            </button>
          </div>

          <div className="cfg-row">
            <div>
              <div className="cfg-row-title">Alterar Senha</div>
              <div className="cfg-row-desc">Mantenha sua conta segura com uma senha forte.</div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="adm-btn adm-btn-outline"><KeyRound size={14} /> Alterar Senha</button>
              </DialogTrigger>
              <DialogContent style={{ borderRadius: 20, maxWidth: 420 }}>
                <DialogHeader>
                  <DialogTitle style={{ fontFamily: "'Syne',sans-serif", color: "#002240" }}>Alterar Senha</DialogTitle>
                  <DialogDescription>Digite sua senha atual para confirmar e defina a nova senha.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleChangePassword}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "0.5rem 0 1rem" }}>
                    {[
                      { id: "curr", label: "Senha Atual", value: currentPassword, setter: setCurrentPassword, show: showCurr, toggle: () => setShowCurr(p => !p) },
                      { id: "new", label: "Nova Senha", value: newPassword, setter: setNewPassword, show: showNew, toggle: () => setShowNew(p => !p), placeholder: "Mínimo 6 caracteres" },
                      { id: "conf", label: "Confirmar Nova Senha", value: confirmPassword, setter: setConfirmPassword, show: showConf, toggle: () => setShowConf(p => !p) },
                    ].map(f => (
                      <div key={f.id}>
                        <Label htmlFor={f.id} style={{ fontSize: "0.78rem", fontWeight: 600, color: "#5a6878" }}>{f.label}</Label>
                        <div className="cfg-pass-input-wrap" style={{ marginTop: 5 }}>
                          <Input id={f.id} type={f.show ? "text" : "password"} value={f.value} onChange={e => f.setter(e.target.value)} required placeholder={f.placeholder} style={{ paddingRight: 42 }} />
                          <button type="button" className="cfg-eye-btn" onClick={f.toggle}>
                            {f.show ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <button type="button" className="adm-btn adm-btn-outline" onClick={() => setIsDialogOpen(false)}>Cancelar</button>
                    <button type="submit" className="adm-btn adm-btn-primary" disabled={loading}>
                      {loading && <Loader2 size={14} style={{ animation: "adm-spin 1s linear infinite" }} />}
                      Salvar Alteração
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  )
}