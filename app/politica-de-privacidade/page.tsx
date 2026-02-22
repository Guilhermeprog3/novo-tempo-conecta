"use client"

import { Shield, Lock, Eye, Database } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-[#00CCFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-[#002240]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#002240] mb-4">Política de Privacidade</h1>
          <p className="text-muted-foreground">Última atualização: 22 de Fevereiro de 2026</p>
        </div>

        <Card className="bg-white border-[#00CCFF]/20 shadow-sm">
          <CardContent className="p-6 md:p-8 prose prose-slate max-w-none">
            <p className="text-slate-600 lead">
              A sua privacidade é importante para nós. Esta política explica como o 
              <strong> Novo Tempo Conecta</strong> coleta, usa e protege as suas informações pessoais.
            </p>

            <h2 className="text-[#002240] text-xl font-bold mt-8 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#00CCFF]" />
              1. Informações que Coletamos
            </h2>
            <p className="text-slate-600">
              Coletamos informações que você nos fornece diretamente, como:
            </p>
            <ul className="text-slate-600 list-disc pl-6 space-y-2 mt-2">
              <li>Nome, e-mail e telefone ao criar uma conta.</li>
              <li>Informações do seu negócio (caso seja um empresário).</li>
              <li>Dados de localização (quando autorizado) para o mapa interativo.</li>
            </ul>

            <h2 className="text-[#002240] text-xl font-bold mt-8 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#F7B000]" />
              2. Como Usamos as suas Informações
            </h2>
            <p className="text-slate-600">
              Utilizamos os dados coletados para:
            </p>
            <ul className="text-slate-600 list-disc pl-6 space-y-2 mt-2">
              <li>Fornecer, operar e manter a plataforma.</li>
              <li>Melhorar a sua experiência de usuário.</li>
              <li>Comunicar atualizações importantes ou responder ao suporte.</li>
            </ul>

            <h2 className="text-[#002240] text-xl font-bold mt-8 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#002240]" />
              3. Proteção de Dados
            </h2>
            <p className="text-slate-600">
              Implementamos medidas de segurança para proteger as suas informações pessoais contra 
              acessos não autorizados, alteração ou destruição. No entanto, nenhum método de 
              transmissão pela internet é 100% seguro.
            </p>

            <h2 className="text-[#002240] text-xl font-bold mt-8 mb-4">4. Compartilhamento de Informações</h2>
            <p className="text-slate-600">
              Não vendemos, trocamos ou alugamos as suas informações pessoais. Podemos compartilhar 
              dados genéricos agregados que não o identifiquem pessoalmente. Os dados públicos 
              do seu negócio (empresários) serão exibidos na plataforma conforme o seu cadastro.
            </p>

            <h2 className="text-[#002240] text-xl font-bold mt-8 mb-4">5. Seus Direitos</h2>
            <p className="text-slate-600">
              Você tem o direito de acessar, corrigir ou excluir as suas informações pessoais. 
              Para exercer esses direitos, entre em contato conosco através da nossa página de suporte.
            </p>

          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}