import { Home, Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Página não encontrada</CardTitle>
          <CardDescription>Ops! A página que você está procurando não existe ou foi movida.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Que tal explorar os estabelecimentos do bairro Novo Tempo?</p>
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
            <Button variant="outline" asChild className="bg-transparent">
              <Link href="/busca">
                <Search className="w-4 h-4 mr-2" />
                Buscar Estabelecimentos
              </Link>
            </Button>
            <Button variant="outline" asChild className="bg-transparent">
              <Link href="/mapa">
                <MapPin className="w-4 h-4 mr-2" />
                Ver no Mapa
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
