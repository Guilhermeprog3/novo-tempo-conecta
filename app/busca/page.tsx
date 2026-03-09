"use client"

import { useState, useEffect, Suspense } from "react"
import {
  Search, MapPin, Star, Clock, SlidersHorizontal,
  Loader2, X, Store, Phone, Filter
} from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/navigation/header"
import { AUTH_CSS } from "../../components/Auth"

type Business = {
  id: string; businessName: string; category: string;
  rating?: number; address: string; isPublic?: boolean;
  images?: string[]; description: string;
  openingHours?: { day: string; opens: string; closes: string; isOpen: boolean }[];
  whatsapp?: string; businessPhone?: string;
}

const CATEGORIES = [
  { value: "restaurante", label: "Gastronomia", color: "#FF7043" },
  { value: "comercio", label: "Loja e Varejo", color: "#00CCFF" },
  { value: "mercado", label: "Mercados", color: "#4ade80" },
  { value: "saude", label: "Saúde", color: "#E91E8C" },
  { value: "beleza", label: "Beleza", color: "#8B5CF6" },
  { value: "servicos", label: "Serviços", color: "#F7B000" },
  { value: "educacao", label: "Educação", color: "#3b82f6" },
  { value: "construcao", label: "Construção", color: "#94a3b8" },
  { value: "automotivo", label: "Automotivo", color: "#06b6d4" },
  { value: "pet", label: "Pet Shop", color: "#10b981" },
  { value: "tecnologia", label: "Tecnologia", color: "#6366f1" },
  { value: "moda", label: "Moda", color: "#a855f7" },
  { value: "lazer", label: "Lazer", color: "#ec4899" },
  { value: "solidario", label: "Solidário", color: "#ef4444" },
  { value: "outro", label: "Outros", color: "#64748b" },
]
const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.value, c]))

const BUSCA_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

.busca-wrap { font-family: 'DM Sans', sans-serif; }

