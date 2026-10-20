import React from "react";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";

interface Props {
  code?: string;
  title: string;
  description: string;
  /** Quando informado, mostra o botão "Tentar novamente". */
  onRetry?: () => void;
  homeHref?: string;
  homeLabel?: string;
  detail?: string;
}

export function ErrorScreen({
  code,
  title,
  description,
  onRetry,
  homeHref = "/",
  homeLabel = "Voltar ao início",
  detail,
}: Props) {
  return (
    <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gray-50 px-6 py-16">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full border-[40px] border-primary/10" />

      <div className="relative w-full max-w-lg rounded-3xl border border-primary/20 bg-white p-8 text-center shadow-xl sm:p-10">
        {code && (
          <div className="bg-gradient-to-br from-[hsl(339_65%_30%)] to-[hsl(339_75%_68%)] bg-clip-text text-7xl font-black leading-none text-transparent">
            {code}
          </div>
        )}
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">{description}</p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-[hsl(339_65%_43%)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-primary/30"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </button>
          )}
          <Link
            href={homeHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
          >
            <Home className="h-4 w-4" />
            {homeLabel}
          </Link>
        </div>

        {detail && (
          <p className="mt-6 text-xs text-gray-400">Código do erro: {detail}</p>
        )}
      </div>
    </main>
  );
}
