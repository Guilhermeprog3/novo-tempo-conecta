// app/cadastro/page.tsx
"use client"

import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import React, { useState } from "react"
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Header } from "@/components/navigation/header"

export default function CadastroPage() {
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

    let fieldErrors: { [key: string]: string } = {};

    if (formData.password !== formData.confirmPassword) {
      fieldErrors.confirmPassword = "As senhas não coincidem!";
    }

    if (Object.keys(fieldErrors).length > 0) {
        setErrors({...fieldErrors, form: "Preencha corretamente todos os campos."});
        setLoading(false);
        return;
    }


    try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            createdAt: new Date(),
        });

        window.location.href = '/usuario/dashboard';

    } catch (error: any) {
        console.error("Erro ao cadastrar:", error.code, error.message);
        let newErrors: { [key: string]: string } = {};
        switch (error.code) {
            case 'auth/email-already-in-use':
                newErrors.email = "Este e-mail já está em uso.";
                newErrors.form = "Verifique os campos com erro.";
                break;
            case 'auth/invalid-email':
                newErrors.email = "O formato do e-mail é inválido.";
                newErrors.form = "Verifique os campos com erro.";
                break;
            case 'auth/weak-password':
                newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
                newErrors.form = "Verifique os campos com erro.";
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao início
              </Link>
            </Button>
          </div>

          <Card className="shadow-lg bg-[#1E3A8A] border-blue-700 text-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Criar sua conta</CardTitle>
              <CardDescription className="text-white/80">Junte-se à comunidade do Novo Tempo e conecte-se com os negócios locais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/90">Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                      <Input id="name" type="text" placeholder="Seu nome completo" className="pl-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60" required value={formData.name} onChange={handleChange} aria-invalid={!!errors.name} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white/90">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                      <Input id="phone" type="tel" placeholder="(11) 99999-9999" className="pl-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60" required value={formData.phone} onChange={handleChange} aria-invalid={!!errors.phone}/>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input id="email" type="email" placeholder="seu@email.com" className="pl-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60" required value={formData.email} onChange={handleChange} aria-invalid={!!errors.email}/>
                  </div>
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/90">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        className="pl-10 pr-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        aria-invalid={!!errors.password}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4 text-white/60" /> : <Eye className="w-4 h-4 text-white/60" />}
                      </Button>
                    </div>
                    {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white/90">Confirmar senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        className="pl-10 pr-10 bg-blue-900/50 border-blue-700 text-white placeholder:text-white/60"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        aria-invalid={!!errors.confirmPassword}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4 text-white/60" /> : <Eye className="w-4 h-4 text-white/60" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>


                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox id="terms" className="mt-1 border-white/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" checked={formData.terms} onCheckedChange={(checked) => setFormData(prev => ({...prev, terms: !!checked}))} aria-invalid={!!errors.terms} />
                  <Label htmlFor="terms" className="text-sm text-white/80 leading-relaxed">
                    Concordo com os{" "}
                    <Link href="/termos-de-uso" className="text-yellow-400 hover:underline">
                      Termos de Uso
                    </Link>{" "}
                    e{" "}
                    <Link href="/politica-de-privacidade" className="text-yellow-400 hover:underline">
                      Política de Privacidade
                    </Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loading ? "Criando conta..." : "Criar conta"}
                </Button>
                {errors.form && (
                    <div className="flex items-center p-3 text-sm text-red-200 bg-red-900/30 border border-red-500/50 rounded-lg mt-4">
                        <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{errors.form}</span>
                    </div>
                  )}
              </form>

              <div className="text-center">
                <p className="text-sm text-white/80">
                  Já tem uma conta?{" "}
                  <Link href="/login" className="text-yellow-400 hover:underline font-medium">
                    Faça login aqui
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