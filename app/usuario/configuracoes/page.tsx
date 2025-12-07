"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Bell, Shield, Eye, Mail, Save, Edit3, Star, Heart, ArrowRight } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

export default function UsuarioConfiguracoes() {
  const [notifications, setNotifications] = useState({
    emailReviews: true, emailComments: true, emailPromotions: false,
    pushReviews: true, pushComments: true, pushPromotions: false,
  })
  const [privacy, setPrivacy] = useState({
    profileVisible: true, showEmail: false, showPhone: false, allowMessages: true,
  })

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-[#1E3A8A] pb-24 pt-10 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
            <div className="flex justify-between items-center text-white mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Configurações</h1>
                    <p className="text-blue-200">Personalize sua experiência na plataforma</p>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-20 relative z-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

           {/* Coluna Esquerda - Formulários */}
           <div className="lg:col-span-8 space-y-6">
                <Card className="border border-slate-200 shadow-sm bg-white">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="flex items-center gap-2 text-[#1E3A8A] text-lg font-bold">
                            <Bell className="h-5 w-5" /> Notificações
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div>
                            <h4 className="font-medium mb-4 flex items-center gap-2 text-slate-800 text-sm uppercase tracking-wide">
                                <Mail className="h-4 w-4 text-slate-400" /> Por E-mail
                            </h4>
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="email-reviews" className="text-base text-slate-700">Respostas às minhas avaliações</Label>
                                        <p className="text-xs text-slate-500">Seja notificado quando um estabelecimento responder.</p>
                                    </div>
                                    <Switch id="email-reviews" checked={notifications.emailReviews} onCheckedChange={(v) => setNotifications(p => ({...p, emailReviews: v}))} className="data-[state=checked]:bg-[#1E3A8A]" />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="email-promotions" className="text-base text-slate-700">Novidades e Destaques</Label>
                                        <p className="text-xs text-slate-500">Receba notícias sobre novos locais no bairro.</p>
                                    </div>
                                    <Switch id="email-promotions" checked={notifications.emailPromotions} onCheckedChange={(v) => setNotifications(p => ({...p, emailPromotions: v}))} className="data-[state=checked]:bg-[#1E3A8A]" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 shadow-sm bg-white">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="flex items-center gap-2 text-[#1E3A8A] text-lg font-bold">
                            <Eye className="h-5 w-5" /> Privacidade
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="profile-visible" className="text-base text-slate-700">Perfil Público</Label>
                                    <p className="text-xs text-slate-500">Permitir que outros usuários vejam suas avaliações agrupadas.</p>
                                </div>
                                <Switch id="profile-visible" checked={privacy.profileVisible} onCheckedChange={(v) => setPrivacy(p => ({...p, profileVisible: v}))} className="data-[state=checked]:bg-[#1E3A8A]" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="show-email" className="text-base text-slate-700">Mostrar E-mail</Label>
                                    <p className="text-xs text-slate-500">Exibir seu endereço de e-mail no seu perfil público.</p>
                                </div>
                                <Switch id="show-email" checked={privacy.showEmail} onCheckedChange={(v) => setPrivacy(p => ({...p, showEmail: v}))} className="data-[state=checked]:bg-[#1E3A8A]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button size="lg" className="bg-[#1E3A8A] hover:bg-blue-900 text-white shadow-md">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
           </div>

           {/* Coluna Direita (Sidebar) */}
           <div className="lg:col-span-4 space-y-6">
                <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b border-slate-200">
                        <h3 className="font-bold text-[#1E3A8A]">Acesso Rápido</h3>
                    </div>
                    <CardContent className="p-2">
                        <nav className="flex flex-col space-y-1">
                            <Button asChild variant="ghost" className="justify-start w-full text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 font-medium h-12">
                                <Link href="/usuario/dashboard">
                                    <Edit3 className="h-5 w-5 mr-3 text-slate-400" />
                                    Meu Perfil
                                </Link>
                            </Button>
                            <Separator className="bg-slate-100" />
                            <Button asChild variant="ghost" className="justify-start w-full text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 font-medium h-12">
                                <Link href="/usuario/avaliacoes">
                                    <Star className="h-5 w-5 mr-3 text-yellow-500" />
                                    Minhas Avaliações
                                </Link>
                            </Button>
                            <Separator className="bg-slate-100" />
                            <Button asChild variant="ghost" className="justify-start w-full text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 font-medium h-12">
                                <Link href="/usuario/favoritos">
                                    <Heart className="h-5 w-5 mr-3 text-red-500" />
                                    Locais Favoritos
                                </Link>
                            </Button>
                            <Separator className="bg-slate-100" />
                            <Button asChild variant="ghost" className="justify-start w-full text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 font-medium h-12 bg-blue-50 text-[#1E3A8A]">
                                <Link href="/usuario/configuracoes">
                                    <Shield className="h-5 w-5 mr-3 text-slate-400" />
                                    Configurações
                                </Link>
                            </Button>
                        </nav>
                    </CardContent>
                </Card>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-blue-900">Segurança da Conta</h4>
                            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                Nunca compartilhamos seus dados pessoais com terceiros sem sua permissão explícita.
                            </p>
                        </div>
                    </div>
                </div>
           </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}