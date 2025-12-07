"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Search, Download, Trash2, Loader2, Store, Globe, Filter, X, MapPin, Mail, Phone } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Business = {
    id: string;
    businessName: string;
    businessPhone: string;
    email?: string;
    address: string;
    website?: string;
    category: string;
    createdAt?: any;
};

export default function AdminEmpresasPage() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    const fetchBusinesses = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, "businesses"));
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Business[];
            setBusinesses(list);
        } catch (error) {
            console.error("Erro ao buscar empresas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBusinesses(); }, []);

    const handleDeleteBusiness = async (id: string) => {
        try {
            await deleteDoc(doc(db, "businesses", id));
            setBusinesses(prev => prev.filter(b => b.id !== id));
            alert("Empresa excluída com sucesso.");
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir.");
        }
    };

    const formatDate = (date: any) => {
        if (!date) return 'N/A';
        if (date.toDate) return date.toDate().toLocaleDateString('pt-BR');
        if (date instanceof Date) return date.toLocaleDateString('pt-BR');
        return 'N/A';
    }

    const exportToCSV = () => {
        // Data e Hora atuais
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR');
        const timeStr = now.toLocaleTimeString('pt-BR');

        // Construção das linhas
        const csvRows = [];

        // 1. Título e Metadados
        csvRows.push(['Relatório de Empresas - Novo Tempo Conecta']);
        csvRows.push([`Gerado em: ${dateStr} às ${timeStr}`]);
        csvRows.push([]);

        // 2. Cabeçalhos
        const headers = ["Nome da Empresa", "Categoria", "Email", "Telefone", "Endereço", "Site/Instagram", "Data Cadastro"];
        csvRows.push(headers.join(","));

        // 3. Dados
        businesses.forEach(b => {
            const row = [
                `"${b.businessName}"`,
                b.category,
                b.email || "N/A",
                b.businessPhone,
                `"${b.address}"`,
                b.website || "",
                formatDate(b.createdAt)
            ];
            csvRows.push(row.join(","));
        });

        // Unir conteúdo
        const csvContent = csvRows.join("\n");

        // Blob com BOM para acentos
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        // Nome do arquivo formatado
        const fileName = `relatorio_empresas_${dateStr.replace(/\//g, '-')}.csv`;

        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filtered = businesses.filter(b => {
        const matchesSearch = b.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (b.email && b.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = filterCategory === "all" || b.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryStyle = (category: string) => {
        return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
    };

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-[#1E3A8A] p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Gerenciamento de Empresas</h1>
                <p className="text-blue-100 opacity-90">
                    Filtre, visualize e gerencie todos os estabelecimentos comerciais parceiros.
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
                                placeholder="Buscar por nome ou e-mail da empresa..."
                                className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 text-slate-900 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-full md:w-[200px] bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Categorias</SelectItem>
                                <SelectItem value="restaurante">Restaurantes</SelectItem>
                                <SelectItem value="servicos">Serviços</SelectItem>
                                <SelectItem value="comercio">Comércio</SelectItem>
                                <SelectItem value="saude">Saúde</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="ghost" onClick={() => {setSearchTerm(''); setFilterCategory('all')}} className="text-slate-500 hover:text-blue-700">
                            <X className="w-4 h-4 mr-2" /> Limpar
                        </Button>
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-sm">
                            <Search className="w-4 h-4 mr-2" /> Aplicar Busca
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 px-6 py-4">
                    <CardTitle className="text-lg text-slate-800">Lista de Empresas ({filtered.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={exportToCSV} className="text-slate-600 border-slate-300 hover:bg-white">
                        <Download className="w-4 h-4 mr-2" /> Exportar Relatório
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                         <div className="flex justify-center p-12"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>
                    ) : (
                        <div className="rounded-md">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="pl-6 font-semibold text-slate-600">Empresa</TableHead>
                                        <TableHead className="font-semibold text-slate-600">Categoria</TableHead>
                                        <TableHead className="font-semibold text-slate-600">Contato</TableHead>
                                        <TableHead className="font-semibold text-slate-600">Endereço</TableHead>
                                        <TableHead className="font-semibold text-slate-600">Data Cadastro</TableHead>
                                        <TableHead className="text-right pr-6 font-semibold text-slate-600">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-12 text-slate-500">Nenhuma empresa encontrada.</TableCell></TableRow> 
                                    ) : (
                                        filtered.map(b => (
                                            <TableRow key={b.id} className="hover:bg-slate-50/80 transition-colors">
                                                <TableCell className="pl-6 py-4 font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 rounded-lg border border-slate-200 bg-white">
                                                            <AvatarFallback className="bg-slate-100 text-slate-600 rounded-lg">
                                                                <Store className="w-5 h-5"/>
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-slate-900">{b.businessName}</span>
                                                            {b.website && (
                                                                <a href={b.website.startsWith('http') ? b.website : `https://${b.website}`} target="_blank" className="flex items-center text-xs text-blue-600 hover:underline mt-0.5">
                                                                    <Globe className="w-3 h-3 mr-1" /> Website
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={getCategoryStyle(b.category)}>
                                                        {b.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1 text-sm">
                                                        <div className="flex items-center text-slate-700">
                                                            <Phone className="w-3 h-3 mr-1.5 text-slate-400" />
                                                            {b.businessPhone}
                                                        </div>
                                                        {b.email && (
                                                            <div className="flex items-center text-slate-500 text-xs">
                                                                <Mail className="w-3 h-3 mr-1.5 text-slate-400" />
                                                                {b.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-[200px]">
                                                    <div className="flex items-start gap-1 text-slate-600 text-sm truncate" title={b.address}>
                                                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                                        {b.address}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600 text-sm">
                                                    {formatDate(b.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full">
                                                                <Trash2 className="w-4 h-4"/>
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Excluir Empresa?</AlertDialogTitle>
                                                                <AlertDialogDescription>Ação irreversível. Isso apagará permanentemente o perfil de <strong>{b.businessName}</strong>.</AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteBusiness(b.id)} className="bg-red-600 hover:bg-red-700">Confirmar</AlertDialogAction>
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