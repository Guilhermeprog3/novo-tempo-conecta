// app/admin/configuracoes/page.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog"
import { Mail, KeyRound, Edit, Loader2, Eye, EyeOff } from "lucide-react"
import { auth } from "@/lib/firebase"
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, User as FirebaseUser } from "firebase/auth"
import { Toaster, toast } from "sonner"

export default function AdminSettingsPage() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Estados do Formulário de Senha
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (newPassword !== confirmPassword) {
            toast.error("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            toast.error("A senha deve ter no mínimo 6 caracteres.");
            setLoading(false);
            return;
        }

        if (!auth.currentUser || !auth.currentUser.email) {
            toast.error("Erro de autenticação.");
            setLoading(false);
            return;
        }

        try {
            // 1. Reautenticar o usuário
            const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);

            // 2. Atualizar senha
            await updatePassword(auth.currentUser, newPassword);
            
            toast.success("Senha atualizada com sucesso!");
            setIsDialogOpen(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/wrong-password') {
                toast.error("A senha atual está incorreta.");
            } else {
                toast.error("Erro ao atualizar senha. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string | null | undefined) => {
        return name ? name.substring(0, 2).toUpperCase() : "AD";
    };

    return (
        <>
            {/* CORREÇÃO: Toaster movido para fora da div com space-y-6 */}
            <Toaster />
            
            <div className="space-y-6">
                
                {/* 1. Header Hero (Estilo Zelus) */}
                {/* Agora este é o primeiro filho direto da div space-y-6, então não terá margem no topo */}
                <div className="rounded-xl bg-[#1E3A8A] p-8 text-white shadow-lg">
                    <h1 className="text-3xl font-bold mb-2">Configurações</h1>
                    <p className="text-blue-100 opacity-90">
                        Gerencie suas preferências e configurações de conta administrativa.
                    </p>
                </div>

                {/* 2. Cartão de Perfil */}
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                        <Avatar className="h-20 w-20 border-4 border-slate-50 shadow-sm">
                            <AvatarImage src={user?.photoURL || ""} />
                            <AvatarFallback className="bg-slate-200 text-slate-600 text-xl font-bold">
                                {getInitials(user?.displayName)}
                            </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 text-center md:text-left space-y-1">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
                                {user?.displayName || "Administrador"}
                            </h2>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500">
                                <Mail className="w-4 h-4" />
                                <span>{user?.email}</span>
                            </div>
                            <div className="pt-2 flex justify-center md:justify-start gap-2">
                                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-none px-3 py-1">
                                    SUPER ADMIN
                                </Badge>
                                <Badge variant="outline" className="text-slate-500 border-slate-200">
                                    Acesso Total
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Configurações de Conta */}
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="border-b bg-slate-50/50 px-6 py-4">
                        <CardTitle className="text-lg text-slate-800">Conta</CardTitle>
                        <CardDescription>Gerencie suas informações de acesso e segurança.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        
                        {/* Linha: Informações Pessoais */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="font-semibold text-slate-900">Informações Pessoais</h3>
                                <p className="text-sm text-slate-500">Nome de exibição e e-mail de contato.</p>
                            </div>
                            <Button variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-800" disabled>
                                <Edit className="w-4 h-4 mr-2" /> Editar (Indisponível)
                            </Button>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />

                        {/* Linha: Alterar Senha */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="font-semibold text-slate-900">Alterar Senha</h3>
                                <p className="text-sm text-slate-500">Mantenha sua conta segura com uma senha forte.</p>
                            </div>
                            
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                                        <KeyRound className="w-4 h-4 mr-2" /> Alterar Senha
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Alterar Senha</DialogTitle>
                                        <DialogDescription>
                                            Digite sua senha atual para confirmar e defina a nova senha.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleChangePassword} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current">Senha Atual</Label>
                                            <div className="relative">
                                                <Input 
                                                    id="current" 
                                                    type={showCurrentPass ? "text" : "password"} 
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    required
                                                />
                                                <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                    {showCurrentPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new">Nova Senha</Label>
                                            <div className="relative">
                                                <Input 
                                                    id="new" 
                                                    type={showNewPass ? "text" : "password"} 
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                    placeholder="Mínimo 6 caracteres"
                                                />
                                                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                    {showNewPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm">Confirmar Nova Senha</Label>
                                            <Input 
                                                id="confirm" 
                                                type="password" 
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <DialogFooter className="pt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                            <Button type="submit" disabled={loading} className="bg-[#1E3A8A] hover:bg-blue-900">
                                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Salvar Alteração
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </>
    )
}