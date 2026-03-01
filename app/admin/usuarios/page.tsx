"use client"

import { useState, useEffect } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Search, Download, Trash2, Loader2, X, Users } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ADMIN_CSS } from "./AdminDashboardPage"

type User = { id: string; name: string; email: string; phone: string; role?: string; createdAt: any; avatar?: string; }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, "users"))
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() })) as User[]
      setUsers(list.filter(u => u.role !== 'admin'))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id: string) => {
    try { await deleteDoc(doc(db, "users", id)); setUsers(p => p.filter(u => u.id !== id)) }
    catch (err) { console.error(err) }
  }

  const formatDate = (d: any) => {
    if (!d) return '—'; if (d.toDate) return d.toDate().toLocaleDateString('pt-BR')
    if (d instanceof Date) return d.toLocaleDateString('pt-BR'); return '—'
  }

  const exportCSV = () => {
    const now = new Date(); const ds = now.toLocaleDateString('pt-BR')
    const rows = [['Relatório Usuários'], [`Gerado: ${ds}`], [], ['Nome,Email,Telefone,Data,ID'].join(',')]
    users.forEach(u => rows.push([`"${u.name}"`, u.email, u.phone || '', formatDate(u.createdAt), u.id].join(',')))
    const blob = new Blob(["\uFEFF" + rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `usuarios_${ds.replace(/\//g, '-')}.csv`; document.body.appendChild(a); a.click(); document.body.removeChild(a)
  }

  const filtered = users.filter(u =>
    (u.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <style>{ADMIN_CSS}</style>
      <div className="adm">
        <div className="adm-hero">
          <div className="adm-hero-orb1" /><div className="adm-hero-orb2" />
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div className="adm-hero-eyebrow">Gestão de Usuários</div>
              <div className="adm-hero-title">Moradores Registrados</div>
              <div className="adm-hero-sub">Visualize e gerencie todos os moradores cadastrados na plataforma.</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 20px" }}>
              <Users size={22} color="#00CCFF" />
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{users.length}</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.07em", textTransform: "uppercase" }}>Total</div>
              </div>
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
              {searchTerm && (
                <button className="adm-btn adm-btn-ghost" onClick={() => setSearchTerm('')}><X size={14} /> Limpar</button>
              )}
              <button className="adm-btn adm-btn-outline" onClick={exportCSV}><Download size={14} /> Exportar CSV</button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div><div className="adm-card-title">Lista de Usuários</div><div className="adm-card-sub">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</div></div>
          </div>
          <div className="adm-table-wrap">
            {loading ? (
              <div className="adm-loading"><Loader2 size={26} color="#00CCFF" style={{ animation: "adm-spin 1s linear infinite" }} /> Carregando...</div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: 20 }}>Usuário</th>
                    <th>Contato</th>
                    <th>Cadastro</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right", paddingRight: 20 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5}><div className="adm-empty">Nenhum usuário encontrado.</div></td></tr>
                  ) : filtered.map(user => (
                    <tr key={user.id}>
                      <td style={{ paddingLeft: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar style={{ width: 36, height: 36, border: "2px solid #f0ece5" }}>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback style={{ background: "rgba(0,204,255,0.1)", color: "#00CCFF", fontSize: "0.72rem", fontWeight: 700 }}>
                              {user.name?.substring(0, 2).toUpperCase() || "US"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="adm-name">{user.name}</div>
                            <div className="adm-meta">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><div className="adm-name" style={{ fontSize: "0.85rem" }}>{user.phone || <span style={{ color: "#b0bec5" }}>—</span>}</div></td>
                      <td><div style={{ fontSize: "0.83rem", color: "#5a6878" }}>{formatDate(user.createdAt)}</div></td>
                      <td><span className="adm-badge adm-badge-green">● Ativo</span></td>
                      <td style={{ textAlign: "right", paddingRight: 20 }}>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="adm-btn adm-btn-danger" style={{ padding: "7px 12px" }}><Trash2 size={14} /></button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
                              <AlertDialogDescription>Ação irreversível. Isso excluirá permanentemente a conta de <strong>{user.name}</strong>.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-red-600 hover:bg-red-700">Confirmar Exclusão</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  )
}