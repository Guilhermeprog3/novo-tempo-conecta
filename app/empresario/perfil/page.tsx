"use client"

import React, { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { auth, db, storage } from "@/lib/firebase" // Certifique-se que 'storage' é exportado em @/lib/firebase
import {
  Loader2, Save, Edit3, Building2, Tag, AlignLeft,
  Phone, MessageCircle, Globe, MapPin, Clock, Store,
  CheckCircle2, XCircle, ImagePlus, Trash2, Camera,
  Upload, Star, Images
} from "lucide-react"

const ProfileMapNoSSR = dynamic(() => import("./ProfileMapComponent"), { ssr: false })

const EMP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
.emp { --navy:#002240;--gold:#F7B000;--cyan:#00CCFF;--bg:#F4F1EC; font-family:'DM Sans',sans-serif; background:var(--bg);min-height:100vh; }
.emp-hero { background:var(--navy);padding:2.5rem 1.5rem 5rem;position:relative;overflow:hidden; }
.emp-hero-orb1 { position:absolute;border-radius:50%;pointer-events:none;width:500px;height:500px;background:var(--cyan);opacity:0.07;filter:blur(90px);top:-180px;right:-100px; }
.emp-hero-orb2 { position:absolute;border-radius:50%;pointer-events:none;width:350px;height:350px;background:var(--gold);opacity:0.08;filter:blur(80px);bottom:-140px;left:-60px; }
.emp-hero-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);background-size:56px 56px; }
.emp-hero-inner { max-width:980px;margin:0 auto;position:relative;z-index:1;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap; }
.emp-hero-eyebrow { font-size:0.67rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(0,204,255,0.65);margin-bottom:6px; }
.emp-hero-title { font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:#fff;margin-bottom:4px;line-height:1.15; }
.emp-hero-sub { font-size:0.85rem;color:rgba(255,255,255,0.45);font-weight:300; }
.emp-body { max-width:980px;margin:-3rem auto 0;padding:0 1.5rem 4rem;position:relative;z-index:10; }
.emp-card { background:#fff;border-radius:20px;box-shadow:0 2px 20px rgba(0,34,64,0.07);overflow:hidden;margin-bottom:1.5rem;border:1px solid #f0ece5; }
.emp-card-header { padding:1.2rem 1.6rem;border-bottom:1px solid #f0ece5;display:flex;align-items:center;justify-content:space-between;gap:12px; }
.emp-card-title-wrap { display:flex;align-items:center;gap:10px; }
.emp-card-icon { width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.emp-card-title { font-family:'Syne',sans-serif;font-size:0.95rem;font-weight:700;color:var(--navy); }
.emp-card-sub { font-size:0.75rem;color:#8a9aaa;margin-top:2px; }
.emp-info-grid { display:grid;grid-template-columns:1fr 1fr;gap:0; }
.emp-info-item { display:flex;align-items:flex-start;gap:14px;padding:1.3rem 1.6rem;border-bottom:1px solid #f8f6f2;border-right:1px solid #f8f6f2; }
.emp-info-item:nth-child(even) { border-right:none; }
.emp-info-item.full { grid-column:1/-1;border-right:none; }
.emp-info-icon { width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px; }
.emp-info-label { font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#b0bec5;margin-bottom:4px; }
.emp-info-value { font-size:0.9rem;color:var(--navy);font-weight:500;line-height:1.45; }
.emp-form-grid { display:grid;grid-template-columns:1fr 1fr;gap:1.1rem;padding:1.5rem 1.6rem; }
.emp-field label { display:block;font-size:0.7rem;font-weight:700;color:#5a6878;margin-bottom:5px;letter-spacing:0.06em;text-transform:uppercase; }
.emp-field input,.emp-field textarea,.emp-field select { width:100%;padding:10px 14px;background:#f8f6f2;border:1.5px solid #ede9e0;border-radius:12px;font-size:0.875rem;font-family:'DM Sans',sans-serif;color:var(--navy);outline:none;transition:border-color 0.2s,background 0.2s;resize:vertical; }
.emp-field input { height:44px; }
.emp-field.full { grid-column:1/-1; }
.emp-btn { display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:12px;font-size:0.83rem;font-weight:700;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s,background 0.15s; }
.emp-btn-gold { background:var(--gold);color:var(--navy);box-shadow:0 4px 16px rgba(247,176,0,0.28); }
.emp-btn-green { background:#22c55e;color:#fff;box-shadow:0 4px 14px rgba(34,197,94,0.28); }
.emp-btn-ghost { background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.65);border:1.5px solid rgba(255,255,255,0.15); }
.emp-hours-summary { display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:100px;font-size:0.72rem;font-weight:700;margin-bottom:1.1rem; }
.emp-hours-grid { display:grid;grid-template-columns:repeat(7,1fr);gap:8px; }
.emp-hour-chip { border-radius:13px;padding:10px 6px;text-align:center;border:1.5px solid #f0ece5;background:#faf8f5; }
.emp-hour-chip.open { background:rgba(0,204,255,0.04);border-color:rgba(0,204,255,0.25); }
.emp-hour-day { font-size:0.62rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px; }
.emp-hour-status { display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;margin:0 auto 6px; }
.emp-hour-time { font-size:0.65rem;font-weight:600;color:#3a4a5a;line-height:1.65; }
.emp-hours-edit-grid { display:grid;grid-template-columns:repeat(7,1fr);gap:8px; }
.emp-day-edit { border-radius:13px;padding:10px 8px;border:1.5px solid #f0ece5;background:#faf8f5;transition:border-color 0.2s; }
.emp-day-edit.active { border-color:rgba(0,204,255,0.35);background:rgba(0,204,255,0.04); }
.emp-day-edit-head { display:flex;align-items:center;gap:6px;margin-bottom:8px; }
.emp-day-edit-lbl { font-size:0.62rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;color:#3a4a5a; }
.emp-day-toggle { width:20px;height:20px;border-radius:6px;border:2px solid #ddd;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.15s; }
.emp-day-toggle.on { background:var(--cyan);border-color:var(--cyan); }
.emp-time-inp { width:100%;height:32px;padding:0 6px;background:#fff;border:1.5px solid #ede9e0;border-radius:8px;font-size:0.72rem;font-family:'DM Sans',sans-serif;color:var(--navy);outline:none;margin-bottom:4px; }
.emp-map-wrap { border-radius:16px;overflow:hidden;height:320px;background:#f0ece5; }
.emp-img-body { padding:1.5rem 1.6rem; }
.emp-img-section-label { font-size:0.7rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8a9aaa;margin-bottom:12px;display:flex;align-items:center;gap:6px; }
.emp-img-section-label span { margin-left:auto;font-weight:500;color:#b0bec5;text-transform:none;letter-spacing:0; }
.emp-cover-wrap { position:relative;margin-bottom:1.6rem; }
.emp-cover { width:100%;height:200px;border-radius:16px;object-fit:cover;display:block;border:2px solid #f0ece5; }
.emp-cover-empty { width:100%;height:200px;border-radius:16px;background:linear-gradient(135deg,#f8f6f2,#ede9e0);border:2px dashed #ddd;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px; }
.emp-cover-badge { position:absolute;top:12px;left:12px;display:inline-flex;align-items:center;gap:5px;background:rgba(247,176,0,0.9);color:#002240;padding:4px 10px;border-radius:100px;font-size:0.68rem;font-weight:800; }
.emp-cover-overlay { position:absolute;inset:0;border-radius:16px;background:rgba(0,0,0,0.4);display:flex;align-items:flex-end;padding:14px 16px;gap:8px;opacity:0;transition:opacity 0.2s; }
.emp-cover-wrap:hover .emp-cover-overlay { opacity:1; }
.emp-gallery { display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px; }
.emp-gallery-item { position:relative;border-radius:13px;overflow:hidden;aspect-ratio:1;border:2px solid #f0ece5; }
.emp-gallery-img { width:100%;height:100%;object-fit:cover;display:block; }
.emp-gallery-del-overlay { position:absolute;inset:0;background:rgba(0,0,0,0.42);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s; }
.emp-gallery-item:hover .emp-gallery-del-overlay { opacity:1; }
.emp-gallery-del { width:36px;height:36px;border-radius:10px;background:#ef4444;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center; }
.emp-upload-zone { border:2px dashed #ddd;border-radius:13px;padding:1.5rem;text-align:center;cursor:pointer;background:#faf8f5; }
.emp-upload-zone:hover,.emp-upload-zone.drag { border-color:var(--cyan);background:rgba(0,204,255,0.03); }
.emp-upload-zone-icon { width:44px;height:44px;border-radius:14px;background:rgba(0,204,255,0.08);display:flex;align-items:center;justify-content:center;margin:0 auto 10px; }
.emp-img-btn { display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:10px;font-size:0.78rem;font-weight:700;cursor:pointer;border:none; }
.emp-img-btn-cyan { background:rgba(0,204,255,0.1);color:var(--cyan);border:1px solid rgba(0,204,255,0.2); }
.emp-img-btn-red { background:rgba(239,68,68,0.07);color:#dc2626;border:1px solid rgba(239,68,68,0.15); }
.emp-uploading { display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:11px;background:rgba(0,204,255,0.06);margin-bottom:10px;font-size:0.8rem; }
.emp-img-empty { text-align:center;padding:2rem;color:#b0bec5;font-size:0.82rem; }
.emp-loading { min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg); }
@keyframes emp-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
@media(max-width:768px){ .emp-info-grid{grid-template-columns:1fr;} .emp-form-grid{grid-template-columns:1fr;} .emp-hours-grid,.emp-hours-edit-grid{grid-template-columns:repeat(4,1fr);} }
`

type OpeningHour = { day: string; opens: string; closes: string; isOpen: boolean }
type BusinessData = {
  businessName: string; category: string; description: string;
  businessPhone: string; whatsapp: string; website: string;
  address: string; openingHours?: OpeningHour[];
  coverImage?: string; galleryImages?: string[];
  [key: string]: any
}

const ALL_DAYS = [
  { short: "Seg", full: "Segunda-feira" }, { short: "Ter", full: "Terça-feira" },
  { short: "Qua", full: "Quarta-feira" }, { short: "Qui", full: "Quinta-feira" },
  { short: "Sex", full: "Sexta-feira" }, { short: "Sáb", full: "Sábado" },
  { short: "Dom", full: "Domingo" },
]

function HoursDisplay({ openingHours }: { openingHours?: OpeningHour[] }) {
  const count = openingHours?.length || 0
  const getHour = (short: string, full: string) =>
    openingHours?.find(h =>
      h.day?.toLowerCase().startsWith(short.toLowerCase().slice(0, 3)) ||
      full.toLowerCase().startsWith(h.day?.toLowerCase().slice(0, 3) || "_")
    ) || null
  return (
    <div style={{ padding: "0 1.6rem 1.6rem" }}>
      <div className="emp-hours-summary" style={{ background: count > 0 ? "rgba(34,197,94,0.09)" : "rgba(176,190,197,0.12)", color: count > 0 ? "#16a34a" : "#8a9aaa", border: `1px solid ${count > 0 ? "rgba(34,197,94,0.22)" : "rgba(176,190,197,0.2)"}` }}>
        <Clock size={11} />
        {count > 0 ? `${count} dia${count !== 1 ? "s" : ""} com atendimento` : "Horários não configurados"}
      </div>
      <div className="emp-hours-grid">
        {ALL_DAYS.map(({ short, full }) => {
          const h = getHour(short, full); const isOpen = !!h
          return (
            <div key={short} className={`emp-hour-chip ${isOpen ? "open" : "closed"}`}>
              <div className={`emp-hour-day ${isOpen ? "open" : "closed"}`}>{short}</div>
              <div className="emp-hour-status" style={{ background: isOpen ? "rgba(34,197,94,0.1)" : "rgba(176,190,197,0.1)" }}>
                {isOpen ? <CheckCircle2 size={13} color="#22c55e" /> : <XCircle size={13} color="#c8d4dc" />}
              </div>
              {isOpen && h ? <div className="emp-hour-time">{h.opens}<br />{h.closes}</div> : <div className="emp-hour-closed-lbl">Fechado</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HoursEditor({ openingHours, onChange }: { openingHours: OpeningHour[]; onChange: (h: OpeningHour[]) => void }) {
  const [days, setDays] = useState<OpeningHour[]>(() =>
    ALL_DAYS.map(({ full }) => {
      const ex = openingHours.find(h =>
        full.toLowerCase().startsWith(h.day?.toLowerCase().slice(0, 3) || "_") ||
        h.day?.toLowerCase().startsWith(full.toLowerCase().slice(0, 3))
      )
      return ex ? { ...ex, day: full, isOpen: true } : { day: full, opens: "08:00", closes: "18:00", isOpen: false }
    })
  )
  const toggle = (i: number) => { const u = days.map((d, idx) => idx === i ? { ...d, isOpen: !d.isOpen } : d); setDays(u); onChange(u.filter(d => d.isOpen)) }
  const setT = (i: number, f: "opens" | "closes", v: string) => { const u = days.map((d, idx) => idx === i ? { ...d, [f]: v } : d); setDays(u); onChange(u.filter(d => d.isOpen)) }
  return (
    <div className="emp-hours-edit-grid">
      {days.map((day, i) => (
        <div key={day.day} className={`emp-day-edit ${day.isOpen ? "active" : ""}`}>
          <div className="emp-day-edit-head">
            <button type="button" className={`emp-day-toggle ${day.isOpen ? "on" : ""}`} onClick={() => toggle(i)}>
              {day.isOpen && <CheckCircle2 size={12} color="#fff" />}
            </button>
            <span className="emp-day-edit-lbl">{ALL_DAYS[i].short}</span>
          </div>
          {day.isOpen
            ? <><input type="time" className="emp-time-inp" value={day.opens} onChange={e => setT(i, "opens", e.target.value)} /><input type="time" className="emp-time-inp" value={day.closes} onChange={e => setT(i, "closes", e.target.value)} /></>
            : <div style={{ fontSize: "0.62rem", color: "#c0cad2", textAlign: "center", paddingTop: 2 }}>Fechado</div>}
        </div>
      ))}
    </div>
  )
}

function InfoItem({ icon, label, value, full, iconBg = "rgba(0,204,255,0.08)", iconColor = "#00CCFF" }: { icon: React.ReactNode; label: string; value?: string; full?: boolean; iconBg?: string; iconColor?: string }) {
  return (
    <div className={`emp-info-item${full ? " full" : ""}`}>
      <div className="emp-info-icon" style={{ background: iconBg }}><span style={{ color: iconColor }}>{icon}</span></div>
      <div>
        <div className="emp-info-label">{label}</div>
        <div className={`emp-info-value${!value ? " empty" : ""}`}>{value || "Não informado"}</div>
      </div>
    </div>
  )
}

function ImageSection({ uid, coverImage, galleryImages, isEditing, onCoverChange, onGalleryChange }: {
  uid: string; coverImage?: string; galleryImages?: string[];
  isEditing: boolean; onCoverChange: (url: string) => void; onGalleryChange: (urls: string[]) => void
}) {
  const coverRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [drag, setDrag] = useState(false)

  // FIX: Adicionada verificação de segurança para o storage
  const upload = async (file: File, path: string): Promise<string> => {
    if (!storage) throw new Error("Storage não inicializado");
    const r = ref(storage, path)
    await uploadBytes(r, file)
    return getDownloadURL(r)
  }

  const handleCover = async (file: File) => {
    if (!file.type.startsWith("image/")) return
    setUploadingCover(true)
    try { 
      const url = await upload(file, `businesses/${uid}/cover/${Date.now()}_${file.name}`);
      onCoverChange(url) 
    } catch (err) {
      console.error("Erro cover:", err);
    } finally { setUploadingCover(false) }
  }

  const handleGallery = async (files: FileList) => {
    const imgs = Array.from(files).filter(f => f.type.startsWith("image/")).slice(0, 10)
    if (!imgs.length) return
    setUploadingGallery(true)
    try {
      const urls = await Promise.all(imgs.map(f => upload(f, `businesses/${uid}/gallery/${Date.now()}_${f.name}`)))
      onGalleryChange([...(galleryImages || []), ...urls])
    } catch (err) {
      console.error("Erro gallery:", err);
    } finally { setUploadingGallery(false) }
  }

  const removeCover = async () => {
    if (coverImage && storage) { 
      try { await deleteObject(ref(storage, coverImage)) } catch {} 
    }
    onCoverChange("")
  }

  const removeGallery = async (url: string) => {
    if (storage) {
      try { await deleteObject(ref(storage, url)) } catch {}
    }
    onGalleryChange((galleryImages || []).filter(u => u !== url))
  }

  return (
    <div className="emp-img-body">
      <div className="emp-img-section-label"><Camera size={13} /> Foto de Capa</div>
      {isEditing ? (
        <>
          {uploadingCover && (
            <div className="emp-uploading">
              <Loader2 size={14} style={{ animation: "emp-spin 1s linear infinite", color: "#00CCFF", flexShrink: 0 }} />
              Enviando foto de capa...
            </div>
          )}
          <div className="emp-cover-wrap">
            {coverImage
              ? <>
                  <img src={coverImage} alt="Capa" className="emp-cover" />
                  <div className="emp-cover-badge"><Star size={10} />Capa</div>
                  <div className="emp-cover-overlay">
                    <button className="emp-img-btn emp-img-btn-cyan" onClick={() => coverRef.current?.click()}>
                      <Upload size={13} /> Trocar
                    </button>
                    <button className="emp-img-btn emp-img-btn-red" onClick={removeCover}>
                      <Trash2 size={13} /> Remover
                    </button>
                  </div>
                </>
              : <div className="emp-cover-empty" onClick={() => !uploadingCover && coverRef.current?.click()}>
                  <div className="emp-cover-empty-icon"><Camera size={22} color="#00CCFF" /></div>
                  <div style={{ fontSize: "0.82rem", color: "#5a6878", fontWeight: 500 }}>Clique para adicionar uma foto de capa</div>
                </div>}
          </div>
          <input ref={coverRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => e.target.files?.[0] && handleCover(e.target.files[0])} />
        </>
      ) : (
        coverImage
          ? <div className="emp-cover-wrap"><img src={coverImage} alt="Capa" className="emp-cover" /><div className="emp-cover-badge"><Star size={10} />Capa</div></div>
          : <div className="emp-img-empty">Nenhuma foto de capa</div>
      )}

      <div style={{ marginTop: "1.5rem" }}>
        <div className="emp-img-section-label">
          <Images size={13} /> Galeria de Fotos
          {galleryImages && galleryImages.length > 0 && <span>{galleryImages.length} foto{galleryImages.length !== 1 ? "s" : ""}</span>}
        </div>
        {isEditing ? (
          <>
            {uploadingGallery && (
              <div className="emp-uploading">
                <Loader2 size={14} style={{ animation: "emp-spin 1s linear infinite", color: "#00CCFF", flexShrink: 0 }} />
                Enviando fotos para a galeria...
              </div>
            )}
            {galleryImages && galleryImages.length > 0 && (
              <div className="emp-gallery" style={{ marginBottom: 12 }}>
                {galleryImages.map((url, i) => (
                  <div key={i} className="emp-gallery-item">
                    <img src={url} alt={`Foto ${i + 1}`} className="emp-gallery-img" />
                    <div className="emp-gallery-del-overlay">
                      <button className="emp-gallery-del" onClick={() => removeGallery(url)}>
                        <Trash2 size={14} color="#fff" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div
              className={`emp-upload-zone ${drag ? "drag" : ""}`}
              onClick={() => !uploadingGallery && galleryRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); e.dataTransfer.files && handleGallery(e.dataTransfer.files) }}
            >
              <div className="emp-upload-zone-icon"><Upload size={20} color="#00CCFF" /></div>
              <div style={{ fontSize: "0.83rem", color: "#5a6878", fontWeight: 500 }}>Clique ou arraste fotos aqui</div>
            </div>
            <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: "none" }}
              onChange={e => e.target.files && handleGallery(e.target.files)} />
          </>
        ) : (
          galleryImages && galleryImages.length > 0
            ? <div className="emp-gallery">
                {galleryImages.map((url, i) => (
                  <div key={i} className="emp-gallery-item">
                    <img src={url} alt={`Foto ${i + 1}`} className="emp-gallery-img" />
                  </div>
                ))}
              </div>
            : <div className="emp-img-empty">Nenhuma foto na galeria</div>
        )}
      </div>
    </div>
  )
}

export default function EmpresarioPerfilPage() {
  const router = useRouter()
  const [loading, setLoading]     = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [formData, setFormData]   = useState<BusinessData | null>(null)
  const [position, setPosition]   = useState<any>(null)
  const [editHours, setEditHours] = useState<OpeningHour[]>([])
  const [coverImage, setCoverImage]     = useState<string>("")
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [uid, setUid] = useState("")

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid)
        const snap = await getDoc(doc(db, "businesses", user.uid))
        if (snap.exists()) {
          const data = snap.data() as BusinessData
          setFormData(data)
          setEditHours(data.openingHours || [])
          setCoverImage(data.coverImage || "")
          setGalleryImages(data.galleryImages || [])
          if (data.location) setPosition({ lat: data.location.latitude, lng: data.location.longitude })
        }
      } else { router.push("/login") }
      setLoading(false)
    })
    return () => unsub()
  }, [router])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(p => p ? { ...p, [e.target.id]: e.target.value } : null)

  const handleSave = async () => {
    if (!auth.currentUser || !formData) return
    setSaving(true)
    try {
      await updateDoc(doc(db, "businesses", auth.currentUser.uid), {
        ...formData, openingHours: editHours, coverImage, galleryImages,
        location: position ? { latitude: position.lat, longitude: position.lng } : null,
      })
      setFormData(p => p ? { ...p, openingHours: editHours, coverImage, galleryImages } : null)
      setIsEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditHours(formData?.openingHours || [])
    setCoverImage(formData?.coverImage || "")
    setGalleryImages(formData?.galleryImages || [])
    setIsEditing(false)
  }

  if (loading || !formData) return (
    <><style>{EMP_CSS}</style>
      <div className="emp-loading"><Loader2 style={{ width: 40, height: 40, color: "#00CCFF", animation: "emp-spin 1s linear infinite" }} /></div>
    </>
  )

  const SECTIONS = [
    {
      title: "Informações Básicas", iconBg: "rgba(0,204,255,0.1)", iconColor: "#00CCFF", icon: <Store size={16} />,
      editFields: [
        { id: "businessName", label: "Nome do Estabelecimento" },
        { id: "category", label: "Categoria" },
        { id: "description", label: "Descrição", full: true, textarea: true },
      ],
      viewItems: [
        { icon: <Building2 size={16} />, label: "Nome", value: formData.businessName, iconBg: "rgba(0,204,255,0.08)", iconColor: "#00CCFF" },
        { icon: <Tag size={16} />, label: "Categoria", value: formData.category, iconBg: "rgba(247,176,0,0.1)", iconColor: "#F7B000" },
        { icon: <AlignLeft size={16} />, label: "Descrição", value: formData.description, full: true, iconBg: "rgba(139,92,246,0.08)", iconColor: "#8B5CF6" },
      ]
    },
    {
      title: "Contato", iconBg: "rgba(247,176,0,0.1)", iconColor: "#F7B000", icon: <Phone size={16} />,
      editFields: [
        { id: "businessPhone", label: "Telefone" },
        { id: "whatsapp", label: "WhatsApp" },
        { id: "website", label: "Instagram / Site", full: true },
      ],
      viewItems: [
        { icon: <Phone size={16} />, label: "Telefone", value: formData.businessPhone, iconBg: "rgba(34,197,94,0.08)", iconColor: "#22c55e" },
        { icon: <MessageCircle size={16} />, label: "WhatsApp", value: formData.whatsapp, iconBg: "rgba(34,197,94,0.08)", iconColor: "#22c55e" },
        { icon: <Globe size={16} />, label: "Instagram / Site", value: formData.website, full: true, iconBg: "rgba(0,204,255,0.08)", iconColor: "#00CCFF" },
      ]
    },
  ]

  return (
    <><style>{EMP_CSS}</style>
    <div className="emp">
      <div className="emp-hero">
        <div className="emp-hero-orb1" /><div className="emp-hero-orb2" /><div className="emp-hero-grid" />
        <div className="emp-hero-inner">
          <div>
            <div className="emp-hero-eyebrow">Área do Empresário</div>
            <div className="emp-hero-title">Perfil do Negócio</div>
            <div className="emp-hero-sub">{isEditing ? "Edite as informações do seu estabelecimento" : "Gerencie seu perfil atualizado"}</div>
          </div>
          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            {isEditing
              ? <>
                  <button className="emp-btn emp-btn-ghost" onClick={handleCancel}>Cancelar</button>
                  <button className="emp-btn emp-btn-green" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 size={15} style={{ animation: "emp-spin 1s linear infinite" }} /> : <Save size={15} />}
                    {saving ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </>
              : <button className="emp-btn emp-btn-gold" onClick={() => setIsEditing(true)}><Edit3 size={15} /> Editar Perfil</button>}
          </div>
        </div>
      </div>

      <div className="emp-body">
        <div className="emp-card">
          <div className="emp-card-header">
            <div className="emp-card-title-wrap">
              <div className="emp-card-icon" style={{ background: "rgba(247,176,0,0.1)" }}><ImagePlus size={16} color="#F7B000" /></div>
              <div><div className="emp-card-title">Fotos do Estabelecimento</div></div>
            </div>
          </div>
          <ImageSection
            uid={uid} coverImage={coverImage} galleryImages={galleryImages}
            isEditing={isEditing} onCoverChange={setCoverImage} onGalleryChange={setGalleryImages}
          />
        </div>

        {SECTIONS.map(section => (
          <div key={section.title} className="emp-card">
            <div className="emp-card-header">
              <div className="emp-card-title-wrap">
                <div className="emp-card-icon" style={{ background: section.iconBg }}><span style={{ color: section.iconColor }}>{section.icon}</span></div>
                <div className="emp-card-title">{section.title}</div>
              </div>
            </div>
            {isEditing
              ? <div className="emp-form-grid">
                  {section.editFields.map(f => (
                    <div key={f.id} className={`emp-field${f.full ? " full" : ""}`}>
                      <label htmlFor={f.id}>{f.label}</label>
                      {(f as any).textarea
                        ? <textarea id={f.id} value={formData[f.id] || ""} onChange={handleInput} rows={3} />
                        : <input id={f.id} type="text" value={formData[f.id] || ""} onChange={handleInput} />}
                    </div>
                  ))}
                </div>
              : <div className="emp-info-grid">{section.viewItems.map((item, i) => <InfoItem key={i} {...item} />)}</div>}
          </div>
        ))}

        <div className="emp-card">
          <div className="emp-card-header">
            <div className="emp-card-title-wrap">
              <div className="emp-card-icon" style={{ background: "rgba(233,30,140,0.08)" }}><MapPin size={16} color="#E91E8C" /></div>
              <div className="emp-card-title">Localização e Horários</div>
            </div>
          </div>
          {isEditing
            ? <div className="emp-form-grid"><div className="emp-field full"><label htmlFor="address">Endereço</label><input id="address" type="text" value={formData.address || ""} onChange={handleInput} /></div></div>
            : <div className="emp-info-grid"><InfoItem icon={<MapPin size={16} />} label="Endereço" value={formData.address} full iconBg="rgba(233,30,140,0.08)" iconColor="#E91E8C" /></div>}
          <div style={{ height: 1, background: "#f5f3f0", margin: "0 1.6rem" }} />
          <div style={{ padding: "1.2rem 1.6rem 0", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,204,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}><Clock size={16} color="#00CCFF" /></div>
            <div><div style={{ fontSize: "0.95rem", fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#002240" }}>Horário de Funcionamento</div></div>
          </div>
          {isEditing
            ? <div style={{ padding: "1.2rem 1.6rem 1.6rem" }}><HoursEditor openingHours={editHours} onChange={setEditHours} /></div>
            : <HoursDisplay openingHours={formData.openingHours} />}
          <div style={{ height: 1, background: "#f5f3f0", margin: "0 1.6rem" }} />
          <div style={{ padding: "1.2rem 1.6rem 0", display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(233,30,140,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}><MapPin size={16} color="#E91E8C" /></div>
            <div><div style={{ fontSize: "0.95rem", fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#002240" }}>Localização no Mapa</div></div>
          </div>
          <div style={{ padding: "0 1.6rem 1.6rem" }}>
            <div className="emp-map-wrap"><ProfileMapNoSSR position={position} setPosition={setPosition} isEditing={isEditing} /></div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}