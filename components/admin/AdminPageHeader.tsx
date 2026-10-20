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

export const AdminPageHeader: React.FC<Props> = ({
  title,
  subtitle,
  backHref,
  backLabel = "Voltar",
  actions,
  stats,
}) => (
  <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(339_65%_30%)] via-primary to-[hsl(339_75%_68%)] p-6 text-white shadow-xl shadow-primary/20 md:p-8">
    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-24 right-10 h-56 w-56 rounded-full border-[36px] border-white/10" />

    <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="mb-4 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        )}
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-xl text-sm text-white/80 md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>

    {stats && stats.length > 0 && (
      <div className="relative mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur"
          >
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/80">
              {s.icon}
              {s.label}
            </div>
            <div className="mt-1 text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>
    )}
  </header>
);

/** Botão translúcido para usar sobre o cabeçalho rosa. */
export const headerButtonClass =
  "inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60";
