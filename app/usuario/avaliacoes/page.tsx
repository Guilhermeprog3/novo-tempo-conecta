"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ArrowLeft, Search, Filter, Calendar, Edit3, Trash2, ThumbsUp, MessageSquare, Loader2 } from "lucide-react"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { collectionGroup, query, where, getDocs, doc, getDoc, Timestamp } from "firebase/firestore"

// Tipos de dados
type Review = {
  id: string;
  businessId: string;
  business: {
    name: string;
    category: string;
    image?: string;
  };
  rating: number;
  title: string;
  comment: string;
  createdAt: Timestamp;
  helpful?: number;
  replies?: number;
  photos?: number;
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
      // 1. Encontrar todas as avaliações feitas pelo usuário
      const reviewsQuery = query(collectionGroup(db, 'reviews'), where('userId', '==', userId));
      const querySnapshot = await getDocs(reviewsQuery);
      
      const userReviews: Review[] = [];

      // 2. Para cada avaliação, buscar os dados do estabelecimento pai
      for (const reviewDoc of querySnapshot.docs) {
        const reviewData = reviewDoc.data();
        const businessId = reviewDoc.ref.parent.parent?.id; // Pega o ID do documento pai (o negócio)

        if (businessId) {
          const businessRef = doc(db, "businesses", businessId);
          const businessSnap = await getDoc(businessRef);

          if (businessSnap.exists()) {
            const businessData = businessSnap.data();
            userReviews.push({
              id: reviewDoc.id,
              businessId: businessId,
              business: {
                name: businessData.businessName,
                category: businessData.category,
                image: businessData.images?.[0] || undefined, // Pega a primeira imagem
              },
              rating: reviewData.rating,
              title: reviewData.title || `Avaliação de ${reviewData.rating} estrelas`,
              comment: reviewData.comment,
              createdAt: reviewData.createdAt,
            });
          }
        }
      }
      setReviews(userReviews);
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
    } finally {
      setLoading(false);
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
      // if (sortBy === "helpful") return (b.helpful || 0) - (a.helpful || 0); // Requer 'helpful' no DB
      return 0
    })

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/usuario/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Minhas Avaliações</h1>
              <p className="text-muted-foreground">
                Gerencie todas as suas avaliações e acompanhe o feedback da comunidade
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{reviews.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{averageRating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Média</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por estabelecimento ou comentário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por nota" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as notas</SelectItem>
                  <SelectItem value="5">5 estrelas</SelectItem>
                  <SelectItem value="4">4 estrelas</SelectItem>
                  <SelectItem value="3">3 estrelas</SelectItem>
                  <SelectItem value="2">2 estrelas</SelectItem>
                  <SelectItem value="1">1 estrela</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="rating">Maior nota</SelectItem>
                  {/* <SelectItem value="helpful">Mais úteis</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Avaliações */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={review.business.image || "/placeholder.svg"} alt={review.business.name} />
                    <AvatarFallback>
                      {review.business.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{review.business.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{review.business.category}</Badge>
                          <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-foreground mb-2">{review.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {review.createdAt.toDate().toLocaleDateString("pt-BR")}
                      </div>

                      {/* Outras informações como 'helpful', 'replies' podem ser adicionadas aqui se existirem no seu DB */}
                      
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReviews.length === 0 && !loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma avaliação encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterRating !== "all"
                    ? "Tente ajustar os filtros de busca"
                    : "Você ainda não fez nenhuma avaliação"}
                </p>
                <Button asChild>
                  <Link href="/mapa">Explorar Estabelecimentos</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}