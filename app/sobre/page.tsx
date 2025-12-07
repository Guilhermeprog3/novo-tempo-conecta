"use client"

import { 
  GraduationCap, 
  Rocket, 
  Users, 
  Store, 
  Target, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Separator } from "@/components/ui/separator"

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="mb-6 bg-blue-100 text-[#1E3A8A] hover:bg-blue-200 px-4 py-1 text-sm font-bold border-none">
            Conectando Pessoas e Negócios
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight text-balance">
            Impulsionando o Desenvolvimento do <br/>
            {/* CORREÇÃO: Voltando para o amarelo (yellow-500 para melhor leitura no branco) */}
            <span className="text-yellow-500">Novo Tempo</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Uma plataforma digital criada para fortalecer o comércio local, 
            dar visibilidade aos empreendedores e facilitar a vida dos moradores.
          </p>
        </div>
      </section>

      {/* 2. SEÇÃO DESTAQUE: INICIATIVA IFMA */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Lado Esquerdo: Ícone */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-100 to-green-50 rounded-full blur-2xl opacity-60"></div>
                <div className="relative bg-white p-12 rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center">
                  <GraduationCap className="w-32 h-32 text-green-600" strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[#1E3A8A] text-white p-4 rounded-xl shadow-lg flex items-center gap-3">
                  <div className="bg-yellow-400 p-2 rounded-full">
                    <Lightbulb className="w-5 h-5 text-blue-900" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 font-medium">Inovação</p>
                    <p className="font-bold">Tecnologia Social</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Direito: Texto */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 text-green-700 font-semibold bg-green-50 px-4 py-2 rounded-full border border-green-100">
                <GraduationCap className="w-5 h-5" />
                <span>Iniciativa Acadêmica</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Uma realização do <span className="text-green-600">IFMA</span> Campus Timon
              </h2>
              
              <p className="text-lg text-slate-600 leading-relaxed">
                O <strong>Novo Tempo Conecta</strong> nasceu dentro dos laboratórios do Instituto Federal do Maranhão (IFMA). 
                É fruto de um projeto de extensão tecnológica dedicado a aplicar o conhecimento acadêmico 
                para resolver desafios reais da comunidade e fomentar o empreendedorismo local.
              </p>

              <ul className="space-y-4 pt-4">
                {[
                  "Fomento ao desenvolvimento empresarial do bairro.",
                  "Inclusão digital para pequenos comerciantes.",
                  "Fortalecimento da economia circular local.",
                  "Integração entre tecnologia e comunidade."
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-slate-100" />

      <Footer />
    </div>
  )
}