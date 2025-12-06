// app/login/page.tsx
"use client"

import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import React, { useState } from "react"
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Header } from "@/components/navigation/header"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Verifica se é um empresário
        const businessDocRef = doc(db, "businesses", user.uid);
        const businessDocSnap = await getDoc(businessDocRef);

        if (businessDocSnap.exists()) {
            // --- CORREÇÃO PARA EMPRESÁRIO ---
            // Salva dados no localStorage para o Header
            const businessData = businessDocSnap.data();
            const userForStorage = {
                name: businessData.businessName,
                email: businessData.email,
                avatar: businessData.avatar || null 
            };
            localStorage.setItem("user", JSON.stringify(userForStorage));
            localStorage.setItem("userType", "business"); // Define o tipo
            
            window.location.href = '/empresario/dashboard'; // Mantém redirect de empresário
            return;
        }

        // Verifica se é um usuário padrão
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            // --- CORREÇÃO PARA CIDADÃO ---
            const userData = userDocSnap.data();
            
            // 1. Salva os dados no localStorage para o Header consumir
            const userForStorage = {
                name: userData.name,
                email: userData.email,
                avatar: userData.avatar || null 
            };
            localStorage.setItem("user", JSON.stringify(userForStorage));
            localStorage.setItem("userType", "user"); // Define o tipo de usuário

            // 2. Redireciona para a página inicial (/)
            window.location.href = '/'; 
            // --- FIM DA CORREÇÃO ---
            return;
        }

        throw new Error("Dados do usuário não encontrados.");

    // --- INÍCIO DA MODIFICAÇÃO (BLOCO CATCH MELHORADO) ---
    } catch (error: any) {
        console.error("Erro detalhado ao fazer login:", error.code, error.message); // Log mais detalhado
        let errorMessage: string;

        // Trata erros específicos do Firebase Auth
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                errorMessage = "E-mail ou senha inválidos.";
                break;
            case 'auth/user-disabled':
                errorMessage = "Esta conta de usuário foi desativada.";
                break;
            case 'auth/network-request-failed':
                errorMessage = "Erro de rede. Verifique sua conexão e tente novamente.";
                break;
            // Erro comum do Firestore
            case 'permission-denied':
                errorMessage = "Erro de permissão. Não foi possível verificar os dados da conta.";
                break;
            default:
                // Trata o erro customizado do 'try'
                if (error.message === "Dados do usuário não encontrados.") {
                    errorMessage = "Sua conta foi autenticada, mas não encontramos um perfil (cidadão ou empresa) associado. Entre em contato com o suporte.";
                } else {
                    // Erro genérico
                    errorMessage = "Ocorreu um erro inesperado. Tente novamente mais tarde.";
                }
                break;
        }
        
        setErrors({ form: errorMessage });
    // --- FIM DA MODIFICAÇÃO ---
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Entrar na sua conta</CardTitle>
              <CardDescription className="text-white/80">Acesse para explorar ou gerenciar seu negócio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input id="email" type="email" placeholder="seu@email.com" className="pl-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      className="pl-10 pr-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60"
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
                        <EyeOff className="w-4 h-4 text-white/60" />
                      ) : (
                        <Eye className="w-4 h-4 text-white/60" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="border-white/50 data-[state=checked]:bg-primary" />
                    <Label htmlFor="remember" className="text-sm text-white/80">
                      Lembrar de mim
                    </Label>
                  </div>
                  <Link href="/esqueceu-senha" className="text-sm text-yellow-400 hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Entrar
                </Button>

                {errors.form && (
                  <div className="flex items-center p-3 text-sm text-red-200 bg-red-900/30 border border-red-500/50 rounded-lg mt-4">
                      <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{errors.form}</span>
                  </div>
                )}
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-blue-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#1E3A8A] px-2 text-white/80">Ou</span>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-white/80">
                  Não tem uma conta?{" "}
                  <Link href="/cadastro" className="text-yellow-400 hover:underline font-medium">
                    Cadastre-se como morador
                  </Link>
                </p>
                <p className="text-sm text-white/80">
                  É um empresário?{" "}
                  <Link href="/empresario/cadastro" className="text-yellow-400 hover:underline font-medium">
                    Cadastre seu negócio
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