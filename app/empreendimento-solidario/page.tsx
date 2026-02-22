"use client"

import { useState, useEffect } from "react"
import { Heart, MapPin, Star, Store, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, limit } from "firebase/firestore"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

type Business = {
  id: string;
  businessName: string;
  address: string;
  category: string;
  description: string;
  rating?: number;
  images?: string[];
  isPublic?: boolean;
  isSolidary?: boolean; // Novo campo para identificar o tipo
};

export default function EmpreendimentoSolidarioPage() {
  const [solidaryBusinesses, setSolidaryBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolidary = async () => {
      try {
        const businessesRef = collection(db, "businesses");
        // Filtra por negócios públicos e que são do tipo solidário
        const q = query(
          businessesRef, 
          where("isPublic", "==", true),
          where("category", "==", "solidario") // Ou use um campo booleano isSolidary
        );
        
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Business[];
        
        setSolidaryBusinesses(list);
      } catch (error) {
        console.error("Erro ao buscar empreendimentos solidários:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolidary();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section Especial */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#002240] to-background text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-[#F7B000]/20 text-[#F7B000]">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Empreendedorismo Solidário</h1>
          <p className="text-xl text-white/80 mb-8">
            Apoie iniciativas locais que transformam o Novo Tempo. Negócios com impacto social, 
            sustentabilidade e colaboração comunitária.
          </p>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-[#00CCFF]" />
            Negócios Certificados
          </h2>
          <Badge variant="outline" className="text-[#00CCFF] border-[#00CCFF]">
            {solidaryBusinesses.length} Iniciativas
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-slate-50 border-dashed border-2">
                <Skeleton className="h-48 w-full" />
                <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                <CardContent><Skeleton className="h-20 w-full" /></CardContent>
              </Card>
            ))
          ) : solidaryBusinesses.length > 0 ? (
            solidaryBusinesses.map((business) => (
              <Link href={`/estabelecimento/${business.id}`} key={business.id}>
                <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="h-52 relative overflow-hidden">
                    {business.images && business.images.length > 0 ? (
                      <img src={business.images[0]} alt={business.businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <Store className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#F7B000] text-[#002240] hover:bg-[#F7B000]">Solidário</Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-[#00CCFF] transition-colors">{business.businessName}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {business.address}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {business.description}
                    </p>
                    <Button variant="link" className="p-0 text-[#00CCFF] group-hover:gap-2 transition-all">
                      Ver detalhes <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
              <Store className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-600">Nenhum empreendimento cadastrado</h3>
              <p className="text-slate-400">Incentive negócios locais a participarem da rede solidária.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}