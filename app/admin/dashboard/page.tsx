"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Building2, Star, Activity, TrendingUp, AlertTriangle } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, Timestamp } from "firebase/firestore"
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
                <div className={`h-9 w-9 rounded-full flex items-center justify-center ${colorClass || 'bg-[#00CCFF]/10 text-[#00CCFF]'}`}>
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
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Buscar TODA a coleção de Usuários
                const usersRef = collection(db, "users");
                const usersSnap = await getDocs(usersRef);
                
                const allUsers = usersSnap.docs.map(doc => ({id: doc.id, ...doc.data() as any}));
                
                // Filtra admins para a contagem de "Usuários"
                const nonAdminUsers = allUsers.filter(u => u.role !== 'admin');
                // Se não houver usuários comuns, mostra o total geral para não ficar zerado em testes
                const totalUsersDisplay = nonAdminUsers.length > 0 ? nonAdminUsers.length : allUsers.length; 

                // 2. Buscar Empresas
                const businessRef = collection(db, "businesses");
                const businessSnap = await getDocs(businessRef);
                const allBusinesses = businessSnap.docs.map(doc => ({id: doc.id, ...doc.data() as any}));

                // 3. Empresas em Destaque
                const featuredBusinesses = allBusinesses.filter(b => b.isFeatured === true);

                // 4. Dados Recentes
                const recentUsersList = [...allUsers].sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 4);
                const recentBusinessList = [...allBusinesses].sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 4);

                setStats({
                    users: totalUsersDisplay, 
                    businesses: allBusinesses.length,
                    featured: featuredBusinesses.length,
                    recentUsers: recentUsersList,
                    recentBusinesses: recentBusinessList
                });

                // Lógica dos Gráficos
                const last6Months: any[] = [];
                const today = new Date();
                
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                    const monthName = d.toLocaleString('pt-BR', { month: 'short' });
                    const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                    
                    last6Months.push({ 
                        name: formattedMonth, 
                        rawDate: d,
                        usuarios: 0, 
                        empresas: 0 
                    });
                }

                const countByMonth = (docData: any, type: 'usuarios' | 'empresas') => {
                    if (!docData.createdAt) return;
                    const date = docData.createdAt instanceof Timestamp 
                        ? docData.createdAt.toDate() 
                        : new Date(docData.createdAt);

                    last6Months.forEach(monthItem => {
                        const mDate = monthItem.rawDate;
                        if (date.getMonth() === mDate.getMonth() && date.getFullYear() === mDate.getFullYear()) {
                            monthItem[type]++;
                        }
                    });
                };

                allUsers.forEach(u => countByMonth(u, 'usuarios'));
                allBusinesses.forEach(b => countByMonth(b, 'empresas'));

                setChartData(last6Months.map(({ rawDate, ...rest }) => rest));

            } catch (error: any) {
                console.error("Erro ao carregar dashboard:", error);
                if (error.code === 'permission-denied') {
                    setErrorMsg("Erro de permissão: Verifique se sua conta tem o cargo 'admin' no Firestore.");
                } else {
                    setErrorMsg("Erro ao carregar dados.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="h-full w-full flex items-center justify-center p-20"><Activity className="w-10 h-10 animate-spin text-[#00CCFF]" /></div>;

    if (errorMsg) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <p>{errorMsg}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-[#002240] p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Visão Geral</h1>
                    <p className="text-white/80 max-w-xl">
                        Acompanhe o crescimento da plataforma Novo Tempo Conecta em tempo real.
                    </p>
                </div>
                <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute right-20 bottom-0 h-32 w-32 rounded-full bg-[#F7B000]/10 blur-2xl" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="Total de Usuários" 
                    value={stats.users} 
                    icon={Users} 
                    description={stats.users === 0 ? "Nenhum usuário encontrado" : "Total cadastrado"}
                    trend={stats.users > 0 ? "+100%" : undefined}
                    colorClass="bg-[#00CCFF]/10 text-[#00CCFF]"
                />
                <StatCard 
                    title="Total de Empresas" 
                    value={stats.businesses} 
                    icon={Building2} 
                    description="Estabelecimentos ativos"
                    colorClass="bg-[#00CCFF]/10 text-[#00CCFF]"
                />
                <StatCard 
                    title="Empresas em Destaque" 
                    value={stats.featured} 
                    icon={Star} 
                    description="Exibidos na home"
                    colorClass="bg-[#F7B000]/10 text-[#F7B000]"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-7">
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
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f8fafc'}} />
                                    <Bar dataKey="usuarios" name="Usuários" fill="#00CCFF" radius={[4, 4, 0, 0]} barSize={30} />
                                    <Bar dataKey="empresas" name="Empresas" fill="#F7B000" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

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
                                            <AvatarFallback className="bg-[#00CCFF]/10 text-[#00CCFF] text-xs font-bold">EMP</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-0.5 truncate">
                                            <p className="text-sm font-medium text-slate-900 truncate">{b.businessName}</p>
                                            <p className="text-xs text-slate-500 truncate">{b.category}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-[#00CCFF]/10 text-[#00CCFF] hover:bg-[#00CCFF]/20 whitespace-nowrap">Nova Empresa</Badge>
                                </div>
                            ))}
                            {stats.recentUsers.map((u: any) => (
                                <div key={u.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <Avatar className="h-9 w-9 border border-slate-100 bg-white">
                                            <AvatarImage src={u.avatar} className="object-cover" />
                                            <AvatarFallback className="bg-[#00CCFF]/10 text-[#00CCFF] text-xs font-bold">US</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-0.5 truncate">
                                            <p className="text-sm font-medium text-slate-900 truncate">{u.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{u.email}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-[#00CCFF]/10 text-[#00CCFF] hover:bg-[#00CCFF]/20 whitespace-nowrap">Novo Usuário</Badge>
                                </div>
                            ))}
                            {stats.recentUsers.length === 0 && stats.recentBusinesses.length === 0 && (
                                <p className="text-sm text-slate-400 text-center py-4">Nenhum cadastro recente.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}