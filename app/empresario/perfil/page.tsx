"use client"

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import {
  Loader2, Save, Edit3, Building2, Tag, AlignLeft,
  Phone, MessageCircle, Globe, MapPin, Clock, Store, ArrowRight
} from "lucide-react"

const ProfileMapNoSSR = dynamic(() => import("./ProfileMapComponent"), { ssr: false });

// ─── CSS ──────────────────────────────────────────────────────────────────────
const EMP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.emp {
  --navy: #002240;
  --gold: #F7B000;
  --cyan: #00CCFF;
  --bg: #F4F1EC;
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  min-height: 100vh;
}

.emp-hero {
  background: var(--navy);
  padding: 2.5rem 1.5rem 5rem;
  position: relative; overflow: hidden;
}
.emp-hero-orb1 {
  position: absolute; border-radius: 50%; pointer-events: none;
  width: 500px; height: 500px;
  background: var(--cyan); opacity: 0.07; filter: blur(90px);
  top: -180px; right: -100px;
}
.emp-hero-orb2 {
  position: absolute; border-radius: 50%; pointer-events: none;
  width: 350px; height: 350px;
  background: var(--gold); opacity: 0.08; filter: blur(80px);
  bottom: -140px; left: -60px;
}
.emp-hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 56px 56px;
}
.emp-hero-inner {
  max-width: 1000px; margin: 0 auto;
  position: relative; z-index: 1;
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.emp-hero-eyebrow {
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(0,204,255,0.7); margin-bottom: 6px;
}
.emp-hero-title {
  font-family: 'Syne', sans-serif;
  font-size: 2rem; font-weight: 800;
  color: #fff; margin-bottom: 4px;
}
.emp-hero-sub { font-size: 0.875rem; color: rgba(255,255,255,0.5); font-weight: 300; }

/* ── BODY ──────────────────────────────────── */
.emp-body {
  max-width: 1000px;
  margin: -3rem auto 0;
  padding: 0 1.5rem 4rem;
  position: relative; z-index: 10;
}

/* ── CARDS ─────────────────────────────────── */
.emp-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 20px rgba(0,34,64,0.07);
  overflow: hidden;
  margin-bottom: 1.5rem;
}
.emp-card:last-child { margin-bottom: 0; }

.emp-card-header {
  padding: 1.2rem 1.6rem;
  border-bottom: 1px solid #f0ece5;
  display: flex; align-items: center;
  justify-content: space-between; gap: 12px;
}
.emp-card-title-wrap {
  display: flex; align-items: center; gap: 10px;
}
.emp-card-icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.emp-card-title {
  font-family: 'Syne', sans-serif;
  font-size: 0.95rem; font-weight: 700;
  color: var(--navy);
}

/* ── INFO GRID ─────────────────────────────── */
.emp-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}
.emp-info-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 1.3rem 1.6rem;
  border-bottom: 1px solid #f8f6f2;
  border-right: 1px solid #f8f6f2;
}
.emp-info-item:nth-child(even) { border-right: none; }
.emp-info-item.full-width {
  grid-column: 1 / -1; border-right: none;
}
.emp-info-item:last-child,
.emp-info-item:nth-last-child(2):not(.full-width) { border-bottom: none; }

.emp-info-icon {
  width: 38px; height: 38px; border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; background: rgba(0,204,255,0.08);
  margin-top: 2px;
}
.emp-info-label {
  font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.07em; text-transform: uppercase;
  color: #b0bec5; margin-bottom: 4px;
}
.emp-info-value {
  font-size: 0.9rem; color: var(--navy);
  font-weight: 500; line-height: 1.4;
}
.emp-info-value.empty { color: #b0bec5; font-style: italic; font-weight: 400; }

/* ── EDIT FORM ─────────────────────────────── */
.emp-form-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 1.1rem; padding: 1.5rem 1.6rem;
}
.emp-field label {
  display: block; font-size: 0.72rem;
  font-weight: 700; color: #5a6878;
  margin-bottom: 6px; letter-spacing: 0.05em;
  text-transform: uppercase;
}
.emp-field input,
.emp-field textarea {
  width: 100%;
  padding: 10px 14px;
  background: #f8f6f2;
  border: 1.5px solid #ede9e0;
  border-radius: 12px;
  font-size: 0.875rem;
  font-family: 'DM Sans', sans-serif;
  color: var(--navy); outline: none;
  transition: border-color 0.2s, background 0.2s;
  resize: vertical;
}
.emp-field input { height: 44px; }
.emp-field input:focus,
.emp-field textarea:focus {
  border-color: var(--cyan);
  background: #fff;
}
.emp-field.full { grid-column: 1 / -1; }

