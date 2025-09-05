"use client"

import { ArrowLeft, Save, Bell, Eye, Shield, Trash2, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function EmpresarioConfiguracoesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/empresario/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Configurações</h1>
                <p className="text-sm text-muted-foreground">Gerencie as configurações da sua conta</p>
              </div>
            </div>

            <Button>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notificações</span>
              </CardTitle>
              <CardDescription>Configure como você quer receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Novas avaliações</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações quando alguém avaliar seu negócio</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Mensagens de contato</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações quando clientes entrarem em contato pelo site
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Relatórios semanais</Label>
                  <p className="text-sm text-muted-foreground">Resumo semanal das atividades do seu perfil</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dicas e novidades</Label>
                  <p className="text-sm text-muted-foreground">Receba dicas para melhorar seu negócio na plataforma</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Privacidade e Visibilidade</span>
              </CardTitle>
              <CardDescription>Controle como seu negócio aparece na plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Perfil público</Label>
                  <p className="text-sm text-muted-foreground">Seu negócio aparece nas buscas e no mapa</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Mostrar telefone</Label>
                  <p className="text-sm text-muted-foreground">Exibir número de telefone no perfil público</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Permitir avaliações</Label>
                  <p className="text-sm text-muted-foreground">Clientes podem avaliar e comentar sobre seu negócio</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Estatísticas públicas</Label>
                  <p className="text-sm text-muted-foreground">Mostrar número de avaliações e nota média</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Segurança da Conta</span>
              </CardTitle>
              <CardDescription>Mantenha sua conta segura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha atual</Label>
                  <Input id="currentPassword" type="password" placeholder="Digite sua senha atual" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input id="newPassword" type="password" placeholder="Digite a nova senha" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirme a nova senha" />
                </div>

                <Button variant="outline" className="bg-transparent">
                  Alterar Senha
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Autenticação em duas etapas</Label>
                  <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança à sua conta</p>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Dados</CardTitle>
              <CardDescription>Controle seus dados na plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Exportar dados</Label>
                  <p className="text-sm text-muted-foreground">Baixe uma cópia de todos os seus dados da plataforma</p>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Importar dados</Label>
                  <p className="text-sm text-muted-foreground">Importe dados de outras plataformas</p>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  Importar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>Ações irreversíveis para sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Desativar conta temporariamente</Label>
                  <p className="text-sm text-muted-foreground">
                    Seu perfil ficará oculto, mas os dados serão preservados
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-destructive text-destructive bg-transparent">
                  Desativar
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-destructive">Excluir conta permanentemente</Label>
                  <p className="text-sm text-muted-foreground">
                    Esta ação não pode ser desfeita. Todos os dados serão perdidos.
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
