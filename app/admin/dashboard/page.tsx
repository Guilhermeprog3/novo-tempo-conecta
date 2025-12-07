// app/admin/dashboard/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Building2, Star, Activity, TrendingUp } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

function StatCard({ title, value, icon: Icon, description, trend, colorClass }: any) {
    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                    {title}
                </CardTitle>
                <div className={`h-9 w-9 rounded-full flex items-center justify-center ${colorClass || 'bg-blue-50 text-blue-600'}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    {trend && <span className="text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center text-[10px]"><TrendingUp className="w-3 h-3 mr-1"/> {trend}</span>}
                    <span className="truncate">{description}</span>
                </p>
            </CardContent>
        </Card>
    )
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        users: 0,
        businesses: 0,
        featured: 0,
        recentUsers: [] as any[],
        recentBusinesses: [] as any[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Contagem de Usuários (não admins)
                const usersRef = collection(db, "users");
                const qUsers = query(usersRef, where("role", "!=", "admin"));
                const usersSnap = await getDocs(qUsers);
                
                // 2. Contagem de Empresas
                const businessRef = collection(db, "businesses");
                const businessSnap = await getDocs(businessRef);

                // 3. Empresas em Destaque
                const qFeatured = query(businessRef, where("isFeatured", "==", true));
                const featuredSnap = await getDocs(qFeatured);

                // 4. Dados Recentes
                const recentUsersList = usersSnap.docs.slice(0, 4).map(d => ({id: d.id, ...d.data()}));
                const recentBusinessList = businessSnap.docs.slice(0, 4).map(d => ({id: d.id, ...d.data()}));

                setStats({
                    users: usersSnap.size,
                    businesses: businessSnap.size,
                    featured: featuredSnap.size,
                    recentUsers: recentUsersList,
                    recentBusinesses: recentBusinessList
                });

            } catch (error) {
                console.error("Erro ao carregar dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const chartData = [
        { name: "Jan", usuarios: 12, empresas: 4 },
        { name: "Fev", usuarios: 18, empresas: 7 },
        { name: "Mar", usuarios: 25, empresas: 5 },
        { name: "Abr", usuarios: 30, empresas: 12 },
        { name: "Mai", usuarios: 45, empresas: 15 },
        { name: "Jun", usuarios: 60, empresas: 22 },
    ];

    if (loading) return <div className="h-full w-full flex items-center justify-center p-20"><Activity className="w-10 h-10 animate-spin text-blue-600" /></div>;

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2b52c2] p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Visão Geral</h1>
                    <p className="text-blue-100 opacity-90 max-w-xl">
                        Acompanhe o crescimento da plataforma Novo Tempo Conecta em tempo real.
                    </p>
                </div>
                <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute right-20 bottom-0 h-32 w-32 rounded-full bg-yellow-400/10 blur-2xl" />
            </div>

            {/* Grid de Estatísticas - Ajustado para 3 colunas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="Total de Usuários" 
                    value={stats.users} 
                    icon={Users} 
                    description="Moradores cadastrados"
                    trend="+12%"
                    colorClass="bg-blue-50 text-blue-600"
                />
                <StatCard 
                    title="Total de Empresas" 
                    value={stats.businesses} 
                    icon={Building2} 
                    description="Estabelecimentos ativos"
                    trend="+5%"
                    colorClass="bg-indigo-50 text-indigo-600"
                />
                <StatCard 
                    title="Empresas em Destaque" 
                    value={stats.featured} 
                    icon={Star} 
                    description="Exibidos na home"
                    colorClass="bg-yellow-50 text-yellow-600"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Gráfico */}
                <Card className="col-span-4 border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-slate-800">Crescimento da Plataforma</CardTitle>
                        <CardDescription>Novos cadastros nos últimos 6 meses</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#64748b" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        stroke="#64748b" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        dx={-10}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        cursor={{fill: '#f8fafc'}}
                                    />
                                    <Bar dataKey="usuarios" name="Usuários" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                                    <Bar dataKey="empresas" name="Empresas" fill="#EAB308" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Lista Recente */}
                <Card className="col-span-3 border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-slate-800">Novos Cadastros</CardTitle>
                        <CardDescription>Últimas adições ao sistema</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            {stats.recentBusinesses.map((b: any) => (
                                <div key={b.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <Avatar className="h-9 w-9 border border-slate-100 bg-white">
                                            <AvatarImage src={b.images?.[0]} className="object-cover" />
                                            <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs font-bold">EMP</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-0.5 truncate">
                                            <p className="text-sm font-medium text-slate-900 truncate">{b.businessName}</p>
                                            <p className="text-xs text-slate-500 truncate">{b.category}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 whitespace-nowrap">Nova Empresa</Badge>
                                </div>
                            ))}
                            {stats.recentUsers.map((u: any) => (
                                <div key={u.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <Avatar className="h-9 w-9 border border-slate-100 bg-white">
                                            <AvatarImage src={u.avatar} className="object-cover" />
                                            <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-bold">US</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-0.5 truncate">
                                            <p className="text-sm font-medium text-slate-900 truncate">{u.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{u.email}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 whitespace-nowrap">Novo Usuário</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}