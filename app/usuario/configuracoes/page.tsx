// app/usuario/configuracoes/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Bell, Shield, Eye, Trash2, Download, Key, Mail, Smartphone, Globe, Save } from "lucide-react"
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
  const [security, setSecurity] = useState({
    twoFactor: false, loginAlerts: true,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
            <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white"><Bell className="h-5 w-5" />Notificações</CardTitle>
                  <CardDescription className="text-white/80">Configure como e quando você quer receber notificações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4 flex items-center gap-2 text-white/90"><Mail className="h-4 w-4" />Notificações por E-mail</h4>
                    <div className="space-y-4 ml-6">
                      <div className="flex items-center justify-between"><Label htmlFor="email-reviews" className="text-white/90">Respostas às minhas avaliações</Label><Switch id="email-reviews" checked={notifications.emailReviews} onCheckedChange={(v) => setNotifications(p => ({...p, emailReviews: v}))} /></div>
                      <div className="flex items-center justify-between"><Label htmlFor="email-comments" className="text-white/90">Respostas aos meus comentários</Label><Switch id="email-comments" checked={notifications.emailComments} onCheckedChange={(v) => setNotifications(p => ({...p, emailComments: v}))} /></div>
                      <div className="flex items-center justify-between"><Label htmlFor="email-promotions" className="text-white/90">Promoções e novidades</Label><Switch id="email-promotions" checked={notifications.emailPromotions} onCheckedChange={(v) => setNotifications(p => ({...p, emailPromotions: v}))} /></div>
                    </div>
                  </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white"><Eye className="h-5 w-5" />Privacidade</CardTitle>
                  <CardDescription className="text-white/80">Controle quais informações são visíveis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between"><Label htmlFor="profile-visible" className="text-white/90">Perfil público</Label><Switch id="profile-visible" checked={privacy.profileVisible} onCheckedChange={(v) => setPrivacy(p => ({...p, profileVisible: v}))} /></div>
                  <div className="flex items-center justify-between"><Label htmlFor="show-email" className="text-white/90">Mostrar e-mail no perfil</Label><Switch id="show-email" checked={privacy.showEmail} onCheckedChange={(v) => setPrivacy(p => ({...p, showEmail: v}))} /></div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button size="lg"><Save className="h-4 w-4 mr-2" />Salvar Configurações</Button>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}