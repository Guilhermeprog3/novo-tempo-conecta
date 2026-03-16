"use client"

import React, { useState, useEffect, createContext, useContext } from "react"
import { auth, db } from "@/lib/firebase"
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser 
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

interface UserProfile {
  id: string
  name: string
  email: string
  role: "user" | "business" | "admin"
  businessId?: string
  avatar?: string
}

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Função auxiliar para definir cookies (visto que o middleware corre no servidor)
const setRoleCookie = (role: string | null) => {
  if (role) {
    document.cookie = `userRole=${role}; path=/; max-age=86400; SameSite=Lax`
  } else {
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const userData = { id: firebaseUser.uid, ...docSnap.data() } as UserProfile
          setUser(userData)
          setRoleCookie(userData.role)
          localStorage.setItem("user", JSON.stringify(userData))
        }
      } else {
        setUser(null)
        setRoleCookie(null)
        localStorage.removeItem("user")
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Erro no login:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setRoleCookie(null)
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  return context
}