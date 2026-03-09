"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Store, MapPin, Clock, Loader2, AlertTriangle, Info, ArrowLeft, Save, Globe, Phone, User, AlignLeft, Hash, Layers } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ADMIN_CSS } from "../../dashboard/page"

const MapWithNoSSR = dynamic(() => import("../../../cadastro-emp/MapRegistrationComponent"), {
  ssr: false,
  loading: () => <div style={{ height: 280, borderRadius: 12, background: "#f8f6f2", border: "1.5px solid #ede9e0", display: "flex", alignItems: "center", justifyContent: "center", color: "#b0bec5", fontSize: "0.85rem" }}>Carregando mapa...</div>
})

const CATEGORIES = [
  { value: "restaurante", label: "Restaurantes e Gastronomia" },
  { value: "comercio", label: "Loja e Varejo" },
  { value: "mercado", label: "Mercados e Mercearias" },
  { value: "saude", label: "Farmácias e Saúde" },
  { value: "beleza", label: "Estética e Barbearia" },
  { value: "servicos", label: "Prestação de Serviços" },
  { value: "educacao", label: "Educação e Cursos" },
  { value: "construcao", label: "Construção e Reformas" },
  { value: "automotivo", label: "Automotivo (Oficinas e Peças)" },
  { value: "pet", label: "Pet Shop e Veterinária" },
  { value: "tecnologia", label: "Tecnologia e Eletrônicos" },
  { value: "moda", label: "Moda e Acessórios" },
  { value: "lazer", label: "Lazer e Entretenimento" },
  { value: "solidario", label: "🤝 Empreendedorismo Solidário" },
  { value: "outro", label: "Outros Negócios" },
]

const DAYS = [
  { id: 'monday', label: 'Segunda' }, { id: 'tuesday', label: 'Terça' },
  { id: 'wednesday', label: 'Quarta' }, { id: 'thursday', label: 'Quinta' },
  { id: 'friday', label: 'Sexta' }, { id: 'saturday', label: 'Sábado' }, { id: 'sunday', label: 'Domingo' },
]

const NOVO_CSS = `
.nv-section-head{display:flex;align-items:center;gap:8px;margin-bottom:1rem;}
.nv-section-label{font-family:'Syne',sans-serif;font-size:0.88rem;font-weight:700;color:#002240;}
.nv-label{display:block;font-size:0.78rem;font-weight:600;color:#5a6878;margin-bottom:5px;letter-spacing:0.02em;}
.nv-input{width:100%;height:42px;padding:0 12px;background:#f8f6f2;border:1.5px solid #ede9e0;border-radius:11px;font-size:0.875rem;font-family:'DM Sans',sans-serif;color:#1a2a3a;outline:none;transition:border-color 0.2s,background 0.2s;}
.nv-input::placeholder{color:#b0bec5;}
.nv-input:focus{border-color:#00CCFF;background:#fff;}
.nv-textarea{width:100%;padding:12px;background:#f8f6f2;border:1.5px solid #ede9e0;border-radius:11px;font-size:0.875rem;font-family:'DM Sans',sans-serif;color:#1a2a3a;outline:none;resize:none;min-height:70px;transition:all 0.2s;}
.nv-textarea:focus{border-color:#00CCFF;background:#fff;}
.nv-select{width:100%;height:42px;padding:0 12px;background:#f8f6f2;border:1.5px solid #ede9e0;border-radius:11px;font-size:0.875rem;font-family:'DM Sans',sans-serif;color:#1a2a3a;outline:none;cursor:pointer;}
.nv-day-card{background:#fff;border:1.5px solid #f0ece5;border-radius:12px;padding:12px;transition:border-color 0.2s;}
.nv-day-card.active{border-color:rgba(0,204,255,0.4);background:rgba(0,204,255,0.03);}
.nv-time-input{height:34px;padding:0 8px;background:#f8f6f2;border:1.5px solid #ede9e0;border-radius:8px;font-size:0.78rem;font-family:'DM Sans',sans-serif;color:#1a2a3a;outline:none;flex:1;}
.nv-time-input:focus{border-color:#00CCFF;}
.nv-error{background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:1rem 1.2rem;display:flex;align-items:center;gap:10px;color:#dc2626;font-size:0.875rem;}
`

