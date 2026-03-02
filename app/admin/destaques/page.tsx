"use client"

import { useState, useEffect } from "react"
import { Loader2, Star, Search, Plus, X, Store } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ADMIN_CSS } from "../dashboard/page"

type Business = { id: string; businessName: string; category: string; isFeatured?: boolean; address?: string; }

const CAT_COLORS: Record<string, string> = { restaurante: "#FF7043", comercio: "#00CCFF", servicos: "#F7B000", saude: "#E91E8C", automotivo: "#8B5CF6", casa: "#22c55e" }

export default function DestaquesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, "businesses"))
        setBusinesses(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Business[])
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }; fetch()
  }, [])

  const featured = businesses.filter(b => b.isFeatured)
  const available = businesses.filter(b => !b.isFeatured && b.businessName?.toLowerCase().includes(searchTerm.toLowerCase()))

  const toggle = async (b: Business, isFeatured: boolean) => {
    if (isFeatured && featured.length >= 3) { alert("Máximo de 3 destaques."); return }
    try {
      await updateDoc(doc(db, "businesses", b.id), { isFeatured })
      setBusinesses(p => p.map(x => x.id === b.id ? { ...x, isFeatured } : x))
    } catch (e) { console.error(e) }
  }

  if (loading) return (
    <><style>{ADMIN_CSS}</style>
      <div className="adm adm-loading"><Loader2 size={28} color="#00CCFF" style={{ animation: "adm-spin 1s linear infinite" }} /> Carregando...</div>
    </>
  )

  return (
    <>
      <style>{ADMIN_CSS}</style>
      <div className="adm">
        <div className="adm-hero">
          <div className="adm-hero-orb1" /><div className="adm-hero-orb2" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="adm-hero-eyebrow">Configuração da Home</div>
            <div className="adm-hero-title">Destaques da Página Inicial</div>
            <div className="adm-hero-sub">Gerencie quais empresas aparecem em evidência no topo do site. Selecione até 3 opções.</div>
          </div>
        </div>

        {/* SLOTS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.1rem", marginBottom: "1.75rem" }}>
          {[0, 1, 2].map(i => {
            const biz = featured[i]
            const cc = biz ? (CAT_COLORS[biz.category] || "#00CCFF") : "#00CCFF"
            return (
              <div key={i} className="adm-slot-card" style={{
                background: biz ? "#fff" : "#faf8f5",
                border: biz ? `2px solid ${cc}40` : "2px dashed #e0dbd2",
                boxShadow: biz ? `0 4px 20px ${cc}15` : "none",
              }}>
                {biz ? (
                  <>
                    <button onClick={() => toggle(biz, false)} style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", cursor: "pointer", color: "#b0bec5", padding: 4 }}>
                      <X size={16} />
                    </button>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${cc}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      <Star size={22} color={cc || "#00CCFF"} fill={cc || "#00CCFF"} />
                    </div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#002240", textAlign: "center", marginBottom: 6 }}>{biz.businessName}</div>
                    <span className="adm-badge" style={{ background: `${cc}15`, color: cc, border: `1px solid ${cc}30` }}>{biz.category}</span>
                    <div style={{ fontSize: "0.67rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "#b0bec5", marginTop: 10 }}>Destaque {i + 1}</div>
                  </>
                ) : (
                  <>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#ede9e0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      <Plus size={22} color="#b0a898" />
                    </div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.95rem", fontWeight: 600, color: "#8a9aaa" }}>Slot {i + 1} Disponível</div>
                    <div style={{ fontSize: "0.75rem", color: "#b0bec5", marginTop: 4 }}>Selecione abaixo para preencher</div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* SEARCH */}
        <div className="adm-card" style={{ marginBottom: "1.5rem" }}>
          <div className="adm-card-body">
            <div style={{ display: "flex", gap: 10 }}>
              <div className="adm-search-wrap" style={{ flex: 1 }}>
                <Search size={15} color="#b0bec5" />
                <input className="adm-search-input" placeholder="Buscar empresa para adicionar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              {searchTerm && <button className="adm-btn adm-btn-ghost" onClick={() => setSearchTerm('')}><X size={14} /></button>}
            </div>
          </div>
        </div>

        {/* AVAILABLE LIST */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div><div className="adm-card-title">Empresas Disponíveis</div><div className="adm-card-sub">{available.length} empresas</div></div>
          </div>
          {available.length === 0 ? (
            <div className="adm-empty" style={{ padding: "3rem" }}>
              <Store size={36} color="#d5d0c8" style={{ margin: "0 auto 10px", display: "block" }} />
              Nenhuma empresa encontrada.
            </div>
          ) : (
            <div style={{ maxHeight: 480, overflowY: "auto" }}>
              {available.map(b => {
                const cc = CAT_COLORS[b.category] || "#00CCFF"
                const isFull = featured.length >= 3
                return (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #f8f6f2", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#fdfbf8")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, overflow: "hidden" }}>
                      <Avatar style={{ width: 38, height: 38, borderRadius: 10, border: "1.5px solid #f0ece5" }}>
                        <AvatarFallback style={{ background: "#f8f6f2", borderRadius: 10 }}><Store size={16} color="#b0a898" /></AvatarFallback>
                      </Avatar>
                      <div style={{ overflow: "hidden" }}>
                        <div className="adm-name">{b.businessName}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                          <span className="adm-badge" style={{ background: `${cc}15`, color: cc, border: `1px solid ${cc}30` }}>{b.category}</span>
                          {b.address && <span className="adm-meta" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>• {b.address}</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      className={`adm-btn ${isFull ? 'adm-btn-ghost' : 'adm-btn-cyan'}`}
                      onClick={() => toggle(b, true)}
                      disabled={isFull}
                      style={{ flexShrink: 0, marginLeft: 12 }}
                    >
                      <Plus size={14} /> {isFull ? "Slots cheios" : "Destacar"}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}