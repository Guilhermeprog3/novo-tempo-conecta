// app/empresario/dashboard/page.tsx
"use client"

// Importe os componentes e ícones que você usa APENAS no conteúdo desta página
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, MessageSquare, MapPin, Phone, Clock, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Mova o tipo para cá se for usar os dados completos novamente
type BusinessData = {
    address: string;
    businessPhone: string;
    hours: string;
    website: string;
};

// Componente auxiliar para os itens de informação
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) => (
    <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg text-blue-700">
            {icon}
        </div>
        <div>
            <p className="font-semibold text-gray-800">{label}</p>
            <p className="text-sm text-gray-600">{value || 'Não informado'}</p>
        </div>
    </div>
);


export default function EmpresarioDashboardPage() {
    // Se precisar de dados específicos que o layout não tem, pode buscar aqui.
    // Para este caso, vamos buscar novamente para preencher os cards.
    const [businessData, setBusinessData] = useState<BusinessData | null>(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const docRef = doc(db, "businesses", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setBusinessData(docSnap.data() as BusinessData);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-8">
            <Card className="shadow-lg bg-white border border-gray-200/80 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-slate-900 text-lg">Ações Rápidas</CardTitle>
                    <CardDescription className="text-slate-500">Gerencie seu estabelecimento de forma eficiente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button className="h-24 p-4 flex-col items-center justify-center space-y-2 text-base bg-blue-700 text-white hover:bg-blue-800 transition-all duration-300" asChild>
                            <Link href="/empresario/perfil">
                                <Edit className="w-6 h-6" />
                                <span>Editar Informações</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-24 p-4 flex-col items-center justify-center space-y-2 text-base bg-transparent text-blue-700 border-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-all duration-300" asChild>
                            <Link href="/empresario/avaliacoes">
                                <MessageSquare className="w-6 h-6" />
                                <span>Responder Avaliações</span>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg bg-white border border-gray-200/80 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-slate-900 text-lg">Informações do Estabelecimento</CardTitle>
                    <CardDescription className="text-slate-500">Resumo das suas informações públicas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <InfoItem icon={<MapPin size={20} />} label="Endereço" value={businessData?.address} />
                        <InfoItem icon={<Phone size={20} />} label="Telefone" value={businessData?.businessPhone} />
                        <InfoItem icon={<Clock size={20} />} label="Horário" value={businessData?.hours} />
                        <InfoItem icon={<Globe size={20} />} label="Instagram" value={businessData?.website} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}