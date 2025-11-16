"use client"

import React, { useState, useEffect } from "react"
import ReactDOMServer from 'react-dom/server';
import { Search, MapPin, Star, Filter, Navigation, X, ChevronDown, Utensils, Store, Wrench, Heart, Car, Home as HomeIcon, Loader2, User as UserIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L, { LatLng } from 'leaflet'
import { db } from "@/lib/firebase"
// CORREÇÃO 1: Importar 'query' e 'where'
import { collection, getDocs, query, where } from "firebase/firestore"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

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

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const getCategoryIcon = (category: string) => {
    let iconComponent;
    let color = "#4B5563";

    switch (category) {
        case "Restaurante":
        case "restaurante":
            iconComponent = <Utensils size={18} color="white" />;
            color = "#F59E0B";
            break;
        case "Comércio":
        case "comercio":
            iconComponent = <Store size={18} color="white" />;
            color = "#3B82F6";
            break;
        case "Serviços":
        case "servicos":
            iconComponent = <Wrench size={18} color="white" />;
            color = "#6B7280";
            break;
        case "Saúde":
        case "saude":
            iconComponent = <Heart size={18} color="white" />;
            color = "#EF4444";
            break;
        case "Automotivo":
        case "automotivo":
            iconComponent = <Car size={18} color="white" />;
            color = "#1F2937";
            break;
        case "Casa":
        case "casa":
            iconComponent = <HomeIcon size={18} color="white" />;
            color = "#10B981";
            break;
        default:
            iconComponent = <MapPin size={18} color="white" />;
            break;
    }

    const iconHtml = ReactDOMServer.renderToString(
        <div style={{ backgroundColor: color, borderRadius: '50%', padding: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
            {iconComponent}
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
    });
};

const userLocationIcon = L.divIcon({
    html: ReactDOMServer.renderToString(
        <div style={{ backgroundColor: '#3B82F6', borderRadius: '50%', width: '20px', height: '20px', border: '3px solid white', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }} />
    ),
    className: 'custom-user-location-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});


function CenterMapToUserLocation({ setUserPosition }: { setUserPosition: React.Dispatch<React.SetStateAction<LatLng | null>> }) {
    const map = useMap();
  
    useEffect(() => {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          const userLatLng = new L.LatLng(latitude, longitude);
          map.flyTo(userLatLng, 15);
          setUserPosition(userLatLng);
        },
        () => {
          console.log("Não foi possível obter a localização do usuário.");
        }
      );
    }, [map, setUserPosition]);
  
    return null;
}

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

  // CORREÇÃO 2: Alterado para objetos com 'value' (minúsculo) e 'label' (formatado)
  const categories = [
    { value: "restaurante", label: "Restaurante" },
    { value: "comercio", label: "Comércio" },
    { value: "servicos", label: "Serviços" },
    { value: "saude", label: "Saúde" },
    { value: "beleza", label: "Beleza" },
    { value: "educacao", label: "Educação" },
    { value: "lazer", label: "Lazer" },
    { value: "automotivo", label: "Automotivo" },
    { value: "casa", label: "Casa" },
    { value: "moda", label: "Moda" },
    { value: "esportes", label: "Esportes" },
  ];

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        // CORREÇÃO 3: Aplicar o filtro 'where("isPublic", "==", true)' na consulta
        const businessesRef = collection(db, "businesses");
        const q = query(businessesRef, where("isPublic", "==", true));
        const querySnapshot = await getDocs(q);
        
        const businessesList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Business[];

        // console.log('DADOS BRUTOS DO FIREBASE (MAPA):', businessesList); // Debug
        
        setAllEstablishments(businessesList);
      } catch (error) {
          console.error("Error fetching businesses: ", error);
      } finally {
          setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);


  const filteredEstablishments = allEstablishments.filter((establishment) => {
    // Correção para campos nulos
    const matchesSearch =
      (establishment.businessName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (establishment.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())

    // Correção para usar 'value' minúsculo
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(establishment.category)
    
    const matchesRating = !establishment.rating || establishment.rating >= minRating[0]

    const matchesOpenStatus =
      isOpen === "todos" ||
      (isOpen === "aberto" && establishment.isOpen) ||
      (isOpen === "fechado" && !establishment.isOpen)

    // O filtro isPublic já foi feito na consulta do Firestore, 
    // então não precisamos mais dele aqui, mas manter não causa problemas.
    const isPublic = establishment.isPublic === true;

    return matchesSearch && matchesCategory && matchesRating && matchesOpenStatus && isPublic
  })

  const sortedEstablishments = [...filteredEstablishments].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "name":
        return a.businessName.localeCompare(b.businessName)
      default:
        return 0
    }
  })

  // CORREÇÃO 4: Usar o 'value' da categoria (minúsculo)
  const handleCategoryChange = (categoryValue: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryValue])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== categoryValue))
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setMinRating([0])
    setSortBy("relevancia")
    setIsOpen("todos")
    setSearchTerm("")
  }

  // console.log('ESTABELECIMENTOS FILTRADOS (MAPA):', sortedEstablishments); // Debug

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow flex h-[calc(100vh-80px)]">
        <div className="w-full lg:w-1/3 border-r bg-card overflow-y-auto bg-gradient-to-r from-[#1E3A8A] to-[#254A9E] text-white">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Mapa Interativo</h2>
              <Badge variant="secondary" className="text-xs">
                {sortedEstablishments.length} encontrados
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                <Input
                  placeholder="Buscar estabelecimentos..."
                  className="pl-10 bg-white/10 text-white placeholder:text-white/60 border-white/30 focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" className="flex-1 justify-start bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                  <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>

                {(selectedCategories.length > 0 || minRating[0] > 0 || isOpen !== "todos") && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-white hover:bg-white/10 hover:text-white">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {showFilters && (
                <Card className="p-4 space-y-4 bg-white/10 border-none">
                   <div>
                    <h4 className="font-medium mb-3 text-white/90">Categorias</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {/* CORREÇÃO 5: Usar 'category.value' e 'category.label' */}
                      {categories.map((category) => (
                        <div key={category.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={category.value} 
                            checked={selectedCategories.includes(category.value)} 
                            onCheckedChange={(checked) => handleCategoryChange(category.value, checked as boolean)} 
                            className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" 
                          />
                          <label htmlFor={category.value} className="text-sm cursor-pointer text-white/90">{category.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator className="bg-white/20"/>
                  <div>
                    <h4 className="font-medium mb-3 text-white/90">Avaliação Mínima</h4>
                    <div className="space-y-2">
                      <Slider value={minRating} onValueChange={setMinRating} max={5} min={0} step={0.5} className="w-full" />
                      <div className="flex items-center justify-between text-xs text-white/70">
                        <span>0</span>
                        <span className="font-medium">{minRating[0]} estrelas</span>
                        <span>5</span>
                      </div>
                    </div>
                  </div>
                   <Separator className="bg-white/20"/>
                  <div>
                    <h4 className="font-medium mb-3 text-white/90">Status</h4>
                    <Select value={isOpen} onValueChange={setIsOpen}>
                      <SelectTrigger className="text-black"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="aberto">Apenas Abertos</SelectItem>
                        <SelectItem value="fechado">Apenas Fechados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : sortedEstablishments.length === 0 ? (
                <Card className="p-6 text-center bg-white/10 border-none">
                  <p className="text-white/80">Nenhum estabelecimento encontrado.</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={clearFilters}>
                    Limpar Filtros
                  </Button>
                </Card>
              ) : (
                sortedEstablishments.map((establishment) => (
                  <Card key={establishment.id} className="cursor-pointer hover:shadow-md transition-shadow bg-background text-foreground">
                     <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                           <div>
                              <CardTitle className="text-base">{establishment.businessName}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                 <MapPin className="w-3 h-3 mr-1" />
                                 {establishment.address}
                              </CardDescription>
                           </div>
                           <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="ml-1 text-xs font-medium">{establishment.rating || 'N/A'}</span>
                           </div>
                        </div>
                     </CardHeader>
                     <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-xs">
                           <Badge variant="secondary" className="text-xs">{categories.find(c => c.value === establishment.category)?.label || establishment.category}</Badge>
                           <div className={`flex items-center ${establishment.isOpen ? "text-green-600" : "text-red-600"}`}>
                              <Clock className="w-3 h-3 mr-1" />
                              {establishment.isOpen ? "Aberto" : "Fechado"}
                           </div>
                        </div>
                     </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 relative hidden lg:block">
            <MapContainer center={[-5.0892, -42.8028]} zoom={14} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <CenterMapToUserLocation setUserPosition={setUserPosition} />
                
                {userPosition && (
                    <Marker position={userPosition} icon={userLocationIcon}>
                        <Popup>Você está aqui</Popup>
                    </Marker>
                )}

                {sortedEstablishments.map(business => (
                    <Marker 
                        key={business.id} 
                        position={[business.location.latitude, business.location.longitude]}
                        icon={getCategoryIcon(business.category)}
                    >
                        <Popup>
                           <div className="font-bold">{business.businessName}</div>
                           <div>{categories.find(c => c.value === business.category)?.label || business.category}</div>
                           <Link href={`/estabelecimento/${business.id}`} className="text-primary text-sm hover:underline">
                             Ver mais
                           </Link>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
      </main>
    </div>
  )
}