import { MapPin, Users, Store, Heart, Target, Award, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <Link href="/mapa" className="text-foreground hover:text-primary transition-colors">
                Mapa
              </Link>
              <Link href="/categorias" className="text-foreground hover:text-primary transition-colors">
                Categorias
              </Link>
              <Link href="/sobre" className="text-primary font-medium">
                Sobre
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/cadastro">Cadastrar Negócio</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Sobre o <span className="text-primary">Novo Tempo Conecta</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Uma plataforma criada pela comunidade, para a comunidade. Conectando moradores e empresários do bairro Novo
            Tempo.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">Nossa Missão</h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Fortalecer a economia local do bairro Novo Tempo, criando conexões genuínas entre moradores e
                empresários. Acreditamos que uma comunidade unida é uma comunidade próspera.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa plataforma facilita a descoberta de negócios locais, promove o consumo consciente e ajuda
                empreendedores a alcançarem seus vizinhos de forma efetiva.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Store className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-2xl font-bold text-foreground mb-2">150+</div>
                  <div className="text-sm text-muted-foreground">Negócios</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-2xl font-bold text-foreground mb-2">5k+</div>
                  <div className="text-sm text-muted-foreground">Moradores</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-2xl font-bold text-foreground mb-2">2.5k+</div>
                  <div className="text-sm text-muted-foreground">Avaliações</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-2xl font-bold text-foreground mb-2">4.8</div>
                  <div className="text-sm text-muted-foreground">Nota Média</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Nossos Valores</h3>
            <p className="text-lg text-muted-foreground">Os princípios que guiam nossa plataforma e nossa comunidade</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Comunidade</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Acreditamos no poder da união. Juntos, construímos um bairro mais forte e próspero para todos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Transparência</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Informações claras e avaliações honestas para que você tome as melhores decisões de consumo.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Sustentabilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Promovemos o consumo local consciente, reduzindo impactos ambientais e fortalecendo a economia
                  regional.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Nossa História</h3>
          </div>

          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="text-lg leading-relaxed mb-6">
              O Novo Tempo Conecta nasceu da necessidade real dos moradores do bairro Novo Tempo. Em 2023, um grupo de
              vizinhos percebeu que muitos negócios locais incríveis passavam despercebidos, enquanto moradores buscavam
              serviços fora do bairro por não conhecerem as opções disponíveis.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Começamos com uma simples lista compartilhada no WhatsApp, que rapidamente cresceu para centenas de
              estabelecimentos. Percebemos que precisávamos de algo maior: uma plataforma dedicada que pudesse
              organizar, facilitar e potencializar essas conexões.
            </p>

            <p className="text-lg leading-relaxed">
              Hoje, somos mais que uma plataforma digital. Somos uma rede de apoio mútuo, onde cada avaliação, cada
              recomendação e cada nova descoberta fortalece nossa comunidade e nossa economia local.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Entre em Contato</h3>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Tem sugestões, dúvidas ou quer fazer parte da nossa equipe? Fale conosco!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center space-x-3">
              <Mail className="w-6 h-6" />
              <span className="text-lg">contato@novotempo.com.br</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Phone className="w-6 h-6" />
              <span className="text-lg">(11) 9999-9999</span>
            </div>
          </div>

          <Button size="lg" variant="secondary" className="text-lg px-8">
            Enviar Mensagem
          </Button>
        </div>
      </section>
    </div>
  )
}
