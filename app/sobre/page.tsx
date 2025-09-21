import { MapPin, Users, Store, Heart, Target, Award, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Sobre o <span className="text-primary">Novo Tempo Conecta</span>
          </h2>
        </div>
      </section>
      <Footer />
    </div>
  )
}