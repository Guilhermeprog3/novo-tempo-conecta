"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Search, Download, Trash2, Loader2, Filter, X } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
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
            const snapshot = await getDocs(usersRef);
            
            const usersList = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as User[];
            
            const onlyUsers = usersList.filter(u => u.role !== 'admin');
            
            setUsers(onlyUsers);
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

    const formatDate = (date: any) => {
        if (!date) return 'Data desconhecida';
        if (date.toDate) return date.toDate().toLocaleDateString('pt-BR');
        if (date instanceof Date) return date.toLocaleDateString('pt-BR');
        return 'Data inválida';
    }

    const exportToCSV = () => {
        // Data e Hora atuais para o relatório
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR');
        const timeStr = now.toLocaleTimeString('pt-BR');

        // Construção das linhas do CSV
        const csvRows = [];

        // 1. Título e Metadados
        csvRows.push(['Relatório de Usuários - Novo Tempo Conecta']); // Título
        csvRows.push([`Gerado em: ${dateStr} às ${timeStr}`]);      // Data
        csvRows.push([]);                                            // Linha em branco

        // 2. Cabeçalhos da Tabela
        const headers = ["Nome", "Email", "Telefone", "Data Cadastro", "Status", "ID"];
        csvRows.push(headers.join(","));

        // 3. Dados dos Usuários
        users.forEach(user => {
            const row = [
                `"${user.name}"`, // Aspas para proteger nomes com vírgulas
                user.email,
                user.phone || "N/A",
                formatDate(user.createdAt),
                "Ativo",
                user.id
            ];
            csvRows.push(row.join(","));
        });

        // Unir tudo com quebra de linha
        const csvContent = csvRows.join("\n");

        // Criar Blob com BOM (\uFEFF) para garantir que acentos funcionem no Excel
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        // Nome do arquivo formatado
        const fileName = `relatorio_usuarios_${dateStr.replace(/\//g, '-')}.csv`;
        
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                              (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getInitials = (name: string) => name?.substring(0, 2).toUpperCase() || "US";

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-[#1E3A8A] p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Gerenciamento de Usuários</h1>
                <p className="text-blue-100 opacity-90">
                    Visualize, filtre e gerencie todos os moradores registrados na plataforma Novo Tempo Conecta.
                </p>
            </div>

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
                                className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 text-slate-900 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <Button variant="ghost" onClick={() => setSearchTerm('')} className="text-slate-500 hover:text-blue-700">
                            <X className="w-4 h-4 mr-2" /> Limpar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 px-6 py-4">
                    <CardTitle className="text-lg text-slate-800">Lista de Usuários ({filteredUsers.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={exportToCSV} className="text-slate-600 border-slate-300 hover:bg-white">
                        <Download className="w-4 h-4 mr-2" /> Exportar Relatório
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
                                                Nenhum usuário encontrado.
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
                                                    {formatDate(user.createdAt)}
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