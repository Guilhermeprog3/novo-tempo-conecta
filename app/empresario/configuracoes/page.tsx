"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, KeyRound, Trash2, Eye, EyeOff } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { auth, db } from '@/lib/firebase';
import {
    EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser, onAuthStateChanged
} from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';

export default function ConfiguracoesPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');
    const [passwordForDelete, setPasswordForDelete] = useState('');
    const [showPassForDelete, setShowPassForDelete] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const reauthenticate = async (password: string) => {
        const user = auth.currentUser;
        if (!user || !user.email) {
            throw new Error("Usuário não encontrado ou sem e-mail associado.");
        }
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("A nova senha e a confirmação não correspondem.");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("A nova senha deve ter no mínimo 6 caracteres.");
            return;
        }
        
        setIsSaving(true);
        const user = auth.currentUser;
        if (!user) {
            toast.error("Você precisa estar logado para alterar a senha.");
            setIsSaving(false);
            return;
        }

        try {
            await reauthenticate(currentPassword);
            await updatePassword(user, newPassword);
            toast.success("Senha alterada com sucesso!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            if (error.code === 'auth/wrong-password') {
                toast.error("A senha atual está incorreta.");
            } else {
                toast.error("Ocorreu um erro ao alterar a senha.");
            }
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        const user = auth.currentUser;
        if (!user) {
            toast.error("Você precisa estar logado para excluir a conta.");
            setIsDeleting(false);
            return;
        }

        try {
            await reauthenticate(passwordForDelete);
            
            const businessDocRef = doc(db, "businesses", user.uid);
            await deleteDoc(businessDocRef);
            await deleteUser(user);
            
            toast.success("Conta excluída com sucesso.");
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);

        } catch (error: any) {
            if (error.code === 'auth/wrong-password') {
                toast.error("A senha está incorreta. A conta não foi excluída.");
            } else {
                toast.error("Ocorreu um erro ao excluir a conta.");
            }
            console.error(error);
            setIsDeleting(false);
            setIsDialogOpen(false);
            setPasswordForDelete('');
            setDeleteInput('');
        }
    };

    return (
        <>
            <Toaster position="bottom-right" />
            <div className="space-y-6">
                <Card className="shadow-sm bg-white border border-slate-200 rounded-xl">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-slate-900 text-lg">Alterar Senha</CardTitle>
                        <CardDescription className="text-slate-500">
                            Para sua segurança, você precisa informar sua senha atual para definir uma nova.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Senha Atual</Label>
                                <div className="relative">
                                    <Input className="focus-visible:ring-[#00CCFF] pr-10" id="currentPassword" type={showCurrentPass ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                                    <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-full text-slate-400 hover:text-slate-600" onClick={() => setShowCurrentPass(!showCurrentPass)}>
                                        {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Nova Senha</Label>
                                <div className="relative">
                                    <Input className="focus-visible:ring-[#00CCFF] pr-10" id="newPassword" type={showNewPass ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                                     <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-full text-slate-400 hover:text-slate-600" onClick={() => setShowNewPass(!showNewPass)}>
                                        {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                <div className="relative">
                                    <Input className="focus-visible:ring-[#00CCFF] pr-10" id="confirmPassword" type={showConfirmPass ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                                    <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-full text-slate-400 hover:text-slate-600" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                                        {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <Button type="submit" disabled={isSaving} className="bg-[#00CCFF] hover:bg-[#00CCFF]/90 text-[#002240] font-bold">
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                                Salvar Nova Senha
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="shadow-sm bg-white border border-red-200 rounded-xl">
                    <CardHeader className="border-b border-red-100 bg-red-50/50 pb-4">
                        <CardTitle className="text-red-600 text-lg">Zona de Perigo</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6">
                        <div>
                            <h3 className="font-semibold text-slate-800">Excluir este negócio</h3>
                            <p className="text-sm text-slate-500 max-w-md mt-1">
                                Uma vez que sua conta for excluída, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
                            </p>
                        </div>
                        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 w-full md:w-auto">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir Negócio
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação é irreversível. Isso excluirá permanentemente seu negócio, suas avaliações e todos os dados associados.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="passwordForDelete">Para confirmar, digite sua senha</Label>
                                        <div className="relative">
                                            <Input className="focus-visible:ring-red-400 pr-10" id="passwordForDelete" type={showPassForDelete ? 'text' : 'password'} value={passwordForDelete} onChange={e => setPasswordForDelete(e.target.value)} />
                                            <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-full text-slate-400 hover:text-slate-600" onClick={() => setShowPassForDelete(!showPassForDelete)}>
                                                {showPassForDelete ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="deleteInput">
                                            Digite <strong className="text-red-600">DELETAR</strong> para confirmar.
                                        </Label>
                                        <Input className="focus-visible:ring-red-400" id="deleteInput" value={deleteInput} onChange={e => setDeleteInput(e.target.value)} />
                                    </div>
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        disabled={deleteInput !== 'DELETAR' || !passwordForDelete || isDeleting}
                                        className="bg-red-600 hover:bg-red-700 border-none text-white"
                                    >
                                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Eu entendo, excluir minha conta
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}