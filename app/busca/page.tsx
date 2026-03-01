"use client"

import { useState, useEffect, Suspense } from "react"
import { Search, MapPin, Star, Clock, SlidersHorizontal, Loader2, X, Store } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/navigation/header"
import { AUTH_CSS } from "./AUTH_CSS"

type Business = {
  id: string; businessName: string; category: string;
  rating?: number; address: string; isOpen?: boolean; isPublic?: boolean;
  images?: string[]; description: string; hours?: string;
}

const CATEGORIES = [
  { value: "restaurante", label: "Restaurantes", color: "#FF7043" },
  { value: "comercio", label: "Comércio", color: "#00CCFF" },
  { value: "servicos", label: "Serviços", color: "#F7B000" },
  { value: "saude", label: "Saúde", color: "#E91E8C" },
  { value: "beleza", label: "Beleza", color: "#8B5CF6" },
  { value: "educacao", label: "Educação", color: "#22c55e" },
  { value: "automotivo", label: "Automotivo", color: "#06b6d4" },
  { value: "casa", label: "Casa", color: "#f97316" },
  { value: "lazer", label: "Lazer", color: "#ec4899" },
  { value: "moda", label: "Moda", color: "#a855f7" },
  { value: "esportes", label: "Esportes", color: "#10b981" },
]

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.value, c]))

function Stars({ rating = 0, size = 11 }: { rating?: number; size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s <= Math.round(rating) ? "#F7B000" : "#ddd"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #f0ece5" }}>
      <div className="srch-skeleton" style={{ height: 160, background: "#f4f1ec" }} />
      <div style={{ padding: "1rem 1.1rem" }}>
        <div className="srch-skeleton" style={{ height: 14, borderRadius: 7, background: "#f0ece5", width: "70%", marginBottom: 8 }} />
        <div className="srch-skeleton" style={{ height: 11, borderRadius: 6, background: "#f4f1ec", width: "50%", marginBottom: 14 }} />
        <div className="srch-skeleton" style={{ height: 10, borderRadius: 5, background: "#f4f1ec", width: "90%", marginBottom: 5 }} />
        <div className="srch-skeleton" style={{ height: 10, borderRadius: 5, background: "#f4f1ec", width: "65%" }} />
      </div>
    </div>
  )
}

