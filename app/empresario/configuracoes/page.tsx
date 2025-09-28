import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfiguracoesPage() {
  return (
    <Card className="shadow-lg bg-white border border-gray-200/80 rounded-2xl">
      <CardHeader>
        <CardTitle>Configurações da Conta</CardTitle>
        <CardDescription>Gerencie suas preferências e dados de acesso.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Aqui ficarão as opções de configuração da conta do empresário, como alteração de senha, preferências de notificação, etc.</p>
      </CardContent>
    </Card>
  );
}