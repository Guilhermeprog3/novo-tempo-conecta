"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "business"
  businessId?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role?: "user" | "business") => Promise<boolean>
  logout: () => void
  register: (userData: any) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const userData = localStorage.getItem("user_data")

        if (token && userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string, role: "user" | "business" = "user"): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simular dados do usuário
      const userData: User = {
        id: "1",
        name: role === "business" ? "Pizzaria do Bairro" : "João Silva",
        email,
        role,
        businessId: role === "business" ? "business_1" : undefined,
      }

      // Salvar no localStorage
      localStorage.setItem("auth_token", "fake_token_123")
      localStorage.setItem("user_data", JSON.stringify(userData))
      localStorage.setItem("user_role", role)

      setUser(userData)
      return true
    } catch (error) {
      console.error("Erro no login:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simular criação de usuário
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || userData.businessName,
        email: userData.email,
        role: userData.userType || "user",
        businessId: userData.businessName ? `business_${Date.now()}` : undefined,
      }

      // Salvar no localStorage
      localStorage.setItem("auth_token", "fake_token_123")
      localStorage.setItem("user_data", JSON.stringify(newUser))
      localStorage.setItem("user_role", newUser.role)

      setUser(newUser)
      return true
    } catch (error) {
      console.error("Erro no cadastro:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    localStorage.removeItem("user_role")
    setUser(null)
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
