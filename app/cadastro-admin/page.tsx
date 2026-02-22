"use client"

import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2, AlertTriangle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import React, { useState } from "react"
// Importa funções do Firebase e a instância
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Header } from "@/components/navigation/header"

export default function AdminCadastroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
  });
  // O estado de erros é tipado como { [key: string]: string }
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    // CORREÇÃO: Usar a função de atualização de estado para remover as chaves de erro.
    setErrors(prev => {
        const newErrors = { ...prev };
        
        // 1. Limpa o erro específico do campo ao digitar
        if (newErrors[id]) {
            delete newErrors[id];
        }

        // 2. Limpa o erro genérico do formulário 'form', se existir
        if (newErrors.form) {
             delete newErrors.form;
        }

        return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    let fieldErrors: { [key: string]: string } = {};

    if (formData.password !== formData.confirmPassword) {
      fieldErrors.confirmPassword = "As senhas não coincidem!";
    }
    if (formData.password.length < 6) {
        fieldErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    if (Object.keys(fieldErrors).length > 0) {
        setErrors({...fieldErrors, form: "Preencha corretamente todos os campos."});
        setLoading(false);
        return;
    }

    try {
        // 1. Cria o usuário no Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // 2. Cadastra o Administrador no Firestore na coleção 'users' com a role 'admin'
        const userDataToSave = {
            uid: user.uid,
            email: formData.email,
            name: "Administrador", 
            role: "admin", // <-- AQUI definimos a role do administrador
            createdAt: new Date(),
        };
        
        await setDoc(doc(db, "users", user.uid), userDataToSave);

        setIsSuccess(true);
        setFormData({ email: '', password: '', confirmPassword: '' });

    } catch (error: any) {
        console.error("Erro ao cadastrar administrador:", error.code, error.message);
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

  // Tela de Sucesso
  if (isSuccess) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="shadow-lg bg-[#002240] border-[#00CCFF]/20 text-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">Administrador Cadastrado!</CardTitle>
                <CardDescription className="text-white/80">
                  A nova conta de administrador foi criada com sucesso.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Button className="w-full bg-[#00CCFF] text-[#002240] hover:bg-[#00CCFF]/80 font-bold" asChild>
                    <Link href="/login">Ir para o Login</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent text-white border-white/50 hover:bg-[#00CCFF]/10 hover:text-[#00CCFF] hover:border-[#00CCFF]" onClick={() => setIsSuccess(false)}>
                    Cadastrar Novo Admin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Formulário de Cadastro
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          
          <Card className="shadow-lg bg-[#002240] border-[#00CCFF]/20 text-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-[#00CCFF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#002240]" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Cadastro de Administrador</CardTitle>
              <CardDescription className="text-white/80">Tela temporária: Crie uma conta de administrador (role 'admin').</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#00CCFF]">E-mail do Administrador</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input id="email" type="email" placeholder="admin@email.com" className="pl-10 bg-white/5 border-[#00CCFF]/30 text-white placeholder:text-white/50 focus-visible:ring-[#00CCFF]" required value={formData.email} onChange={handleChange} aria-invalid={!!errors.email} />
                  </div>
                  {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#00CCFF]">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10 pr-10 bg-white/5 border-[#00CCFF]/30 text-white placeholder:text-white/50 focus-visible:ring-[#00CCFF]"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      aria-invalid={!!errors.password}
                    />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4 text-[#00CCFF]" /> : <Eye className="w-4 h-4 text-white/60" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#00CCFF]">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme a senha"
                      className="pl-10 pr-10 bg-white/5 border-[#00CCFF]/30 text-white placeholder:text-white/50 focus-visible:ring-[#00CCFF]"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      aria-invalid={!!errors.confirmPassword}
                    />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 text-[#00CCFF]" /> : <Eye className="w-4 h-4 text-white/60" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full mt-6 bg-[#00CCFF] text-[#002240] hover:bg-[#00CCFF]/80 font-bold" size="lg" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loading ? "Cadastrando..." : "Cadastrar Administrador"}
                </Button>
                
                {errors.form && (
                  <div className="flex items-center p-3 text-sm text-red-200 bg-red-900/30 border border-red-500/50 rounded-lg mt-4">
                      <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{errors.form}</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}