"use client"

import { Heart, Star, MapPin, Phone, Trash2, Share2, Grid, List, Loader2, ArrowRight, Shield, MessageSquare, Edit3 } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"

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
                    <h1 className="text-3xl font-bold">Locais Favoritos</h1>
                    <p className="text-blue-200">Seus lugares preferidos salvos para acesso rápido</p>
                </div>
                <div className="flex bg-white/10 rounded-lg p-1">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setViewMode("grid")}
                        className={`text-white hover:bg-white/20 ${viewMode === 'grid' ? 'bg-white/20' : ''}`}
                    >
                        <Grid className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setViewMode("list")}
                        className={`text-white hover:bg-white/20 ${viewMode === 'list' ? 'bg-white/20' : ''}`}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-20 relative z-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
          {/* Coluna Principal */}
          <div className="lg:col-span-8 space-y-6">
            {favorites.length === 0 ? (
                <Card className="border-none shadow-md bg-white text-center py-16">
                    <CardContent>
                        <Heart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Nenhum favorito ainda</h2>
                        <p className="text-slate-500 mb-6 max-w-xs mx-auto">
                        Comece a explorar o Novo Tempo e salve seus lugares preferidos.
                        </p>
                        <Button asChild className="bg-[#1E3A8A] hover:bg-blue-900 text-white">
                            <Link href="/busca">Explorar Agora</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : "space-y-4"}>
                {favorites.map((favorite) => (
                    <Card
                    key={favorite.id}
                    className={`overflow-hidden hover:shadow-lg transition-all border border-slate-200 bg-white group ${viewMode === "list" ? "flex flex-row h-40" : "flex flex-col"}`}
                    >
                    <div className={`${viewMode === "list" ? "w-40 h-full" : "h-48"} bg-slate-100 relative flex-shrink-0 flex items-center justify-center overflow-hidden`}>
                        {favorite.image ? (
                            <img src={favorite.image} alt={favorite.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        ) : (
                            <Heart className="w-12 h-12 text-slate-300" />
                        )}
                        <Badge className="absolute top-2 right-2 bg-white/90 text-slate-700 hover:bg-white shadow-sm backdrop-blur-sm">
                            {favorite.category}
                        </Badge>
                    </div>

                    <div className="flex flex-col flex-1 p-4">
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-slate-900 line-clamp-1">{favorite.name}</h3>
                                <div className="flex items-center text-yellow-500 text-xs font-bold">
                                    <Star className="w-3 h-3 fill-current mr-1" />
                                    {favorite.rating.toFixed(1)}
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mb-3 flex items-center line-clamp-1">
                                <MapPin className="w-3 h-3 mr-1" /> {favorite.address}
                            </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                            <Button size="sm" asChild variant="outline" className="text-[#1E3A8A] border-blue-100 hover:bg-blue-50 h-8 text-xs">
                                <Link href={`/estabelecimento/${favorite.id}`}>Ver Perfil</Link>
                            </Button>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#1E3A8A] hover:bg-blue-50">
                                    <Share2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleRemoveFavorite(favorite.id)}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    </Card>
                ))}
                </div>
            )}
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
                        <Link href="/usuario/dashboard">
                            <Edit3 className="h-5 w-5 mr-3 text-slate-400" />
                            Meu Perfil
                        </Link>
                    </Button>
                    <Separator className="bg-slate-100" />
                    <Button asChild variant="ghost" className="justify-start w-full text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 font-medium h-12">
                        <Link href="/usuario/avaliacoes">
                            <Star className="h-5 w-5 mr-3 text-yellow-500" />
                            Minhas Avaliações
                        </Link>
                    </Button>
                    <Separator className="bg-slate-100" />
                    <Button asChild variant="ghost" className="justify-start w-full text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 font-medium h-12 bg-blue-50 text-[#1E3A8A]">
                        <Link href="/usuario/favoritos">
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
                <Button size="sm" asChild className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 font-bold border-none w-full">
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