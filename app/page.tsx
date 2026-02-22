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
import { collection, getDocs, query, limit, where } from "firebase/firestore"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

type Business = {
  id: string;
  businessName: string;
  address: string;
  category: string;
  description: string;
  rating?: number;
  hours?: string;
  images?: string[];
  isPublic?: boolean;
  isFeatured?: boolean;
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
        
        const publicQuery = query(businessesCollection, where("isPublic", "==", true));
        const allBusinessSnapshot = await getDocs(publicQuery);
        setStats({ businessCount: allBusinessSnapshot.size });

        const featuredQuery = query(
            businessesCollection,
            where("isPublic", "==", true),
            where("isFeatured", "==", true),
            limit(3)
        );
        
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

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= Math.round(rating)
                ? "text-[#F7B000] fill-[#F7B000]"
                : "text-white/30"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-16 px-4 bg-background border-b">
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
                  <Badge variant="secondary" className="px-4 py-2 text-sm cursor-pointer hover:bg-primary/80 transition-colors">
                    <Icon className="w-4 h-4 mr-2" />
                    {cat.name}
                  </Badge>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

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
                <Card key={index} className="bg-[#002240] border-[#00CCFF]/20">
                  <Skeleton className="h-48 w-full bg-white/10" />
                  <CardHeader><Skeleton className="h-5 w-3/4 bg-white/10" /><Skeleton className="h-4 w-1/2 mt-2 bg-white/10" /></CardHeader>
                  <CardContent className="space-y-2"><Skeleton className="h-4 w-full bg-white/10" /><Skeleton className="h-4 w-full bg-white/10" /></CardContent>
                </Card>
              ))
            ) : featuredBusinesses.length > 0 ? (
              featuredBusinesses.map((business) => (
                <Link href={`/estabelecimento/${business.id}`} key={business.id}>
                  <Card className="overflow-hidden hover:shadow-lg hover:shadow-[#00CCFF]/10 transition-shadow cursor-pointer h-full flex flex-col bg-[#002240] border-[#00CCFF]/20 text-white">
                    <div className="h-48 bg-white/5 flex items-center justify-center">
                      {business.images && business.images.length > 0 ? (
                        <img src={business.images[0]} alt={business.businessName} className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-16 h-16 text-white/20" strokeWidth={1.5} />
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-white">{business.businessName}</CardTitle>
                          <CardDescription className="flex items-center mt-1 text-white/80">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{business.address}</span>
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end pl-2">
                           {renderStars(business.rating)}
                           <span className="text-[10px] text-white/60 mt-1">
                             {business.rating && business.rating > 0 ? business.rating.toFixed(1) : 'Sem avaliações'}
                           </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                      <p className="text-sm text-white/80 mb-4">
                        {business.description?.substring(0, 100)}{business.description && business.description.length > 100 && '...'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-white/80">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{business.hours || 'Não informado'}</span>
                        </div>
                        <Button size="sm" variant="outline" className="bg-transparent text-[#00CCFF] border-[#00CCFF]/50 hover:bg-[#00CCFF]/10 hover:text-[#00CCFF]">
                          <Phone className="w-4 h-4 mr-2" />
                          Contato
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
               <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">Nenhum destaque definido no momento.</p>
               </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}