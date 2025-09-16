"use client"

import { useState, useEffect } from "react"
import { MapPin, Star, Users, Store, Utensils, Wrench, Heart, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { SearchBar } from "@/components/search-bar"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore"

// Tipo para os dados do negócio
type Business = {
  id: string;
  businessName: string;
  address: string;
  category: string;
  description: string;
  rating?: number;
  hours?: string;
  images?: string[];
};

export default function HomePage() {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [stats, setStats] = useState({ businessCount: 0 });
  const [loading, setLoading] = useState(true);

  const categoryLinks = [
    { name: "Restaurantes", value: "restaurante", icon: Utensils },
    { name: "Comércio", value: "comercio", icon: Store },
    { name: "Serviços", value: "servicos", icon: Wrench },
    { name: "Saúde", value: "saude", icon: Heart },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessesCollection = collection(db, "businesses");
        const allBusinessSnapshot = await getDocs(businessesCollection);
        setStats({ businessCount: allBusinessSnapshot.size });

        const featuredQuery = query(businessesCollection, limit(3));
        const featuredSnapshot = await getDocs(featuredQuery);
        const businessesList = featuredSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Business[];
        setFeaturedBusinesses(businessesList);

      } catch (error) {
        console.error("Erro ao buscar dados da página inicial:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              <Link href="/" className="text-primary font-medium">
                Início
              </Link>
              <Link href="/mapa" className="text-foreground hover:text-primary transition-colors">
                Mapa
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
                <Link href="/empresario/cadastro">Cadastrar Negócio</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Descubra o melhor do <span className="text-primary">Novo Tempo</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Conecte-se com os negócios locais, descubra novos serviços e fortaleça nossa comunidade. Tudo que você
            precisa está aqui no seu bairro.
          </p>
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar placeholder="Busque por 'pizza', 'farmácia', 'salão de beleza'..." />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categoryLinks.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.value} href={`/busca?categoria=${cat.value}`}>
                  <Badge variant="secondary" className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Icon className="w-4 h-4 mr-2" />
                    {cat.name}
                  </Badge>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">{loading ? <Skeleton className="h-10 w-24 mx-auto" /> : `${stats.businessCount}+`}</div>
              <div className="text-muted-foreground">Negócios Cadastrados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2.5k+</div>
              <div className="text-muted-foreground">Avaliações</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5k+</div>
              <div className="text-muted-foreground">Moradores Conectados</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Negócios em Destaque</h3>
            <p className="text-muted-foreground text-lg">
              Conheça alguns dos estabelecimentos mais bem avaliados do bairro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <Skeleton className="h-48 w-full" />
                  <CardHeader><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader>
                  <CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /></CardContent>
                </Card>
              ))
            ) : (
              featuredBusinesses.map((business) => (
                <Link href={`/estabelecimento/${business.id}`} key={business.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      {business.images && business.images.length > 0 ? (
                        <img src={business.images[0]} alt={business.businessName} className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-16 h-16 text-primary" />
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{business.businessName}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {business.address}
                          </CardDescription>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">{business.rating || 'N/A'}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground mb-4">
                        {business.description.substring(0, 100)}{business.description.length > 100 && '...'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {business.hours || 'Não informado'}
                        </div>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Contato
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Tem um negócio no Novo Tempo?</h3>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Cadastre seu estabelecimento gratuitamente e conecte-se com milhares de moradores do bairro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link href="/empresario/cadastro">
                <Store className="w-5 h-5 mr-2" />
                Cadastrar Meu Negócio
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              asChild
            >
              <Link href="/sobre">
                <Users className="w-5 h-5 mr-2" />
                Saiba Mais
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Novo Tempo Conecta</h4>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Fortalecendo a economia local e conectando nossa comunidade.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Para Moradores</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/busca" className="hover:text-primary transition-colors">Buscar Negócios</Link></li>
                <li><Link href="/mapa" className="hover:text-primary transition-colors">Mapa Interativo</Link></li>
                <li><Link href="/favoritos" className="hover:text-primary transition-colors">Meus Favoritos</Link></li>
                <li><Link href="/categorias" className="hover:text-primary transition-colors">Categorias</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Para Empresários</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/empresario/cadastro" className="hover:text-primary transition-colors">Cadastrar Negócio</Link></li>
                <li><Link href="/empresario/login" className="hover:text-primary transition-colors">Painel de Controle</Link></li>
                <li><Link href="/empresario/perfil" className="hover:text-primary transition-colors">Gerenciar Perfil</Link></li>
                <li><Link href="/sobre" className="hover:text-primary transition-colors">Suporte</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-4">Contato</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>contato@novotempo.com.br</li>
                <li>(11) 9999-9999</li>
                <li>Bairro Novo Tempo</li>
                <li>São Paulo - SP</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Novo Tempo Conecta. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}