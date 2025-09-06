// app/empresario/cadastro/page.tsx
"use client"

import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Store, MapPin, Clock, Globe, FileText } from "lucide-react"
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

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

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

// CORREÇÃO APLICADA AQUI
type CenterMapProps = {
    setPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
}

// Componente para centralizar o mapa na localização do usuário
function CenterMapToUserLocation({ setPosition }: CenterMapProps) {
    const map = useMap();
  
    useEffect(() => {
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
    }, [map, setPosition]);
  
    return null;
}
  

export default function EmpresarioCadastroPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [position, setPosition] = useState<LatLng | null>(null);
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    phone: '',
    whatsapp: '',
    businessName: '',
    category: '',
    businessPhone: '',
    address: '',
    hours: '',
    website: '',
    description: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    if (!position) {
      alert("Por favor, marque a localização do seu negócio no mapa.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "businesses", user.uid), {
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        businessName: formData.businessName,
        category: formData.category,
        businessPhone: formData.businessPhone,
        address: formData.address,
        hours: formData.hours,
        website: formData.website,
        description: formData.description,
        location: {
          latitude: position.lat,
          longitude: position.lng,
        },
        ownerId: user.uid,
      });

      alert("Negócio cadastrado com sucesso!");
      window.location.href = '/empresario/dashboard';

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      if (error instanceof Error) {
        alert("Erro ao cadastrar: " + error.message);
      } else {
        alert("Ocorreu um erro desconhecido ao cadastrar.");
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Cadastrar Estabelecimento</CardTitle>
            <CardDescription>
              Registre seu negócio na plataforma e conecte-se com milhares de moradores do Novo Tempo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Dados do Responsável</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="ownerName" type="text" placeholder="Seu nome completo" className="pl-10" required onChange={handleChange} value={formData.ownerName}/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="email" type="email" placeholder="seu@email.com" className="pl-10" required onChange={handleChange} value={formData.email}/>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="phone" type="tel" placeholder="(11) 99999-9999" className="pl-10" required onChange={handleChange} value={formData.phone}/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="whatsapp" type="tel" placeholder="(11) 99999-9999" className="pl-10" onChange={handleChange} value={formData.whatsapp}/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Dados do Estabelecimento</h3>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nome do estabelecimento</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="businessName" type="text" placeholder="Nome do seu negócio" className="pl-10" required onChange={handleChange} value={formData.businessName}/>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select onValueChange={handleCategoryChange} value={formData.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurante">Restaurantes e Alimentação</SelectItem>
                        <SelectItem value="comercio">Comércio e Varejo</SelectItem>
                        <SelectItem value="servicos">Serviços Técnicos</SelectItem>
                        <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                        <SelectItem value="beleza">Beleza e Estética</SelectItem>
                        <SelectItem value="educacao">Educação e Cursos</SelectItem>
                        <SelectItem value="automotivo">Automotivo</SelectItem>
                        <SelectItem value="casa">Casa e Construção</SelectItem>
                        <SelectItem value="lazer">Cafés e Lazer</SelectItem>
                        <SelectItem value="moda">Moda e Vestuário</SelectItem>
                        <SelectItem value="esportes">Esportes e Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Telefone comercial</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="businessPhone" type="tel" placeholder="(11) 3333-3333" className="pl-10" required onChange={handleChange} value={formData.businessPhone} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço completo</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                    <Textarea id="address" placeholder="Rua, número, complemento, bairro" className="pl-10 min-h-[80px]" required onChange={handleChange} value={formData.address}/>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Localização no Mapa</Label>
                  <p className="text-sm text-muted-foreground">Clique no mapa para marcar a localização exata do seu negócio.</p>
                  <MapContainer center={[-5.0892, -42.8028]} zoom={13} style={{ height: '300px', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
                    <LocationMarker position={position} setPosition={setPosition} />
                    <CenterMapToUserLocation setPosition={setPosition} />
                  </MapContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Horário de funcionamento</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="hours" type="text" placeholder="Seg-Sex: 8h-18h, Sáb: 8h-12h" className="pl-10" required onChange={handleChange} value={formData.hours}/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Site/Instagram (opcional)</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="website" type="url" placeholder="www.seusite.com.br" className="pl-10" onChange={handleChange} value={formData.website} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do negócio</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                    <Textarea id="description" placeholder="Descreva seu negócio, produtos e serviços oferecidos..." className="pl-10 min-h-[100px]" required onChange={handleChange} value={formData.description}/>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Dados de Acesso</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres" className="pl-10 pr-10" required onChange={handleChange} value={formData.password}/>
                      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirme sua senha" className="pl-10 pr-10" required onChange={handleChange} value={formData.confirmPassword}/>
                      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="terms" onCheckedChange={(checked: CheckedState) => setFormData(prev => ({ ...prev, terms: !!checked }))} checked={formData.terms} />
                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  Concordo com os{" "}
                  <Link href="/termos-de-uso" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>
                  ,{" "}
                  <Link href="/politica-de-privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>{" "}
                  e autorizo a publicação das informações do meu estabelecimento na plataforma.
                </Label>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Cadastrar Estabelecimento
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta empresarial?{" "}
                <Link href="/empresario/login" className="text-primary hover:underline font-medium">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}