/* ── BUTTONS ───────────────────────────────── */
.emp-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 20px; border-radius: 12px;
  font-size: 0.83rem; font-weight: 600;
  cursor: pointer; border: none;
  font-family: 'DM Sans', sans-serif;
  transition: transform 0.2s, box-shadow 0.2s, background 0.15s;
}
.emp-btn-gold {
  background: var(--gold); color: var(--navy);
  box-shadow: 0 4px 16px rgba(247,176,0,0.3);
}
.emp-btn-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(247,176,0,0.4);
}
.emp-btn-green {
  background: #22c55e; color: #fff;
  box-shadow: 0 4px 14px rgba(34,197,94,0.3);
}
.emp-btn-green:hover { background: #16a34a; transform: translateY(-1px); }
.emp-btn-ghost {
  background: transparent; color: rgba(255,255,255,0.7);
  border: 1.5px solid rgba(255,255,255,0.2);
}
.emp-btn-ghost:hover { background: rgba(255,255,255,0.1); }

/* ── MAP CARD ──────────────────────────────── */
.emp-map-wrap {
  border-radius: 16px; overflow: hidden;
  height: 320px; background: #f0ece5;
}
.emp-map-label {
  padding: 0 1.6rem 1.4rem;
  font-size: 0.75rem; color: #8a9aaa;
  display: flex; align-items: center; gap: 5px;
}

/* ── LOADING ───────────────────────────────── */
.emp-loading {
  min-height: 100vh; display: flex;
  align-items: center; justify-content: center;
  background: var(--bg);
}
@keyframes emp-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

@media (max-width: 768px) {
  .emp-info-grid { grid-template-columns: 1fr; }
  .emp-info-item { border-right: none; }
  .emp-info-item.full-width { grid-column: 1; }
  .emp-form-grid { grid-template-columns: 1fr; }
  .emp-field.full { grid-column: 1; }
}
`;

type BusinessData = {
  businessName: string; category: string; description: string;
  businessPhone: string; whatsapp: string; website: string;
  address: string; hours: string; [key: string]: string;
};

type FormField = {
  id: string;
  label: string;
  fullWidth?: boolean;
  textarea?: boolean;
};

function InfoItem({ icon, label, value, fullWidth }: { icon: React.ReactNode; label: string; value?: string; fullWidth?: boolean }) {
  return (
    <div className={`emp-info-item${fullWidth ? " full-width" : ""}`}>
      <div className="emp-info-icon">{icon}</div>
      <div>
        <div className="emp-info-label">{label}</div>
        <div className={`emp-info-value${!value ? " empty" : ""}`}>{value || "Não informado"}</div>
      </div>
    </div>
  );
}

export default function EmpresarioPerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<BusinessData | null>(null);
  const [position, setPosition] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "businesses", user.uid));
        if (snap.exists()) {
          const data = snap.data() as BusinessData;
          setFormData(data);
          if (data.location) setPosition({ lat: (data as any).location.latitude, lng: (data as any).location.longitude });
        }
      } else { router.push("/login"); }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(p => p ? { ...p, [e.target.id]: e.target.value } : null);
  };

  const handleSave = async () => {
    if (!auth.currentUser || !formData) return;
    setSaving(true);
    await updateDoc(doc(db, "businesses", auth.currentUser.uid), {
      ...formData,
      location: position ? { latitude: position.lat, longitude: position.lng } : null
    });
    setSaving(false);
    setIsEditing(false);
  };

  if (loading || !formData) return (
    <>
      <style>{EMP_CSS}</style>
      <div className="emp-loading">
        <Loader2 style={{ width: 40, height: 40, color: "#00CCFF", animation: "emp-spin 1s linear infinite" }} />
      </div>
    </>
  );

  const sections: Array<{
    title: string;
    iconColor: string;
    iconBg: string;
    icon: React.ReactNode;
    editFields: FormField[];
    viewItems: Array<{ icon: React.ReactNode; label: string; value?: string; fullWidth?: boolean }>;
  }> = [
    {
      title: "Informações Básicas", iconColor: "#00CCFF",
      iconBg: "rgba(0,204,255,0.1)", icon: <Store size={16} color="#00CCFF" />,
      editFields: [
        { id: "businessName", label: "Nome do Estabelecimento", textarea: false },
        { id: "category", label: "Categoria", textarea: false },
        { id: "description", label: "Descrição", fullWidth: true, textarea: true },
      ],
      viewItems: [
        { icon: <Building2 size={16} color="#00CCFF" />, label: "Nome", value: formData.businessName },
        { icon: <Tag size={16} color="#00CCFF" />, label: "Categoria", value: formData.category },
        { icon: <AlignLeft size={16} color="#00CCFF" />, label: "Descrição", value: formData.description, fullWidth: true },
      ]
    },
    {
      title: "Contato", iconColor: "#F7B000",
      iconBg: "rgba(247,176,0,0.1)", icon: <Phone size={16} color="#F7B000" />,
      editFields: [
        { id: "businessPhone", label: "Telefone", textarea: false },
        { id: "whatsapp", label: "WhatsApp", textarea: false },
        { id: "website", label: "Instagram / Site", fullWidth: true, textarea: false },
      ],
      viewItems: [
        { icon: <Phone size={16} color="#00CCFF" />, label: "Telefone", value: formData.businessPhone },
        { icon: <MessageCircle size={16} color="#00CCFF" />, label: "WhatsApp", value: formData.whatsapp },
        { icon: <Globe size={16} color="#00CCFF" />, label: "Instagram / Site", value: formData.website, fullWidth: true },
      ]
    },
    {
      title: "Localização e Horários", iconColor: "#22c55e",
      iconBg: "rgba(34,197,94,0.1)", icon: <MapPin size={16} color="#22c55e" />,
      editFields: [
        { id: "address", label: "Endereço", textarea: false },
        { id: "hours", label: "Horário de Funcionamento", textarea: false },
      ],
      viewItems: [
        { icon: <MapPin size={16} color="#00CCFF" />, label: "Endereço", value: formData.address },
        { icon: <Clock size={16} color="#00CCFF" />, label: "Horário", value: formData.hours },
      ]
    },
  ];

  return (
    <>
      <style>{EMP_CSS}</style>
      <div className="emp">

        <div className="emp-hero">
          <div className="emp-hero-orb1" /><div className="emp-hero-orb2" /><div className="emp-hero-grid" />
          <div className="emp-hero-inner">
            <div>
              <div className="emp-hero-eyebrow">Área do Empresário</div>
              <div className="emp-hero-title">Perfil do Negócio</div>
              <div className="emp-hero-sub">
                {isEditing ? "Edite as informações do seu estabelecimento" : "Gerencie e mantenha seu perfil atualizado"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              {isEditing ? (
                <>
                  <button className="emp-btn emp-btn-ghost" onClick={() => setIsEditing(false)}>Cancelar</button>
                  <button className="emp-btn emp-btn-green" onClick={handleSave} disabled={saving}>
                    {saving
                      ? <Loader2 size={15} style={{ animation: "emp-spin 1s linear infinite" }} />
                      : <Save size={15} />}
                    {saving ? "Salvando..." : "Salvar"}
                  </button>
                </>
              ) : (
                <button className="emp-btn emp-btn-gold" onClick={() => setIsEditing(true)}>
                  <Edit3 size={15} /> Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="emp-body">
          {sections.map(section => (
            <div key={section.title} className="emp-card">
              <div className="emp-card-header">
                <div className="emp-card-title-wrap">
                  <div className="emp-card-icon" style={{ background: section.iconBg }}>
                    {section.icon}
                  </div>
                  <div className="emp-card-title">{section.title}</div>
                </div>
              </div>

              {isEditing ? (
                <div className="emp-form-grid">
                  {section.editFields.map(f => (
                    <div key={f.id} className={`emp-field${f.fullWidth ? " full" : ""}`}>
                      <label htmlFor={f.id}>{f.label}</label>
                      {f.textarea ? (
                        <textarea id={f.id} value={formData[f.id] || ""} onChange={handleInput} rows={3} />
                      ) : (
                        <input id={f.id} type="text" value={formData[f.id] || ""} onChange={handleInput} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="emp-info-grid">
                  {section.viewItems.map((item, i) => (
                    <InfoItem key={i} icon={item.icon} label={item.label} value={item.value} fullWidth={item.fullWidth} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* MAP */}
          <div className="emp-card">
            <div className="emp-card-header">
              <div className="emp-card-title-wrap">
                <div className="emp-card-icon" style={{ background: "rgba(233,30,140,0.08)" }}>
                  <MapPin size={16} color="#E91E8C" />
                </div>
                <div className="emp-card-title">Localização no Mapa</div>
              </div>
            </div>
            <div style={{ padding: "1.2rem 1.6rem 1.6rem" }}>
              <div className="emp-map-wrap">
                <ProfileMapNoSSR position={position} setPosition={setPosition} isEditing={isEditing} />
              </div>
              {isEditing && (
                <div className="emp-map-label">
                  <MapPin size={11} /> Clique no mapa para definir a localização do seu estabelecimento
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}