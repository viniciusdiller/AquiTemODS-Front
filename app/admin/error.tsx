"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro no painel admin:", error);
  }, [error]);

  return (
    <ErrorScreen
      title="Erro no painel"
      description="Não foi possível carregar esta área do painel. Tente novamente ou volte ao dashboard."
      onRetry={reset}
      homeHref="/admin/dashboard"
      homeLabel="Voltar ao dashboard"
      detail={error.digest}
    />
  );
}
