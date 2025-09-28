// app/politica-de-privacidade/page.tsx
"use client"

import { Shield, Eye, Users, Lock, Cookie, FileText, AlertTriangle, Mail } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function PoliticaPrivacidadePage() {

  const sections = [
    { id: "coleta", title: "1. Coleta de Dados", icon: Eye, content: "Coletamos informações que você nos fornece (nome, e-mail) e dados de uso para melhorar nossos serviços. Não coletamos dados sensíveis sem seu consentimento explícito." },
    { id: "uso", title: "2. Uso das Informações", icon: Users, content: "Utilizamos seus dados para personalizar sua experiência, enviar notificações relevantes e garantir a segurança da plataforma. Seus dados não são vendidos a terceiros." },
    { id: "compartilhamento", title: "3. Compartilhamento de Dados", icon: Shield, content: "Podemos compartilhar dados com prestadores de serviço sob estrito acordo de confidencialidade ou se exigido por lei." },
    { id: "seguranca", title: "4. Segurança dos Dados", icon: Lock, content: "Empregamos medidas de segurança como criptografia para proteger suas informações contra acesso não autorizado." },
    { id: "cookies", title: "5. Cookies", icon: Cookie, content: "Usamos cookies para o funcionamento essencial do site e para análises de performance. Você pode gerenciar suas preferências de cookies em seu navegador." },
    { id: "direitos", title: "6. Seus Direitos", icon: FileText, content: "Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Para qualquer solicitação, entre em contato conosco." },
    { id: "alteracoes", title: "7. Alterações na Política", icon: AlertTriangle, content: "Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas através da plataforma ou por e-mail." },
    { id: "contato", title: "8. Contato", icon: Mail, content: "Se tiver dúvidas sobre esta política, entre em contato pelo e-mail: privacidade@novotempoconecta.com.br." },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Política de <span className="text-primary">Privacidade</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Entenda como cuidamos dos seus dados com transparência e segurança.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Última atualização: 08/2025</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <AccordionItem key={section.id} value={section.id} className="bg-[#1E3A8A] border-blue-700 px-4 rounded-lg mb-2">
                <AccordionTrigger className="text-lg font-semibold text-white hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {section.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 text-white/80 leading-relaxed">
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
      <Footer />
    </div>
  )
}