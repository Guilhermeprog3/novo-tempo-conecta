"use client"

import { ArrowLeft, Star, MessageSquare, Search, Send, ThumbsUp, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"

export default function EmpresarioAvaliacoesPage() {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const reviews = [
    {
      id: "1",
      user: "Maria Clara",
      avatar: "MC",
      rating: 5,
      date: "2 dias atrás",
      comment:
        "Pizza deliciosa e atendimento excelente! A massa é perfeita e os ingredientes são frescos. Super recomendo!",
      hasReply: false,
    },
    {
      id: "2",
      user: "João Silva",
      avatar: "JS",
      rating: 4,
      date: "5 dias atrás",
      comment: "Boa pizza, mas o tempo de entrega poderia ser melhor. No geral, recomendo!",
      hasReply: true,
      reply:
        "Obrigado pelo feedback, João! Estamos trabalhando para melhorar nosso tempo de entrega. Esperamos vê-lo novamente em breve!",
    },
    {
      id: "3",
      user: "Ana Santos",
      avatar: "AS",
      rating: 5,
      date: "1 semana atrás",
      comment: "Melhor pizza do bairro! Ingredientes de qualidade e preço justo. A pizza de calabresa é sensacional!",
      hasReply: true,
      reply: "Muito obrigado, Ana! Ficamos felizes que tenha gostado da nossa calabresa especial!",
    },
    {
      id: "4",
      user: "Carlos Oliveira",
      avatar: "CO",
      rating: 3,
      date: "2 semanas atrás",
      comment: "Pizza boa, mas achei um pouco salgada. O atendimento foi cordial.",
      hasReply: false,
    },
    {
      id: "5",
      user: "Fernanda Lima",
      avatar: "FL",
      rating: 5,
      date: "3 semanas atrás",
      comment:
        "Excelente! Pizza chegou quentinha e no tempo prometido. A margherita estava perfeita. Parabéns pela qualidade!",
      hasReply: true,
      reply: "Obrigado, Fernanda! Nossa margherita é feita com muito carinho. Volte sempre!",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/empresario/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Avaliações</h1>
                <p className="text-sm text-muted-foreground">Gerencie as avaliações do seu estabelecimento</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-sm">
                127 avaliações
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">4.8</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">4.8</div>
                <div className="text-sm text-muted-foreground">Nota Média</div>
                <div className="flex justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {[5, 4, 3, 2, 1].map((stars) => (
              <Card key={stars} className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <span className="text-sm font-medium">{stars}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {stars === 5 ? "89" : stars === 4 ? "28" : stars === 3 ? "8" : stars === 2 ? "2" : "0"}
                  </div>
                  <div className="text-xs text-muted-foreground">avaliações</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Buscar nas avaliações..." className="pl-10" />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
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
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais recentes</SelectItem>
                    <SelectItem value="oldest">Mais antigas</SelectItem>
                    <SelectItem value="highest">Maior nota</SelectItem>
                    <SelectItem value="lowest">Menor nota</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>{review.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{review.user}</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Flag className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{review.comment}</p>

                      {review.hasReply && review.reply && (
                        <div className="bg-muted/50 rounded-lg p-4 mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              Resposta da empresa
                            </Badge>
                          </div>
                          <p className="text-sm">{review.reply}</p>
                        </div>
                      )}

                      {replyingTo === review.id ? (
                        <div className="space-y-3">
                          <Textarea placeholder="Digite sua resposta..." className="min-h-[80px]" />
                          <div className="flex items-center space-x-2">
                            <Button size="sm">
                              <Send className="w-4 h-4 mr-2" />
                              Enviar Resposta
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        !review.hasReply && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReplyingTo(review.id)}
                            className="bg-transparent"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Responder
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <Button variant="outline" className="bg-transparent">
              Carregar mais avaliações
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
