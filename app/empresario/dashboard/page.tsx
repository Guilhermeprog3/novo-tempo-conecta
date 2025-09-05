"use client"

import {
  BarChart3,
  Star,
  MessageSquare,
  Settings,
  Eye,
  Edit,
  Plus,
  TrendingUp,
  MapPin,
  Phone,
  Globe,
  Clock,
  Bell,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function EmpresarioDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Painel Empresarial</h1>
                <p className="text-sm text-muted-foreground">Pizzaria do Bairro</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Perfil Público
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">PB</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">Pizzaria do Bairro</CardTitle>
                <CardDescription>Restaurante • Novo Tempo</CardDescription>
                <div className="flex items-center justify-center mt-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">4.8</span>
                  <span className="ml-1 text-sm text-muted-foreground">(127 avaliações)</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <nav className="space-y-1">
                  <Button variant="secondary" className="w-full justify-start bg-primary/10 text-primary">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/empresario/perfil">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/empresario/avaliacoes">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Avaliações
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/empresario/configuracoes">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações
                    </Link>
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Visualizações</p>
                      <p className="text-2xl font-bold">1,234</p>
                    </div>
                    <Eye className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500">+12%</span>
                    <span className="text-muted-foreground ml-1">vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avaliações</p>
                      <p className="text-2xl font-bold">127</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500">+8</span>
                    <span className="text-muted-foreground ml-1">este mês</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contatos</p>
                      <p className="text-2xl font-bold">89</p>
                    </div>
                    <Phone className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500">+15</span>
                    <span className="text-muted-foreground ml-1">esta semana</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nota Média</p>
                      <p className="text-2xl font-bold">4.8</p>
                    </div>
                    <Star className="w-8 h-8 text-primary fill-current" />
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-green-500">Excelente</span>
                    <span className="text-muted-foreground ml-1">classificação</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Gerencie seu estabelecimento de forma eficiente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-auto p-4 flex-col space-y-2" asChild>
                    <Link href="/empresario/perfil">
                      <Edit className="w-6 h-6" />
                      <span>Editar Informações</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent" asChild>
                    <Link href="/empresario/avaliacoes">
                      <MessageSquare className="w-6 h-6" />
                      <span>Responder Avaliações</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                    <Plus className="w-6 h-6" />
                    <span>Adicionar Fotos</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Avaliações Recentes</CardTitle>
                    <CardDescription>Últimas avaliações do seu estabelecimento</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/empresario/avaliacoes">Ver todas</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">Maria Clara</p>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">2 dias atrás</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Pizza deliciosa e atendimento excelente! A massa é perfeita e os ingredientes são frescos. Super
                      recomendo!
                    </p>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Responder
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">João Silva</p>
                        <div className="flex items-center">
                          {[1, 2, 3, 4].map((star) => (
                            <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                          <Star className="w-4 h-4 text-gray-300" />
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">5 dias atrás</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Boa pizza, mas o tempo de entrega poderia ser melhor. No geral, recomendo!
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Responder
                      </Button>
                      <Badge variant="secondary" className="text-xs">
                        Respondido
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Info Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Estabelecimento</CardTitle>
                <CardDescription>Resumo das suas informações públicas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Endereço</p>
                        <p className="text-sm text-muted-foreground">Rua das Flores, 123 - Novo Tempo</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Telefone</p>
                        <p className="text-sm text-muted-foreground">(11) 3333-3333</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Horário</p>
                        <p className="text-sm text-muted-foreground">Seg-Dom: 18h-23h</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Instagram</p>
                        <p className="text-sm text-muted-foreground">@pizzariadobairro</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Completude do Perfil</p>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Adicione mais fotos e informações para melhorar sua visibilidade
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
