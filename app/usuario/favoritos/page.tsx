"use client"

import { Heart, Star, MapPin, Trash2, Share2, Grid, List, Loader2, ArrowRight, Shield, Edit3 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore"
import { Timestamp } from "firebase/firestore"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

const FAV_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.fav {
  --navy: #002240;
  --gold: #F7B000;
  --cyan: #00CCFF;
  --bg: #F4F1EC;
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  min-height: 100vh;
}

.fav-hero {
  background: var(--navy);
  padding: 2.5rem 1.5rem 5rem;
  position: relative; overflow: hidden;
}
.fav-hero-orb1 {
  position: absolute; border-radius: 50%; pointer-events: none;
  width: 500px; height: 500px;
  background: var(--cyan); opacity: 0.07; filter: blur(90px);
  top: -180px; right: -100px;
}
.fav-hero-orb2 {
  position: absolute; border-radius: 50%; pointer-events: none;
  width: 350px; height: 350px;
  background: var(--gold); opacity: 0.08; filter: blur(80px);
  bottom: -140px; left: -60px;
}
.fav-hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 56px 56px;
}
.fav-hero-inner {
  max-width: 1000px; margin: 0 auto;
  position: relative; z-index: 1;
  display: flex; align-items: center;
  justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.fav-hero-eyebrow {
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(0,204,255,0.7); margin-bottom: 6px;
}
.fav-hero-title {
  font-family: 'Syne', sans-serif;
  font-size: 2rem; font-weight: 800;
  color: #fff; line-height: 1.1; margin-bottom: 4px;
}
.fav-hero-sub { font-size: 0.875rem; color: rgba(255,255,255,0.5); font-weight: 300; }

.fav-view-toggle {
  display: flex;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px; padding: 4px; gap: 4px;
}
.fav-view-btn {
  width: 36px; height: 36px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: none;
  color: rgba(255,255,255,0.5); cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.fav-view-btn.active {
  background: rgba(255,255,255,0.15);
  color: #fff;
}

/* ── BODY ──────────────────────────────────── */
.fav-body {
  max-width: 1000px;
  margin: -3rem auto 0;
  padding: 0 1.5rem 4rem;
  position: relative; z-index: 10;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.5rem;
  align-items: start;
}

/* ── CARDS ─────────────────────────────────── */
.fav-empty-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 20px rgba(0,34,64,0.07);
  padding: 5rem 2rem;
  text-align: center;
}
.fav-empty-icon {
  width: 72px; height: 72px; border-radius: 50%;
  background: #f8f6f2;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.2rem;
}
.fav-empty-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.2rem; font-weight: 700;
  color: var(--navy); margin-bottom: 8px;
}
.fav-empty-desc { font-size: 0.875rem; color: #8a9aaa; margin-bottom: 1.5rem; }
.fav-explore-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 11px 22px; border-radius: 12px;
  background: var(--navy); color: #fff;
  font-family: 'Syne', sans-serif;
  font-size: 0.85rem; font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(0,34,64,0.2);
}
.fav-explore-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,34,64,0.25); }

/* ── GRID MODE ─────────────────────────────── */
.fav-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
}
.fav-list { display: flex; flex-direction: column; gap: 1rem; }

/* ── BUSINESS CARD ─────────────────────────── */
.fav-card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 2px 16px rgba(0,34,64,0.07);
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
}
.fav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0,34,64,0.14);
}
.fav-card-list {
  display: flex; flex-direction: row; height: 130px;
}

.fav-img {
  position: relative; overflow: hidden;
  background: #f0ece5;
  display: flex; align-items: center; justify-content: center;
}
.fav-img-grid { height: 180px; }
.fav-img-list { width: 140px; height: 100%; flex-shrink: 0; }

.fav-img img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.5s ease;
}
.fav-card:hover .fav-img img { transform: scale(1.07); }

