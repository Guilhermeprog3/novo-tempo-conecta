"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Store, MapPin, Clock, Loader2, AlertTriangle, Info, ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const MapWithNoSSR = dynamic(() => import("../../../cadastro-emp/MapRegistrationComponent"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse flex items-center justify-center rounded-lg border border-slate-200 text-slate-500">Carregando mapa...</div>
});

const categories = [
    { value: "restaurante", label: "Restaurantes e Gastronomia" },
    { value: "comercio", label: "Loja e Varejo" },
    { value: "mercado", label: "Mercados e Mercearias" },
    { value: "saude", label: "Farmácias e Saúde" },
    { value: "beleza", label: "Estética e Barbearia" },
    { value: "servicos", label: "Prestação de Serviços" },
    { value: "outro", label: "Outros Negócios" },
];

const daysOfWeek = [
    { id: 'monday', label: 'Segunda-feira' },
    { id: 'tuesday', label: 'Terça-feira' },
    { id: 'wednesday', label: 'Quarta-feira' },
    { id: 'thursday', label: 'Quinta-feira' },
    { id: 'friday', label: 'Sexta-feira' },
    { id: 'saturday', label: 'Sábado' },
    { id: 'sunday', label: 'Domingo' },
];

export default function AdminNovoCadastroEmpresa() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<{lat: number, lng: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    ownerName: '', email: '', businessName: '', category: '', 
    businessPhone: '', address: '', website: '', description: ''
  });

  const [openingHours, setOpeningHours] = useState(
    daysOfWeek.map(day => ({ day: day.label, opens: '08:00', closes: '18:00', isOpen: false }))
  );

  const handleOpeningHoursChange = (index: number, field: string, value: any) => {
    const newHours = [...openingHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setOpeningHours(newHours);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!position) return setError("Por favor, marque a localização no mapa.");
    
    setLoading(true);
    try {
      await addDoc(collection(db, "businesses"), {
        ...formData,
        openingHours: openingHours.filter(h => h.isOpen),
        location: { latitude: position.lat, longitude: position.lng },
        role: 'business',
        status: 'approved',
        createdAt: serverTimestamp()
      });
      router.push('/admin/empresas');
    } catch (err: any) {
      setError("Erro ao salvar empresa: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cores de texto forçadas para evitar que fiquem brancas no fundo claro
  const inputStyles = "bg-slate-50 border-slate-200 focus-visible:ring-[#00CCFF] text-slate-900 placeholder:text-slate-400";
  const labelStyles = "text-slate-700 font-medium";

  return (
    <div className="space-y-6 pb-10">
      {/* Cabeçalho */}
      <div className="rounded-xl bg-[#002240] p-8 text-white shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Novo Cadastro</h1>
          <p className="text-white/80">Adicione manualmente um novo estabelecimento parceiro.</p>
        </div>
        <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50 px-6 py-4">
          <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
            <Store className="text-[#00CCFF] w-5 h-5" /> Formulário da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* DADOS GERAIS */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
                    <Info className="w-4 h-4 text-[#00CCFF]" />
                    <span>Informações do Negócio</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className={labelStyles}>Nome do Estabelecimento *</Label>
                    <Input required className={inputStyles} placeholder="Ex: Restaurante Sabor Local" onChange={e => setFormData({...formData, businessName: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={labelStyles}>Categoria *</Label>
                      <Select onValueChange={v => setFormData({...formData, category: v})} required>
                        <SelectTrigger className={inputStyles}><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent className="bg-white text-slate-900">
                          {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className={labelStyles}>Telefone</Label>
                      <Input className={inputStyles} placeholder="(86) 90000-0000" onChange={e => setFormData({...formData, businessPhone: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className={labelStyles}>Endereço Completo *</Label>
                    <Input required className={inputStyles} placeholder="Rua, Número, Bairro" onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>

                {/* MAPA */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
                    <MapPin className="w-4 h-4 text-[#00CCFF]" />
                    <span>Localização Geográfica *</span>
                  </div>
                  <div className="h-[280px] rounded-lg overflow-hidden border border-slate-200 relative z-0">
                    <MapWithNoSSR position={position} setPosition={setPosition} />
                  </div>
                  <p className="text-[11px] text-slate-500 italic text-center">Clique no mapa para fixar a localização exata.</p>
                </div>
            </div>

            {/* HORÁRIOS */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <Label className="text-slate-800 mb-4 flex items-center gap-2 font-bold">
                <Clock className="w-4 h-4 text-[#00CCFF]" /> Horário de Funcionamento
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {openingHours.map((hour, index) => (
                  <div key={hour.day} className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Checkbox 
                        id={`day-${index}`}
                        checked={hour.isOpen} 
                        onCheckedChange={v => handleOpeningHoursChange(index, 'isOpen', !!v)}
                        className="border-slate-300"
                      />
                      <label htmlFor={`day-${index}`} className="text-xs font-semibold text-slate-700 cursor-pointer">{hour.day}</label>
                    </div>
                    {hour.isOpen && (
                      <div className="flex gap-1 items-center">
                        <Input type="time" className="h-8 text-[11px] px-2 bg-slate-50 text-slate-900 border-slate-200" value={hour.opens} onChange={e => handleOpeningHoursChange(index, 'opens', e.target.value)} />
                        <span className="text-xs text-slate-500 font-medium">às</span>
                        <Input type="time" className="h-8 text-[11px] px-2 bg-slate-50 text-slate-900 border-slate-200" value={hour.closes} onChange={e => handleOpeningHoursChange(index, 'closes', e.target.value)} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* DADOS DO RESPONSÁVEL */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="text-sm font-bold text-slate-800 uppercase tracking-wider">Dados de Contato Interno</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={labelStyles}>Nome do Responsável</Label>
                  <Input className={inputStyles} placeholder="Ex: João Silva" onChange={e => setFormData({...formData, ownerName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className={labelStyles}>E-mail de Contato</Label>
                  <Input type="email" className={inputStyles} placeholder="contato@empresa.com" onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-600 text-sm font-semibold">
                <AlertTriangle size={18} /> {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => router.back()} className="text-slate-600 border-slate-300">Cancelar</Button>
              <Button type="submit" className="bg-[#F7B000] hover:bg-[#F7B000]/90 text-[#002240] font-bold px-8 shadow-md" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar Empresa
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}