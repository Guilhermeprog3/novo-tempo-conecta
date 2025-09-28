// app/esqueceu-senha/page.tsx
"use client"

import type React from "react"
import { Mail, ArrowLeft, CheckCircle, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useEffect } from "react"
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Header } from "@/components/navigation/header"

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSubmitted(true);
      setTimer(60); // Inicia o cronômetro
    } catch (error: any) {
      console.error("Erro ao enviar e-mail de redefinição de senha:", error);
      if (error.code === 'auth/user-not-found') {
        setError("Nenhuma conta encontrada com este e-mail.");
      } else {
        setError("Ocorreu um erro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleResendEmail = async () => {
    if (timer > 0) return;
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setTimer(60); // Reinicia o cronômetro
    } catch (error) {
      console.error("Erro ao reenviar e-mail:", error);
      setError("Falha ao reenviar o e-mail. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">E-mail enviado!</CardTitle>
                <CardDescription className="text-white/80">
                  Enviamos as instruções para recuperação de senha para <strong>{email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-sm text-white/80">
                    Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                  </p>
                  <div className="text-xs text-white/70">
                    Não recebeu o e-mail? Verifique sua pasta de spam ou {" "}
                    <button
                        onClick={handleResendEmail}
                        disabled={timer > 0 || loading}
                        className="text-yellow-400 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed disabled:no-underline"
                    >
                        {loading ? 'Enviando...' : timer > 0 ? `Aguarde (${timer}s)` : 'envie novamente'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link href="/login">Voltar ao Login</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent text-white hover:bg-white/10 hover:text-white" asChild>
                    <Link href="/">Ir para o Início</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao login
              </Link>
            </Button>
          </div>

          <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Esqueceu sua senha?</CardTitle>
              <CardDescription className="text-white/80">Digite seu e-mail e enviaremos instruções para redefinir sua senha</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Digite seu e-mail cadastrado"
                      className="pl-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                   {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Enviar instruções
                </Button>

                {error && (
                  <div className="flex items-center p-3 text-sm text-red-200 bg-red-900/30 border border-red-500/50 rounded-lg mt-4">
                      <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{error}</span>
                  </div>
                )}
              </form>

              <div className="text-center">
                <p className="text-sm text-white/80">
                  Lembrou da senha?{" "}
                  <Link href="/login" className="text-yellow-400 hover:underline font-medium">
                    Fazer login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}