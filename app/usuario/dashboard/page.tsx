"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageSquare, Star, MapPin, Calendar, TrendingUp, Award, Settings, Edit3, Loader2 } from "lucide-react"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, Timestamp } from 'firebase/firestore'

// Tipos para os dados do usuário
type UserData = {
    name: string;
    email: string;
    avatar?: string;
    createdAt: Timestamp;
};

// Dados simulados que serão substituídos por dados reais no futuro
const userStats = {
    totalFavorites: 12,
    totalReviews: 8,
    totalComments: 15,
    averageRating: 4.2,
};

const recentActivityData = [
    { id: 1, type: "review", business: "Padaria do João", action: "Avaliou", rating: 5, date: "2024-01-20", comment: "Excelente atendimento e pães fresquinhos!" },
    { id: 2, type: "favorite", business: "Farmácia Central", action: "Adicionou aos favoritos", date: "2024-01-19" },
    { id: 3, type: "comment", business: "Restaurante Sabor Caseiro", action: "Comentou", date: "2024-01-18", comment: "Quando vocês vão ter delivery?" },
];

const favoriteCategoriesData = [
    { name: "Alimentação", count: 5 }, { name: "Saúde", count: 3 }, { name: "Serviços", count: 2 }, { name: "Comércio", count: 2 },
];

export default function UsuarioDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setUserData(docSnap.data() as UserData);
            } else {
                console.log("Nenhum documento de usuário encontrado!");
            }
        } else {
            window.location.href = '/login';
        }
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getInitials = (name: string = "") => {
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  }

  if (loading || !userData) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userData.avatar || "/avatar-mulher-brasileira.jpg"} alt={userData.name} />
              <AvatarFallback className="text-lg">{getInitials(userData.name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">Olá, {userData.name.split(" ")[0]}! 👋</h1>
              <p className="text-muted-foreground mb-4">
                Membro desde{" "}
                {userData.createdAt.toDate().toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1"><Heart className="h-3 w-3" />{userStats.totalFavorites} favoritos</Badge>
                <Badge variant="secondary" className="flex items-center gap-1"><Star className="h-3 w-3" />{userStats.totalReviews} avaliações</Badge>
                <Badge variant="secondary" className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{userStats.totalComments} comentários</Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="outline"><Link href="/usuario/perfil"><Edit3 className="h-4 w-4 mr-2" />Editar Perfil</Link></Button>
              <Button asChild variant="outline"><Link href="/usuario/configuracoes"><Settings className="h-4 w-4 mr-2" />Configurações</Link></Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Locais Favoritos</CardTitle><Heart className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{userStats.totalFavorites}</div><p className="text-xs text-muted-foreground">+2 este mês</p></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Avaliações Dadas</CardTitle><Star className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{userStats.totalReviews}</div><p className="text-xs text-muted-foreground">Média: {userStats.averageRating} estrelas</p></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Comentários</CardTitle><MessageSquare className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{userStats.totalComments}</div><p className="text-xs text-muted-foreground">+3 esta semana</p></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Contribuições</CardTitle><Award className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{userStats.totalReviews + userStats.totalComments}</div><p className="text-xs text-muted-foreground">Total de interações</p></CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Ações Rápidas</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start"><Link href="/mapa"><MapPin className="h-4 w-4 mr-2" />Explorar Mapa</Link></Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent"><Link href="/favoritos"><Heart className="h-4 w-4 mr-2" />Meus Favoritos</Link></Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent"><Link href="/usuario/avaliacoes"><Star className="h-4 w-4 mr-2" />Minhas Avaliações</Link></Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent"><Link href="/usuario/comentarios"><MessageSquare className="h-4 w-4 mr-2" />Meus Comentários</Link></Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}