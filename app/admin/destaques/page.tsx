"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Star, Search, Plus, X, Filter, Store } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Business = {
    id: string;
    businessName: string;
    category: string;
    isFeatured?: boolean;
    address?: string;
};

export default function DestaquesPage() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const snapshot = await getDocs(collection(db, "businesses"));
                const list = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Business[];
                setBusinesses(list);
            } catch (error) {
                console.error("Erro:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBusinesses();
    }, []);

    const featuredBusinesses = businesses.filter(b => b.isFeatured);
    const availableBusinesses = businesses.filter(b => 
        !b.isFeatured && 
        b.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleFeatured = async (business: Business, isFeatured: boolean) => {
        if (isFeatured && featuredBusinesses.length >= 3) {
            alert("Você só pode selecionar até 3 empresas como destaque.");
            return;
        }

        try {
            const businessRef = doc(db, "businesses", business.id);
            await updateDoc(businessRef, { isFeatured: isFeatured });

            setBusinesses(prev => prev.map(b => 
                b.id === business.id ? { ...b, isFeatured: isFeatured } : b
            ));
        } catch (error) {
            console.error("Erro ao atualizar destaque:", error);
            alert("Erro ao atualizar.");
        }
    };

    if (loading) return <div className="flex h-full justify-center items-center"><Loader2 className="animate-spin h-10 w-10 text-[#00CCFF]" /></div>;

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-[#002240] p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Destaques da Página Inicial</h1>
                <p className="text-white/80">
                    Gerencie quais empresas aparecem em evidência no topo do site. Selecione até 3 opções.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map((i) => {
                    const business = featuredBusinesses[i];
                    return (
                        <Card key={i} className={`relative transition-all duration-300 ${business ? 'border-[#00CCFF] bg-white shadow-md ring-2 ring-[#00CCFF]/20' : 'border-2 border-dashed border-slate-300 bg-slate-50/50'}`}>
                            <CardContent className="flex flex-col items-center justify-center min-h-[160px] p-6">
                                {business ? (
                                    <>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="absolute top-2 right-2 h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                            onClick={() => toggleFeatured(business, false)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                        
                                        <div className="w-12 h-12 rounded-full bg-[#F7B000]/10 flex items-center justify-center mb-3 text-[#F7B000]">
                                            <Star className="w-6 h-6 fill-current" />
                                        </div>
                                        
                                        <h3 className="font-bold text-lg text-slate-800 text-center line-clamp-1 mb-1">
                                            {business.businessName}
                                        </h3>
                                        <Badge variant="secondary" className="bg-[#00CCFF]/10 text-[#00CCFF] border-[#00CCFF]/20">
                                            {business.category}
                                        </Badge>
                                        <p className="text-xs text-slate-400 mt-3 font-medium uppercase tracking-wider">Destaque {i + 1}</p>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
                                            <Plus className="w-6 h-6" />
                                        </div>
                                        <p className="text-slate-500 font-medium">Slot Disponível</p>
                                        <p className="text-xs text-slate-400 mt-1">Selecione abaixo para preencher</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold">
                        <Filter className="w-5 h-5 text-[#00CCFF]" />
                        <span>Buscar Empresa para Adicionar</span>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Digite o nome da empresa..."
                                className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-[#00CCFF] text-slate-900 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="border-b bg-slate-50/50 px-6 py-4">
                    <CardTitle className="text-lg text-slate-800">Empresas Disponíveis</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[500px] overflow-y-auto">
                        {availableBusinesses.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 flex flex-col items-center">
                                <Store className="w-12 h-12 text-slate-300 mb-2" />
                                <p>Nenhuma empresa encontrada para adicionar.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {availableBusinesses.map(business => (
                                    <div key={business.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10 rounded-lg border border-slate-200 bg-white">
                                                <AvatarFallback className="bg-slate-100 text-slate-600 rounded-lg">
                                                    <Store className="w-5 h-5"/>
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-slate-900">{business.businessName}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{business.category}</span>
                                                    {business.address && <span className="text-xs text-slate-400">• {business.address}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            onClick={() => toggleFeatured(business, true)}
                                            disabled={featuredBusinesses.length >= 3}
                                            className={`
                                                ${featuredBusinesses.length >= 3 
                                                    ? "bg-slate-100 text-slate-400 hover:bg-slate-100" 
                                                    : "bg-[#00CCFF] text-[#002240] hover:bg-[#00CCFF]/90 shadow-sm"
                                                }
                                            `}
                                        >
                                            <Plus className="w-4 h-4 mr-1.5" /> 
                                            {featuredBusinesses.length >= 3 ? "Slots Cheios" : "Adicionar aos Destaques"}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}