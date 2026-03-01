"use client"

import type React from "react"
import { Search, MapPin, Loader2, Star, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

interface SearchResult {
  id: string
  businessName: string
  category: string
  address: string
  rating: number
}

interface SearchBarProps {
  placeholder?: string
  className?: string
}

const CATEGORY_COLORS: Record<string, string> = {
  restaurante: "#FF7043",
  comercio: "#00CCFF",
  servicos: "#F7B000",
  saude: "#E91E8C",
  automotivo: "#8B5CF6",
  casa: "#22c55e",
}

export function SearchBar({ placeholder = "Busque por estabelecimentos...", className = "" }: SearchBarProps) {
  const [queryText, setQueryText] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [allBusinesses, setAllBusinesses] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [focused, setFocused] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchAllBusinesses = async () => {
      try {
        const businessesCollection = collection(db, "businesses")
        const q = query(businessesCollection, where("isPublic", "==", true))
        const businessSnapshot = await getDocs(q)
        const businessesList = businessSnapshot.docs.map(doc => ({
          id: doc.id,
          businessName: doc.data().businessName,
          category: doc.data().category,
          address: doc.data().address,
          rating: doc.data().rating || 0,
        })) as SearchResult[]
        setAllBusinesses(businessesList)
      } catch (error) {
        console.error("Erro ao buscar negócios:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAllBusinesses()
  }, [])

  useEffect(() => {
    if (queryText.length > 2) {
      const lq = queryText.toLowerCase()
      const filtered = allBusinesses.filter(item =>
        (item.businessName?.toLowerCase() || '').includes(lq) ||
        (item.category?.toLowerCase() || '').includes(lq)
      ).slice(0, 5)
      setResults(filtered)
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  }, [queryText, allBusinesses])

  const handleSearch = () => {
    if (queryText.trim()) router.push(`/busca?q=${encodeURIComponent(queryText)}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const handleBlur = () => setTimeout(() => { setShowResults(false); setFocused(false) }, 200)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Sans:wght@400;500&display=swap');

        .sb-wrap {
          position: relative;
          z-index: 50;
          font-family: 'DM Sans', sans-serif;
        }

        .sb-field {
          position: relative;
          display: flex; align-items: center;
        }

        .sb-input {
          width: 100%; height: 56px;
          padding: 0 148px 0 50px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          color: #fff;
          font-size: 0.97rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .sb-input::placeholder { color: rgba(255,255,255,0.35); }

        .sb-input:focus {
          border-color: rgba(247,176,0,0.6);
          background: rgba(255,255,255,0.13);
        }

        .sb-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%); pointer-events: none;
          transition: color 0.2s;
        }

        .sb-btn {
          position: absolute; right: 8px; top: 50%;
          transform: translateY(-50%);
          height: 40px; padding: 0 20px;
          background: #F7B000; color: #002240;
          border: none; border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 0.85rem;
          cursor: pointer; display: flex; align-items: center; gap: 6px;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(247,176,0,0.3);
          white-space: nowrap;
        }

        .sb-btn:hover {
          transform: translateY(-50%) scale(1.04);
          box-shadow: 0 6px 20px rgba(247,176,0,0.45);
        }

        /* Dropdown */
        .sb-dropdown {
          position: absolute; top: calc(100% + 8px);
          left: 0; right: 0;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 20px 60px rgba(0,34,64,0.18);
          border: 1px solid rgba(0,0,0,0.06);
          overflow: hidden;
          z-index: 100;
        }

        .sb-loading {
          padding: 1.2rem; text-align: center;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 0.85rem; color: #8a9aaa;
        }

        .sb-result {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 16px;
          border-bottom: 1px solid #f5f3f0;
          text-decoration: none;
          transition: background 0.15s;
          cursor: pointer;
        }

        .sb-result:last-of-type { border-bottom: none; }
        .sb-result:hover { background: #fdfbf8; }

        .sb-result-left { flex: 1; min-width: 0; padding-right: 12px; }

        .sb-result-name {
          font-weight: 600; font-size: 0.9rem;
          color: #1a2a3a; margin-bottom: 5px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          transition: color 0.15s;
        }

        .sb-result:hover .sb-result-name { color: #002240; }

        .sb-result-meta {
          display: flex; align-items: center; gap: 8px;
        }

        .sb-cat-badge {
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.07em; text-transform: uppercase;
          padding: 2px 8px; border-radius: 100px;
        }

        .sb-result-addr {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.75rem; color: #8a9aaa;
          overflow: hidden;
        }

        .sb-result-addr span {
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .sb-rating {
          display: flex; align-items: center; gap: 4px;
          background: #fffbec;
          border: 1px solid #fde68a;
          padding: 4px 9px; border-radius: 8px;
          flex-shrink: 0;
        }

        .sb-rating-num {
          font-size: 0.78rem; font-weight: 700; color: #b45309;
        }

        /* Footer */
        .sb-footer {
          background: #faf8f5;
          border-top: 1px solid #f0ece5;
          padding: 8px;
        }

        .sb-footer-btn {
          width: 100%; padding: 9px;
          background: none; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.83rem; font-weight: 600;
          color: #002240; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          border-radius: 10px;
          transition: background 0.15s, color 0.15s;
        }

        .sb-footer-btn:hover {
          background: rgba(0,34,64,0.05);
          color: #00CCFF;
        }

        .sb-empty {
          padding: 1.5rem; text-align: center;
          font-size: 0.85rem; color: #8a9aaa;
        }
      `}</style>

      <div className={`sb-wrap ${className}`}>
        <div className="sb-field">
          <Search
            size={19}
            className="sb-icon"
            color={focused ? "#F7B000" : "rgba(255,255,255,0.4)"}
          />
          <input
            className="sb-input"
            type="text"
            placeholder={placeholder}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => { setFocused(true); queryText.length > 2 && setShowResults(true) }}
            onBlur={handleBlur}
          />
          <button className="sb-btn" onClick={handleSearch}>
            Buscar <ArrowRight size={13} />
          </button>
        </div>

        {showResults && (
          <div className="sb-dropdown">
            {isLoading ? (
              <div className="sb-loading">
                <Loader2 size={15} color="#00CCFF" style={{ animation: "spin 1s linear infinite" }} />
                Carregando...
              </div>
            ) : results.length > 0 ? (
              <>
                {results.map((result) => {
                  const catColor = CATEGORY_COLORS[result.category] || "#00CCFF"
                  return (
                    <Link key={result.id} href={`/estabelecimento/${result.id}`} className="sb-result">
                      <div className="sb-result-left">
                        <div className="sb-result-name">{result.businessName}</div>
                        <div className="sb-result-meta">
                          <span
                            className="sb-cat-badge"
                            style={{ background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}35` }}
                          >
                            {result.category}
                          </span>
                          <div className="sb-result-addr">
                            <MapPin size={10} color="#b0bec5" />
                            <span>{result.address}</span>
                          </div>
                        </div>
                      </div>
                      {result.rating > 0 && (
                        <div className="sb-rating">
                          <Star size={11} color="#F59E0B" fill="#F59E0B" />
                          <span className="sb-rating-num">{result.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </Link>
                  )
                })}
                <div className="sb-footer">
                  <button className="sb-footer-btn" onClick={handleSearch}>
                    Ver todos os resultados <ArrowRight size={13} />
                  </button>
                </div>
              </>
            ) : (
              <div className="sb-empty">
                Nenhum estabelecimento encontrado para <strong>"{queryText}"</strong>.
              </div>
            )}
          </div>
        )}

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  )
}