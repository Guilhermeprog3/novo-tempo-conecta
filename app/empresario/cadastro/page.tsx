// app/empresario/cadastro/page.tsx
"use client"

import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Store, MapPin, Clock, Globe, FileText, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import L, { LatLng } from 'leaflet'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { CheckedState } from "@radix-ui/react-checkbox"
import Header from "@/components/navigation/header";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// --- COMPONENTES DO MAPA ---
type LocationMarkerProps = {
  position: LatLng | null;
  setPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
}

function LocationMarker({ position, setPosition }: LocationMarkerProps) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

type CenterMapProps = {
    setPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
}

function CenterMapToUserLocation({ setPosition }: CenterMapProps) {
    const map = useMap();
  
    useEffect(() => {
      if (map) {
        navigator.geolocation.getCurrentPosition(
          (location) => {
            const { latitude, longitude } = location.coords;
            const userLatLng = new L.LatLng(latitude, longitude);
            map.flyTo(userLatLng, 15);
            setPosition(userLatLng);
          },
          () => {
            console.log("Não foi possível obter a localização.");
          }
        );
      }
    }, [map, setPosition]);
  
    return null;
}

// --- LÓGICA DO FORMULÁRIO ---
const categories = [
    { value: "restaurante", label: "Restaurantes e Alimentação" },
    { value: "comercio", label: "Comércio e Varejo" },
    { value: "servicos", label: "Serviços Técnicos" },
    { value: "saude", label: "Saúde e Bem-estar" },
    { value: "beleza", label: "Beleza e Estética" },
    { value: "educacao", label: "Educação e Cursos" },
    { value: "automotivo", label: "Automotivo" },
    { value: "casa", label: "Casa e Construção" },
    { value: "lazer", label: "Lazer" },
    { value: "moda", label: "Moda e Vestuário" },
    { value: "esportes", label: "Esportes" },
    { value: "outro", label: "Outro" },
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [position, setPosition] = useState<LatLng | null>(null);
  const [formData, setFormData] = useState({
    ownerName: '', email: '', phone: '', whatsapp: '',
    businessName: '', category: '', businessPhone: '',
    address: '', website: '', description: '',
    password: '', confirmPassword: '', terms: false,
  });

  const [openingHours, setOpeningHours] = useState(
    daysOfWeek.map(day => ({ day: day.label, opens: '08:00', closes: '18:00', isOpen: false }))
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleOpeningHoursChange = (index: number, field: string, value: string | boolean) => {
    const newHours = [...openingHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setOpeningHours(newHours);
  };

  const formatHoursToString = (hours: typeof openingHours) => {
    if (!hours.some(h => h.isOpen)) return "Não informado";
    const dayShortNames = { 'Segunda-feira': 'Seg', 'Terça-feira': 'Ter', 'Quarta-feira': 'Qua', 'Quinta-feira': 'Qui', 'Sexta-feira': 'Sex', 'Sábado': 'Sáb', 'Domingo': 'Dom' };
    const grouped = hours.reduce((acc, day) => {
        if (!day.isOpen || !day.opens || !day.closes) return acc;
        const timeRange = `${day.opens} - ${day.closes}`;
        if (!acc[timeRange]) acc[timeRange] = [];
        acc[timeRange].push(day.day);
        return acc;
    }, {} as Record<string, string[]>);

    return Object.entries(grouped).map(([timeRange, days]) => {
      if (days.length === 0) return '';
      const dayIndexes = days.map(d => daysOfWeek.findIndex(dayInfo => dayInfo.label === d));
      let groups: string[] = [];
      let currentGroup: string[] = [days[0]];

      for (let i = 1; i < days.length; i++) {
        if (dayIndexes[i] === dayIndexes[i-1] + 1) {
          currentGroup.push(days[i]);
        } else {
          groups.push(currentGroup.length > 2 ? `${dayShortNames[currentGroup[0] as keyof typeof dayShortNames]}-${dayShortNames[currentGroup[currentGroup.length-1] as keyof typeof dayShortNames]}` : currentGroup.map(d => dayShortNames[d as keyof typeof dayShortNames]).join(', '));
          currentGroup = [days[i]];
        }
      }
      groups.push(currentGroup.length > 2 ? `${dayShortNames[currentGroup[0] as keyof typeof dayShortNames]}-${dayShortNames[currentGroup[currentGroup.length-1] as keyof typeof dayShortNames]}` : currentGroup.map(d => dayShortNames[d as keyof typeof dayShortNames]).join(', '));
      return `${groups.join(', ')}: ${timeRange}`;
    }).join('; ');
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    
    if (!formData.terms) {
      setErrors({ form: "Você deve aceitar os termos de uso e a política de privacidade." });
      setLoading(false);
      return;
    }

    let fieldErrors: { [key: string]: string } = {};

    if (formData.password !== formData.confirmPassword) {
      fieldErrors.confirmPassword = "As senhas não coincidem!";
    }
    if (!position) {
      fieldErrors.map = "Por favor, marque a localização do seu negócio no mapa.";
    }

    if (Object.keys(fieldErrors).length > 0) {
        setErrors({...fieldErrors, form: "Preencha corretamente todos os campos."});
        setLoading(false);
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const dataToSave = { ...formData,
        hours: formatHoursToString(openingHours),
        location: { latitude: position!.lat, longitude: position!.lng },
        ownerId: user.uid,
        rating: 0,
        reviewCount: 0,
      };
      // @ts-ignore
      delete dataToSave.password;
      // @ts-ignore
      delete dataToSave.confirmPassword;

      await setDoc(doc(db, "businesses", user.uid), dataToSave);

      window.location.href = '/empresario/dashboard';

    } catch (error: any) {
      console.error("Erro ao cadastrar:", error.code, error.message);
      let newErrors: { [key: string]: string } = {};
      switch (error.code) {
        case 'auth/email-already-in-use':
          newErrors.email = "Este e-mail já está em uso.";
          newErrors.form = "Preencha corretamente todos os campos.";
          break;
        case 'auth/invalid-email':
          newErrors.email = "O formato do e-mail é inválido.";
          newErrors.form = "Preencha corretamente todos os campos.";
          break;
        case 'auth/weak-password':
          newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
          newErrors.form = "Preencha corretamente todos os campos.";
          break;
        default:
          newErrors.form = "Ocorreu um erro inesperado. Verifique sua conexão e tente novamente.";
          break;
      }
      setErrors(newErrors);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Cadastrar Estabelecimento</CardTitle>
              <CardDescription className="text-white/80">Registre seu negócio e conecte-se com milhares de moradores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* DADOS DO RESPONSÁVEL */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-blue-600 pb-2">Dados do Responsável</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="ownerName" className="text-white/90">Nome completo</Label>
                          <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                              <Input id="ownerName" type="text" placeholder="Seu nome completo" className="pl-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60" required onChange={handleChange} value={formData.ownerName} aria-invalid={!!errors.ownerName} />
                          </div>
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="email" className="text-white/90">E-mail</Label>
                          <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                              <Input id="email" type="email" placeholder="seu@email.com" className="pl-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60" required onChange={handleChange} value={formData.email} aria-invalid={!!errors.email} />
                          </div>
                          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                      </div>
                  </div>
                </div>

                {/* DADOS DO ESTABELECIMENTO */}
                <div className="space-y-4">
                   <h3 className="text-lg font-semibold text-white border-b border-blue-600 pb-2">Dados do Estabelecimento</h3>
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-white/90">Nome do estabelecimento</Label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                      <Input id="businessName" type="text" placeholder="Nome do seu negócio" className="pl-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60" required onChange={handleChange} value={formData.businessName}/>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-white/90">Categoria</Label>
                      <Select onValueChange={handleCategoryChange} value={formData.category}>
                        <SelectTrigger className="bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent className="z-[1000] bg-blue-900 text-white border-blue-700">
                          {categories.map((cat) => (
                             <SelectItem key={cat.value} value={cat.value} className="focus:bg-blue-800 focus:text-white">{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessPhone" className="text-white/90">Telefone comercial</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                        <Input id="businessPhone" type="tel" placeholder="(11) 3333-3333" className="pl-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60" required onChange={handleChange} value={formData.businessPhone} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-white/90">Endereço completo</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-white/60 w-4 h-4" />
                      <Textarea id="address" placeholder="Rua, número, complemento, bairro" className="pl-10 min-h-[80px] bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60" required onChange={handleChange} value={formData.address}/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/90">Horário de funcionamento</Label>
                    <div className="p-4 border border-blue-600 rounded-md">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            {openingHours.map((hour, index) => (
                                <div key={hour.day}>
                                    <div className="flex items-center mb-2">
                                        <Checkbox
                                            id={hour.day}
                                            checked={hour.isOpen}
                                            onCheckedChange={(checked) => handleOpeningHoursChange(index, 'isOpen', !!checked)}
                                            className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                        />
                                        <Label htmlFor={hour.day} className="text-sm font-normal ml-2 text-white/90">
                                            {hour.day}
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="time"
                                            className="w-full bg-blue-900/50 border-blue-700 text-white"
                                            value={hour.opens}
                                            onChange={(e) => handleOpeningHoursChange(index, 'opens', e.target.value)}
                                            disabled={!hour.isOpen}
                                        />
                                        <Input
                                            type="time"
                                            className="w-full bg-blue-900/50 border-blue-700 text-white"
                                            value={hour.closes}
                                            onChange={(e) => handleOpeningHoursChange(index, 'closes', e.target.value)}
                                            disabled={!hour.isOpen}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/90">Localização no Mapa</Label>
                    <p className="text-sm text-white/80">Clique no mapa para marcar a localização exata do seu negócio.</p>
                    <MapContainer center={[-5.0892, -42.8028]} zoom={13} style={{ height: '300px', width: '100%', zIndex: 0 }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
                      <LocationMarker position={position} setPosition={setPosition} />
                      <CenterMapToUserLocation setPosition={setPosition} />
                    </MapContainer>
                    {errors.map && <p className="text-sm text-destructive mt-1">{errors.map}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-white/90">Site/Instagram (opcional)</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                      <Input id="website" type="url" placeholder="www.seusite.com.br" className="pl-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60" onChange={handleChange} value={formData.website} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white/90">Descrição do negócio</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 text-white/60 w-4 h-4" />
                      <Textarea id="description" placeholder="Descreva seu negócio, produtos e serviços oferecidos..." className="pl-10 min-h-[100px] bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60" required onChange={handleChange} value={formData.description}/>
                    </div>
                  </div>
                </div>

                {/* DADOS DE ACESSO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-blue-600 pb-2">Dados de Acesso</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white/90">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="Mínimo 6 caracteres" className="pl-10 pr-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60" required onChange={handleChange} value={formData.password} aria-invalid={!!errors.password}/>
                        <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="w-4 h-4 text-white/60" /> : <Eye className="w-4 h-4 text-white/60" />}
                        </Button>
                      </div>
                      {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white/90">Confirmar senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                        <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirme sua senha" className="pl-10 pr-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60" required onChange={handleChange} value={formData.confirmPassword} aria-invalid={!!errors.confirmPassword}/>
                        <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <EyeOff className="w-4 h-4 text-white/60" /> : <Eye className="w-4 h-4 text-white/60" />}
                        </Button>
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" onCheckedChange={(checked: CheckedState) => setFormData(prev => ({ ...prev, terms: !!checked }))} checked={formData.terms} className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                  <Label htmlFor="terms" className="text-sm text-white/80 leading-relaxed">
                    Concordo com os{" "}
                    <Link href="/termos-de-uso" className="text-yellow-400 hover:underline">Termos de Uso</Link> e <Link href="/politica-de-privacidade" className="text-yellow-400 hover:underline">Política de Privacidade</Link>.
                  </Label>
                </div>


                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loading ? 'Cadastrando...' : 'Cadastrar Estabelecimento'}
                </Button>
                {errors.form && (
                  <div className="flex items-center p-3 text-sm text-red-200 bg-red-900/30 border border-red-500/50 rounded-lg mt-4">
                      <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{errors.form}</span>
                  </div>
                )}
              </form>

              <div className="text-center">
                <p className="text-sm text-white/80">
                  Já tem uma conta empresarial?{" "}
                  <Link href="/empresario/login" className="text-yellow-400 hover:underline font-medium">Faça login aqui</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}