// app/usuario/comentarios/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, ArrowLeft, Search, Filter, Calendar, ThumbsUp, Reply, Edit3, Trash2 } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

export default function UsuarioComentarios() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const [comments] = useState([
    {
      id: 1,
      business: { name: "Restaurante Sabor Caseiro", category: "Alimentação", image: "/cozy-italian-restaurant.png" },
      type: "question",
      comment: "Vocês fazem delivery? Qual o valor mínimo do pedido?",
      date: "2024-01-18",
      likes: 3,
      replies: [{ id: 1, author: "Restaurante Sabor Caseiro", isOwner: true, comment: "Olá! Sim, fazemos delivery...", date: "2024-01-18" }],
    },
    // ... outros comentários
  ])

  const filteredComments = comments
    .filter((comment) => {
      const matchesSearch =
        comment.business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.comment.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || comment.type === filterType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === "likes") return b.likes - a.likes
      if (sortBy === "replies") return b.replies.length - a.replies.length
      return 0
    })

    const getTypeLabel = (type: string) => {
        const types = {
          question: { label: "Pergunta", color: "bg-blue-500/20 text-blue-300" },
          compliment: { label: "Elogio", color: "bg-green-500/20 text-green-300" },
          suggestion: { label: "Sugestão", color: "bg-purple-500/20 text-purple-300" },
          complaint: { label: "Reclamação", color: "bg-red-500/20 text-red-300" },
        }
        return types[type as keyof typeof types] || types.question
      }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6 shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    placeholder="Buscar por estabelecimento ou comentário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48 bg-blue-900/50 border-blue-700 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tipo de comentário" />
                </SelectTrigger>
                <SelectContent className="z-[1000] bg-blue-900 text-white border-blue-700">
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="question">Perguntas</SelectItem>
                  <SelectItem value="compliment">Elogios</SelectItem>
                  <SelectItem value="suggestion">Sugestões</SelectItem>
                  <SelectItem value="complaint">Reclamações</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 bg-blue-900/50 border-blue-700 text-white">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="z-[1000] bg-blue-900 text-white border-blue-700">
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="likes">Mais curtidos</SelectItem>
                  <SelectItem value="replies">Mais respondidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {filteredComments.map((comment) => (
            <Card key={comment.id} className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0"><AvatarImage src={comment.business.image || "/placeholder.svg"} alt={comment.business.name} /><AvatarFallback>{comment.business.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-white">{comment.business.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{comment.business.category}</Badge>
                          <Badge className={getTypeLabel(comment.type).color}>{getTypeLabel(comment.type).label}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-white/70 hover:bg-white/10 hover:text-white"><Edit3 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-white/70 hover:bg-white/10 hover:text-white"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <div className="mb-4"><p className="text-white/90 leading-relaxed">{comment.comment}</p></div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/70 mb-4">
                      <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(comment.date).toLocaleDateString("pt-BR")}</div>
                      {comment.likes > 0 && (<div className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" />{comment.likes} curtida{comment.likes > 1 ? "s" : ""}</div>)}
                      <div className="flex items-center gap-1"><Reply className="h-4 w-4" />{comment.replies.length} resposta{comment.replies.length !== 1 ? "s" : ""}</div>
                    </div>
                    {comment.replies.length > 0 && (<div className="border-l-2 border-blue-600 pl-4 space-y-3">{comment.replies.map((reply) => (<div key={reply.id} className="bg-blue-900/50 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><span className="font-medium text-sm text-white">{reply.author}</span>{reply.isOwner && (<Badge variant="outline" className="text-xs text-white border-white/50">Proprietário</Badge>)}<span className="text-xs text-white/70">{new Date(reply.date).toLocaleDateString("pt-BR")}</span></div><p className="text-sm text-white/80">{reply.comment}</p></div>))}</div>)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}