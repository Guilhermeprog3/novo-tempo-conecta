"use client"

import { useState, useEffect, Suspense } from "react"
import { Search, MapPin, Star, Clock, SlidersHorizontal, Grid, List, Loader2, X, Store, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/navigation/header"

type Business = {
  id: string;
  businessName: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  address: string;
  isOpen?: boolean;
  isPublic?: boolean; 
  images?: string[];
  description: string;
  hours?: string;
};

const categories = [
    { value: "restaurante", label: "Restaurantes e Alimentação" },
    { value: "comercio", label: "Comércio e Varejo" },
    { value: "servicos", label: "Serviços Técnicos" },
    { value: "saude", label: "Saúde e Bem-estar" },
    { value: "beleza", label: "Beleza e Estética" },
    { value: "educacao", label: "Educação e Cursos" },
    { value: "automotivo", label: "Automotivo" },
    { value: "casa", label: "Casa e Construção" },
    { value: "lazer", label: "Lazer" },
    { value: "moda", label: "Moda e Vestuário" },
    { value: "esportes", label: "Esportes" },
];

function SearchResults() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategories = searchParams.getAll("categoria");

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  
  const [minRating, setMinRating] = useState([0]);
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.set("q", searchTerm);
    }

    selectedCategories.forEach(category => {
      params.append("categoria", category);
    });

    router.replace(`/busca?${params.toString()}`, { scroll: false });
  }, [searchTerm, selectedCategories, router]);

  useEffect(() => {
    const fetchBusinesses = async () => {
        try {
            const businessesRef = collection(db, "businesses");
            const q = query(businessesRef, where("isPublic", "==", true));
            const querySnapshot = await getDocs(q);
            
            const businessesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Business[];

            setAllBusinesses(businessesList);
        } catch (error) {
            console.error("Erro ao buscar negócios:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchBusinesses();
  }, []);

  const handleCategoryChange = (categoryValue: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryValue]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== categoryValue));
    }
  };

  const filteredAndSortedBusinesses = allBusinesses
    .filter(business => {
        const matchesSearch = (business.businessName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                              (business.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(business.category);
        const matchesRating = !business.rating || business.rating >= minRating[0];
        const matchesOpen = !isOpen || business.isOpen === true;
        const isPublic = business.isPublic === true;

        return matchesSearch && matchesCategory && matchesRating && matchesOpen && isPublic;
    })
    .sort((a, b) => {
        switch (sortBy) {
            case "rating":
                return (b.rating || 0) - (a.rating || 0);
            case "name":
                return (a.businessName || '').localeCompare(b.businessName || '');
            default:
                return 0;
        }
    });

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
          <Card className="sticky top-24 bg-[#002240] text-white border-none">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>Filtros</span>
                <Button variant="ghost" size="sm" className="lg:hidden text-white hover:bg-white/10 hover:text-[#00CCFF]" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                <Label className="text-white/90">Categorias</Label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.value} className="flex items-center space-x-2">
                      <Checkbox id={category.value} onCheckedChange={(checked) => handleCategoryChange(category.value, !!checked)} checked={selectedCategories.includes(category.value)} className="border-[#00CCFF]/50 data-[state=checked]:bg-[#00CCFF] data-[state=checked]:text-[#002240]" />
                      <Label htmlFor={category.value} className="text-sm font-normal text-white/90">{category.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/90">Avaliação mínima: {minRating[0].toFixed(1)} estrelas</Label>
                <Slider value={minRating} onValueChange={setMinRating} max={5} step={0.5} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="open" checked={isOpen} onCheckedChange={(checked) => setIsOpen(!!checked)} className="border-[#00CCFF]/50 data-[state=checked]:bg-[#00CCFF] data-[state=checked]:text-[#002240]" />
                  <Label htmlFor="open" className="text-sm font-normal text-white/90">Aberto agora</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00CCFF] w-4 h-4" />
                <Input placeholder="Busque por 'pizza', 'farmácia', 'salão'..." className="pl-10 focus-visible:ring-[#00CCFF]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="lg:hidden hover:text-[#00CCFF]" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal className="w-4 h-4 mr-2" />Filtros</Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="Ordenar por" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevância</SelectItem>
                    <SelectItem value="rating">Melhor Avaliação</SelectItem>
                    <SelectItem value="name">Nome (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {loading ? 'Buscando...' : `${filteredAndSortedBusinesses.length} resultados encontrados`}
            </p>
          </div>

          {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                      <Card key={index} className="bg-[#002240] border-[#00CCFF]/20">
                        <Skeleton className="h-48 w-full bg-white/10" />
                        <CardHeader><Skeleton className="h-5 w-3/4 bg-white/10" /></CardHeader>
                        <CardContent><Skeleton className="h-4 w-full bg-white/10" /></CardContent>
                      </Card>
                  ))}
               </div>
          ) : filteredAndSortedBusinesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAndSortedBusinesses.map((business) => (
                      <Link href={`/estabelecimento/${business.id}`} key={business.id} className="h-full">
                          <Card className="overflow-hidden hover:shadow-lg hover:shadow-[#00CCFF]/10 transition-shadow cursor-pointer h-full flex flex-col bg-[#002240] border-[#00CCFF]/20 text-white">
                              <div className="h-48 bg-white/5 flex items-center justify-center">
                                  {business.images && business.images.length > 0 ? (
                                      <img src={business.images[0]} alt={business.businessName} className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-white/5">
                                        <Store className="w-16 h-16 text-[#00CCFF]/20" strokeWidth={1.5} />
                                      </div>
                                  )}
                              </div>
                              <div className="flex flex-col flex-1">
                                  <CardHeader>
                                      <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <CardTitle className="text-lg text-white">{business.businessName}</CardTitle>
                                            <CardDescription className="flex items-center pt-1">
                                                <Badge variant="secondary" className="mr-2 text-xs bg-[#00CCFF]/10 text-[#00CCFF] hover:bg-[#00CCFF]/20">
                                                    {categories.find(c => c.value === business.category)?.label || business.category}
                                                </Badge>
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
                                      <p className="text-sm text-white/80 mb-3">
                                          {business.description?.substring(0, 100)}{business.description && business.description.length > 100 && '...'}
                                      </p>
                                      <div className="flex items-center justify-between text-sm">
                                          <div className="flex items-center text-white/80">
                                            <MapPin className="w-4 h-4 mr-1 text-[#00CCFF]" />
                                            {business.address?.split(',')[0]}
                                          </div>
                                          <div className="flex items-center text-white/80">
                                              <Clock className="w-3 h-3 mr-1 text-[#00CCFF]" />
                                              <span>{business.hours || 'Não informado'}</span>
                                          </div>
                                      </div>
                                  </CardContent>
                              </div>
                          </Card>
                      </Link>
                  ))}
              </div>
          ) : (
               <div className="text-center py-16">
                  <Search className="w-24 h-24 text-muted-foreground mx-auto mb-6 opacity-50" />
                  <h2 className="text-2xl font-bold text-foreground mb-4">Nenhum resultado encontrado</h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">Tente ajustar seus filtros de busca ou procurar por um termo diferente.</p>
              </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function BuscaPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-[#00CCFF]" /></div>}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header 
            title="Buscar Estabelecimentos"
            subtitle="Encontre o que você precisa no Novo Tempo"
        />
        <main className="flex-grow">
            <SearchResults />
        </main>
      </div>
    </Suspense>
  )
}