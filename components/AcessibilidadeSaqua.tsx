"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { atualizarMenu, type OpcoesMenuAcessibilidade } from "@/lib/acessibilidade";

const OPCOES: OpcoesMenuAcessibilidade = {
  cor: "#D7386E",
  corEscura: "#B52B5A",
  suave: "#FCE8EF",
};

/**
 * Menu de acessibilidade (Libras, ajustes de leitura e ouvir a página),
 * igual ao da Agenda Saquarema. Não aparece no /admin.
 */
export default function AcessibilidadeSaqua() {
  const pathname = usePathname();

  useEffect(() => {
    atualizarMenu(document, pathname ?? "/", OPCOES);
  }, [pathname]);

  return null;
}
