"use client"

import { useState, useEffect } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Search, Download, Trash2, Loader2, Store, Globe, X, MapPin, Mail, Phone, Plus, Building2 } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import Link from "next/link"
import { ADMIN_CSS } from "../dashboard/page"

type Business = { id: string; businessName: string; businessPhone: string; email?: string; address: string; website?: string; category: string; createdAt?: any; }

const CAT_COLORS: Record<string, string> = { restaurante: "#FF7043", comercio: "#00CCFF", servicos: "#F7B000", saude: "#E91E8C", automotivo: "#8B5CF6", casa: "#22c55e" }

export default function AdminEmpresasPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCat, setFilterCat] = useState("all")

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, "businesses"))
        setBusinesses(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Business[])
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }; fetch()
  }, [])

  const handleDelete = async (id: string) => {
    try { await deleteDoc(doc(db, "businesses", id)); setBusinesses(p => p.filter(b => b.id !== id)) }
    catch (e) { console.error(e) }
  }

  const formatDate = (d: any) => { if (!d) return '—'; if (d.toDate) return d.toDate().toLocaleDateString('pt-BR'); return '—' }

  const exportCSV = () => {
    const ds = new Date().toLocaleDateString('pt-BR')
    const rows = [['Relatório Empresas'], [`Gerado: ${ds}`], [], ['Nome,Categoria,Email,Telefone,Endereço'].join(',')]
    businesses.forEach(b => rows.push([`"${b.businessName}"`, b.category, b.email || '', b.businessPhone, `"${b.address}"`].join(',')))
    const blob = new Blob(["\uFEFF" + rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `empresas_${ds.replace(/\//g, '-')}.csv`; document.body.appendChild(a); a.click(); document.body.removeChild(a)
  }

  const filtered = businesses.filter(b => {
    const ms = b.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) || b.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const mc = filterCat === 'all' || b.category === filterCat
    return ms && mc
  })

  return (
    <>
      <style>{ADMIN_CSS}</style>
      <div className="adm">
        <div className="adm-hero">
          <div className="adm-hero-orb1" /><div className="adm-hero-orb2" />
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div className="adm-hero-eyebrow">Gestão de Empresas</div>
              <div className="adm-hero-title">Estabelecimentos</div>
              <div className="adm-hero-sub">Filtre, visualize e gerencie todos os estabelecimentos comerciais parceiros.</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 20px" }}>
                <Building2 size={20} color="#F7B000" />
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{businesses.length}</div>
                  <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.07em", textTransform: "uppercase" }}>Total</div>
                </div>
              </div>
              <Link href="/admin/empresas/novo">
                <button className="adm-btn adm-btn-cyan" style={{ height: 52, fontSize: "0.88rem" }}><Plus size={16} /> Nova Empresa</button>
              </Link>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="adm-card" style={{ marginBottom: "1.5rem" }}>
          <div className="adm-card-body">
            <div className="adm-filter-wrap" style={{ flexWrap: "wrap" }}>
              <div className="adm-search-wrap" style={{ flex: 1, minWidth: 200 }}>
                <Search size={15} color="#b0bec5" />
                <input className="adm-search-input" placeholder="Buscar por nome ou e-mail..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <select className="adm-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <option value="all">Todas as categorias</option>
                <option value="restaurante">Restaurante</option>
                <option value="comercio">Comércio</option>
                <option value="servicos">Serviços</option>
                <option value="saude">Saúde</option>
              </select>
              {(searchTerm || filterCat !== 'all') && (
                <button className="adm-btn adm-btn-ghost" onClick={() => { setSearchTerm(''); setFilterCat('all') }}><X size={14} /> Limpar</button>
              )}
              <button className="adm-btn adm-btn-outline" onClick={exportCSV}><Download size={14} /> Exportar CSV</button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div><div className="adm-card-title">Lista de Empresas</div><div className="adm-card-sub">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</div></div>
          </div>
          <div className="adm-table-wrap">
            {loading ? (
              <div className="adm-loading"><Loader2 size={26} color="#00CCFF" style={{ animation: "adm-spin 1s linear infinite" }} /> Carregando...</div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: 20 }}>Empresa</th>
                    <th>Categoria</th>
                    <th>Contato</th>
                    <th>Endereço</th>
                    <th>Cadastro</th>
                    <th style={{ textAlign: "right", paddingRight: 20 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6}><div className="adm-empty">Nenhuma empresa encontrada.</div></td></tr>
                  ) : filtered.map(b => {
                    const cc = CAT_COLORS[b.category] || "#00CCFF"
                    return (
                      <tr key={b.id}>
                        <td style={{ paddingLeft: 20 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f8f6f2", border: "1.5px solid #f0ece5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Store size={16} color="#b0a898" />
                            </div>
                            <div>
                              <div className="adm-name">{b.businessName}</div>
                              {b.website && (
                                <a href={b.website.startsWith('http') ? b.website : `https://${b.website}`} target="_blank" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem", color: "#00CCFF", textDecoration: "none", marginTop: 2 }}>
                                  <Globe size={10} /> Website
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="adm-badge" style={{ background: `${cc}15`, color: cc, border: `1px solid ${cc}30` }}>{b.category}</span>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.8rem", color: "#3a4a5a", display: "flex", flexDirection: "column", gap: 3 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Phone size={11} color="#b0bec5" />{b.businessPhone}</span>
                            {b.email && <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#8a9aaa", fontSize: "0.72rem" }}><Mail size={10} color="#b0bec5" />{b.email}</span>}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 5, fontSize: "0.8rem", color: "#5a6878", maxWidth: 180 }}>
                            <MapPin size={12} color="#b0bec5" style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.address}</span>
                          </div>
                        </td>
                        <td><div style={{ fontSize: "0.8rem", color: "#8a9aaa" }}>{formatDate(b.createdAt)}</div></td>
                        <td style={{ textAlign: "right", paddingRight: 20 }}>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="adm-btn adm-btn-danger" style={{ padding: "7px 12px" }}><Trash2 size={14} /></button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Empresa?</AlertDialogTitle>
                                <AlertDialogDescription>Ação irreversível. Isso apagará permanentemente o perfil de <strong>{b.businessName}</strong>.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(b.id)} className="bg-red-600 hover:bg-red-700">Confirmar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  )
}