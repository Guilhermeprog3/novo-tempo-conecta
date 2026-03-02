"use client"

import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Star, MessageSquare, TrendingUp } from "lucide-react"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, getDocs, orderBy, Timestamp } from 'firebase/firestore'

const EVAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

.eval {
  --navy: #002240;
  --gold: #F7B000;
  --cyan: #00CCFF;
  font-family: 'DM Sans', sans-serif;
}

/* ── SUMMARY BAR ────────────────────────────── */
.eval-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.eval-stat {
  background: #fff;
  border-radius: 16px;
  padding: 1.2rem 1.4rem;
  box-shadow: 0 2px 16px rgba(0,34,64,0.07);
  display: flex; align-items: center; gap: 12px;
}
.eval-stat-icon {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.eval-stat-num {
  font-family: 'Syne', sans-serif;
  font-size: 1.6rem; font-weight: 800;
  color: var(--navy); line-height: 1;
}
.eval-stat-label {
  font-size: 0.72rem; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: #b0bec5; margin-top: 3px;
}

/* ── MAIN CARD ──────────────────────────────── */
.eval-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 20px rgba(0,34,64,0.07);
  overflow: hidden;
}
.eval-card-header {
  padding: 1.2rem 1.6rem;
  border-bottom: 1px solid #f0ece5;
  display: flex; align-items: center; gap: 10px;
}
.eval-card-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(247,176,0,0.1);
  display: flex; align-items: center; justify-content: center;
}
.eval-card-title {
  font-family: 'Syne', sans-serif;
  font-size: 0.95rem; font-weight: 700;
  color: var(--navy);
}
.eval-card-sub { font-size: 0.75rem; color: #8a9aaa; margin-top: 1px; }

/* ── EMPTY STATE ────────────────────────────── */
.eval-empty {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 5rem 2rem; text-align: center;
}
.eval-empty-icon {
  width: 68px; height: 68px; border-radius: 50%;
  background: #f8f6f2;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1.2rem;
}
.eval-empty-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.1rem; font-weight: 700;
  color: var(--navy); margin-bottom: 6px;
}
.eval-empty-desc { font-size: 0.85rem; color: #8a9aaa; }

/* ── REVIEW ITEMS ───────────────────────────── */
.eval-list { padding: 0.5rem 0; }

.eval-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 1.3rem 1.6rem;
  border-bottom: 1px solid #f8f6f2;
  transition: background 0.15s;
}
.eval-item:last-child { border-bottom: none; }
.eval-item:hover { background: #fdfbf8; }

.eval-avatar { flex-shrink: 0; }

.eval-content { flex: 1; }

.eval-row {
  display: flex; align-items: center;
  justify-content: space-between; gap: 8px;
  margin-bottom: 5px;
}
.eval-name {
  font-family: 'Syne', sans-serif;
  font-size: 0.9rem; font-weight: 700;
  color: var(--navy);
}
.eval-date {
  font-size: 0.72rem; color: #b0bec5;
  white-space: nowrap;
}

.eval-stars {
  display: flex; align-items: center; gap: 2px;
  margin-bottom: 8px;
}

.eval-rating-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(247,176,0,0.1);
  border: 1px solid rgba(247,176,0,0.2);
  color: #a06000;
  font-size: 0.72rem; font-weight: 700;
  padding: 3px 8px; border-radius: 100px;
  margin-left: 8px;
}

.eval-comment {
  font-size: 0.87rem; color: #3a4a5a;
  line-height: 1.65; white-space: pre-wrap;
  background: #faf8f5;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  border-left: 3px solid rgba(0,204,255,0.2);
}

/* ── LOADING / ERROR ────────────────────────── */
.eval-loading {
  display: flex; align-items: center;
  justify-content: center; padding: 5rem;
  gap: 12px; color: #8a9aaa; font-size: 0.875rem;
}
.eval-error {
  background: rgba(239,68,68,0.05);
  border: 1px solid rgba(239,68,68,0.15);
  border-radius: 14px; padding: 1rem 1.4rem;
  color: #dc2626; font-size: 0.875rem;
  display: flex; align-items: center; gap: 8px;
  margin: 1.5rem;
}

@keyframes eval-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

