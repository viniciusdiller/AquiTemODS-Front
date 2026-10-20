"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import AdminTheme from "@/components/admin/AdminTheme";
import SessionClock from "@/components/admin/SessionClock";
import { redirectToAdminLogin } from "@/lib/http";
import { ADMIN_NAV, rotaAtiva, semMenuLateral } from "./navigation";

// Degradê da barra lateral: rosa suave no topo, branco no meio (onde ficam os links) e pêssego embaixo.
const DEGRADE_LATERAL =
  "bg-[linear-gradient(180deg,#FBD3E2_0%,#FFF6F9_38%,#FFFFFF_55%,#FDE6D3_100%)]";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  useEffect(() => setAberto(false), [pathname]);

  if (semMenuLateral(pathname)) return <>{children}</>;

  const menu = (
    <nav
      aria-label="Menu do painel"
      className="flex flex-1 flex-col gap-1 overflow-y-auto px-3"
    >
      {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
        const ativo = rotaAtiva(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={ativo ? "page" : undefined}
            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
              ativo
                ? "bg-white text-[#B02456] shadow-sm ring-1 ring-primary/15"
                : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-opacity ${
                ativo ? "opacity-100" : "opacity-0"
              }`}
            />
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const rodape = (
    <div className="space-y-1 border-t border-primary/15 px-3 pb-4 pt-3">
      <SessionClock />
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-white/70 hover:text-slate-900"
      >
        <ExternalLink className="h-[18px] w-[18px]" aria-hidden="true" />
        Ver o site
      </Link>
      <button
        type="button"
        onClick={redirectToAdminLogin}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
      >
        <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
        Sair
      </button>
    </div>
  );

  const faixa = (
    <div
      aria-hidden="true"
      className="h-1.5 w-full bg-[linear-gradient(90deg,#D7386E_0%,#F2762E_70%,#FDB713_100%)]"
    />
  );

  const marca = (
    <Link
      href="/admin/dashboard"
      className="block px-5 py-5"
      aria-label="Painel AquiTemODS"
    >
      <Image
        src="/logo_aquitemods_preto.png"
        alt="AquiTemODS"
        width={150}
        height={59}
        priority
        className="h-auto w-[120px]"
      />
      <span className="mt-2 block text-xs text-slate-600">
        Painel de gestão
      </span>
    </Link>
  );

  return (
    <AdminTheme>
      <div className="min-h-screen bg-[#FAF5F7] text-[#2A1420] lg:flex">
        {/* Menu fixo no desktop */}
        <aside
          className={`sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-primary/15 ${DEGRADE_LATERAL} lg:flex`}
        >
          {faixa}
          {marca}
          {menu}
          {rodape}
        </aside>

        {/* Barra superior no celular */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <Link href="/admin/dashboard" aria-label="Painel AquiTemODS">
            <Image
              src="/logo_aquitemods_preto.png"
              alt="AquiTemODS"
              width={96}
              height={38}
              className="h-auto w-24"
            />
          </Link>
          <button
            type="button"
            onClick={() => setAberto(true)}
            aria-label="Abrir menu"
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </header>

        {aberto && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu do painel"
          >
            <button
              type="button"
              aria-label="Fechar menu"
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => setAberto(false)}
            />
            <div
              className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col shadow-xl ${DEGRADE_LATERAL}`}
            >
              {faixa}
              <button
                type="button"
                onClick={() => setAberto(false)}
                aria-label="Fechar menu"
                className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              {marca}
              {menu}
              {rodape}
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </AdminTheme>
  );
}
