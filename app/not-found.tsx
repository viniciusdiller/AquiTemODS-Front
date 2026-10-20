import { ErrorScreen } from "@/components/ErrorScreen";

export default function NotFound() {
  return (
    <ErrorScreen
      code="404"
      title="Página não encontrada"
      description="O endereço que você tentou acessar não existe ou foi movido."
    />
  );
}
