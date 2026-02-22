"use client"

import {
  Star, MapPin, Phone, Clock, Globe, Share2, Heart, MessageSquare, Navigation, Camera, Loader2, Edit3, Trash2,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, updateDoc, collection, addDoc, onSnapshot, Timestamp, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore'
import { db, auth } from "@/lib/firebase"
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from 'leaflet'
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Separator } from "@/components/ui/separator"

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
  
  // Estados de Favorito, Edição e Modal
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  // Encontrar a avaliação do usuário atual
  const userReview = reviews.find(r => r.userId === currentUser?.uid);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user && params.id) {
            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const favorites = userData.favorites || [];
                    setIsFavorite(favorites.includes(params.id));
                }
            } catch (error) {
                console.error("Erro ao verificar favoritos:", error);
            }
        }
    });
    return () => unsubscribe();
  }, [params.id]);

  useEffect(() => {
    if (!params.id) return;

    const fetchBusinessData = async () => {
        try {
            const docRef = doc(db, "businesses", params.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setBusiness({ id: docSnap.id, ...docSnap.data() } as BusinessData);
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
        setReviews(reviewsList.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    });

    return () => unsubscribeReviews();
  }, [params.id]);

  const handleToggleFavorite = async () => {
    if (!currentUser) {
        router.push(`/login?redirect=/estabelecimento/${params.id}`);
        return;
    }

    setFavLoading(true);
    try {
        const userRef = doc(db, "users", currentUser.uid);
        if (isFavorite) {
            await updateDoc(userRef, { favorites: arrayRemove(params.id) });
            setIsFavorite(false);
        } else {
            await updateDoc(userRef, { favorites: arrayUnion(params.id) });
            setIsFavorite(true);
        }
    } catch (error) {
        console.error("Erro ao atualizar favoritos:", error);
    } finally {
        setFavLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copiado para a área de transferência!");
  };

  // Carrega os dados se o usuário já tiver avaliado
  const handleToggleReviewForm = () => {
    if (currentUser) {
        if (!showReviewForm && userReview) {
            setUserRating(userReview.rating);
            setReviewComment(userReview.comment);
        } else if (!showReviewForm) {
            setUserRating(0);
            setReviewComment("");
        }
        setShowReviewForm(!showReviewForm);
    } else {
        router.push(`/login?redirect=/estabelecimento/${params.id}`);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !business) return;

    if (userRating === 0 || reviewComment.trim() === "") {
        alert("Por favor, selecione uma nota e escreva um comentário.");
        return;
    }

    try {
        const businessRef = doc(db, "businesses", params.id);
        
        if (userReview) {
             // --- ATUALIZAR ---
             const reviewRef = doc(db, "businesses", params.id, "reviews", userReview.id);
             await updateDoc(reviewRef, {
                 rating: userRating,
                 comment: reviewComment,
                 createdAt: new Date()
             });

             const oldTotal = (business.rating || 0) * (business.reviewCount || 0);
             const newTotal = oldTotal - userReview.rating + userRating;
             const newAvg = newTotal / (business.reviewCount || 1);

             await updateDoc(businessRef, { rating: newAvg });
             setBusiness(prev => prev ? ({...prev, rating: newAvg}) : null);
             
             // 1. Fecha o form ANTES do alert para garantir que a UI atualize
             setShowReviewForm(false);
             setUserRating(0);
             setReviewComment("");
             
             // 2. Mostra mensagem
             setTimeout(() => alert("Avaliação atualizada com sucesso!"), 100);

        } else {
             // --- CRIAR ---
             const reviewsRef = collection(db, "businesses", params.id, "reviews");
             await addDoc(reviewsRef, {
                 userId: currentUser.uid,
                 userName: currentUser.displayName || "Usuário Anônimo",
                 userAvatar: currentUser.photoURL,
                 rating: userRating,
                 comment: reviewComment,
                 createdAt: new Date(),
             });

             const newCount = (business.reviewCount || 0) + 1;
             const newTotal = ((business.rating || 0) * (business.reviewCount || 0)) + userRating;
             const newAvg = newTotal / newCount;

             await updateDoc(businessRef, {
                 rating: newAvg,
                 reviewCount: newCount,
             });
             
             setBusiness(prev => prev ? ({...prev, rating: newAvg, reviewCount: newCount}) : null);

             // 1. Fecha o form ANTES do alert
             setShowReviewForm(false);
             setUserRating(0);
             setReviewComment("");
             
             // 2. Mostra mensagem
             setTimeout(() => alert("Avaliação enviada com sucesso!"), 100);
        }

    } catch (error) {
        console.error("Erro ao salvar avaliação:", error);
        alert("Ocorreu um erro. Tente novamente.");
    }
  };

  const handleDeleteReview = async () => {
      if (!currentUser || !business || !userReview) return;
      
      try {
          await deleteDoc(doc(db, "businesses", params.id, "reviews", userReview.id));

          const currentTotal = (business.rating || 0) * (business.reviewCount || 0);
          const newTotal = currentTotal - userReview.rating;
          const newCount = (business.reviewCount || 1) - 1;
          const newAvg = newCount > 0 ? newTotal / newCount : 0;

          await updateDoc(doc(db, "businesses", params.id), {
              rating: newAvg,
              reviewCount: newCount
          });

          setBusiness(prev => prev ? ({...prev, rating: newAvg, reviewCount: newCount}) : null);
          
          setIsDeleteAlertOpen(false); 
          setShowReviewForm(false); // Garante que o form feche se estiver aberto
          
          // Pequeno delay para o modal fechar antes do alert
          setTimeout(() => alert("Avaliação excluída."), 100);

      } catch (error) {
          console.error("Erro ao excluir avaliação:", error);
          alert("Erro ao excluir. Verifique se você tem permissão.");
      }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-[#F7B000] text-[#F7B000]" : "text-slate-300"}`} />
    ))
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="h-12 w-12 animate-spin text-[#00CCFF]" /></div>;

  if (!business) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <h1 className="text-2xl font-bold mb-4 text-slate-900">Estabelecimento não encontrado</h1>
          <Button asChild className="bg-[#F7B000] hover:bg-[#F7B000]/80 text-[#002240] font-bold"><Link href="/">Voltar</Link></Button>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />

      <div className="bg-[#002240] pb-32 pt-10 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex items-center text-blue-200 text-sm mb-6">
                <Link href="/" className="hover:text-white">Início</Link>
                <span className="mx-2">/</span>
                <Link href="/busca" className="hover:text-white">Estabelecimentos</Link>
                <span className="mx-2">/</span>
                <span className="text-white font-medium">{business.businessName}</span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-[#F7B000] text-[#002240] hover:bg-[#F7B000]/90 font-bold border-none">{business.category}</Badge>
                        {business.isOpen ? <Badge className="bg-green-500 border-none">Aberto Agora</Badge> : <Badge variant="outline" className="text-blue-100 border-blue-300">Fechado</Badge>}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">{business.businessName}</h1>
                    <div className="flex items-center gap-4 text-blue-100 text-sm">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-[#F7B000] fill-[#F7B000]" />
                            <span className="font-bold text-white text-lg">{business.rating?.toFixed(1) || 'N/A'}</span>
                            <span className="ml-1 opacity-80">({business.reviewCount || 0} avaliações)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate max-w-[200px] md:max-w-none">{business.address}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                    <Button onClick={handleShare} className="bg-[#F7B000] hover:bg-[#F7B000]/90 text-[#002240] font-bold shadow-md flex-1 md:flex-none">
                        <Share2 className="w-4 h-4 mr-2" /> Compartilhar
                    </Button>
                    <Button onClick={handleToggleFavorite} disabled={favLoading} className={`font-bold shadow-md flex-1 md:flex-none border transition-colors ${isFavorite ? "bg-white text-red-500 hover:bg-slate-100 border-white" : "bg-[#F7B000] hover:bg-[#F7B000]/90 text-[#002240] border-transparent"}`}>
                        {favLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />}
                        {isFavorite ? "Salvo" : "Salvar"}
                    </Button>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-20 relative z-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-md bg-white overflow-hidden">
                <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold text-[#002240] flex items-center gap-2"><Camera className="h-5 w-5" /> Galeria</CardTitle></CardHeader>
                <CardContent className="p-6">
                    {business.images && business.images.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {business.images.map((url, index) => (
                                <div key={index} className="aspect-[4/3] relative rounded-lg overflow-hidden group cursor-pointer shadow-sm">
                                    <img src={url} alt="Foto" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <Camera className="w-10 h-10 mx-auto mb-3 text-slate-300" /><p className="text-slate-500 text-sm">Sem fotos.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white border border-slate-200">
                <CardContent className="p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Sobre o estabelecimento</h2>
                    <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-line">{business.description || "Nenhuma descrição fornecida."}</p>
                    {business.specialties && business.specialties.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">Especialidades</h3>
                            <div className="flex flex-wrap gap-2">
                                {business.specialties.map((specialty, index) => (
                                    <Badge key={index} variant="secondary" className="bg-blue-50 text-[#002240] hover:bg-blue-100 px-3 py-1 text-sm font-normal">{specialty}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white border border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-6">
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-[#002240]" /> Avaliações</CardTitle>
                        <CardDescription className="mt-1">{reviews.length} comentários</CardDescription>
                    </div>
                    {!showReviewForm && (
                        <Button onClick={handleToggleReviewForm} className="bg-[#F7B000] hover:bg-[#F7B000]/90 text-[#002240] font-bold shadow-md">
                            {userReview ? "Editar sua avaliação" : "Avaliar agora"}
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="p-6">
                    {showReviewForm && (
                        <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                            <h3 className="font-bold text-slate-900 mb-4">{userReview ? "Editar avaliação" : "Sua experiência"}</h3>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="mb-4">
                                    <span className="block text-sm font-medium text-slate-700 mb-2">Sua nota</span>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className={`w-8 h-8 cursor-pointer transition-transform hover:scale-110 ${star <= userRating ? 'text-[#F7B000] fill-[#F7B000]' : 'text-slate-300'}`} onClick={() => setUserRating(star)} />
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <span className="block text-sm font-medium text-slate-700 mb-2">Seu comentário</span>
                                    <Textarea placeholder="Conte como foi sua experiência..." className="bg-white border-slate-300 focus-visible:ring-[#00CCFF] text-slate-900 placeholder:text-slate-400" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={4} />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)} className="border-slate-300 text-slate-700 hover:bg-slate-50">Cancelar</Button>
                                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold">Salvar Avaliação</Button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-6">
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review.id} className="flex gap-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                                    <Avatar className="h-10 w-10 border border-slate-200">
                                        <AvatarFallback className="bg-blue-100 text-[#002240] font-bold">{review.userName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                                            <p className="font-bold text-slate-900">{review.userName}</p>
                                            <span className="text-xs text-slate-500">{review.createdAt.toDate().toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        <div className="flex items-center mb-2">{renderStars(review.rating)}</div>
                                        <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                                        
                                        {currentUser?.uid === review.userId && (
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={handleToggleReviewForm} className="flex items-center text-xs text-blue-600 hover:underline">
                                                    <Edit3 className="w-3 h-3 mr-1" /> Editar
                                                </button>
                                                <button onClick={() => setIsDeleteAlertOpen(true)} className="flex items-center text-xs text-red-600 hover:underline">
                                                    <Trash2 className="w-3 h-3 mr-1" /> Excluir
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <MessageSquare className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                                <p className="text-slate-500">Seja o primeiro a avaliar este local!</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

             {/* Modal de Exclusão */}
             <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900">Excluir avaliação?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500">
                            Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-slate-700 border-slate-300 hover:bg-slate-50">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteReview} className="bg-red-600 text-white hover:bg-red-700 border-none">
                            Confirmar Exclusão
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 shadow-sm bg-white">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-4"><CardTitle className="text-base font-bold text-slate-800">Canais de Atendimento</CardTitle></CardHeader>
              <CardContent className="p-5 space-y-4">
                 <Button className="w-full bg-[#F7B000] hover:bg-[#F7B000]/90 text-[#002240] shadow-md h-12 text-md font-bold" asChild><a href={`tel:${business.businessPhone}`}><Phone className="w-4 h-4 mr-2" /> Ligar Agora</a></Button>
                 {business.whatsapp && <Button className="w-full bg-[#F7B000] hover:bg-[#F7B000]/90 text-[#002240] shadow-md h-12 text-md font-bold" asChild><a href={`https://wa.me/55${business.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"><MessageSquare className="w-4 h-4 mr-2" /> WhatsApp</a></Button>}
                 <Separator className="my-2" />
                 {business.website && <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-600 hover:text-[#002240] transition-colors p-2 hover:bg-slate-50 rounded-lg"><div className="bg-slate-100 p-2 rounded-full"><Globe className="w-4 h-4 text-slate-500" /></div><span className="truncate flex-1 font-medium">Visitar Site / Instagram</span><ArrowRight className="w-4 h-4 opacity-50" /></a>}
                 <div className="flex items-center gap-3 text-sm text-slate-600 p-2"><div className="bg-slate-100 p-2 rounded-full"><Phone className="w-4 h-4 text-slate-500" /></div><span className="font-medium">{business.businessPhone}</span></div>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 shadow-sm bg-white">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-4"><CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500" /> Funcionamento</CardTitle></CardHeader>
              <CardContent className="p-5">
                <div className="flex items-start gap-3"><div className={`mt-1 w-2 h-2 rounded-full ${business.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} /><div><p className={`font-bold ${business.isOpen ? 'text-green-600' : 'text-red-600'} mb-1`}>{business.isOpen ? 'Aberto agora' : 'Fechado agora'}</p><p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{business.hours.replace(/; /g, '\n')}</p></div></div>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-4"><CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-500" /> Localização</CardTitle></CardHeader>
              <div className="h-48 w-full relative z-0">
                  <MapContainer center={[business.location.latitude, business.location.longitude]} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false} zoomControl={false}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[business.location.latitude, business.location.longitude]} />
                  </MapContainer>
              </div>
              <CardContent className="p-5">
                <p className="text-sm text-slate-600 mb-4">{business.address}</p>
                <Button className="w-full bg-[#F7B000] hover:bg-[#F7B000]/90 text-[#002240] font-bold shadow-md" asChild><a href={`https://www.google.com/maps/dir/?api=1&destination=${business.location.latitude},${business.location.longitude}`} target="_blank" rel="noopener noreferrer"><Navigation className="w-4 h-4 mr-2" /> Traçar Rota</a></Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}