export default function AdminNovoCadastroEmpresa() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ 
    ownerName: '', email: '', businessName: '', category: '', 
    businessPhone: '', whatsapp: '', website: '', description: '',
    street: '', number: '', block: '', reference: ''
  })
  
  const [openingHours, setOpeningHours] = useState(
    DAYS.map(d => ({ day: d.label, opens: '08:00', closes: '18:00', isOpen: false }))
  )

  const updateHours = (i: number, field: string, value: any) => {
    const h = [...openingHours]; 
    h[i] = { ...h[i], [field]: value }; 
    setOpeningHours(h)
  }

  const set = (k: string, v: string) => setFormData(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(null)
    if (!position) return setError("Por favor, marque a localização no mapa.")
    
    setLoading(true)
    try {
      const fullAddress = `${formData.street}, Nº ${formData.number}${formData.block ? `, Qd ${formData.block}` : ''}. Ref: ${formData.reference}`;

      await addDoc(collection(db, "businesses"), { 
        ...formData, 
        address: fullAddress, // Salva o endereço concatenado para compatibilidade
        openingHours: openingHours.filter(h => h.isOpen), 
        location: { latitude: position.lat, longitude: position.lng }, 
        role: 'business', 
        status: 'approved',
        createdAt: serverTimestamp() 
      })
      router.push('/admin/empresas')
    } catch (err: any) { 
      setError("Erro ao salvar: " + err.message) 
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <>
      <style>{ADMIN_CSS}{NOVO_CSS}</style>
      <div className="adm" style={{ paddingBottom: 40 }}>
        <div className="adm-hero">
          <div className="adm-hero-orb1" /><div className="adm-hero-orb2" />
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div className="adm-hero-eyebrow">Gestão de Empresas</div>
              <div className="adm-hero-title">Novo Cadastro</div>
              <div className="adm-hero-sub">Adicione manualmente um novo estabelecimento parceiro.</div>
            </div>
            <button className="adm-btn adm-btn-ghost" onClick={() => router.back()} style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <ArrowLeft size={15} /> Voltar
            </button>
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-header">
            <div><div className="adm-card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}><Store size={16} color="#00CCFF" /> Formulário da Empresa</div></div>
          </div>
          <div className="adm-card-body">
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", marginBottom: "2rem" }}>
                
                {/* COLUNA 1: DADOS DO NEGÓCIO */}
                <div>
                  <div className="nv-section-head">
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,204,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Info size={14} color="#00CCFF" /></div>
                    <span className="nv-section-label">Informações do Negócio</span>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label className="nv-label">Nome do Estabelecimento *</label>
                      <input required className="nv-input" placeholder="Ex: Panificadora Central" onChange={e => set('businessName', e.target.value)} />
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label className="nv-label">Categoria *</label>
                        <select required className="nv-select" onChange={e => set('category', e.target.value)}>
                          <option value="">Selecione...</option>
                          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="nv-label">WhatsApp *</label>
                        <input required className="nv-input" placeholder="(86) 90000-0000" onChange={e => set('whatsapp', e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label className="nv-label">Descrição do Negócio *</label>
                      <textarea required className="nv-textarea" placeholder="Conte um pouco sobre a empresa..." onChange={e => set('description', e.target.value)} />
                    </div>

                    <div>
                      <label className="nv-label">Logradouro / Rua *</label>
                      <div style={{ position: "relative" }}>
                        <MapPin size={14} style={{ position: "absolute", left: 12, top: 14, color: "#b0bec5" }} />
                        <input required className="nv-input" style={{ paddingLeft: 36 }} placeholder="Nome da rua" onChange={e => set('street', e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label className="nv-label">Número *</label>
                        <input required className="nv-input" placeholder="123" onChange={e => set('number', e.target.value)} />
                      </div>
                      <div>
                        <label className="nv-label">Quadra</label>
                        <input className="nv-input" placeholder="Ex: 04" onChange={e => set('block', e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label className="nv-label">Ponto de Referência *</label>
                      <input required className="nv-input" placeholder="Ex: Próximo ao posto" onChange={e => set('reference', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* COLUNA 2: MAPA E EXTRAS */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <div className="nv-section-head">
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(247,176,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><MapPin size={14} color="#F7B000" /></div>
                      <span className="nv-section-label">Localização no Mapa *</span>
                    </div>
                    <div style={{ height: 260, borderRadius: 14, overflow: "hidden", border: "1.5px solid #ede9e0", position: "relative", zIndex: 0 }}>
                      <MapWithNoSSR position={position} setPosition={setPosition} />
                    </div>
                  </div>

                  <div>
                    <label className="nv-label">Site ou Redes Sociais</label>
                    <div style={{ position: "relative" }}>
                      <Globe size={14} style={{ position: "absolute", left: 12, top: 14, color: "#b0bec5" }} />
                      <input className="nv-input" style={{ paddingLeft: 36 }} placeholder="instagram.com/..." onChange={e => set('website', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* HORÁRIOS */}
              <div style={{ background: "#faf8f5", border: "1.5px solid #ede9e0", borderRadius: 16, padding: "1.4rem", marginBottom: "2rem" }}>
                <div className="nv-section-head">
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Clock size={14} color="#22c55e" /></div>
                  <span className="nv-section-label">Horário de Funcionamento</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "8px" }}>
                  {openingHours.map((hour, i) => (
                    <div key={hour.day} className={`nv-day-card ${hour.isOpen ? 'active' : ''}`}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <Checkbox id={`d${i}`} checked={hour.isOpen} onCheckedChange={v => updateHours(i, 'isOpen', !!v)} />
                        <label htmlFor={`d${i}`} style={{ fontSize: "0.72rem", fontWeight: 600, color: "#3a4a5a", cursor: "pointer" }}>{hour.day}</label>
                      </div>
                      {hour.isOpen && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <input type="time" className="nv-time-input" value={hour.opens} onChange={e => updateHours(i, 'opens', e.target.value)} />
                          <input type="time" className="nv-time-input" value={hour.closes} onChange={e => updateHours(i, 'closes', e.target.value)} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* RESPONSÁVEL */}
              <div style={{ borderTop: "1.5px solid #f0ece5", paddingTop: "1.5rem", marginBottom: "2rem" }}>
                <div className="nv-section-head">
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,34,64,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}><User size={14} color="#002240" /></div>
                  <span className="nv-section-label">Dados do Proprietário</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="nv-label">Nome do Responsável</label>
                    <input className="nv-input" placeholder="Ex: João Silva" onChange={e => set('ownerName', e.target.value)} />
                  </div>
                  <div>
                    <label className="nv-label">E-mail de Acesso/Contato</label>
                    <input type="email" className="nv-input" placeholder="contato@empresa.com" onChange={e => set('email', e.target.value)} />
                  </div>
                </div>
              </div>

              {error && <div className="nv-error" style={{ marginBottom: "1.5rem" }}><AlertTriangle size={16} />{error}</div>}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1.5px solid #f0ece5", paddingTop: "1.5rem" }}>
                <button type="button" className="adm-btn adm-btn-ghost" style={{ border: "1px solid #ede9e0" }} onClick={() => router.back()}>Cancelar</button>
                <button type="submit" className="adm-btn adm-btn-cyan" style={{ minWidth: 180 }} disabled={loading}>
                  {loading ? <Loader2 size={15} style={{ animation: "adm-spin 1s linear infinite" }} /> : <Save size={15} />}
                  Salvar Estabelecimento
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}