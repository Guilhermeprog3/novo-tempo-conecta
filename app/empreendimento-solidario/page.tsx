"use client"

import { useState, useEffect } from "react"
import { Users, MapPin, Store, ArrowRight, ShieldCheck, Search, Sparkles, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

type Business = {
  id: string;
  businessName: string;
  address: string;
  category: string;
  description: string;
  rating?: number;
  images?: string[];
  isPublic?: boolean;
};

export default function EmpreendimentoSolidarioPage() {
  const [solidaryBusinesses, setSolidaryBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolidary = async () => {
      try {
        const businessesRef = collection(db, "businesses");
        const q = query(
          businessesRef,
          where("isPublic", "==", true),
          where("category", "==", "solidario")
        );
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Business[];
        setSolidaryBusinesses(list);
        setFilteredBusinesses(list);
      } catch (error) {
        console.error("Erro ao buscar empreendimentos solidários:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSolidary();
  }, []);

  useEffect(() => {
    const results = solidaryBusinesses.filter(business =>
      business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBusinesses(results);
  }, [searchTerm, solidaryBusinesses]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .solidario-page {
          font-family: 'DM Sans', sans-serif;
          --navy: #002240;
          --gold: #F7B000;
          --cyan: #00CCFF;
          --rose: #FF4D6D;
          --bg: #F4F1EC;
        }

        .hero-section {
          background: var(--navy);
          position: relative;
          overflow: hidden;
          padding: 7rem 1.5rem 5rem;
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          pointer-events: none;
        }

        .hero-orb-1 {
          width: 500px; height: 500px;
          background: var(--cyan);
          top: -150px; right: -100px;
        }

        .hero-orb-2 {
          width: 400px; height: 400px;
          background: var(--gold);
          bottom: -200px; left: -80px;
        }

        .hero-grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(247,176,0,0.15);
          border: 1px solid rgba(247,176,0,0.4);
          color: var(--gold);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.4rem, 6vw, 4.2rem);
          line-height: 1.05;
          color: #fff;
          margin-bottom: 1.2rem;
        }

        .hero-title span {
          color: var(--gold);
        }

        .hero-subtitle {
          color: #FFFFFF; /* Trocado para Branco */
          font-size: 1.1rem;
          font-weight: 300;
          max-width: 520px;
          line-height: 1.7;
          margin: 0 auto 2.5rem;
          opacity: 0.9;
        }

        .search-wrap {
          position: relative;
          max-width: 520px;
          margin: 0 auto;
        }

        .search-wrap svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #FFFFFF; /* Trocado para Branco */
          width: 18px;
          height: 18px;
          transition: color 0.2s;
          opacity: 0.6;
        }

        .search-wrap:focus-within svg {
          color: var(--gold);
          opacity: 1;
        }

        .search-input {
          width: 100%;
          height: 54px;
          padding: 0 20px 0 48px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 14px;
          color: #fff;
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .search-input::placeholder { color: rgba(255,255,255,0.6); } /* Placeholder mais visível */
        .search-input:focus {
          border-color: var(--gold);
          background: rgba(255,255,255,0.12);
        }

        .hero-stats {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin-top: 3rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: var(--gold);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #FFFFFF; /* Trocado para Branco */
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 4px;
          opacity: 0.8;
        }

        .stat-divider {
          width: 1px;
          background: rgba(255,255,255,0.2);
          align-self: stretch;
        }

        /* Main content */
        .main-content {
          background: var(--bg);
          flex: 1;
          padding: 4rem 1.5rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2.5rem;
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--navy);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .count-badge {
          background: var(--navy);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 5px 14px;
          border-radius: 100px;
          letter-spacing: 0.04em;
        }

        /* Card grid */
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.75rem;
        }

        /* Business card */
        .biz-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
          box-shadow: 0 2px 12px rgba(0,34,64,0.07);
          cursor: pointer;
          text-decoration: none;
        }

        .biz-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0,34,64,0.14);
        }

        .card-image-wrap {
          position: relative;
          height: 210px;
          overflow: hidden;
          background: #e8e4dd;
        }

        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .biz-card:hover .card-image-wrap img {
          transform: scale(1.06);
        }

        .card-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #e8e4dd 0%, #d5d0c8 100%);
        }

        .card-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: var(--gold);
          color: var(--navy);
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 11px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,34,64,0.5) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .biz-card:hover .card-overlay { opacity: 1; }

        .card-body {
          padding: 1.4rem 1.5rem 1.6rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 6px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          transition: color 0.2s;
        }

        .biz-card:hover .card-title { color: #006699; }

        .card-address {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem;
          color: #5a6878;
          margin-bottom: 0.9rem;
        }

        .card-desc {
          font-size: 0.88rem;
          color: #334155;
          line-height: 1.65;
          flex: 1;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          margin-bottom: 1.1rem;
        }

        .card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--cyan);
          transition: gap 0.2s;
        }

        .biz-card:hover .card-cta { gap: 10px; }

        .card-cta svg {
          transition: transform 0.2s;
        }

        .biz-card:hover .card-cta svg { transform: translateX(3px); }

        /* Skeleton */
        .skeleton-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,34,64,0.07);
        }

        .skeleton-img {
          height: 210px;
          background: linear-gradient(90deg, #eee 0%, #f5f5f5 50%, #eee 100%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        .skeleton-line {
          border-radius: 8px;
          background: linear-gradient(90deg, #eee 0%, #f5f5f5 50%, #eee 100%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Empty state */
        .empty-state {
          grid-column: 1 / -1;
          padding: 5rem 2rem;
          text-align: center;
          border: 2px dashed #d5d0c8;
          border-radius: 24px;
          background: rgba(255,255,255,0.5);
        }

        .empty-icon-wrap {
          width: 80px;
          height: 80px;
          background: #f0ece5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.2rem;
        }

        .page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg);
        }

        @media (max-width: 640px) {
          .hero-stats { gap: 1.2rem; }
          .stat-number { font-size: 1.5rem; }
          .card-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page-wrapper solidario-page">
        <Header />

        {/* ── HERO ── */}
        <section className="hero-section">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid-lines" />

          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <div className="hero-tag">
              <Users size={13} fill="currentColor" />
              Comunidade · Impacto · Futuro
            </div>

            <h1 className="hero-title">
              Empreendimentos<br />
              <span>Econômicos Solidários</span>
            </h1>

            <p className="hero-subtitle">
              Apoie iniciativas locais que transformam o Novo Tempo. 
              Negócios com impacto social, sustentabilidade e colaboração comunitária.
            </p>

            <div className="search-wrap">
              <Search />
              <input
                className="search-input"
                type="text"
                placeholder="Buscar iniciativas solidárias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {!loading && (
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">{solidaryBusinesses.length}</div>
                  <div className="stat-label">Iniciativas</div>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Verificadas</div>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <div className="stat-number">Local</div>
                  <div className="stat-label">Impacto</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── LISTINGS ── */}
        <main className="main-content">
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="section-header">
              <h2 className="section-title">
                <ShieldCheck size={20} color="var(--cyan)" />
                {searchTerm ? `Resultados para "${searchTerm}"` : "Negócios Certificados"}
              </h2>
              <span className="count-badge">{filteredBusinesses.length} Iniciativas</span>
            </div>

            <div className="card-grid">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div className="skeleton-card" key={i}>
                    <div className="skeleton-img" style={{ animationDelay: `${i * 0.1}s` }} />
                    <div style={{ padding: "1.4rem 1.5rem", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div className="skeleton-line" style={{ height: 22, width: "70%" }} />
                      <div className="skeleton-line" style={{ height: 14, width: "45%" }} />
                      <div className="skeleton-line" style={{ height: 14, width: "100%" }} />
                      <div className="skeleton-line" style={{ height: 14, width: "90%" }} />
                      <div className="skeleton-line" style={{ height: 14, width: "75%" }} />
                    </div>
                  </div>
                ))
              ) : filteredBusinesses.length > 0 ? (
                filteredBusinesses.map((business) => (
                  <Link href={`/estabelecimento/${business.id}`} key={business.id} style={{ textDecoration: "none" }}>
                    <article
                      className="biz-card"
                      onMouseEnter={() => setHoveredId(business.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div className="card-image-wrap">
                        {business.images && business.images.length > 0 ? (
                          <img src={business.images[0]} alt={business.businessName} />
                        ) : (
                          <div className="card-image-placeholder">
                            <Store size={40} color="#b0a898" />
                          </div>
                        )}
                        <div className="card-overlay" />
                        <div className="card-badge">
                          <Users size={10} fill="currentColor" />
                          Solidário
                        </div>
                      </div>

                      <div className="card-body">
                        <h3 className="card-title">{business.businessName}</h3>
                        <div className="card-address">
                          <MapPin size={12} />
                          {business.address}
                        </div>
                        <p className="card-desc">{business.description}</p>
                        <div className="card-cta">
                          Ver detalhes <ArrowRight size={15} />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon-wrap">
                    <Store size={32} color="#b0a898" />
                  </div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#3a4a5a", marginBottom: "6px" }}>
                    Nenhum resultado encontrado
                  </h3>
                  <p style={{ color: "#8a9aaa", fontSize: "0.9rem" }}>
                    Tente buscar por outro termo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}