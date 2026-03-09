"use client"

import {
  Star, MapPin, Phone, Clock, Globe, Share2, Heart, MessageSquare,
  Navigation, Camera, Loader2, Edit3, Trash2, ArrowRight,
  CheckCircle2, Save
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  doc, getDoc, updateDoc, collection, addDoc, onSnapshot,
  Timestamp, arrayUnion, arrayRemove, deleteDoc
} from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

type BusinessData = {
  id: string; businessName: string; category: string;
  rating?: number; reviewCount?: number; address: string;
  businessPhone: string; whatsapp?: string; hours: string;
  website?: string; description: string; specialties?: string[];
  isOpen?: boolean; images?: string[];
  location: { latitude: number; longitude: number };
};

type Review = {
  id: string; userId: string; userName: string;
  userAvatar?: string; rating: number; comment: string; createdAt: Timestamp;
};

const EST_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.est {
  --navy: #002240; --gold: #F7B000; --cyan: #00CCFF; --bg: #F4F1EC;
  font-family: 'DM Sans', sans-serif;
  background: var(--bg); min-height: 100vh;
}
.est-hero {
  background: var(--navy);
  padding: 2rem 1.5rem 6rem;
  position: relative; overflow: hidden;
}
.est-hero-orb1 {
  position: absolute; border-radius: 50%;
  width: 600px; height: 600px;
  background: var(--cyan); opacity: 0.065; filter: blur(100px);
  top: -180px; right: -150px; pointer-events: none;
}
.est-hero-orb2 {
  position: absolute; border-radius: 50%;
  width: 420px; height: 420px;
  background: var(--gold); opacity: 0.07; filter: blur(85px);
  bottom: -140px; left: -80px; pointer-events: none;
}
.est-hero-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);
  background-size: 56px 56px; pointer-events: none;
}
.est-hero-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
.est-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: rgba(255,255,255,0.35); margin-bottom: 1.5rem; }
.est-breadcrumb a { color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.15s; }
.est-breadcrumb a:hover { color: rgba(255,255,255,0.75); }
.est-breadcrumb span { color: rgba(255,255,255,0.2); }
.est-hero-bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
.est-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 100px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; }
.est-badge-cat { background: var(--gold); color: var(--navy); }
.est-badge-open { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
.est-badge-closed { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
.est-badge-row { display: flex; align-items: center; gap: 8px; margin-bottom: 0.8rem; }
.est-title { font-family: 'Syne',sans-serif; font-size: clamp(1.9rem,5vw,3.2rem); font-weight: 800; color: #fff; line-height: 1.05; margin-bottom: 0.85rem; }
.est-meta { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; font-size: 0.85rem; color: rgba(255,255,255,0.5); }
.est-meta-item { display: flex; align-items: center; gap: 6px; }
.est-rating-num { font-family: 'Syne',sans-serif; font-size: 1.25rem; font-weight: 800; color: #fff; }
.est-hero-btns { display: flex; gap: 10px; flex-wrap: wrap; flex-shrink: 0; }
.est-btn { display: inline-flex; align-items: center; gap: 7px; padding: 11px 20px; border-radius: 13px; font-family: 'DM Sans',sans-serif; font-size: 0.85rem; font-weight: 700; cursor: pointer; border: none; text-decoration: none; transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s; white-space: nowrap; }
.est-btn:hover { transform: translateY(-3px); }
.est-btn-gold { background: var(--gold); color: var(--navy); box-shadow: 0 6px 22px rgba(247,176,0,0.3); }
.est-btn-gold:hover { box-shadow: 0 12px 32px rgba(247,176,0,0.4); }
.est-btn-fav { background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.15)!important; color: rgba(255,255,255,0.75); }
.est-btn-fav:hover { background: rgba(255,255,255,0.14); }
.est-btn-fav.active { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.35)!important; color: #f87171; }
.est-body { max-width: 1100px; margin: -4.5rem auto 0; padding: 0 1.5rem 5rem; position: relative; z-index: 10; display: grid; grid-template-columns: 1fr 310px; gap: 1.75rem; align-items: start; }
.est-card { background: #fff; border-radius: 20px; box-shadow: 0 2px 20px rgba(0,34,64,0.07); overflow: hidden; margin-bottom: 1.5rem; }
.est-card:last-child { margin-bottom: 0; }
.est-card-header { padding: 1.1rem 1.6rem; border-bottom: 1px solid #f0ece5; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.est-card-title { font-family: 'Syne',sans-serif; font-size: 0.95rem; font-weight: 700; color: var(--navy); display: flex; align-items: center; gap: 9px; }
.est-card-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
.est-card-body { padding: 1.5rem 1.6rem; }
.est-card-count { font-size: 0.72rem; font-weight: 700; color: #b0bec5; background: #f8f6f2; padding: 2px 9px; border-radius: 100px; }
.est-gallery { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.est-gallery-img { aspect-ratio: 4/3; border-radius: 12px; overflow: hidden; background: #f0ece5; cursor: pointer; }
.est-gallery-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.est-gallery-img:hover img { transform: scale(1.07); }
.est-gallery-empty { grid-column: 1/-1; padding: 3rem; text-align: center; background: #faf8f5; border-radius: 14px; border: 2px dashed #ede9e0; color: #b0bec5; font-size: 0.875rem; }
.est-about-desc { font-size: 0.9rem; color: #3a4a5a; line-height: 1.75; white-space: pre-line; margin-bottom: 1.4rem; }
.est-specs-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #b0bec5; margin-bottom: 9px; }
.est-specs { display: flex; flex-wrap: wrap; gap: 7px; }
.est-spec { background: rgba(0,204,255,0.07); border: 1px solid rgba(0,204,255,0.15); color: #007799; font-size: 0.78rem; font-weight: 500; padding: 4px 12px; border-radius: 100px; }
.est-review-btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 16px; border-radius: 11px; background: var(--gold); color: var(--navy); font-size: 0.82rem; font-weight: 700; border: none; cursor: pointer; font-family: 'DM Sans',sans-serif; box-shadow: 0 4px 14px rgba(247,176,0,0.25); transition: transform 0.2s,box-shadow 0.2s; }
.est-review-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(247,176,0,0.35); }
.est-form-wrap { background: #faf8f5; border: 1.5px solid #ede9e0; border-radius: 16px; padding: 1.4rem; margin-bottom: 1.5rem; animation: est-slide 0.22s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes est-slide { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
.est-form-title { font-family: 'Syne',sans-serif; font-size: 0.95rem; font-weight: 700; color: var(--navy); margin-bottom: 1rem; }
.est-star-pick-row { display: flex; align-items: center; gap: 5px; margin-bottom: 1rem; }
.est-star-btn { background: none; border: none; cursor: pointer; padding: 2px; transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1); }
.est-star-btn:hover { transform: scale(1.28); }
.est-star-label { font-size: 0.8rem; color: #a06000; font-weight: 700; margin-left: 6px; }
.est-textarea { width: 100%; padding: 12px 14px; background: #fff; border: 1.5px solid #ede9e0; border-radius: 12px; font-size: 0.875rem; font-family: 'DM Sans',sans-serif; color: var(--navy); outline: none; resize: vertical; transition: border-color 0.2s; margin-bottom: 1rem; }
.est-textarea:focus { border-color: var(--cyan); }
.est-form-actions { display: flex; justify-content: flex-end; gap: 8px; }
.est-form-cancel { padding: 9px 18px; border-radius: 11px; background: #f0ece5; border: none; color: #5a6878; font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans',sans-serif; }
.est-form-cancel:hover { background: #e5e0d8; }
.est-form-save { padding: 9px 18px; border-radius: 11px; background: #22c55e; border: none; color: #fff; font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans',sans-serif; display: inline-flex; align-items: center; gap: 6px; transition: background 0.15s,transform 0.2s; }
.est-form-save:hover { background: #16a34a; transform: translateY(-1px); }
.est-review { display: flex; gap: 13px; padding: 1.2rem 0; border-bottom: 1px solid #f0ece5; }
.est-review:last-child { border-bottom: none; }
.est-review-body { flex: 1; }
.est-review-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 4px; }
.est-review-name { font-family: 'Syne',sans-serif; font-size: 0.9rem; font-weight: 700; color: var(--navy); }
.est-review-date { font-size: 0.72rem; color: #b0bec5; }
.est-review-stars { display: flex; gap: 2px; margin-bottom: 6px; }
.est-review-text { font-size: 0.87rem; color: #3a4a5a; line-height: 1.65; }
.est-review-mine { display: flex; gap: 12px; margin-top: 8px; }
.est-review-mine-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 600; font-family: 'DM Sans',sans-serif; transition: color 0.15s; }
.est-review-mine-btn.edit { color: #00CCFF; } .est-review-mine-btn.edit:hover { color: #0099cc; }
.est-review-mine-btn.del { color: #ef4444; } .est-review-mine-btn.del:hover { color: #dc2626; }
.est-reviews-empty { text-align: center; padding: 3.5rem 1rem; }
.est-reviews-empty-icon { width: 64px; height: 64px; border-radius: 50%; background: #f8f6f2; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
.est-side-card { background: #fff; border-radius: 20px; box-shadow: 0 2px 20px rgba(0,34,64,0.07); overflow: hidden; margin-bottom: 1.25rem; }
.est-side-card:last-child { margin-bottom: 0; }
.est-side-header { background: #faf8f5; padding: 1rem 1.25rem; border-bottom: 1px solid #f0ece5; font-family: 'Syne',sans-serif; font-size: 0.85rem; font-weight: 700; color: var(--navy); display: flex; align-items: center; gap: 7px; }
.est-side-body { padding: 1.25rem; }
.est-cta { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 13px; border-radius: 13px; border: none; font-family: 'DM Sans',sans-serif; font-size: 0.875rem; font-weight: 700; cursor: pointer; text-decoration: none; transition: transform 0.2s,box-shadow 0.2s; margin-bottom: 9px; }
.est-cta:last-child { margin-bottom: 0; }
.est-cta-gold { background: var(--gold); color: var(--navy); box-shadow: 0 4px 16px rgba(247,176,0,0.25); }
.est-cta-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(247,176,0,0.35); }
.est-cta-ghost { background: #f8f6f2; border: 1.5px solid #ede9e0!important; color: #3a4a5a; }
.est-cta-ghost:hover { background: #f0ece5; }
.est-info-row { display: flex; align-items: center; gap: 10px; padding: 0.65rem 0; border-bottom: 1px solid #f8f6f2; font-size: 0.82rem; color: #3a4a5a; }
.est-info-row:last-child { border-bottom: none; }
.est-info-row-icon { width: 30px; height: 30px; border-radius: 8px; background: #f8f6f2; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.est-status-row { display: flex; align-items: flex-start; gap: 10px; }
.est-status-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
.est-status-dot.open { background: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.2); animation: est-dot-pulse 2s infinite; }
.est-status-dot.closed { background: #ef4444; }
@keyframes est-dot-pulse { 0%,100%{box-shadow:0 0 0 3px rgba(34,197,94,0.2)} 50%{box-shadow:0 0 0 6px rgba(34,197,94,0.06)} }
.est-status-text { font-family: 'Syne',sans-serif; font-size: 0.88rem; font-weight: 700; margin-bottom: 3px; }
.est-status-text.open { color: #22c55e; } .est-status-text.closed { color: #ef4444; }
.est-hours-detail { font-size: 0.8rem; color: #8a9aaa; line-height: 1.6; white-space: pre-line; }
.est-map-wrap { height: 175px; overflow: hidden; border-top: 1px solid #f0ece5; }
.est-overlay { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: est-fade 0.15s ease; }
@keyframes est-fade { from{opacity:0} to{opacity:1} }
.est-confirm-modal { background: #fff; border-radius: 20px; width: 100%; max-width: 360px; padding: 2rem; text-align: center; box-shadow: 0 24px 60px rgba(0,0,0,0.18); animation: est-slide 0.2s cubic-bezier(0.34,1.56,0.64,1); }
.est-confirm-icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(239,68,68,0.08); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
.est-confirm-title { font-family: 'Syne',sans-serif; font-size: 1.05rem; font-weight: 800; color: var(--navy); margin-bottom: 6px; }
.est-confirm-desc { font-size: 0.83rem; color: #6b7280; line-height: 1.55; margin-bottom: 1.4rem; }
.est-confirm-btns { display: flex; gap: 10px; }
.est-confirm-cancel { flex: 1; padding: 11px; background: #f8f6f2; border: 1.5px solid #ede9e0; border-radius: 12px; color: #5a6878; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans',sans-serif; }
.est-confirm-del { flex: 1; padding: 11px; background: #dc2626; border: none; border-radius: 12px; color: #fff; font-size: 0.85rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans',sans-serif; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.15s; }
.est-confirm-del:hover { background: #b91c1c; }
.est-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: var(--navy); color: #fff; padding: 12px 22px; border-radius: 14px; display: flex; align-items: center; gap: 8px; font-size: 0.875rem; font-weight: 500; box-shadow: 0 12px 40px rgba(0,0,0,0.25); z-index: 100; white-space: nowrap; animation: est-toast 0.3s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes est-toast { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
.est-loading { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); }
@keyframes est-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
@media (max-width:900px) { .est-body{grid-template-columns:1fr;margin-top:-2rem} .est-gallery{grid-template-columns:repeat(2,1fr)} }
@media (max-width:560px) { .est-gallery{grid-template-columns:1fr} .est-hero-btns{width:100%} }
`;

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          color={s <= rating ? "#F7B000" : "#e2e8f0"}
          fill={s <= rating ? "#F7B000" : "transparent"} />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hov, setHov] = useState(0);
  const labels = ["","Ruim","Regular","Bom","Muito bom","Excelente"];
  return (
    <div className="est-star-pick-row">
      {[1,2,3,4,5].map(s => {
        const active = s <= (hov || value);
        return (
          <button key={s} type="button" className="est-star-btn"
            onMouseEnter={() => setHov(s)} onMouseLeave={() => setHov(0)}
            onClick={() => onChange(s)}>
            <Star size={28} color={active ? "#F7B000" : "#e2e8f0"} fill={active ? "#F7B000" : "transparent"} />
          </button>
        );
      })}
      {(hov || value) > 0 && <span className="est-star-label">{labels[hov || value]}</span>}
    </div>
  );
}

export default function EstabelecimentoPage({ params }: { params: { id: string } }) {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  const [firestoreUserName, setFirestoreUserName] = useState<string>("");
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const userReview = reviews.find(r => r.userId === currentUser?.uid);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user && params.id) {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          setIsFav((data.favorites || []).includes(params.id));
          const realName = data.name || data.fullName || data.displayName || data.nome || user.displayName || "";
          setFirestoreUserName(realName);
        } else {
          setFirestoreUserName(user.displayName || "");
        }
      }
    });
    return () => unsub();
  }, [params.id]);

  useEffect(() => {
    if (!params.id) return;
    
    // Busca os dados do estabelecimento com tratamento de campos nulos
    getDoc(doc(db, "businesses", params.id)).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        setBusiness({ 
          id: snap.id, 
          ...data,
          hours: data.hours || "", // <-- Fix preventivo: garante que hours nunca seja undefined
          specialties: data.specialties || [],
          images: data.images || []
        } as BusinessData);
      }
      setLoading(false);
    });

    const unsub = onSnapshot(collection(db, "businesses", params.id, "reviews"), qs => {
      setReviews(qs.docs.map(d => ({ id: d.id, ...d.data() } as Review))
        .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    });
    return () => unsub();
  }, [params.id]);

  const handleToggleFav = async () => {
    if (!currentUser) { router.push(`/login?redirect=/estabelecimento/${params.id}`); return; }
    setFavLoading(true);
    const ref = doc(db, "users", currentUser.uid);
    if (isFav) { await updateDoc(ref, { favorites: arrayRemove(params.id) }); setIsFav(false); }
    else { await updateDoc(ref, { favorites: arrayUnion(params.id) }); setIsFav(true); }
    setFavLoading(false);
  };

  const openForm = () => {
    if (!currentUser) { router.push(`/login?redirect=/estabelecimento/${params.id}`); return; }
    if (userReview) { setUserRating(userReview.rating); setComment(userReview.comment); }
    else { setUserRating(0); setComment(""); }
    setShowForm(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !business || userRating === 0 || !comment.trim()) {
      showToast("Selecione uma nota e escreva um comentário.");
      return;
    }

    const displayName = firestoreUserName || currentUser.displayName || currentUser.email?.split("@")[0] || "Usuário";

    try {
      const bizRef = doc(db, "businesses", params.id);
      if (userReview) {
        await updateDoc(doc(db, "businesses", params.id, "reviews", userReview.id), {
          rating: userRating,
          comment,
          userName: displayName,
          createdAt: new Date()
        });
        const newAvg = ((business.rating || 0) * (business.reviewCount || 0) - userReview.rating + userRating) / (business.reviewCount || 1);
        await updateDoc(bizRef, { rating: newAvg });
        setBusiness(p => p ? { ...p, rating: newAvg } : null);
        showToast("Avaliação atualizada!");
      } else {
        await addDoc(collection(db, "businesses", params.id, "reviews"), {
          userId: currentUser.uid,
          userName: displayName,
          userAvatar: currentUser.photoURL,
          rating: userRating,
          comment,
          createdAt: new Date()
        });
        const newCount = (business.reviewCount || 0) + 1;
        const newAvg = ((business.rating || 0) * (business.reviewCount || 0) + userRating) / newCount;
        await updateDoc(bizRef, { rating: newAvg, reviewCount: newCount });
        setBusiness(p => p ? { ...p, rating: newAvg, reviewCount: newCount } : null);
        showToast("Avaliação enviada!");
      }
      setShowForm(false);
    } catch {
      showToast("Erro ao salvar. Tente novamente.");
    }
  };

  const handleDeleteReview = async () => {
    if (!currentUser || !business || !userReview) return;
    try {
      await deleteDoc(doc(db, "businesses", params.id, "reviews", userReview.id));
      const newCount = (business.reviewCount || 1) - 1;
      const newAvg = newCount > 0 ? ((business.rating || 0) * (business.reviewCount || 0) - userReview.rating) / newCount : 0;
      await updateDoc(doc(db, "businesses", params.id), { rating: newAvg, reviewCount: newCount });
      setBusiness(p => p ? { ...p, rating: newAvg, reviewCount: newCount } : null);
      setDeleteOpen(false); setShowForm(false);
      showToast("Avaliação excluída.");
    } catch { showToast("Erro ao excluir."); }
  };

  if (loading) return (
    <><style>{EST_CSS}</style>
    <div className="est-loading"><Loader2 style={{ width: 44, height: 44, color: "#00CCFF", animation: "est-spin 1s linear infinite" }} /></div></>
  );

  if (!business) return (
    <><style>{EST_CSS}</style>
    <div className="est-loading" style={{ flexDirection: "column", gap: "1rem" }}>
      <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#002240" }}>Estabelecimento não encontrado</p>
      <Link href="/" style={{ color: "#00CCFF", fontSize: "0.875rem" }}>← Voltar</Link>
    </div></>
  );

  return (
    <><style>{EST_CSS}</style>
    <div className="est">
      <Header />
      <div className="est-hero">
        <div className="est-hero-orb1"/><div className="est-hero-orb2"/><div className="est-hero-grid"/>
        <div className="est-hero-inner">
          <div className="est-breadcrumb">
            <Link href="/">Início</Link><span>/</span>
            <Link href="/busca">Estabelecimentos</Link><span>/</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{business.businessName}</span>
          </div>
          <div className="est-hero-bottom">
            <div>
              <div className="est-badge-row">
                <span className="est-badge est-badge-cat">{business.category}</span>
                <span className={`est-badge ${business.isOpen ? "est-badge-open" : "est-badge-closed"}`}>● {business.isOpen ? "Aberto agora" : "Fechado"}</span>
              </div>
              <h1 className="est-title">{business.businessName}</h1>
              <div className="est-meta">
                <div className="est-meta-item">
                  <Star size={15} color="#F7B000" fill="#F7B000"/>
                  <span className="est-rating-num">{business.rating?.toFixed(1) || "—"}</span>
                  <span>({business.reviewCount || 0} avaliações)</span>
                </div>
                <div className="est-meta-item"><MapPin size={14} color="#00CCFF"/>{business.address}</div>
              </div>
            </div>
            <div className="est-hero-btns">
              <button className="est-btn est-btn-gold" onClick={() => { navigator.clipboard.writeText(window.location.href); showToast("Link copiado!"); }}>
                <Share2 size={15}/> Compartilhar
              </button>
              <button className={`est-btn est-btn-fav${isFav ? " active" : ""}`} onClick={handleToggleFav} disabled={favLoading}>
                {favLoading ? <Loader2 size={15} style={{ animation: "est-spin 1s linear infinite" }}/> : <Heart size={15} fill={isFav ? "currentColor" : "transparent"}/>}
                {isFav ? "Salvo" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="est-body">
        <div>
          <div className="est-card">
            <div className="est-card-header">
              <div className="est-card-title">
                <div className="est-card-icon" style={{ background: "rgba(0,204,255,0.1)" }}><Camera size={15} color="#00CCFF"/></div>
                Galeria de Fotos
              </div>
            </div>
            <div className="est-card-body">
              {business.images && business.images.length > 0 ? (
                <div className="est-gallery">
                  {business.images.map((url, i) => (
                    <div key={i} className="est-gallery-img"><img src={url} alt={`Foto ${i+1}`}/></div>
                  ))}
                </div>
              ) : (
                <div className="est-gallery-empty">
                  <Camera size={30} style={{ margin: "0 auto 8px", display: "block", color: "#d5d0c8" }}/>
                  Nenhuma foto cadastrada.
                </div>
              )}
            </div>
          </div>

          <div className="est-card">
            <div className="est-card-header">
              <div className="est-card-title">
                <div className="est-card-icon" style={{ background: "rgba(247,176,0,0.1)" }}><MessageSquare size={15} color="#F7B000"/></div>
                Sobre o Estabelecimento
              </div>
            </div>
            <div className="est-card-body">
              <p className="est-about-desc">{business.description || "Nenhuma descrição fornecida."}</p>
              {business.specialties && business.specialties.length > 0 && (
                <>
                  <div className="est-specs-label">Especialidades</div>
                  <div className="est-specs">{business.specialties.map((s,i)=><span key={i} className="est-spec">{s}</span>)}</div>
                </>
              )}
            </div>
          </div>

          <div className="est-card">
            <div className="est-card-header">
              <div className="est-card-title">
                <div className="est-card-icon" style={{ background: "rgba(247,176,0,0.08)" }}><Star size={15} color="#F7B000" fill="#F7B000"/></div>
                Avaliações
                <span className="est-card-count">{reviews.length}</span>
              </div>
              {!showForm && (
                <button className="est-review-btn" onClick={openForm}>
                  {userReview ? <Edit3 size={14}/> : <Star size={14}/>}
                  {userReview ? "Editar avaliação" : "Avaliar agora"}
                </button>
              )}
            </div>
            <div className="est-card-body">
              {showForm && (
                <div className="est-form-wrap">
                  <div className="est-form-title">{userReview ? "Editar sua avaliação" : "Compartilhe sua experiência"}</div>
                  <form onSubmit={handleReviewSubmit}>
                    <StarPicker value={userRating} onChange={setUserRating}/>
                    <textarea className="est-textarea" rows={4} placeholder="Conte como foi sua experiência..." value={comment} onChange={e=>setComment(e.target.value)}/>
                    <div className="est-form-actions">
                      <button type="button" className="est-form-cancel" onClick={()=>setShowForm(false)}>Cancelar</button>
                      <button type="submit" className="est-form-save"><Save size={14}/> Salvar</button>
                    </div>
                  </form>
                </div>
              )}
              {reviews.length === 0 ? (
                <div className="est-reviews-empty">
                  <div className="est-reviews-empty-icon"><MessageSquare size={28} color="#d5d0c8"/></div>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#002240", marginBottom: 4 }}>Sem avaliações ainda</p>
                  <p style={{ fontSize: "0.83rem", color: "#8a9aaa" }}>Seja o primeiro a avaliar este local!</p>
                </div>
              ) : reviews.map(r => (
                <div key={r.id} className="est-review">
                  <Avatar style={{ width: 38, height: 38, border: "2px solid #f0ece5", flexShrink: 0 }}>
                    <AvatarFallback style={{ background: "rgba(0,204,255,0.1)", color: "#007799", fontSize: "0.72rem", fontWeight: 700 }}>
                      {r.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="est-review-body">
                    <div className="est-review-head">
                      <span className="est-review-name">{r.userName}</span>
                      <span className="est-review-date">{r.createdAt.toDate().toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="est-review-stars"><Stars rating={r.rating}/></div>
                    <p className="est-review-text">{r.comment}</p>
                    {currentUser?.uid === r.userId && (
                      <div className="est-review-mine">
                        <button className="est-review-mine-btn edit" onClick={openForm}><Edit3 size={11}/> Editar</button>
                        <button className="est-review-mine-btn del" onClick={()=>setDeleteOpen(true)}><Trash2 size={11}/> Excluir</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="est-side-card">
            <div className="est-side-header"><Phone size={14} color="#00CCFF"/> Canais de Atendimento</div>
            <div className="est-side-body">
              <a href={`tel:${business.businessPhone}`} className="est-cta est-cta-gold"><Phone size={16}/> Ligar Agora</a>
              {business.whatsapp && (
                <a href={`https://wa.me/55${business.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="est-cta est-cta-gold">
                  <MessageSquare size={16}/> WhatsApp
                </a>
              )}
              <div style={{ height: 1, background: "#f0ece5", margin: "6px 0" }}/>
              {business.website && (
                <div className="est-info-row">
                  <div className="est-info-row-icon"><Globe size={13} color="#8a9aaa"/></div>
                  <a href={business.website} target="_blank" rel="noopener noreferrer" style={{ color: "#00CCFF", textDecoration: "none", fontSize: "0.82rem", fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {business.website.replace(/^https?:\/\//,'')}
                  </a>
                  <ArrowRight size={12} color="#b0bec5"/>
                </div>
              )}
              <div className="est-info-row">
                <div className="est-info-row-icon"><Phone size={13} color="#8a9aaa"/></div>
                <span>{business.businessPhone}</span>
              </div>
            </div>
          </div>

          <div className="est-side-card">
            <div className="est-side-header"><Clock size={14} color="#F7B000"/> Funcionamento</div>
            <div className="est-side-body">
              <div className="est-status-row">
                <div className={`est-status-dot ${business.isOpen ? "open" : "closed"}`}/>
                <div>
                  <div className={`est-status-text ${business.isOpen ? "open" : "closed"}`}>{business.isOpen ? "Aberto agora" : "Fechado agora"}</div>
                  {/* CORREÇÃO APLICADA AQUI: Adicionado optional chaining ?. para evitar erro se hours for undefined */}
                  <div className="est-hours-detail">{business.hours?.replace(/; /g,'\n') || "Horário não informado"}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="est-side-card">
            <div className="est-side-header"><MapPin size={14} color="#22c55e"/> Localização</div>
            <div className="est-map-wrap" style={{ position: "relative", zIndex: 0 }}>
              <MapContainer center={[business.location.latitude, business.location.longitude]} zoom={15} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false} zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={[business.location.latitude, business.location.longitude]}/>
              </MapContainer>
            </div>
            <div className="est-side-body">
              <p style={{ fontSize: "0.82rem", color: "#5a6878", marginBottom: "1rem" }}>{business.address}</p>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${business.location.latitude},${business.location.longitude}`} target="_blank" rel="noopener noreferrer" className="est-cta est-cta-gold">
                <Navigation size={15}/> Traçar Rota
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer/>

      {deleteOpen && (
        <div className="est-overlay" onClick={e=>{if(e.target===e.currentTarget)setDeleteOpen(false)}}>
          <div className="est-confirm-modal">
            <div className="est-confirm-icon"><Trash2 size={22} color="#dc2626"/></div>
            <div className="est-confirm-title">Excluir avaliação?</div>
            <div className="est-confirm-desc">Esta ação não pode ser desfeita.</div>
            <div className="est-confirm-btns">
              <button className="est-confirm-cancel" onClick={()=>setDeleteOpen(false)}>Cancelar</button>
              <button className="est-confirm-del" onClick={handleDeleteReview}><Trash2 size={14}/> Excluir</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="est-toast"><CheckCircle2 size={16} color="#22c55e"/> {toast}</div>
      )}
    </div></>
  );
}