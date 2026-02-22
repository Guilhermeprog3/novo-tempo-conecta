import { MapPin, FileText, Shield } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-12 px-4 bg-[#002240] border-t border-[#00CCFF]/20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#00CCFF] rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#002240]" />
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
                <Link href="/busca" className="hover:text-[#00CCFF] transition-colors">
                  Buscar Negócios
                </Link>
              </li>
              <li>
                <Link href="/mapa" className="hover:text-[#00CCFF] transition-colors">
                  Mapa Interativo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Para Empresários</h5>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/cadastro-emp" className="hover:text-[#00CCFF] transition-colors">
                  Cadastrar Negócio
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-[#00CCFF] transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Legal</h5>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/termos-de-uso" className="flex items-center gap-2 hover:text-[#00CCFF] transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>Termos de Uso</span>
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="flex items-center gap-2 hover:text-[#00CCFF] transition-colors">
                  <Shield className="w-4 h-4" />
                  <span>Política de Privacidade</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#00CCFF]/20 mt-8 pt-8 text-center text-sm text-white/60">
          <p>&copy; 2025 Novo Tempo Conecta. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}