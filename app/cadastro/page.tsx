"use client"

import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Loader2, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Header } from "@/components/navigation/header"

export default function CadastroPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (!formData.terms) {
      setErrors({ form: "Você deve aceitar os termos de uso e a política de privacidade." });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "As senhas não coincidem!", form: "Verifique os campos com erro." });
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const userDataToSave = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: 'user',
        createdAt: new Date(),
      };
      
      await setDoc(doc(db, "users", user.uid), userDataToSave);

      const userForStorage = {
        name: formData.name,
        email: formData.email,
        avatar: null
      };
      
      localStorage.setItem("user", JSON.stringify(userForStorage));
      localStorage.setItem("userType", "user");

      router.push('/');

    } catch (error: any) {
      let newErrors: { [key: string]: string } = {};
      switch (error.code) {
        case 'auth/email-already-in-use':
          newErrors.email = "Este e-mail já está em uso.";
          break;
        case 'auth/weak-password':
          newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
          break;
        default:
          newErrors.form = "Ocorreu um erro inesperado. Tente novamente.";
          break;
      }
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "pl-10 bg-white/5 border-[#00CCFF]/30 text-white placeholder:text-white/50 focus-visible:ring-[#00CCFF]";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#001529] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="text-white hover:text-[#00CCFF] hover:bg-white/5">
              <Link href="/" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao início
              </Link>
            </Button>
          </div>

          <Card className="shadow-2xl bg-[#002240] border-[#00CCFF]/20 text-white">
            <CardHeader className="text-center border-b border-[#00CCFF]/10 mb-6">
              <div className="w-16 h-16 bg-[#00CCFF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-[#00CCFF]" />
              </div>
              <CardTitle className="text-3xl font-bold text-[#00CCFF]">Criar sua conta</CardTitle>
              <CardDescription className="text-gray-400">Junte-se à comunidade e conecte-se com o comércio local</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase text-[#00CCFF] flex items-center gap-2">
                    <Info size={16} /> Dados Pessoais
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00CCFF]/60 w-4 h-4" />
                        <Input id="name" type="text" placeholder="Seu nome completo" className={inputStyles} required value={formData.name} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00CCFF]/60 w-4 h-4" />
                        <Input id="phone" type="tel" placeholder="(11) 99999-9999" className={inputStyles} required value={formData.phone} onChange={handleChange} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00CCFF]/60 w-4 h-4" />
                      <Input id="email" type="email" placeholder="seu@email.com" className={inputStyles} required value={formData.email} onChange={handleChange} />
                    </div>
                    {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-4 border-t border-white/5 pt-6">
                  <h3 className="text-sm font-semibold uppercase text-[#00CCFF] flex items-center gap-2">
                    <Lock size={16} /> Segurança
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00CCFF]/60 w-4 h-4" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          className={`${inputStyles} pr-10`}
                          required
                          value={formData.password}
                          onChange={handleChange}
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

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00CCFF]/60 w-4 h-4" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Repita sua senha"
                          className={`${inputStyles} pr-10`}
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00CCFF] transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      className="border-[#00CCFF] data-[state=checked]:bg-[#00CCFF]"
                      checked={formData.terms}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, terms: !!checked }))}
                    />
                    <Label htmlFor="terms" className="text-sm text-white font-normal leading-none cursor-pointer">
                      Concordo com os{" "}
                      <Link href="/termos-de-uso" target="_blank" className="text-[#F7B000] hover:underline font-medium">
                        Termos de Uso
                      </Link>
                      {" "}e{" "}
                      <Link href="/politica-de-privacidade" target="_blank" className="text-[#F7B000] hover:underline font-medium">
                        Política de Privacidade
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full bg-[#00CCFF] text-[#002240] hover:bg-[#00CCFF]/90 font-bold h-12 text-lg" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Criar minha conta"}
                  </Button>
                </div>
              </form>

              <div className="text-center pt-2 space-y-3">
                <p className="text-sm text-gray-400">
                  Já tem uma conta?{" "}
                  <Link href="/login" className="text-[#F7B000] hover:underline font-medium">
                    Faça login aqui
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