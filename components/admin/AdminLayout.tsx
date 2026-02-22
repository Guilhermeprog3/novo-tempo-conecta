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
                        ? 'bg-[#00CCFF]/10 text-white shadow-md border-l-4 border-[#F7B000]'
                        : 'text-white/80 hover:text-[#00CCFF] hover:bg-white/5'
                }`}
            >
                <Icon className={`h-5 w-5 ${isActive ? 'text-[#F7B000]' : 'text-[#00CCFF]'}`} />
                {label}
            </Link>
        );
    };

    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex w-64 flex-col border-r border-[#00CCFF]/20 bg-[#002240] text-white">
                <div className="flex h-16 items-center gap-2 border-b border-[#00CCFF]/20 px-6 bg-[#002240] shadow-sm">
                    <MapPin className="h-6 w-6 text-[#F7B000] shrink-0" />
                    <span className="font-bold text-lg tracking-tight truncate text-white">Novo Tempo Admin</span>
                </div>
                
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navLinks.map(link => <NavLink key={link.href} {...link} />)}
                </div>

                <div className="p-4 border-t border-[#00CCFF]/20 bg-[#002240]">
                     <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                        <LogOut className="h-5 w-5" />
                        Sair da Conta
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                
                <header className="flex h-16 items-center justify-between border-b border-[#00CCFF]/20 bg-[#002240] px-4 lg:px-8 shadow-md shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <Sheet>
                            {/* CORREÇÃO: Removemos 'asChild' e Button, usando a classe de estilo diretamente */}
                            <SheetTrigger className="md:hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#00CCFF]/10 hover:text-[#00CCFF] h-10 w-10 text-white">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Menu</span>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72 p-0 bg-[#002240] text-white border-r border-[#00CCFF]/20">
                                <div className="flex h-16 items-center gap-2 border-b border-[#00CCFF]/20 px-6 bg-[#002240]">
                                    <MapPin className="h-6 w-6 text-[#F7B000]" />
                                    <span className="font-bold text-lg">Painel Admin</span>
                                </div>
                                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                                    {navLinks.map(link => <NavLink key={link.href} {...link} />)}
                                </nav>
                                <div className="p-4 border-t border-[#00CCFF]/20">
                                    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/20">
                                        <LogOut className="h-5 w-5" /> Sair
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                        
                        <h2 className="text-lg font-semibold text-white hidden md:block">
                            {navLinks.find(link => link.href === pathname)?.label || "Painel"}
                        </h2>
                        
                        <div className="flex items-center gap-2 md:hidden">
                             <MapPin className="h-5 w-5 text-[#F7B000]" />
                             <span className="font-bold text-white">Novo Tempo</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block leading-tight">
                            <p className="text-sm font-semibold text-white">Administrador</p>
                            <p className="text-xs text-[#00CCFF]">Gestão Geral</p>
                        </div>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border border-[#00CCFF]/30 bg-white/5 hover:bg-[#00CCFF]/10">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback className="bg-[#00CCFF] text-[#002240] font-bold text-sm">AD</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 mt-2 border-[#00CCFF]/20">
                                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-100" />
                                <DropdownMenuItem asChild className="cursor-pointer hover:bg-slate-50">
                                    <Link href="/admin/configuracoes" className="flex items-center w-full">
                                        <Settings className="mr-2 h-4 w-4" /> Configurações
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-100" />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" /> Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                
                <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">
                    <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}