"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, Camera, Save, Edit3, Shield, Loader2, Star, Heart, ArrowRight, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { uploadImage } from "@/lib/cloudinary"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Separator } from "@/components/ui/separator"

const USR_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.usr {
  --navy: #002240;
  --gold: #F7B000;
  --cyan: #00CCFF;
  --rose: #E91E8C;
  --bg: #F4F1EC;
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  min-height: 100vh;
}

/* ── HERO ─────────────────────────────────── */
.usr-hero {
  background: var(--navy);
  padding: 2.5rem 1.5rem 5rem;
  position: relative;
  overflow: hidden;
}
.usr-hero-orb1 {
  position: absolute; border-radius: 50%; pointer-events: none;
  width: 500px; height: 500px;
  background: var(--cyan); opacity: 0.07; filter: blur(90px);
  top: -180px; right: -100px;
}
.usr-hero-orb2 {
  position: absolute; border-radius: 50%; pointer-events: none;
  width: 350px; height: 350px;
  background: var(--gold); opacity: 0.08; filter: blur(80px);
  bottom: -140px; left: -60px;
}
.usr-hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 56px 56px;
}
.usr-hero-inner {
  max-width: 1000px; margin: 0 auto;
  position: relative; z-index: 1;
  display: flex; align-items: center;
  justify-content: space-between; gap: 16px;
  flex-wrap: wrap;
}
.usr-hero-eyebrow {
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(0,204,255,0.7); margin-bottom: 6px;
}
.usr-hero-title {
  font-family: 'Syne', sans-serif;
  font-size: 2rem; font-weight: 800;
  color: #fff; line-height: 1.1; margin-bottom: 4px;
}
.usr-hero-sub {
  font-size: 0.875rem; color: rgba(255,255,255,0.5);
  font-weight: 300;
}

/* ── LAYOUT ───────────────────────────────── */
.usr-body {
  max-width: 1000px;
  margin: -3rem auto 0;
  padding: 0 1.5rem 4rem;
  position: relative; z-index: 10;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  align-items: start;
}

/* ── CARDS ────────────────────────────────── */
.usr-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 20px rgba(0,34,64,0.07);
  overflow: hidden;
  margin-bottom: 1.5rem;
}
.usr-card:last-child { margin-bottom: 0; }

.usr-card-header {
  padding: 1.3rem 1.6rem;
  border-bottom: 1px solid #f0ece5;
  display: flex; align-items: center;
  justify-content: space-between; gap: 12px;
}
.usr-card-title {
  font-family: 'Syne', sans-serif;
  font-size: 0.97rem; font-weight: 700;
  color: var(--navy);
  display: flex; align-items: center; gap: 8px;
}
.usr-card-body { padding: 1.6rem; }

/* ── PROFILE SUMMARY ──────────────────────── */
.usr-profile-strip {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  padding: 0 1.6rem 1.6rem;
  margin-top: -3rem;
}
.usr-avatar-wrap { position: relative; flex-shrink: 0; }
.usr-avatar-btn {
  position: absolute; bottom: 4px; right: 4px;
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--gold); border: 2.5px solid #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: 0 4px 12px rgba(247,176,0,0.35);
  transition: transform 0.2s;
}
.usr-avatar-btn:hover { transform: scale(1.1); }
.usr-avatar-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.usr-profile-name {
  font-family: 'Syne', sans-serif;
  font-size: 1.5rem; font-weight: 800;
  color: var(--navy); line-height: 1.1;
  margin-bottom: 4px;
}
.usr-profile-email {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.82rem; color: #8a9aaa;
}
.usr-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 12px; border-radius: 100px;
  font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.07em; text-transform: uppercase;
  margin-top: 10px;
}
.usr-badge-cyan {
  background: rgba(0,204,255,0.1);
  color: #007799;
  border: 1px solid rgba(0,204,255,0.2);
}

