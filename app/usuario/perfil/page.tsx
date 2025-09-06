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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'

// Tipos para os dados do usuário
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

// Dados simulados para estatísticas (serão substituídos no futuro)
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
    const storage = getStorage();
    const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);

    setUploading(true);
    try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Atualiza o estado local e o Firestore
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
          <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/usuario/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
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
              <p className="text-muted-foreground mb-4">Gerencie suas informações pessoais e preferências</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Membro desde{" "}
                  {formData.createdAt.toDate().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </Badge>
                <Badge variant="secondary">{stats.helpfulVotes} votos úteis</Badge>
              </div>
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Informações Pessoais</CardTitle>
                <CardDescription>Suas informações básicas e de contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" value={formData.email} disabled={true} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input id="birthDate" type="date" value={formData.birthDate || ''} onChange={handleInputChange} disabled={!isEditing} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" value={formData.address || ''} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Sobre Mim</Label>
                  <Textarea id="bio" value={formData.bio || ''} onChange={handleInputChange} disabled={!isEditing} rows={4} placeholder="Conte um pouco sobre você..." />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Ações Rápidas</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start bg-transparent"><Link href="/usuario/avaliacoes"><Edit3 className="h-4 w-4 mr-2" />Minhas Avaliações</Link></Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent"><Link href="/usuario/comentarios"><Mail className="h-4 w-4 mr-2" />Meus Comentários</Link></Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent"><Link href="/favoritos"><MapPin className="h-4 w-4 mr-2" />Locais Favoritos</Link></Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent"><Link href="/usuario/configuracoes"><Shield className="h-4 w-4 mr-2" />Configurações</Link></Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Shield className="h-5 w-5" />Privacidade</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground mb-4">Suas informações pessoais são mantidas seguras e privadas. Apenas seu nome e foto de perfil são visíveis publicamente em suas avaliações.</p></CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
