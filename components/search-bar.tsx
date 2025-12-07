"use client"

import type React from "react"
import { Search, MapPin, Loader2, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

interface SearchResult {
  id: string
  businessName: string;
  category: string;
  address: string;
  rating: number;
}

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export function SearchBar({ placeholder = "Busque por estabelecimentos...", className = "" }: SearchBarProps) {
  const [queryText, setQueryText] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [allBusinesses, setAllBusinesses] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchAllBusinesses = async () => {
      try {
        const businessesCollection = collection(db, "businesses");
        const q = query(businessesCollection, where("isPublic", "==", true));
        const businessSnapshot = await getDocs(q);
        
        const businessesList = businessSnapshot.docs.map(doc => ({
          id: doc.id,
          businessName: doc.data().businessName,
          category: doc.data().category,
          address: doc.data().address,
          rating: doc.data().rating || 0,
        })) as SearchResult[];
        
        setAllBusinesses(businessesList);
      } catch (error) {
        console.error("Erro ao buscar negócios para a busca:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBusinesses();
  }, []);

  useEffect(() => {
    if (queryText.length > 2) {
      const lowerCaseQuery = queryText.toLowerCase();
      const filtered = allBusinesses.filter(
        (item) =>
          (item.businessName?.toLowerCase() || '').includes(lowerCaseQuery) ||
          (item.category?.toLowerCase() || '').includes(lowerCaseQuery)
      ).slice(0, 5);
      setResults(filtered);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [queryText, allBusinesses]);

  const handleSearch = () => {
    if (queryText.trim()) {
      router.push(`/busca?q=${encodeURIComponent(queryText)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div className={`relative ${className} z-50`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input
          placeholder={placeholder}
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => queryText.length > 2 && setShowResults(true)}
          onBlur={handleBlur}
          // CORREÇÃO: Fundo branco, texto escuro e borda/sombra sutis
          className="pl-12 pr-32 py-6 text-lg rounded-full border-2 border-slate-200 focus-visible:border-[#1E3A8A] focus-visible:ring-0 bg-white text-slate-900 shadow-lg placeholder:text-slate-400 transition-all"
        />
        <Button
          onClick={handleSearch}
          // CORREÇÃO: Botão Azul Escuro (#1E3A8A) para contraste com o fundo branco do input
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6 h-10 bg-[#1E3A8A] hover:bg-blue-900 text-white font-medium shadow-sm transition-colors"
        >
          Buscar
        </Button>
      </div>

      {showResults && (
        // CORREÇÃO: Card de resultados com fundo branco e sombra forte para destaque
        <Card className="absolute top-full left-0 right-0 mt-2 shadow-xl border border-slate-200 z-[100] max-h-[400px] overflow-hidden rounded-xl bg-white">
          <CardContent className="p-0">
            <div className="max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-slate-500 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#1E3A8A]" />
                  Carregando...
                </div>
              ) : results.length > 0 ? (
                results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/estabelecimento/${result.id}`}
                    // CORREÇÃO: Hover cinza claro e texto escuro
                    className="block p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="font-semibold text-slate-900 truncate group-hover:text-[#1E3A8A] transition-colors">{result.businessName}</p>
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold mr-2 tracking-wide">{result.category}</span>
                          <div className="flex items-center truncate">
                             <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                             <span className="truncate text-xs">{result.address}</span>
                          </div>
                        </div>
                      </div>
                      {result.rating > 0 && (
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100 flex-shrink-0">
                          <span className="text-sm font-bold text-yellow-700">{result.rating.toFixed(1)}</span>
                          <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" />
                        </div>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-slate-500">
                    Nenhum estabelecimento encontrado para "<strong>{queryText}</strong>".
                </div>
              )}
            </div>
            {results.length > 0 && (
              <div className="p-2 bg-slate-50 border-t border-slate-100">
                <Button variant="ghost" size="sm" className="w-full text-[#1E3A8A] hover:text-blue-900 hover:bg-blue-50 font-medium" onClick={handleSearch}>
                  Ver todos os resultados
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}