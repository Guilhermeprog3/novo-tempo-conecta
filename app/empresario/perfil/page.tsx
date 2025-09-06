"use client"

import React, { useState, useEffect, useRef } from "react"
import { ArrowLeft, Save, Upload, MapPin, Phone, Clock, Globe, Camera, Trash2, Edit, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { auth, db } from '@/lib/firebase'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

type BusinessData = {
    businessName: string;
    category: string;
    description: string;
    businessPhone: string;
    whatsapp: string;
    website: string;
    address: string;
    hours: string;
    images?: string[]; // Array de URLs das imagens
};

export default function EmpresarioPerfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
            const docRef = doc(db, "businesses", currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setFormData(docSnap.data() as BusinessData);
            } else {
                console.log("Nenhum documento de negócio encontrado!");
            }
        } else {
            window.location.href = '/empresario/login';
        }
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      if (formData) {
          setFormData({ ...formData, [id]: value });
      }
  };

  const handleCategoryChange = (value: string) => {
      if (formData) {
          setFormData({ ...formData, category: value });
      }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    const file = e.target.files[0];
    const storage = getStorage();
    const fileName = `image_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `businesses/${user.uid}/${fileName}`);

    setUploading(true);
    try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        const updatedImages = [...(formData?.images || []), downloadURL];
        setFormData(prevData => prevData ? { ...prevData, images: updatedImages } : null);
        
        // Salva a nova imagem no Firestore imediatamente
        const docRef = doc(db, "businesses", user.uid);
        await updateDoc(docRef, { images: updatedImages });

    } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        alert("Falha no upload da imagem.");
    } finally {
        setUploading(false);
    }
  };

  const handleImageDelete = async (imageUrlToDelete: string) => {
    if (!user || !window.confirm("Tem certeza que deseja excluir esta imagem?")) return;
    
    const storage = getStorage();
    const imageRef = ref(storage, imageUrlToDelete);

    try {
        await deleteObject(imageRef);
        
        const updatedImages = formData?.images?.filter(url => url !== imageUrlToDelete) || [];
        setFormData(prevData => prevData ? { ...prevData, images: updatedImages } : null);

        const docRef = doc(db, "businesses", user.uid);
        await updateDoc(docRef, { images: updatedImages });
        alert("Imagem excluída com sucesso!");
    } catch (error) {
        console.error("Erro ao excluir a imagem:", error);
        alert("Falha ao excluir a imagem.");
    }
  }

  const handleSaveChanges = async () => {
    if (!user || !formData) return;

    const docRef = doc(db, "businesses", user.uid);
    try {
        await updateDoc(docRef, {
            ...formData
        });
        alert("Perfil atualizado com sucesso!");
        setIsEditing(false);
    } catch (error) {
        console.error("Erro ao atualizar o perfil:", error);
        alert("Ocorreu um erro ao salvar as alterações.");
    }
  };

  if (loading || !formData) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/empresario/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Editar Perfil</h1>
                <p className="text-sm text-muted-foreground">Gerencie as informações do seu estabelecimento</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Cancelar" : "Editar"}
              </Button>
              {isEditing && (
                <Button onClick={handleSaveChanges}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fotos do Estabelecimento</CardTitle>
              <CardDescription>Adicione fotos atrativas para mostrar seu negócio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {formData.images?.map((url, index) => (
                    <div key={index} className="aspect-square rounded-lg relative group">
                        <img src={url} alt={`Foto ${index + 1} do estabelecimento`} className="w-full h-full object-cover rounded-lg" />
                        {isEditing && (
                            <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                            onClick={() => handleImageDelete(url)}
                            >
                            <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}

                {isEditing && (
                  <div 
                    className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    ) : (
                        <div className="text-center">
                            <Plus className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">Adicionar Foto</p>
                        </div>
                    )}
                  </div>
                )}
              </div>
                <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    disabled={uploading}
                />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados principais do seu estabelecimento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nome do estabelecimento</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange} disabled={!isEditing}>
                    <SelectTrigger className={!isEditing ? "bg-muted" : ""}>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Restaurantes e Alimentação">Restaurantes e Alimentação</SelectItem>
                      <SelectItem value="Comércio e Varejo">Comércio e Varejo</SelectItem>
                      <SelectItem value="Serviços Técnicos">Serviços Técnicos</SelectItem>
                      <SelectItem value="Saúde e Bem-estar">Saúde e Bem-estar</SelectItem>
                      <SelectItem value="Beleza e Estética">Beleza e Estética</SelectItem>
                      <SelectItem value="Educação e Cursos">Educação e Cursos</SelectItem>
                      <SelectItem value="Automotivo">Automotivo</SelectItem>
                      <SelectItem value="Casa e Construção">Casa e Construção</SelectItem>
                      <SelectItem value="Lazer">Cafés e Lazer</SelectItem>
                      <SelectItem value="Moda e Vestuário">Moda e Vestuário</SelectItem>
                      <SelectItem value="Esportes">Esportes e Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição do negócio</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`min-h-[100px] ${!isEditing ? "bg-muted" : ""}`}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>Como os clientes podem entrar em contato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Telefone principal</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="businessPhone" value={formData.businessPhone} onChange={handleInputChange} disabled={!isEditing} className={`pl-10 ${!isEditing ? "bg-muted" : ""}`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="whatsapp" value={formData.whatsapp} onChange={handleInputChange} disabled={!isEditing} className={`pl-10 ${!isEditing ? "bg-muted" : ""}`} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Site/Instagram</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input id="website" value={formData.website} onChange={handleInputChange} disabled={!isEditing} className={`pl-10 ${!isEditing ? "bg-muted" : ""}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localização e Horários</CardTitle>
              <CardDescription>Onde encontrar e quando funciona</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço completo</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                  <Textarea id="address" value={formData.address} onChange={handleInputChange} disabled={!isEditing} className={`pl-10 min-h-[80px] ${!isEditing ? "bg-muted" : ""}`} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Horário de funcionamento</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input id="hours" value={formData.hours} onChange={handleInputChange} disabled={!isEditing} className={`pl-10 ${!isEditing ? "bg-muted" : ""}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

