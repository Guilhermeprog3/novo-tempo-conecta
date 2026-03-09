"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Edit, MessageSquare, MapPin, Phone, Clock, Globe,
  Loader2, Building, Tag, AlignLeft, MessageCircle,
  Activity, CheckCircle2, XCircle
} from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

const DASH_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.emp-dash {
  font-family: 'DM Sans', sans-serif;
  --navy: #002240; --navy2: #001830; --gold: #F7B000; --cyan: #00CCFF;
  display: flex; flex-direction: column; gap: 1.5rem;
}

/* HERO */
.emp-hero {
  background: var(--navy); border-radius: 20px;
  padding: 2rem 2.5rem; position: relative; overflow: hidden;
}
.emp-hero-orb1 { position:absolute;border-radius:50%;width:320px;height:320px;background:var(--cyan);opacity:0.07;filter:blur(80px);top:-120px;right:-80px;pointer-events:none; }
.emp-hero-orb2 { position:absolute;border-radius:50%;width:220px;height:220px;background:var(--gold);opacity:0.07;filter:blur(70px);bottom:-90px;left:20px;pointer-events:none; }
.emp-hero-inner { position: relative; z-index: 1; display:flex;align-items:flex-start;justify-content:space-between;gap:1.5rem;flex-wrap:wrap; }
.emp-hero-eyebrow { font-size:0.67rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(0,204,255,0.6);margin-bottom:6px; }
.emp-hero-title { font-family:'Syne',sans-serif;font-weight:800;font-size:1.75rem;color:#fff;margin-bottom:4px;line-height:1.15; }
.emp-hero-sub { font-size:0.85rem;color:rgba(255,255,255,0.45);font-weight:300; }
.emp-hero-actions { display:flex;align-items:center;gap:10px;flex-wrap:wrap;flex-shrink:0; }

/* BUTTONS */
.emp-btn {
  display:inline-flex;align-items:center;gap:7px;
  padding:10px 20px;border-radius:12px;
  font-size:0.85rem;font-weight:700;cursor:pointer;border:none;
  font-family:'DM Sans',sans-serif;
  transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s,background 0.15s;
  text-decoration: none;
}
.emp-btn-primary { background:var(--gold);color:var(--navy);box-shadow:0 4px 18px rgba(247,176,0,0.25); }
.emp-btn-primary:hover { transform:translateY(-2px);box-shadow:0 8px 26px rgba(247,176,0,0.38); }
.emp-btn-outline { background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.7);border:1.5px solid rgba(255,255,255,0.14); }
.emp-btn-outline:hover { background:rgba(255,255,255,0.12);color:#fff; }

/* QUICK ACTIONS */
.emp-actions-grid { display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem; }
.emp-action-card {
  background:#fff;border-radius:16px;padding:1.4rem;
  border:1.5px solid #f0ece5;
  display:flex;align-items:center;gap:14px;
  text-decoration:none;color:inherit;
  box-shadow:0 2px 12px rgba(0,34,64,0.06);
  transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s;
}
.emp-action-card:hover { transform:translateY(-4px);box-shadow:0 12px 34px rgba(0,34,64,0.11); }
.emp-action-icon {
  width:46px;height:46px;border-radius:14px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
}
.emp-action-title { font-family:'Syne',sans-serif;font-size:0.9rem;font-weight:700;color:#002240;margin-bottom:2px; }
.emp-action-sub { font-size:0.75rem;color:#8a9aaa; }

/* CARDS */
.emp-card { background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 2px 14px rgba(0,34,64,0.07);border:1px solid #f0ece5; }
.emp-card-header { padding:1.2rem 1.6rem;border-bottom:1px solid #f0ece5;display:flex;align-items:center;justify-content:space-between; }
.emp-card-title { font-family:'Syne',sans-serif;font-size:0.95rem;font-weight:700;color:#002240;display:flex;align-items:center;gap:8px; }
.emp-card-title-dot { width:8px;height:8px;border-radius:50%; }
.emp-card-body { padding:1.6rem; }

/* INFO GRID */
.emp-info-grid { display:grid;grid-template-columns:1fr 1fr;gap:1.4rem 2.5rem; }
.emp-info-item { display:flex;align-items:flex-start;gap:12px; }
.emp-info-item.full { grid-column:1/-1; }
.emp-info-icon {
  width:38px;height:38px;border-radius:11px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;margin-top:1px;
}
.emp-info-label { font-size:0.7rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8a9aaa;margin-bottom:3px; }
.emp-info-value { font-size:0.88rem;font-weight:500;color:#1a2a3a;line-height:1.5; }
.emp-info-empty { color:#b0bec5;font-style:italic; }

/* HOURS TABLE */
.emp-hours-grid { display:grid;grid-template-columns:repeat(7,1fr);gap:8px; }
.emp-hour-card {
  border-radius:12px;padding:10px 8px;text-align:center;
  border:1.5px solid #f0ece5;background:#faf8f5;
  transition:transform 0.2s;
}
.emp-hour-card.open {
  background: rgba(0,204,255,0.04);
  border-color: rgba(0,204,255,0.25);
}
.emp-hour-card.closed {
  background: #faf8f5;
  opacity: 0.65;
}
.emp-hour-day { font-size:0.65rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;margin-bottom:6px; }
.emp-hour-day.open { color:#002240; }
.emp-hour-day.closed { color:#b0bec5; }
.emp-hour-status { display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;margin:0 auto 7px; }
.emp-hour-time { font-size:0.67rem;font-weight:600;color:#3a4a5a;line-height:1.6; }
.emp-hour-closed-txt { font-size:0.65rem;color:#b0bec5;font-weight:500; }

@keyframes emp-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

@media(max-width:700px) {
  .emp-info-grid { grid-template-columns:1fr; }
  .emp-info-item.full { grid-column:1; }
  .emp-hours-grid { grid-template-columns:repeat(4,1fr); }
  .emp-actions-grid { grid-template-columns:1fr; }
}
@media(max-width:480px) {
  .emp-hours-grid { grid-template-columns:repeat(3,1fr); }
}
`

type OpeningHour = { day: string; opens: string; closes: string; isOpen: boolean }
type BusinessData = {
  businessName: string; category: string; description: string;
  businessPhone: string; whatsapp: string; website: string;
  address: string; openingHours?: OpeningHour[];
}

const ALL_DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
const SHORT_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

function InfoItem({ icon, label, value, full = false, iconBg = "rgba(0,204,255,0.08)", iconColor = "#00CCFF" }: {
  icon: React.ReactNode; label: string; value?: React.ReactNode; full?: boolean;
  iconBg?: string; iconColor?: string;
}) {
  return (
    <div className={`emp-info-item${full ? " full" : ""}`}>
      <div className="emp-info-icon" style={{ background: iconBg }}>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="emp-info-label">{label}</div>
        <div className="emp-info-value">
          {value || <span className="emp-info-empty">Não informado</span>}
        </div>
      </div>
    </div>
  )
}

function HoursDisplay({ openingHours }: { openingHours?: OpeningHour[] }) {
  // Build a map from day label to data
  const hoursMap: Record<string, OpeningHour> = {}
  openingHours?.forEach(h => { hoursMap[h.day] = h })

  const openCount = openingHours?.length || 0

  return (
    <div>
      {/* Summary */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: openCount > 0 ? "rgba(34,197,94,0.1)" : "rgba(176,190,197,0.15)", color: openCount > 0 ? "#16a34a" : "#8a9aaa", border: `1px solid ${openCount > 0 ? "rgba(34,197,94,0.2)" : "rgba(176,190,197,0.2)"}`, borderRadius: 100, padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700 }}>
          <Clock size={11} />
          {openCount > 0 ? `${openCount} dia${openCount !== 1 ? "s" : ""} com funcionamento` : "Horários não configurados"}
        </span>
      </div>

      {/* Day chips */}
      <div className="emp-hours-grid">
        {ALL_DAYS.map((day, i) => {
          // Try to find the matching hour entry (partial match to handle "Segunda-feira" vs "Segunda")
          const h = Object.values(hoursMap).find(x => x.day?.toLowerCase().startsWith(SHORT_DAYS[i].toLowerCase()) || SHORT_DAYS[i].toLowerCase().startsWith(x.day?.toLowerCase().slice(0, 3)))
          const isOpen = !!h

          return (
            <div key={day} className={`emp-hour-card ${isOpen ? "open" : "closed"}`}>
              <div className={`emp-hour-day ${isOpen ? "open" : "closed"}`}>{SHORT_DAYS[i]}</div>
              <div className="emp-hour-status" style={{ background: isOpen ? "rgba(34,197,94,0.12)" : "rgba(176,190,197,0.1)" }}>
                {isOpen
                  ? <CheckCircle2 size={13} color="#22c55e" />
                  : <XCircle size={13} color="#d0dce5" />
                }
              </div>
              {isOpen && h ? (
                <div className="emp-hour-time">
                  {h.opens}<br />{h.closes}
                </div>
              ) : (
                <div className="emp-hour-closed-txt">Fechado</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function EmpresarioDashboardPage() {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "businesses", user.uid))
        if (snap.exists()) setBusinessData(snap.data() as BusinessData)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  if (loading) return (
    <>
      <style>{DASH_CSS}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 12, color: "#8a9aaa", fontSize: "0.88rem", fontFamily: "'DM Sans',sans-serif" }}>
        <Loader2 size={26} color="#00CCFF" style={{ animation: "emp-spin 1s linear infinite" }} />
        Carregando seu painel...
      </div>
    </>
  )

  return (
    <>
      <style>{DASH_CSS}</style>
      <div className="emp-dash">

        {/* ── HERO ── */}
        <div className="emp-hero">
          <div className="emp-hero-orb1" /><div className="emp-hero-orb2" />
          <div className="emp-hero-inner">
            <div>
              <div className="emp-hero-eyebrow">Painel do Empresário</div>
              <div className="emp-hero-title">{businessData?.businessName || "Meu Negócio"}</div>
              <div className="emp-hero-sub">
                {businessData?.category ? `Categoria: ${businessData.category}` : "Gerencie seu estabelecimento abaixo"}
              </div>
            </div>
            <div className="emp-hero-actions">
              <Link href="/empresario/perfil" className="emp-btn emp-btn-primary">
                <Edit size={15} /> Editar Perfil
              </Link>
              <Link href="/empresario/avaliacoes" className="emp-btn emp-btn-outline">
                <MessageSquare size={15} /> Avaliações
              </Link>
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="emp-actions-grid">
          <Link href="/empresario/perfil" className="emp-action-card">
            <div className="emp-action-icon" style={{ background: "rgba(247,176,0,0.1)" }}>
              <Edit size={20} color="#F7B000" />
            </div>
            <div>
              <div className="emp-action-title">Editar Informações</div>
              <div className="emp-action-sub">Atualize dados do negócio</div>
            </div>
          </Link>
          <Link href="/empresario/avaliacoes" className="emp-action-card">
            <div className="emp-action-icon" style={{ background: "rgba(0,204,255,0.1)" }}>
              <MessageSquare size={20} color="#00CCFF" />
            </div>
            <div>
              <div className="emp-action-title">Responder Avaliações</div>
              <div className="emp-action-sub">Interaja com seus clientes</div>
            </div>
          </Link>
        </div>

        {/* ── INFORMAÇÕES BÁSICAS ── */}
        <div className="emp-card">
          <div className="emp-card-header">
            <div className="emp-card-title">
              <div className="emp-card-title-dot" style={{ background: "#00CCFF" }} />
              Informações Básicas
            </div>
          </div>
          <div className="emp-card-body">
            <div className="emp-info-grid">
              <InfoItem icon={<Building size={17} />} label="Nome" value={businessData?.businessName} iconBg="rgba(0,204,255,0.08)" iconColor="#00CCFF" />
              <InfoItem icon={<Tag size={17} />} label="Categoria" value={businessData?.category} iconBg="rgba(247,176,0,0.1)" iconColor="#F7B000" />
              <InfoItem icon={<AlignLeft size={17} />} label="Descrição" value={businessData?.description} iconBg="rgba(139,92,246,0.08)" iconColor="#8B5CF6" full />
            </div>
          </div>
        </div>

        {/* ── CONTATO ── */}
        <div className="emp-card">
          <div className="emp-card-header">
            <div className="emp-card-title">
              <div className="emp-card-title-dot" style={{ background: "#F7B000" }} />
              Informações de Contato
            </div>
          </div>
          <div className="emp-card-body">
            <div className="emp-info-grid">
              <InfoItem icon={<Phone size={17} />} label="Telefone" value={businessData?.businessPhone} iconBg="rgba(34,197,94,0.08)" iconColor="#22c55e" />
              <InfoItem icon={<MessageCircle size={17} />} label="WhatsApp" value={businessData?.whatsapp} iconBg="rgba(34,197,94,0.08)" iconColor="#22c55e" />
              <InfoItem icon={<Globe size={17} />} label="Instagram / Site" value={
                businessData?.website ? (
                  <a href={businessData.website.startsWith('http') ? businessData.website : `https://${businessData.website}`} target="_blank" rel="noreferrer"
                    style={{ color: "#00CCFF", textDecoration: "none", wordBreak: "break-all" }}>
                    {businessData.website}
                  </a>
                ) : undefined
              } iconBg="rgba(0,204,255,0.08)" iconColor="#00CCFF" />
            </div>
          </div>
        </div>

        {/* ── LOCALIZAÇÃO E HORÁRIOS ── */}
        <div className="emp-card">
          <div className="emp-card-header">
            <div className="emp-card-title">
              <div className="emp-card-title-dot" style={{ background: "#E91E8C" }} />
              Localização e Horários
            </div>
          </div>
          <div className="emp-card-body" style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
            {/* Endereço */}
            <InfoItem icon={<MapPin size={17} />} label="Endereço" value={businessData?.address} iconBg="rgba(233,30,140,0.08)" iconColor="#E91E8C" />

            {/* Divider */}
            <div style={{ height: 1, background: "#f0ece5" }} />

            {/* Horários */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.1rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,204,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={17} color="#00CCFF" />
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8a9aaa", marginBottom: 1 }}>Horário de Funcionamento</div>
                  <div style={{ fontSize: "0.8rem", color: "#5a6878" }}>Dias e horários de atendimento</div>
                </div>
              </div>
              <HoursDisplay openingHours={businessData?.openingHours} />
            </div>
          </div>
        </div>

      </div>
    </>
  )
}