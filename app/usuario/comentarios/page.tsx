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

export default function UsuarioComentarios() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const [comments] = useState([
    {
      id: 1,
      business: {
        name: "Restaurante Sabor Caseiro",
        category: "Alimentação",
        image: "/cozy-italian-restaurant.png",
      },
      type: "question",
      comment: "Vocês fazem delivery? Qual o valor mínimo do pedido?",
      date: "2024-01-18",
      likes: 3,
      replies: [
        {
          id: 1,
          author: "Restaurante Sabor Caseiro",
          isOwner: true,
          comment:
            "Olá! Sim, fazemos delivery. O valor mínimo é R$ 25,00 e a taxa de entrega é R$ 5,00. Pedidos pelo WhatsApp (11) 99999-9999.",
          date: "2024-01-18",
        },
      ],
    },
    {
      id: 2,
      business: {
        name: "Padaria do João",
        category: "Alimentação",
        image: "/padaria.png",
      },
      type: "compliment",
      comment: "Parabéns pela qualidade dos pães! Sempre fresquinhos e saborosos. Vocês são o orgulho do bairro! 👏",
      date: "2024-01-15",
      likes: 8,
      replies: [
        {
          id: 1,
          author: "Padaria do João",
          isOwner: true,
          comment:
            "Muito obrigado pelo carinho! Ficamos muito felizes em saber que você aprecia nosso trabalho. Continuaremos sempre buscando a excelência!",
          date: "2024-01-15",
        },
      ],
    },
    {
      id: 3,
      business: {
        name: "Farmácia Central",
        category: "Saúde",
        image: "/farmacia.jpg",
      },
      type: "suggestion",
      comment:
        "Seria interessante ter um sistema de agendamento online para vacinas. Facilitaria muito para quem trabalha durante o horário comercial.",
      date: "2024-01-12",
      likes: 5,
      replies: [],
    },
    {
      id: 4,
      business: {
        name: "Mercadinho São José",
        category: "Comércio",
        image: "/bustling-market.png",
      },
      type: "question",
      comment: "Vocês aceitam cartão de crédito? E têm produtos orgânicos?",
      date: "2024-01-10",
      likes: 2,
      replies: [
        {
          id: 1,
          author: "Mercadinho São José",
          isOwner: true,
          comment:
            "Sim, aceitamos cartão de crédito e débito! Sobre produtos orgânicos, temos uma pequena seção com frutas e verduras orgânicas. Estamos ampliando essa linha!",
          date: "2024-01-10",
        },
      ],
    },
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
      question: { label: "Pergunta", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      compliment: { label: "Elogio", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      suggestion: { label: "Sugestão", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
      complaint: { label: "Reclamação", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
    }
    return types[type as keyof typeof types] || types.question
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/usuario/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Meus Comentários</h1>
              <p className="text-muted-foreground">Acompanhe suas interações e respostas dos estabelecimentos</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{comments.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {comments.filter((c) => c.replies.length > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Respondidos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por estabelecimento ou comentário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tipo de comentário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="question">Perguntas</SelectItem>
                  <SelectItem value="compliment">Elogios</SelectItem>
                  <SelectItem value="suggestion">Sugestões</SelectItem>
                  <SelectItem value="complaint">Reclamações</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="likes">Mais curtidos</SelectItem>
                  <SelectItem value="replies">Mais respondidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Comentários */}
        <div className="space-y-6">
          {filteredComments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={comment.business.image || "/placeholder.svg"} alt={comment.business.name} />
                    <AvatarFallback>
                      {comment.business.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{comment.business.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{comment.business.category}</Badge>
                          <Badge className={getTypeLabel(comment.type).color}>{getTypeLabel(comment.type).label}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-foreground leading-relaxed">{comment.comment}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(comment.date).toLocaleDateString("pt-BR")}
                      </div>

                      {comment.likes > 0 && (
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {comment.likes} curtida{comment.likes > 1 ? "s" : ""}
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Reply className="h-4 w-4" />
                        {comment.replies.length} resposta{comment.replies.length !== 1 ? "s" : ""}
                      </div>
                    </div>

                    {/* Respostas */}
                    {comment.replies.length > 0 && (
                      <div className="border-l-2 border-muted pl-4 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm text-foreground">{reply.author}</span>
                              {reply.isOwner && (
                                <Badge variant="outline" className="text-xs">
                                  Proprietário
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {new Date(reply.date).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{reply.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredComments.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Nenhum comentário encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterType !== "all"
                    ? "Tente ajustar os filtros de busca"
                    : "Você ainda não fez nenhum comentário"}
                </p>
                <Button asChild>
                  <Link href="/mapa">Explorar Estabelecimentos</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
