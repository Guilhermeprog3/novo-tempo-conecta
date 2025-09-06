"use client"

import { ArrowLeft, Star, MessageSquare, Search, Send, ThumbsUp, Flag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState, useEffect } from "react"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, collection, onSnapshot, updateDoc, Timestamp, query, orderBy as firestoreOrderBy, where } from 'firebase/firestore'

type Review = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
  reply?: string;
};

type BusinessData = {
    reviewCount?: number;
    rating?: number;
};

export default function EmpresarioAvaliacoesPage() {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("recent");


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        
        const businessRef = doc(db, "businesses", user.uid);
        const unsubscribeBusiness = onSnapshot(businessRef, (docSnap) => {
            if (docSnap.exists()) {
                setBusinessData(docSnap.data() as BusinessData);
            }
        });

        const reviewsRef = collection(db, "businesses", user.uid, "reviews");
        const q = query(reviewsRef, firestoreOrderBy("createdAt", "desc"));
        const unsubscribeReviews = onSnapshot(q, (snapshot) => {
          const reviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
          setReviews(reviewsData);
          setLoading(false);
        });

        return () => {
            unsubscribeBusiness();
            unsubscribeReviews();
        }
      } else {
        window.location.href = '/empresario/login';
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleReplySubmit = async (reviewId: string) => {
    if (!currentUser || !replyText.trim()) return;

    const reviewRef = doc(db, "businesses", currentUser.uid, "reviews", reviewId);
    try {
        await updateDoc(reviewRef, {
            reply: replyText
        });
        setReplyingTo(null);
        setReplyText("");
    } catch (error) {
        console.error("Erro ao enviar resposta:", error);
        alert("Falha ao enviar resposta.");
    }
  };
  
  const getRatingCount = (rating: number) => {
    return reviews.filter(r => r.rating === rating).length;
  }

  const filteredAndSortedReviews = reviews
    .filter(review => {
        const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) || review.userName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
        return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
        switch (sortBy) {
            case 'oldest':
                return a.createdAt.toMillis() - b.createdAt.toMillis();
            case 'highest':
                return b.rating - a.rating;
            case 'lowest':
                return a.rating - b.rating;
            case 'recent':
            default:
                return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
    });

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/empresario/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Avaliações</h1>
                <p className="text-sm text-muted-foreground">Gerencie as avaliações do seu estabelecimento</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-sm">
                {businessData?.reviewCount || 0} avaliações
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{businessData?.rating?.toFixed(1) || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">{businessData?.rating?.toFixed(1) || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Nota Média</div>
                <div className="flex justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-3 h-3 ${star <= (businessData?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {[5, 4, 3, 2, 1].map((stars) => (
              <Card key={stars} className="text-center">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <span className="text-sm font-medium">{stars}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                  <div className="text-lg font-bold text-foreground">{getRatingCount(stars)}</div>
                  <div className="text-xs text-muted-foreground">avaliações</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Buscar por usuário ou comentário..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger className="w-full md:w-48">
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
                    <SelectItem value="oldest">Mais antigas</SelectItem>
                    <SelectItem value="highest">Maior nota</SelectItem>
                    <SelectItem value="lowest">Menor nota</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredAndSortedReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{review.userName}</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">{review.createdAt.toDate().toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Flag className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{review.comment}</p>

                      {review.reply && (
                        <div className="bg-muted/50 rounded-lg p-4 mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              Sua resposta
                            </Badge>
                          </div>
                          <p className="text-sm">{review.reply}</p>
                        </div>
                      )}

                      {replyingTo === review.id ? (
                        <div className="space-y-3">
                          <Textarea placeholder="Digite sua resposta..." className="min-h-[80px]" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                          <div className="flex items-center space-x-2">
                            <Button size="sm" onClick={() => handleReplySubmit(review.id)}>
                              <Send className="w-4 h-4 mr-2" />
                              Enviar Resposta
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        !review.reply && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setReplyingTo(review.id);
                                setReplyText("");
                            }}
                            className="bg-transparent"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Responder
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}