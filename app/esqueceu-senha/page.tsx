"use client"

import { Mail, ArrowLeft, Loader2, KeyRound, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import React, { useState } from "react"
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Header } from "@/components/navigation/header"

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
        await sendPasswordResetEmail(auth, email);
        setMessage({ type: 'success', text: 'E-mail de redefinição enviado! Verifique sua caixa de entrada.' });
    } catch (error: any) {
        console.error("Erro ao redefinir senha:", error.code, error.message);
        let errorMessage = "Ocorreu um erro ao tentar enviar o e-mail.";
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = "Não encontramos uma conta associada a este e-mail.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "E-mail inválido.";
        }

        setMessage({ type: 'error', text: errorMessage });
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o login
              </Link>
            </Button>
          </div>

          <Card className="shadow-lg bg-[#002240] border-[#00CCFF]/20 text-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-[#00CCFF] rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-[#002240]" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Esqueceu sua senha?</CardTitle>
              <CardDescription className="text-white/80">
                Digite seu e-mail abaixo e enviaremos instruções para redefinir sua senha.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#00CCFF]">E-mail cadastrado</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      className="pl-10 bg-white/5 border-[#00CCFF]/30 text-white placeholder:text-white/50 focus-visible:ring-[#00CCFF]" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-[#00CCFF] text-[#002240] hover:bg-[#00CCFF]/80" size="lg" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Enviar instruções
                </Button>
              </form>

              {message && (
                <div className={`flex items-start p-3 text-sm rounded-lg mt-4 border ${message.type === 'success' ? 'bg-green-900/30 text-green-200 border-green-500/50' : 'bg-red-900/30 text-red-200 border-red-500/50'}`}>
                  {message.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0 text-green-400" />
                  ) : (
                      <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 text-red-400" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}