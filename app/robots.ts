import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/empresario/dashboard",
        "/empresario/perfil",
        "/empresario/avaliacoes",
        "/empresario/configuracoes",
        "/api/",
      ],
    },
    sitemap: "https://novotempo.vercel.app/sitemap.xml",
  }
}
