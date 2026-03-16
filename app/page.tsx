"use client"
import { collection, getDocs, query, limit, where } from "firebase/firestore"
import { useState, useEffect } from "react"
import { MapPin, Star, Store, Utensils, Wrench, Heart, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SearchBar } from "@/components/search-bar"
import { db } from "@/lib/firebase"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { motion, Variants } from "framer-motion"

type Business = {
  id: string;
  businessName: string;
  address: string;
  category: string;
  description: string;
  rating?: number;
  openingHours?: any[]; 
  coverImage?: string;   
  galleryImages?: string[]; 
  isPublic?: boolean;
  isFeatured?: boolean;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as any },
  }),
};

const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  .hp { --navy: #002240; --gold: #F7B000; --cyan: #00CCFF; --rose: #E91E8C; --bg: #F4F1EC; --card-bg: #fff; font-family: 'DM Sans', sans-serif; }
  
  /* Reduzi o padding superior para aproximar a logo do Header */
  .hp-hero { background: var(--navy); position: relative; overflow: hidden; padding: 2.5rem 1.5rem 6rem; }
  
  .hp-hero-orb1 { position: absolute; border-radius: 50%; pointer-events: none; width: 600px; height: 600px; background: var(--cyan); opacity: 0.12; filter: blur(90px); top: -200px; right: -150px; }
  .hp-hero-orb2 { position: absolute; border-radius: 50%; pointer-events: none; width: 500px; height: 500px; background: var(--gold); opacity: 0.1; filter: blur(90px); bottom: -200px; left: -100px; }
  .hp-hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px); background-size: 64px 64px; }
  
  /* Estilo do Título: Novo em Branco, Tempo em Ciano */
  .hp-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1.05; color: #ffffff; margin-bottom: 1.2rem; letter-spacing: -0.02em; }
  .hp-title em { font-style: normal; color: var(--cyan); }
  
  .hp-subtitle { color: #ffffff; font-size: 1.1rem; font-weight: 300; max-width: 560px; margin: 0 auto 2.5rem; opacity: 0.9; }
  .hp-search-wrap { max-width: 600px; margin: 0 auto 2.5rem; }
  .hp-cats { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 3.5rem; }
  .hp-cat-pill { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 100px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #ffffff; font-size: 0.87rem; font-weight: 500; text-decoration: none; transition: all 0.2s; }
  .hp-cat-pill:hover { background: rgba(255,255,255,0.2); border-color: #fff; transform: translateY(-2px); }
  
  .hp-featured { background: var(--bg); padding: 5rem 1.5rem; }
  .hp-section-header { max-width: 1100px; margin: 0 auto 3rem; display: flex; align-items: flex-end; justify-content: space-between; }
  .hp-section-title { font-family: 'Syne', sans-serif; font-size: clamp(1.7rem, 3.5vw, 2.2rem); font-weight: 800; color: var(--navy); }
  .hp-view-all { display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; color: var(--cyan); text-decoration: none; }
  
  .hp-cards { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.75rem; }
  .feat-card { background: var(--navy); border-radius: 22px; overflow: hidden; display: flex; flex-direction: column; text-decoration: none; transition: transform 0.3s; box-shadow: 0 4px 20px rgba(0,34,64,0.15); height: 100%; }
  .feat-card:hover { transform: translateY(-7px); }
  .feat-img-wrap { position: relative; height: 190px; overflow: hidden; background: rgba(255,255,255,0.04); }
  .feat-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
  .feat-cat-tag { position: absolute; top: 12px; left: 12px; background: rgba(0,34,64,0.8); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); color: #ffffff; font-size: 0.65rem; font-weight: 700; padding: 4px 10px; border-radius: 100px; text-transform: uppercase; }
  
  .feat-body { padding: 1.3rem 1.4rem 1.4rem; flex: 1; display: flex; flex-direction: column; }
  .feat-name { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; }
  .feat-addr { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: #ffffff; margin-bottom: 0.75rem; }
  .feat-desc { font-size: 0.855rem; color: #ffffff; opacity: 0.8; line-height: 1.65; margin-bottom: 1.1rem; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .feat-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 0.9rem; border-top: 1px solid rgba(255,255,255,0.15); margin-top: auto; }
  .feat-cta { display: inline-flex; align-items: center; gap: 5px; font-size: 0.8rem; font-weight: 700; color: var(--cyan); }
  
  @media (max-width: 768px) { 
    .hp-hero { padding: 1.5rem 1.5rem 4rem; }
    .hero-logo-container { margin-top: 0 !important; margin-bottom: 1rem !important; }
  }
`;

export default function HomePage() {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
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
        const businessesCollection = collection(db, "businesses")
        const featuredQuery = query(
          businessesCollection,
          where("isPublic", "==", true),
          where("isFeatured", "==", true),
          limit(3)
        )
        const featSnap = await getDocs(featuredQuery)
        setFeaturedBusinesses(featSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Business[])
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const renderStars = (rating: number = 0) => (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} style={{
          width: 13, height: 13,
          color: star <= Math.round(rating) ? "#F7B000" : "rgba(255,255,255,0.3)",
          fill: star <= Math.round(rating) ? "#F7B000" : "transparent"
        }} />
      ))}
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
      <div className="hp">
        <Header />

        <main>
          <section className="hp-hero">
            <div className="hp-hero-orb1" /><div className="hp-hero-orb2" /><div className="hp-hero-grid" />
            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              
              {/* Logo com margens reduzidas para aproximar Header e Título */}
              <motion.div 
                className="hero-logo-container"
                variants={fadeUp} initial="hidden" animate="show" custom={0}
                style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  marginBottom: "0.8rem", // Reduzi para aproximar do título
                  marginTop: "-1rem"      // Reduzi para aproximar do header
                }}
              >
                <Image 
                  src="/logo.png" 
                  alt="Logo Novo Tempo Conecta" 
                  width={400} 
                  height={110} 
                  priority 
                  quality={100}
                  style={{ filter: "drop-shadow(0 0 25px rgba(0,204,255,0.35))" }}
                />
              </motion.div>

              <motion.h1 className="hp-title" variants={fadeUp} initial="hidden" animate="show" custom={1}>
                Descubra o melhor do<br />Novo <em>Tempo</em>
              </motion.h1>

              <motion.p className="hp-subtitle" variants={fadeUp} initial="hidden" animate="show" custom={2}>
                Conecte-se com negócios locais e fortaleça nossa comunidade.
              </motion.p>

              <motion.div className="hp-search-wrap" variants={fadeUp} initial="hidden" animate="show" custom={3}>
                <SearchBar placeholder="Busque por 'pizza', 'farmácia'..." />
              </motion.div>

              <motion.div className="hp-cats" variants={fadeUp} initial="hidden" animate="show" custom={4}>
                {categoryLinks.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <Link key={cat.value} href={`/busca?categoria=${cat.value}`} className="hp-cat-pill">
                      <Icon size={15} color={cat.color} />{cat.name}
                    </Link>
                  );
                })}
              </motion.div>
            </div>
          </section>

          <section className="hp-featured">
            <div className="hp-section-header">
              <div>
                <h2 className="hp-section-title">Negócios em Destaque</h2>
                <p style={{ color: "#1a2a3a", opacity: 0.7 }}>Os melhores da região de Timon</p>
              </div>
              <Link href="/busca" className="hp-view-all">Ver todos <ArrowRight size={14} /></Link>
            </div>

            <div className="hp-cards">
              {!loading && featuredBusinesses.map((business, idx) => (
                <motion.div key={business.id} variants={fadeUp} initial="hidden" animate="show" custom={idx}>
                  <Link href={`/estabelecimento/${business.id}`} className="feat-card">
                    <div className="feat-img-wrap">
                      {business.coverImage ? (
                        <img src={business.coverImage} alt={business.businessName} />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Store size={44} color="rgba(255,255,255,0.2)" />
                        </div>
                      )}
                      {business.category && <div className="feat-cat-tag">{business.category}</div>}
                    </div>
                    <div className="feat-body">
                      <div className="feat-head">
                        <div className="feat-name">{business.businessName}</div>
                        <div style={{ textAlign: 'right' }}>
                          {renderStars(business.rating)}
                          <div style={{ fontSize: '0.7rem', color: '#fff' }}>{business.rating?.toFixed(1) || "Novo"}</div>
                        </div>
                      </div>
                      <div className="feat-addr">
                        <MapPin size={12} color="#00CCFF" /> {business.address}
                      </div>
                      <p className="feat-desc">{business.description}</p>
                      <div className="feat-footer">
                        <div style={{ fontSize: '0.75rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={13} color="#00CCFF" /> Aberto
                        </div>
                        <div className="feat-cta">Ver detalhes <ArrowRight size={13} /></div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}