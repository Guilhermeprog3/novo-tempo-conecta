"use client"

import { useState } from "react"
import { Search, MapPin, Star, Filter, Navigation, Clock, Globe, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function MapaPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [minRating, setMinRating] = useState([0])
  const [maxDistance, setMaxDistance] = useState([5])
  const [sortBy, setSortBy] = useState("relevancia")
  const [isOpen, setIsOpen] = useState("todos")

  const categories = ["Restaurante", "Comércio", "Serviços", "Saúde", "Beleza", "Educação", "Lazer"]

  const establishments = [
    {
      id: 1,
      name: "Pizzaria do Bairro",
      address: "Rua das Flores, 123",
      category: "Restaurante",
      rating: 4.8,
      isOpen: true,
      distance: 0.5,
    },
    {
      id: 2,
      name: "Mercadinho São José",
      address: "Av. Principal, 456",
      category: "Comércio",
      rating: 4.6,
      isOpen: true,
      distance: 1.2,
    },
    {
      id: 3,
      name: "Auto Elétrica Silva",
      address: "Rua dos Mecânicos, 789",
      category: "Serviços",
      rating: 4.9,
      isOpen: false,
      distance: 2.1,
    },
    {
      id: 4,
      name: "Farmácia Popular",
      address: "Rua da Saúde, 321",
      category: "Saúde",
      rating: 4.7,
      isOpen: true,
      distance: 0.8,
    },
    {
      id: 5,
      name: "Salão Beleza Pura",
      address: "Av. Estilo, 654",
      category: "Beleza",
      rating: 4.5,
      isOpen: true,
      distance: 1.5,
    },
  ]

  const filteredEstablishments = establishments.filter((establishment) => {
    const matchesSearch =
      establishment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      establishment.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(establishment.category)

    const matchesRating = establishment.rating >= minRating[0]

    const matchesDistance = establishment.distance <= maxDistance[0]

    const matchesOpenStatus =
      isOpen === "todos" ||
      (isOpen === "aberto" && establishment.isOpen) ||
      (isOpen === "fechado" && !establishment.isOpen)

    return matchesSearch && matchesCategory && matchesRating && matchesDistance && matchesOpenStatus
  })

  const sortedEstablishments = [...filteredEstablishments].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "distance":
        return a.distance - b.distance
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setMinRating([0])
    setMaxDistance([5])
    setSortBy("relevancia")
    setIsOpen("todos")
    setSearchTerm("")
  }

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
              <Link href="/mapa" className="text-primary font-medium">
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

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-1/3 border-r bg-card overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Mapa Interativo</h2>
              <Badge variant="secondary" className="text-xs">
                {sortedEstablishments.length} encontrados
              </Badge>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar estabelecimentos..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="flex-1 justify-start bg-transparent"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                  <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>

                {(selectedCategories.length > 0 || minRating[0] > 0 || maxDistance[0] < 5 || isOpen !== "todos") && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {showFilters && (
                <Card className="p-4 space-y-4">
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-3">Categorias</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                          />
                          <label htmlFor={category} className="text-sm cursor-pointer">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Rating Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Avaliação Mínima</h4>
                    <div className="space-y-2">
                      <Slider
                        value={minRating}
                        onValueChange={setMinRating}
                        max={5}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span className="font-medium">{minRating[0]} estrelas</span>
                        <span>5</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Distance Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Distância Máxima</h4>
                    <div className="space-y-2">
                      <Slider
                        value={maxDistance}
                        onValueChange={setMaxDistance}
                        max={10}
                        min={0.5}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>0.5km</span>
                        <span className="font-medium">{maxDistance[0]}km</span>
                        <span>10km</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Status Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Status</h4>
                    <Select value={isOpen} onValueChange={setIsOpen}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="aberto">Apenas Abertos</SelectItem>
                        <SelectItem value="fechado">Apenas Fechados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Sort Options */}
                  <div>
                    <h4 className="font-medium mb-3">Ordenar por</h4>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevancia">Relevância</SelectItem>
                        <SelectItem value="rating">Melhor Avaliação</SelectItem>
                        <SelectItem value="distance">Mais Próximo</SelectItem>
                        <SelectItem value="name">Nome A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>
              )}
            </div>

            {/* Business List */}
            <div className="space-y-4">
              {sortedEstablishments.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">Nenhum estabelecimento encontrado com os filtros aplicados.</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={clearFilters}>
                    Limpar Filtros
                  </Button>
                </Card>
              ) : (
                sortedEstablishments.map((establishment) => (
                  <Card
                    key={establishment.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      establishment.category === "Restaurante" ? "border-l-4 border-l-primary" : ""
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{establishment.name}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {establishment.address} • {establishment.distance}km
                          </CardDescription>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="ml-1 text-xs font-medium">{establishment.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="secondary" className="text-xs">
                          {establishment.category}
                        </Badge>
                        <div
                          className={`flex items-center ${establishment.isOpen ? "text-green-600" : "text-red-600"}`}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {establishment.isOpen ? "Aberto" : "Fechado"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-24 h-24 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Mapa Interativo</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Visualize todos os estabelecimentos do bairro Novo Tempo em um mapa interativo. Clique nos marcadores
                para ver mais detalhes.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button>
                  <Navigation className="w-4 h-4 mr-2" />
                  Minha Localização
                </Button>
                <Button variant="outline">
                  <Globe className="w-4 h-4 mr-2" />
                  Ver no Google Maps
                </Button>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
              +
            </Button>
            <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
              -
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
