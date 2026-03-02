"use client"

import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Loader2, Star, MessageSquare, Trash2, Edit3,
  Store, TrendingUp, ChevronRight, AlertTriangle, X, Save
} from "lucide-react"
import Link from "next/link"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  collection, query, getDocs, doc, deleteDoc,
  updateDoc, orderBy, Timestamp, collectionGroup, where
} from 'firebase/firestore'
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Shield, Heart } from "lucide-react"

// ─── CSS ──────────────────────────────────────────────────────────────────────
const UREV_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.urev {
  --navy: #002240;
  --gold: #F7B000;
  --cyan: #00CCFF;
  --rose: #E91E8C;
  --bg: #F4F1EC;
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  min-height: 100vh;
}

/* ── HERO ──────────────────────────────────── */
.urev-hero {
  background: var(--navy);
  padding: 2.5rem 1.5rem 5rem;
  position: relative; overflow: hidden;
}
.urev-hero-orb1 {
  position: absolute; border-radius: 50%; pointer-events: none;
  width: 500px; height: 500px;
  background: var(--gold); opacity: 0.08; filter: blur(90px);
  top: -180px; right: -80px;
}
.urev-hero-orb2 {
  position: absolute; border-radius: 50%; pointer-events: none;
  width: 380px; height: 380px;
  background: var(--cyan); opacity: 0.07; filter: blur(80px);
  bottom: -150px; left: -60px;
}
.urev-hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 56px 56px;
}
.urev-hero-inner {
  max-width: 1000px; margin: 0 auto;
  position: relative; z-index: 1;
}
.urev-hero-eyebrow {
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(0,204,255,0.7); margin-bottom: 6px;
}
.urev-hero-title {
  font-family: 'Syne', sans-serif;
  font-size: 2rem; font-weight: 800;
  color: #fff; margin-bottom: 4px;
}
.urev-hero-sub {
  font-size: 0.875rem; color: rgba(255,255,255,0.5); font-weight: 300;
}

/* ── LAYOUT ────────────────────────────────── */
.urev-body {
  max-width: 1000px;
  margin: -3rem auto 0;
  padding: 0 1.5rem 4rem;
  position: relative; z-index: 10;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.5rem;
  align-items: start;
}

/* ── SUMMARY STRIP ─────────────────────────── */
.urev-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.urev-stat {
  background: #fff;
  border-radius: 16px;
  padding: 1.1rem 1.3rem;
  box-shadow: 0 2px 16px rgba(0,34,64,0.07);
  display: flex; align-items: center; gap: 12px;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
}
.urev-stat:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,34,64,0.1);
}
.urev-stat-icon {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.urev-stat-num {
  font-family: 'Syne', sans-serif;
  font-size: 1.7rem; font-weight: 800;
  color: var(--navy); line-height: 1;
}
.urev-stat-label {
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.09em; text-transform: uppercase;
  color: #b0bec5; margin-top: 3px;
}

/* ── MAIN CARD ─────────────────────────────── */
.urev-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 20px rgba(0,34,64,0.07);
  overflow: hidden;
}
.urev-card-header {
  padding: 1.2rem 1.6rem;
  border-bottom: 1px solid #f0ece5;
  display: flex; align-items: center; gap: 10px;
}
.urev-card-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(247,176,0,0.1);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.urev-card-title {
  font-family: 'Syne', sans-serif;
  font-size: 0.95rem; font-weight: 700;
  color: var(--navy);
}
.urev-card-sub { font-size: 0.75rem; color: #8a9aaa; margin-top: 1px; }
.urev-card-count {
  margin-left: auto;
  font-size: 0.72rem; font-weight: 700;
  color: #b0bec5;
  background: #f8f6f2;
  padding: 3px 10px; border-radius: 100px;
}

/* ── EMPTY STATE ───────────────────────────── */
.urev-empty {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 5rem 2rem; text-align: center;
}
.urev-empty-icon {
  width: 72px; height: 72px; border-radius: 50%;
  background: #f8f6f2;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1.2rem;
}
.urev-empty-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.1rem; font-weight: 700;
  color: var(--navy); margin-bottom: 6px;
}
.urev-empty-desc { font-size: 0.85rem; color: #8a9aaa; margin-bottom: 1.5rem; }
.urev-explore-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 11px 22px; border-radius: 12px;
  background: var(--navy); color: #fff;
  font-family: 'Syne', sans-serif;
  font-size: 0.85rem; font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(0,34,64,0.2);
}
.urev-explore-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,34,64,0.25); }

