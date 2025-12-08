"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Search, Filter, Calendar, Edit3, Trash2, Loader2, Heart, Shield, MessageSquare, ArrowRight } from "lucide-react"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { collectionGroup, query, where, getDocs, doc, getDoc, Timestamp, deleteDoc } from "firebase/firestore"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Separator } from "@/components/ui/separator"

type Review = {
  id: string;
  businessId: string;
  business: {
    name: string;
    category: string;
    image?: string;
  };
  rating: number;
  comment: string;
  createdAt: Timestamp;
};

export default function UsuarioAvaliacoes() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserReviews(user.uid);
      } else {
        window.location.href = '/login';
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserReviews = async (userId: string) => {
    setLoading(true);
    try {
      // Busca em TODAS as coleções chamadas 'reviews' onde o userId é igual ao do usuário logado
      const reviewsQuery = query(collectionGroup(db, 'reviews'), where('userId', '==', userId));
      const querySnapshot = await getDocs(reviewsQuery);
      
      const userReviews: Review[] = [];

      // Para cada avaliação, precisamos buscar os dados do negócio pai
      const reviewsPromises = querySnapshot.docs.map(async (reviewDoc) => {
        const reviewData = reviewDoc.data();
        // Acessa o documento pai (Business) através da referência
        // Caminho: businesses/{id}/reviews/{id} -> parent.parent = businesses/{id}
        const businessRef = reviewDoc.ref.parent.parent;

        if (businessRef) {
          const businessSnap = await getDoc(businessRef);
          if (businessSnap.exists()) {
            const businessData = businessSnap.data();
            return {
              id: reviewDoc.id,
              businessId: businessSnap.id,
              business: {
                name: businessData.businessName,
                category: businessData.category,
                image: businessData.images?.[0] || undefined,
              },
              rating: reviewData.rating,
              comment: reviewData.comment,
              createdAt: reviewData.createdAt,
            } as Review;
          }
        }
        return null;
      });

      const results = await Promise.all(reviewsPromises);
      const validReviews = results.filter(r => r !== null) as Review[];
      
      setReviews(validReviews);
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (review: Review) => {
      if (!confirm("Tem certeza que deseja excluir esta avaliação?")) return;
      try {
          // Caminho: businesses -> businessId -> reviews -> reviewId
          const reviewRef = doc(db, "businesses", review.businessId, "reviews", review.id);
          await deleteDoc(reviewRef);
          
          // Remove da lista local
          setReviews(prev => prev.filter(r => r.id !== review.id));
          alert("Avaliação excluída com sucesso.");
      } catch (error) {
          console.error("Erro ao excluir:", error);
          alert("Erro ao excluir avaliação.");
      }
  };

  const filteredReviews = reviews
    .filter((review) => {
      const matchesSearch =
        review.business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRating = filterRating === "all" || review.rating.toString() === filterRating
      return matchesSearch && matchesRating
    })
    .sort((a, b) => {
      if (sortBy === "recent") return b.createdAt.toMillis() - a.createdAt.toMillis();
      if (sortBy === "rating") return b.rating - a.rating;
      return 0
    })

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
    ))
  }

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="h-12 w-12 animate-spin text-[#1E3A8A]" />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#1E3A8A] pb-24 pt-10 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
            <div className="flex justify-between items-center text-white mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Minhas Avaliações</h1>
                    <p className="text-blue-200">Gerencie suas experiências e opiniões</p>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-20 relative z-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
          {/* Coluna Esquerda - Lista */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Barra de Filtros */}
            <Card className="border-none shadow-sm bg-white p-4">
               <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                        placeholder="Buscar avaliação..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-slate-200 focus-visible:ring-[#1E3A8A]"
                    />
                  </div>
                  <Select value={filterRating} onValueChange={setFilterRating}>
                    <SelectTrigger className="w-full md:w-40 border-slate-200">
                        <Filter className="h-4 w-4 mr-2 text-slate-500" />
                        <SelectValue placeholder="Nota" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="5">5 estrelas</SelectItem>
                        <SelectItem value="4">4 estrelas</SelectItem>
                        <SelectItem value="3">3 estrelas</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
            </Card>

            <div className="space-y-4">
            {filteredReviews.length === 0 ? (
                 <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 shadow-none py-12 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 mb-4">Nenhuma avaliação encontrada.</p>
                    <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold shadow-md">
                        <Link href="/busca">Avaliar um Local</Link>
                    </Button>
                 </Card>
            ) : (
                filteredReviews.map((review) => (
                    <Card key={review.id} className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <Avatar className="h-12 w-12 rounded-lg border border-slate-100 bg-slate-50">
                                    <AvatarImage src={review.business.image} alt={review.business.name} className="object-cover" />
                                    <AvatarFallback className="rounded-lg bg-slate-100 text-slate-400 font-bold">{review.business.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg hover:text-[#1E3A8A] transition-colors cursor-pointer">
                                            <Link href={`/estabelecimento/${review.businessId}`}>{review.business.name}</Link>
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-normal text-xs">{review.business.category}</Badge>
                                            <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {review.createdAt.toDate().toLocaleDateString("pt-BR")}
                                    </span>
                                </div>
                                
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-3">
                                    <p className="text-slate-700 text-sm leading-relaxed">{review.comment}</p>
                                </div>
                                
                                <div className="flex justify-end gap-2 mt-3">
                                    <Button asChild variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                                        <Link href={`/estabelecimento/${review.businessId}`}>
                                            <Edit3 className="h-3.5 w-3.5 mr-1.5" /> Editar
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteReview(review)}>
                                        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Excluir
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    </Card>
                ))
            )}
            </div>
          </div>

          {/* Coluna Direita (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200">
                  <h3 className="font-bold text-[#1E3A8A]">Acesso Rápido</h3>
              </div>
              <CardContent className="p-2">
                <nav className="flex flex-col space-y-1">
                    <Button asChild variant="ghost" className="justify-start w-full text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 font-medium h-12">
                        <Link href="/usuario/perfil">
                            <Edit3 className="h-5 w-5 mr-3 text-slate-400" />
                            Meu Perfil
                        </Link>
                    </Button>
                    <Separator className="bg-slate-100" />
                    <Button asChild variant="ghost" className="justify-start w-full text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 font-medium h-12 bg-blue-50 text-[#1E3A8A]">
                        <Link href="/usuario/avaliacoes">
                            <Star className="h-5 w-5 mr-3 text-yellow-500" />
                            Minhas Avaliações
                        </Link>
                    </Button>
                    <Separator className="bg-slate-100" />
                    <Button asChild variant="ghost" className="justify-start w-full text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 font-medium h-12">
                        <Link href="/favoritos">
                            <Heart className="h-5 w-5 mr-3 text-red-500" />
                            Locais Favoritos
                        </Link>
                    </Button>
                    <Separator className="bg-slate-100" />
                    <Button asChild variant="ghost" className="justify-start w-full text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 font-medium h-12">
                        <Link href="/usuario/configuracoes">
                            <Shield className="h-5 w-5 mr-3 text-slate-400" />
                            Configurações
                        </Link>
                    </Button>
                </nav>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-700 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-yellow-400 rounded-full blur-2xl opacity-30"></div>
                <h4 className="font-bold text-lg mb-2">Descubra Novos Lugares</h4>
                <p className="text-blue-100 text-sm mb-4">
                    Explore o bairro e encontre os melhores estabelecimentos perto de você.
                </p>
                <Button size="sm" asChild className="bg-yellow-500 text-blue-900 hover:bg-yellow-600 font-bold border-none w-full">
                    <Link href="/busca">Ir para o Mapa <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}