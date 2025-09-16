"use client"

import {
  Star, MapPin, Phone, Clock, Globe, Share2, Heart, MessageSquare, Navigation, Camera, ThumbsUp, Flag, Send, User, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Importado para redirecionamento
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, Timestamp, onSnapshot } from 'firebase/firestore'
import { db, auth } from "@/lib/firebase"
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from 'leaflet'

// --- Tipagem dos Dados ---
type BusinessData = {
    id: string;
    businessName: string;
    category: string;
    rating?: number;
    reviewCount?: number;
    address: string;
    businessPhone: string;
    whatsapp?: string;
    hours: string;
    website?: string;
    description: string;
    specialties?: string[];
    isOpen?: boolean;
    images?: string[];
    location: {
        latitude: number;
        longitude: number;
    };
};

type Review = {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    createdAt: Timestamp;
};

// --- Configuração do Ícone do Mapa ---
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


export default function EstabelecimentoPage({ params }: { params: { id: string } }) {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const router = useRouter(); // Hook para redirecionamento

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!params.id) return;
  
    const fetchBusinessData = async () => {
        try {
            const docRef = doc(db, "businesses", params.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setBusiness({ id: docSnap.id, ...docSnap.data() } as BusinessData);
            } else {
                console.log("Nenhum negócio encontrado com este ID!");
            }
        } catch (error) {
            console.error("Erro ao buscar dados do negócio:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchBusinessData();

    // Listener para avaliações em tempo real
    const reviewsRef = collection(db, "businesses", params.id, "reviews");
    const unsubscribeReviews = onSnapshot(reviewsRef, (querySnapshot) => {
        const reviewsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
        setReviews(reviewsList);
    });

    return () => unsubscribeReviews();
  }, [params.id]);

  const handleToggleReviewForm = () => {
    if (currentUser) {
        setShowReviewForm(!showReviewForm);
    } else {
        router.push(`/login?redirect=/estabelecimento/${params.id}`);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !business) {
        alert("Você precisa estar logado para avaliar.");
        return;
    }
    if (userRating === 0 || reviewComment.trim() === "") {
        alert("Por favor, selecione uma nota e escreva um comentário.");
        return;
    }

    try {
        // 1. Adicionar a nova avaliação na subcoleção
        const reviewsRef = collection(db, "businesses", params.id, "reviews");
        await addDoc(reviewsRef, {
            userId: currentUser.uid,
            userName: currentUser.displayName || "Usuário Anônimo",
            userAvatar: currentUser.photoURL,
            rating: userRating,
            comment: reviewComment,
            createdAt: new Date(),
        });

        // 2. Atualizar a média de avaliação do estabelecimento
        const newReviewCount = (business.reviewCount || 0) + 1;
        const newRating = ((business.rating || 0) * (business.reviewCount || 0) + userRating) / newReviewCount;

        const businessRef = doc(db, "businesses", params.id);
        await updateDoc(businessRef, {
            rating: newRating,
            reviewCount: newReviewCount,
        });
        
        // Limpar o formulário
        setShowReviewForm(false);
        setUserRating(0);
        setReviewComment("");
        alert("Avaliação enviada com sucesso!");

    } catch (error) {
        console.error("Erro ao enviar avaliação:", error);
        alert("Ocorreu um erro ao enviar sua avaliação.");
    }
  };


  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  if (!business) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Estabelecimento não encontrado</h1>
            <p className="text-muted-foreground mb-8">O link que você acessou pode estar quebrado ou o estabelecimento foi removido.</p>
            <Button asChild>
                <Link href="/">Voltar para a Página Inicial</Link>
            </Button>
        </div>
    )
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
              <Link href="/" className="text-foreground hover:text-primary transition-colors">Início</Link>
              <Link href="/mapa" className="text-foreground hover:text-primary transition-colors">Mapa</Link>
              <Link href="/sobre" className="text-foreground hover:text-primary transition-colors">Sobre</Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild><Link href="/login">Entrar</Link></Button>
              <Button size="sm" asChild><Link href="/empresario/cadastro">Cadastrar Negócio</Link></Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{business.businessName}</h1>
                    <div className="flex items-center space-x-4 mb-2">
                      <Badge variant="secondary">{business.category}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{business.rating?.toFixed(1) || 'N/A'}</span>
                        <span className="text-muted-foreground">({business.reviewCount || 0} avaliações)</span>
                      </div>
                      {business.isOpen && <Badge className="bg-green-500">Aberto</Badge>}
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{business.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="bg-transparent"><Heart className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" className="bg-transparent"><Share2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{business.description}</p>
                <div className="flex flex-wrap gap-2">
                  {business.specialties?.map((specialty, index) => (
                    <Badge key={index} variant="outline">{specialty}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Fotos</CardTitle></CardHeader>
              <CardContent>
                {business.images && business.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {business.images.map((url, index) => (
                             <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                                <img src={url} alt={`Foto ${index + 1} de ${business.businessName}`} className="w-full h-full object-cover rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma foto adicionada ainda.</p>
                    </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Avaliações ({reviews.length})</CardTitle>
                  <Button onClick={handleToggleReviewForm}>
                    {showReviewForm ? "Cancelar" : "Deixar uma avaliação"}
                  </Button>
              </CardHeader>
              <CardContent>
                {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className="mb-6 p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Sua Avaliação</h3>
                        <div className="flex items-center space-x-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 cursor-pointer transition-colors ${
                                        star <= userRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                    onClick={() => setUserRating(star)}
                                />
                            ))}
                        </div>
                        <Textarea 
                            placeholder="Escreva seu comentário..." 
                            className="mb-4"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                        />
                        <Button type="submit">Enviar Avaliação</Button>
                    </form>
                )}
                <div className="space-y-6">
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.id} className="flex space-x-4">
                                <Avatar>
                                    <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">{review.userName}</p>
                                        <div className="flex items-center space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{review.createdAt.toDate().toLocaleDateString('pt-BR')}</p>
                                    <p className="mt-2">{review.comment}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            Ainda não há avaliações. Seja o primeiro a avaliar!
                        </p>
                    )}
                </div>
              </CardContent>
            </Card>

          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Contato</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{business.businessPhone}</p>
                  </div>
                </div>
                {business.whatsapp && (
                    <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-muted-foreground" />
                        <div>
                        <p className="font-medium">WhatsApp</p>
                        <p className="text-sm text-muted-foreground">{business.whatsapp}</p>
                        </div>
                    </div>
                )}
                {business.website && (
                    <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <div>
                        <p className="font-medium">Site/Instagram</p>
                        <p className="text-sm text-muted-foreground">{business.website}</p>
                        </div>
                    </div>
                )}
                <div className="pt-4 space-y-2">
                  <Button className="w-full"><Phone className="w-4 h-4 mr-2" />Ligar Agora</Button>
                  <Button variant="outline" className="w-full bg-transparent"><MessageSquare className="w-4 h-4 mr-2" />WhatsApp</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Horário de Funcionamento</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{business.hours}</p>
                    <p className={`text-sm ${business.isOpen ? 'text-green-600' : 'text-red-600'}`}>{business.isOpen ? 'Aberto agora' : 'Fechado agora'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Localização</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3 mb-4">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">Endereço</p>
                    <p className="text-sm text-muted-foreground">{business.address}</p>
                  </div>
                </div>
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                    <MapContainer
                        center={[business.location.latitude, business.location.longitude]}
                        zoom={16}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={false}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
                        <Marker position={[business.location.latitude, business.location.longitude]} />
                    </MapContainer>
                </div>
                <Button variant="outline" className="w-full bg-transparent"><Navigation className="w-4 h-4 mr-2" />Como Chegar</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}