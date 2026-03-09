"use client"

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import {
  Loader2, Save, Edit3, Building2, Tag, AlignLeft,
  Phone, MessageCircle, Globe, MapPin, Clock, Store,
  CheckCircle2, XCircle
} from "lucide-react"

const ProfileMapNoSSR = dynamic(() => import("./ProfileMapComponent"), { ssr: false })

// ─── CSS ──────────────────────────────────────────────────────────────────────
const EMP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.emp {
  --navy: #002240; --gold: #F7B000; --cyan: #00CCFF; --bg: #F4F1EC;
  font-family: 'DM Sans', sans-serif;
  background: var(--bg); min-height: 100vh;
}

/* ── HERO ── */
.emp-hero {
  background: var(--navy);
  padding: 2.5rem 1.5rem 5rem;
  position: relative; overflow: hidden;
}
.emp-hero-orb1 { position:absolute;border-radius:50%;pointer-events:none;width:500px;height:500px;background:var(--cyan);opacity:0.07;filter:blur(90px);top:-180px;right:-100px; }
.emp-hero-orb2 { position:absolute;border-radius:50%;pointer-events:none;width:350px;height:350px;background:var(--gold);opacity:0.08;filter:blur(80px);bottom:-140px;left:-60px; }
.emp-hero-grid {
  position:absolute;inset:0;
  background-image:linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);
  background-size:56px 56px;
}
.emp-hero-inner {
  max-width:980px;margin:0 auto;position:relative;z-index:1;
  display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;
}
.emp-hero-eyebrow { font-size:0.67rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(0,204,255,0.65);margin-bottom:6px; }
.emp-hero-title { font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:#fff;margin-bottom:4px;line-height:1.15; }
.emp-hero-sub { font-size:0.85rem;color:rgba(255,255,255,0.45);font-weight:300; }

/* ── BODY ── */
.emp-body { max-width:980px;margin:-3rem auto 0;padding:0 1.5rem 4rem;position:relative;z-index:10; }

/* ── CARD ── */
.emp-card {
  background:#fff;border-radius:20px;
  box-shadow:0 2px 20px rgba(0,34,64,0.07);
  overflow:hidden;margin-bottom:1.5rem;border:1px solid #f0ece5;
}
.emp-card:last-child { margin-bottom:0; }
.emp-card-header {
  padding:1.2rem 1.6rem;border-bottom:1px solid #f0ece5;
  display:flex;align-items:center;justify-content:space-between;gap:12px;
}
.emp-card-title-wrap { display:flex;align-items:center;gap:10px; }
.emp-card-icon { width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.emp-card-title { font-family:'Syne',sans-serif;font-size:0.95rem;font-weight:700;color:var(--navy); }

/* ── INFO GRID ── */
.emp-info-grid { display:grid;grid-template-columns:1fr 1fr;gap:0; }
.emp-info-item {
  display:flex;align-items:flex-start;gap:14px;
  padding:1.3rem 1.6rem;
  border-bottom:1px solid #f8f6f2;
  border-right:1px solid #f8f6f2;
}
.emp-info-item:nth-child(even) { border-right:none; }
.emp-info-item.full { grid-column:1/-1;border-right:none; }
.emp-info-item:last-child,
.emp-info-item:nth-last-child(2):not(.full) { border-bottom:none; }
.emp-info-icon { width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px; }
.emp-info-label { font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#b0bec5;margin-bottom:4px; }
.emp-info-value { font-size:0.9rem;color:var(--navy);font-weight:500;line-height:1.45; }
.emp-info-value.empty { color:#b0bec5;font-style:italic;font-weight:400; }

/* ── FORM ── */
.emp-form-grid { display:grid;grid-template-columns:1fr 1fr;gap:1.1rem;padding:1.5rem 1.6rem; }
.emp-field label { display:block;font-size:0.7rem;font-weight:700;color:#5a6878;margin-bottom:5px;letter-spacing:0.06em;text-transform:uppercase; }
.emp-field input, .emp-field textarea, .emp-field select {
  width:100%;padding:10px 14px;
  background:#f8f6f2;border:1.5px solid #ede9e0;
  border-radius:12px;font-size:0.875rem;
  font-family:'DM Sans',sans-serif;color:var(--navy);
  outline:none;transition:border-color 0.2s,background 0.2s;resize:vertical;
}
.emp-field input { height:44px; }
.emp-field select { height:44px;cursor:pointer; }
.emp-field input:focus,.emp-field textarea:focus,.emp-field select:focus { border-color:var(--cyan);background:#fff; }
.emp-field.full { grid-column:1/-1; }

/* ── BUTTONS ── */
.emp-btn {
  display:inline-flex;align-items:center;gap:7px;
  padding:10px 20px;border-radius:12px;
  font-size:0.83rem;font-weight:700;cursor:pointer;border:none;
  font-family:'DM Sans',sans-serif;
  transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s,background 0.15s;
}
.emp-btn-gold { background:var(--gold);color:var(--navy);box-shadow:0 4px 16px rgba(247,176,0,0.28); }
.emp-btn-gold:hover { transform:translateY(-2px);box-shadow:0 8px 26px rgba(247,176,0,0.4); }
.emp-btn-green { background:#22c55e;color:#fff;box-shadow:0 4px 14px rgba(34,197,94,0.28); }
.emp-btn-green:hover { transform:translateY(-2px);box-shadow:0 8px 22px rgba(34,197,94,0.38); }
.emp-btn-green:disabled { opacity:0.6;cursor:not-allowed;transform:none; }
.emp-btn-ghost { background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.65);border:1.5px solid rgba(255,255,255,0.15); }
.emp-btn-ghost:hover { background:rgba(255,255,255,0.12);color:#fff; }

/* ── HOURS ── */
.emp-hours-summary {
  display:inline-flex;align-items:center;gap:6px;
  padding:4px 12px;border-radius:100px;
  font-size:0.72rem;font-weight:700;margin-bottom:1.1rem;
}
.emp-hours-grid { display:grid;grid-template-columns:repeat(7,1fr);gap:8px; }
.emp-hour-chip {
  border-radius:13px;padding:10px 6px;text-align:center;
  border:1.5px solid #f0ece5;background:#faf8f5;
  transition:transform 0.2s;
}
.emp-hour-chip.open { background:rgba(0,204,255,0.04);border-color:rgba(0,204,255,0.25); }
.emp-hour-chip.closed { opacity:0.6; }
.emp-hour-day { font-size:0.62rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px; }
.emp-hour-day.open { color:var(--navy); }
.emp-hour-day.closed { color:#b0bec5; }
.emp-hour-status { display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;margin:0 auto 6px; }
.emp-hour-time { font-size:0.65rem;font-weight:600;color:#3a4a5a;line-height:1.65; }
.emp-hour-closed-lbl { font-size:0.64rem;color:#b0bec5;font-weight:500; }

/* ── HOURS EDIT ── */
.emp-hours-edit-grid { display:grid;grid-template-columns:repeat(7,1fr);gap:8px; }
.emp-day-edit {
  border-radius:13px;padding:10px 8px;
  border:1.5px solid #f0ece5;background:#faf8f5;
  transition:border-color 0.2s;
}
.emp-day-edit.active { border-color:rgba(0,204,255,0.35);background:rgba(0,204,255,0.04); }
.emp-day-edit-head { display:flex;align-items:center;gap:6px;margin-bottom:8px; }
.emp-day-edit-lbl { font-size:0.62rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;color:#3a4a5a; }
.emp-day-toggle { width:20px;height:20px;border-radius:6px;border:2px solid #ddd;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.15s,border-color 0.15s; }
.emp-day-toggle.on { background:var(--cyan);border-color:var(--cyan); }
.emp-time-inp {
  width:100%;height:32px;padding:0 6px;
  background:#fff;border:1.5px solid #ede9e0;
  border-radius:8px;font-size:0.72rem;
  font-family:'DM Sans',sans-serif;color:var(--navy);
  outline:none;transition:border-color 0.15s;margin-bottom:4px;
}
.emp-time-inp:last-child { margin-bottom:0; }
.emp-time-inp:focus { border-color:var(--cyan); }

/* ── MAP ── */
.emp-map-wrap { border-radius:16px;overflow:hidden;height:320px;background:#f0ece5; }

/* ── LOADING ── */
.emp-loading { min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg); }
@keyframes emp-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

@media(max-width:768px) {
  .emp-info-grid { grid-template-columns:1fr; }
  .emp-info-item { border-right:none; }
  .emp-info-item.full { grid-column:1; }
  .emp-form-grid { grid-template-columns:1fr; }
  .emp-field.full { grid-column:1; }
  .emp-hours-grid,.emp-hours-edit-grid { grid-template-columns:repeat(4,1fr); }
}
@media(max-width:480px) {
  .emp-hours-grid,.emp-hours-edit-grid { grid-template-columns:repeat(3,1fr); }
}
`

// ─── TYPES ─────────────────────────────────────────────────────────────────────
type OpeningHour = { day: string; opens: string; closes: string; isOpen: boolean }
type BusinessData = {
  businessName: string; category: string; description: string;
  businessPhone: string; whatsapp: string; website: string;
  address: string; openingHours?: OpeningHour[]; [key: string]: any;
}

const ALL_DAYS = [
  { short: "Seg", full: "Segunda-feira" },
  { short: "Ter", full: "Terça-feira" },
  { short: "Qua", full: "Quarta-feira" },
  { short: "Qui", full: "Quinta-feira" },
  { short: "Sex", full: "Sexta-feira" },
  { short: "Sáb", full: "Sábado" },
  { short: "Dom", full: "Domingo" },
]

// ─── HOURS DISPLAY ──────────────────────────────────────────────────────────────
function HoursDisplay({ openingHours }: { openingHours?: OpeningHour[] }) {
  const count = openingHours?.length || 0
  // Map saved hours to each day using partial match
  const getHour = (short: string, full: string) =>
    openingHours?.find(h =>
      h.day?.toLowerCase().startsWith(short.toLowerCase().slice(0, 3)) ||
      full.toLowerCase().startsWith(h.day?.toLowerCase().slice(0, 3) || "_")
    ) || null

  return (
    <div style={{ padding: "0 1.6rem 1.6rem" }}>
      {/* Summary chip */}
      <div className="emp-hours-summary" style={{ background: count > 0 ? "rgba(34,197,94,0.09)" : "rgba(176,190,197,0.12)", color: count > 0 ? "#16a34a" : "#8a9aaa", border: `1px solid ${count > 0 ? "rgba(34,197,94,0.22)" : "rgba(176,190,197,0.2)"}` }}>
        <Clock size={11} />
        {count > 0 ? `${count} dia${count !== 1 ? "s" : ""} com atendimento` : "Horários não configurados"}
      </div>

      {/* Day chips */}
      <div className="emp-hours-grid">
        {ALL_DAYS.map(({ short, full }) => {
          const h = getHour(short, full)
          const isOpen = !!h
          return (
            <div key={short} className={`emp-hour-chip ${isOpen ? "open" : "closed"}`}>
              <div className={`emp-hour-day ${isOpen ? "open" : "closed"}`}>{short}</div>
              <div className="emp-hour-status" style={{ background: isOpen ? "rgba(34,197,94,0.1)" : "rgba(176,190,197,0.1)" }}>
                {isOpen ? <CheckCircle2 size={13} color="#22c55e" /> : <XCircle size={13} color="#c8d4dc" />}
              </div>
              {isOpen && h ? (
                <div className="emp-hour-time">{h.opens}<br />{h.closes}</div>
              ) : (
                <div className="emp-hour-closed-lbl">Fechado</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── HOURS EDITOR ───────────────────────────────────────────────────────────────
function HoursEditor({ openingHours, onChange }: {
  openingHours: OpeningHour[]
  onChange: (hours: OpeningHour[]) => void
}) {
  // Build editing state: all 7 days, prefilled from saved data
  const [days, setDays] = useState<OpeningHour[]>(() =>
    ALL_DAYS.map(({ full }) => {
      const existing = openingHours.find(h =>
        full.toLowerCase().startsWith(h.day?.toLowerCase().slice(0, 3) || "_") ||
        h.day?.toLowerCase().startsWith(full.toLowerCase().slice(0, 3))
      )
      return existing ? { ...existing, day: full, isOpen: true }
        : { day: full, opens: "08:00", closes: "18:00", isOpen: false }
    })
  )

  const toggle = (i: number) => {
    const updated = days.map((d, idx) => idx === i ? { ...d, isOpen: !d.isOpen } : d)
    setDays(updated)
    onChange(updated.filter(d => d.isOpen))
  }

  const setTime = (i: number, field: "opens" | "closes", val: string) => {
    const updated = days.map((d, idx) => idx === i ? { ...d, [field]: val } : d)
    setDays(updated)
    onChange(updated.filter(d => d.isOpen))
  }

  return (
    <div className="emp-hours-edit-grid">
      {days.map((day, i) => (
        <div key={day.day} className={`emp-day-edit ${day.isOpen ? "active" : ""}`}>
          <div className="emp-day-edit-head">
            <button
              type="button"
              className={`emp-day-toggle ${day.isOpen ? "on" : ""}`}
              onClick={() => toggle(i)}
            >
              {day.isOpen && <CheckCircle2 size={12} color="#fff" />}
            </button>
            <span className="emp-day-edit-lbl">{ALL_DAYS[i].short}</span>
          </div>
          {day.isOpen && (
            <>
              <input type="time" className="emp-time-inp" value={day.opens} onChange={e => setTime(i, "opens", e.target.value)} />
              <input type="time" className="emp-time-inp" value={day.closes} onChange={e => setTime(i, "closes", e.target.value)} />
            </>
          )}
          {!day.isOpen && (
            <div style={{ fontSize: "0.62rem", color: "#c0cad2", textAlign: "center", paddingTop: 2 }}>Fechado</div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── INFO ITEM ──────────────────────────────────────────────────────────────────
function InfoItem({ icon, label, value, full, iconBg = "rgba(0,204,255,0.08)", iconColor = "#00CCFF" }: {
  icon: React.ReactNode; label: string; value?: string;
  full?: boolean; iconBg?: string; iconColor?: string
}) {
  return (
    <div className={`emp-info-item${full ? " full" : ""}`}>
      <div className="emp-info-icon" style={{ background: iconBg }}>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <div>
        <div className="emp-info-label">{label}</div>
        <div className={`emp-info-value${!value ? " empty" : ""}`}>{value || "Não informado"}</div>
      </div>
    </div>
  )
}

// ─── PAGE ───────────────────────────────────────────────────────────────────────
export default function EmpresarioPerfilPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<BusinessData | null>(null)
  const [position, setPosition] = useState<any>(null)
  const [editHours, setEditHours] = useState<OpeningHour[]>([])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "businesses", user.uid))
        if (snap.exists()) {
          const data = snap.data() as BusinessData
          setFormData(data)
          setEditHours(data.openingHours || [])
          if (data.location) setPosition({ lat: data.location.latitude, lng: data.location.longitude })
        }
      } else { router.push("/login") }
      setLoading(false)
    })
    return () => unsub()
  }, [router])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(p => p ? { ...p, [e.target.id]: e.target.value } : null)
  }

  const handleSave = async () => {
    if (!auth.currentUser || !formData) return
    setSaving(true)
    await updateDoc(doc(db, "businesses", auth.currentUser.uid), {
      ...formData,
      openingHours: editHours,
      location: position ? { latitude: position.lat, longitude: position.lng } : null
    })
    setFormData(p => p ? { ...p, openingHours: editHours } : null)
    setSaving(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditHours(formData?.openingHours || [])
    setIsEditing(false)
  }

  if (loading || !formData) return (
    <>
      <style>{EMP_CSS}</style>
      <div className="emp-loading">
        <Loader2 style={{ width: 40, height: 40, color: "#00CCFF", animation: "emp-spin 1s linear infinite" }} />
      </div>
    </>
  )

  const SECTIONS = [
    {
      title: "Informações Básicas",
      iconBg: "rgba(0,204,255,0.1)", iconColor: "#00CCFF",
      icon: <Store size={16} />,
      editFields: [
        { id: "businessName", label: "Nome do Estabelecimento" },
        { id: "category", label: "Categoria" },
        { id: "description", label: "Descrição", full: true, textarea: true },
      ],
      viewItems: [
        { icon: <Building2 size={16} />, label: "Nome", value: formData.businessName, iconBg: "rgba(0,204,255,0.08)", iconColor: "#00CCFF" },
        { icon: <Tag size={16} />, label: "Categoria", value: formData.category, iconBg: "rgba(247,176,0,0.1)", iconColor: "#F7B000" },
        { icon: <AlignLeft size={16} />, label: "Descrição", value: formData.description, full: true, iconBg: "rgba(139,92,246,0.08)", iconColor: "#8B5CF6" },
      ]
    },
    {
      title: "Contato",
      iconBg: "rgba(247,176,0,0.1)", iconColor: "#F7B000",
      icon: <Phone size={16} />,
      editFields: [
        { id: "businessPhone", label: "Telefone" },
        { id: "whatsapp", label: "WhatsApp" },
        { id: "website", label: "Instagram / Site", full: true },
      ],
      viewItems: [
        { icon: <Phone size={16} />, label: "Telefone", value: formData.businessPhone, iconBg: "rgba(34,197,94,0.08)", iconColor: "#22c55e" },
        { icon: <MessageCircle size={16} />, label: "WhatsApp", value: formData.whatsapp, iconBg: "rgba(34,197,94,0.08)", iconColor: "#22c55e" },
        { icon: <Globe size={16} />, label: "Instagram / Site", value: formData.website, full: true, iconBg: "rgba(0,204,255,0.08)", iconColor: "#00CCFF" },
      ]
    },
  ]

  return (
    <>
      <style>{EMP_CSS}</style>
      <div className="emp">

        {/* ── HERO ── */}
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
                  <button className="emp-btn emp-btn-ghost" onClick={handleCancel}>Cancelar</button>
                  <button className="emp-btn emp-btn-green" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 size={15} style={{ animation: "emp-spin 1s linear infinite" }} /> : <Save size={15} />}
                    {saving ? "Salvando..." : "Salvar Alterações"}
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

          {/* ── INFO SECTIONS ── */}
          {SECTIONS.map(section => (
            <div key={section.title} className="emp-card">
              <div className="emp-card-header">
                <div className="emp-card-title-wrap">
                  <div className="emp-card-icon" style={{ background: section.iconBg }}>
                    <span style={{ color: section.iconColor }}>{section.icon}</span>
                  </div>
                  <div className="emp-card-title">{section.title}</div>
                </div>
              </div>
              {isEditing ? (
                <div className="emp-form-grid">
                  {section.editFields.map(f => (
                    <div key={f.id} className={`emp-field${f.full ? " full" : ""}`}>
                      <label htmlFor={f.id}>{f.label}</label>
                      {(f as any).textarea ? (
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
                    <InfoItem key={i} {...item} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* ── LOCALIZAÇÃO E HORÁRIOS ── */}
          <div className="emp-card">
            <div className="emp-card-header">
              <div className="emp-card-title-wrap">
                <div className="emp-card-icon" style={{ background: "rgba(233,30,140,0.08)" }}>
                  <MapPin size={16} color="#E91E8C" />
                </div>
                <div className="emp-card-title">Localização e Horários</div>
              </div>
            </div>

            {/* ENDEREÇO */}
            {isEditing ? (
              <div className="emp-form-grid">
                <div className="emp-field full">
                  <label htmlFor="address">Endereço</label>
                  <input id="address" type="text" value={formData.address || ""} onChange={handleInput} />
                </div>
              </div>
            ) : (
              <div className="emp-info-grid">
                <InfoItem icon={<MapPin size={16} />} label="Endereço" value={formData.address} full iconBg="rgba(233,30,140,0.08)" iconColor="#E91E8C" />
              </div>
            )}

            {/* DIVIDER */}
            <div style={{ height: 1, background: "#f5f3f0", margin: "0 1.6rem" }} />

            {/* HORÁRIOS HEADER */}
            <div style={{ padding: "1.2rem 1.6rem 0", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,204,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Clock size={16} color="#00CCFF" />
              </div>
              <div>
                <div style={{ fontSize: "0.95rem", fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#002240" }}>Horário de Funcionamento</div>
                <div style={{ fontSize: "0.75rem", color: "#8a9aaa", marginTop: 2 }}>
                  {isEditing ? "Ative os dias e configure os horários de abertura e fechamento" : "Dias e horários de atendimento"}
                </div>
              </div>
            </div>

            {/* HOURS CONTENT */}
            {isEditing ? (
              <div style={{ padding: "1.2rem 1.6rem 1.6rem" }}>
                <HoursEditor openingHours={editHours} onChange={setEditHours} />
              </div>
            ) : (
              <HoursDisplay openingHours={formData.openingHours} />
            )}

            {/* DIVIDER */}
            <div style={{ height: 1, background: "#f5f3f0", margin: "0 1.6rem" }} />

            {/* MAPA */}
            <div style={{ padding: "1.2rem 1.6rem 0", display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(233,30,140,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MapPin size={16} color="#E91E8C" />
              </div>
              <div>
                <div style={{ fontSize: "0.95rem", fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#002240" }}>Localização no Mapa</div>
                <div style={{ fontSize: "0.75rem", color: "#8a9aaa", marginTop: 2 }}>
                  {isEditing ? "Clique no mapa para ajustar a posição do seu estabelecimento" : "Posição geográfica do seu negócio"}
                </div>
              </div>
            </div>
            <div style={{ padding: "0 1.6rem 1.6rem" }}>
              <div className="emp-map-wrap">
                <ProfileMapNoSSR position={position} setPosition={setPosition} isEditing={isEditing} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}