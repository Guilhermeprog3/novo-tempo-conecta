"use client"

import { Mail, Phone, MapPin, User, Book, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Fale Conosco" subtitle="Estamos aqui para ajudar" />

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <Card className="bg-[#002240] border-[#00CCFF]/20 text-white">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Envie uma mensagem</CardTitle>
                <CardDescription className="text-white/80">
                  Preencha o formulário abaixo e nossa equipe retornará o mais breve possível.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#00CCFF]">Seu Nome</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                        <Input id="name" placeholder="Seu nome completo" required className="pl-10 bg-white/5 border-[#00CCFF]/30 text-white placeholder:text-white/50 focus-visible:ring-[#00CCFF]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#00CCFF]">Seu E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                        <Input id="email" type="email" placeholder="seu@email.com" required className="pl-10 bg-white/5 border-[#00CCFF]/30 text-white placeholder:text-white/50 focus-visible:ring-[#00CCFF]" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[#00CCFF]">Assunto</Label>
                    <div className="relative">
                      <Book className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                      <Input id="subject" placeholder="Ex: Dúvida sobre cadastro" required className="pl-10 bg-white/5 border-[#00CCFF]/30 text-white placeholder:text-white/50 focus-visible:ring-[#00CCFF]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#00CCFF]">Mensagem</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                      <Textarea
                        id="message"
                        placeholder="Escreva sua mensagem detalhada aqui..."
                        required
                        className="min-h-[120px] pl-10 bg-white/5 border-[#00CCFF]/30 text-white placeholder:text-white/50 focus-visible:ring-[#00CCFF]"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-[#00CCFF] text-[#002240] hover:bg-[#00CCFF]/80" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#002240] border-[#00CCFF]/20 text-white">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Outras formas de contato</CardTitle>
                <CardDescription className="text-white/80">
                  Você também pode nos encontrar através dos seguintes canais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-[#00CCFF]/10 text-[#00CCFF]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#00CCFF]">E-mail</h3>
                    <p className="text-white/80">
                      Para suporte geral e dúvidas.
                    </p>
                    <a href="mailto:contato@novotempoconecta.com.br" className="text-white hover:text-[#00CCFF] transition-colors">
                      contato@novotempoconecta.com.br
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-[#00CCFF]/10 text-[#00CCFF]">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#00CCFF]">Telefone / WhatsApp</h3>
                    <p className="text-white/80">
                      Para suporte rápido durante o horário comercial.
                    </p>
                    <p className="font-medium text-white">(11) 99999-8888</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-[#00CCFF]/10 text-[#00CCFF]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#00CCFF]">Endereço</h3>
                    <p className="text-white/80">
                      Bairro Novo Tempo <br />
                      São Paulo - SP, Brasil
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}