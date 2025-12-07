// app/admin/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Search, Download, Trash2, Loader2, User as UserIcon, Filter, X } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role?: string;
    createdAt: any;
    avatar?: string;
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("role", "!=", "admin")); 
            const snapshot = await getDocs(q);
            
            const usersList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as User[];
            
            setUsers(usersList);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId: string) => {
        try {
            await deleteDoc(doc(db, "users", userId));
            setUsers(prev => prev.filter(user => user.id !== userId));
            alert("Usuário excluído com sucesso.");
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Erro ao excluir usuário.");
        }
    };

    const exportToCSV = () => {
        const headers = ["Nome", "Email", "Telefone", "ID"];
        const csvContent = [
            headers.join(","),
            ...users.map(user => [
                `"${user.name}"`, 
                user.email, 
                user.phone || "N/A", 
                user.id
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "usuarios_novo_tempo.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        // Lógica simples de filtro (pode ser expandida se tiver roles 'user' vs 'editor' etc)
        const matchesRole = filterRole === "all" ? true : true; 
        return matchesSearch && matchesRole;
    });

    const getInitials = (name: string) => name?.substring(0, 2).toUpperCase() || "US";

    return (
        <div className="space-y-6">
            {/* 1. Header Hero (Estilo Zelus) */}
            <div className="rounded-xl bg-[#1E3A8A] p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Gerenciamento de Usuários</h1>
                <p className="text-blue-100 opacity-90">
                    Visualize, filtre e gerencie todos os moradores registrados na plataforma Novo Tempo Conecta.
                </p>
            </div>

            {/* 2. Filtros e Busca */}
            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold">
                        <Filter className="w-5 h-5 text-blue-600" />
                        <span>Filtros de Busca</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Buscar por nome ou e-mail..."
                                className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={filterRole} onValueChange={setFilterRole}>
                            <SelectTrigger className="w-full md:w-[200px] bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Status</SelectItem>
                                <SelectItem value="active">Ativos</SelectItem>
                                <SelectItem value="inactive">Inativos</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="ghost" onClick={() => {setSearchTerm(''); setFilterRole('all')}} className="text-slate-500 hover:text-blue-700">
                            <X className="w-4 h-4 mr-2" /> Limpar
                        </Button>
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-sm">
                            <Search className="w-4 h-4 mr-2" /> Aplicar Busca
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 3. Tabela de Dados */}
            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 px-6 py-4">
                    <CardTitle className="text-lg text-slate-800">Lista de Usuários ({filteredUsers.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={exportToCSV} className="text-slate-600 border-slate-300 hover:bg-white">
                        <Download className="w-4 h-4 mr-2" /> Exportar para Excel/CSV
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center p-12"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="pl-6 font-semibold text-slate-600">Usuário</TableHead>
                                        <TableHead className="font-semibold text-slate-600">Contato</TableHead>
                                        <TableHead className="font-semibold text-slate-600">Data Cadastro</TableHead>
                                        <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                        <TableHead className="text-right pr-6 font-semibold text-slate-600">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                                Nenhum usuário encontrado com os filtros atuais.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 border border-slate-200">
                                                            <AvatarImage src={user.avatar} />
                                                            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                                                                {getInitials(user.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-slate-900">{user.name}</span>
                                                            <span className="text-xs text-slate-500">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-slate-700 text-sm font-medium">{user.phone || "Não informado"}</div>
                                                </TableCell>
                                                <TableCell className="text-slate-600">
                                                    {/* Simulação de data se não existir no objeto */}
                                                    {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : '10/10/2025'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Ativo</Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente a conta de <strong>{user.name}</strong>.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction 
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Confirmar Exclusão
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}