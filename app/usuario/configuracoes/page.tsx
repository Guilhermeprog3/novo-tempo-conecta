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

export default function UsuarioConfiguracoes() {
  const [notifications, setNotifications] = useState({
    emailReviews: true,
    emailComments: true,
    emailPromotions: false,
    pushReviews: true,
    pushComments: true,
    pushPromotions: false,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }))
  }

  const handleSecurityChange = (key: string, value: boolean) => {
    setSecurity((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/usuario/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
            <p className="text-muted-foreground">Gerencie suas preferências de conta, privacidade e notificações</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>Configure como e quando você quer receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Notificações por E-mail
                </h4>
                <div className="space-y-4 ml-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-reviews">Respostas às minhas avaliações</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba um e-mail quando alguém responder suas avaliações
                      </p>
                    </div>
                    <Switch
                      id="email-reviews"
                      checked={notifications.emailReviews}
                      onCheckedChange={(value) => handleNotificationChange("emailReviews", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-comments">Respostas aos meus comentários</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba um e-mail quando estabelecimentos responderem seus comentários
                      </p>
                    </div>
                    <Switch
                      id="email-comments"
                      checked={notifications.emailComments}
                      onCheckedChange={(value) => handleNotificationChange("emailComments", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-promotions">Promoções e novidades</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba ofertas especiais e atualizações da plataforma
                      </p>
                    </div>
                    <Switch
                      id="email-promotions"
                      checked={notifications.emailPromotions}
                      onCheckedChange={(value) => handleNotificationChange("emailPromotions", value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Notificações Push
                </h4>
                <div className="space-y-4 ml-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-reviews">Respostas às minhas avaliações</Label>
                      <p className="text-sm text-muted-foreground">Notificações instantâneas no navegador</p>
                    </div>
                    <Switch
                      id="push-reviews"
                      checked={notifications.pushReviews}
                      onCheckedChange={(value) => handleNotificationChange("pushReviews", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-comments">Respostas aos meus comentários</Label>
                      <p className="text-sm text-muted-foreground">Notificações instantâneas no navegador</p>
                    </div>
                    <Switch
                      id="push-comments"
                      checked={notifications.pushComments}
                      onCheckedChange={(value) => handleNotificationChange("pushComments", value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Privacidade
              </CardTitle>
              <CardDescription>Controle quais informações são visíveis para outros usuários</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profile-visible">Perfil público</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir que outros usuários vejam seu perfil e atividades
                  </p>
                </div>
                <Switch
                  id="profile-visible"
                  checked={privacy.profileVisible}
                  onCheckedChange={(value) => handlePrivacyChange("profileVisible", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-email">Mostrar e-mail no perfil</Label>
                  <p className="text-sm text-muted-foreground">Seu e-mail será visível para outros usuários</p>
                </div>
                <Switch
                  id="show-email"
                  checked={privacy.showEmail}
                  onCheckedChange={(value) => handlePrivacyChange("showEmail", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-phone">Mostrar telefone no perfil</Label>
                  <p className="text-sm text-muted-foreground">Seu telefone será visível para outros usuários</p>
                </div>
                <Switch
                  id="show-phone"
                  checked={privacy.showPhone}
                  onCheckedChange={(value) => handlePrivacyChange("showPhone", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-messages">Permitir mensagens diretas</Label>
                  <p className="text-sm text-muted-foreground">Outros usuários podem enviar mensagens privadas</p>
                </div>
                <Switch
                  id="allow-messages"
                  checked={privacy.allowMessages}
                  onCheckedChange={(value) => handlePrivacyChange("allowMessages", value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </CardTitle>
              <CardDescription>Mantenha sua conta segura com essas configurações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Autenticação de dois fatores</Label>
                  <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança à sua conta</p>
                </div>
                <Switch
                  id="two-factor"
                  checked={security.twoFactor}
                  onCheckedChange={(value) => handleSecurityChange("twoFactor", value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="login-alerts">Alertas de login</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações quando alguém acessar sua conta</p>
                </div>
                <Switch
                  id="login-alerts"
                  checked={security.loginAlerts}
                  onCheckedChange={(value) => handleSecurityChange("loginAlerts", value)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Alterar Senha</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                </div>
                <Button variant="outline" className="w-full md:w-auto bg-transparent">
                  <Key className="h-4 w-4 mr-2" />
                  Alterar Senha
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dados da Conta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Dados da Conta
              </CardTitle>
              <CardDescription>Gerencie seus dados pessoais e preferências da conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Meus Dados
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Exportar Avaliações
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-destructive">Zona de Perigo</h4>
                <p className="text-sm text-muted-foreground">
                  Essas ações são irreversíveis. Tenha certeza antes de prosseguir.
                </p>
                <Button variant="destructive" className="w-full md:w-auto">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Conta Permanentemente
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Botão Salvar */}
          <div className="flex justify-end">
            <Button size="lg">
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
