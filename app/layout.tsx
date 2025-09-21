import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/hooks/use-auth"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Novo Tempo Conecta - Guia Comercial do Bairro",
  description:
    "Conectando moradores e empresários do bairro Novo Tempo. Descubra negócios locais, avalie serviços e fortaleça nossa comunidade.",
  generator: "v0.app",
  keywords: ["guia comercial", "novo tempo", "negócios locais", "bairro", "estabelecimentos", "avaliações"],
  authors: [{ name: "Novo Tempo Conecta" }],
  openGraph: {
    title: "Novo Tempo Conecta - Guia Comercial do Bairro",
    description: "Conectando moradores e empresários do bairro Novo Tempo",
    type: "website",
    locale: "pt_BR",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
          <AuthProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
