"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "user" | "business"
  redirectTo?: string
}

export function ProtectedRoute({ children, requiredRole = "user", redirectTo = "/login" }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simular verificação de autenticação
    const checkAuth = async () => {
      try {
        // Aqui você faria a verificação real com seu backend/API
        const token = localStorage.getItem("auth_token")
        const userRole = localStorage.getItem("user_role")

        if (token && userRole === requiredRole) {
          setIsAuthenticated(true)
        } else {
          router.push(redirectTo)
        }
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error)
        router.push(redirectTo)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [requiredRole, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
