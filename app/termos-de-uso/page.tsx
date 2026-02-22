"use client"

import { FileText, ShieldCheck, AlertCircle } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-[#00CCFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[#002240]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#002240] mb-4">Termos de Uso</h1>
          <p className="text-muted-foreground">Última atualização: 22 de Fevereiro de 2026</p>
        </div>

        <Card className="bg-white border-[#00CCFF]/20 shadow-sm">
          <CardContent className="p-6 md:p-8 prose prose-slate max-w-none">
            <p className="text-slate-600 lead">
              Bem-vindo ao <strong>Novo Tempo Conecta</strong>. Ao aceder e utilizar a nossa plataforma, 
              concorda em cumprir e ficar vinculado aos seguintes termos e condições de uso.
            </p>

            <h2 className="text-[#002240] text-xl font-bold mt-8 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00CCFF]" />
              1. Aceitação dos Termos
            </h2>
            <p className="text-slate-600">
              Ao utilizar este site, você concorda com estes termos de uso na sua totalidade. Se discordar 
              de qualquer parte destes termos, não deverá utilizar o nosso website.
            </p>

            <h2 className="text-[#002240] text-xl font-bold mt-8 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#F7B000]" />
              2. Uso da Plataforma
            </h2>
            <p className="text-slate-600">
              O Novo Tempo Conecta destina-se a facilitar a conexão entre moradores e estabelecimentos comerciais 
              locais. Você concorda em usar a plataforma apenas para fins lícitos e de maneira que não infrinja 
              os direitos de terceiros ou restrinja o uso de outros.
            </p>

            <h2 className="text-[#002240] text-xl font-bold mt-8 mb-4">3. Cadastro e Contas</h2>
            <ul className="text-slate-600 list-disc pl-6 space-y-2">
              <li>Você deve fornecer informações precisas e completas ao criar uma conta.</li>
              <li>Você é responsável por manter a confidencialidade da sua senha.</li>
              <li>Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos.</li>
            </ul>

            <h2 className="text-[#002240] text-xl font-bold mt-8 mb-4">4. Conteúdo do Usuário</h2>
            <p className="text-slate-600">
              Ao publicar avaliações ou informações comerciais, você garante que tem o direito de compartilhar 
              tal conteúdo e que ele não é difamatório, ofensivo ou ilegal.
            </p>

            <h2 className="text-[#002240] text-xl font-bold mt-8 mb-4">5. Limitação de Responsabilidade</h2>
            <p className="text-slate-600">
              Não nos responsabilizamos pelas transações realizadas entre usuários e estabelecimentos listados 
              na plataforma. As informações são fornecidas "como estão" sem garantias de qualquer tipo.
            </p>

          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}