function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [selectedCats, setSelectedCats] = useState<string[]>(searchParams.getAll("categoria"))
  const [sortBy, setSortBy] = useState("relevance")

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("q", searchTerm)
    selectedCats.forEach(c => params.append("categoria", c))
    router.replace(`/busca?${params.toString()}`, { scroll: false })
  }, [searchTerm, selectedCats, router])

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "businesses"), where("isPublic", "==", true)))
        setAllBusinesses(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Business[])
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    })()
  }, [])

  const toggleCat = (v: string) => setSelectedCats(p => p.includes(v) ? p.filter(c => c !== v) : [...p, v])

  const filtered = allBusinesses
    .filter(b => {
      const ms = (b.businessName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || (b.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      const mc = selectedCats.length === 0 || selectedCats.includes(b.category)
      return ms && mc && b.isPublic === true
    })
    .sort((a, b) => sortBy === "rating" ? (b.rating || 0) - (a.rating || 0) : sortBy === "name" ? a.businessName.localeCompare(b.businessName) : 0)

  return (
    <>
      <style>{AUTH_CSS}</style>
      <div className="srch-main">
        {/* TOP BAR */}
        <div className="srch-bar-wrap">
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div className="srch-input-wrap" style={{ flex: 1, minWidth: 200 }}>
              <Search size={16} color="rgba(255,255,255,0.35)" />
              <input className="srch-input" placeholder="Busque por 'pizza', 'farmácia', 'salão'..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className="srch-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="relevance">Relevância</option>
              <option value="rating">Melhor Avaliação</option>
              <option value="name">Nome (A–Z)</option>
            </select>
            <button onClick={() => setShowFilters(p => !p)} style={{ height: 46, padding: "0 16px", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, color: showFilters ? "#00CCFF" : "rgba(255,255,255,0.55)", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: "0.85rem", fontFamily: "'DM Sans',sans-serif" }}
              className="lg:hidden">
              <SlidersHorizontal size={15} /> Filtros
            </button>
          </div>
        </div>

        <div className="srch-body" style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
          {/* SIDEBAR */}
          <aside className="srch-sidebar" style={{ display: showFilters ? "block" : undefined }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
              <div className="srch-sidebar-title" style={{ margin: 0 }}>Categorias</div>
              {selectedCats.length > 0 && (
                <button onClick={() => setSelectedCats([])} style={{ fontSize: "0.72rem", color: "#00CCFF", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  Limpar
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
              {CATEGORIES.map(c => {
                const active = selectedCats.includes(c.value)
                return (
                  <button key={c.value} onClick={() => toggleCat(c.value)}
                    className={`srch-cat-chip ${active ? 'active' : ''}`}
                    style={active ? { background: c.color, borderColor: c.color } : {}}>
                    {c.label}
                  </button>
                )
              })}
            </div>

            {selectedCats.length > 0 && (
              <div style={{ marginTop: "1.5rem" }}>
                <div className="srch-sidebar-title">Ativos</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {selectedCats.map(v => {
                    const c = CAT_MAP[v]
                    return (
                      <button key={v} onClick={() => toggleCat(v)}
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: `${c?.color || "#002240"}15`, color: c?.color || "#002240", border: `1.5px solid ${c?.color || "#002240"}30`, borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                        {c?.label || v} <X size={10} />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* RESULTS */}
          <div className="srch-results">
            <div className="srch-results-head">
              <div className="srch-count">
                {loading ? "Buscando..." : <>{filtered.length}<span>resultado{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</span></>}
              </div>
            </div>

            {loading ? (
              <div className="srch-grid">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length > 0 ? (
              <div className="srch-grid">
                {filtered.map(b => {
                  const cc = CAT_MAP[b.category]?.color || "#00CCFF"
                  const catLabel = CAT_MAP[b.category]?.label || b.category
                  return (
                    <Link href={`/estabelecimento/${b.id}`} key={b.id} className="srch-card">
                      <div className="srch-card-img">
                        {b.images?.[0] ? (
                          <img src={b.images[0]} alt={b.businessName} />
                        ) : (
                          <div className="srch-card-img-ph">
                            <Store size={40} color="#c8c0b0" strokeWidth={1.5} />
                          </div>
                        )}
                        {/* Category badge over image */}
                        <div style={{ position: "absolute", top: 10, left: 10, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", borderRadius: 100, padding: "3px 9px", border: `1px solid ${cc}40` }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: cc, flexShrink: 0 }} />
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>{catLabel}</span>
                        </div>
                      </div>
                      <div className="srch-card-body">
                        <div className="srch-card-name">{b.businessName}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                          <Stars rating={b.rating} />
                          <span style={{ fontSize: "0.72rem", color: "#8a9aaa" }}>
                            {b.rating && b.rating > 0 ? b.rating.toFixed(1) : "Sem avaliações"}
                          </span>
                        </div>
                        <div className="srch-card-desc">
                          {b.description?.substring(0, 90)}{b.description && b.description.length > 90 ? "..." : ""}
                        </div>
                        <div className="srch-card-foot">
                          <div style={{ display: "flex", alignItems: "center", gap: 4, overflow: "hidden" }}>
                            <MapPin size={11} color="#00CCFF" style={{ flexShrink: 0 }} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.address?.split(',')[0]}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                            <Clock size={10} color="#b0bec5" />
                            <span>{b.hours || "—"}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="srch-empty">
                <div className="srch-empty-icon">
                  <Search size={34} color="#c8c0b0" strokeWidth={1.5} />
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#5a6878", marginBottom: 6 }}>
                  Nenhum resultado encontrado
                </div>
                <div style={{ fontSize: "0.85rem", maxWidth: 320, margin: "0 auto" }}>
                  Tente ajustar os filtros ou buscar por outro termo.
                </div>
                {selectedCats.length > 0 && (
                  <button onClick={() => setSelectedCats([])} style={{ marginTop: 16, padding: "8px 18px", background: "#002240", color: "#fff", border: "none", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: "0.83rem", fontWeight: 600, cursor: "pointer" }}>
                    Limpar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default function BuscaPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Loader2 size={32} color="#00CCFF" style={{ animation: "auth-spin 1s linear infinite" }} />
        <style>{`@keyframes auth-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <div className="srch-page">
        <Header title="Buscar Estabelecimentos" subtitle="Encontre o que você precisa no Novo Tempo" />
        <SearchResults />
      </div>
    </Suspense>
  )
}