// app/empresario/perfil/page.tsx
"use client"

import React, { useState, useEffect, useRef } from "react"
import { Save, Edit, Loader2, Eye, MapPin, Phone, Clock, Globe, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { uploadImage } from '@/lib/cloudinary'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L, { LatLng } from 'leaflet'
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

// ... (Cole aqui toda a lógica que já estava no seu arquivo de perfil: 
// a configuração do ícone do Leaflet, os tipos, os componentes do mapa, etc.
// A lógica não muda, apenas a aparência (JSX) no final.)

// A partir daqui, cole o código como está
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
}

type BusinessData = {
    businessName: string; category: string; description: string; businessPhone: string;
    whatsapp: string; website: string; address: string; hours: string; images?: string[];
    location?: { latitude: number; longitude: number; }; isPublic?: boolean;
};

function LocationMarker({ position, setPosition, isEditing }: { position: LatLng | null, setPosition: React.Dispatch<React.SetStateAction<LatLng | null>>, isEditing: boolean }) {
    const map = useMapEvents({ click(e) { if (isEditing) { setPosition(e.latlng); map.flyTo(e.latlng, map.getZoom()); } }, });
    return position === null ? null : (<Marker position={position}></Marker>);
}
function SetInitialView({ position }: { position: LatLng | null }) {
    const map = useMap();
    useEffect(() => { if (position) { map.setView(position, 16); } }, [position, map]);
    return null;
}

const daysOfWeek = [
    { id: 'Segunda-feira', label: 'Segunda-feira' }, { id: 'Terça-feira', label: 'Terça-feira' },
    { id: 'Quarta-feira', label: 'Quarta-feira' }, { id: 'Quinta-feira', label: 'Quinta-feira' },
    { id: 'Sexta-feira', label: 'Sexta-feira' }, { id: 'Sábado', label: 'Sábado' }, { id: 'Domingo', label: 'Domingo' },
];

