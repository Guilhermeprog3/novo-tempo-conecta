"use client"

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Search, MapPin, Star, Filter, ChevronDown, X, Loader2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { LatLng } from 'leaflet'

// Importação dinâmica do componente de mapa para evitar erro "window is not defined"
const MapComponent = dynamic(
  () => import("./MapComponent"),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-[#00CCFF]" />
        <span className="ml-2">A carregar mapa...</span>
      </div>
    ) 
  }
)

type Business = {
  id: string;
  businessName: string;
  address: string;
  category: string;
  rating?: number;
  isOpen?: boolean;
  isPublic?: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
};

export default function MapaPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [minRating, setMinRating] = useState([0])
  const [sortBy, setSortBy] = useState("relevancia")
  const [isOpen, setIsOpen] = useState("todos")
  
  const [allEstablishments, setAllEstablishments] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);

  const categories = [
    { value: "restaurante", label: "Restaurante" },
    { value: "comercio", label: "Comércio" },
    { value: "servicos", label: "Serviços" },
    { value: "saude", label: "Saúde" },
    { value: "automotivo", label: "Automotivo" },
    { value: "casa", label: "Casa" },
  ];

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const businessesRef = collection(db, "businesses");
        const q = query(businessesRef, where("isPublic", "==", true));
        const querySnapshot = await getDocs(q);
        
        const businessesList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Business[];

        setAllEstablishments(businessesList);
      } catch (error) {
          console.error("Erro ao procurar empresas: ", error);
      } finally {
          setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const filteredEstablishments = allEstablishments.filter((establishment) => {
    const matchesSearch =
      (establishment.businessName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (establishment.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(establishment.category)
    const matchesRating = !establishment.rating || establishment.rating >= minRating[0]
    const matchesOpenStatus =
      isOpen === "todos" ||
      (isOpen === "aberto" && establishment.isOpen) ||
      (isOpen === "fechado" && !establishment.isOpen)

    return matchesSearch && matchesCategory && matchesRating && matchesOpenStatus
  })

  const sortedEstablishments = [...filteredEstablishments].sort((a, b) => {
    switch (sortBy) {
      case "rating": return (b.rating || 0) - (a.rating || 0)
      case "name": return a.businessName.localeCompare(b.businessName)
      default: return 0
    }
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow flex h-[calc(100vh-80px)]">
        <div className="w-full lg:w-1/3 border-r border-[#00CCFF]/20 bg-[#002240] overflow-y-auto text-white">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Mapa Interativo</h2>
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00CCFF] w-4 h-4" />
                <Input
                  placeholder="Buscar..."
                  className="pl-10 bg-white/10 border-[#00CCFF]/30 text-white placeholder:text-white/60 focus-visible:ring-[#00CCFF]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="w-full bg-transparent text-white border-[#00CCFF]/30 hover:bg-[#00CCFF]/10 hover:text-[#00CCFF]" onClick={() => setShowFilters(!showFilters)}>
                Filtros <ChevronDown className="ml-auto w-4 h-4" />
              </Button>
              {showFilters && (
                <Card className="p-4 bg-white/5 border border-[#00CCFF]/20 text-white">
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <div key={cat.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={cat.value} 
                          checked={selectedCategories.includes(cat.value)}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedCategories([...selectedCategories, cat.value])
                            else setSelectedCategories(selectedCategories.filter(c => c !== cat.value))
                          }}
                        />
                        <label htmlFor={cat.value} className="text-sm">{cat.label}</label>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              {loading ? <Loader2 className="animate-spin mx-auto text-[#00CCFF]" /> : sortedEstablishments.map((est) => (
                <Card key={est.id} className="text-white p-4 bg-white/5 border border-[#00CCFF]/10 hover:border-[#00CCFF]/30 transition-colors cursor-pointer">
                  <h4 className="font-bold">{est.businessName}</h4>
                  <p className="text-sm text-[#00CCFF]">{est.address}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 relative hidden lg:block">
          <MapComponent 
            businesses={sortedEstablishments} 
            userPosition={userPosition} 
            setUserPosition={setUserPosition} 
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}