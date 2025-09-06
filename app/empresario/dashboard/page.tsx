"use client"

import React, { useState, useEffect } from "react";
import {
  BarChart3, Star, MessageSquare, Settings, Eye, Edit, Plus, TrendingUp, MapPin, Phone, Globe, Clock, Bell, LogOut, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

// Tipo para os dados do negócio
type BusinessData = {
    businessName: string;
    category: string;
    address: string;
    businessPhone: string;
    hours: string;
    website: string;
    rating?: number;
    reviewCount?: number;
};

export default function EmpresarioDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [businessData, setBusinessData] = useState<BusinessData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Buscar dados do negócio no Firestore
                const docRef = doc(db, "businesses", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setBusinessData(docSnap.data() as BusinessData);
                } else {
                    console.log("Nenhum documento de negócio encontrado para este usuário!");
                }
            } else {
                // Se não houver usuário, redireciona para a página de login
                window.location.href = '/empresario/login';
            }
            setLoading(false);
        });

        // Cleanup a inscrição quando o componente desmontar
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '/';
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    const getInitials = (name: string = "") => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Painel Empresarial</h1>
                <p className="text-sm text-muted-foreground">{businessData?.businessName || 'Carregando...'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/estabelecimento/${user?.uid}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Perfil Público
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {getInitials(businessData?.businessName)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{businessData?.businessName}</CardTitle>
                <CardDescription>{businessData?.category} • Novo Tempo</CardDescription>
                <div className="flex items-center justify-center mt-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{businessData?.rating || 'N/A'}</span>
                  <span className="ml-1 text-sm text-muted-foreground">({businessData?.reviewCount || 0} avaliações)</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <nav className="space-y-1">
                  <Button variant="secondary" className="w-full justify-start bg-primary/10 text-primary">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/empresario/perfil">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/empresario/avaliacoes">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Avaliações
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/empresario/configuracoes">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações
                    </Link>
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Gerencie seu estabelecimento de forma eficiente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-auto p-4 flex-col space-y-2" asChild>
                    <Link href="/empresario/perfil">
                      <Edit className="w-6 h-6" />
                      <span>Editar Informações</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent" asChild>
                    <Link href="/empresario/avaliacoes">
                      <MessageSquare className="w-6 h-6" />
                      <span>Responder Avaliações</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                    <Plus className="w-6 h-6" />
                    <span>Adicionar Fotos</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informações do Estabelecimento</CardTitle>
                <CardDescription>Resumo das suas informações públicas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Endereço</p>
                        <p className="text-sm text-muted-foreground">{businessData?.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Telefone</p>
                        <p className="text-sm text-muted-foreground">{businessData?.businessPhone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Horário</p>
                        <p className="text-sm text-muted-foreground">{businessData?.hours}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Instagram</p>
                        <p className="text-sm text-muted-foreground">{businessData?.website}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
