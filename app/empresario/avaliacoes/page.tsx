// app/empresario/avaliacoes/page.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Star, MessageSquare } from "lucide-react";
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, getDocs, orderBy, Timestamp } from 'firebase/firestore';

// Definindo a estrutura de dados de uma Avaliação
type Review = {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    createdAt: Date;
};

// Componente para renderizar as estrelas da avaliação
const StarRating = ({ rating }: { rating: number }) => {
    const totalStars = 5;
    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, index) => {
                const starNumber = index + 1;
                return (
                    <Star
                        key={starNumber}
                        className={`w-4 h-4 ${
                            starNumber <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`}
                    />
                );
            })}
        </div>
    );
};

export default function AvaliacoesPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async (businessId: string) => {
            try {
                // A consulta busca na subcoleção 'reviews' dentro do documento do negócio
                const reviewsRef = collection(db, "businesses", businessId, "reviews");
                const q = query(reviewsRef, orderBy("createdAt", "desc"));
                
                const querySnapshot = await getDocs(q);
                const fetchedReviews = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Converte o Timestamp do Firebase para um objeto Date do JavaScript
                    const createdAtDate = data.createdAt instanceof Timestamp 
                        ? data.createdAt.toDate() 
                        : new Date();

                    return {
                        id: doc.id,
                        userId: data.userId,
                        userName: data.userName,
                        userAvatar: data.userAvatar,
                        rating: data.rating,
                        comment: data.comment,
                        createdAt: createdAtDate
                    } as Review;
                });

                setReviews(fetchedReviews);
            } catch (err) {
                console.error("Erro ao buscar avaliações:", err);
                setError("Não foi possível carregar as avaliações.");
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                fetchReviews(currentUser.uid);
            } else {
                // Se o usuário não estiver logado, o layout já o redirecionará
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const getInitials = (name: string = "") => {
        return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??';
    }

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
    }

    if (error) {
        return <div className="flex h-full items-center justify-center"><p className="text-red-500">{error}</p></div>;
    }

    return (
        <div className="space-y-6">
            <Card className="shadow-lg bg-white border border-gray-200/80 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-slate-900 text-lg">Avaliações Recebidas</CardTitle>
                    <CardDescription className="text-slate-500">
                        Veja o que os clientes estão dizendo sobre o seu negócio.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center text-gray-500 py-16">
                            <MessageSquare className="w-12 h-12 mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold">Nenhuma avaliação ainda</h3>
                            <p className="text-sm">Quando um cliente avaliar seu negócio, ela aparecerá aqui.</p>
                        </div>
                    ) : (
                        <ul className="space-y-6">
                            {reviews.map((review) => (
                                <li key={review.id} className="p-4 border rounded-lg bg-gray-50/80">
                                    <div className="flex items-start space-x-4">
                                        <Avatar>
                                            <AvatarImage src={review.userAvatar} alt={review.userName} />
                                            <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-slate-800">{review.userName}</h4>
                                                <span className="text-xs text-gray-500">
                                                    {review.createdAt.toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                            <div className="my-1">
                                                <StarRating rating={review.rating} />
                                            </div>
                                            <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                                                {review.comment}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}