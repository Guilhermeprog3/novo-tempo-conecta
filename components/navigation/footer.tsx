import { MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-12 px-4 bg-gradient-to-r from-[#1E3A8A] to-[#254A9E] border-t">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-bold text-white">Novo Tempo Conecta</h4>
              </div>
            </div>
            <p className="text-white/80 text-sm">
              Fortalecendo a economia local e conectando nossa comunidade.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Para Moradores</h5>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/busca" className="hover:text-primary transition-colors">
                  Buscar Negócios
                </Link>
              </li>
              <li>
                <Link href="/mapa" className="hover:text-primary transition-colors">
                  Mapa Interativo
                </Link>
              </li>
              <li>
                <Link href="/favoritos" className="hover:text-primary transition-colors">
                  Meus Favoritos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Para Empresários</h5>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/empresario/cadastro" className="hover:text-primary transition-colors">
                  Cadastrar Negócio
                </Link>
              </li>
              <li>
                <Link href="/empresario/login" className="hover:text-primary transition-colors">
                  Painel de Controle
                </Link>
              </li>
              <li>
                <Link href="/empresario/perfil" className="hover:text-primary transition-colors">
                  Gerenciar Perfil
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-primary transition-colors">
                  Suporte
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
          <p>&copy; 2025 Novo Tempo Conecta. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}