@media (max-width: 640px) {
  .eval-summary { grid-template-columns: 1fr; }
}
`;

type Review = {
  id: string; userId: string; userName: string;
  userAvatar?: string; rating: number; comment: string; createdAt: Date;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="eval-stars">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={14}
          color={s <= rating ? "#F7B000" : "#e2e8f0"}
          fill={s <= rating ? "#F7B000" : "transparent"}
        />
      ))}
      <span className="eval-rating-badge">
        <Star size={9} fill="#a06000" color="#a06000" /> {rating.toFixed(1)}
      </span>
    </div>
  );
}

const getInitials = (name = "") =>
  name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??';

export default function EmpresarioAvaliacoesPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "businesses", user.uid, "reviews"), orderBy("createdAt", "desc"));
          const snap = await getDocs(q);
          setReviews(snap.docs.map(doc => {
            const d = doc.data();
            return {
              id: doc.id, userId: d.userId, userName: d.userName,
              userAvatar: d.userAvatar, rating: d.rating, comment: d.comment,
              createdAt: d.createdAt instanceof Timestamp ? d.createdAt.toDate() : new Date(),
            } as Review;
          }));
        } catch { setError("Não foi possível carregar as avaliações."); }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length)
    : 0;

  if (loading) return (
    <>
      <style>{EVAL_CSS}</style>
      <div className="eval-loading">
        <Loader2 size={28} color="#00CCFF" style={{ animation: "eval-spin 1s linear infinite" }} />
        Carregando avaliações...
      </div>
    </>
  );

  return (
    <>
      <style>{EVAL_CSS}</style>
      <div className="eval">

        {/* SUMMARY */}
        <div className="eval-summary">
          <div className="eval-stat">
            <div className="eval-stat-icon" style={{ background: "rgba(247,176,0,0.1)" }}>
              <Star size={18} color="#F7B000" fill="#F7B000" />
            </div>
            <div>
              <div className="eval-stat-num">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</div>
              <div className="eval-stat-label">Nota Média</div>
            </div>
          </div>
          <div className="eval-stat">
            <div className="eval-stat-icon" style={{ background: "rgba(0,204,255,0.1)" }}>
              <MessageSquare size={18} color="#00CCFF" />
            </div>
            <div>
              <div className="eval-stat-num">{reviews.length}</div>
              <div className="eval-stat-label">Avaliações</div>
            </div>
          </div>
          <div className="eval-stat">
            <div className="eval-stat-icon" style={{ background: "rgba(34,197,94,0.1)" }}>
              <TrendingUp size={18} color="#22c55e" />
            </div>
            <div>
              <div className="eval-stat-num">
                {reviews.filter(r => r.rating >= 4).length}
              </div>
              <div className="eval-stat-label">Positivas</div>
            </div>
          </div>
        </div>

        {/* REVIEWS LIST */}
        <div className="eval-card">
          <div className="eval-card-header">
            <div className="eval-card-icon">
              <Star size={17} color="#F7B000" fill="#F7B000" />
            </div>
            <div>
              <div className="eval-card-title">Avaliações Recebidas</div>
              <div className="eval-card-sub">O que os clientes estão dizendo sobre o seu negócio</div>
            </div>
          </div>

          {error ? (
            <div className="eval-error">{error}</div>
          ) : reviews.length === 0 ? (
            <div className="eval-empty">
              <div className="eval-empty-icon">
                <MessageSquare size={30} color="#d5d0c8" />
              </div>
              <div className="eval-empty-title">Nenhuma avaliação ainda</div>
              <div className="eval-empty-desc">Quando um cliente avaliar seu negócio, ela aparecerá aqui.</div>
            </div>
          ) : (
            <div className="eval-list">
              {reviews.map(review => (
                <div key={review.id} className="eval-item">
                  <div className="eval-avatar">
                    <Avatar style={{ width: 40, height: 40, border: "2px solid #f0ece5" }}>
                      <AvatarImage src={review.userAvatar} />
                      <AvatarFallback style={{ background: "rgba(0,204,255,0.08)", color: "#007799", fontSize: "0.72rem", fontWeight: 700 }}>
                        {getInitials(review.userName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="eval-content">
                    <div className="eval-row">
                      <div className="eval-name">{review.userName}</div>
                      <div className="eval-date">{review.createdAt.toLocaleDateString('pt-BR')}</div>
                    </div>
                    <StarRating rating={review.rating} />
                    {review.comment && (
                      <div className="eval-comment">{review.comment}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}