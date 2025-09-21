// app/page.tsx
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
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

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
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-card border-b"> {/* Alterado para bg-card */}
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
                  <Badge variant="outline" className="px-4 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
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
      <section className="py-16 px-4 bg-slate-50">
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
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      {business.images && business.images.length > 0 ? (
                        <img src={business.images[0]} alt={business.businessName} className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-16 h-16 text-primary/50" />
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

      <Footer />
    </div>
  )
}