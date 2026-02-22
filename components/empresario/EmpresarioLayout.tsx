"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
    BarChart3, MessageSquare, Settings, Edit, Loader2, LogOut, Menu, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

type BusinessSidebarData = {
    businessName: string;
};

export function EmpresarioLayout({ children }: { children: React.ReactNode }) {
    const [businessData, setBusinessData] = useState<BusinessSidebarData | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '/';
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const docRef = doc(db, "businesses", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setBusinessData(docSnap.data() as BusinessSidebarData);
                }
            } else {
                window.location.href = '/empresario/login';
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getInitials = (name: string = "") => {
        return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??';
    }

    const navLinks = [
        { href: "/empresario/dashboard", label: "Dashboard", icon: BarChart3 },
        { href: "/empresario/perfil", label: "Editar Perfil", icon: Edit },
        { href: "/empresario/avaliacoes", label: "Avaliações", icon: MessageSquare },
        { href: "/empresario/configuracoes", label: "Configurações", icon: Settings },
    ];
    
    const NavLink = ({ href, label, icon: Icon } : typeof navLinks[0]) => {
        const isActive = pathname === href;
        return (
            <Link
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all font-medium text-sm ${
                    isActive
                        ? 'bg-[#00CCFF]/10 text-white border-l-4 border-[#F7B000]'
                        : 'text-white/80 hover:text-[#00CCFF] hover:bg-white/5'
                }`}
            >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#F7B000]' : 'text-[#00CCFF]'}`} />
                {label}
            </Link>
        )
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <Loader2 className="h-12 w-12 animate-spin text-[#00CCFF]" />
            </div>
        );
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r border-[#00CCFF]/20 bg-[#002240] md:block md:sticky md:top-0 h-screen">
                <div className="flex h-full max-h-screen flex-col">
                    <div className="flex h-14 items-center gap-3 border-b border-[#00CCFF]/20 px-4 lg:h-[60px] lg:px-6">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-[#00CCFF] text-[#002240] font-bold">
                                {getInitials(businessData?.businessName)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-white font-semibold truncate">{businessData?.businessName}</span>
                    </div>
                    
                    <div className="flex-1 py-4">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
                            {navLinks.map(link => <NavLink key={link.href} {...link} />)}
                        </nav>
                    </div>
                    <div className="mt-auto p-4 border-t border-[#00CCFF]/20">
                         <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                        >
                            <LogOut className="h-4 w-4" />
                            Sair
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b border-[#00CCFF]/20 bg-[#002240] px-4 text-white lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 md:hidden hover:bg-[#00CCFF]/10 hover:text-[#00CCFF]">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col bg-[#002240] text-white border-r border-[#00CCFF]/20 p-0">
                            <div className="flex h-14 items-center gap-3 border-b border-[#00CCFF]/20 px-4 lg:h-[60px] lg:px-6">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-[#00CCFF] text-[#002240] font-bold">
                                        {getInitials(businessData?.businessName)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-white font-semibold truncate">{businessData?.businessName}</span>
                            </div>
                            <nav className="grid gap-2 text-lg font-medium p-4">
                                {navLinks.map(link => <NavLink key={link.href} {...link} />)}
                            </nav>
                            <div className="mt-auto border-t border-[#00CCFF]/20 p-4">
                                <Button
                                    onClick={handleLogout}
                                    variant="ghost"
                                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sair
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Link href="/empresario/dashboard" className="flex items-center gap-2 font-semibold text-white">
                        <MapPin className="h-6 w-6 text-[#F7B000]" />
                        <span className="hidden sm:inline-block">Painel do Negócio</span>
                    </Link>
                    <div className="ml-auto">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 hover:bg-[#00CCFF]/10 border border-[#00CCFF]/30">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-[#00CCFF] text-[#002240] font-bold">
                                            {getInitials(businessData?.businessName)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border-[#00CCFF]/20">
                                <DropdownMenuLabel>{businessData?.businessName}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild><Link href="/empresario/configuracoes">Configurações</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">Sair</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
}