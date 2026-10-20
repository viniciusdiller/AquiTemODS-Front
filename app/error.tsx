"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro de renderização:", error);
  }, [error]);

  return (
    <ErrorScreen
      title="Algo deu errado"
      description="Tivemos um problema ao carregar esta página. Tente novamente em instantes."
      onRetry={reset}
      detail={error.digest}
    />
  );
}
