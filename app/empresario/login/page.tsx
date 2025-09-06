"use client"

import { Eye, EyeOff, Mail, Lock, ArrowLeft, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import React, { useState } from "react" // Importar React
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function EmpresarioLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // CORREÇÃO APLICADA AQUI
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login realizado com sucesso!");
      // Redirecionar para o dashboard do empresário
      window.location.href = '/empresario/dashboard';
    } catch (error) { // CORREÇÃO APLICADA AQUI
      console.error("Erro ao fazer login:", error);
      if (error instanceof Error) {
        alert("Erro ao fazer login: " + error.message);
      } else {
        alert("Ocorreu um erro desconhecido ao fazer login.");
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
          </Button>
        </div>

        <Card className="shadow-lg border-primary/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Área do Empresário</CardTitle>
            <CardDescription>Acesse o painel de controle do seu estabelecimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail empresarial</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input id="email" type="email" placeholder="empresa@email.com" className="pl-10" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    className="pl-10 pr-10"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Lembrar de mim
                  </Label>
                </div>
                <Link href="/esqueceu-senha" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg">Acessar Painel</Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou</span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Ainda não cadastrou seu negócio?{" "}
                <Link href="/empresario/cadastro" className="text-primary hover:underline font-medium">
                  Cadastre-se aqui
                </Link>
              </p>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Área do morador</p>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/login">Entrar como Morador</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
