"use client"

import { Home, Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/components/navigation/header"

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4 -mt-16">
        <Card className="w-full max-w-md text-center shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
          <CardHeader>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl text-white">Página não encontrada</CardTitle>
            <CardDescription className="text-white/80">Ops! A página que você está procurando não existe ou foi movida.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-white/80">Que tal explorar os estabelecimentos do bairro Novo Tempo?</p>
            <div className="flex flex-col space-y-2">
              <Button asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Link>
              </Button>
              <Button variant="outline" asChild className="bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white">
                <Link href="/busca">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Estabelecimentos
                </Link>
              </Button>
              <Button variant="outline" asChild className="bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white">
                <Link href="/mapa">
                  <MapPin className="w-4 h-4 mr-2" />
                  Ver no Mapa
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}