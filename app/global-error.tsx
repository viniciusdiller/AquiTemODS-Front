"use client";

import "./globals.css";
import { useEffect } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro crítico:", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <ErrorScreen
          title="O site encontrou um problema"
          description="Não foi possível carregar a aplicação. Tente novamente em instantes."
          onRetry={reset}
          detail={error.digest}
        />
      </body>
    </html>
  );
}
