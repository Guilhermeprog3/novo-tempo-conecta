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

// Tipos
type Favorite = {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  image?: string;
  addedDate?: Timestamp; // Supondo que a data seja salva como Timestamp
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
        // Atualiza o estado local para refletir a remoção
        setFavorites(prev => prev.filter(fav => fav.id !== businessId));
    } catch (error) {
        console.error("Erro ao remover favorito:", error);
        alert("Não foi possível remover o favorito. Tente novamente.");
    }
  };
  
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
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Meus Favoritos</h1>
                <p className="text-sm text-muted-foreground">Estabelecimentos que você salvou</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
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
                <Link href="/cadastro">Cadastrar Negócio</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
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
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Seus Favoritos</h2>
                <p className="text-muted-foreground">{favorites.length} estabelecimentos salvos</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Favorites Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {favorites.map((favorite) => (
                <Card
                  key={favorite.id}
                  className={`overflow-hidden hover:shadow-lg transition-shadow ${viewMode === "list" ? "flex" : ""}`}
                >
                  <div
                    className={`${
                      viewMode === "list" ? "w-48 h-full flex-shrink-0" : "h-48"
                    } bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center`}
                  >
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
                          <CardTitle className="text-lg">{favorite.name}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Badge variant="secondary" className="mr-2 text-xs">
                              {favorite.category}
                            </Badge>
                          </CardDescription>
                        </div>
                        <div className="flex items-center ml-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">{favorite.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className={viewMode === "list" ? "pt-0" : ""}>
                      <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="text-muted-foreground">({favorite.reviewCount} avaliações)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" asChild>
                            <Link href={`/estabelecimento/${favorite.id}`}>Ver Perfil</Link>
                          </Button>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Phone className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleRemoveFavorite(favorite.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
    </div>
  )
}