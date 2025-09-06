"use client"

import { ArrowLeft, Save, Shield, Trash2, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User, sendPasswordResetEmail, deleteUser } from 'firebase/auth'
import { doc, deleteDoc } from "firebase/firestore"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function EmpresarioConfiguracoesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({ open: false, title: "", description: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState("");


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        window.location.href = '/empresario/login';
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handlePasswordReset = async () => {
    if (!currentUser?.email) {
      setModalInfo({ open: true, title: "Erro", description: "Não foi possível identificar o e-mail do usuário." });
      return;
    }
    setActionLoading(true);
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      setModalInfo({ open: true, title: "E-mail Enviado", description: `Enviamos um link de redefinição de senha para ${currentUser.email}.` });
    } catch (error) {
      console.error("Erro ao enviar e-mail de redefinição de senha:", error);
      setModalInfo({ open: true, title: "Falha no Envio", description: "Ocorreu um erro ao enviar o e-mail de redefinição. Tente novamente." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser || deleteConfirmation !== "EXCLUIR") {
        alert("Confirmação inválida.");
        return;
    }

    setActionLoading(true);
    try {
      // 1. Deletar os dados do negócio no Firestore
      const businessRef = doc(db, "businesses", currentUser.uid);
      await deleteDoc(businessRef);

      // 2. Deletar o usuário da autenticação
      await deleteUser(currentUser);
      
      alert("Sua conta e todos os dados associados foram excluídos com sucesso.");
      window.location.href = '/';

    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);
      if (error.code === 'auth/requires-recent-login') {
         alert("Esta é uma operação sensível. Por favor, faça login novamente antes de excluir sua conta.");
         auth.signOut().then(() => {
            window.location.href = '/empresario/login';
         });
      } else {
        alert("Ocorreu um erro ao excluir sua conta.");
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/empresario/dashboard">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar ao Dashboard
                  </Link>
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Configurações</h1>
                  <p className="text-sm text-muted-foreground">Gerencie as configurações da sua conta</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">

            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Segurança da Conta</span>
                </CardTitle>
                <CardDescription>Mantenha sua conta segura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                      Para alterar sua senha, enviaremos um link de redefinição para o seu e-mail cadastrado.
                  </p>
                  <Button variant="outline" className="bg-transparent" onClick={handlePasswordReset} disabled={actionLoading}>
                    {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Enviar E-mail de Redefinição
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                <CardDescription>Ações irreversíveis para sua conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base text-destructive">Excluir conta permanentemente</Label>
                    <p className="text-sm text-muted-foreground">
                      Esta ação não pode ser desfeita. Todos os dados serão perdidos.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={actionLoading}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir Conta
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso irá excluir permanentemente sua conta
                          e remover todos os seus dados de nossos servidores.
                          Para confirmar, digite <strong>EXCLUIR</strong> abaixo.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <Input 
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        placeholder="EXCLUIR"
                        className="border-destructive"
                      />
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} disabled={deleteConfirmation !== "EXCLUIR" || actionLoading}>
                          {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                          Confirmar Exclusão
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Feedback */}
      <AlertDialog open={modalInfo.open} onOpenChange={(isOpen) => setModalInfo({ ...modalInfo, open: isOpen })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
              {modalInfo.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {modalInfo.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setModalInfo({ ...modalInfo, open: false })}>Ok</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}