
"use client"

import { Heart, Star, MapPin, Phone, Trash2, Share2, Grid, List, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore"
import { Timestamp } from "firebase/firestore"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

type Favorite = {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  image?: string;
  addedDate?: Timestamp;
};


export default function FavoritosPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchFavorites(user.uid);
      } else {
        window.location.href = '/login';
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchFavorites = async (userId: string) => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().favorites) {
        const favoriteIds: string[] = userSnap.data().favorites;
        const favoritePromises = favoriteIds.map(async (id) => {
          const businessRef = doc(db, "businesses", id);
          const businessSnap = await getDoc(businessRef);
          if (businessSnap.exists()) {
            const businessData = businessSnap.data();
            return {
              id: businessSnap.id,
              name: businessData.businessName,
              category: businessData.category,
              rating: businessData.rating || 0,
              reviewCount: businessData.reviewCount || 0,
              address: businessData.address,
              phone: businessData.businessPhone,
              image: businessData.images?.[0]
            } as Favorite;
          }
          return null;
        });

        const resolvedFavorites = (await Promise.all(favoritePromises)).filter(fav => fav !== null) as Favorite[];
        setFavorites(resolvedFavorites);
      }
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (businessId: string) => {
    if (!currentUser) return;
    if (!window.confirm("Tem certeza que deseja remover este estabelecimento dos favoritos?")) return;

    try {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
            favorites: arrayRemove(businessId)
        });
        setFavorites(prev => prev.filter(fav => fav.id !== businessId));
    } catch (error) {
        console.error("Erro ao remover favorito:", error);
        alert("Não foi possível remover o favorito. Tente novamente.");
    }
  };
  
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Nenhum favorito ainda</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Comece a explorar os estabelecimentos do Novo Tempo e salve seus favoritos para acessá-los rapidamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/busca">Explorar Estabelecimentos</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Seus Favoritos</h2>
                <p className="text-muted-foreground">{favorites.length} estabelecimentos salvos</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}><Grid className="w-4 h-4" /></Button>
                <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}><List className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {favorites.map((favorite) => (
                <Card
                  key={favorite.id}
                  className={`overflow-hidden hover:shadow-lg transition-shadow bg-[#1E3A8A] border-blue-700 text-white ${viewMode === "list" ? "flex" : ""}`}
                >
                  <div className={`${viewMode === "list" ? "w-48 h-full flex-shrink-0" : "h-48"} bg-blue-900/50 flex items-center justify-center`}>
                   {favorite.image ? (
                        <img src={favorite.image} alt={favorite.name} className="w-full h-full object-cover"/>
                   ) : (
                        <Heart className="w-16 h-16 text-primary" />
                   )}
                  </div>
                  <div className={viewMode === "list" ? "flex-1" : ""}>
                    <CardHeader className={viewMode === "list" ? "pb-2" : ""}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-white">{favorite.name}</CardTitle>
                          <CardDescription className="flex items-center mt-1 text-white/80">
                            <Badge variant="secondary" className="mr-2 text-xs">{favorite.category}</Badge>
                          </CardDescription>
                        </div>
                        <div className="flex items-center ml-2 text-white">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">{favorite.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className={viewMode === "list" ? "pt-0" : ""}>
                      <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="text-white/70">({favorite.reviewCount} avaliações)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" asChild><Link href={`/estabelecimento/${favorite.id}`}>Ver Perfil</Link></Button>
                          <Button variant="outline" size="sm" className="bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white"><Phone className="w-4 h-4" /></Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-white/70 hover:bg-white/10 hover:text-white"><Share2 className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleRemoveFavorite(favorite.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}