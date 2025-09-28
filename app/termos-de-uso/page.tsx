// app/termos-de-uso/page.tsx
import { FileText, Shield, Users, Lock, Eye } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

export default function TermosDeUsoPage() {
  const sections = [
    { id: "aceitacao", title: "1. Aceitação dos Termos", icon: Shield, content: "Ao acessar e usar a plataforma Novo Tempo Conecta, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nossa plataforma." },
    { id: "uso", title: "2. Uso da Plataforma", icon: Users, content: "É permitido usar nossa plataforma para descobrir estabelecimentos, deixar avaliações honestas e interagir com a comunidade. É proibido publicar conteúdo falso, usar a plataforma para fins ilegais ou tentar prejudicar seu funcionamento." },
    { id: "contas", title: "3. Contas de Usuários", icon: Lock, content: "Você é responsável pela segurança de sua conta e por todas as atividades nela realizadas. Concorda em fornecer informações precisas e a nos notificar sobre qualquer uso não autorizado." },
    { id: "privacidade", title: "4. Privacidade e Dados", icon: Eye, content: () => (<>Nossa <Link href="/politica-de-privacidade" className="text-yellow-400 hover:underline">Política de Privacidade</Link> descreve como suas informações são coletadas, usadas e protegidas.</>) },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Termos de <span className="text-primary">Uso</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Conheça as condições para usar a plataforma Novo Tempo Conecta.
          </p>
          <p className="text-sm text-muted-foreground mt-2">Última atualização: 08/2025</p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {sections.map((section) => {
            const Icon = section.icon;
            const Content = section.content;
            return (
              <AccordionItem key={section.id} value={section.id} className="bg-[#1E3A8A] border-blue-700 px-4 rounded-lg mb-2">
                <AccordionTrigger className="text-lg font-semibold text-white hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {section.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 text-white/80 leading-relaxed">
                  {typeof Content === 'function' ? <Content /> : Content}
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