"use client"

import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
    Users, Building2, Star, LogOut, Menu, MapPin, Settings, LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.clear();
            window.location.href = '/login';
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    const navLinks = [
        { href: "/admin/dashboard", label: "Visão Geral", icon: LayoutDashboard },
        { href: "/admin/usuarios", label: "Usuários", icon: Users },
        { href: "/admin/empresas", label: "Empresas", icon: Building2 },
        { href: "/admin/destaques", label: "Destaques Home", icon: Star },
        { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
    ];
    
    const NavLink = ({ href, label, icon: Icon } : typeof navLinks[0]) => {
        const isActive = pathname === href;
        return (
            <Link
                href={href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all text-sm font-medium ${
                    isActive
                        ? 'bg-blue-700 text-white shadow-md border-l-4 border-yellow-400'
                        : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
            >
                <Icon className={`h-5 w-5 ${isActive ? 'text-yellow-400' : 'text-blue-200'}`} />
                {label}
            </Link>
        );
    };

    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[#1E3A8A] text-white">
                {/* Header da Sidebar - Agora com a MESMA cor do fundo (#1E3A8A) */}
                <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6 bg-[#1E3A8A] shadow-sm">
                    <MapPin className="h-6 w-6 text-yellow-400 shrink-0" />
                    <span className="font-bold text-lg tracking-tight truncate text-white">Novo Tempo Admin</span>
                </div>
                
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navLinks.map(link => <NavLink key={link.href} {...link} />)}
                </div>

                {/* Footer da Sidebar - Também uniforme */}
                <div className="p-4 border-t border-white/10 bg-[#1E3A8A]">
                     <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-200 hover:text-white hover:bg-red-500/20"
                    >
                        <LogOut className="h-5 w-5" />
                        Sair da Conta
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                
                {/* Header Principal - Também uniforme */}
                <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#1E3A8A] px-4 lg:px-8 shadow-md shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72 p-0 bg-[#1E3A8A] text-white border-r-0">
                                <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6 bg-[#1E3A8A]">
                                    <MapPin className="h-6 w-6 text-yellow-400" />
                                    <span className="font-bold text-lg">Painel Admin</span>
                                </div>
                                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                                    {navLinks.map(link => <NavLink key={link.href} {...link} />)}
                                </nav>
                                <div className="p-4 border-t border-white/10">
                                    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 text-red-300 hover:text-white hover:bg-red-500/20">
                                        <LogOut className="h-5 w-5" /> Sair
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                        
                        {/* Título da Página */}
                        <h2 className="text-lg font-semibold text-white hidden md:block">
                            {navLinks.find(link => link.href === pathname)?.label || "Painel"}
                        </h2>
                        
                        {/* Logo Mobile */}
                        <div className="flex items-center gap-2 md:hidden">
                             <MapPin className="h-5 w-5 text-yellow-400" />
                             <span className="font-bold text-white">Novo Tempo</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block leading-tight">
                            <p className="text-sm font-semibold text-white">Administrador</p>
                            <p className="text-xs text-blue-200">Gestão Geral</p>
                        </div>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border border-white/20 bg-white/10 hover:bg-white/20">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback className="bg-blue-600 text-white font-bold text-sm">AD</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 mt-2">
                                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href="/admin/configuracoes" className="flex items-center w-full">
                                        <Settings className="mr-2 h-4 w-4" /> Configurações
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" /> Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                
                {/* Conteúdo com Scroll */}
                <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">
                    <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}