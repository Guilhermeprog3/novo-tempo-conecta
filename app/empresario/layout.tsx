// app/empresario/layout.tsx
import { EmpresarioLayout } from "@/components/empresario/EmpresarioLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <EmpresarioLayout>
      {children}
    </EmpresarioLayout>
  );
}