/* ── FORM ─────────────────────────────────── */
.usr-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}
.usr-field label {
  display: block;
  font-size: 0.75rem; font-weight: 600;
  color: #5a6878; margin-bottom: 6px;
  letter-spacing: 0.04em;
}
.usr-field input {
  width: 100%; height: 44px;
  padding: 0 14px;
  background: #f8f6f2;
  border: 1.5px solid #ede9e0;
  border-radius: 12px;
  font-size: 0.875rem;
  font-family: 'DM Sans', sans-serif;
  color: var(--navy);
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.usr-field input:focus {
  border-color: var(--cyan);
  background: #fff;
}
.usr-field input:disabled {
  opacity: 0.6; cursor: not-allowed;
  background: #f0ece5;
}

/* ── BUTTONS ──────────────────────────────── */
.usr-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 20px; border-radius: 12px;
  font-size: 0.83rem; font-weight: 600;
  cursor: pointer; border: none;
  font-family: 'DM Sans', sans-serif;
  transition: transform 0.2s, box-shadow 0.2s, background 0.15s;
}
.usr-btn-gold {
  background: var(--gold); color: var(--navy);
  box-shadow: 0 4px 16px rgba(247,176,0,0.3);
}
.usr-btn-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(247,176,0,0.4);
}
.usr-btn-cyan {
  background: rgba(0,204,255,0.12);
  color: #007799; border: 1.5px solid rgba(0,204,255,0.25);
}
.usr-btn-cyan:hover {
  background: rgba(0,204,255,0.2);
}
.usr-btn-ghost {
  background: transparent; color: #7a8a9a;
  border: 1.5px solid #ede9e0;
}
.usr-btn-ghost:hover { background: #f8f6f2; color: var(--navy); }
.usr-btn-green {
  background: #22c55e; color: #fff;
  box-shadow: 0 4px 14px rgba(34,197,94,0.3);
}
.usr-btn-green:hover { background: #16a34a; transform: translateY(-1px); }

/* ── SIDEBAR ──────────────────────────────── */
.usr-nav-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 20px rgba(0,34,64,0.07);
  overflow: hidden;
  margin-bottom: 1.25rem;
}
.usr-nav-header {
  background: #faf8f5;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f0ece5;
  font-family: 'Syne', sans-serif;
  font-size: 0.85rem; font-weight: 700;
  color: var(--navy);
}
.usr-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 0.85rem 1.25rem;
  font-size: 0.875rem; font-weight: 500;
  color: #5a6878; text-decoration: none;
  border-bottom: 1px solid #f8f6f2;
  transition: background 0.15s, color 0.15s;
}
.usr-nav-item:last-child { border-bottom: none; }
.usr-nav-item:hover {
  background: rgba(0,204,255,0.06);
  color: var(--navy);
}
.usr-nav-item.active {
  background: rgba(0,204,255,0.08);
  color: var(--navy); font-weight: 600;
}
.usr-nav-item.active .usr-nav-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--cyan); flex-shrink: 0;
  margin-left: auto;
}

.usr-promo-card {
  background: var(--navy);
  border-radius: 20px;
  padding: 1.4rem;
  position: relative; overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,34,64,0.2);
}
.usr-promo-orb {
  position: absolute; top: -10px; right: -10px;
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--gold); opacity: 0.2; filter: blur(20px);
}
.usr-promo-title {
  font-family: 'Syne', sans-serif;
  font-size: 1rem; font-weight: 700;
  color: #fff; margin-bottom: 6px;
  position: relative; z-index: 1;
}
.usr-promo-text {
  font-size: 0.8rem; color: rgba(255,255,255,0.6);
  line-height: 1.6; margin-bottom: 1rem;
  position: relative; z-index: 1;
}
.usr-promo-btn {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  width: 100%; padding: 10px;
  background: var(--gold); color: var(--navy);
  border: none; border-radius: 12px;
  font-family: 'Syne', sans-serif;
  font-size: 0.82rem; font-weight: 700;
  cursor: pointer; text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative; z-index: 1;
}
.usr-promo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(247,176,0,0.35);
}

/* ── LOADING ──────────────────────────────── */
.usr-loading {
  min-height: 100vh; display: flex;
  align-items: center; justify-content: center;
  background: var(--bg);
}
@keyframes usr-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

