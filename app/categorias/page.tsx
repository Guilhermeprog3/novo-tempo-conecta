import {
  Search,
  Utensils,
  Store,
  Wrench,
  Heart,
  GraduationCap,
  Car,
  Home,
  Scissors,
  Coffee,
  ShoppingBag,
  Dumbbell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function CategoriasPage() {
  const categories = [
    {
      icon: Utensils,
      name: "Restaurantes e Alimentação",
      count: 45,
      description: "Pizzarias, lanchonetes, restaurantes, padarias e delivery",
      color: "from-orange-500/20 to-red-500/20",
      iconColor: "text-orange-600",
    },
    {
      icon: Store,
      name: "Comércio e Varejo",
      count: 38,
      description: "Mercados, lojas, farmácias e comércio em geral",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-600",
    },
    {
      icon: Wrench,
      name: "Serviços Técnicos",
      count: 32,
      description: "Mecânicas, eletricistas, encanadores e reparos",
      color: "from-gray-500/20 to-slate-500/20",
      iconColor: "text-gray-600",
    },
    {
      icon: Heart,
      name: "Saúde e Bem-estar",
      count: 28,
      description: "Clínicas, consultórios, farmácias e terapias",
      color: "from-pink-500/20 to-rose-500/20",
      iconColor: "text-pink-600",
    },
    {
      icon: Scissors,
      name: "Beleza e Estética",
      count: 25,
      description: "Salões, barbearias, estética e cuidados pessoais",
      color: "from-purple-500/20 to-violet-500/20",
      iconColor: "text-purple-600",
    },
    {
      icon: GraduationCap,
      name: "Educação e Cursos",
      count: 18,
      description: "Escolas, cursos profissionalizantes e reforço",
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-600",
    },
    {
      icon: Car,
      name: "Automotivo",
      count: 22,
      description: "Oficinas, lava-jatos, autopeças e serviços automotivos",
      color: "from-indigo-500/20 to-blue-500/20",
      iconColor: "text-indigo-600",
    },
    {
      icon: Home,
      name: "Casa e Construção",
      count: 20,
      description: "Material de construção, decoração e reformas",
      color: "from-amber-500/20 to-yellow-500/20",
      iconColor: "text-amber-600",
    },
    {
      icon: Coffee,
      name: "Cafés e Lazer",
      count: 15,
      description: "Cafeterias, bares, entretenimento e lazer",
      color: "from-brown-500/20 to-orange-500/20",
      iconColor: "text-amber-700",
    },
    {
      icon: ShoppingBag,
      name: "Moda e Vestuário",
      count: 12,
      description: "Roupas, calçados, acessórios e moda em geral",
      color: "from-teal-500/20 to-cyan-500/20",
      iconColor: "text-teal-600",
    },
    {
      icon: Dumbbell,
      name: "Esportes e Fitness",
      count: 10,
      description: "Academias, esportes, atividades físicas e equipamentos",
      color: "from-red-500/20 to-pink-500/20",
      iconColor: "text-red-600",
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
                <Store className="w-5 h-5 text-primary-foreground" />
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
              <Link href="/categorias" className="text-primary font-medium">
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

      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Explore por <span className="text-primary">Categorias</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Encontre exatamente o que você precisa navegando pelas categorias de negócios do bairro Novo Tempo.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Buscar categoria ou estabelecimento..."
                className="pl-12 pr-4 py-6 text-lg rounded-full border-2 border-border focus:border-primary"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-8">Buscar</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                >
                  <div
                    className={`h-32 bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                  >
                    <IconComponent className={`w-16 h-16 ${category.iconColor}`} />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="mt-2">{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-sm">
                        {category.count} estabelecimentos
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Ver todos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">Não encontrou sua categoria?</h3>
          <p className="text-xl text-muted-foreground mb-8">
            Sugerir uma nova categoria ou cadastrar seu negócio em uma categoria personalizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Sugerir Categoria
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Cadastrar Negócio
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
