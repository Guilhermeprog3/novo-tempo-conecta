"use client"

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Search, MapPin, Star, ChevronDown, Loader2, SlidersHorizontal, X, Map } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { LatLng } from 'leaflet'

const MapComponent = dynamic(
  () => import("./MapComponent"),
  {
    ssr: false,
    loading: () => (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#001830", gap: 12 }}>
        <Loader2 size={32} color="#00CCFF" style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ color: "#ffffff", fontSize: "0.85rem" }}>A carregar mapa...</span>
      </div>
    )
  }
)

type Business = {
  id: string;
  businessName: string;
  address: string;
  category: string;
  rating?: number;
  isOpen?: boolean;
  isPublic?: boolean;
  location: { latitude: number; longitude: number; };
};

const CATEGORY_COLORS: Record<string, string> = {
  restaurante: "#FF7043",
  comercio: "#00CCFF",
  mercado: "#4ade80",
  saude: "#E91E8C",
  beleza: "#8B5CF6",
  servicos: "#F7B000",
  educacao: "#3b82f6",
  construcao: "#94a3b8",
  automotivo: "#06b6d4",
  pet: "#10b981",
  tecnologia: "#6366f1",
  moda: "#a855f7",
  lazer: "#ec4899",
  solidario: "#ef4444",
  outro: "#64748b",
};

