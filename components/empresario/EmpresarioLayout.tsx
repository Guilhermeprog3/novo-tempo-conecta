// src/components/empresario/EmpresarioLayout.tsx
"use client"

import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { BarChart3, Star, MessageSquare, Settings, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";

// Tipo para os dados exibidos na sidebar
type BusinessSidebarData = {
    businessName: string;
    category: string;
    rating?: number;
    reviewCount?: number;
};

// Componente auxiliar para os botões de navegação, para evitar repetição de código
const NavButton = ({ href, currentPath, icon, label }: { 
    href: string; 
    currentPath: string; 
    icon: React.ReactNode; 
    label: string; 
}) => {
    const isActive = currentPath === href;
    
    return (
        <Button
            variant={isActive ? "secondary" : "ghost"}
            className={`w-full justify-start text-base py-6 rounded-lg ${
                isActive
                    ? 'bg-white text-blue-800 shadow-md font-semibold hover:bg-gray-100'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
            asChild
        >
            <Link href={href}>
                {icon}
                {label}
            </Link>
        </Button>
    );
};

export function EmpresarioLayout({ children }: { children: React.ReactNode }) {
    const [businessData, setBusinessData] = useState<BusinessSidebarData | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname(); // Hook do Next.js para obter a URL atual

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const docRef = doc(db, "businesses", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setBusinessData(docSnap.data() as BusinessSidebarData);
                }
            } else {
                // Redireciona para o login se não houver usuário logado
                window.location.href = '/empresario/login';
            }
            setLoading(false);
        });

        // Limpa a inscrição ao desmontar o componente para evitar vazamentos de memória
        return () => unsubscribe();
    }, []);

    const getInitials = (name: string = "") => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-slate-800">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* ===== COLUNA DA SIDEBAR MODIFICADA ===== */}
                    <aside className="lg:col-span-1 lg:sticky lg:top-8 h-fit"> 
                        <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 rounded-2xl text-white">
                            <CardHeader className="text-center">
                                <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-blue-400/50">
                                    <AvatarFallback className="text-2xl font-bold bg-white text-[#1E3A8A]">
                                        {getInitials(businessData?.businessName)}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-xl text-white">{businessData?.businessName}</CardTitle>
                                <CardDescription className="text-white/80">{businessData?.category}</CardDescription>
                                <div className="flex items-center justify-center mt-2 text-white/90">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="ml-1.5 text-sm font-medium">{businessData?.rating || 'N/A'}</span>
                                    <span className="ml-2 text-sm text-white/80">({businessData?.reviewCount || 0} avaliações)</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2 p-4">
                                <nav className="space-y-1">
                                    <NavButton href="/empresario/dashboard" currentPath={pathname} icon={<BarChart3 className="w-5 h-5 mr-3" />} label="Dashboard" />
                                    <NavButton href="/empresario/perfil" currentPath={pathname} icon={<Edit className="w-5 h-5 mr-3" />} label="Editar Perfil" />
                                    <NavButton href="/empresario/avaliacoes" currentPath={pathname} icon={<MessageSquare className="w-5 h-5 mr-3" />} label="Avaliações" />
                                    <NavButton href="/empresario/configuracoes" currentPath={pathname} icon={<Settings className="w-5 h-5 mr-3" />} label="Configurações" />
                                </nav>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* ===== COLUNA DE CONTEÚDO PRINCIPAL ===== */}
                    <section className="lg:col-span-3">
                        {children}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}