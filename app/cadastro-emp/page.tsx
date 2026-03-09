"use client"

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import {
  Eye, EyeOff, Mail, Lock, Store, MapPin, Clock, Loader2,
  AlertTriangle, User, Info, Globe, Phone, AlignLeft,
  CheckCircle2, Sparkles, ArrowRight
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { Header } from "@/components/navigation/header"
import { AUTH_CSS } from "../../components/Auth"

const MapWithNoSSR = dynamic(() => import("./MapRegistrationComponent"), {
  ssr: false,
  loading: () => (
    <div style={{
      height: "100%", minHeight: 280, borderRadius: 16,
      background: "rgba(0,34,64,0.4)",
      border: "1.5px solid rgba(255,255,255,0.07)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 10, color: "rgba(255,255,255,0.3)", fontSize: "0.82rem"
    }}>
      <Loader2 size={22} style={{ animation: "cad-spin 1s linear infinite", color: "#00CCFF" }} />
      Carregando mapa...
    </div>
  )
})

const CATEGORIES = [
  { value: "restaurante", label: "🍽️ Restaurantes e Gastronomia" },
  { value: "comercio",    label: "🛍️ Loja e Varejo" },
  { value: "mercado",     label: "🛒 Mercados e Mercearias" },
  { value: "saude",       label: "💊 Farmácias e Saúde" },
  { value: "beleza",      label: "✂️ Estética e Barbearia" },
  { value: "servicos",    label: "🔧 Prestação de Serviços" },
  { value: "educacao",    label: "📚 Educação e Cursos" },
  { value: "construcao",  label: "🏗️ Construção e Reformas" },
  { value: "automotivo",  label: "🚗 Automotivo" },
  { value: "pet",         label: "🐾 Pet Shop e Veterinária" },
  { value: "tecnologia",  label: "💻 Tecnologia e Eletrônicos" },
  { value: "moda",        label: "👗 Moda e Acessórios" },
  { value: "lazer",       label: "🎉 Lazer e Entretenimento" },
  { value: "solidario",   label: "🤝 Empreendedorismo Solidário" },
  { value: "outro",       label: "📦 Outros Negócios" },
]

const DAYS = [
  { id: "monday",    label: "Seg" },
  { id: "tuesday",   label: "Ter" },
  { id: "wednesday", label: "Qua" },
  { id: "thursday",  label: "Qui" },
  { id: "friday",    label: "Sex" },
  { id: "saturday",  label: "Sáb" },
  { id: "sunday",    label: "Dom" },
]

const STEPS = [
  { id: 1, icon: Store,  label: "Negócio"  },
  { id: 2, icon: MapPin, label: "Endereço" },
  { id: 3, icon: Clock,  label: "Horários" },
  { id: 4, icon: User,   label: "Acesso"   },
]

const CAD_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

@keyframes cad-spin    { from{transform:rotate(0)} to{transform:rotate(360deg)} }
@keyframes cad-slide   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
@keyframes cad-orb     { 0%,100%{transform:translate(0,0)} 50%{transform:translate(28px,-18px)} }

.cad-page {
  font-family: 'DM Sans', sans-serif;
  --navy: #002240; --navy2: #001830; --gold: #F7B000; --cyan: #00CCFF;
  min-height: 100vh; background: var(--navy2); padding-bottom: 5rem;
}

/* HERO */
.cad-hero {
  background: var(--navy); border-bottom: 1px solid rgba(247,176,0,0.12);
  padding: 3rem 1.5rem 2.4rem; text-align: center;
  position: relative; overflow: hidden;
}
.cad-orb1 {
  position:absolute; width:400px; height:400px; border-radius:50%;
  background:radial-gradient(circle,rgba(247,176,0,0.13) 0%,transparent 70%);
  top:-140px; left:-100px; filter:blur(70px);
  animation: cad-orb 9s ease-in-out infinite;
}
.cad-orb2 {
  position:absolute; width:320px; height:320px; border-radius:50%;
  background:radial-gradient(circle,rgba(0,204,255,0.11) 0%,transparent 70%);
  bottom:-110px; right:-70px; filter:blur(70px);
  animation: cad-orb 11s ease-in-out infinite reverse;
}
.cad-badge {
  display:inline-flex; align-items:center; gap:6px;
  padding:5px 14px; border-radius:100px;
  background:rgba(247,176,0,0.1); border:1px solid rgba(247,176,0,0.22);
  font-size:0.7rem; font-weight:700; color:#F7B000;
  letter-spacing:0.08em; text-transform:uppercase;
  margin-bottom:1rem; position:relative; z-index:1;
}
.cad-h1 {
  font-family:'Syne',sans-serif; font-size:clamp(1.6rem,4vw,2.2rem);
  font-weight:800; color:#fff; margin-bottom:0.4rem; position:relative; z-index:1;
}
.cad-sub { font-size:0.88rem; color:rgba(255,255,255,0.45); position:relative; z-index:1; }

/* PROGRESS BAR */
.cad-progress { height:3px; background:rgba(255,255,255,0.06); }
.cad-progress-fill {
  height:100%; background:linear-gradient(90deg,var(--cyan),var(--gold));
  transition:width 0.45s ease;
}

/* STEPPER */
.cad-stepper {
  display:flex; align-items:center; justify-content:center;
  max-width:440px; margin:0 auto; padding:2rem 1.5rem 0; gap:0;
}
.cad-step { display:flex; flex-direction:column; align-items:center; gap:6px; flex:1; position:relative; }
.cad-step:not(:last-child)::after {
  content:''; position:absolute; top:17px; left:calc(50% + 19px);
  width:calc(100% - 38px); height:2px; background:rgba(255,255,255,0.08);
  transition:background 0.4s;
}
.cad-step.done:not(:last-child)::after { background:rgba(247,176,0,0.45); }
.cad-step-dot {
  width:34px; height:34px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  background:rgba(255,255,255,0.05); border:2px solid rgba(255,255,255,0.1);
  color:rgba(255,255,255,0.25); transition:all 0.3s;
}
.cad-step.active .cad-step-dot {
  background:var(--gold); border-color:var(--gold); color:var(--navy);
  box-shadow:0 0 0 5px rgba(247,176,0,0.15);
}
.cad-step.done .cad-step-dot {
  background:rgba(247,176,0,0.12); border-color:rgba(247,176,0,0.4); color:var(--gold);
}
.cad-step-lbl { font-size:0.66rem; font-weight:700; letter-spacing:0.04em; color:rgba(255,255,255,0.3); }
.cad-step.active .cad-step-lbl { color:var(--gold); }
.cad-step.done  .cad-step-lbl { color:rgba(247,176,0,0.65); }

/* CARD */
.cad-wrap { max-width:860px; margin:2rem auto 0; padding:0 1.5rem; }
.cad-panel {
  background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07);
  border-radius:24px; overflow:hidden; animation:cad-slide 0.3s ease;
}
.cad-panel-head {
  padding:1.5rem 2rem; border-bottom:1px solid rgba(255,255,255,0.06);
  background:rgba(0,0,0,0.12); display:flex; align-items:center; gap:14px;
}
.cad-panel-icon {
  width:44px; height:44px; border-radius:14px;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.cad-panel-title { font-family:'Syne',sans-serif; font-size:1.05rem; font-weight:800; color:#fff; }
.cad-panel-desc  { font-size:0.78rem; color:rgba(255,255,255,0.38); margin-top:2px; }
.cad-body { padding:1.8rem 2rem; }

/* FIELDS */
.cad-field { margin-bottom:1.1rem; }
.cad-field:last-child { margin-bottom:0; }
.cad-lbl {
  display:block; font-size:0.69rem; font-weight:700; text-transform:uppercase;
  letter-spacing:0.06em; color:rgba(255,255,255,0.38); margin-bottom:7px;
}
.cad-lbl em { color:var(--cyan); font-style:normal; margin-left:2px; }
.cad-wrap-inp { position:relative; }
.cad-ico { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,0.22); pointer-events:none; }
.cad-ico-ta { position:absolute; left:14px; top:13px; color:rgba(255,255,255,0.22); pointer-events:none; }

.cad-inp, .cad-sel, .cad-ta {
  width:100%; background:rgba(255,255,255,0.04);
  border:1.5px solid rgba(255,255,255,0.09); border-radius:13px;
  color:#fff; outline:none; font-family:'DM Sans',sans-serif; font-size:0.875rem;
  transition:border-color 0.2s,background 0.2s,box-shadow 0.2s;
}
.cad-inp { height:48px; padding:0 46px; }
.cad-inp.bare { padding:0 16px; }
.cad-inp.rpad { padding-right:46px; }
.cad-sel { height:48px; padding:0 16px; cursor:pointer; appearance:none; }
.cad-ta  { padding:12px 14px 12px 42px; resize:none; line-height:1.6; }
.cad-inp::placeholder,.cad-ta::placeholder { color:rgba(255,255,255,0.18); }
.cad-sel option { background:#001830; color:#fff; }
.cad-inp:focus,.cad-sel:focus,.cad-ta:focus {
  border-color:rgba(0,204,255,0.45); background:rgba(0,204,255,0.04);
  box-shadow:0 0 0 3px rgba(0,204,255,0.07);
}
.cad-eye {
  position:absolute; right:0; top:0; width:48px; height:48px;
  display:flex; align-items:center; justify-content:center;
  background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.22);
  transition:color 0.15s;
}
.cad-eye:hover { color:rgba(255,255,255,0.6); }

/* SELECT ARROW */
.cad-sel-wrap { position:relative; }
.cad-sel-wrap::after {
  content:''; pointer-events:none; position:absolute;
  right:14px; top:50%; transform:translateY(-50%);
  border:5px solid transparent; border-top-color:rgba(255,255,255,0.28); margin-top:3px;
}

/* GRIDS */
.cad-g2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
.cad-g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; }
@media(max-width:640px) { .cad-g2,.cad-g3 { grid-template-columns:1fr; } }

