"use client"

import { useState, useEffect, Suspense } from "react"
import {
  Search, MapPin, Star, Clock,
  Loader2, X, Store, Phone, Filter
} from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/navigation/header"
import { AUTH_CSS } from "../../components/Auth"

// 1. Tipagem atualizada para os campos do Cloudinary
type Business = {
  id: string; 
  businessName: string; 
  category: string;
  rating?: number; 
  address: string; 
  isPublic?: boolean;
  coverImage?: string;     // Cloudinary
  galleryImages?: string[]; // Cloudinary
  description: string;
  openingHours?: { day: string; opens: string; closes: string; isOpen: boolean }[];
  whatsapp?: string; 
  businessPhone?: string;
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

// CSS mantido e corrigido para hidratação
const BUSCA_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
.busca-wrap { font-family: 'DM Sans', sans-serif; }
.busca-topbar { position: sticky; top: 0; z-index: 80; background: #002240; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 12px 24px; }
.busca-topbar-inner { max-width: 1280px; margin: 0 auto; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.busca-search-wrap { flex: 1; min-width: 180px; display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 13px; padding: 0 14px; height: 46px; }
.busca-search-inp { flex: 1; background: transparent; border: none; outline: none; color: #ffffff; font-size: 0.875rem; }
.busca-sort-sel { height: 46px; padding: 0 14px; border-radius: 13px; background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.1); color: #ffffff; cursor: pointer; }
.busca-mob-btn { height: 46px; padding: 0 16px; border-radius: 13px; background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.1); color: #ffffff; display: none; align-items: center; gap: 7px; }
.busca-body { max-width:1280px; margin:0 auto; display:flex; gap:24px; padding:28px 24px 60px; }
.busca-sidebar { width:268px; flex-shrink:0; background:#fff; border-radius:20px; border:1px solid #f0ece5; box-shadow:0 2px 16px rgba(0,34,64,0.07); position:sticky; top:86px; max-height:calc(100vh - 110px); overflow-y:auto; }
.busca-fsec { padding:1rem 1.2rem; border-bottom:1px solid #f5f3f0; }
.busca-fsec-title { font-size:0.7rem; font-weight:800; letter-spacing:0.09em; text-transform:uppercase; color:#002240; }
.bcat { display:inline-flex; align-items:center; gap:5px; padding:5px 10px; border-radius:100px; cursor:pointer; font-size:0.71rem; font-weight:600; margin:0 4px 5px 0; border:1.5px solid #ede9e0; background:#faf8f5; }
.bcat.on { color:#fff; border-color:transparent; }
.btoggle { display:flex; align-items:center; justify-content:space-between; padding:8px 10px; border-radius:11px; cursor:pointer; margin-bottom:6px; }
.bswitch { width:34px; height:20px; border-radius:100px; background:#dde2e8; position:relative; }
.bswitch.on { background:#00CCFF; }
.bswitch::after { content:''; position:absolute; width:14px; height:14px; border-radius:50%; background:#fff; top:3px; left:3px; transition: 0.2s; }
.bswitch.on::after { transform:translateX(14px); }
.busca-results { flex:1; min-width:0; }
.busca-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(235px, 1fr)); gap:16px; }
.busca-card { background:#fff; border-radius:18px; border:1px solid #f0ece5; overflow:hidden; display:flex; flex-direction:column; transition: 0.2s; }
.busca-card:hover { transform:translateY(-5px); box-shadow:0 14px 36px rgba(0,34,64,0.12); }
.busca-img { height:155px; overflow:hidden; position:relative; background:#f4f1ec; }
.busca-img img { width:100%; height:100%; object-fit:cover; }
.busca-cbody { padding:1rem 1.1rem; flex:1; display:flex; flex-direction:column; }
.busca-cname { font-family:'Syne',sans-serif; font-size:0.95rem; font-weight:700; color:#002240; }
.bskel { background:linear-gradient(90deg,#f4f1ec 25%,#ede9e0 50%,#f4f1ec 75%); background-size:800px 100%; animation:busca-sh 1.4s infinite linear; }
@keyframes busca-sh { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
@media(max-width:900px) { .busca-sidebar { display:none; } .busca-mob-btn { display:flex; } }
`

// --- Componentes Auxiliares ---

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

function isOpenNow(b: Business): boolean {
  if (!b.openingHours?.length) return false
  const DAY_SHORTS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const DAY_FULL = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
  const i = new Date().getDay()
  const h = b.openingHours.find(x =>
    x.day?.toLowerCase().startsWith(DAY_SHORTS[i].toLowerCase()) ||
    DAY_FULL[i].toLowerCase().startsWith(x.day?.toLowerCase().slice(0, 3) || "_")
  )
  if (!h || !h.isOpen) return false
  const toMin = (t: string) => { const [hh, mm] = t.split(":").map(Number); return hh * 60 + mm }
  const now = new Date().getHours() * 60 + new Date().getMinutes()
  return now >= toMin(h.opens) && now < toMin(h.closes)
}

interface Filters { cats: string[]; minRating: number; openNow: boolean; hasContact: boolean }

function FiltersContent({ f, setF }: { f: Filters; setF: (fn: (prev: Filters) => Filters) => void }) {
  const toggleCat = (v: string) => setF(p => ({ ...p, cats: p.cats.includes(v) ? p.cats.filter(c => c !== v) : [...p.cats, v] }))

  return (
    <>
      <div className="busca-fsec">
        <div className="busca-fsec-head">
          <span className="busca-fsec-title">Categorias</span>
          {f.cats.length > 0 && <button className="busca-fsec-clear" onClick={() => setF(p => ({ ...p, cats: [] }))}>Limpar</button>}
        </div>
        <div>
          {CATEGORIES.map(c => (
            <button key={c.value} className={`bcat ${f.cats.includes(c.value) ? "on" : ""}`}
              style={f.cats.includes(c.value) ? { background: c.color } : {}}
              onClick={() => toggleCat(c.value)}>{c.label}</button>
          ))}
        </div>
      </div>
      <div className="busca-fsec">
        <div className="busca-fsec-head"><span className="busca-fsec-title">Avaliação Mínima</span></div>
        {[4, 3, 2].map(n => (
          <button key={n} className={`bstar-opt ${f.minRating === n ? "on" : ""}`}
            onClick={() => setF(p => ({ ...p, minRating: p.minRating === n ? 0 : n }))}>
            <Stars rating={n} size={13} /> <span className="bstar-lbl">{n}+ estrelas</span>
          </button>
        ))}
      </div>
    </>
  )
}

// --- Componente Principal de Busca ---

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

  const filtered = businesses.filter(b => {
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BUSCA_CSS }} />
      <div className="busca-topbar">
        <div className="busca-topbar-inner">
          <div className="busca-search-wrap">
            <Search size={16} color="#ffffff" />
            <input className="busca-search-inp" placeholder="O que você procura em Timon?"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button className="busca-mob-btn" onClick={() => setDrawer(true)}><Filter size={15} /> Filtros</button>
        </div>
      </div>

      <div className="busca-body">
        <aside className="busca-sidebar"><FiltersContent f={filters} setF={setFilters as any} /></aside>

        <div className="busca-results">
          <div className="busca-rhead">
            <div className="busca-count"><strong style={{ color: "#002240" }}>{filtered.length}</strong> resultados encontrados</div>
          </div>

          <div className="busca-grid">
            {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="bskel" style={{ height: 280, borderRadius: 18 }} />) : 
              filtered.map(b => {
                const displayImg = b.coverImage || (b.galleryImages?.[0]);
                const open = isOpenNow(b);
                return (
                  <Link href={`/estabelecimento/${b.id}`} key={b.id} className="busca-card">
                    <div className="busca-img">
                      {displayImg ? <img src={displayImg} alt={b.businessName} /> : <div className="busca-img-ph"><Store size={40} color="#c8c0b0" /></div>}
                      <div style={{ position: "absolute", top: 10, right: 10, background: open ? "#22c55e" : "#002240", padding: "3px 8px", borderRadius: 10, color: "#fff", fontSize: "0.6rem", fontWeight: 700 }}>
                        {open ? "ABERTO" : "FECHADO"}
                      </div>
                    </div>
                    <div className="busca-cbody">
                      <div className="busca-cname">{b.businessName}</div>
                      <Stars rating={b.rating} />
                      <div className="busca-cdesc" style={{ color: "#002240" }}>{b.description?.substring(0, 80)}...</div>
                      <div className="busca-cfoot" style={{ color: "#002240" }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {b.address?.split(',')[0]}</span>
                        {b.whatsapp && <Phone size={12} color="#22c55e" />}
                      </div>
                    </div>
                  </Link>
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default function BuscaPage() {
  return (
    <Suspense fallback={<div className="busca-loading"><Loader2 className="animate-spin" /></div>}>
      <div className="busca-wrap">
        <Header title="Busca" />
        <SearchResults />
      </div>
    </Suspense>
  )
}