export default function EmpresarioPerfilPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<BusinessData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [position, setPosition] = useState<LatLng | null>(null);
    const [openingHours, setOpeningHours] = useState(
        daysOfWeek.map(day => ({ day: day.label, opens: '08:00', closes: '18:00', isOpen: false }))
    );
     
    const parseHoursFromString = (hoursString: string) => {
        if (!hoursString || hoursString === "Não informado") return;
        const newOpeningHours = daysOfWeek.map(day => ({ day: day.label, opens: '08:00', closes: '18:00', isOpen: false }));
        const parts = hoursString.split('; ');
        parts.forEach(part => {
            const [dayPart, timePart] = part.split(': ');
            if (dayPart && timePart) {
                const [opens, closes] = timePart.trim().split(' - ');
                const dayIndex = newOpeningHours.findIndex(d => d.day.startsWith(dayPart.trim()));
                if (dayIndex > -1) { newOpeningHours[dayIndex] = { ...newOpeningHours[dayIndex], opens, closes, isOpen: true }; }
            }
        });
        setOpeningHours(newOpeningHours);
    };
     
    const formatHoursToString = (hours: typeof openingHours) => {
        if (!hours.some(h => h.isOpen)) return "Não informado";
        return hours.filter(h => h.isOpen).map(h => `${h.day.substring(0,3)}: ${h.opens} - ${h.closes}`).join('; ');
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const docRef = doc(db, "businesses", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as BusinessData;
                    if (data.isPublic === undefined) { data.isPublic = true; }
                    setFormData(data);
                    if (data.location) { setPosition(new L.LatLng(data.location.latitude, data.location.longitude)); }
                    if (data.hours) { parseHoursFromString(data.hours); }
                }
            } else { window.location.href = '/login'; }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => prevData ? { ...prevData, [id]: value } : null);
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prevData => prevData ? { ...prevData, category: value } : null);
    };

    const handleOpeningHoursChange = (index: number, field: string, value: string | boolean) => {
        const newHours = [...openingHours]; (newHours[index] as any)[field] = value; setOpeningHours(newHours);
    };

    const handleVisibilityChange = async (isPublic: boolean) => {
        if (!user) return;
        setFormData(prevData => prevData ? { ...prevData, isPublic } : null);
        const docRef = doc(db, "businesses", user.uid);
        try { await updateDoc(docRef, { isPublic }); } catch (error) { console.error("Erro...", error); setFormData(prevData => prevData ? { ...prevData, isPublic: !isPublic } : null); }
    };

    const handleSaveChanges = async () => {
        if (!user || !formData) return; setSaving(true);
        const docRef = doc(db, "businesses", user.uid);
        try {
            const dataToSave: Partial<BusinessData> = { ...formData, hours: formatHoursToString(openingHours), };
            if (position) { dataToSave.location = { latitude: position.lat, longitude: position.lng }; }
            await updateDoc(docRef, dataToSave as any); setIsEditing(false);
        } catch (error) { console.error("Erro...", error); } finally { setSaving(false); }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if ((formData?.images?.length || 0) >= 5 || !e.target.files || e.target.files.length === 0 || !user) return;
        const file = e.target.files[0]; setUploading(true);
        try {
            const downloadURL = await uploadImage(file);
            const updatedImages = [...(formData?.images || []), downloadURL];
            setFormData(prevData => prevData ? { ...prevData, images: updatedImages } : null);
            const docRef = doc(db, "businesses", user.uid); await updateDoc(docRef, { images: updatedImages });
        } catch (error) { console.error("Erro...", error); } finally { setUploading(false); }
    };

    const handleImageDelete = async (imageUrlToDelete: string) => {
        if (!user || !window.confirm("Tem certeza?")) return;
        try {
            const updatedImages = formData?.images?.filter(url => url !== imageUrlToDelete) || [];
            setFormData(prevData => prevData ? { ...prevData, images: updatedImages } : null);
            const docRef = doc(db, "businesses", user.uid); await updateDoc(docRef, { images: updatedImages });
        } catch (error) { console.error("Erro...", error); }
    }

    if (loading) { return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div> }
    if (!formData) { return <div className="flex h-full items-center justify-center"><p>Não foi possível carregar os dados.</p></div> }

    // O JSX ABAIXO FOI ALTERADO PARA O FUNDO AZUL
    return (
        <div className="space-y-6">
            <div className="flex justify-end items-center">
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="bg-blue-600 text-white border-blue-400 hover:bg-blue-700">
                        <Edit className="w-4 h-4 mr-2" />{isEditing ? "Cancelar" : "Editar Perfil"}
                    </Button>
                    {isEditing && (
                        <Button onClick={handleSaveChanges} disabled={saving} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Salvar Alterações
                        </Button>
                    )}
                </div>
            </div>

            <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white rounded-2xl">
                <CardHeader><CardTitle className="text-white flex items-center gap-2"><Eye className="w-5 h-5" />Visibilidade do Perfil</CardTitle><CardDescription className="text-white/80">Controle se seu negócio aparece nas buscas.</CardDescription></CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 bg-blue-900/50 rounded-lg">
                        <Label htmlFor="visibility-switch" className="flex flex-col space-y-1">
                            <span className="font-medium text-white/90">Perfil Público</span>
                            <span className="font-normal text-sm text-white/70">{formData.isPublic ? "Seu perfil está visível." : "Seu perfil está oculto."}</span>
                        </Label>
                        <Switch id="visibility-switch" checked={formData.isPublic} onCheckedChange={handleVisibilityChange} />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white rounded-2xl">
                <CardHeader><CardTitle className="text-white">Fotos do Estabelecimento</CardTitle><CardDescription className="text-white/80">Adicione até 5 fotos.</CardDescription></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        {formData.images?.map((url, index) => (
                            <div key={index} className="aspect-square rounded-lg relative group">
                                <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                                {isEditing && (<Button size="sm" variant="destructive" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-8 w-8 p-0" onClick={() => handleImageDelete(url)}><Trash2 className="w-4 h-4" /></Button>)}
                            </div>
                        ))}
                        {isEditing && (formData.images?.length || 0) < 5 && (
                            <div className="aspect-square border-2 border-dashed border-white/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400" onClick={() => fileInputRef.current?.click()}>
                                {uploading ? (<Loader2 className="w-6 h-6 animate-spin text-blue-400" />) : (<div className="text-center"><Plus className="w-6 h-6 text-white/60 mx-auto mb-2" /><p className="text-xs text-white/60">Adicionar Foto</p></div>)}
                            </div>
                        )}
                    </div>
                    <Input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/png, image/jpeg, image/webp" disabled={uploading} />
                </CardContent>
            </Card>

            <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white rounded-2xl">
                <CardHeader><CardTitle className="text-white">Informações Básicas</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="businessName" className="text-white/90">Nome</Label><Input id="businessName" value={formData?.businessName ?? ''} onChange={handleInputChange} disabled={!isEditing} className="bg-blue-900/50 border-blue-700 text-white disabled:opacity-70"/></div>
                        <div className="space-y-2"><Label htmlFor="category" className="text-white/90">Categoria</Label><Select value={formData?.category ?? ''} onValueChange={handleCategoryChange} disabled={!isEditing}><SelectTrigger className="bg-blue-900/50 border-blue-700 text-white disabled:opacity-70"><SelectValue/></SelectTrigger><SelectContent className="bg-blue-900 text-white border-blue-700"><SelectItem value="Outro">Outro</SelectItem></SelectContent></Select></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="description" className="text-white/90">Descrição</Label><Textarea id="description" value={formData?.description ?? ''} onChange={handleInputChange} disabled={!isEditing} className="bg-blue-900/50 border-blue-700 text-white disabled:opacity-70"/></div>
                </CardContent>
            </Card>
            
            <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white rounded-2xl">
                <CardHeader><CardTitle className="text-white">Informações de Contato</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="businessPhone" className="text-white/90">Telefone</Label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" /><Input id="businessPhone" value={formData?.businessPhone ?? ''} onChange={handleInputChange} disabled={!isEditing} className="pl-10 bg-blue-900/50 border-blue-700 text-white disabled:opacity-70"/></div></div>
                        <div className="space-y-2"><Label htmlFor="whatsapp" className="text-white/90">WhatsApp</Label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" /><Input id="whatsapp" value={formData?.whatsapp ?? ''} onChange={handleInputChange} disabled={!isEditing} className="pl-10 bg-blue-900/50 border-blue-700 text-white disabled:opacity-70"/></div></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="website" className="text-white/90">Site/Instagram</Label><div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" /><Input id="website" value={formData?.website ?? ''} onChange={handleInputChange} disabled={!isEditing} className="pl-10 bg-blue-900/50 border-blue-700 text-white disabled:opacity-70"/></div></div>
                </CardContent>
            </Card>

            <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white rounded-2xl">
                <CardHeader><CardTitle className="text-white">Localização e Horários</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="address" className="text-white/90">Endereço</Label><div className="relative"><MapPin className="absolute left-3 top-3 text-white/60 w-4 h-4" /><Textarea id="address" value={formData?.address ?? ''} onChange={handleInputChange} disabled={!isEditing} className="pl-10 bg-blue-900/50 border-blue-700 text-white disabled:opacity-70"/></div></div>
                    <div className="space-y-2">
                        <Label className="text-white/90">Horário de Funcionamento</Label>
                        {isEditing ? (
                            <div className="p-4 border border-blue-600 rounded-md">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                    {openingHours.map((hour, index) => (
                                        <div key={hour.day}>
                                            <div className="flex items-center mb-2">
                                                <Checkbox id={`day-${index}`} checked={hour.isOpen} onCheckedChange={(checked) => handleOpeningHoursChange(index, 'isOpen', !!checked)} className="border-white/50 data-[state=checked]:bg-blue-600"/>
                                                <Label htmlFor={`day-${index}`} className="text-sm font-normal ml-2 text-white/90">{hour.day}</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input type="time" className="w-full bg-blue-900/50 border-blue-700 text-white" value={hour.opens} onChange={(e) => handleOpeningHoursChange(index, 'opens', e.target.value)} disabled={!hour.isOpen} />
                                                <Input type="time" className="w-full bg-blue-900/50 border-blue-700 text-white" value={hour.closes} onChange={(e) => handleOpeningHoursChange(index, 'closes', e.target.value)} disabled={!hour.isOpen} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : ( <Input id="hours" value={formData?.hours ?? ''} disabled className="bg-blue-900/50 border-blue-700 text-white disabled:opacity-70"/> )}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white/90">Localização no Mapa</Label>
                        {isEditing && <p className="text-sm text-white/80">Clique no mapa para mover o marcador.</p>}
                        <div className="aspect-video rounded-lg overflow-hidden">
                            <MapContainer center={position || [-5.0892, -42.8028]} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={isEditing} dragging={isEditing} touchZoom={isEditing} doubleClickZoom={isEditing}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
                                <LocationMarker position={position} setPosition={setPosition} isEditing={isEditing} />
                                <SetInitialView position={position} />
                            </MapContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}