/* MAP */
.cad-map { height:280px; border-radius:16px; overflow:hidden; border:1.5px solid rgba(255,255,255,0.09); position:relative; z-index:0; }
.cad-map-note { font-size:0.71rem; color:rgba(255,255,255,0.28); display:flex; align-items:center; gap:5px; margin-top:8px; }
.cad-map-note.ok { color:rgba(34,197,94,0.85); }

/* HOURS */
.cad-days { display:grid; grid-template-columns:repeat(7,1fr); gap:8px; }
@media(max-width:640px) { .cad-days { grid-template-columns:repeat(4,1fr); } }
.cad-day {
  border-radius:14px; padding:10px 8px;
  border:1.5px solid rgba(255,255,255,0.07); background:rgba(255,255,255,0.025);
  display:flex; flex-direction:column; align-items:center; gap:8px;
  cursor:pointer; transition:all 0.2s;
}
.cad-day:hover { border-color:rgba(255,255,255,0.14); background:rgba(255,255,255,0.05); }
.cad-day.on {
  border-color:rgba(0,204,255,0.38); background:rgba(0,204,255,0.06);
  box-shadow:0 0 0 3px rgba(0,204,255,0.06);
}
.cad-day-lbl { font-size:0.66rem; font-weight:700; color:rgba(255,255,255,0.38); text-transform:uppercase; }
.cad-day.on .cad-day-lbl { color:var(--cyan); }
.cad-toggle {
  width:28px; height:15px; border-radius:100px; position:relative;
  background:rgba(255,255,255,0.1); border:none; cursor:pointer; transition:background 0.2s;
}
.cad-day.on .cad-toggle { background:var(--cyan); }
.cad-toggle::after {
  content:''; position:absolute; width:11px; height:11px; border-radius:50%;
  background:#fff; top:2px; left:2px; box-shadow:0 1px 3px rgba(0,0,0,0.25);
  transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
.cad-day.on .cad-toggle::after { transform:translateX(13px); }
.cad-time-col { display:flex; flex-direction:column; gap:4px; width:100%; }
.cad-time {
  width:100%; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.08);
  border-radius:8px; color:#fff; font-size:0.67rem; font-family:'DM Sans',sans-serif;
  padding:5px 6px; text-align:center; outline:none; transition:border-color 0.15s;
}
.cad-time:focus { border-color:rgba(0,204,255,0.4); }
.cad-time::-webkit-calendar-picker-indicator { filter:invert(0.35); }