/* ── REVIEW ITEMS ──────────────────────────── */
.urev-item {
  padding: 1.4rem 1.6rem;
  border-bottom: 1px solid #f8f6f2;
  transition: background 0.15s;
}
.urev-item:last-child { border-bottom: none; }
.urev-item:hover { background: #fdfbf8; }

.urev-item-top {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 12px;
  margin-bottom: 0.9rem;
}
.urev-business-row {
  display: flex; align-items: center; gap: 10px;
}
.urev-business-icon {
  width: 38px; height: 38px; border-radius: 11px;
  background: #f8f6f2; border: 1.5px solid #f0ece5;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.urev-business-name {
  font-family: 'Syne', sans-serif;
  font-size: 0.92rem; font-weight: 700;
  color: var(--navy);
}
.urev-business-cat {
  font-size: 0.72rem; color: #8a9aaa; margin-top: 1px;
}

.urev-actions {
  display: flex; gap: 6px; flex-shrink: 0;
}
.urev-icon-btn {
  width: 32px; height: 32px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  background: #f8f6f2; border: none; cursor: pointer;
  color: #b0bec5; transition: background 0.15s, color 0.15s;
}
.urev-icon-btn.edit:hover { background: rgba(0,204,255,0.1); color: #00CCFF; }
.urev-icon-btn.del:hover { background: rgba(239,68,68,0.08); color: #ef4444; }

/* Stars row */
.urev-stars-row {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 0.75rem;
}
.urev-stars { display: flex; gap: 2px; }
.urev-rating-badge {
  font-size: 0.72rem; font-weight: 700;
  color: #a06000;
  background: rgba(247,176,0,0.1);
  border: 1px solid rgba(247,176,0,0.2);
  padding: 2px 8px; border-radius: 100px;
  display: inline-flex; align-items: center; gap: 3px;
}
.urev-date {
  font-size: 0.72rem; color: #c0cad5;
  margin-left: auto;
}

/* Comment bubble */
.urev-comment {
  font-size: 0.875rem; color: #3a4a5a;
  line-height: 1.65;
  background: #faf8f5;
  border-radius: 12px;
  padding: 0.85rem 1rem;
  border-left: 3px solid rgba(0,204,255,0.25);
}

/* Business link */
.urev-business-link {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 0.75rem; font-weight: 600;
  color: #00CCFF; text-decoration: none; margin-top: 0.75rem;
  transition: gap 0.15s;
}
.urev-business-link:hover { gap: 8px; }

/* ── EDIT MODAL ────────────────────────────── */
.urev-overlay {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
  animation: urev-fade 0.15s ease;
}
@keyframes urev-fade { from{opacity:0} to{opacity:1} }

.urev-modal {
  background: #fff;
  border-radius: 22px;
  width: 100%; max-width: 460px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.18);
  overflow: hidden;
  animation: urev-slide 0.22s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes urev-slide { from{transform:translateY(18px);opacity:0} to{transform:translateY(0);opacity:1} }

.urev-modal-header {
  padding: 1.4rem 1.6rem;
  border-bottom: 1px solid #f0ece5;
  display: flex; align-items: center;
  justify-content: space-between;
}
.urev-modal-title {
  font-family: 'Syne', sans-serif;
  font-size: 1rem; font-weight: 800;
  color: var(--navy);
}
.urev-modal-close {
  width: 32px; height: 32px; border-radius: 9px;
  background: #f8f6f2; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #8a9aaa;
  transition: background 0.15s, color 0.15s;
}
.urev-modal-close:hover { background: #f0ece5; color: var(--navy); }

.urev-modal-body { padding: 1.5rem 1.6rem; }

/* Star picker */
.urev-star-picker {
  display: flex; align-items: center; gap: 6px;
  margin-bottom: 1.2rem;
}
.urev-star-pick {
  background: none; border: none;
  cursor: pointer; padding: 2px;
  transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
}
.urev-star-pick:hover { transform: scale(1.25); }

.urev-textarea-label {
  font-size: 0.72rem; font-weight: 700;
  color: #5a6878; letter-spacing: 0.05em;
  text-transform: uppercase; margin-bottom: 7px;
  display: block;
}
.urev-textarea {
  width: 100%; padding: 12px 14px;
  background: #f8f6f2;
  border: 1.5px solid #ede9e0;
  border-radius: 13px;
  font-size: 0.875rem;
  font-family: 'DM Sans', sans-serif;
  color: var(--navy); outline: none; resize: vertical;
  transition: border-color 0.2s, background 0.2s;
}
.urev-textarea:focus { border-color: var(--cyan); background: #fff; }

.urev-modal-footer {
  padding: 1rem 1.6rem 1.4rem;
  display: flex; gap: 10px; justify-content: flex-end;
  border-top: 1px solid #f0ece5;
}
.urev-modal-cancel {
  padding: 10px 20px; border-radius: 11px;
  background: #f8f6f2; border: 1.5px solid #ede9e0;
  color: #5a6878; font-size: 0.85rem; font-weight: 600;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: background 0.15s;
}
.urev-modal-cancel:hover { background: #f0ece5; }
.urev-modal-save {
  padding: 10px 22px; border-radius: 11px;
  background: var(--navy); border: none;
  color: var(--cyan); font-size: 0.85rem; font-weight: 700;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  display: inline-flex; align-items: center; gap: 6px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(0,34,64,0.2);
}
.urev-modal-save:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(0,34,64,0.28); }
.urev-modal-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* ── DELETE CONFIRM ────────────────────────── */
.urev-confirm-overlay {
  position: fixed; inset: 0; z-index: 60;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
  animation: urev-fade 0.15s ease;
}
.urev-confirm-modal {
  background: #fff;
  border-radius: 20px;
  width: 100%; max-width: 380px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
  overflow: hidden;
  animation: urev-slide 0.2s cubic-bezier(0.34,1.56,0.64,1);
  padding: 1.8rem;
  text-align: center;
}
.urev-confirm-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: rgba(239,68,68,0.08);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1rem;
}
.urev-confirm-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.05rem; font-weight: 800;
  color: var(--navy); margin-bottom: 6px;
}
.urev-confirm-desc { font-size: 0.83rem; color: #6b7280; line-height: 1.55; margin-bottom: 1.4rem; }
.urev-confirm-btns { display: flex; gap: 10px; }
.urev-confirm-cancel {
  flex: 1; padding: 11px;
  background: #f8f6f2; border: 1.5px solid #ede9e0;
  border-radius: 12px; color: #5a6878;
  font-size: 0.85rem; font-weight: 600;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
}
.urev-confirm-del {
  flex: 1; padding: 11px;
  background: #dc2626; border: none;
  border-radius: 12px; color: #fff;
  font-size: 0.85rem; font-weight: 700;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  display: flex; align-items: center;
  justify-content: center; gap: 6px;
  transition: background 0.15s;
}
.urev-confirm-del:hover { background: #b91c1c; }
.urev-confirm-del:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── SIDEBAR ───────────────────────────────── */
.urev-nav-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 20px rgba(0,34,64,0.07);
  overflow: hidden;
  margin-bottom: 1.25rem;
}
.urev-nav-header {
  background: #faf8f5;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f0ece5;
  font-family: 'Syne', sans-serif;
  font-size: 0.85rem; font-weight: 700;
  color: var(--navy);
}
.urev-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 0.85rem 1.25rem;
  font-size: 0.875rem; font-weight: 500;
  color: #5a6878; text-decoration: none;
  border-bottom: 1px solid #f8f6f2;
  transition: background 0.15s, color 0.15s;
}
.urev-nav-item:last-child { border-bottom: none; }
.urev-nav-item:hover { background: rgba(0,204,255,0.06); color: var(--navy); }
.urev-nav-item.active {
  background: rgba(0,204,255,0.08);
  color: var(--navy); font-weight: 600;
}
.urev-nav-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--cyan); margin-left: auto; flex-shrink: 0;
}

.urev-tip-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 20px rgba(0,34,64,0.07);
  overflow: hidden;
}
.urev-tip-header {
  background: rgba(247,176,0,0.07);
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(247,176,0,0.12);
}
.urev-tip-title {
  font-family: 'Syne', sans-serif;
  font-size: 0.85rem; font-weight: 700;
  color: var(--navy);
  display: flex; align-items: center; gap: 7px;
}
.urev-tip-body { padding: 1rem 1.25rem; }
.urev-tip-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 0.6rem 0;
  border-bottom: 1px solid #f8f6f2;
  font-size: 0.8rem; color: #5a6878; line-height: 1.5;
}
.urev-tip-item:last-child { border-bottom: none; }
.urev-tip-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--gold); flex-shrink: 0; margin-top: 7px;
}

