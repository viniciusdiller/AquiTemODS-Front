import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export interface AdminStat {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

interface Props {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  stats?: AdminStat[];
}

/** Cabeçalho padrão das telas do painel: título, texto de apoio e ações à direita. */
export const AdminPageHeader: React.FC<Props> = ({
  title,
  subtitle,
  backHref,
  backLabel = "Voltar",
  actions,
  stats,
}) => (
  <header>
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-[#2A1420] md:text-[28px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 max-w-prose text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>

    {stats && stats.length > 0 && (
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-primary/10 bg-white px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              {s.icon}
              {s.label}
            </div>
            <div className="mt-1 text-2xl font-semibold text-[#2A1420]">
              {s.value}
            </div>
          </div>
        ))}
      </div>
    )}
  </header>
);

/** Botão de ação do cabeçalho (fundo branco, borda sutil). */
export const headerButtonClass =
  "inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-white px-4 py-2 text-sm font-medium text-[#B02456] shadow-sm transition-colors hover:border-primary hover:bg-primary hover:text-white disabled:opacity-60";
