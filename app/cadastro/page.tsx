"use client"

import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react"
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      setLoading(false);
      return;
    }
    if (!formData.terms) {
      alert("Você precisa aceitar os Termos de Uso e a Política de Privacidade.");
      setLoading(false);
      return;
    }

    try {
        // 1. Criar o usuário no Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // 2. Salvar informações adicionais no Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            createdAt: new Date(),
        });

        alert("Cadastro realizado com sucesso!");
        // Redirecionar para o dashboard do usuário após o cadastro
        window.location.href = '/usuario/dashboard';

    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        if (error instanceof Error) {
            alert("Erro ao cadastrar: " + error.message);
        } else {
            alert("Ocorreu um erro desconhecido ao cadastrar.");
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Criar sua conta</CardTitle>
            <CardDescription>Junte-se à comunidade do Novo Tempo e conecte-se com os negócios locais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input id="name" type="text" placeholder="Seu nome completo" className="pl-10" required value={formData.name} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input id="email" type="email" placeholder="seu@email.com" className="pl-10" required value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input id="phone" type="tel" placeholder="(11) 99999-9999" className="pl-10" required value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    className="pl-10 pr-10"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    className="pl-10 pr-10"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="mt-1" checked={formData.terms} onCheckedChange={(checked) => setFormData(prev => ({...prev, terms: !!checked}))} />
                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  Concordo com os{" "}
                  <Link href="/termos-de-uso" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link href="/politica-de-privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
