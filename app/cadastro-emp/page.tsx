"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Store, MapPin, Clock, Loader2, AlertTriangle, User, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { Header } from "@/components/navigation/header"
import Link from "next/link"

const MapWithNoSSR = dynamic(() => import("./MapRegistrationComponent"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-white/5 border border-[#00CCFF]/30 text-[#00CCFF] animate-pulse flex items-center justify-center">Carregando mapa...</div>
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

export default function EmpresarioCadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [position, setPosition] = useState<{lat: number, lng: number} | null>(null);
  const [errors, setErrors] = useState<any>({});
  
  const [formData, setFormData] = useState({
    ownerName: '', email: '', businessName: '', category: '', 
    businessPhone: '', address: '', website: '', description: '',
    password: '', confirmPassword: '', terms: false
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
    setErrors({});

    if (!position) return setErrors({ auth: "Por favor, marque o local da sua loja no mapa." });
    if (formData.password !== formData.confirmPassword) return setErrors({ auth: "As senhas não coincidem" });
    if (!formData.terms) return setErrors({ auth: "Você precisa aceitar os termos de uso." });
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      await setDoc(doc(db, "businesses", userCredential.user.uid), {
        ...formData,
        openingHours: openingHours.filter(h => h.isOpen),
        location: { latitude: position.lat, longitude: position.lng },
        role: 'business',
        status: 'pending',
        createdAt: new Date()
      });
      
      router.push('/empresario/dashboard');
    } catch (err: any) {
      setErrors({ auth: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "bg-white/5 border-[#00CCFF]/30 text-white focus-visible:ring-[#00CCFF] placeholder:text-gray-500";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#001529] py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="bg-[#002240] border-[#00CCFF]/20 text-white shadow-2xl">
            <CardHeader className="text-center border-b border-[#00CCFF]/10 mb-6">
              <div className="mx-auto w-12 h-12 bg-[#00CCFF]/20 rounded-full flex items-center justify-center mb-2">
                <Store className="text-[#00CCFF]" size={28} />
              </div>
              <CardTitle className="text-3xl font-bold text-[#00CCFF]">Cadastrar Minha Loja</CardTitle>
              <CardDescription className="text-gray-400">Divulgue seu estabelecimento para a comunidade</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* INFORMAÇÕES DA LOJA */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase text-[#00CCFF] flex items-center gap-2">
                    <Info size={16} /> Informações do Negócio
                  </h3>
                  <div className="space-y-2">
                    <Label>Nome do Estabelecimento *</Label>
                    <Input placeholder="Ex: Panificadora Central" className={inputStyles} onChange={e => setFormData({...formData, businessName: e.target.value})} required />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Categoria *</Label>
                      <Select onValueChange={v => setFormData({...formData, category: v})} required>
                        <SelectTrigger className={inputStyles}><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent className="bg-[#002240] text-white border-[#00CCFF]/30">
                          {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone Comercial</Label>
                      <Input placeholder="(00) 00000-0000" className={inputStyles} onChange={e => setFormData({...formData, businessPhone: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* HORÁRIOS */}
                <div className="p-4 bg-white/5 rounded-lg border border-[#00CCFF]/10">
                  <Label className="text-[#00CCFF] mb-4 flex items-center gap-2">
                    <Clock size={16} /> Horário de Funcionamento
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {openingHours.map((hour, index) => (
                      <div key={hour.day} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox checked={hour.isOpen} onCheckedChange={v => handleOpeningHoursChange(index, 'isOpen', !!v)} />
                          <span className="text-xs text-gray-300">{hour.day}</span>
                        </div>
                        {hour.isOpen && (
                          <div className="flex gap-2 ml-6">
                            <Input type="time" className="h-8 bg-black/20 text-xs border-[#00CCFF]/20 w-24" value={hour.opens} onChange={e => handleOpeningHoursChange(index, 'opens', e.target.value)} />
                            <Input type="time" className="h-8 bg-black/20 text-xs border-[#00CCFF]/20 w-24" value={hour.closes} onChange={e => handleOpeningHoursChange(index, 'closes', e.target.value)} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* LOCALIZAÇÃO */}
                <div className="space-y-2">
                  <Label className="text-[#00CCFF] flex items-center gap-2">
                    <MapPin size={16} /> Localização *
                  </Label>
                  <div className="h-[250px] rounded-lg overflow-hidden border border-[#00CCFF]/30 relative z-0">
                    <MapWithNoSSR position={position} setPosition={setPosition} />
                  </div>
                </div>

                {/* DADOS DO PROPRIETÁRIO */}
                <div className="space-y-4 border-t border-white/5 pt-6">
                  <h3 className="text-sm font-semibold uppercase text-[#00CCFF] flex items-center gap-2">
                    <User size={16} /> Dados de Acesso
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Proprietário *</Label>
                      <Input placeholder="Seu nome" className={inputStyles} onChange={e => setFormData({...formData, ownerName: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label>E-mail *</Label>
                      <Input type="email" placeholder="email@exemplo.com" className={inputStyles} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Senha *</Label>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Mínimo 6 caracteres" 
                          className={inputStyles} 
                          onChange={e => setFormData({...formData, password: e.target.value})} 
                          required 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Confirmar Senha *</Label>
                      <Input type="password" placeholder="Repita a senha" className={inputStyles} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
                    </div>
                  </div>
                </div>

                {errors.auth && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-500 text-sm font-medium">
                    <AlertTriangle size={16} /> {errors.auth}
                  </div>
                )}

                {/* TERMOS E SUBMIT */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.terms} 
                      onCheckedChange={(v) => setFormData({...formData, terms: !!v})} 
                      className="border-[#00CCFF] data-[state=checked]:bg-[#00CCFF]"
                    />
                    <Label htmlFor="terms" className="text-sm text-white font-normal leading-none cursor-pointer">
                      Concordo com os{" "}
                      <Link href="/termos-de-uso" target="_blank" className="text-[#F7B000] hover:underline font-medium">
                        Termos de Uso
                      </Link>
                      {" "}e{" "}
                      <Link href="/politica-de-privacidade" target="_blank" className="text-[#F7B000] hover:underline font-medium">
                        Política de Privacidade
                      </Link>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#00CCFF] text-[#001529] hover:bg-[#00CCFF]/90 font-bold h-12 text-lg shadow-lg" 
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Cadastrar Meu Negócio"}
                  </Button>
                </div>

                {/* NAVEGAÇÃO FINAL */}
                <div className="text-center pt-2 space-y-3">
                  <p className="text-sm text-gray-400">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="text-[#F7B000] hover:underline font-medium">
                      Faça login aqui
                    </Link>
                  </p>
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-sm text-gray-400">
                      Não é um empresário?{" "}
                      <Link href="/cadastro" className="text-[#F7B000] hover:underline font-medium">
                        Cadastre-se como Cidadão
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}