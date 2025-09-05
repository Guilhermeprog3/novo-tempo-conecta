"use client"

import { Search, MapPin, Star, Clock, SlidersHorizontal, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { useState } from "react"

export default function BuscaPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const businesses = [
    {
      id: "1",
      name: "Pizzaria do Bairro",
      category: "Restaurante",
      rating: 4.8,
      reviewCount: 127,
      address: "Rua das Flores, 123",
      distance: "0.2 km",
      isOpen: true,
      image: "pizza",
      description: "Pizzas artesanais com ingredientes frescos",
    },
    {
      id: "2",
      name: "Mercadinho São José",
      category: "Comércio",
      rating: 4.6,
      reviewCount: 89,
      address: "Av. Principal, 456",
      distance: "0.5 km",
      isOpen: true,
      image: "market",
      description: "Produtos frescos e hortifrúti selecionado",
    },
    {
      id: "3",
      name: "Auto Elétrica Silva",
      category: "Serviços",
      rating: 4.9,
      reviewCount: 45,
      address: "Rua dos Mecânicos, 789",
      distance: "0.8 km",
      isOpen: false,
      image: "auto",
      description: "Especialista em sistemas elétricos automotivos",
    },
    {
      id: "4",
      name: "Salão Beleza Total",
      category: "Beleza",
      rating: 4.7,
      reviewCount: 156,
      address: "Rua da Beleza, 321",
      distance: "1.1 km",
      isOpen: true,
      image: "salon",
      description: "Cortes modernos e tratamentos capilares",
    },
    {
      id: "5",
      name: "Farmácia Popular",
      category: "Saúde",
      rating: 4.4,
      reviewCount: 78,
      address: "Av. Saúde, 654",
      distance: "1.3 km",
      isOpen: true,
      image: "pharmacy",
      description: "Medicamentos e produtos de saúde",
    },
    {
      id: "6",
      name: "Padaria Pão Quente",
      category: "Alimentação",
      rating: 4.5,
      reviewCount: 203,
      address: "Rua do Pão, 987",
      distance: "1.5 km",
      isOpen: true,
      image: "bakery",
      description: "Pães frescos e salgados artesanais",
    },
  ]

  const categories = [
    "Todos",
    "Restaurante",
    "Comércio",
    "Serviços",
    "Beleza",
    "Saúde",
    "Alimentação",
    "Automotivo",
    "Educação",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Buscar Estabelecimentos</h1>
                <p className="text-sm text-muted-foreground">Encontre o que você precisa no Novo Tempo</p>
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Filtros</span>
                  <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setShowFilters(false)}>
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label>Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Nome ou tipo de negócio..." className="pl-10" />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <Label>Categorias</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={category} />
                        <Label htmlFor={category} className="text-sm">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distance */}
                <div className="space-y-2">
                  <Label>Distância máxima</Label>
                  <div className="px-2">
                    <Slider defaultValue={[2]} max={5} step={0.5} className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0 km</span>
                      <span>2 km</span>
                      <span>5 km</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label>Avaliação mínima</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer avaliação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Qualquer avaliação</SelectItem>
                      <SelectItem value="4">4+ estrelas</SelectItem>
                      <SelectItem value="4.5">4.5+ estrelas</SelectItem>
                      <SelectItem value="4.8">4.8+ estrelas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="open" />
                      <Label htmlFor="open" className="text-sm">
                        Aberto agora
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="delivery" />
                      <Label htmlFor="delivery" className="text-sm">
                        Faz delivery
                      </Label>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Aplicar Filtros</Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Search Bar and Controls */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Busque por 'pizza', 'farmácia', 'salão'..." className="pl-10" />
                </div>
                <Button className="md:w-auto">Buscar</Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevância</SelectItem>
                      <SelectItem value="distance">Distância</SelectItem>
                      <SelectItem value="rating">Avaliação</SelectItem>
                      <SelectItem value="reviews">Nº de avaliações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                Encontrados {businesses.length} estabelecimentos no Novo Tempo
              </p>
            </div>

            {/* Results Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {businesses.map((business) => (
                <Card
                  key={business.id}
                  className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                  asChild
                >
                  <Link href={`/estabelecimento/${business.id}`}>
                    <div
                      className={`${
                        viewMode === "list" ? "w-48 h-32" : "h-48"
                      } bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center`}
                    >
                      <MapPin className="w-16 h-16 text-primary" />
                    </div>
                    <div className={viewMode === "list" ? "flex-1" : ""}>
                      <CardHeader className={viewMode === "list" ? "pb-2" : ""}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{business.name}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Badge variant="secondary" className="mr-2 text-xs">
                                {business.category}
                              </Badge>
                              <MapPin className="w-3 h-3 mr-1" />
                              {business.address}
                            </CardDescription>
                          </div>
                          <div className="flex items-center ml-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium">{business.rating}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className={viewMode === "list" ? "pt-0" : ""}>
                        <p className="text-sm text-muted-foreground mb-3">{business.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="text-muted-foreground">{business.distance}</span>
                            <span className="text-muted-foreground">({business.reviewCount} avaliações)</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span className={business.isOpen ? "text-green-600" : "text-red-600"}>
                              {business.isOpen ? "Aberto" : "Fechado"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" className="bg-transparent">
                Carregar mais resultados
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
