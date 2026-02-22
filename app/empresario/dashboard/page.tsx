"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
    Edit, MessageSquare, MapPin, Phone, Clock, Globe, Loader2, Building, Tag, AlignLeft, MessageCircle 
} from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

type BusinessData = {
    businessName: string;
    category: string;
    description: string;
    businessPhone: string;
    whatsapp: string;
    website: string;
    address: string;
    hours: string;
};

const InfoItem = ({ icon, label, value, fullWidth = false }: { 
    icon: React.ReactNode, 
    label: string, 
    value?: string,
    fullWidth?: boolean
}) => (
    <div className={`flex items-start space-x-4 ${fullWidth ? 'md:col-span-2' : ''}`}>
        <div className="flex-shrink-0 bg-[#00CCFF]/10 p-3 rounded-lg text-[#00CCFF] mt-1">
            {icon}
        </div>
        <div>
            <p className="font-semibold text-slate-800">{label}</p>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{value || 'Não informado'}</p>
        </div>
    </div>
);


export default function EmpresarioDashboardPage() {
    const [businessData, setBusinessData] = useState<BusinessData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const docRef = doc(db, "businesses", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setBusinessData(docSnap.data() as BusinessData);
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#00CCFF]" /></div>;
    }

    return (
        <div className="space-y-6">
            <Card className="shadow-sm bg-white border border-slate-200 rounded-xl">
                <CardHeader>
                    <CardTitle className="text-slate-900 text-lg">Ações Rápidas</CardTitle>
                    <CardDescription className="text-slate-500">Gerencie seu estabelecimento de forma eficiente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button className="h-24 p-4 flex-col items-center justify-center space-y-2 text-base bg-[#00CCFF] text-[#002240] font-bold hover:bg-[#00CCFF]/90 transition-all duration-300" asChild>
                            <Link href="/empresario/perfil">
                                <Edit className="w-6 h-6" />
                                <span>Editar Informações</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-24 p-4 flex-col items-center justify-center space-y-2 text-base bg-transparent text-[#00CCFF] border-[#00CCFF] hover:bg-[#00CCFF]/10 transition-all duration-300" asChild>
                            <Link href="/empresario/avaliacoes">
                                <MessageSquare className="w-6 h-6" />
                                <span>Responder Avaliações</span>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm bg-white border border-slate-200 rounded-xl">
                <CardHeader>
                    <CardTitle className="text-slate-900 text-lg">Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <InfoItem icon={<Building size={20} />} label="Nome do Estabelecimento" value={businessData?.businessName} />
                    <InfoItem icon={<Tag size={20} />} label="Categoria" value={businessData?.category} />
                    <InfoItem icon={<AlignLeft size={20} />} label="Descrição" value={businessData?.description} fullWidth />
                </CardContent>
            </Card>
            
            <Card className="shadow-sm bg-white border border-slate-200 rounded-xl">
                <CardHeader>
                    <CardTitle className="text-slate-900 text-lg">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <InfoItem icon={<Phone size={20} />} label="Telefone" value={businessData?.businessPhone} />
                    <InfoItem icon={<MessageCircle size={20} />} label="WhatsApp" value={businessData?.whatsapp} />
                    <InfoItem icon={<Globe size={20} />} label="Instagram / Site" value={businessData?.website} />
                </CardContent>
            </Card>

            <Card className="shadow-sm bg-white border border-slate-200 rounded-xl">
                <CardHeader>
                    <CardTitle className="text-slate-900 text-lg">Localização e Horários</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <InfoItem icon={<MapPin size={20} />} label="Endereço" value={businessData?.address} />
                    <InfoItem icon={<Clock size={20} />} label="Horário" value={businessData?.hours} />
                </CardContent>
            </Card>
        </div>
    );
}