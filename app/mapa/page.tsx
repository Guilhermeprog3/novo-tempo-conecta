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
import { collection, getDocs } from "firebase/firestore"

// Definição do tipo para os dados do negócio
type Business = {
  id: string;
  businessName: string;
  address: string;
  category: string;
  rating?: number;
  isOpen?: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
};

// Corrigindo o problema do ícone padrão do Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Função para criar ícones personalizados com base na categoria
const getCategoryIcon = (category: string) => {
    let iconComponent;
    let color = "#4B5563"; // Cor padrão (cinza)

    switch (category) {
        case "Restaurante":
        case "restaurante":
            iconComponent = <Utensils size={18} color="white" />;
            color = "#F59E0B"; // Laranja
            break;
        case "Comércio":
        case "comercio":
            iconComponent = <Store size={18} color="white" />;
            color = "#3B82F6"; // Azul
            break;
        case "Serviços":
        case "servicos":
            iconComponent = <Wrench size={18} color="white" />;
            color = "#6B7280"; // Cinza escuro
            break;
        case "Saúde":
        case "saude":
            iconComponent = <Heart size={18} color="white" />;
            color = "#EF4444"; // Vermelho
            break;
        case "Automotivo":
        case "automotivo":
            iconComponent = <Car size={18} color="white" />;
            color = "#1F2937"; // Cinza bem escuro
            break;
        case "Casa":
        case "casa":
            iconComponent = <HomeIcon size={18} color="white" />;
            color = "#10B981"; // Verde
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

// Ícone para a localização do usuário
const userLocationIcon = L.divIcon({
    html: ReactDOMServer.renderToString(
        <div style={{ backgroundColor: '#3B82F6', borderRadius: '50%', width: '20px', height: '20px', border: '3px solid white', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }} />
    ),
    className: 'custom-user-location-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});


// Componente para centralizar o mapa na localização do usuário
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

  const categories = ["Restaurante", "Comércio", "Serviços", "Saúde", "Beleza", "Educação", "Lazer", "Automotivo", "Casa", "Moda", "Esportes"]

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "businesses"));
        const businessesList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Business[];
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
    const matchesSearch =
      establishment.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      establishment.address.toLowerCase().includes(searchTerm.toLowerCase())

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
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "name":
        return a.businessName.localeCompare(b.businessName)
      default:
        return 0
    }
  })

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setMinRating([0])
    setSortBy("relevancia")
    setIsOpen("todos")
    setSearchTerm("")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Novo Tempo Conecta</h1>
                <p className="text-sm text-muted-foreground">Seu bairro, seus negócios</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Início
              </Link>
              <Link href="/mapa" className="text-primary font-medium">
                Mapa
              </Link>
              <Link href="/sobre" className="text-foreground hover:text-primary transition-colors">
                Sobre
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/empresario/cadastro">Cadastrar Negócio</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-full lg:w-1/3 border-r bg-card overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Mapa Interativo</h2>
              <Badge variant="secondary" className="text-xs">
                {sortedEstablishments.length} encontrados
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar estabelecimentos..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" className="flex-1 justify-start bg-transparent" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                  <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>

                {(selectedCategories.length > 0 || minRating[0] > 0 || isOpen !== "todos") && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {showFilters && (
                <Card className="p-4 space-y-4">
                   <div>
                    <h4 className="font-medium mb-3">Categorias</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox id={category} checked={selectedCategories.includes(category)} onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)} />
                          <label htmlFor={category} className="text-sm cursor-pointer">{category}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3">Avaliação Mínima</h4>
                    <div className="space-y-2">
                      <Slider value={minRating} onValueChange={setMinRating} max={5} min={0} step={0.5} className="w-full" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span className="font-medium">{minRating[0]} estrelas</span>
                        <span>5</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3">Status</h4>
                    <Select value={isOpen} onValueChange={setIsOpen}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : sortedEstablishments.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">Nenhum estabelecimento encontrado.</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={clearFilters}>
                    Limpar Filtros
                  </Button>
                </Card>
              ) : (
                sortedEstablishments.map((establishment) => (
                  <Card key={establishment.id} className="cursor-pointer hover:shadow-md transition-shadow">
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
                           <Badge variant="secondary" className="text-xs">{establishment.category}</Badge>
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
                           <div>{business.category}</div>
                           <Link href={`/estabelecimento/${business.id}`} className="text-primary text-sm hover:underline">
                             Ver mais
                           </Link>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
      </div>
    </div>
  )
}

