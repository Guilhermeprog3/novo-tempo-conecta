"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/navigation/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageSquare, Star, MapPin, Calendar, TrendingUp, Award, Settings, Edit3 } from "lucide-react"

export default function UsuarioDashboard() {
  const [user, setUser] = useState({
    name: "Maria Silva",
    email: "maria.silva@email.com",
    avatar: "/avatar-mulher-brasileira.jpg",
    memberSince: "2024-01-15",
    totalFavorites: 12,
    totalReviews: 8,
    totalComments: 15,
    averageRating: 4.2,
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "review",
      business: "Padaria do João",
      action: "Avaliou",
      rating: 5,
      date: "2024-01-20",
      comment: "Excelente atendimento e pães fresquinhos!",
    },
    {
      id: 2,
      type: "favorite",
      business: "Farmácia Central",
      action: "Adicionou aos favoritos",
      date: "2024-01-19",
    },
    {
      id: 3,
      type: "comment",
      business: "Restaurante Sabor Caseiro",
      action: "Comentou",
      date: "2024-01-18",
      comment: "Quando vocês vão ter delivery?",
    },
  ])

  const [favoriteCategories, setFavoriteCategories] = useState([
    { name: "Alimentação", count: 5 },
    { name: "Saúde", count: 3 },
    { name: "Serviços", count: 2 },
    { name: "Comércio", count: 2 },
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header do Dashboard */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">Olá, {user.name.split(" ")[0]}! 👋</h1>
              <p className="text-muted-foreground mb-4">
                Membro desde{" "}
                {new Date(user.memberSince).toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {user.totalFavorites} favoritos
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {user.totalReviews} avaliações
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {user.totalComments} comentários
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/usuario/perfil">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/usuario/configuracoes">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Estatísticas Rápidas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Locais Favoritos</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.totalFavorites}</div>
                  <p className="text-xs text-muted-foreground">+2 este mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avaliações Dadas</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.totalReviews}</div>
                  <p className="text-xs text-muted-foreground">Média: {user.averageRating} estrelas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Comentários</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.totalComments}</div>
                  <p className="text-xs text-muted-foreground">+3 esta semana</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contribuições</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.totalReviews + user.totalComments}</div>
                  <p className="text-xs text-muted-foreground">Total de interações</p>
                </CardContent>
              </Card>
            </div>

            {/* Atividade Recente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Atividade Recente
                </CardTitle>
                <CardDescription>Suas últimas interações na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id}>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {activity.type === "review" && (
                            <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            </div>
                          )}
                          {activity.type === "favorite" && (
                            <div className="h-8 w-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                              <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                          )}
                          {activity.type === "comment" && (
                            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-foreground">
                              {activity.action} <span className="text-primary">{activity.business}</span>
                            </p>
                            {activity.rating && (
                              <div className="flex items-center gap-1">
                                {[...Array(activity.rating)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            )}
                          </div>
                          {activity.comment && (
                            <p className="text-sm text-muted-foreground mb-2">"{activity.comment}"</p>
                          )}
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(activity.date).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      {index < recentActivity.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/usuario/atividades">Ver Todas as Atividades</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link href="/mapa">
                    <MapPin className="h-4 w-4 mr-2" />
                    Explorar Mapa
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/favoritos">
                    <Heart className="h-4 w-4 mr-2" />
                    Meus Favoritos
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/usuario/avaliacoes">
                    <Star className="h-4 w-4 mr-2" />
                    Minhas Avaliações
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/usuario/comentarios">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Meus Comentários
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Categorias Favoritas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categorias Favoritas</CardTitle>
                <CardDescription>Seus tipos de estabelecimentos preferidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {favoriteCategories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.name}</span>
                      <Badge variant="secondary">{category.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dica do Dia */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">💡 Dica do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Que tal avaliar os estabelecimentos que você visitou recentemente? Suas avaliações ajudam outros
                  moradores a descobrir os melhores lugares do bairro!
                </p>
                <Button asChild size="sm" className="mt-3 w-full">
                  <Link href="/mapa">Explorar Agora</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
