"use client"

import Link from "next/link"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Eye, Users, Shield, Lock, Cookie, FileText, AlertTriangle, Mail, HelpCircle, FileCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PoliticaPrivacidadePage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuItems = [
    { id: "resumo", title: "Resumo" },
    { id: "coleta", title: "1. Coleta de Dados" },
    { id: "uso", title: "2. Uso das Informações" },
    { id: "compartilhamento", title: "3. Compartilhamento" },
    { id: "seguranca", title: "4. Segurança" },
    { id: "direitos", title: "5. Seus Direitos" },
    { id: "alteracoes", title: "6. Alterações" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR DE NAVEGAÇÃO (Sticky) */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-28 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 px-2 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#1E3A8A]" /> 
                Navegação
              </h3>
              <nav className="flex flex-col space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    {item.title}
                  </button>
                ))}
              </nav>

              <Separator className="my-6" />

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-[#1E3A8A] mb-1 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" /> Dúvidas de Privacidade?
                </h4>
                <Link href="/contato" className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center">
                  Fale Conosco <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <main className="flex-1 max-w-4xl space-y-12">
            
            {/* Introdução */}
            <div className="prose prose-slate max-w-none text-slate-600">
              <p className="text-lg leading-relaxed">
                No <strong>Novo Tempo Conecta</strong>, valorizamos sua confiança e estamos comprometidos em proteger sua privacidade. Esta política descreve as medidas que tomamos para garantir a segurança dos seus dados pessoais.
              </p>
              <p>
                Última atualização: <span className="font-semibold text-slate-900">07 de Dezembro de 2025</span>
              </p>
            </div>

            {/* Resumo (Cards) */}
            <section id="resumo" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-l-4 border-[#1E3A8A] pl-3">
                Resumo dos Pontos Principais
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                
                <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold text-[#1E3A8A] flex items-center gap-2">
                            <Eye className="w-5 h-5" /> Coleta Mínima
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 font-medium">
                            Coletamos apenas os dados essenciais (como nome e e-mail) para que você possa usar a plataforma.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold text-[#1E3A8A] flex items-center gap-2">
                            <Users className="w-5 h-5" /> Uso Responsável
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 font-medium">
                            Usamos seus dados para melhorar sua experiência. Não vendemos suas informações para terceiros.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold text-[#1E3A8A] flex items-center gap-2">
                            <Lock className="w-5 h-5" /> Segurança
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 font-medium">
                            Empregamos criptografia e práticas de segurança modernas para manter seus dados protegidos.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold text-[#1E3A8A] flex items-center gap-2">
                            <FileText className="w-5 h-5" /> Seus Direitos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 font-medium">
                            Você tem controle total. Pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento.
                        </p>
                    </CardContent>
                </Card>
              </div>
            </section>

            {/* Conteúdo Detalhado */}
            <div className="space-y-10">
              
              <section id="coleta" className="scroll-mt-28">
                <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    1. Coleta de Dados
                </h3>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                    <p>
                        Coletamos informações que você nos fornece diretamente ao se cadastrar, como nome, endereço de e-mail e, no caso de empresas, informações comerciais públicas.
                    </p>
                    <p>
                        Também podemos coletar dados técnicos de uso (como endereço IP e tipo de navegador) para fins de análise e melhoria da performance do site, sempre de forma anonimizada quando possível.
                    </p>
                </div>
              </section>

              <section id="uso" className="scroll-mt-28">
                <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    2. Uso das Informações
                </h3>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                    <p>Utilizamos suas informações para:</p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-[#1E3A8A]">
                        <li>Fornecer, operar e manter nossa plataforma;</li>
                        <li>Melhorar, personalizar e expandir nossos serviços;</li>
                        <li>Entender e analisar como você usa nosso site;</li>
                        <li>Enviar e-mails, notificações e comunicações importantes sobre sua conta.</li>
                    </ul>
                </div>
              </section>

              <section id="compartilhamento" className="scroll-mt-28">
                <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    3. Compartilhamento de Dados
                </h3>
                <p className="text-slate-700 leading-relaxed">
                    Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para fornecer o serviço (ex: provedores de hospedagem) sob estritos acordos de confidencialidade, ou quando exigido por lei.
                </p>
              </section>

              <section id="seguranca" className="scroll-mt-28">
                <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    4. Segurança dos Dados
                </h3>
                <p className="text-slate-700 leading-relaxed">
                    A segurança das suas informações é uma prioridade. Utilizamos medidas administrativas, técnicas e físicas, como criptografia SSL, para proteger seus dados pessoais contra perda, roubo e uso não autorizado.
                </p>
              </section>

              <section id="direitos" className="scroll-mt-28">
                <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    5. Seus Direitos de Privacidade
                </h3>
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                    <p className="text-slate-700 mb-3">Você tem o direito de:</p>
                    <ul className="grid md:grid-cols-2 gap-3 text-sm font-medium text-slate-800">
                        <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Acessar seus dados</li>
                        <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Corrigir dados incorretos</li>
                        <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Solicitar exclusão</li>
                        <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Revogar consentimento</li>
                    </ul>
                </div>
              </section>

              <section id="alteracoes" className="scroll-mt-28">
                <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    6. Alterações na Política
                </h3>
                <p className="text-slate-700 leading-relaxed">
                    Podemos atualizar nossa Política de Privacidade periodicamente. Recomendamos que você revise esta página regularmente para quaisquer alterações. Notificaremos sobre mudanças significativas através de um aviso em nosso site ou por e-mail.
                </p>
              </section>

            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}