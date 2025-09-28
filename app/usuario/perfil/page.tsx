// app/usuario/perfil/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, MapPin, Calendar, Camera, Save, ArrowLeft, Edit3, Shield, Loader2 } from "lucide-react"
import Link from "next/link"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { uploadImage } from "@/lib/cloudinary"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

type UserData = {
    name: string;
    email: string;
    phone: string;
    bio?: string;
    address?: string;
    birthDate?: string;
    avatar?: string;
    createdAt: Timestamp;
};

const stats = {
    totalFavorites: 12,
    totalReviews: 8,
    totalComments: 15,
    helpfulVotes: 23,
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
            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setFormData(docSnap.data() as UserData);
            }
        } else {
            window.location.href = '/login';
        }
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            alert("Avatar atualizado com sucesso!");
        }
    } catch (error) {
        console.error("Erro no upload do avatar:", error);
        alert("Falha no upload do avatar.");
    } finally {
        setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !formData) return;
    const docRef = doc(db, "users", user.uid);
    try {
        await updateDoc(docRef, formData);
        alert("Perfil salvo com sucesso!");
        setIsEditing(false);
    } catch (error) {
        console.error("Erro ao salvar perfil:", error);
        alert("Erro ao salvar as alterações.");
    }
  }

  const getInitials = (name: string = "") => {
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  }

  if (loading || !formData) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.avatar} alt={formData.name} />
                <AvatarFallback className="text-xl">{getInitials(formData.name)}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </Button>
              )}
               <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/png, image/jpeg"
                />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">Meu Perfil</h1>
              <p className="text-muted-foreground">Gerencie suas informações e preferências</p>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                  <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Salvar</Button>
                </div>
              )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white"><User className="h-5 w-5" />Informações Pessoais</CardTitle>
                <CardDescription className="text-white/80">Suas informações básicas e de contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/90">Nome Completo</Label>
                    <Input id="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} className="bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60 disabled:opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/90">E-mail</Label>
                    <Input id="email" type="email" value={formData.email} disabled={true} className="bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60 disabled:opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white/90">Telefone</Label>
                    <Input id="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} className="bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60 disabled:opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-white/90">Data de Nascimento</Label>
                    <Input id="birthDate" type="date" value={formData.birthDate || ''} onChange={handleInputChange} disabled={!isEditing} className="bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60 disabled:opacity-70" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white/90">Endereço</Label>
                  <Input id="address" value={formData.address || ''} onChange={handleInputChange} disabled={!isEditing} className="bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60 disabled:opacity-70" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white/90">Sobre Mim</Label>
                  <Textarea id="bio" value={formData.bio || ''} onChange={handleInputChange} disabled={!isEditing} rows={4} placeholder="Conte um pouco sobre você..." className="bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60 disabled:opacity-70" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
              <CardHeader><CardTitle className="text-lg text-white">Ações Rápidas</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white"><Link href="/usuario/avaliacoes"><Edit3 className="h-4 w-4 mr-2" />Minhas Avaliações</Link></Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white"><Link href="/usuario/comentarios"><Mail className="h-4 w-4 mr-2" />Meus Comentários</Link></Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white"><Link href="/favoritos"><MapPin className="h-4 w-4 mr-2" />Locais Favoritos</Link></Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white"><Link href="/usuario/configuracoes"><Shield className="h-4 w-4 mr-2" />Configurações</Link></Button>
              </CardContent>
            </Card>
            <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
              <CardHeader><CardTitle className="text-lg flex items-center gap-2 text-white"><Shield className="h-5 w-5" />Privacidade</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-white/80 mb-4">Suas informações pessoais são mantidas seguras e privadas. Apenas seu nome e foto de perfil são visíveis publicamente em suas avaliações.</p></CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}