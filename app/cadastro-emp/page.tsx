"use client"

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Store, MapPin, Clock, Loader2, AlertTriangle, User, Info, Map as MapIcon, Globe, Phone } from "lucide-react"
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
    <div style={{ height: 260, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>
      Carregando mapa...
    </div>
  )
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
  { id: 'friday', label: 'Sexta' }, { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
]

export default function EmpresarioCadastroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  const [formData, setFormData] = useState({
    ownerName: '', email: '', businessName: '', category: '',
    businessPhone: '', whatsapp: '', website: '',
    street: '', number: '', block: '', reference: '',
    password: '', confirmPassword: '', terms: false
  })
  
  const [openingHours, setOpeningHours] = useState(
    DAYS.map(d => ({ day: d.label, opens: '08:00', closes: '18:00', isOpen: false }))
  )

  useEffect(() => {
    setIsMounted(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        (err) => console.error("Erro ao obter geolocalização:", err),
        { enableHighAccuracy: true }
      )
    }
  }, [])

  const set = (k: string, v: any) => setFormData(p => ({ ...p, [k]: v }))
  
  const updateHours = (i: number, field: string, value: any) => {
    const h = [...openingHours]; 
    h[i] = { ...h[i], [field]: value }; 
    setOpeningHours(h)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('')
    if (!position) { setError("Por favor, marque o local da sua loja no mapa."); return }
    if (formData.password !== formData.confirmPassword) { setError("As senhas não coincidem."); return }
    if (!formData.terms) { setError("Você precisa aceitar os termos de uso."); return }
    
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      
      const fullAddress = `${formData.street}, Nº ${formData.number}${formData.block ? `, Qd ${formData.block}` : ''}. Ref: ${formData.reference}`;

      await setDoc(doc(db, "businesses", cred.user.uid), {
        ...formData,
        address: fullAddress,
        openingHours: openingHours.filter(h => h.isOpen),
        location: { latitude: position.lat, longitude: position.lng },
        role: 'business', 
        status: 'pending', 
        createdAt: new Date()
      })
      router.push('/empresario/dashboard')
    } catch (err: any) { 
      setError(err.message) 
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <>
      {isMounted && <style dangerouslySetInnerHTML={{ __html: AUTH_CSS }} />}
      
      <div className="auth-page">
        <Header />
        <div className="auth-bg" style={{ alignItems: "flex-start", paddingTop: "3rem" }}>
          <div className="auth-orb1" /><div className="auth-orb2" /><div className="auth-grid" />

          <div className="auth-card auth-card-wider">
            <div className="auth-card-top">
              <div className="auth-card-top-orb" />
              <div className="auth-icon-wrap" style={{ background: "rgba(247,176,0,0.1)", border: "1px solid rgba(247,176,0,0.2)" }}>
                <Store size={25} color="#F7B000" />
              </div>
              <div className="auth-eyebrow">Empresário Parceiro</div>
              <div className="auth-title">Cadastrar Minha Loja</div>
              <div className="auth-subtitle">Divulgue seu negócio para toda a cidade</div>
            </div>

            <div className="auth-body">
              <form onSubmit={handleSubmit}>
                <div className="auth-section-label"><Info size={12} /> Informações do Negócio</div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="auth-field">
                      <label className="auth-label">Nome do Estabelecimento *</label>
                      <div className="auth-input-wrap">
                        <Store size={14} className="ai" />
                        <input className="auth-input" placeholder="Ex: Panificadora Central" required onChange={e => set('businessName', e.target.value)} />
                      </div>
                    </div>

                    <div className="auth-form-grid cols2">
                      <div className="auth-field">
                        <label className="auth-label">Categoria *</label>
                        <select required className="auth-select" onChange={e => set('category', e.target.value)}>
                          <option value="">Selecione...</option>
                          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                      </div>
                      <div className="auth-field">
                        <label className="auth-label">WhatsApp *</label>
                        <div className="auth-input-wrap">
                          <Phone size={14} className="ai" />
                          <input className="auth-input" placeholder="(00) 00000-0000" required onChange={e => set('whatsapp', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="auth-field">
                      <label className="auth-label">Site ou Rede Social</label>
                      <div className="auth-input-wrap">
                        <Globe size={14} className="ai" />
                        <input className="auth-input" placeholder="https://..." onChange={e => set('website', e.target.value)} />
                      </div>
                    </div>

                    <div className="auth-field">
                      <label className="auth-label">Rua / Logradouro *</label>
                      <div className="auth-input-wrap">
                        <MapPin size={14} className="ai" />
                        <input className="auth-input" placeholder="Nome da rua" required onChange={e => set('street', e.target.value)} />
                      </div>
                    </div>

                    <div className="auth-form-grid cols2">
                      <div className="auth-field">
                        <label className="auth-label">Número *</label>
                        <input className="auth-input no-icon" placeholder="123" required onChange={e => set('number', e.target.value)} />
                      </div>
                      <div className="auth-field">
                        <label className="auth-label">Quadra</label>
                        <input className="auth-input no-icon" placeholder="Ex: 04" onChange={e => set('block', e.target.value)} />
                      </div>
                    </div>

                    <div className="auth-field">
                      <label className="auth-label">Ponto de Referência *</label>
                      <div className="auth-input-wrap">
                        <Info size={14} className="ai" />
                        <input className="auth-input" placeholder="Ex: Ao lado do mercado" required onChange={e => set('reference', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="auth-field">
                    <label className="auth-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <MapIcon size={12} color="#F7B000" /> Localização no Mapa *
                    </label>
                    <div style={{ height: "100%", minHeight: 320, borderRadius: 14, overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.09)", position: "relative", zIndex: 0 }}>
                      <MapWithNoSSR position={position} setPosition={setPosition} />
                    </div>
                  </div>
                </div>

                <div className="auth-section-label"><Clock size={12} /> Horário de Funcionamento</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "7px", marginBottom: "1.5rem" }}>
                  {openingHours.map((h, i) => (
                    <div key={h.day} className={`auth-day-card ${h.isOpen ? 'active' : ''}`}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: h.isOpen ? 8 : 0 }}>
                        <Checkbox
                          checked={h.isOpen}
                          onCheckedChange={v => updateHours(i, 'isOpen', !!v)}
                          className="border-[rgba(255,255,255,0.18)] data-[state=checked]:bg-[#00CCFF] data-[state=checked]:border-[#00CCFF]"
                        />
                        <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{h.day}</span>
                      </div>
                      {h.isOpen && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <input type="time" className="auth-time-input" value={h.opens} onChange={e => updateHours(i, 'opens', e.target.value)} />
                          <input type="time" className="auth-time-input" value={h.closes} onChange={e => updateHours(i, 'closes', e.target.value)} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="auth-section-label"><User size={12} /> Dados de Acesso</div>
                <div className="auth-form-grid cols2" style={{ marginBottom: "1rem" }}>
                  <div className="auth-field">
                    <label className="auth-label">Nome do Proprietário *</label>
                    <div className="auth-input-wrap">
                      <User size={14} className="ai" />
                      <input className="auth-input" placeholder="Seu nome" required onChange={e => set('ownerName', e.target.value)} />
                    </div>
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">E-mail *</label>
                    <div className="auth-input-wrap">
                      <Mail size={14} className="ai" />
                      <input className="auth-input" type="email" placeholder="email@exemplo.com" required onChange={e => set('email', e.target.value)} />
                    </div>
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Senha *</label>
                    <div className="auth-input-wrap">
                      <Lock size={14} className="ai" />
                      <input className="auth-input pr" type={showPass ? "text" : "password"} placeholder="Mínimo 6 caracteres" required onChange={e => set('password', e.target.value)} />
                      <button type="button" className="auth-eye-btn" onClick={() => setShowPass(p => !p)}>
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Confirmar Senha *</label>
                    <div className="auth-input-wrap">
                      <Lock size={14} className="ai" />
                      <input 
                        className="auth-input" 
                        type="password" 
                        placeholder="Repita a senha" 
                        required 
                        onChange={e => set('confirmPassword', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                <div className="auth-terms" style={{ marginBottom: "1.4rem" }}>
                  <Checkbox
                    className="border-[rgba(255,255,255,0.18)] data-[state=checked]:bg-[#00CCFF] data-[state=checked]:border-[#00CCFF] mt-0.5 flex-shrink-0"
                    checked={formData.terms}
                    onCheckedChange={v => set('terms', !!v)}
                  />
                  <span>
                    Concordo com os{" "}
                    <Link href="/termos-de-uso" target="_blank" className="auth-lnk">Termos de Uso</Link>
                    {" "}e a{" "}
                    <Link href="/politica-de-privacidade" target="_blank" className="auth-lnk">Política de Privacidade</Link>
                  </span>
                </div>

                {error && (
                  <div className="auth-error" style={{ marginBottom: "1rem" }}>
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} /> {error}
                  </div>
                )}

                <button type="submit" className="auth-btn auth-btn-gold" disabled={loading}>
                  {loading ? <Loader2 size={17} className="animate-spin" /> : <Store size={16} />}
                  {loading ? "Cadastrando..." : "Cadastrar Meu Negócio"}
                </button>
              </form>

              <div className="auth-divider" style={{ marginTop: "1.8rem" }}>
                <span className="auth-divider-text">Já tem conta?</span>
              </div>
              <div className="auth-foot">
                <Link href="/login">Faça login aqui</Link><br />
                Não é empresário? <Link href="/cadastro">Cadastre-se como Cidadão</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}