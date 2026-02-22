"use client"

import { Eye, EyeOff, Mail, Lock, Loader2, AlertTriangle, User, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import React, { useState } from "react"
import { useRouter } from "next/navigation" // Importado para navegação otimizada
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Header } from "@/components/navigation/header"

export default function LoginPage() {
  const router = useRouter()
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

      // 1. Tenta encontrar na coleção de empresas
      const businessDocRef = doc(db, "businesses", user.uid);
      const businessDocSnap = await getDoc(businessDocRef);

      if (businessDocSnap.exists()) {
        const businessData = businessDocSnap.data();
        const userForStorage = {
          name: businessData.businessName,
          email: businessData.email,
          avatar: businessData.avatar || null
        };
        localStorage.setItem("user", JSON.stringify(userForStorage));
        localStorage.setItem("userType", "business");
        router.push('/empresario/dashboard');
        return;
      }

      // 2. Tenta encontrar na coleção de usuários comuns
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const userForStorage = {
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar || null,
          role: userData.role || 'user'
        };
        localStorage.setItem("user", JSON.stringify(userForStorage));

        if (userData.role === 'admin') {
          localStorage.setItem("userType", "admin");
          router.push('/admin/dashboard');
        } else {
          localStorage.setItem("userType", "user");
          router.push('/');
        }
        return;
      }

      throw new Error("Dados do usuário não encontrados.");

    } catch (error: any) {
      console.error("Erro ao fazer login:", error.code);
      let errorMessage = "E-mail ou senha inválidos.";

      if (error.code === 'auth/user-disabled') {
        errorMessage = "Esta conta foi desativada.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Sem conexão com a internet.";
      } else if (error.message === "Dados do usuário não encontrados.") {
        errorMessage = "Perfil não encontrado. Entre em contato com o suporte.";
      }

      setErrors({ form: errorMessage });
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
          <Card className="shadow-2xl bg-[#002240] border-[#00CCFF]/20 text-white">
            <CardHeader className="text-center border-b border-[#00CCFF]/10 mb-6">
              <div className="w-16 h-16 bg-[#00CCFF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[#00CCFF]" />
              </div>
              <CardTitle className="text-3xl font-bold text-[#00CCFF]">Login</CardTitle>
              <CardDescription className="text-gray-400">Acesse sua conta para continuar</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00CCFF]/60 w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        className={`${inputStyles} pr-10`}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00CCFF] transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="border-[#00CCFF] data-[state=checked]:bg-[#00CCFF]" />
                    <Label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">
                      Lembrar de mim
                    </Label>
                  </div>
                  <Link href="/esqueceu-senha" className="text-sm text-[#F7B000] hover:underline font-medium">
                    Esqueceu a senha?
                  </Link>
                </div>

                <Button type="submit" className="w-full bg-[#00CCFF] text-[#002240] hover:bg-[#00CCFF]/90 font-bold h-12 text-lg shadow-lg" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Entrar"}
                </Button>

                {errors.form && (
                  <div className="flex items-center p-3 text-sm text-red-200 bg-red-900/30 border border-red-500/50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{errors.form}</span>
                  </div>
                )}
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#002240] px-2 text-gray-500">Ou crie uma nova conta</span>
                </div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-400">
                  É um morador?{" "}
                  <Link href="/cadastro" className="text-[#F7B000] hover:underline font-medium">
                    Cadastre-se aqui
                  </Link>
                </p>
                <div className="border-t border-white/5 pt-4">
                  <p className="text-sm text-gray-400">
                    É um empresário?{" "}
                    <Link href="/cadastro-emp" className="text-[#F7B000] hover:underline font-medium">
                      Cadastre seu negócio
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}