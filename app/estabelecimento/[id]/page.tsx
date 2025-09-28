// app/estabelecimento/[id]/page.tsx
"use client"

import {
  Star, MapPin, Phone, Clock, Globe, Share2, Heart, MessageSquare, Navigation, Camera, ThumbsUp, Flag, Send, User, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, updateDoc, collection, addDoc, onSnapshot, Timestamp } from 'firebase/firestore'
import { db, auth } from "@/lib/firebase"
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from 'leaflet'
import { Header } from "@/components/navigation/header"

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
  const router = useRouter();

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
        alert("Por favor, selecione uma nota и escreva um comentário.");
        return;
    }

    try {
        const reviewsRef = collection(db, "businesses", params.id, "reviews");
        await addDoc(reviewsRef, {
            userId: currentUser.uid,
            userName: currentUser.displayName || "Usuário Anônimo",
            userAvatar: currentUser.photoURL,
            rating: userRating,
            comment: reviewComment,
            createdAt: new Date(),
        });

        const newReviewCount = (business.reviewCount || 0) + 1;
        const newRating = ((business.rating || 0) * (business.reviewCount || 0) + userRating) / newReviewCount;

        const businessRef = doc(db, "businesses", params.id);
        await updateDoc(businessRef, {
            rating: newRating,
            reviewCount: newReviewCount,
        });

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
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#1E3A8A] border-blue-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{business.businessName}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
                      <Badge variant="secondary">{business.category}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-white">{business.rating?.toFixed(1) || 'N/A'}</span>
                        <span className="text-white/80">({business.reviewCount || 0} avaliações)</span>
                      </div>
                      {business.isOpen && <Badge className="bg-green-500">Aberto</Badge>}
                    </div>
                    <div className="flex items-center space-x-2 text-white/80">
                      <MapPin className="w-4 h-4" />
                      <span>{business.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white"><Heart className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" className="bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white"><Share2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <p className="text-white/80 mb-4">{business.description}</p>
                <div className="flex flex-wrap gap-2">
                  {business.specialties?.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-white border-white/50">{specialty}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E3A8A] border-blue-700 text-white">
              <CardHeader><CardTitle className="text-white">Fotos</CardTitle></CardHeader>
              <CardContent>
                {business.images && business.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {business.images.map((url, index) => (
                             <div key={index} className="aspect-square bg-blue-900/50 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                                <img src={url} alt={`Foto ${index + 1} de ${business.businessName}`} className="w-full h-full object-cover rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-white/60">
                        <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma foto adicionada ainda.</p>
                    </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#1E3A8A] border-blue-700 text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Avaliações ({reviews.length})</CardTitle>
                  <Button onClick={handleToggleReviewForm}>
                    {showReviewForm ? "Cancelar" : "Deixar uma avaliação"}
                  </Button>
              </CardHeader>
              <CardContent>
                {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className="mb-6 p-4 border border-blue-600 rounded-lg">
                        <h3 className="font-medium mb-2 text-white">Sua Avaliação</h3>
                        <div className="flex items-center space-x-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 cursor-pointer transition-colors ${
                                        star <= userRating ? 'text-yellow-400 fill-current' : 'text-gray-500'
                                    }`}
                                    onClick={() => setUserRating(star)}
                                />
                            ))}
                        </div>
                        <Textarea
                            placeholder="Escreva seu comentário..."
                            className="mb-4 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60"
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
                                        <p className="font-medium text-white">{review.userName}</p>
                                        <div className="flex items-center space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-500'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/70">{review.createdAt.toDate().toLocaleDateString('pt-BR')}</p>
                                    <p className="mt-2 text-white/90">{review.comment}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-white/60 py-8">
                            Ainda não há avaliações. Seja o primeiro a avaliar!
                        </p>
                    )}
                </div>
              </CardContent>
            </Card>

          </div>

          <div className="space-y-6">
            <Card className="bg-[#1E3A8A] border-blue-700 text-white">
              <CardHeader><CardTitle className="text-white">Contato</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="font-medium text-white">Telefone</p>
                    <p className="text-sm text-white/80">{business.businessPhone}</p>
                  </div>
                </div>
                {business.whatsapp && (
                    <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-white/60" />
                        <div>
                        <p className="font-medium text-white">WhatsApp</p>
                        <p className="text-sm text-white/80">{business.whatsapp}</p>
                        </div>
                    </div>
                )}
                {business.website && (
                    <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-white/60" />
                        <div>
                        <p className="font-medium text-white">Site/Instagram</p>
                        <p className="text-sm text-white/80">{business.website}</p>
                        </div>
                    </div>
                )}
                <div className="pt-4 space-y-2">
                  <Button className="w-full"><Phone className="w-4 h-4 mr-2" />Ligar Agora</Button>
                  <Button variant="outline" className="w-full bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white"><MessageSquare className="w-4 h-4 mr-2" />WhatsApp</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E3A8A] border-blue-700 text-white">
              <CardHeader><CardTitle className="text-white">Horário de Funcionamento</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="font-medium text-white">{business.hours}</p>
                    <p className={`text-sm ${business.isOpen ? 'text-green-400' : 'text-red-400'}`}>{business.isOpen ? 'Aberto agora' : 'Fechado agora'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E3A8A] border-blue-700 text-white">
              <CardHeader><CardTitle className="text-white">Localização</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3 mb-4">
                  <MapPin className="w-5 h-5 text-white/60 mt-1" />
                  <div>
                    <p className="font-medium text-white">Endereço</p>
                    <p className="text-sm text-white/80">{business.address}</p>
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
                <Button variant="outline" className="w-full bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white"><Navigation className="w-4 h-4 mr-2" />Como Chegar</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}