// app/usuario/avaliacoes/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ArrowLeft, Search, Filter, Calendar, Edit3, Trash2, Loader2 } from "lucide-react"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { collectionGroup, query, where, getDocs, doc, getDoc, Timestamp } from "firebase/firestore"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

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
      const reviewsQuery = query(collectionGroup(db, 'reviews'), where('userId', '==', userId));
      const querySnapshot = await getDocs(reviewsQuery);
      
      const userReviews: Review[] = [];

      for (const reviewDoc of querySnapshot.docs) {
        const reviewData = reviewDoc.data();
        const businessId = reviewDoc.ref.parent.parent?.id;

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
                image: businessData.images?.[0] || undefined,
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
      return 0
    })

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`} />
    ))
  }

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6 shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    placeholder="Buscar por estabelecimento ou comentário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-full md:w-48 bg-blue-900/50 border-blue-700 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por nota" />
                </SelectTrigger>
                <SelectContent className="z-[1000] bg-blue-900 text-white border-blue-700">
                  <SelectItem value="all">Todas as notas</SelectItem>
                  <SelectItem value="5">5 estrelas</SelectItem>
                  <SelectItem value="4">4 estrelas</SelectItem>
                  <SelectItem value="3">3 estrelas</SelectItem>
                  <SelectItem value="2">2 estrelas</SelectItem>
                  <SelectItem value="1">1 estrela</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 bg-blue-900/50 border-blue-700 text-white">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="z-[1000] bg-blue-900 text-white border-blue-700">
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="rating">Maior nota</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0"><AvatarImage src={review.business.image || "/placeholder.svg"} alt={review.business.name} /><AvatarFallback>{review.business.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-white">{review.business.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{review.business.category}</Badge>
                          <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-white/70 hover:bg-white/10 hover:text-white"><Edit3 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-white/70 hover:bg-white/10 hover:text-white"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-medium text-white mb-2">{review.title}</h4>
                      <p className="text-white/80 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{review.createdAt.toDate().toLocaleDateString("pt-BR")}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}