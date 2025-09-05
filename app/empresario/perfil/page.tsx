"use client"

import { ArrowLeft, Save, Upload, MapPin, Phone, Clock, Globe, Camera, Trash2, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"

export default function EmpresarioPerfilPage() {
  const [isEditing, setIsEditing] = useState(false)

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
                <h1 className="text-xl font-bold text-foreground">Editar Perfil</h1>
                <p className="text-sm text-muted-foreground">Gerencie as informações do seu estabelecimento</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Cancelar" : "Editar"}
              </Button>
              {isEditing && (
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Business Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Fotos do Estabelecimento</CardTitle>
              <CardDescription>Adicione fotos atrativas para mostrar seu negócio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center relative group">
                  <Camera className="w-8 h-8 text-primary" />
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <div className="aspect-square bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg flex items-center justify-center relative group">
                  <Camera className="w-8 h-8 text-secondary" />
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center relative group">
                  <Camera className="w-8 h-8 text-accent" />
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                {isEditing && (
                  <div className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <div className="text-center">
                      <Plus className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Adicionar Foto</p>
                    </div>
                  </div>
                )}
              </div>
              {isEditing && (
                <Button variant="outline" className="w-full bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  Fazer Upload de Fotos
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados principais do seu estabelecimento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nome do estabelecimento</Label>
                  <Input
                    id="businessName"
                    defaultValue="Pizzaria do Bairro"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select disabled={!isEditing}>
                    <SelectTrigger className={!isEditing ? "bg-muted" : ""}>
                      <SelectValue placeholder="Restaurantes e Alimentação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurante">Restaurantes e Alimentação</SelectItem>
                      <SelectItem value="comercio">Comércio e Varejo</SelectItem>
                      <SelectItem value="servicos">Serviços Técnicos</SelectItem>
                      <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                      <SelectItem value="beleza">Beleza e Estética</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição do negócio</Label>
                <Textarea
                  id="description"
                  defaultValue="Pizzas artesanais com ingredientes frescos e massa fermentada por 48h. Delivery grátis no bairro Novo Tempo! Trabalhamos com produtos de qualidade e atendimento familiar há mais de 10 anos."
                  disabled={!isEditing}
                  className={`min-h-[100px] ${!isEditing ? "bg-muted" : ""}`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>Como os clientes podem entrar em contato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone principal</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="phone"
                      defaultValue="(11) 3333-3333"
                      disabled={!isEditing}
                      className={`pl-10 ${!isEditing ? "bg-muted" : ""}`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="whatsapp"
                      defaultValue="(11) 99999-9999"
                      disabled={!isEditing}
                      className={`pl-10 ${!isEditing ? "bg-muted" : ""}`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Site/Instagram</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="website"
                    defaultValue="@pizzariadobairro"
                    disabled={!isEditing}
                    className={`pl-10 ${!isEditing ? "bg-muted" : ""}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location and Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Localização e Horários</CardTitle>
              <CardDescription>Onde encontrar e quando funciona</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço completo</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                  <Textarea
                    id="address"
                    defaultValue="Rua das Flores, 123 - Novo Tempo, São Paulo - SP, 01234-567"
                    disabled={!isEditing}
                    className={`pl-10 min-h-[80px] ${!isEditing ? "bg-muted" : ""}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours">Horário de funcionamento</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="hours"
                    defaultValue="Segunda a Domingo: 18h às 23h"
                    disabled={!isEditing}
                    className={`pl-10 ${!isEditing ? "bg-muted" : ""}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services and Specialties */}
          <Card>
            <CardHeader>
              <CardTitle>Serviços e Especialidades</CardTitle>
              <CardDescription>Destaque o que seu negócio oferece de especial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Delivery Grátis</Badge>
                <Badge variant="secondary">Massa Artesanal</Badge>
                <Badge variant="secondary">Ingredientes Frescos</Badge>
                <Badge variant="secondary">Atendimento 24h</Badge>
                <Badge variant="secondary">Aceita Cartão</Badge>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialties">Produtos/Serviços em destaque</Label>
                <Textarea
                  id="specialties"
                  defaultValue="• Pizza Margherita com manjericão fresco&#10;• Pizza Portuguesa com ingredientes premium&#10;• Calzones especiais da casa&#10;• Bebidas geladas e sobremesas&#10;• Delivery gratuito no bairro"
                  disabled={!isEditing}
                  className={`min-h-[120px] ${!isEditing ? "bg-muted" : ""}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
