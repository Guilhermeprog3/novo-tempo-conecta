"use client"

import type React from "react"
import { Search, MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

interface SearchResult {
  id: string
  businessName: string
  category: string
  address: string
  rating: number
}

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export function SearchBar({ placeholder = "Busque por estabelecimentos...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [allBusinesses, setAllBusinesses] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Adicionado estado de carregamento inicial
  const router = useRouter()

  // Efeito para buscar todos os estabelecimentos do Firestore uma única vez
  useEffect(() => {
    const fetchAllBusinesses = async () => {
      try {
        const businessesCollection = collection(db, "businesses");
        const businessSnapshot = await getDocs(businessesCollection);
        const businessesList = businessSnapshot.docs.map(doc => ({
          id: doc.id,
          businessName: doc.data().businessName,
          category: doc.data().category,
          address: doc.data().address,
          rating: doc.data().rating || 0,
        })) as SearchResult[];
        setAllBusinesses(businessesList);
      } catch (error) {
        console.error("Erro ao buscar todos os negócios para a busca:", error);
      } finally {
        setIsLoading(false); // Finaliza o carregamento inicial
      }
    };

    fetchAllBusinesses();
  }, []);

  // Efeito para filtrar os resultados com base na busca do usuário
  useEffect(() => {
    if (query.length > 2) {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = allBusinesses.filter(
        (item) =>
          // Verificações de segurança para evitar erros
          item.businessName?.toLowerCase().includes(lowerCaseQuery) ||
          item.category?.toLowerCase().includes(lowerCaseQuery),
      ).slice(0, 5);
      setResults(filtered);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query, allBusinesses]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/busca?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => query.length > 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="pl-12 pr-4 py-6 text-lg rounded-full border-2 border-border focus:border-primary"
        />
        <Button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-8"
        >
          Buscar
        </Button>
      </div>

      {/* Lógica de renderização do Dropdown atualizada */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Carregando...
                </div>
              ) : results.length > 0 ? (
                results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/estabelecimento/${result.id}`}
                    className="block p-4 hover:bg-muted/50 transition-colors border-b last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{result.businessName}</p>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <span className="bg-secondary px-2 py-1 rounded text-xs mr-2">{result.category}</span>
                          <MapPin className="w-3 h-3 mr-1" />
                          {result.address}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{result.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">Nenhum resultado encontrado.</div>
              )}
            </div>
            {results.length > 0 && (
              <div className="p-3 border-t bg-muted/25">
                <Button variant="ghost" size="sm" className="w-full" onClick={handleSearch}>
                  Ver todos os resultados para "{query}"
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}