.fav-cat-badge {
  position: absolute; top: 10px; right: 10px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px);
  color: #3a4a5a; font-size: 0.68rem;
  font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  padding: 4px 10px; border-radius: 100px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.fav-body-inner {
  padding: 1.1rem 1.2rem;
  display: flex; flex-direction: column; flex: 1;
}
.fav-name {
  font-family: 'Syne', sans-serif;
  font-size: 0.95rem; font-weight: 700;
  color: var(--navy); line-height: 1.2;
  margin-bottom: 4px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.fav-addr {
  display: flex; align-items: center; gap: 4px;
  font-size: 0.75rem; color: #8a9aaa;
  margin-bottom: 0.8rem;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.fav-rating {
  display: flex; align-items: center; gap: 3px;
  font-size: 0.78rem; font-weight: 700;
  color: var(--gold);
}

.fav-footer {
  display: flex; align-items: center;
  justify-content: space-between;
  padding-top: 0.8rem;
  border-top: 1px solid #f0ece5;
  margin-top: auto;
}
.fav-ver-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 14px; border-radius: 9px;
  background: rgba(0,204,255,0.1);
  color: #007799; font-size: 0.75rem; font-weight: 600;
  text-decoration: none; border: 1px solid rgba(0,204,255,0.2);
  transition: background 0.15s;
}
.fav-ver-btn:hover { background: rgba(0,204,255,0.18); }

.fav-icon-btn {
  width: 32px; height: 32px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  background: #f8f6f2; border: none; cursor: pointer;
  color: #b0bec5; transition: background 0.15s, color 0.15s;
}
.fav-icon-btn.share:hover { background: rgba(0,204,255,0.1); color: #00CCFF; }
.fav-icon-btn.del:hover { background: rgba(239,68,68,0.08); color: #ef4444; }

/* ── SIDEBAR ───────────────────────────────── */
.fav-nav-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 20px rgba(0,34,64,0.07);
  overflow: hidden;
  margin-bottom: 1.25rem;
}
.fav-nav-header {
  background: #faf8f5;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f0ece5;
  font-family: 'Syne', sans-serif;
  font-size: 0.85rem; font-weight: 700;
  color: var(--navy);
}
.fav-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 0.85rem 1.25rem;
  font-size: 0.875rem; font-weight: 500;
  color: #5a6878; text-decoration: none;
  border-bottom: 1px solid #f8f6f2;
  transition: background 0.15s, color 0.15s;
}
.fav-nav-item:last-child { border-bottom: none; }
.fav-nav-item:hover { background: rgba(0,204,255,0.06); color: var(--navy); }
.fav-nav-item.active {
  background: rgba(0,204,255,0.08);
  color: var(--navy); font-weight: 600;
}
.fav-nav-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--cyan); flex-shrink: 0; margin-left: auto;
}

.fav-promo-card {
  background: var(--navy);
  border-radius: 20px; padding: 1.4rem;
  position: relative; overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,34,64,0.2);
}
.fav-promo-orb {
  position: absolute; top: -10px; right: -10px;
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--gold); opacity: 0.2; filter: blur(20px);
}
.fav-promo-title {
  font-family: 'Syne', sans-serif;
  font-size: 1rem; font-weight: 700;
  color: #fff; margin-bottom: 6px; position: relative; z-index: 1;
}
.fav-promo-text {
  font-size: 0.8rem; color: rgba(255,255,255,0.6);
  line-height: 1.6; margin-bottom: 1rem; position: relative; z-index: 1;
}
.fav-promo-btn {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  width: 100%; padding: 10px;
  background: var(--gold); color: var(--navy);
  border: none; border-radius: 12px;
  font-family: 'Syne', sans-serif;
  font-size: 0.82rem; font-weight: 700;
  cursor: pointer; text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative; z-index: 1;
}
.fav-promo-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(247,176,0,0.35); }

.fav-loading {
  min-height: 100vh; display: flex;
  align-items: center; justify-content: center;
  background: var(--bg);
}
@keyframes fav-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