@media (max-width: 768px) {
  .usr-body { grid-template-columns: 1fr; margin-top: -1.5rem; }
  .usr-form-grid { grid-template-columns: 1fr; }
  .usr-profile-strip { flex-direction: column; align-items: flex-start; }
}
`;

type UserData = {
  name: string; email: string; phone: string;
  bio?: string; address?: string; birthDate?: string;
  avatar?: string; createdAt: Timestamp;
};

export default function UsuarioPerfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [formData, setFormData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docSnap = await getDoc(doc(db, "users", currentUser.uid));
          if (docSnap.exists()) setFormData(docSnap.data() as UserData);
          else setFormData({ name: currentUser.displayName || "", email: currentUser.email || "", phone: "", createdAt: Timestamp.now() });
        } catch (e) { console.error(e); }
      } else { window.location.href = '/login'; }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(p => p ? { ...p, [id]: value } : null);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !user) return;
    setUploading(true);
    try {
      const url = await uploadImage(e.target.files[0]);
      const updated = { ...formData!, avatar: url };
      setFormData(updated);
      await updateDoc(doc(db, "users", user.uid), { avatar: url });
    } catch (e) { console.error(e); } finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!user || !formData) return;
    await updateDoc(doc(db, "users", user.uid), formData);
    setIsEditing(false);
  };

  const getInitials = (name = "") => name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  if (loading || !formData) return (
    <>
      <style>{USR_CSS}</style>
      <div className="usr-loading">
        <Loader2 style={{ width: 40, height: 40, color: "#00CCFF", animation: "usr-spin 1s linear infinite" }} />
      </div>
    </>
  );

  const navItems = [
    { href: "/usuario/dashboard", label: "Meu Perfil", icon: <User size={16} />, active: true },
    { href: "/usuario/avaliacoes", label: "Minhas Avaliações", icon: <Star size={16} color="#F7B000" /> },
    { href: "/usuario/favoritos", label: "Locais Favoritos", icon: <Heart size={16} color="#ef4444" /> },
    { href: "/usuario/configuracoes", label: "Configurações", icon: <Shield size={16} /> },
  ];

  return (
    <>
      <style>{USR_CSS}</style>
      <div className="usr">
        <Header />

        {/* HERO */}
        <div className="usr-hero">
          <div className="usr-hero-orb1" /><div className="usr-hero-orb2" /><div className="usr-hero-grid" />
          <div className="usr-hero-inner">
            <div>
              <div className="usr-hero-eyebrow">Área do Usuário</div>
              <div className="usr-hero-title">Meu Perfil</div>
              <div className="usr-hero-sub">Gerencie suas informações pessoais</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {isEditing ? (
                <>
                  <button className="usr-btn usr-btn-ghost" onClick={() => setIsEditing(false)}>Cancelar</button>
                  <button className="usr-btn usr-btn-green" onClick={handleSave}>
                    <Save size={15} /> Salvar
                  </button>
                </>
              ) : (
                <button className="usr-btn usr-btn-gold" onClick={() => setIsEditing(true)}>
                  <Edit3 size={15} /> Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="usr-body">

          {/* COLUNA PRINCIPAL */}
          <div>
            {/* AVATAR CARD */}
            <div className="usr-card" style={{ paddingTop: "4rem" }}>
              <div className="usr-profile-strip">
                <div className="usr-avatar-wrap">
                  <Avatar style={{ width: 96, height: 96, border: "4px solid #fff", boxShadow: "0 8px 30px rgba(0,34,64,0.15)" }}>
                    <AvatarImage src={formData.avatar} style={{ objectFit: "cover" }} />
                    <AvatarFallback style={{ background: "rgba(0,204,255,0.1)", color: "#002240", fontSize: "1.5rem", fontWeight: 800 }}>
                      {getInitials(formData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <button className="usr-avatar-btn" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    {uploading
                      ? <Loader2 size={15} color="#002240" style={{ animation: "usr-spin 1s linear infinite" }} />
                      : <Camera size={15} color="#002240" />}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: "none" }} accept="image/png,image/jpeg" />
                </div>
                <div>
                  <div className="usr-profile-name">{formData.name || "Nome não informado"}</div>
                  <div className="usr-profile-email">
                    <Mail size={12} color="#F7B000" /> {formData.email}
                  </div>
                  <div className="usr-badge usr-badge-cyan">Cidadão</div>
                </div>
              </div>
            </div>

            {/* DADOS PESSOAIS */}
            <div className="usr-card">
              <div className="usr-card-header">
                <div className="usr-card-title">
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(0,204,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={15} color="#00CCFF" />
                  </div>
                  Dados Pessoais
                </div>
              </div>
              <div className="usr-card-body">
                <div className="usr-form-grid">
                  {[
                    { id: "name", label: "Nome Completo", icon: <User size={13} />, disabled: !isEditing },
                    { id: "email", label: "E-mail", icon: <Mail size={13} />, disabled: true },
                    { id: "phone", label: "Telefone", icon: <Phone size={13} />, disabled: !isEditing, placeholder: "(00) 00000-0000" },
                    { id: "birthDate", label: "Data de Nascimento", icon: <Calendar size={13} />, disabled: !isEditing, type: "date" },
                  ].map(f => (
                    <div key={f.id} className="usr-field">
                      <label htmlFor={f.id}>{f.label}</label>
                      <input
                        id={f.id} type={f.type || "text"}
                        value={(formData as any)[f.id] || ""}
                        onChange={handleInput}
                        disabled={f.disabled}
                        placeholder={f.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div>
            <div className="usr-nav-card">
              <div className="usr-nav-header">Navegação</div>
              {navItems.map(item => (
                <Link key={item.href} href={item.href} className={`usr-nav-item${item.active ? " active" : ""}`}>
                  {item.icon}
                  {item.label}
                  {item.active && <div className="usr-nav-dot" />}
                </Link>
              ))}
            </div>

            <div className="usr-promo-card">
              <div className="usr-promo-orb" />
              <div className="usr-promo-title">Descubra Novos Lugares</div>
              <div className="usr-promo-text">Explore o bairro e encontre os melhores estabelecimentos perto de você.</div>
              <Link href="/busca" className="usr-promo-btn">
                Ir para o Mapa <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}