/* ── LOADING ───────────────────────────────── */
.urev-loading {
  min-height: 100vh; display: flex;
  align-items: center; justify-content: center;
  background: var(--bg);
}
@keyframes urev-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

@media (max-width: 768px) {
  .urev-body { grid-template-columns: 1fr; margin-top: -1.5rem; }
  .urev-summary { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 480px) {
  .urev-summary { grid-template-columns: 1fr; }
}
`;

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Review = {
  id: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

// ─── STAR RATING DISPLAY ──────────────────────────────────────────────────────
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="urev-stars">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={size}
          color={s <= rating ? "#F7B000" : "#e2e8f0"}
          fill={s <= rating ? "#F7B000" : "transparent"}
        />
      ))}
    </div>
  );
}

// ─── STAR PICKER (edit modal) ─────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="urev-star-picker">
      {[1, 2, 3, 4, 5].map(s => {
        const active = s <= (hovered || value);
        return (
          <button key={s} type="button" className="urev-star-pick"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(s)}
          >
            <Star size={28} color={active ? "#F7B000" : "#e2e8f0"} fill={active ? "#F7B000" : "transparent"} />
          </button>
        );
      })}
      {value > 0 && (
        <span style={{ fontSize: "0.82rem", color: "#a06000", fontWeight: 700, marginLeft: 4 }}>
          {["", "Ruim", "Regular", "Bom", "Muito bom", "Excelente"][value]}
        </span>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function UsuarioAvaliacoesPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { window.location.href = '/login'; return; }
      try {
        // Busca avaliações do usuário via collectionGroup
        const q = query(
          collectionGroup(db, "reviews"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);

        const fetched: Review[] = snap.docs.map(docSnap => {
          const d = docSnap.data();
          // O path é: businesses/{businessId}/reviews/{reviewId}
          const businessId = docSnap.ref.parent.parent?.id || "";
          return {
            id: docSnap.id,
            businessId,
            businessName: d.businessName || "Estabelecimento",
            businessCategory: d.businessCategory || d.category || "",
            rating: d.rating,
            comment: d.comment,
            createdAt: d.createdAt instanceof Timestamp ? d.createdAt.toDate() : new Date(),
          };
        });
        setReviews(fetched);
      } catch (e) {
        console.error("Erro ao buscar avaliações:", e);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // ── OPEN EDIT ──
  const openEdit = (r: Review) => {
    setEditingReview(r);
    setEditRating(r.rating);
    setEditComment(r.comment);
  };

  // ── SAVE EDIT ──
  const handleSaveEdit = async () => {
    if (!editingReview) return;
    setSaving(true);
    try {
      const ref = doc(db, "businesses", editingReview.businessId, "reviews", editingReview.id);
      await updateDoc(ref, { rating: editRating, comment: editComment });
      setReviews(prev => prev.map(r =>
        r.id === editingReview.id ? { ...r, rating: editRating, comment: editComment } : r
      ));
      setEditingReview(null);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  // ── DELETE ──
  const handleDelete = async () => {
    if (!deletingId) return;
    const r = reviews.find(r => r.id === deletingId);
    if (!r) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "businesses", r.businessId, "reviews", r.id));
      setReviews(prev => prev.filter(x => x.id !== deletingId));
      setDeletingId(null);
    } catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length)
    : 0;

  const navItems = [
    { href: "/usuario/dashboard", label: "Meu Perfil", icon: <Edit3 size={16} /> },
    { href: "/usuario/avaliacoes", label: "Minhas Avaliações", icon: <Star size={16} color="#F7B000" />, active: true },
    { href: "/usuario/favoritos", label: "Locais Favoritos", icon: <Heart size={16} color="#ef4444" /> },
    { href: "/usuario/configuracoes", label: "Configurações", icon: <Shield size={16} /> },
  ];

  if (loading) return (
    <>
      <style>{UREV_CSS}</style>
      <div className="urev-loading">
        <Loader2 style={{ width: 40, height: 40, color: "#00CCFF", animation: "urev-spin 1s linear infinite" }} />
      </div>
    </>
  );

  return (
    <>
      <style>{UREV_CSS}</style>
      <div className="urev">
        <Header />

        {/* HERO */}
        <div className="urev-hero">
          <div className="urev-hero-orb1" /><div className="urev-hero-orb2" /><div className="urev-hero-grid" />
          <div className="urev-hero-inner">
            <div className="urev-hero-eyebrow">Área do Usuário</div>
            <div className="urev-hero-title">Minhas Avaliações</div>
            <div className="urev-hero-sub">Gerencie as avaliações que você fez nos estabelecimentos</div>
          </div>
        </div>

        <div className="urev-body">

          {/* COLUNA PRINCIPAL */}
          <div>
            {/* SUMMARY */}
            <div className="urev-summary">
              <div className="urev-stat">
                <div className="urev-stat-icon" style={{ background: "rgba(0,204,255,0.1)" }}>
                  <MessageSquare size={18} color="#00CCFF" />
                </div>
                <div>
                  <div className="urev-stat-num">{reviews.length}</div>
                  <div className="urev-stat-label">Avaliações</div>
                </div>
              </div>
              <div className="urev-stat">
                <div className="urev-stat-icon" style={{ background: "rgba(247,176,0,0.1)" }}>
                  <Star size={18} color="#F7B000" fill="#F7B000" />
                </div>
                <div>
                  <div className="urev-stat-num">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</div>
                  <div className="urev-stat-label">Nota Média</div>
                </div>
              </div>
              <div className="urev-stat">
                <div className="urev-stat-icon" style={{ background: "rgba(34,197,94,0.1)" }}>
                  <TrendingUp size={18} color="#22c55e" />
                </div>
                <div>
                  <div className="urev-stat-num">{reviews.filter(r => r.rating >= 4).length}</div>
                  <div className="urev-stat-label">Positivas</div>
                </div>
              </div>
            </div>

            {/* LIST CARD */}
            <div className="urev-card">
              <div className="urev-card-header">
                <div className="urev-card-icon">
                  <Star size={17} color="#F7B000" fill="#F7B000" />
                </div>
                <div>
                  <div className="urev-card-title">Histórico de Avaliações</div>
                  <div className="urev-card-sub">Clique em editar para atualizar uma avaliação</div>
                </div>
                <div className="urev-card-count">{reviews.length} {reviews.length === 1 ? "item" : "itens"}</div>
              </div>

              {reviews.length === 0 ? (
                <div className="urev-empty">
                  <div className="urev-empty-icon">
                    <MessageSquare size={30} color="#d5d0c8" />
                  </div>
                  <div className="urev-empty-title">Nenhuma avaliação ainda</div>
                  <div className="urev-empty-desc">
                    Visite um estabelecimento e deixe sua opinião para ajudar a comunidade.
                  </div>
                  <Link href="/busca" className="urev-explore-btn">
                    Explorar Estabelecimentos <ChevronRight size={15} />
                  </Link>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="urev-item">
                    <div className="urev-item-top">
                      <div className="urev-business-row">
                        <div className="urev-business-icon">
                          <Store size={16} color="#b0a898" />
                        </div>
                        <div>
                          <div className="urev-business-name">{review.businessName}</div>
                          {review.businessCategory && (
                            <div className="urev-business-cat">{review.businessCategory}</div>
                          )}
                        </div>
                      </div>
                      <div className="urev-actions">
                        <button className="urev-icon-btn edit" onClick={() => openEdit(review)} title="Editar avaliação">
                          <Edit3 size={14} />
                        </button>
                        <button className="urev-icon-btn del" onClick={() => setDeletingId(review.id)} title="Excluir avaliação">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="urev-stars-row">
                      <Stars rating={review.rating} />
                      <span className="urev-rating-badge">
                        <Star size={9} fill="#a06000" color="#a06000" /> {review.rating.toFixed(1)}
                      </span>
                      <span className="urev-date">
                        {review.createdAt.toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    {review.comment && (
                      <div className="urev-comment">{review.comment}</div>
                    )}

                    <Link href={`/estabelecimento/${review.businessId}`} className="urev-business-link">
                      Ver estabelecimento <ChevronRight size={12} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div>
            <div className="urev-nav-card">
              <div className="urev-nav-header">Navegação</div>
              {navItems.map(item => (
                <Link key={item.href} href={item.href} className={`urev-nav-item${item.active ? " active" : ""}`}>
                  {item.icon}
                  {item.label}
                  {item.active && <div className="urev-nav-dot" />}
                </Link>
              ))}
            </div>

            <div className="urev-tip-card">
              <div className="urev-tip-header">
                <div className="urev-tip-title">
                  <Star size={14} color="#F7B000" fill="#F7B000" />
                  Dicas para Avaliar
                </div>
              </div>
              <div className="urev-tip-body">
                {[
                  "Seja específico sobre sua experiência",
                  "Mencione pontos positivos e negativos",
                  "Avalie com base na sua visita mais recente",
                  "Sua opinião ajuda toda a comunidade",
                ].map((tip, i) => (
                  <div key={i} className="urev-tip-item">
                    <div className="urev-tip-dot" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Footer />

        {/* ── EDIT MODAL ── */}
        {editingReview && (
          <div className="urev-overlay" onClick={e => { if (e.target === e.currentTarget) setEditingReview(null); }}>
            <div className="urev-modal">
              <div className="urev-modal-header">
                <div className="urev-modal-title">Editar Avaliação</div>
                <button className="urev-modal-close" onClick={() => setEditingReview(null)}>
                  <X size={16} />
                </button>
              </div>

              <div className="urev-modal-body">
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "0.8rem 1rem", background: "#faf8f5",
                  borderRadius: 12, marginBottom: "1.2rem"
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: "#f0ece5", display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <Store size={15} color="#b0a898" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "#002240" }}>
                      {editingReview.businessName}
                    </div>
                    {editingReview.businessCategory && (
                      <div style={{ fontSize: "0.72rem", color: "#8a9aaa" }}>{editingReview.businessCategory}</div>
                    )}
                  </div>
                </div>

                <label className="urev-textarea-label">Sua Nota</label>
                <StarPicker value={editRating} onChange={setEditRating} />

                <label className="urev-textarea-label" style={{ marginTop: "0.8rem" }}>Comentário</label>
                <textarea
                  className="urev-textarea"
                  rows={4}
                  value={editComment}
                  onChange={e => setEditComment(e.target.value)}
                  placeholder="Conte sua experiência..."
                />
              </div>

              <div className="urev-modal-footer">
                <button className="urev-modal-cancel" onClick={() => setEditingReview(null)}>Cancelar</button>
                <button className="urev-modal-save" onClick={handleSaveEdit} disabled={saving || editRating === 0}>
                  {saving
                    ? <Loader2 size={15} style={{ animation: "urev-spin 1s linear infinite" }} />
                    : <Save size={15} />}
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── DELETE CONFIRM ── */}
        {deletingId && (
          <div className="urev-confirm-overlay" onClick={e => { if (e.target === e.currentTarget) setDeletingId(null); }}>
            <div className="urev-confirm-modal">
              <div className="urev-confirm-icon">
                <AlertTriangle size={24} color="#dc2626" />
              </div>
              <div className="urev-confirm-title">Excluir avaliação?</div>
              <div className="urev-confirm-desc">
                Esta ação é irreversível. A avaliação será removida permanentemente do estabelecimento.
              </div>
              <div className="urev-confirm-btns">
                <button className="urev-confirm-cancel" onClick={() => setDeletingId(null)}>Cancelar</button>
                <button className="urev-confirm-del" onClick={handleDelete} disabled={deleting}>
                  {deleting
                    ? <Loader2 size={14} style={{ animation: "urev-spin 1s linear infinite" }} />
                    : <Trash2 size={14} />}
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}