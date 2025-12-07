"use client"

import Link from "next/link"
import { Header } from "@/components/navigation/header"
import { Footer } from "@/components/navigation/footer"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, FileText, Scale, Shield, AlertCircle, CheckCircle, HelpCircle, Ban } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TermosDeUsoPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuItems = [
    { id: "resumo", title: "Resumo" },
    { id: "contas", title: "1. Termos da Conta" },
    { id: "uso", title: "2. Uso Aceitável" },
    { id: "conteudo", title: "3. Conteúdo do Usuário" },
    { id: "privacidade", title: "4. Privacidade" },
    { id: "cancelamento", title: "5. Cancelamento" },
    { id: "responsabilidade", title: "6. Responsabilidade" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR DE NAVEGAÇÃO */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-28 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 px-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1E3A8A]" /> 
                Navegação
              </h3>
              <nav className="flex flex-col space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#1E3A8A] hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    {item.title}
                  </button>
                ))}
              </nav>

              <Separator className="my-6" />

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-[#1E3A8A] mb-1 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" /> Dúvidas?
                </h4>
                <Link href="/contato" className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center">
                  Fale Conosco <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <main className="flex-1 max-w-4xl space-y-12">
            
            {/* Introdução */}
            <div className="prose prose-slate max-w-none text-slate-600">
              <p className="text-lg leading-relaxed">
                Bem-vindo ao <strong>Novo Tempo Conecta</strong>! Ao acessar ou usar nossa plataforma, você concorda em cumprir estes Termos de Uso. Eles existem para proteger tanto você quanto nossa comunidade de usuários e empresas.
              </p>
              <p>
                Última atualização: <span className="font-semibold text-slate-900">07 de Dezembro de 2025</span>
              </p>
            </div>

            {/* Resumo */}
            <section id="resumo" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-l-4 border-[#1E3A8A] pl-3">
                Resumo dos Pontos Principais
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                
                {/* CORREÇÃO: Forçando bg-white e borda para garantir contraste */}
                <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold text-[#1E3A8A] flex items-center gap-2">
                            <Shield className="w-5 h-5" /> Sua Conta
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 font-medium">
                            Você é responsável por manter seus dados de acesso seguros. Contas empresariais devem representar negócios reais.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold text-[#1E3A8A] flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" /> Conteúdo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 font-medium">
                            O conteúdo que você posta (textos, fotos) é seu, mas você nos dá licença para exibi-lo na plataforma.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold text-[#1E3A8A] flex items-center gap-2">
                            <Scale className="w-5 h-5" /> Regras de Uso
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 font-medium">
                            É proibido usar a plataforma para atividades ilegais, spam, ou para assediar outros usuários.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold text-[#1E3A8A] flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> Cancelamento
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 font-medium">
                            Você pode encerrar sua conta quando quiser. Nós também podemos suspender contas que violem as regras.
                        </p>
                    </CardContent>
                </Card>
              </div>
            </section>

            {/* Conteúdo Detalhado */}
            <div className="space-y-10">
              
              <section id="contas" className="scroll-mt-28">
                <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    1. Termos da Conta
                </h3>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                    <p>
                        Para acessar alguns recursos do Serviço, você precisará registrar uma conta. Ao registrar-se, você deve fornecer informações precisas e completas.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-[#1E3A8A]">
                        <li><strong>Elegibilidade:</strong> Você deve ter pelo menos 13 anos de idade para usar este Serviço.</li>
                        <li><strong>Segurança:</strong> Você é responsável por manter a segurança de sua senha. Não podemos e não seremos responsáveis por qualquer perda ou dano decorrente do seu descumprimento desta obrigação de segurança.</li>
                        <li><strong>Responsabilidade:</strong> Você é responsável por todo o conteúdo postado e atividade que ocorra sob sua conta.</li>
                    </ul>
                </div>
              </section>

              <section id="uso" className="scroll-mt-28">
                <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    2. Uso Aceitável
                </h3>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                    <p>
                        Esperamos que todos os usuários do Novo Tempo Conecta se comportem de maneira responsável. O uso da plataforma está sujeito às seguintes restrições:
                    </p>
                    
                    <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-yellow-400">
                        <p className="font-medium text-slate-900 mb-2">Você concorda em NÃO:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Usar o serviço para qualquer finalidade ilegal ou não autorizada.</li>
                            <li>Violar leis de direitos autorais ou marcas registradas.</li>
                            <li>Publicar informações falsas, enganosas ou fraudulentas.</li>
                            <li>Coletar dados de usuários sem consentimento.</li>
                            <li><strong>Praticar discurso de ódio, assédio, bullying ou usar linguagem ofensiva e xingamentos contra outros usuários ou empresas.</strong></li>
                        </ul>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-800 text-sm">
                        <p className="font-bold flex items-center gap-2 mb-1">
                            <Ban className="w-4 h-4" /> Tolerância Zero:
                        </p>
                        <p>
                            O mau uso da conta, incluindo <strong>xingamentos, disseminação de ódio, discriminação</strong> ou qualquer forma de assédio, não será tolerado. Tais ações resultarão na <strong>exclusão imediata e permanente</strong> da sua conta, sem aviso prévio, e poderão ser reportadas às autoridades competentes se necessário.
                        </p>
                    </div>
                </div>
              </section>

              <section id="conteudo" className="scroll-mt-28">
                <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    3. Conteúdo do Usuário
                </h3>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                    <p>
                        Seu perfil e os materiais enviados (como fotos de produtos, descrições de serviços, avaliações) permanecem seus. No entanto, ao postar conteúdo no Novo Tempo Conecta, você nos concede uma licença mundial, não exclusiva e isenta de royalties para usar, reproduzir e exibir esse conteúdo em conexão com o serviço.
                    </p>
                    <p>
                        Nós nos reservamos o direito de remover qualquer conteúdo que viole estes Termos ou que consideremos ofensivo ou prejudicial à comunidade.
                    </p>
                </div>
              </section>

              <section id="privacidade" className="scroll-mt-28">
                <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    4. Privacidade
                </h3>
                <p className="text-slate-700 leading-relaxed">
                    Sua privacidade é muito importante para nós. Nossa <Link href="/politica-de-privacidade" className="text-[#1E3A8A] font-semibold hover:underline">Política de Privacidade</Link> explica como coletamos, usamos e protegemos suas informações pessoais. Ao usar nossos serviços, você concorda que podemos usar seus dados de acordo com nossa política de privacidade.
                </p>
              </section>

              <section id="cancelamento" className="scroll-mt-28">
                <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    5. Cancelamento e Rescisão
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                    Você pode cancelar sua conta a qualquer momento através das configurações do seu perfil. Após o cancelamento, seu conteúdo pode ser removido permanentemente de nossos servidores.
                </p>
                <p className="text-slate-700 leading-relaxed">
                    O Novo Tempo Conecta tem o direito de suspender ou encerrar sua conta e recusar qualquer uso atual ou futuro do Serviço por qualquer motivo, a qualquer momento, especialmente em casos de violação destes Termos.
                </p>
              </section>

              <section id="responsabilidade" className="scroll-mt-28">
                <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                    6. Limitação de Responsabilidade
                </h3>
                <p className="text-slate-700 leading-relaxed">
                    O serviço é fornecido "como está". O Novo Tempo Conecta e seus fornecedores e licenciadores renunciam a todas as garantias de qualquer tipo. Não garantimos que o serviço estará livre de erros ou que o acesso a ele será contínuo ou ininterrupto.
                </p>
              </section>

            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}