"use client"

import React, { useEffect, useState } from "react"
import { Users, Building2, Star, Activity, TrendingUp, AlertTriangle } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, Timestamp } from "firebase/firestore"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const ADMIN_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
.adm{font-family:'DM Sans',sans-serif;--navy:#002240;--navy2:#001830;--gold:#F7B000;--cyan:#00CCFF;--bg:#F4F1EC;}
.adm-hero{background:var(--navy);border-radius:20px;padding:2rem 2.5rem;position:relative;overflow:hidden;margin-bottom:1.75rem;}
.adm-hero-orb1{position:absolute;border-radius:50%;width:350px;height:350px;background:var(--cyan);opacity:0.07;filter:blur(80px);top:-120px;right:-80px;pointer-events:none;}
.adm-hero-orb2{position:absolute;border-radius:50%;width:250px;height:250px;background:var(--gold);opacity:0.08;filter:blur(70px);bottom:-100px;left:20px;pointer-events:none;}
.adm-hero-eyebrow{font-size:0.68rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(0,204,255,0.65);margin-bottom:8px;}
.adm-hero-title{font-family:'Syne',sans-serif;font-weight:800;font-size:1.85rem;color:#fff;margin-bottom:0.3rem;line-height:1.1;}
.adm-hero-sub{color:rgba(255,255,255,0.5);font-size:0.88rem;font-weight:300;max-width:560px;}
.adm-hero-actions{display:flex;align-items:center;gap:10px;margin-top:1.4rem;}
.adm-card{background:#fff;border-radius:18px;box-shadow:0 2px 16px rgba(0,34,64,0.07);overflow:hidden;}
.adm-card-header{padding:1.3rem 1.5rem;border-bottom:1px solid #f0ece5;display:flex;align-items:center;justify-content:space-between;}
.adm-card-title{font-family:'Syne',sans-serif;font-size:0.97rem;font-weight:700;color:var(--navy);}
.adm-card-sub{font-size:0.75rem;color:#8a9aaa;margin-top:2px;}
.adm-card-body{padding:1.4rem 1.5rem;}
.adm-stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.1rem;margin-bottom:1.75rem;}
.adm-stat-card{background:#fff;border-radius:16px;padding:1.4rem 1.5rem;box-shadow:0 2px 12px rgba(0,34,64,0.06);transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.2s;}
.adm-stat-card:hover{transform:translateY(-4px);box-shadow:0 12px 35px rgba(0,34,64,0.11);}
.adm-stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;}
.adm-stat-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;}
.adm-stat-label{font-size:0.72rem;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:#8a9aaa;}
.adm-stat-value{font-family:'Syne',sans-serif;font-size:2.1rem;font-weight:800;color:var(--navy);line-height:1;margin-bottom:6px;}
.adm-stat-foot{display:flex;align-items:center;gap:6px;}
.adm-trend{display:inline-flex;align-items:center;gap:3px;font-size:0.7rem;font-weight:700;color:#22c55e;background:rgba(34,197,94,0.1);padding:2px 7px;border-radius:100px;}
.adm-stat-desc{font-size:0.72rem;color:#a0b0c0;}
.adm-search-wrap{position:relative;}
.adm-search-wrap svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;}
.adm-search-input{width:100%;height:42px;padding:0 14px 0 38px;background:#f8f6f2;border:1.5px solid #ede9e0;border-radius:11px;font-size:0.875rem;font-family:'DM Sans',sans-serif;color:#1a2a3a;outline:none;transition:border-color 0.2s;}
.adm-search-input::placeholder{color:#b0bec5;}
.adm-search-input:focus{border-color:#00CCFF;background:#fff;}
.adm-filter-wrap{display:flex;gap:10px;align-items:center;}
.adm-select{height:42px;padding:0 12px;background:#f8f6f2;border:1.5px solid #ede9e0;border-radius:11px;font-size:0.875rem;font-family:'DM Sans',sans-serif;color:#1a2a3a;outline:none;cursor:pointer;}
.adm-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:11px;font-size:0.83rem;font-weight:600;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:transform 0.2s,box-shadow 0.2s,background 0.15s;}
.adm-btn-primary{background:var(--gold);color:var(--navy);box-shadow:0 4px 16px rgba(247,176,0,0.25);}
.adm-btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(247,176,0,0.38);}
.adm-btn-cyan{background:var(--cyan);color:var(--navy);}
.adm-btn-cyan:hover{background:#00bbee;}
.adm-btn-outline{background:#fff;color:#3a4a5a;border:1.5px solid #ede9e0;}
.adm-btn-outline:hover{border-color:#00CCFF;color:#00CCFF;}
.adm-btn-ghost{background:transparent;color:#7a8a9a;border:none;}
.adm-btn-ghost:hover{background:#f0ece5;color:#3a4a5a;}
.adm-btn-danger{background:rgba(239,68,68,0.08);color:#ef4444;border:1.5px solid rgba(239,68,68,0.15);}
.adm-btn-danger:hover{background:rgba(239,68,68,0.14);}
.adm-table-wrap{overflow-x:auto;}
table.adm-table{width:100%;border-collapse:collapse;}
.adm-table th{font-size:0.7rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8a9aaa;padding:12px 16px;text-align:left;background:#faf8f5;border-bottom:1px solid #f0ece5;}
.adm-table td{padding:14px 16px;border-bottom:1px solid #f8f6f2;vertical-align:middle;}
.adm-table tr:last-child td{border-bottom:none;}
.adm-table tbody tr{transition:background 0.15s;}
.adm-table tbody tr:hover{background:#fdfbf8;}
.adm-name{font-size:0.9rem;font-weight:600;color:var(--navy);}
.adm-meta{font-size:0.75rem;color:#8a9aaa;margin-top:2px;}
.adm-badge{display:inline-flex;align-items:center;gap:5px;font-size:0.68rem;font-weight:700;letter-spacing:0.06em;padding:3px 10px;border-radius:100px;}
.adm-badge-green{background:rgba(34,197,94,0.1);color:#16a34a;}
.adm-badge-cyan{background:rgba(0,204,255,0.1);color:#0088aa;}
.adm-badge-gold{background:rgba(247,176,0,0.1);color:#a06000;}
.adm-badge-rose{background:rgba(233,30,140,0.08);color:#b0006a;}
.adm-loading{display:flex;align-items:center;justify-content:center;padding:4rem;gap:12px;color:#8a9aaa;font-size:0.88rem;}
.adm-empty{text-align:center;padding:3rem;color:#a0b0c0;font-size:0.88rem;}
.adm-slot-card{border-radius:16px;padding:1.5rem;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:160px;transition:transform 0.2s,box-shadow 0.2s;}
.adm-slot-card:hover{transform:translateY(-3px);box-shadow:0 12px 35px rgba(0,34,64,0.1);}
.adm-error{background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.2);border-radius:14px;padding:1.1rem 1.5rem;display:flex;align-items:center;gap:10px;color:#dc2626;font-size:0.88rem;margin-bottom:1.5rem;}
@keyframes adm-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@media(max-width:900px){.adm-stat-grid{grid-template-columns:1fr 1fr;}}
@media(max-width:560px){.adm-stat-grid{grid-template-columns:1fr;}}
`

function StatCard({ title, value, icon: Icon, description, trend, iconBg, iconColor }: any) {
  return (
    <div className="adm-stat-card">
      <div className="adm-stat-top">
        <span className="adm-stat-label">{title}</span>
        <div className="adm-stat-icon" style={{ background: iconBg }}>
          <Icon size={17} color={iconColor} />
        </div>
      </div>
      <div className="adm-stat-value">{value}</div>
      <div className="adm-stat-foot">
        {trend && <span className="adm-trend"><TrendingUp size={9} />{trend}</span>}
        <span className="adm-stat-desc">{description}</span>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, businesses: 0, featured: 0, recentUsers: [] as any[], recentBusinesses: [] as any[] })
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"))
        const allUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() as any }))
        const nonAdmin = allUsers.filter(u => u.role !== 'admin')
        const totalUsers = nonAdmin.length > 0 ? nonAdmin.length : allUsers.length

        const bizSnap = await getDocs(collection(db, "businesses"))
        const allBiz = bizSnap.docs.map(d => ({ id: d.id, ...d.data() as any }))
        const featured = allBiz.filter(b => b.isFeatured === true)

        setStats({
          users: totalUsers, businesses: allBiz.length, featured: featured.length,
          recentUsers: [...allUsers].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 3),
          recentBusinesses: [...allBiz].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 3),
        })

        const last6: any[] = []
        const today = new Date()
        for (let i = 5; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
          const n = d.toLocaleString('pt-BR', { month: 'short' })
          last6.push({ name: n.charAt(0).toUpperCase() + n.slice(1), rawDate: d, usuarios: 0, empresas: 0 })
        }
        const count = (data: any, type: 'usuarios' | 'empresas') => {
          if (!data.createdAt) return
          const date = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt)
          last6.forEach(m => { if (date.getMonth() === m.rawDate.getMonth() && date.getFullYear() === m.rawDate.getFullYear()) m[type]++ })
        }
        allUsers.forEach(u => count(u, 'usuarios'))
        allBiz.forEach(b => count(b, 'empresas'))
        setChartData(last6.map(({ rawDate, ...rest }) => rest))
      } catch (err: any) {
        setErrorMsg(err.code === 'permission-denied' ? "Erro de permissão no Firestore." : "Erro ao carregar dados.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <><style>{ADMIN_CSS}</style>
      <div className="adm adm-loading">
        <Activity size={28} color="#00CCFF" style={{ animation: "adm-spin 1s linear infinite" }} /> Carregando...
      </div>
    </>
  )

  return (
    <>
      <style>{ADMIN_CSS}</style>
      <div className="adm">
        {errorMsg && <div className="adm-error"><AlertTriangle size={17} /> {errorMsg}</div>}

        <div className="adm-hero">
          <div className="adm-hero-orb1" /><div className="adm-hero-orb2" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="adm-hero-eyebrow">Painel Administrativo</div>
            <div className="adm-hero-title">Visão Geral</div>
            <div className="adm-hero-sub">Acompanhe o crescimento da plataforma em tempo real.</div>
          </div>
        </div>

        <div className="adm-stat-grid">
          <StatCard title="Usuários" value={stats.users} icon={Users} description="cadastrados" trend={stats.users > 0 ? "ativo" : undefined} iconBg="rgba(0,204,255,0.1)" iconColor="#00CCFF" />
          <StatCard title="Empresas" value={stats.businesses} icon={Building2} description="estabelecimentos" trend={stats.businesses > 0 ? "ativo" : undefined} iconBg="rgba(247,176,0,0.1)" iconColor="#F7B000" />
          <StatCard title="Em Destaque" value={stats.featured} icon={Star} description="na home" iconBg="rgba(233,30,140,0.08)" iconColor="#E91E8C" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "5fr 4fr", gap: "1.5rem" }}>
          <div className="adm-card">
            <div className="adm-card-header">
              <div><div className="adm-card-title">Crescimento da Plataforma</div><div className="adm-card-sub">Últimos 6 meses</div></div>
            </div>
            <div style={{ padding: "1.5rem 1.5rem 1.5rem 0" }}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece5" />
                  <XAxis dataKey="name" stroke="#b0bec5" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                  <YAxis stroke="#b0bec5" fontSize={11} tickLine={false} axisLine={false} dx={-4} />
                  <Tooltip contentStyle={{ background: "#fff", borderRadius: 12, border: "none", boxShadow: "0 10px 40px rgba(0,34,64,0.12)", fontFamily: "DM Sans,sans-serif", fontSize: 12 }} cursor={{ fill: "#f8f6f2" }} />
                  <Bar dataKey="usuarios" name="Usuários" fill="#00CCFF" radius={[6, 6, 0, 0]} barSize={22} />
                  <Bar dataKey="empresas" name="Empresas" fill="#F7B000" radius={[6, 6, 0, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-header">
              <div><div className="adm-card-title">Novos Cadastros</div><div className="adm-card-sub">Recentes no sistema</div></div>
            </div>
            <div className="adm-card-body">
              {[...stats.recentBusinesses.map(b => ({ ...b, _type: 'empresa' })), ...stats.recentUsers.map(u => ({ ...u, _type: 'usuario' }))].map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f3f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
                    <Avatar style={{ width: 32, height: 32 }}>
                      <AvatarImage src={item.images?.[0] || item.avatar} style={{ objectFit: "cover" }} />
                      <AvatarFallback style={{ background: item._type === 'empresa' ? "rgba(247,176,0,0.1)" : "rgba(0,204,255,0.1)", color: item._type === 'empresa' ? "#F7B000" : "#00CCFF", fontSize: "0.65rem", fontWeight: 700 }}>
                        {item._type === 'empresa' ? "EMP" : "USR"}
                      </AvatarFallback>
                    </Avatar>
                    <div style={{ overflow: "hidden" }}>
                      <div className="adm-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.82rem" }}>{item.businessName || item.name}</div>
                      <div className="adm-meta">{item.category || item.email}</div>
                    </div>
                  </div>
                  <span className="adm-badge" style={{ background: item._type === 'empresa' ? "rgba(247,176,0,0.1)" : "rgba(0,204,255,0.1)", color: item._type === 'empresa' ? "#a06000" : "#0088aa", flexShrink: 0 }}>
                    {item._type === 'empresa' ? "Empresa" : "Usuário"}
                  </span>
                </div>
              ))}
              {stats.recentUsers.length === 0 && stats.recentBusinesses.length === 0 && (
                <div className="adm-empty">Nenhum cadastro recente.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}