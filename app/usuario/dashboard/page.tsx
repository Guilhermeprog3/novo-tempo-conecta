"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, MapPin, Camera, Save, Edit3, Shield, Loader2, Star, MessageSquare, ArrowRight, Heart } from "lucide-react"
import Link from "next/link"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { uploadImage } from "@/lib/cloudinary"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Separator } from "@/components/ui/separator"

type UserData = {
    name: string;
    email: string;
    phone: string;
    // Removidos bio e address da interface, mantidos aqui como opcionais caso existam no banco
    bio?: string;
    address?: string;
    birthDate?: string;
    avatar?: string;
    createdAt: Timestamp;
};

export default function UsuarioPerfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [formData, setFormData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
            try {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFormData(docSnap.data() as UserData);
                } else {
                     setFormData({
                        name: currentUser.displayName || "",
                        email: currentUser.email || "",
                        phone: "",
                        createdAt: Timestamp.now()
                    });
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        } else {
            window.location.href = '/login';
        }
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (formData) {
        setFormData(prev => prev ? { ...prev, [id]: value } : null);
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    const file = e.target.files[0];

    setUploading(true);
    try {
        const downloadURL = await uploadImage(file);

        if (formData) {
            const updatedData = { ...formData, avatar: downloadURL };
            setFormData(updatedData);
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, { avatar: downloadURL });
        }
    } catch (error) {
        console.error("Erro no upload do avatar:", error);
    } finally {
        setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !formData) return;
    const docRef = doc(db, "users", user.uid);
    try {
        await updateDoc(docRef, formData);
        setIsEditing(false);
    } catch (error) {
        console.error("Erro ao salvar perfil:", error);
    }
  }

  const getInitials = (name: string = "") => {
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  }

  if (loading || !formData) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <Loader2 className="h-12 w-12 animate-spin text-[#1E3A8A]" />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      
      {/* Header do Perfil */}
      <div className="bg-[#1E3A8A] pb-32 pt-10 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
            <div className="flex justify-between items-center text-white">
                <div>
                    <h1 className="text-3xl font-bold">Meu Perfil</h1>
                    <p className="text-blue-200">Gerencie suas informações pessoais</p>
                </div>
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold shadow-md border-none">
                        <Edit3 className="h-4 w-4 mr-2" /> Editar
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-white hover:bg-white/20">
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md">
                            <Save className="h-4 w-4 mr-2" /> Salvar
                        </Button>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-24 relative z-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* Card de Resumo */}
            <Card className="border-none shadow-md bg-white relative visible">
                <CardContent className="pt-0 px-6 pb-6">
                    <div className="flex flex-col items-center sm:flex-row sm:items-end gap-6 -mt-10 mb-2">
                        <div className="relative group flex-shrink-0">
                            <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-white">
                                <AvatarImage src={formData.avatar} alt={formData.name} className="object-cover" />
                                <AvatarFallback className="text-3xl bg-slate-100 text-[#1E3A8A] font-bold">
                                    {getInitials(formData.name)}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-1 right-1 h-9 w-9 rounded-full shadow-md border-2 border-white bg-yellow-400 hover:bg-yellow-500 text-blue-900"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                            </Button>
                            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/png, image/jpeg" />
                        </div>
                        
                        <div className="flex flex-col items-center sm:items-start flex-1 pb-4">
                            <h2 className="text-2xl font-bold text-slate-900 text-center sm:text-left">{formData.name || "Nome não informado"}</h2>
                            <p className="text-slate-500 flex items-center gap-2 text-sm mt-1">
                                <Mail className="h-3.5 w-3.5 text-yellow-500" /> {formData.email}
                            </p>
                            <div className="mt-3">
                                <Badge variant="secondary" className="bg-blue-50 text-[#1E3A8A] border-blue-100 px-3 py-1">Cidadão</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Card do Formulário (Sem Endereço e Sobre Mim) */}
            <Card className="border border-slate-200 shadow-sm bg-white">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-bold text-[#1E3A8A] flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-medium">Nome Completo</Label>
                    <Input 
                        id="name"
                        name="name"
                        value={formData.name || ''} 
                        onChange={handleInputChange} 
                        disabled={!isEditing} 
                        className="border-slate-200 text-slate-900 focus-visible:ring-[#1E3A8A] focus-visible:border-[#1E3A8A] disabled:opacity-70 disabled:bg-slate-50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">E-mail</Label>
                    <Input 
                        id="email" 
                        value={formData.email || ''} 
                        disabled={true} 
                        className="bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700 font-medium">Telefone</Label>
                    <Input 
                        id="phone" 
                        name="phone"
                        value={formData.phone || ''} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                        placeholder="(00) 00000-0000"
                        className="border-slate-200 text-slate-900 focus-visible:ring-[#1E3A8A] focus-visible:border-[#1E3A8A] disabled:opacity-70 disabled:bg-slate-50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-slate-700 font-medium">Data de Nascimento</Label>
                    <Input 
                        id="birthDate" 
                        name="birthDate"
                        type="date" 
                        value={formData.birthDate || ''} 
                        onChange={handleInputChange} 
                        disabled={!isEditing}
                        className="border-slate-200 text-slate-900 focus-visible:ring-[#1E3A8A] focus-visible:border-[#1E3A8A] disabled:opacity-70 disabled:bg-slate-50" 
                    />
                  </div>
                </div>
                {/* Removidos campos de Endereço e Sobre Mim */}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200">
                  <h3 className="font-bold text-[#1E3A8A]">Acesso Rápido</h3>
              </div>
              <CardContent className="p-2">
                <nav className="flex flex-col space-y-1">
                    <Button asChild variant="ghost" className="justify-start w-full text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 font-medium h-12 bg-blue-50 text-[#1E3A8A]">
                        <Link href="/usuario/dashboard">
                            <Edit3 className="h-5 w-5 mr-3 text-slate-400" />
                            Meu Perfil
                        </Link>
                    </Button>
                    <Separator className="bg-slate-100" />
                    <Button asChild variant="ghost" className="justify-start w-full text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 font-medium h-12">
                        <Link href="/usuario/avaliacoes">
                            <Star className="h-5 w-5 mr-3 text-yellow-500" />
                            Minhas Avaliações
                        </Link>
                    </Button>
                    <Separator className="bg-slate-100" />
                    <Button asChild variant="ghost" className="justify-start w-full text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 font-medium h-12">
                        <Link href="/usuario/favoritos">
                            <Heart className="h-5 w-5 mr-3 text-red-500" />
                            Locais Favoritos
                        </Link>
                    </Button>
                    <Separator className="bg-slate-100" />
                    <Button asChild variant="ghost" className="justify-start w-full text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 font-medium h-12">
                        <Link href="/usuario/configuracoes">
                            <Shield className="h-5 w-5 mr-3 text-slate-400" />
                            Configurações
                        </Link>
                    </Button>
                </nav>
              </CardContent>
            </Card>
            
            <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-700 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-yellow-400 rounded-full blur-2xl opacity-30"></div>
                <h4 className="font-bold text-lg mb-2">Descubra Novos Lugares</h4>
                <p className="text-blue-100 text-sm mb-4">
                    Explore o bairro e encontre os melhores estabelecimentos perto de você.
                </p>
                <Button size="sm" asChild className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 font-bold border-none w-full">
                    <Link href="/busca">Ir para o Mapa <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}