const MAPA_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .mapa-page {
    font-family: 'DM Sans', sans-serif;
    --navy: #002240;
    --navy2: #001830;
    --gold: #F7B000;
    --cyan: #00CCFF;
    --bg: #F4F1EC;
  }

  .mapa-layout {
    display: flex;
    height: calc(100vh - 72px);
    overflow: hidden;
  }

  .mapa-sidebar {
    width: 360px;
    flex-shrink: 0;
    background: var(--navy);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid rgba(0,204,255,0.1);
  }

  .mapa-sidebar-top { padding: 1.5rem 1.5rem 0; flex-shrink: 0; }
  .mapa-sidebar-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1.4rem; }
  .mapa-sidebar-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(0,204,255,0.12);
    border: 1px solid rgba(0,204,255,0.2);
    display: flex; align-items: center; justify-content: center;
  }

  .mapa-sidebar-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.15rem; color: #fff; }
  .mapa-sidebar-count {
    margin-left: auto; background: rgba(247,176,0,0.15);
    border: 1px solid rgba(247,176,0,0.3);
    color: #F7B000; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 3px 10px; border-radius: 100px;
  }

  .mapa-search-wrap { position: relative; margin-bottom: 0.75rem; }
  .mapa-search-wrap svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); pointer-events: none; }
  .mapa-search-input {
    width: 100%; height: 44px; padding: 0 14px 0 40px;
    background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 12px; color: #fff; font-size: 0.88rem; outline: none;
  }
  .mapa-search-input::placeholder { color: #ffffff; opacity: 0.5; }

  .mapa-filter-btn {
    width: 100%; height: 40px; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
    display: flex; align-items: center; padding: 0 14px; cursor: pointer;
    color: #ffffff; font-size: 0.85rem; margin-bottom: 0.75rem;
  }

  .mapa-filter-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 14px; margin-bottom: 0.75rem; }
  .mapa-filter-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: #ffffff; margin-bottom: 10px; }
  .mapa-cat-chips { display: flex; flex-wrap: wrap; gap: 7px; max-height: 150px; overflow-y: auto; padding-right: 5px; }
  .mapa-cat-chip { padding: 5px 12px; border-radius: 100px; font-size: 0.78rem; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #ffffff; cursor: pointer; }
  .mapa-cat-chip.active { background: rgba(0,204,255,0.15); border-color: rgba(0,204,255,0.4); color: #00CCFF; }

  .mapa-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 0.75rem 0; }
  .mapa-results { flex: 1; overflow-y: auto; padding: 0 1.5rem 1.5rem; }
  .mapa-biz-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 14px 16px; margin-bottom: 10px; cursor: pointer; }
  .mapa-biz-name { font-family: 'Syne', sans-serif; font-size: 0.92rem; font-weight: 700; color: #fff; }
  .mapa-biz-rating { display: flex; align-items: center; gap: 4px; background: rgba(247,176,0,0.1); border: 1px solid rgba(247,176,0,0.2); padding: 3px 7px; border-radius: 7px; }
  .mapa-biz-rating-num { font-size: 0.72rem; font-weight: 700; color: #F7B000; }
  .mapa-biz-addr { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: #ffffff; margin-bottom: 8px; }
  .mapa-biz-cat { display: inline-block; padding: 2px 9px; border-radius: 100px; font-size: 0.67rem; font-weight: 700; text-transform: uppercase; }

  .mapa-map { flex: 1; position: relative; display: none; }
  @media (min-width: 1024px) { .mapa-map { display: block; } }
  @media (max-width: 640px) { .mapa-sidebar { width: 100%; } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

export default function MapaPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy] = useState("relevancia")
  const [allEstablishments, setAllEstablishments] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [userPosition, setUserPosition] = useState<LatLng | null>(null)

  const categories = [
    { value: "restaurante", label: "Gastronomia" },
    { value: "comercio", label: "Loja e Varejo" },
    { value: "mercado", label: "Mercados" },
    { value: "saude", label: "Saúde" },
    { value: "beleza", label: "Beleza" },
    { value: "servicos", label: "Serviços" },
    { value: "educacao", label: "Educação" },
    { value: "construcao", label: "Construção" },
    { value: "automotivo", label: "Automotivo" },
    { value: "pet", label: "Pet Shop" },
    { value: "tecnologia", label: "Tecnologia" },
    { value: "moda", label: "Moda" },
    { value: "lazer", label: "Lazer" },
    { value: "solidario", label: "Solidário" },
    { value: "outro", label: "Outros" },
  ]

  useEffect(() => {
    setIsMounted(true)
    const fetchBusinesses = async () => {
      try {
        const businessesRef = collection(db, "businesses")
        const q = query(businessesRef, where("isPublic", "==", true))
        const querySnapshot = await getDocs(q)
        setAllEstablishments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Business[])
      } catch (error) {
        console.error("Erro ao procurar empresas: ", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBusinesses()
  }, [])

  const sortedEstablishments = allEstablishments
    .filter((e) => {
      const matchesSearch = (e.businessName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || (e.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(e.category)
      return matchesSearch && matchesCategory
    })

  const toggleCategory = (val: string) => {
    setSelectedCategories(prev => prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val])
  }

  return (
    <>
      {isMounted && <style dangerouslySetInnerHTML={{ __html: MAPA_STYLES }} />}

      <div className="mapa-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />

        <main className="mapa-layout">
          <aside className="mapa-sidebar">
            <div className="mapa-sidebar-top">
              <div className="mapa-sidebar-header">
                <div className="mapa-sidebar-icon"><Map size={17} color="#00CCFF" /></div>
                <span className="mapa-sidebar-title">Mapa Interativo</span>
                <span className="mapa-sidebar-count">{sortedEstablishments.length}</span>
              </div>

              <div className="mapa-search-wrap">
                <Search size={15} color="#ffffff" />
                <input className="mapa-search-input" placeholder="Buscar estabelecimento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>

              <button className="mapa-filter-btn" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal size={14} style={{ marginRight: 7 }} />
                Filtrar por categoria
                {selectedCategories.length > 0 && (
                  <span style={{ marginLeft: 6, background: "rgba(0,204,255,0.2)", color: "#00CCFF", fontSize: "0.7rem", padding: "1px 7px", borderRadius: "100px", fontWeight: 700 }}>
                    {selectedCategories.length}
                  </span>
                )}
                <ChevronDown size={14} style={{ transform: showFilters ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>

              {showFilters && (
                <div className="mapa-filter-panel">
                  <div className="mapa-filter-label">Categorias</div>
                  <div className="mapa-cat-chips">
                    {categories.map(cat => (
                      <button key={cat.value} className={`mapa-cat-chip ${selectedCategories.includes(cat.value) ? "active" : ""}`} onClick={() => toggleCategory(cat.value)}>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                  {selectedCategories.length > 0 && (
                    <button onClick={() => setSelectedCategories([])} style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "#ffffff", fontSize: "0.75rem" }}>
                      <X size={11} /> Limpar filtros
                    </button>
                  )}
                </div>
              )}
              <div className="mapa-divider" />
            </div>

            <div className="mapa-results">
              {loading ? (
                <div style={{ color: '#fff', padding: '1rem', textAlign: 'center' }}>Carregando...</div>
              ) : (
                sortedEstablishments.map((est) => (
                  <div className="mapa-biz-card" key={est.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div className="mapa-biz-name">{est.businessName}</div>
                      {est.rating && <div className="mapa-biz-rating"><Star size={10} color="#F7B000" fill="#F7B000" /><span className="mapa-biz-rating-num">{est.rating.toFixed(1)}</span></div>}
                    </div>
                    <div className="mapa-biz-addr"><MapPin size={11} color="#00CCFF" /> {est.address}</div>
                    <span className="mapa-biz-cat" style={{ background: `${CATEGORY_COLORS[est.category] || "#00CCFF"}18`, color: CATEGORY_COLORS[est.category] || "#00CCFF" }}>{est.category}</span>
                  </div>
                ))
              )}
            </div>
          </aside>

          <div className="mapa-map">
            <MapComponent businesses={sortedEstablishments} userPosition={userPosition} setUserPosition={setUserPosition} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}