/* TERMS */
.cad-terms {
  display:flex; align-items:flex-start; gap:10px;
  padding:1rem 1.2rem; border-radius:13px;
  background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
  font-size:0.82rem; color:rgba(255,255,255,0.5); line-height:1.55; margin-bottom:1.2rem;
}
.cad-terms a { color:var(--cyan); text-decoration:none; }
.cad-terms a:hover { text-decoration:underline; }

/* ERROR */
.cad-err {
  display:flex; align-items:center; gap:9px;
  padding:11px 15px; border-radius:13px;
  background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2);
  color:#fca5a5; font-size:0.82rem; margin-bottom:1.1rem;
}

/* ACTIONS */
.cad-actions { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; padding-top:0.2rem; }
.cad-btn-back {
  padding:12px 22px; border-radius:13px;
  background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.1);
  color:rgba(255,255,255,0.55); font-size:0.875rem; font-weight:600;
  font-family:'DM Sans',sans-serif; cursor:pointer; transition:background 0.2s,color 0.2s;
}
.cad-btn-back:hover { background:rgba(255,255,255,0.08); color:#fff; }
.cad-btn-next {
  display:inline-flex; align-items:center; gap:8px;
  padding:13px 28px; border-radius:13px; background:var(--cyan); color:var(--navy);
  border:none; font-family:'Syne',sans-serif; font-size:0.88rem; font-weight:800;
  cursor:pointer; box-shadow:0 6px 22px rgba(0,204,255,0.25);
  transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s;
}
.cad-btn-next:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(0,204,255,0.38); }
.cad-btn-sub {
  display:inline-flex; align-items:center; gap:8px;
  padding:13px 32px; border-radius:13px;
  background:linear-gradient(135deg,var(--gold),#e8a200); color:var(--navy);
  border:none; font-family:'Syne',sans-serif; font-size:0.88rem; font-weight:800;
  cursor:pointer; box-shadow:0 6px 22px rgba(247,176,0,0.25);
  transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s;
}
.cad-btn-sub:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(247,176,0,0.38); }
.cad-btn-sub:disabled,.cad-btn-next:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

