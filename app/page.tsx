"use client"

import { useState, useEffect } from "react"
import { MapPin, Star, Store, Utensils, Wrench, Heart, Clock, ShieldCheck, ArrowRight, Sparkles, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { SearchBar } from "@/components/search-bar"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, limit, where } from "firebase/firestore"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { motion } from "framer-motion"

type Business = {
  id: string;
  businessName: string;
  address: string;
  category: string;
  description: string;
  rating?: number;
  hours?: string;
  images?: string[];
  isPublic?: boolean;
  isFeatured?: boolean;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] } }),
};

export default function HomePage() {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [stats, setStats] = useState({ businessCount: 0 });
  const [loading, setLoading] = useState(true);

  const categoryLinks = [
    { name: "Restaurantes", value: "restaurante", icon: Utensils, color: "#FF7043" },
    { name: "Comércio", value: "comercio", icon: Store, color: "#00CCFF" },
    { name: "Serviços", value: "servicos", icon: Wrench, color: "#F7B000" },
    { name: "Saúde", value: "saude", icon: Heart, color: "#E91E8C" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessesCollection = collection(db, "businesses");
        const publicQuery = query(businessesCollection, where("isPublic", "==", true));
        const allBusinessSnapshot = await getDocs(publicQuery);
        setStats({ businessCount: allBusinessSnapshot.size });

        const featuredQuery = query(
          businessesCollection,
          where("isPublic", "==", true),
          where("isFeatured", "==", true),
          limit(3)
        );
        const featuredSnapshot = await getDocs(featuredQuery);
        const businessesList = featuredSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Business[];
        setFeaturedBusinesses(businessesList);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderStars = (rating: number = 0) => (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} style={{
          width: 13, height: 13,
          color: star <= Math.round(rating) ? "#F7B000" : "rgba(255,255,255,0.2)",
          fill: star <= Math.round(rating) ? "#F7B000" : "transparent"
        }} />
      ))}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .hp {
          --navy: #002240;
          --gold: #F7B000;
          --cyan: #00CCFF;
          --rose: #E91E8C;
          --bg: #F4F1EC;
          --card-bg: #fff;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── HERO ── */
        .hp-hero {
          background: var(--navy);
          position: relative;
          overflow: hidden;
          padding: 6rem 1.5rem 5rem;
        }

        .hp-hero-orb1 {
          position: absolute; border-radius: 50%; pointer-events: none;
          width: 600px; height: 600px;
          background: var(--cyan); opacity: 0.12; filter: blur(90px);
          top: -200px; right: -150px;
        }

        .hp-hero-orb2 {
          position: absolute; border-radius: 50%; pointer-events: none;
          width: 500px; height: 500px;
          background: var(--gold); opacity: 0.1; filter: blur(90px);
          bottom: -200px; left: -100px;
        }

        .hp-hero-orb3 {
          position: absolute; border-radius: 50%; pointer-events: none;
          width: 300px; height: 300px;
          background: var(--rose); opacity: 0.08; filter: blur(60px);
          top: 50%; left: 40%;
        }

        .hp-hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        .hp-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(0,204,255,0.12);
          border: 1px solid rgba(0,204,255,0.3);
          color: var(--cyan);
          padding: 6px 14px; border-radius: 100px;
          font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.09em; text-transform: uppercase;
          margin-bottom: 1.4rem;
        }

        .hp-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          line-height: 1.05; color: #fff;
          margin-bottom: 1.2rem;
        }

        .hp-title em { font-style: normal; color: var(--cyan); }

        .hp-subtitle {
          color: rgba(255,255,255,0.6);
          font-size: 1.1rem; font-weight: 300;
          max-width: 560px; margin: 0 auto 2.5rem;
          line-height: 1.75;
        }

        .hp-search-wrap {
          max-width: 600px; margin: 0 auto 2.5rem;
        }

        /* Category pills */
        .hp-cats {
          display: flex; flex-wrap: wrap;
          justify-content: center; gap: 10px;
          margin-bottom: 3.5rem;
        }

        .hp-cat-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 100px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.85);
          font-size: 0.87rem; font-weight: 500;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }

        .hp-cat-pill:hover {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.3);
          color: #fff;
        }

        .hp-cta-solid {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--gold); color: var(--navy);
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 0.95rem;
          padding: 14px 28px; border-radius: 14px;
          text-decoration: none; border: none; cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
          box-shadow: 0 8px 30px rgba(247,176,0,0.3);
          margin-bottom: 3rem;
        }

        .hp-cta-solid:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 14px 40px rgba(247,176,0,0.45);
        }

        /* Stats bar */
        .hp-stats {
          display: flex; justify-content: center;
          gap: 0; border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 2.5rem;
        }

        .hp-stat {
          text-align: center; padding: 0 2.5rem;
          border-right: 1px solid rgba(255,255,255,0.08);
        }

        .hp-stat:last-child { border-right: none; }

        .hp-stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 2.2rem; font-weight: 800;
          color: var(--gold); line-height: 1;
        }

        .hp-stat-label {
          font-size: 0.72rem; letter-spacing: 0.08em;
          text-transform: uppercase; color: rgba(255,255,255,0.4);
          margin-top: 5px;
        }

        /* ── PILLARS ── */
        .hp-pillars {
          background: #fff; padding: 4.5rem 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .hp-pillars-grid {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 2px; background: #f0ece5; border-radius: 20px; overflow: hidden;
        }

        .hp-pillar {
          background: #fff; padding: 2.2rem 2rem;
          display: flex; flex-direction: column; gap: 1rem;
          transition: background 0.2s;
        }

        .hp-pillar:hover { background: #fdfbf8; }

        .hp-pillar-icon {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
        }

        .hp-pillar-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem; font-weight: 700;
          color: var(--navy);
        }

        .hp-pillar-desc {
          font-size: 0.875rem; color: #7a8a9a;
          line-height: 1.65;
        }

        /* ── FEATURED ── */
        .hp-featured {
          background: var(--bg); padding: 5rem 1.5rem;
        }

        .hp-section-header {
          max-width: 1100px; margin: 0 auto 3rem;
          display: flex; align-items: flex-end; justify-content: space-between;
        }

        .hp-section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.7rem, 3.5vw, 2.2rem);
          font-weight: 800; color: var(--navy);
          line-height: 1.1;
        }

        .hp-section-sub {
          font-size: 0.9rem; color: #8a9aaa;
          margin-top: 6px; font-weight: 300;
        }

        .hp-view-all {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.85rem; font-weight: 600;
          color: var(--cyan); text-decoration: none;
          transition: gap 0.2s;
          white-space: nowrap;
        }

        .hp-view-all:hover { gap: 10px; }

        .hp-cards {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.75rem;
        }

        /* Featured card */
        .feat-card {
          background: var(--navy);
          border-radius: 22px; overflow: hidden;
          display: flex; flex-direction: column;
          text-decoration: none;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
          box-shadow: 0 4px 20px rgba(0,34,64,0.15);
        }

        .feat-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 24px 60px rgba(0,34,64,0.25);
        }

        .feat-img-wrap {
          position: relative; height: 200px; overflow: hidden;
          background: rgba(255,255,255,0.05);
        }

        .feat-img-wrap img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s ease;
        }

        .feat-card:hover .feat-img-wrap img { transform: scale(1.07); }

        .feat-no-img {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
        }

        .feat-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,34,64,0.7) 0%, transparent 50%);
          opacity: 0; transition: opacity 0.3s;
        }

        .feat-card:hover .feat-overlay { opacity: 1; }

        .feat-solidario-badge {
          position: absolute; top: 12px; right: 12px;
          background: var(--gold); color: var(--navy);
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.07em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 100px;
        }

        .feat-body {
          padding: 1.4rem 1.5rem 1.6rem;
          flex: 1; display: flex; flex-direction: column;
        }

        .feat-head {
          display: flex; justify-content: space-between;
          align-items: flex-start; gap: 12px; margin-bottom: 0.8rem;
        }

        .feat-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem; font-weight: 700;
          color: #fff; line-height: 1.2;
        }

        .feat-rating-num {
          font-size: 0.7rem; color: rgba(255,255,255,0.45);
          margin-top: 3px; text-align: right;
        }

        .feat-addr {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.8rem; color: rgba(255,255,255,0.5);
          margin-bottom: 0.8rem;
        }

        .feat-desc {
          font-size: 0.875rem; color: rgba(255,255,255,0.65);
          line-height: 1.65; flex: 1; margin-bottom: 1.2rem;
          overflow: hidden; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }

        .feat-footer {
          display: flex; align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .feat-hours {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.78rem; color: rgba(255,255,255,0.45);
        }

        .feat-cta {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.82rem; font-weight: 600;
          color: var(--cyan); transition: gap 0.2s;
        }

        .feat-card:hover .feat-cta { gap: 10px; }

        /* Skeleton */
        .sk-card {
          background: var(--navy);
          border-radius: 22px; overflow: hidden;
        }

        .sk-img {
          height: 200px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%);
          background-size: 200% 100%;
          animation: sk-shine 1.4s infinite;
        }

        .sk-line {
          border-radius: 6px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%);
          background-size: 200% 100%;
          animation: sk-shine 1.4s infinite;
        }

        @keyframes sk-shine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Empty */
        .hp-empty {
          grid-column: 1 / -1;
          text-align: center; padding: 4rem;
          color: #8a9aaa; font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .hp-pillars-grid { grid-template-columns: 1fr; }
          .hp-section-header { flex-direction: column; align-items: flex-start; gap: 8px; }
          .hp-stat { padding: 0 1.2rem; }
          .hp-stat-num { font-size: 1.6rem; }
          .hp-stats { gap: 0; }
        }
      `}</style>

      <div className="hp">
        <Header />

        <main>
          {/* ── HERO ── */}
          <section className="hp-hero">
            <div className="hp-hero-orb1" />
            <div className="hp-hero-orb2" />
            <div className="hp-hero-orb3" />
            <div className="hp-hero-grid" />

            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
                <div className="hp-eyebrow">
                  <Sparkles size={12} />
                  Plataforma do Novo Tempo
                </div>
              </motion.div>

              <motion.h1 className="hp-title" variants={fadeUp} initial="hidden" animate="show" custom={1}>
                Descubra o melhor do<br />
                <em>Novo Tempo</em>
              </motion.h1>

              <motion.p className="hp-subtitle" variants={fadeUp} initial="hidden" animate="show" custom={2}>
                Conecte-se com negócios locais, descubra iniciativas solidárias 
                e fortaleça nossa comunidade. Tudo em um só lugar.
              </motion.p>

              <motion.div className="hp-search-wrap" variants={fadeUp} initial="hidden" animate="show" custom={3}>
                <SearchBar placeholder="Busque por 'pizza', 'farmácia', 'salão'..." />
              </motion.div>

              <motion.div className="hp-cats" variants={fadeUp} initial="hidden" animate="show" custom={4}>
                {categoryLinks.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <Link key={cat.value} href={`/busca?categoria=${cat.value}`} className="hp-cat-pill">
                      <Icon size={15} color={cat.color} />
                      {cat.name}
                    </Link>
                  );
                })}
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}>
                <Link href="/empreendimento-solidario" className="hp-cta-solid">
                  <Heart size={17} fill="currentColor" />
                  Economia Solidária
                  <ArrowRight size={15} />
                </Link>
              </motion.div>

              {!loading && (
                <motion.div className="hp-stats" variants={fadeUp} initial="hidden" animate="show" custom={6}>
                  <div className="hp-stat">
                    <div className="hp-stat-num">{stats.businessCount}+</div>
                    <div className="hp-stat-label">Negócios</div>
                  </div>
                  <div className="hp-stat">
                    <div className="hp-stat-num">100%</div>
                    <div className="hp-stat-label">Verificados</div>
                  </div>
                  <div className="hp-stat">
                    <div className="hp-stat-num">Local</div>
                    <div className="hp-stat-label">Impacto</div>
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* ── PILLARS ── */}
          <section className="hp-pillars">
            <div className="hp-pillars-grid">
              <div className="hp-pillar">
                <div className="hp-pillar-icon" style={{ background: "rgba(0,204,255,0.1)" }}>
                  <Store size={22} color="#00CCFF" />
                </div>
                <div className="hp-pillar-title">Comércio Local</div>
                <div className="hp-pillar-desc">Valorize os empreendedores que fazem o bairro crescer todos os dias.</div>
              </div>
              <div className="hp-pillar" style={{ borderLeft: "1px solid #f0ece5", borderRight: "1px solid #f0ece5" }}>
                <div className="hp-pillar-icon" style={{ background: "rgba(247,176,0,0.1)" }}>
                  <ShieldCheck size={22} color="#F7B000" />
                </div>
                <div className="hp-pillar-title">Impacto Social</div>
                <div className="hp-pillar-desc">Iniciativas solidárias que constroem uma nova realidade para todos.</div>
              </div>
              <div className="hp-pillar">
                <div className="hp-pillar-icon" style={{ background: "rgba(74,222,128,0.1)" }}>
                  <TrendingUp size={22} color="#22c55e" />
                </div>
                <div className="hp-pillar-title">Qualidade</div>
                <div className="hp-pillar-desc">Estabelecimentos avaliados pela própria vizinhança, com transparência total.</div>
              </div>
            </div>
          </section>

          {/* ── FEATURED ── */}
          <section className="hp-featured">
            <div className="hp-section-header">
              <div>
                <h2 className="hp-section-title">Negócios em Destaque</h2>
                <p className="hp-section-sub">Os mais bem avaliados da vizinhança</p>
              </div>
              <Link href="/busca" className="hp-view-all">
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>

            <div className="hp-cards">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div className="sk-card" key={i}>
                    <div className="sk-img" style={{ animationDelay: `${i * 0.1}s` }} />
                    <div style={{ padding: "1.4rem 1.5rem", display: "flex", flexDirection: "column", gap: 10 }}>
                      <div className="sk-line" style={{ height: 20, width: "65%" }} />
                      <div className="sk-line" style={{ height: 13, width: "40%" }} />
                      <div className="sk-line" style={{ height: 13, width: "100%" }} />
                      <div className="sk-line" style={{ height: 13, width: "85%" }} />
                    </div>
                  </div>
                ))
              ) : featuredBusinesses.length > 0 ? (
                featuredBusinesses.map((business, idx) => (
                  <motion.div
                    key={business.id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    custom={idx}
                  >
                    <Link href={`/estabelecimento/${business.id}`} className="feat-card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <div className="feat-img-wrap">
                        {business.images && business.images.length > 0 ? (
                          <img src={business.images[0]} alt={business.businessName} />
                        ) : (
                          <div className="feat-no-img">
                            <Store size={44} color="rgba(255,255,255,0.12)" />
                          </div>
                        )}
                        <div className="feat-overlay" />
                        {business.category === "solidario" && (
                          <div className="feat-solidario-badge">Solidário</div>
                        )}
                      </div>

                      <div className="feat-body">
                        <div className="feat-head">
                          <div className="feat-name">{business.businessName}</div>
                          <div>
                            {renderStars(business.rating)}
                            <div className="feat-rating-num">
                              {business.rating && business.rating > 0
                                ? business.rating.toFixed(1)
                                : "Sem avaliações"}
                            </div>
                          </div>
                        </div>

                        <div className="feat-addr">
                          <MapPin size={12} color="#00CCFF" />
                          {business.address}
                        </div>

                        <p className="feat-desc">{business.description}</p>

                        <div className="feat-footer">
                          <div className="feat-hours">
                            <Clock size={13} color="#00CCFF" />
                            {business.hours || "Não informado"}
                          </div>
                          <div className="feat-cta">
                            Ver detalhes <ArrowRight size={13} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="hp-empty">Nenhum destaque definido no momento.</div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
