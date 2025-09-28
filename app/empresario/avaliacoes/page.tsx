// app/empresario/avaliacoes/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AvaliacoesPage() {
  return (
    <Card className="shadow-lg bg-white border border-gray-200/80 rounded-2xl">
      <CardHeader>
        <CardTitle>Gerenciar Avaliações</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Aqui ficará a lista de avaliações para responder.</p>
      </CardContent>
    </Card>
  );
}