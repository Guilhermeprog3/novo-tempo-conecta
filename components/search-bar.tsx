"use client"

import type React from "react"

import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import Link from "next/link"

interface SearchResult {
  id: string
  name: string
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
  const [showResults, setShowResults] = useState(false)

  // Dados simulados para busca
  const mockResults: SearchResult[] = [
    { id: "1", name: "Pizzaria do Bairro", category: "Restaurante", address: "Rua das Flores, 123", rating: 4.8 },
    { id: "2", name: "Mercadinho São José", category: "Comércio", address: "Av. Principal, 456", rating: 4.6 },
    { id: "3", name: "Auto Elétrica Silva", category: "Serviços", address: "Rua dos Mecânicos, 789", rating: 4.9 },
    { id: "4", name: "Salão Beleza Total", category: "Beleza", address: "Rua da Beleza, 321", rating: 4.7 },
    { id: "5", name: "Farmácia Popular", category: "Saúde", address: "Av. Saúde, 654", rating: 4.4 },
  ]

  useEffect(() => {
    if (query.length > 2) {
      const filtered = mockResults.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filtered)
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  }, [query])

  const handleSearch = () => {
    if (query.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(query)}`
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

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

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/estabelecimento/${result.id}`}
                  className="block p-4 hover:bg-muted/50 transition-colors border-b last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{result.name}</p>
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
              ))}
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
  )
}
