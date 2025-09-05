"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ArrowLeft, Search, Filter, Calendar, Edit3, Trash2, ThumbsUp, MessageSquare } from "lucide-react"

export default function UsuarioAvaliacoes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const [reviews] = useState([
    {
      id: 1,
      business: {
        name: "Padaria do João",
        category: "Alimentação",
        image: "/padaria.png",
      },
      rating: 5,
      title: "Excelente padaria no bairro!",
      comment:
        "Atendimento excepcional e pães sempre fresquinhos. A equipe é muito simpática e o ambiente é acolhedor. Recomendo especialmente o pão francês e os doces caseiros.",
      date: "2024-01-20",
      helpful: 8,
      replies: 1,
      photos: 2,
    },
    {
      id: 2,
      business: {
        name: "Farmácia Central",
        category: "Saúde",
        image: "/farmacia.jpg",
      },
      rating: 4,
      title: "Boa farmácia, preços justos",
      comment:
        "Farmácia bem localizada com bom atendimento. Os preços são competitivos e sempre tem os medicamentos que preciso. Único ponto negativo é que às vezes demora um pouco para ser atendido.",
      date: "2024-01-18",
      helpful: 5,
      replies: 0,
      photos: 0,
    },
    {
      id: 3,
      business: {
        name: "Restaurante Sabor Caseiro",
        category: "Alimentação",
        image: "/cozy-italian-restaurant.png",
      },
      rating: 5,
      title: "Comida caseira deliciosa!",
      comment:
        "O melhor restaurante de comida caseira da região! Pratos bem servidos, tempero perfeito e preço justo. O ambiente é simples mas muito acolhedor.",
      date: "2024-01-15",
      helpful: 12,
      replies: 2,
      photos: 3,
    },
    {
      id: 4,
      business: {
        name: "Mercadinho São José",
        category: "Comércio",
        image: "/bustling-market.png",
      },
      rating: 3,
      title: "Conveniente mas pode melhorar",
      comment:
        "Mercadinho bem localizado e com horário estendido, o que é muito conveniente. Porém, alguns produtos estão sempre com preços acima da média e a variedade poderia ser maior.",
      date: "2024-01-10",
      helpful: 3,
      replies: 1,
      photos: 0,
    },
  ])

  const filteredReviews = reviews
    .filter((review) => {
      const matchesSearch =
        review.business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRating = filterRating === "all" || review.rating.toString() === filterRating
      return matchesSearch && matchesRating
    })
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "helpful") return b.helpful - a.helpful
      return 0
    })

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

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
              <h1 className="text-3xl font-bold text-foreground mb-2">Minhas Avaliações</h1>
              <p className="text-muted-foreground">
                Gerencie todas as suas avaliações e acompanhe o feedback da comunidade
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{reviews.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{averageRating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Média</div>
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

              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por nota" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as notas</SelectItem>
                  <SelectItem value="5">5 estrelas</SelectItem>
                  <SelectItem value="4">4 estrelas</SelectItem>
                  <SelectItem value="3">3 estrelas</SelectItem>
                  <SelectItem value="2">2 estrelas</SelectItem>
                  <SelectItem value="1">1 estrela</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="rating">Maior nota</SelectItem>
                  <SelectItem value="helpful">Mais úteis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Avaliações */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={review.business.image || "/placeholder.svg"} alt={review.business.name} />
                    <AvatarFallback>
                      {review.business.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{review.business.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{review.business.category}</Badge>
                          <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
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
                      <h4 className="font-medium text-foreground mb-2">{review.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(review.date).toLocaleDateString("pt-BR")}
                      </div>

                      {review.helpful > 0 && (
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {review.helpful} acharam útil
                        </div>
                      )}

                      {review.replies > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {review.replies} resposta{review.replies > 1 ? "s" : ""}
                        </div>
                      )}

                      {review.photos > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {review.photos} foto{review.photos > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma avaliação encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterRating !== "all"
                    ? "Tente ajustar os filtros de busca"
                    : "Você ainda não fez nenhuma avaliação"}
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
