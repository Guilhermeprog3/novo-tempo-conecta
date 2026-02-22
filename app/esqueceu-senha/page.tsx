"use client"

import { Mail, ArrowLeft, Loader2, KeyRound, AlertTriangle, CheckCircle2, Info } from "lucide-react"
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
      console.error("Erro ao redefinir senha:", error.code);
      let errorMessage = "Ocorreu um erro ao tentar enviar o e-mail.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Não encontramos uma conta associada a este e-mail.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "O formato do e-mail é inválido.";
      }

      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "pl-10 bg-white/5 border-[#00CCFF]/30 text-white placeholder:text-white/50 focus-visible:ring-[#00CCFF]";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#001529] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="text-white hover:text-[#00CCFF] hover:bg-white/5">
              <Link href="/login" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o login
              </Link>
            </Button>
          </div>

          <Card className="shadow-2xl bg-[#002240] border-[#00CCFF]/20 text-white">
            <CardHeader className="text-center border-b border-[#00CCFF]/10 mb-6">
              <div className="w-16 h-16 bg-[#00CCFF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-[#00CCFF]" />
              </div>
              <CardTitle className="text-3xl font-bold text-[#00CCFF]">Recuperar Senha</CardTitle>
              <CardDescription className="text-gray-400">
                Enviaremos as instruções de redefinição para o seu e-mail.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white flex items-center gap-2">
                      <Info size={14} className="text-[#00CCFF]" /> E-mail cadastrado
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00CCFF]/60 w-4 h-4" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        className={inputStyles} 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#00CCFF] text-[#002240] hover:bg-[#00CCFF]/90 font-bold h-12 text-lg shadow-lg" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar instruções"
                  )}
                </Button>
              </form>

              {message && (
                <div className={`flex items-start p-4 text-sm rounded-lg border animate-in fade-in slide-in-from-top-2 ${
                  message.type === 'success' 
                    ? 'bg-green-900/20 text-green-200 border-green-500/50' 
                    : 'bg-red-900/20 text-red-200 border-red-500/50'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 text-red-400" />
                  )}
                  <span className="leading-tight">{message.text}</span>
                </div>
              )}

              <div className="text-center pt-2">
                <p className="text-sm text-gray-400">
                  Ainda não tem uma conta?{" "}
                  <Link href="/cadastro" className="text-[#F7B000] hover:underline font-medium">
                    Cadastre-se aqui
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