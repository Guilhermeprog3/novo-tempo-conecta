"use client"

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Loader2, Save, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ProfileMapNoSSR = dynamic(() => import("./ProfileMapComponent"), { ssr: false });

export default function EmpresarioPerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [position, setPosition] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, "businesses", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(data);
          if (data.location) setPosition({ lat: data.location.latitude, lng: data.location.longitude });
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    await updateDoc(doc(db, "businesses", auth.currentUser.uid), {
      ...formData,
      location: position ? { latitude: position.lat, longitude: position.lng } : null
    });
    setIsEditing(false);
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Perfil do Negócio</CardTitle>
          <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
            {isEditing ? <Save className="mr-2" /> : <Edit className="mr-2" />}
            {isEditing ? "Guardar" : "Editar"}
          </Button>
        </CardHeader>
        <CardContent>
          <ProfileMapNoSSR position={position} setPosition={setPosition} isEditing={isEditing} />
        </CardContent>
      </Card>
    </div>
  );
}