/* TOP BAR */
.busca-topbar {
  position: sticky; top: 0; z-index: 80;
  background: #002240;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 12px 24px;
}
.busca-topbar-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
}
.busca-search-wrap {
  flex: 1; min-width: 180px;
  display: flex; align-items: center; gap: 10px;
  background: rgba(255,255,255,0.06);
  border: 1.5px solid rgba(255,255,255,0.1);
  border-radius: 13px; padding: 0 14px; height: 46px;
  transition: border-color 0.2s;
}
.busca-search-wrap:focus-within { border-color: rgba(0,204,255,0.5); }
.busca-search-inp {
  flex: 1; background: transparent; border: none; outline: none;
  color: #fff; font-size: 0.875rem; font-family: 'DM Sans', sans-serif;
}
.busca-search-inp::placeholder { color: rgba(255,255,255,0.3); }
.busca-sort-sel {
  height: 46px; padding: 0 14px; border-radius: 13px;
  background: rgba(255,255,255,0.06);
  border: 1.5px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.65); font-size: 0.83rem;
  font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none;
}
.busca-mob-btn {
  height: 46px; padding: 0 16px; border-radius: 13px;
  background: rgba(255,255,255,0.06);
  border: 1.5px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.55); cursor: pointer;
  display: none; align-items: center; gap: 7px;
  font-size: 0.83rem; font-family: 'DM Sans', sans-serif;
  transition: all 0.15s;
}
.busca-mob-btn.active { border-color: rgba(0,204,255,0.4); color: #00CCFF; background: rgba(0,204,255,0.07); }
.busca-badge { width:18px;height:18px;border-radius:50%;background:#00CCFF;color:#002240;font-size:0.63rem;font-weight:800;display:flex;align-items:center;justify-content:center; }

/* BODY */
.busca-body { max-width:1280px;margin:0 auto;display:flex;gap:24px;padding:28px 24px 60px;align-items:flex-start; }

/* SIDEBAR */
.busca-sidebar {
  width:268px;flex-shrink:0;
  background:#fff;border-radius:20px;
  border:1px solid #f0ece5;
  box-shadow:0 2px 16px rgba(0,34,64,0.07);
  position:sticky;top:86px;
  max-height:calc(100vh - 110px);overflow-y:auto;
}
.busca-sidebar::-webkit-scrollbar{width:4px}
.busca-sidebar::-webkit-scrollbar-thumb{background:#e8e4dc;border-radius:4px}

/* FILTER SECTIONS */
.busca-fsec { padding:1rem 1.2rem; border-bottom:1px solid #f5f3f0; }
.busca-fsec:last-child { border-bottom:none; }
.busca-fsec-head { display:flex;align-items:center;justify-content:space-between;margin-bottom:10px; }
.busca-fsec-title { font-size:0.7rem;font-weight:800;letter-spacing:0.09em;text-transform:uppercase;color:#8a9aaa; }
.busca-fsec-clear { font-size:0.68rem;color:#00CCFF;font-weight:700;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;padding:0; }

/* CATEGORY CHIPS */
.bcat {
  display:inline-flex;align-items:center;gap:5px;
  padding:5px 10px;border-radius:100px;cursor:pointer;
  font-size:0.71rem;font-weight:600;
  margin:0 4px 5px 0;
  border:1.5px solid #ede9e0;
  background:#faf8f5;color:#5a6878;
  font-family:'DM Sans',sans-serif;
  transition:background 0.15s,border-color 0.15s,color 0.15s;
}
.bcat:hover { border-color:#c0cad2; }
.bcat.on { color:#fff;border-color:transparent; }

/* STAR OPTIONS */
.bstar-opt {
  display:flex;align-items:center;gap:8px;
  padding:7px 10px;border-radius:10px;cursor:pointer;
  border:1.5px solid transparent;background:transparent;
  font-family:'DM Sans',sans-serif;width:100%;margin-bottom:5px;
  transition:background 0.15s,border-color 0.15s;
}
.bstar-opt:last-child { margin-bottom:0; }
.bstar-opt:hover { background:#faf8f5; }
.bstar-opt.on { background:rgba(247,176,0,0.07);border-color:rgba(247,176,0,0.28); }
.bstar-lbl { font-size:0.78rem;color:#5a6878;font-weight:500; }

/* TOGGLE ROW */
.btoggle {
  display:flex;align-items:center;justify-content:space-between;
  padding:8px 10px;border-radius:11px;cursor:pointer;
  border:1.5px solid transparent;margin-bottom:6px;
  transition:background 0.15s,border-color 0.15s;
}
.btoggle:last-child { margin-bottom:0; }
.btoggle:hover { background:#faf8f5; }
.btoggle.on { background:rgba(0,204,255,0.05);border-color:rgba(0,204,255,0.2); }
.btoggle-lbl { display:flex;align-items:center;gap:7px;font-size:0.82rem;color:#3a4a5a;font-weight:500; }
.bswitch { width:34px;height:20px;border-radius:100px;background:#dde2e8;position:relative;transition:background 0.2s;flex-shrink:0; }
.bswitch.on { background:#00CCFF; }
.bswitch::after { content:'';position:absolute;width:14px;height:14px;border-radius:50%;background:#fff;top:3px;left:3px;transition:transform 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.18); }
.bswitch.on::after { transform:translateX(14px); }

/* ACTIVE TAGS */
.btag {
  display:inline-flex;align-items:center;gap:5px;
  padding:3px 9px;border-radius:100px;
  font-size:0.7rem;font-weight:700;cursor:pointer;
  font-family:'DM Sans',sans-serif;margin:0 4px 4px 0;
  transition:opacity 0.15s;
}
.btag:hover { opacity:0.72; }

/* RESULTS */
.busca-results { flex:1;min-width:0; }
.busca-rhead { display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px; }
.busca-count { font-size:0.82rem;color:#8a9aaa; }
.busca-count strong { color:#002240;font-weight:700;font-size:1rem;margin-right:4px; }
.busca-clear-link { font-size:0.75rem;color:#00CCFF;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:700; }

/* ACTIVE PILLS ROW */
.busca-pills { display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px; }

/* GRID */
.busca-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(235px,1fr));gap:16px; }
.busca-card {
  background:#fff;border-radius:18px;border:1px solid #f0ece5;
  box-shadow:0 2px 12px rgba(0,34,64,0.06);
  overflow:hidden;text-decoration:none;color:inherit;
  display:flex;flex-direction:column;
  transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s;
}
.busca-card:hover { transform:translateY(-5px);box-shadow:0 14px 36px rgba(0,34,64,0.12); }
.busca-img { height:155px;overflow:hidden;position:relative;background:#f4f1ec;flex-shrink:0; }
.busca-img img { width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease; }
.busca-card:hover .busca-img img { transform:scale(1.06); }
.busca-img-ph { height:100%;display:flex;align-items:center;justify-content:center;background:#f0ece5; }
.busca-cbody { padding:1rem 1.1rem;flex:1;display:flex;flex-direction:column; }
.busca-cname { font-family:'Syne',sans-serif;font-size:0.95rem;font-weight:700;color:#002240;margin-bottom:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.busca-cdesc { font-size:0.78rem;color:#7a8a9a;line-height:1.5;margin-bottom:10px;flex:1; }
.busca-cfoot { display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:0.72rem;color:#8a9aaa;border-top:1px solid #f5f3f0;padding-top:10px; }

/* SKELETON */
@keyframes busca-sh { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
.bskel { background:linear-gradient(90deg,#f4f1ec 25%,#ede9e0 50%,#f4f1ec 75%);background-size:800px 100%;animation:busca-sh 1.4s infinite linear;border-radius:6px; }

/* EMPTY */
.busca-empty { text-align:center;padding:4rem 1rem;color:#8a9aaa;font-family:'DM Sans',sans-serif; }
.busca-empty-icon { width:72px;height:72px;border-radius:24px;background:#f4f1ec;display:flex;align-items:center;justify-content:center;margin:0 auto 1.2rem; }

/* DRAWER (mobile) */
.busca-overlay { position:fixed;inset:0;background:rgba(0,10,22,0.55);z-index:200;backdrop-filter:blur(3px);opacity:0;pointer-events:none;transition:opacity 0.25s; }
.busca-overlay.on { opacity:1;pointer-events:all; }
.busca-drawer { position:fixed;top:0;left:0;bottom:0;width:290px;z-index:201;background:#fff;box-shadow:4px 0 32px rgba(0,34,64,0.2);transform:translateX(-100%);transition:transform 0.3s cubic-bezier(0.34,1.2,0.64,1);overflow-y:auto;display:flex;flex-direction:column; }
.busca-drawer.on { transform:translateX(0); }
.busca-drawer-head { display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.3rem;border-bottom:1px solid #f0ece5;position:sticky;top:0;background:#fff;z-index:1; }
.busca-drawer-title { font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#002240; }
.busca-dclose { width:32px;height:32px;border-radius:10px;background:#f4f1ec;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#5a6878; }
.busca-drawer-body { flex:1; }
.busca-drawer-foot { padding:1rem 1.3rem;border-top:1px solid #f0ece5;position:sticky;bottom:0;background:#fff; }
.busca-apply { width:100%;height:46px;border-radius:13px;background:#002240;color:#fff;border:none;font-family:'Syne',sans-serif;font-size:0.9rem;font-weight:700;cursor:pointer;transition:background 0.15s; }
.busca-apply:hover { background:#001830; }

@media(max-width:900px) {
  .busca-sidebar { display:none; }
  .busca-body { padding:18px 16px 48px; }
  .busca-mob-btn { display:flex; }
}
@media(max-width:520px) {
  .busca-grid { grid-template-columns:1fr; }
  .busca-topbar { padding:10px 14px; }
}
`

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
      <div className="bskel" style={{ height: 155 }} />
      <div style={{ padding: "1rem 1.1rem" }}>
        <div className="bskel" style={{ height: 14, width: "70%", marginBottom: 8 }} />
        <div className="bskel" style={{ height: 11, width: "50%", marginBottom: 14 }} />
        <div className="bskel" style={{ height: 10, width: "90%", marginBottom: 5 }} />
        <div className="bskel" style={{ height: 10, width: "65%" }} />
      </div>
    </div>
  )
}

function isOpenNow(b: Business): boolean {
  if (!b.openingHours?.length) return false
  const DAY_SHORTS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const DAY_FULL = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
  const i = new Date().getDay()
  const h = b.openingHours.find(x =>
    x.day?.toLowerCase().startsWith(DAY_SHORTS[i].toLowerCase()) ||
    DAY_FULL[i].toLowerCase().startsWith(x.day?.toLowerCase().slice(0, 3) || "_")
  )
  if (!h) return false
  const toMin = (t: string) => { const [hh, mm] = t.split(":").map(Number); return hh * 60 + mm }
  const now = new Date().getHours() * 60 + new Date().getMinutes()
  return now >= toMin(h.opens) && now < toMin(h.closes)
}

interface Filters { cats: string[]; minRating: number; openNow: boolean; hasContact: boolean }

function FiltersContent({ f, setF }: { f: Filters; setF: (fn: (prev: Filters) => Filters) => void }) {
  const toggleCat = (v: string) => setF(p => ({ ...p, cats: p.cats.includes(v) ? p.cats.filter(c => c !== v) : [...p.cats, v] }))

  return (
    <>
      {/* CATEGORIAS */}
      <div className="busca-fsec">
        <div className="busca-fsec-head">
          <span className="busca-fsec-title">Categorias</span>
          {f.cats.length > 0 && <button className="busca-fsec-clear" onClick={() => setF(p => ({ ...p, cats: [] }))}>Limpar</button>}
        </div>
        <div>
          {CATEGORIES.map(c => (
            <button key={c.value} className={`bcat ${f.cats.includes(c.value) ? "on" : ""}`}
              style={f.cats.includes(c.value) ? { background: c.color } : {}}
              onClick={() => toggleCat(c.value)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* AVALIAÇÃO */}
      <div className="busca-fsec">
        <div className="busca-fsec-head">
          <span className="busca-fsec-title">Avaliação Mínima</span>
          {f.minRating > 0 && <button className="busca-fsec-clear" onClick={() => setF(p => ({ ...p, minRating: 0 }))}>Limpar</button>}
        </div>
        {[4, 3, 2].map(n => (
          <button key={n} className={`bstar-opt ${f.minRating === n ? "on" : ""}`}
            onClick={() => setF(p => ({ ...p, minRating: p.minRating === n ? 0 : n }))}>
            <Stars rating={n} size={13} />
            <span className="bstar-lbl">{n}+ estrelas</span>
          </button>
        ))}
      </div>

      {/* OUTROS */}
      <div className="busca-fsec">
        <div className="busca-fsec-head">
          <span className="busca-fsec-title">Outros Filtros</span>
          {(f.openNow || f.hasContact) && <button className="busca-fsec-clear" onClick={() => setF(p => ({ ...p, openNow: false, hasContact: false }))}>Limpar</button>}
        </div>
        <div className={`btoggle ${f.openNow ? "on" : ""}`} onClick={() => setF(p => ({ ...p, openNow: !p.openNow }))}>
          <span className="btoggle-lbl"><Clock size={14} color={f.openNow ? "#00CCFF" : "#8a9aaa"} />Aberto agora</span>
          <div className={`bswitch ${f.openNow ? "on" : ""}`} />
        </div>
        <div className={`btoggle ${f.hasContact ? "on" : ""}`} onClick={() => setF(p => ({ ...p, hasContact: !p.hasContact }))}>
          <span className="btoggle-lbl"><Phone size={14} color={f.hasContact ? "#00CCFF" : "#8a9aaa"} />Tem WhatsApp / contato</span>
          <div className={`bswitch ${f.hasContact ? "on" : ""}`} />
        </div>
      </div>
    </>
  )
}

function SearchResults() {
  const router = useRouter()
  const sp = useSearchParams()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(sp.get("q") || "")
  const [sortBy, setSortBy] = useState("relevance")
  const [drawer, setDrawer] = useState(false)
  const [filters, setFilters] = useState<Filters>({ cats: sp.getAll("categoria"), minRating: 0, openNow: false, hasContact: false })

  useEffect(() => {
    const p = new URLSearchParams()
    if (searchTerm) p.set("q", searchTerm)
    filters.cats.forEach(c => p.append("categoria", c))
    router.replace(`/busca?${p.toString()}`, { scroll: false })
  }, [searchTerm, filters.cats])

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "businesses"), where("isPublic", "==", true)))
        setBusinesses(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Business[])
      } catch (e) { console.error(e) } finally { setLoading(false) }
    })()
  }, [])

  const setF = (fn: (p: Filters) => Filters) => setFilters(fn)

  const filtered = businesses.filter(b => {
    if (!b.isPublic) return false
    const q = searchTerm.toLowerCase()
    if (q && ![b.businessName, b.description, b.address].some(s => s?.toLowerCase().includes(q))) return false
    if (filters.cats.length && !filters.cats.includes(b.category)) return false
    if (filters.minRating > 0 && (b.rating || 0) < filters.minRating) return false
    if (filters.openNow && !isOpenNow(b)) return false
    if (filters.hasContact && !b.whatsapp && !b.businessPhone) return false
    return true
  }).sort((a, b) =>
    sortBy === "rating" ? (b.rating || 0) - (a.rating || 0)
      : sortBy === "name" ? a.businessName.localeCompare(b.businessName) : 0
  )

  const totalActive = filters.cats.length + (filters.minRating > 0 ? 1 : 0) + (filters.openNow ? 1 : 0) + (filters.hasContact ? 1 : 0)
  const clearAll = () => setFilters({ cats: [], minRating: 0, openNow: false, hasContact: false })

  return (
    <>
      <style>{AUTH_CSS}</style>
      <style>{BUSCA_CSS}</style>

      {/* TOP BAR */}
      <div className="busca-topbar">
        <div className="busca-topbar-inner">
          <div className="busca-search-wrap">
            <Search size={16} color="rgba(255,255,255,0.35)" />
            <input className="busca-search-inp" type="search" placeholder="Busque por 'pizza', 'farmácia', 'salão'..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            {searchTerm && <button onClick={() => setSearchTerm("")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center" }}><X size={14} /></button>}
          </div>
          <select className="busca-sort-sel" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="relevance">Relevância</option>
            <option value="rating">Melhor Avaliação</option>
            <option value="name">Nome (A–Z)</option>
          </select>
          <button className={`busca-mob-btn ${totalActive > 0 ? "active" : ""}`} onClick={() => setDrawer(true)}>
            <Filter size={15} /> Filtros {totalActive > 0 && <span className="busca-badge">{totalActive}</span>}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div className={`busca-overlay ${drawer ? "on" : ""}`} onClick={() => setDrawer(false)} />
      <div className={`busca-drawer ${drawer ? "on" : ""}`}>
        <div className="busca-drawer-head">
          <span className="busca-drawer-title">Filtros {totalActive > 0 && <span style={{ color: "#00CCFF" }}>({totalActive})</span>}</span>
          <button className="busca-dclose" onClick={() => setDrawer(false)}><X size={16} /></button>
        </div>
        <div className="busca-drawer-body"><FiltersContent f={filters} setF={setF} /></div>
        <div className="busca-drawer-foot">
          <div style={{ display: "flex", gap: 8 }}>
            {totalActive > 0 && (
              <button onClick={clearAll} style={{ flex: 1, height: 40, borderRadius: 11, background: "#f4f1ec", border: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#5a6878", cursor: "pointer" }}>Limpar</button>
            )}
            <button className="busca-apply" style={{ flex: 2 }} onClick={() => setDrawer(false)}>
              Ver {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="busca-body">
        {/* SIDEBAR */}
        <aside className="busca-sidebar">
          <FiltersContent f={filters} setF={setF} />
          {totalActive > 0 && (
            <div className="busca-fsec">
              <button onClick={clearAll} style={{ width: "100%", height: 38, borderRadius: 11, background: "#f4f1ec", border: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#5a6878", cursor: "pointer" }}>
                Limpar todos os filtros
              </button>
            </div>
          )}
        </aside>

        {/* RESULTS */}
        <div className="busca-results">
          <div className="busca-rhead">
            <div className="busca-count">
              {loading ? "Buscando..." : <><strong>{filtered.length}</strong>resultado{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</>}
            </div>

          </div>



          {loading ? (
            <div className="busca-grid">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : filtered.length > 0 ? (
            <div className="busca-grid">
              {filtered.map(b => {
                const cc = CAT_MAP[b.category]?.color || "#00CCFF"
                const catLabel = CAT_MAP[b.category]?.label || b.category
                const open = isOpenNow(b)
                const hasHours = !!b.openingHours?.length
                return (
                  <Link href={`/estabelecimento/${b.id}`} key={b.id} className="busca-card">
                    <div className="busca-img">
                      {b.images?.[0] ? <img src={b.images[0]} alt={b.businessName} /> : <div className="busca-img-ph"><Store size={40} color="#c8c0b0" strokeWidth={1.5} /></div>}
                      {/* Category pill */}
                      <div style={{ position: "absolute", top: 10, left: 10, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", borderRadius: 100, padding: "3px 9px", border: `1px solid ${cc}40` }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: cc }} />
                        <span style={{ fontSize: "0.64rem", fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>{catLabel}</span>
                      </div>
                      {/* Open/Closed pill */}
                      {hasHours && (
                        <div style={{ position: "absolute", top: 10, right: 10, display: "inline-flex", alignItems: "center", gap: 4, background: open ? "rgba(34,197,94,0.82)" : "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", borderRadius: 100, padding: "3px 9px" }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: open ? "#fff" : "#ff7878" }} />
                          <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#fff" }}>{open ? "Aberto" : "Fechado"}</span>
                        </div>
                      )}
                    </div>
                    <div className="busca-cbody">
                      <div className="busca-cname">{b.businessName}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <Stars rating={b.rating} />
                        <span style={{ fontSize: "0.72rem", color: "#8a9aaa" }}>{b.rating && b.rating > 0 ? b.rating.toFixed(1) : "Sem avaliações"}</span>
                      </div>
                      <div className="busca-cdesc">{b.description?.substring(0, 90)}{(b.description?.length || 0) > 90 ? "..." : ""}</div>
                      <div className="busca-cfoot">
                        <div style={{ display: "flex", alignItems: "center", gap: 4, overflow: "hidden" }}>
                          <MapPin size={11} color="#00CCFF" style={{ flexShrink: 0 }} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.address?.split(",")[0]}</span>
                        </div>
                        {(b.whatsapp || b.businessPhone) && (
                          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                            <Phone size={10} color="#22c55e" />
                            <span style={{ color: "#22c55e", fontWeight: 600 }}>Contato</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="busca-empty">
              <div className="busca-empty-icon"><Search size={34} color="#c8c0b0" strokeWidth={1.5} /></div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#5a6878", marginBottom: 6 }}>Nenhum resultado encontrado</div>
              <div style={{ fontSize: "0.85rem", maxWidth: 320, margin: "0 auto 18px" }}>Tente ajustar os filtros ou buscar por outro termo.</div>
              {totalActive > 0 && (
                <button onClick={clearAll} style={{ padding: "9px 22px", background: "#002240", color: "#fff", border: "none", borderRadius: 12, fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>
                  Limpar todos os filtros
                </button>
              )}
            </div>
          )}
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
      <div className="busca-wrap">
        <Header title="Buscar Estabelecimentos" subtitle="Encontre o que você precisa no Novo Tempo" />
        <SearchResults />
      </div>
    </Suspense>
  )
}