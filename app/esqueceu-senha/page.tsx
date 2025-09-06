"use client"

import type React from "react"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSubmitted(true);
    } catch (error) { 
      console.error("Erro ao enviar e-mail de redefinição de senha:", error);
      if (error instanceof Error) {
        alert("Erro ao enviar e-mail: " + error.message);
      } else {
        alert("Ocorreu um erro desconhecido ao enviar o e-mail.");
      }
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold">E-mail enviado!</CardTitle>
              <CardDescription>
                Enviamos as instruções para recuperação de senha para <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
                <p className="text-xs text-muted-foreground">
                  Não recebeu o e-mail? Verifique sua pasta de spam ou{" "}
                  <button onClick={() => setIsSubmitted(false)} className="text-primary hover:underline">
                    tente novamente
                  </button>
                </p>
              </div>

              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/login">Voltar ao Login</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/">Ir para o Início</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao login
            </Link>
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Esqueceu sua senha?</CardTitle>
            <CardDescription>Digite seu e-mail e enviaremos instruções para redefinir sua senha</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail cadastrado"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Enviar instruções
              </Button>
            </form>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Lembrou da senha?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Fazer login
                </Link>
              </p>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Problemas com acesso?</p>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/sobre">Entre em contato</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
