// app/usuario/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageSquare, Star, MapPin, Settings, Edit3, Loader2, Award } from "lucide-react"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, Timestamp } from 'firebase/firestore'

type UserData = {
    name: string;
    email: string;
    avatar?: string;
    createdAt: Timestamp;
};

const userStats = {
    totalFavorites: 12,
    totalReviews: 8,
    totalComments: 15,
    averageRating: 4.2,
};

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
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userData.avatar || "/avatar-mulher-brasileira.jpg"} alt={userData.name} />
              <AvatarFallback className="text-lg">{getInitials(userData.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">Olá, {userData.name.split(" ")[0]}! 👋</h1>
              <p className="text-muted-foreground">
                Membro desde{" "}
                {userData.createdAt.toDate().toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline"><Link href="/usuario/perfil"><Edit3 className="h-4 w-4 mr-2" />Editar Perfil</Link></Button>
              <Button asChild variant="outline"><Link href="/usuario/configuracoes"><Settings className="h-4 w-4 mr-2" />Configurações</Link></Button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-white/90">Locais Favoritos</CardTitle><Heart className="h-4 w-4 text-white/60" /></CardHeader><CardContent><div className="text-2xl font-bold text-white">{userStats.totalFavorites}</div><p className="text-xs text-white/80">+2 este mês</p></CardContent></Card>
              <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-white/90">Avaliações Dadas</CardTitle><Star className="h-4 w-4 text-white/60" /></CardHeader><CardContent><div className="text-2xl font-bold text-white">{userStats.totalReviews}</div><p className="text-xs text-white/80">Média: {userStats.averageRating} estrelas</p></CardContent></Card>
              <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-white/90">Comentários</CardTitle><MessageSquare className="h-4 w-4 text-white/60" /></CardHeader><CardContent><div className="text-2xl font-bold text-white">{userStats.totalComments}</div><p className="text-xs text-white/80">+3 esta semana</p></CardContent></Card>
              <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-white/90">Contribuições</CardTitle><Award className="h-4 w-4 text-white/60" /></CardHeader><CardContent><div className="text-2xl font-bold text-white">{userStats.totalReviews + userStats.totalComments}</div><p className="text-xs text-white/80">Total de interações</p></CardContent></Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
              <CardHeader><CardTitle className="text-lg text-white">Ações Rápidas</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start"><Link href="/mapa"><MapPin className="h-4 w-4 mr-2" />Explorar Mapa</Link></Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white"><Link href="/favoritos"><Heart className="h-4 w-4 mr-2" />Meus Favoritos</Link></Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white"><Link href="/usuario/avaliacoes"><Star className="h-4 w-4 mr-2" />Minhas Avaliações</Link></Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white"><Link href="/usuario/comentarios"><MessageSquare className="h-4 w-4 mr-2" />Meus Comentários</Link></Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}