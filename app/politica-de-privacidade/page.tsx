"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Shield, Eye, Lock, Users, Cookie, FileText, AlertTriangle, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"


export default function PoliticaPrivacidadePage() {
  const [activeSection, setActiveSection] = useState("coleta")

  const sections = [
    { id: "coleta", title: "Coleta de Dados", icon: Eye },
    { id: "uso", title: "Uso das Informações", icon: Users },
    { id: "compartilhamento", title: "Compartilhamento", icon: Shield },
    { id: "seguranca", title: "Segurança", icon: Lock },
    { id: "cookies", title: "Cookies", icon: Cookie },
    { id: "direitos", title: "Seus Direitos", icon: FileText },
    { id: "alteracoes", title: "Alterações", icon: AlertTriangle },
    { id: "contato", title: "Contato", icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navegação Lateral */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Navegação Rápida
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        activeSection === section.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{section.title}</span>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Introdução */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Shield className="h-6 w-6 mr-3" />
                  Compromisso com sua Privacidade
                </CardTitle>
                <CardDescription>
                  A Novo Tempo Conecta valoriza e respeita sua privacidade. Esta política explica como coletamos, usamos
                  e protegemos suas informações pessoais em nossa plataforma.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Coleta de Dados */}
            {activeSection === "coleta" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-primary" />
                    Coleta de Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informações que Coletamos:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Dados de cadastro (nome, email, telefone)</li>
                      <li>Informações de perfil e preferências</li>
                      <li>Avaliações e comentários sobre estabelecimentos</li>
                      <li>Dados de localização (quando autorizado)</li>
                      <li>Informações de uso da plataforma</li>
                      <li>Dados técnicos (IP, navegador, dispositivo)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Como Coletamos:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Diretamente através de formulários</li>
                      <li>Automaticamente durante o uso</li>
                      <li>Através de cookies e tecnologias similares</li>
                      <li>Integração com redes sociais (quando autorizado)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Uso das Informações */}
            {activeSection === "uso" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Uso das Informações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Utilizamos seus dados para:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Fornecer e melhorar nossos serviços</li>
                      <li>Personalizar sua experiência na plataforma</li>
                      <li>Processar avaliações e comentários</li>
                      <li>Enviar notificações relevantes</li>
                      <li>Realizar análises e estatísticas</li>
                      <li>Prevenir fraudes e garantir segurança</li>
                      <li>Cumprir obrigações legais</li>
                    </ul>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-primary">
                      <strong>Base Legal:</strong> Processamos seus dados com base no seu consentimento, execução de
                      contrato, interesse legítimo e cumprimento de obrigações legais.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Compartilhamento */}
            {activeSection === "compartilhamento" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    Compartilhamento de Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Não vendemos seus dados pessoais.</h4>
                    <p className="text-muted-foreground mb-4">
                      Podemos compartilhar informações apenas nas seguintes situações:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Com seu consentimento explícito</li>
                      <li>Com prestadores de serviços terceirizados</li>
                      <li>Para cumprir obrigações legais</li>
                      <li>Em caso de fusão ou aquisição da empresa</li>
                      <li>Para proteger direitos e segurança</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Terceiros:</strong> Todos os parceiros são rigorosamente selecionados e devem seguir
                      padrões de proteção de dados equivalentes aos nossos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Segurança */}
            {activeSection === "seguranca" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-primary" />
                    Segurança dos Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Medidas de Proteção:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Criptografia de dados em trânsito e em repouso</li>
                      <li>Controles de acesso rigorosos</li>
                      <li>Monitoramento contínuo de segurança</li>
                      <li>Backups regulares e seguros</li>
                      <li>Treinamento da equipe em proteção de dados</li>
                      <li>Auditorias de segurança periódicas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Retenção de Dados:</h4>
                    <p className="text-muted-foreground">
                      Mantemos seus dados apenas pelo tempo necessário para cumprir as finalidades descritas nesta
                      política ou conforme exigido por lei.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cookies */}
            {activeSection === "cookies" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cookie className="h-5 w-5 mr-2 text-primary" />
                    Política de Cookies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Tipos de Cookies:</h4>
                    <div className="space-y-3">
                      <div className="border-l-4 border-primary pl-4">
                        <h5 className="font-medium">Cookies Essenciais</h5>
                        <p className="text-sm text-muted-foreground">
                          Necessários para o funcionamento básico da plataforma
                        </p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h5 className="font-medium">Cookies de Performance</h5>
                        <p className="text-sm text-muted-foreground">
                          Coletam informações sobre como você usa nosso site
                        </p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h5 className="font-medium">Cookies de Funcionalidade</h5>
                        <p className="text-sm text-muted-foreground">
                          Lembram suas preferências e personalizam sua experiência
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Gerenciamento:</h4>
                    <p className="text-muted-foreground">
                      Você pode gerenciar cookies através das configurações do seu navegador ou através das nossas
                      configurações de privacidade.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Direitos do Usuário */}
            {activeSection === "direitos" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Seus Direitos (LGPD)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Você tem direito a:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <h5 className="font-medium">Acesso</h5>
                            <p className="text-sm text-muted-foreground">
                              Saber quais dados temos sobre você
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <h5 className="font-medium">Correção</h5>
                            <p className="text-sm text-muted-foreground">
                              Corrigir dados incorretos ou incompletos
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <h5 className="font-medium">Exclusão</h5>
                            <p className="text-sm text-muted-foreground">
                              Solicitar a remoção de seus dados
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <h5 className="font-medium">Portabilidade</h5>
                            <p className="text-sm text-muted-foreground">
                              Receber seus dados em formato estruturado
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <h5 className="font-medium">Oposição</h5>
                            <p className="text-sm text-muted-foreground">
                              Opor-se ao processamento de seus dados
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div>
                            <h5 className="font-medium">Revogação</h5>
                            <p className="text-sm text-muted-foreground">
                              Retirar consentimento a qualquer momento
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <p className="text-sm text-secondary-foreground">
                      <strong>Como exercer:</strong> Entre em contato conosco através dos canais oficiais. Responderemos
                      em até 15 dias úteis.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alterações */}
            {activeSection === "alteracoes" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                    Alterações na Política
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Atualizações:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Podemos atualizar esta política periodicamente</li>
                      <li>Notificaremos sobre mudanças significativas</li>
                      <li>A data da última atualização será sempre indicada</li>
                      <li>Recomendamos revisar regularmente esta política</li>
                    </ul>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Última atualização: Janeiro de 2025</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contato */}
            {activeSection === "contato" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-primary" />
                    Entre em Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Dúvidas sobre Privacidade:</h4>
                    <div className="space-y-2 text-muted-foreground">
                      <p>
                        <strong>Email:</strong> privacidade@novotempoconecta.com.br
                      </p>
                      <p>
                        <strong>Telefone:</strong> (11) 9999-9999
                      </p>
                      <p>
                        <strong>Endereço:</strong> Rua das Flores, 123 - Novo Tempo, São Paulo - SP
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Encarregado de Dados (DPO):</h4>
                    <p className="text-muted-foreground">
                      Para questões específicas sobre proteção de dados, entre em contato com nosso Encarregado de
                      Proteção de Dados através do email: dpo@novotempoconecta.com.br
                    </p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-primary">
                      <strong>Compromisso:</strong> Respondemos a todas as solicitações relacionadas à privacidade em
                      até 15 dias úteis, conforme estabelecido pela LGPD.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Links Relacionados */}
            <Card>
              <CardHeader>
                <CardTitle>Documentos Relacionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Link href="/termos-de-uso">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Termos de Uso
                    </Button>
                  </Link>
                  <Link href="/sobre">
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" />
                      Sobre Nós
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}