/* FOOTER */
.cad-foot { text-align:center; margin-top:1.6rem; font-size:0.79rem; color:rgba(255,255,255,0.28); }
.cad-foot a { color:var(--cyan); text-decoration:none; }
.cad-foot a:hover { text-decoration:underline; }
`

export default function EmpresarioCadastroPage() {
  const router = useRouter()
  const [step, setStep]       = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError]     = useState("")
  const [isMounted, setIsMounted] = useState(false)

  const [formData, setFormData] = useState({
    ownerName: "", email: "", businessName: "", category: "",
    businessPhone: "", whatsapp: "", website: "", description: "",
    street: "", number: "", block: "", reference: "",
    password: "", confirmPassword: "", terms: false,
  })

  const [openingHours, setOpeningHours] = useState(
    DAYS.map(d => ({ day: d.label, opens: "08:00", closes: "18:00", isOpen: false }))
  )

  useEffect(() => {
    setIsMounted(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        p => setPosition({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => {}, { enableHighAccuracy: true }
      )
    }
  }, [])

  const set = (k: string, v: any) => setFormData(p => ({ ...p, [k]: v }))
  const updHour = (i: number, f: string, v: any) => {
    const h = [...openingHours]; h[i] = { ...h[i], [f]: v }; setOpeningHours(h)
  }

  const validate = (): boolean => {
    setError("")
    if (step === 1) {
      if (!formData.businessName || !formData.category || !formData.description || !formData.whatsapp)
        return setError("Preencha todos os campos obrigatórios.") as any || false
    }
    if (step === 2) {
      if (!formData.street || !formData.number || !formData.reference)
        return setError("Preencha o endereço completo.") as any || false
      if (!position)
        return setError("Marque a localização do negócio no mapa.") as any || false
    }
    if (step === 4) {
      if (!formData.ownerName || !formData.email || !formData.password || !formData.confirmPassword)
        return setError("Preencha todos os campos.") as any || false
      if (formData.password !== formData.confirmPassword)
        return setError("As senhas não coincidem.") as any || false
      if (formData.password.length < 6)
        return setError("A senha precisa ter no mínimo 6 caracteres.") as any || false
      if (!formData.terms)
        return setError("Aceite os Termos de Uso para continuar.") as any || false
    }
    return true
  }

  const next = () => { if (!validate()) return; setStep(s => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }) }
  const back = () => { setError(""); setStep(s => s - 1) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const addr = `${formData.street}, Nº ${formData.number}${formData.block ? `, Qd ${formData.block}` : ""}. Ref: ${formData.reference}`
      await setDoc(doc(db, "businesses", cred.user.uid), {
        ...formData,
        address: addr,
        openingHours: openingHours.filter(h => h.isOpen),
        location: { latitude: position?.lat, longitude: position?.lng },
        role: "business", status: "pending", isPublic: true,
        createdAt: new Date(),
      })
      router.push("/empresario/dashboard")
    } catch (err: any) {
      setError(err.code === "auth/email-already-in-use" ? "Este e-mail já está em uso." : err.message)
    } finally { setLoading(false) }
  }

  return (
    <>
      {isMounted && <style dangerouslySetInnerHTML={{ __html: AUTH_CSS + CAD_CSS }} />}

      <div className="cad-page">
        <Header />

        {/* HERO */}
        <div className="cad-hero">
          <div className="cad-orb1" /><div className="cad-orb2" />
          <div className="cad-badge"><Sparkles size={11} />Empresário Parceiro</div>
          <h1 className="cad-h1">Cadastrar Meu Negócio</h1>
          <p className="cad-sub">Divulgue seu estabelecimento para toda a cidade</p>
        </div>

        {/* PROGRESS */}
        <div className="cad-progress">
          <div className="cad-progress-fill" style={{ width: `${((step - 1) / 3) * 100}%` }} />
        </div>

        {/* STEPPER */}
        <div className="cad-stepper">
          {STEPS.map(s => {
            const Icon = s.icon
            return (
              <div key={s.id} className={`cad-step ${step === s.id ? "active" : step > s.id ? "done" : ""}`}>
                <div className="cad-step-dot">
                  {step > s.id ? <CheckCircle2 size={15} /> : <Icon size={15} />}
                </div>
                <span className="cad-step-lbl">{s.label}</span>
              </div>
            )
          })}
        </div>

        {/* PANELS */}
        <div className="cad-wrap">

          {/* ── STEP 1: NEGÓCIO ── */}
          {step === 1 && (
            <div className="cad-panel">
              <div className="cad-panel-head">
                <div className="cad-panel-icon" style={{ background: "rgba(247,176,0,0.12)" }}>
                  <Store size={21} color="#F7B000" />
                </div>
                <div>
                  <div className="cad-panel-title">Informações do Negócio</div>
                  <div className="cad-panel-desc">Conte-nos sobre o seu estabelecimento</div>
                </div>
              </div>
              <div className="cad-body">
                <div className="cad-field">
                  <label className="cad-lbl">Nome do Estabelecimento <em>*</em></label>
                  <div className="cad-wrap-inp">
                    <Store size={15} className="cad-ico" />
                    <input className="cad-inp" placeholder="Ex: Panificadora Central"
                      value={formData.businessName} onChange={e => set("businessName", e.target.value)} />
                  </div>
                </div>

                <div className="cad-g2">
                  <div className="cad-field">
                    <label className="cad-lbl">Categoria <em>*</em></label>
                    <div className="cad-sel-wrap">
                      <select className="cad-sel" value={formData.category} onChange={e => set("category", e.target.value)}>
                        <option value="">Selecione...</option>
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="cad-field">
                    <label className="cad-lbl">WhatsApp <em>*</em></label>
                    <div className="cad-wrap-inp">
                      <Phone size={15} className="cad-ico" />
                      <input className="cad-inp" placeholder="(99) 99999-9999"
                        value={formData.whatsapp} onChange={e => set("whatsapp", e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="cad-field">
                  <label className="cad-lbl">Descrição <em>*</em></label>
                  <div className="cad-wrap-inp">
                    <AlignLeft size={15} className="cad-ico-ta" />
                    <textarea className="cad-ta" rows={3}
                      placeholder="Descreva brevemente o que seu negócio oferece..."
                      value={formData.description} onChange={e => set("description", e.target.value)} />
                  </div>
                </div>

                <div className="cad-g2">
                  <div className="cad-field">
                    <label className="cad-lbl">Telefone</label>
                    <div className="cad-wrap-inp">
                      <Phone size={15} className="cad-ico" />
                      <input className="cad-inp" placeholder="(99) 9999-9999"
                        value={formData.businessPhone} onChange={e => set("businessPhone", e.target.value)} />
                    </div>
                  </div>
                  <div className="cad-field">
                    <label className="cad-lbl">Site ou Rede Social</label>
                    <div className="cad-wrap-inp">
                      <Globe size={15} className="cad-ico" />
                      <input className="cad-inp" placeholder="https://..."
                        value={formData.website} onChange={e => set("website", e.target.value)} />
                    </div>
                  </div>
                </div>

                {error && <div className="cad-err"><AlertTriangle size={14} />{error}</div>}
                <div className="cad-actions" style={{ justifyContent: "flex-end" }}>
                  <button type="button" className="cad-btn-next" onClick={next}>
                    Próximo <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: ENDEREÇO ── */}
          {step === 2 && (
            <div className="cad-panel">
              <div className="cad-panel-head">
                <div className="cad-panel-icon" style={{ background: "rgba(0,204,255,0.12)" }}>
                  <MapPin size={21} color="#00CCFF" />
                </div>
                <div>
                  <div className="cad-panel-title">Endereço e Localização</div>
                  <div className="cad-panel-desc">Informe onde seu negócio está localizado</div>
                </div>
              </div>
              <div className="cad-body">
                <div className="cad-g2">
                  <div>
                    <div className="cad-field">
                      <label className="cad-lbl">Rua / Logradouro <em>*</em></label>
                      <div className="cad-wrap-inp">
                        <MapPin size={15} className="cad-ico" />
                        <input className="cad-inp" placeholder="Nome da rua ou avenida"
                          value={formData.street} onChange={e => set("street", e.target.value)} />
                      </div>
                    </div>
                    <div className="cad-g2">
                      <div className="cad-field">
                        <label className="cad-lbl">Número <em>*</em></label>
                        <input className="cad-inp bare" placeholder="123"
                          value={formData.number} onChange={e => set("number", e.target.value)} />
                      </div>
                      <div className="cad-field">
                        <label className="cad-lbl">Quadra</label>
                        <input className="cad-inp bare" placeholder="Ex: 04"
                          value={formData.block} onChange={e => set("block", e.target.value)} />
                      </div>
                    </div>
                    <div className="cad-field">
                      <label className="cad-lbl">Ponto de Referência <em>*</em></label>
                      <div className="cad-wrap-inp">
                        <Info size={15} className="cad-ico" />
                        <input className="cad-inp" placeholder="Ex: Ao lado do mercado"
                          value={formData.reference} onChange={e => set("reference", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="cad-field">
                    <label className="cad-lbl">Localização no Mapa <em>*</em></label>
                    <div className="cad-map">
                      <MapWithNoSSR position={position} setPosition={setPosition} />
                    </div>
                    <div className={`cad-map-note ${position ? "ok" : ""}`}>
                      {position
                        ? <><CheckCircle2 size={11} /> Localização marcada com sucesso</>
                        : <><MapPin size={11} /> Clique no mapa para marcar o local</>}
                    </div>
                  </div>
                </div>

                {error && <div className="cad-err"><AlertTriangle size={14} />{error}</div>}
                <div className="cad-actions">
                  <button type="button" className="cad-btn-back" onClick={back}>← Voltar</button>
                  <button type="button" className="cad-btn-next" onClick={next}>
                    Próximo <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: HORÁRIOS ── */}
          {step === 3 && (
            <div className="cad-panel">
              <div className="cad-panel-head">
                <div className="cad-panel-icon" style={{ background: "rgba(247,176,0,0.12)" }}>
                  <Clock size={21} color="#F7B000" />
                </div>
                <div>
                  <div className="cad-panel-title">Horário de Funcionamento</div>
                  <div className="cad-panel-desc">Ative os dias e configure os horários</div>
                </div>
              </div>
              <div className="cad-body">
                <div className="cad-days">
                  {openingHours.map((h, i) => (
                    <div key={h.day} className={`cad-day ${h.isOpen ? "on" : ""}`}
                      onClick={() => updHour(i, "isOpen", !h.isOpen)}>
                      <span className="cad-day-lbl">{DAYS[i].label}</span>
                      <button type="button" className="cad-toggle"
                        onClick={e => { e.stopPropagation(); updHour(i, "isOpen", !h.isOpen) }} />
                      {h.isOpen && (
                        <div className="cad-time-col" onClick={e => e.stopPropagation()}>
                          <input type="time" className="cad-time" value={h.opens}
                            onChange={e => updHour(i, "opens", e.target.value)} />
                          <input type="time" className="cad-time" value={h.closes}
                            onChange={e => updHour(i, "closes", e.target.value)} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.22)", marginTop: "1.2rem" }}>
                  Clique no dia para ativar. Os horários podem ser editados depois no painel.
                </p>
                <div className="cad-actions" style={{ marginTop: "1.5rem" }}>
                  <button type="button" className="cad-btn-back" onClick={back}>← Voltar</button>
                  <button type="button" className="cad-btn-next" onClick={next}>
                    Próximo <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: ACESSO ── */}
          {step === 4 && (
            <div className="cad-panel">
              <div className="cad-panel-head">
                <div className="cad-panel-icon" style={{ background: "rgba(0,204,255,0.12)" }}>
                  <User size={21} color="#00CCFF" />
                </div>
                <div>
                  <div className="cad-panel-title">Dados de Acesso</div>
                  <div className="cad-panel-desc">Crie a sua conta de empresário</div>
                </div>
              </div>
              <div className="cad-body">
                <form onSubmit={handleSubmit}>
                  <div className="cad-g2">
                    <div className="cad-field">
                      <label className="cad-lbl">Nome do Proprietário <em>*</em></label>
                      <div className="cad-wrap-inp">
                        <User size={15} className="cad-ico" />
                        <input className="cad-inp" placeholder="Seu nome completo"
                          value={formData.ownerName} onChange={e => set("ownerName", e.target.value)} />
                      </div>
                    </div>
                    <div className="cad-field">
                      <label className="cad-lbl">E-mail <em>*</em></label>
                      <div className="cad-wrap-inp">
                        <Mail size={15} className="cad-ico" />
                        <input className="cad-inp" type="email" placeholder="email@exemplo.com"
                          value={formData.email} onChange={e => set("email", e.target.value)} />
                      </div>
                    </div>
                    <div className="cad-field">
                      <label className="cad-lbl">Senha <em>*</em></label>
                      <div className="cad-wrap-inp">
                        <Lock size={15} className="cad-ico" />
                        <input className="cad-inp rpad" type={showPass ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          value={formData.password} onChange={e => set("password", e.target.value)} />
                        <button type="button" className="cad-eye" onClick={() => setShowPass(p => !p)}>
                          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="cad-field">
                      <label className="cad-lbl">Confirmar Senha <em>*</em></label>
                      <div className="cad-wrap-inp">
                        <Lock size={15} className="cad-ico" />
                        <input className="cad-inp rpad" type={showConf ? "text" : "password"}
                          placeholder="Repita a senha"
                          value={formData.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} />
                        <button type="button" className="cad-eye" onClick={() => setShowConf(p => !p)}>
                          {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="cad-terms" style={{ marginTop: "1.2rem" }}>
                    <Checkbox
                      className="border-[rgba(255,255,255,0.18)] data-[state=checked]:bg-[#00CCFF] data-[state=checked]:border-[#00CCFF] mt-0.5 flex-shrink-0"
                      checked={formData.terms}
                      onCheckedChange={v => set("terms", !!v)}
                    />
                    <span>
                      Concordo com os{" "}
                      <Link href="/termos-de-uso" target="_blank">Termos de Uso</Link>
                      {" "}e a{" "}
                      <Link href="/politica-de-privacidade" target="_blank">Política de Privacidade</Link>
                      {" "}do Novo Tempo Conecta.
                    </span>
                  </div>

                  {error && <div className="cad-err"><AlertTriangle size={14} />{error}</div>}

                  <div className="cad-actions">
                    <button type="button" className="cad-btn-back" onClick={back}>← Voltar</button>
                    <button type="submit" className="cad-btn-sub" disabled={loading}>
                      {loading
                        ? <Loader2 size={17} style={{ animation: "cad-spin 1s linear infinite" }} />
                        : <Store size={17} />}
                      {loading ? "Cadastrando..." : "Cadastrar Meu Negócio"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="cad-foot">
            Já tem conta? <Link href="/login">Faça login</Link>
            {" · "}
            Não é empresário? <Link href="/cadastro">Cadastro de Cidadão</Link>
          </div>
        </div>
      </div>
    </>
  )
}