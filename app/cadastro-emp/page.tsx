"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Store, Loader2, Mail, Lock, User, Phone, MapPin, Globe, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { Header } from "@/components/navigation/header"

const MapWithNoSSR = dynamic(() => import("./MapRegistrationComponent"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-white/5 border border-[#00CCFF]/30 text-[#00CCFF] animate-pulse flex items-center justify-center">A carregar mapa...</div>
});

export default function EmpresarioCadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<{lat: number, lng: number} | null>(null);
  const [formData, setFormData] = useState({
    ownerName: '', email: '', businessName: '', category: '', 
    address: '', password: '', confirmPassword: '', terms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) return alert("Marque a localização no mapa");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, "businesses", userCredential.user.uid), {
        ...formData,
        location: { latitude: position.lat, longitude: position.lng },
        createdAt: new Date()
      });
      router.push('/empresario/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-2xl py-8">
        <Card className="bg-[#002240] border-[#00CCFF]/20 text-white">
          <CardHeader><CardTitle className="text-white text-2xl">Registo de Estabelecimento</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="E-mail" onChange={e => setFormData({...formData, email: e.target.value})} className="bg-white/5 border-[#00CCFF]/30 text-white focus-visible:ring-[#00CCFF]" />
              <Input type="password" placeholder="Senha" onChange={e => setFormData({...formData, password: e.target.value})} className="bg-white/5 border-[#00CCFF]/30 text-white focus-visible:ring-[#00CCFF]" />
              <div className="pt-2">
                <MapWithNoSSR position={position} setPosition={setPosition} />
              </div>
              <Button type="submit" className="w-full bg-[#00CCFF] text-[#002240] hover:bg-[#00CCFF]/80 mt-4" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Registar Estabelecimento"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}