@media (max-width: 768px) {
  .fav-body { grid-template-columns: 1fr; margin-top: -1.5rem; }
  .fav-grid { grid-template-columns: 1fr; }
}
`;

type Favorite = {
  id: string; name: string; category: string;
  rating: number; address: string; phone: string;
  image?: string; addedDate?: Timestamp;
};

export default function FavoritosPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) { setCurrentUser(user); fetchFavorites(user.uid); }
      else { window.location.href = '/login'; }
    });
    return () => unsubscribe();
  }, []);

  const fetchFavorites = async (userId: string) => {
    setLoading(true);
    try {
      const userSnap = await getDoc(doc(db, "users", userId));
      if (userSnap.exists() && userSnap.data().favorites) {
        const ids: string[] = userSnap.data().favorites;
        const results = await Promise.all(ids.map(async id => {
          const snap = await getDoc(doc(db, "businesses", id));
          if (!snap.exists()) return null;
          const d = snap.data();
          return { id: snap.id, name: d.businessName, category: d.category, rating: d.rating || 0, address: d.address, phone: d.businessPhone, image: d.images?.[0] } as Favorite;
        }));
        setFavorites(results.filter(Boolean) as Favorite[]);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleRemove = async (id: string) => {
    if (!currentUser) return;
    if (!window.confirm("Remover dos favoritos?")) return;
    try {
      await updateDoc(doc(db, "users", currentUser.uid), { favorites: arrayRemove(id) });
      setFavorites(p => p.filter(f => f.id !== id));
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <>
      <style>{FAV_CSS}</style>
      <div className="fav-loading">
        <Loader2 style={{ width: 40, height: 40, color: "#00CCFF", animation: "fav-spin 1s linear infinite" }} />
      </div>
    </>
  );

  const navItems = [
    { href: "/usuario/dashboard", label: "Meu Perfil", icon: <Edit3 size={16} /> },
    { href: "/usuario/avaliacoes", label: "Minhas Avaliações", icon: <Star size={16} color="#F7B000" /> },
    { href: "/usuario/favoritos", label: "Locais Favoritos", icon: <Heart size={16} color="#ef4444" />, active: true },
    { href: "/usuario/configuracoes", label: "Configurações", icon: <Shield size={16} /> },
  ];

  return (
    <>
      <style>{FAV_CSS}</style>
      <div className="fav">
        <Header />

        <div className="fav-hero">
          <div className="fav-hero-orb1" /><div className="fav-hero-orb2" /><div className="fav-hero-grid" />
          <div className="fav-hero-inner">
            <div>
              <div className="fav-hero-eyebrow">Área do Usuário</div>
              <div className="fav-hero-title">Locais Favoritos</div>
              <div className="fav-hero-sub">Seus lugares preferidos salvos para acesso rápido</div>
            </div>
            <div className="fav-view-toggle">
              <button className={`fav-view-btn${viewMode === "grid" ? " active" : ""}`} onClick={() => setViewMode("grid")}>
                <Grid size={15} />
              </button>
              <button className={`fav-view-btn${viewMode === "list" ? " active" : ""}`} onClick={() => setViewMode("list")}>
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="fav-body">

          {/* MAIN */}
          <div>
            {favorites.length === 0 ? (
              <div className="fav-empty-card">
                <div className="fav-empty-icon">
                  <Heart size={32} color="#d5d0c8" />
                </div>
                <div className="fav-empty-title">Nenhum favorito ainda</div>
                <div className="fav-empty-desc">Comece a explorar o Novo Tempo e salve seus lugares preferidos.</div>
                <Link href="/busca" className="fav-explore-btn">
                  Explorar Agora <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "fav-grid" : "fav-list"}>
                {favorites.map(fav => (
                  <div key={fav.id} className={`fav-card${viewMode === "list" ? " fav-card-list" : ""}`}>
                    <div className={`fav-img${viewMode === "grid" ? " fav-img-grid" : " fav-img-list"}`}>
                      {fav.image
                        ? <img src={fav.image} alt={fav.name} />
                        : <Heart size={36} color="#d5d0c8" />}
                      <div className="fav-cat-badge">{fav.category}</div>
                    </div>

                    <div className="fav-body-inner">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                        <div className="fav-name">{fav.name}</div>
                        <div className="fav-rating">
                          <Star size={12} fill="#F7B000" />
                          {fav.rating.toFixed(1)}
                        </div>
                      </div>
                      <div className="fav-addr">
                        <MapPin size={11} color="#00CCFF" /> {fav.address}
                      </div>
                      <div className="fav-footer">
                        <Link href={`/estabelecimento/${fav.id}`} className="fav-ver-btn">
                          Ver Perfil
                        </Link>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="fav-icon-btn share"><Share2 size={13} /></button>
                          <button className="fav-icon-btn del" onClick={() => handleRemove(fav.id)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div>
            <div className="fav-nav-card">
              <div className="fav-nav-header">Navegação</div>
              {navItems.map(item => (
                <Link key={item.href} href={item.href} className={`fav-nav-item${item.active ? " active" : ""}`}>
                  {item.icon}
                  {item.label}
                  {item.active && <div className="fav-nav-dot" />}
                </Link>
              ))}
            </div>

            <div className="fav-promo-card">
              <div className="fav-promo-orb" />
              <div className="fav-promo-title">Descubra Novos Lugares</div>
              <div className="fav-promo-text">Explore o bairro e encontre os melhores estabelecimentos perto de você.</div>
              <Link href="/busca" className="fav-promo-btn">
                Ir para o Mapa <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}