import { MapPin, Shield, Eye, Lock, FileText, Scale, AlertTriangle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Termos de <span className="text-primary">Uso</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Conheça os termos e condições para uso da plataforma Novo Tempo Conecta
          </p>
          <p className="text-sm text-muted-foreground">Última atualização: 15 de janeiro de 2025</p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 px-4 bg-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Button variant="outline" size="sm" asChild>
              <a href="#aceitacao" className="text-xs">
                1. Aceitação
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="#uso-plataforma" className="text-xs">
                2. Uso da Plataforma
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="#contas-usuarios" className="text-xs">
                3. Contas de Usuários
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="#privacidade" className="text-xs">
                4. Privacidade
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Section 1 */}
          <div id="aceitacao" className="mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">1. Aceitação dos Termos</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Ao acessar e usar a plataforma Novo Tempo Conecta, você concorda em cumprir e estar vinculado a estes
                  Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nossa plataforma.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Estes termos se aplicam a todos os visitantes, usuários e outras pessoas que acessam ou usam o
                  serviço.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Section 2 */}
          <div id="uso-plataforma" className="mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">2. Uso da Plataforma</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold text-foreground">2.1 Uso Permitido</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Você pode usar nossa plataforma para descobrir estabelecimentos locais, deixar avaliações honestas, e
                  conectar-se com a comunidade do bairro Novo Tempo de forma respeitosa e construtiva.
                </p>

                <h4 className="font-semibold text-foreground">2.2 Uso Proibido</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Publicar conteúdo falso, enganoso ou difamatório</li>
                  <li>Usar a plataforma para atividades ilegais ou não autorizadas</li>
                  <li>Interferir ou interromper a integridade ou performance da plataforma</li>
                  <li>Criar múltiplas contas para manipular avaliações</li>
                  <li>Coletar informações de outros usuários sem consentimento</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Section 3 */}
          <div id="contas-usuarios" className="mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">3. Contas de Usuários</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold text-foreground">3.1 Responsabilidade da Conta</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Você é responsável por manter a confidencialidade de sua conta e senha, e por todas as atividades que
                  ocorrem sob sua conta.
                </p>

                <h4 className="font-semibold text-foreground">3.2 Informações Precisas</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Você concorda em fornecer informações precisas, atuais e completas durante o processo de registro e
                  atualizar essas informações conforme necessário.
                </p>

                <h4 className="font-semibold text-foreground">3.3 Suspensão de Conta</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Reservamos o direito de suspender ou encerrar sua conta se você violar estes termos ou se engajar em
                  atividades que prejudiquem nossa comunidade.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Section 4 */}
          <div id="privacidade" className="mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">4. Privacidade e Dados</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Sua privacidade é importante para nós. Coletamos e usamos suas informações pessoais de acordo com
                  nossa Política de Privacidade, que faz parte integrante destes Termos de Uso.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Ao usar nossa plataforma, você consente com a coleta e uso de informações de acordo com nossa Política
                  de Privacidade.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <Scale className="w-6 h-6 text-primary" />
                  <CardTitle>5. Propriedade Intelectual</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Todo o conteúdo da plataforma, incluindo textos, gráficos, logos e software, é propriedade do Novo
                  Tempo Conecta e está protegido por leis de direitos autorais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                  <CardTitle>6. Limitação de Responsabilidade</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  A plataforma é fornecida "como está". Não garantimos que o serviço será ininterrupto ou livre de
                  erros, e não nos responsabilizamos por danos indiretos.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact and Updates */}
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-2xl">Alterações nos Termos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-primary-foreground/90 leading-relaxed">
                Reservamos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor
                imediatamente após a publicação na plataforma.
              </p>
              <p className="text-primary-foreground/90 leading-relaxed">
                Para dúvidas sobre estes termos, entre em contato conosco em: <strong>legal@novotempo.com.br</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="secondary" asChild>
                  <Link href="/sobre">Sobre Nós</Link>
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/">Voltar ao Início</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  )
}