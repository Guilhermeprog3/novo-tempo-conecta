"use client"

import {
  Star,
  MapPin,
  Phone,
  Clock,
  Globe,
  Share2,
  Heart,
  MessageSquare,
  Navigation,
  Camera,
  ThumbsUp,
  Flag,
  Send,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function EstabelecimentoPage({ params }: { params: { id: string } }) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [comments, setComments] = useState([
    {
      id: "1",
      user: "Carlos Mendes",
      avatar: "CM",
      date: "1 hora atrás",
      comment: "Ótimo atendimento! Recomendo muito este lugar.",
      isGuest: false,
    },
    {
      id: "2",
      user: "Visitante",
      avatar: "V",
      date: "3 horas atrás",
      comment: "Lugar muito aconchegante, voltarei em breve!",
      isGuest: true,
    },
  ])

  useEffect(() => {
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user)
  }, [])

  const handleAddComment = () => {
    if (!newComment.trim()) return

    if (!isLoggedIn && (!guestName.trim() || !guestEmail.trim())) {
      alert("Por favor, preencha seu nome e email para comentar.")
      return
    }

    const comment = {
      id: Date.now().toString(),
      user: isLoggedIn ? JSON.parse(localStorage.getItem("user") || "{}").name || "Usuário" : guestName,
      avatar: isLoggedIn
        ? JSON.parse(localStorage.getItem("user") || "{}").name?.charAt(0) || "U"
        : guestName.charAt(0),
      date: "Agora",
      comment: newComment,
      isGuest: !isLoggedIn,
    }

    setComments([comment, ...comments])
    setNewComment("")
    setGuestName("")
    setGuestEmail("")
    setShowCommentForm(false)
  }

  const business = {
    id: params.id,
    name: "Pizzaria do Bairro",
    category: "Restaurante",
    rating: 4.8,
    reviewCount: 127,
    address: "Rua das Flores, 123 - Novo Tempo",
    phone: "(11) 3333-3333",
    whatsapp: "(11) 99999-9999",
    hours: "Segunda a Domingo: 18h às 23h",
    website: "@pizzariadobairro",
    description:
      "Pizzas artesanais com ingredientes frescos e massa fermentada por 48h. Delivery grátis no bairro Novo Tempo! Trabalhamos com produtos de qualidade e atendimento familiar há mais de 10 anos.",
    specialties: ["Delivery Grátis", "Massa Artesanal", "Ingredientes Frescos", "Aceita Cartão"],
    isOpen: true,
  }

  const reviews = [
    {
      id: "1",
      user: "Maria Clara",
      avatar: "MC",
      rating: 5,
      date: "2 dias atrás",
      comment:
        "Pizza deliciosa e atendimento excelente! A massa é perfeita e os ingredientes são frescos. Super recomendo!",
      helpful: 12,
    },
    {
      id: "2",
      user: "João Silva",
      avatar: "JS",
      rating: 4,
      date: "5 dias atrás",
      comment: "Boa pizza, mas o tempo de entrega poderia ser melhor. No geral, recomendo!",
      helpful: 8,
    },
    {
      id: "3",
      user: "Ana Santos",
      avatar: "AS",
      rating: 5,
      date: "1 semana atrás",
      comment: "Melhor pizza do bairro! Ingredientes de qualidade e preço justo. A pizza de calabresa é sensacional!",
      helpful: 15,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Novo Tempo Conecta</h1>
                <p className="text-sm text-muted-foreground">Seu bairro, seus negócios</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Início
              </Link>
              <Link href="/mapa" className="text-foreground hover:text-primary transition-colors">
                Mapa
              </Link>
              <Link href="/categorias" className="text-foreground hover:text-primary transition-colors">
                Categorias
              </Link>
              <Link href="/sobre" className="text-foreground hover:text-primary transition-colors">
                Sobre
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/cadastro">Cadastrar Negócio</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{business.name}</h1>
                    <div className="flex items-center space-x-4 mb-2">
                      <Badge variant="secondary">{business.category}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{business.rating}</span>
                        <span className="text-muted-foreground">({business.reviewCount} avaliações)</span>
                      </div>
                      {business.isOpen && <Badge className="bg-green-500">Aberto</Badge>}
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{business.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{business.description}</p>

                <div className="flex flex-wrap gap-2">
                  {business.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle>Fotos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((photo) => (
                    <div
                      key={photo}
                      className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Camera className="w-8 h-8 text-primary" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Comentários</CardTitle>
                    <CardDescription>{comments.length} comentários da comunidade</CardDescription>
                  </div>
                  <Button onClick={() => setShowCommentForm(!showCommentForm)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Comentar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {showCommentForm && (
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium mb-2">Deixe seu comentário</p>
                          <Textarea
                            placeholder="Compartilhe sua experiência ou opinião sobre este local..."
                            className="min-h-[100px]"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                        </div>

                        {!isLoggedIn && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div>
                              <Label htmlFor="guest-name">Seu nome</Label>
                              <Input
                                id="guest-name"
                                placeholder="Digite seu nome"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="guest-email">Seu email</Label>
                              <Input
                                id="guest-email"
                                type="email"
                                placeholder="Digite seu email"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground col-span-full">
                              Seu email não será exibido publicamente
                            </p>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Button onClick={handleAddComment}>
                            <Send className="w-4 h-4 mr-2" />
                            Publicar Comentário
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowCommentForm(false)}
                            className="bg-transparent"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback className={comment.isGuest ? "bg-muted" : "bg-primary/10"}>
                            {comment.isGuest ? <User className="w-4 h-4" /> : comment.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium flex items-center space-x-2">
                                <span>{comment.user}</span>
                                {comment.isGuest && (
                                  <Badge variant="outline" className="text-xs">
                                    Visitante
                                  </Badge>
                                )}
                              </p>
                              <span className="text-sm text-muted-foreground">{comment.date}</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{comment.comment}</p>
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              Útil
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Flag className="w-4 h-4 mr-1" />
                              Denunciar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {comments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Seja o primeiro a comentar sobre este local!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Avaliações</CardTitle>
                    <CardDescription>{business.reviewCount} avaliações de clientes</CardDescription>
                  </div>
                  <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                    <Star className="w-4 h-4 mr-2" />
                    Avaliar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Review Form */}
                {showReviewForm && (
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium mb-2">Sua avaliação</p>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} onClick={() => setUserRating(star)} className="focus:outline-none">
                                <Star
                                  className={`w-6 h-6 ${
                                    star <= userRating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  } hover:text-yellow-400 transition-colors`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <Textarea placeholder="Conte sobre sua experiência..." className="min-h-[100px]" />
                        <div className="flex items-center space-x-2">
                          <Button>
                            <Send className="w-4 h-4 mr-2" />
                            Publicar Avaliação
                          </Button>
                          <Button variant="outline" onClick={() => setShowReviewForm(false)} className="bg-transparent">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
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
                          </div>
                          <p className="text-muted-foreground mb-3">{review.comment}</p>
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              Útil ({review.helpful})
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Flag className="w-4 h-4 mr-1" />
                              Denunciar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Ver todas as avaliações
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{business.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">{business.whatsapp}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Instagram</p>
                    <p className="text-sm text-muted-foreground">{business.website}</p>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar Agora
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Horário de Funcionamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{business.hours}</p>
                    <p className="text-sm text-green-600">Aberto agora</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Endereço</p>
                    <p className="text-sm text-muted-foreground">{business.address}</p>
                  </div>
                </div>

                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-12 h-12 text-primary" />
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <Navigation className="w-4 h-4 mr-2" />
                  Como Chegar
                </Button>
              </CardContent>
            </Card>

            {/* Similar Businesses */}
            <Card>
              <CardHeader>
                <CardTitle>Estabelecimentos Similares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Lanchonete Central", rating: 4.5, category: "Lanchonete" },
                  { name: "Restaurante Família", rating: 4.7, category: "Restaurante" },
                  { name: "Pizzaria Italiana", rating: 4.3, category: "Pizzaria" },
                ].map((similar, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{similar.name}</p>
                      <p className="text-xs text-muted-foreground">{similar.category}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-medium">{similar.rating}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
