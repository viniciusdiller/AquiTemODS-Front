"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  CHAVE_DICA_LIBRAS,
  MENSAGEM_DICA_LIBRAS,
  MENSAGEM_LIBRAS_INDISPONIVEL,
  VLIBRAS_ROOT_PATH,
  VLIBRAS_SCRIPT_URL,
  garantirMenuSiennaNoDom,
  instalarProtetorListenerSienna,
  liberarTamanhosSienna,
  limparDestaquesLeituraSienna,
  restaurarCorElementoSienna,
  siennaAberto,
  traduzirRotulosSienna,
} from "@/lib/acessibilidade";

const SELETOR_INTERATIVO =
  "button, a[href], [role='button'], input, select, textarea, summary, label";

const JANELA_SEGUNDO_CLIQUE_MS = 4000;

function semTextoVisivel(el: Element): boolean {
  const texto = (el.textContent ?? "")
    .replace(/[\s×✕✕+−–—\-‹›<>•·|]+/g, "")
    .trim();
  return texto.length === 0;
}

function adicionarClasseTemporaria(el: Element, classe: string): void {
  if (el.classList.contains(classe)) return;
  el.classList.add(classe);
  window.setTimeout(() => {
    el.classList.remove(classe);
  }, 0);
}

export interface OpcoesUseAcessibilidadeVendors {
  pathname: string;
  aoFocarBotaoPrincipal?: () => void;
}

export function useAcessibilidadeVendors({
  pathname,
  aoFocarBotaoPrincipal,
}: OpcoesUseAcessibilidadeVendors) {
  const [siennaPronto, setSiennaPronto] = useState(false);
  const [leitorParagrafoAtivo, setLeitorParagrafoAtivo] = useState(false);

  const aoFocarBotaoPrincipalRef = useRef(aoFocarBotaoPrincipal);
  const ultimoCliqueInterativoRef = useRef<{
    el: Element;
    hora: number;
  } | null>(null);

  useEffect(() => {
    aoFocarBotaoPrincipalRef.current = aoFocarBotaoPrincipal;
  }, [aoFocarBotaoPrincipal]);

  const definirLeitorParagrafo = useCallback((ativo: boolean) => {
    if (typeof document === "undefined") return;
    const estaAtivo =
      document.documentElement.classList.contains("asw-screen-reader");
    if (estaAtivo === ativo) return;

    const menu = garantirMenuSiennaNoDom(document);
    const botaoLeitor = menu?.querySelector<HTMLElement>(
      ".asw-btn[data-key='screen-reader']",
    );
    botaoLeitor?.click();
  }, []);

  const alternarLeitorParagrafo = useCallback(() => {
    if (typeof document === "undefined") return;
    const estaAtivo =
      document.documentElement.classList.contains("asw-screen-reader");
    definirLeitorParagrafo(!estaAtivo);
  }, [definirLeitorParagrafo]);

  const abrirLibras = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!window.VLibras || !window.VLibrasWidget?.open) {
      toast(MENSAGEM_LIBRAS_INDISPONIVEL);
      return;
    }

    window.VLibrasWidget.open();

    if (window.matchMedia?.("(pointer: coarse)").matches) {
      let jaExibiu = false;
      try {
        jaExibiu = Boolean(window.localStorage.getItem(CHAVE_DICA_LIBRAS));
        if (!jaExibiu) {
          window.localStorage.setItem(CHAVE_DICA_LIBRAS, "1");
        }
      } catch {
        // Sem localStorage disponível: exibe a dica mesmo assim.
      }

      if (!jaExibiu) {
        window.setTimeout(() => {
          toast(MENSAGEM_DICA_LIBRAS);
        }, 1500);
      }
    }
  }, []);

  const abrirAjustesSienna = useCallback(() => {
    if (typeof document === "undefined") return;
    const botaoSienna = document.querySelector<HTMLElement>(".asw-menu-btn");
    if (!botaoSienna) return;

    botaoSienna.click();
    window.setTimeout(() => {
      if (!siennaAberto(document)) return;
      traduzirRotulosSienna(document);
      const fechar = document.querySelector<HTMLElement>(
        ".asw-menu .asw-menu-close",
      );
      fechar?.focus();
    }, 60);
  }, []);

  // Carrega Sienna via import dinâmico e observa DOM / classes / destaques.
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelado = false;
    instalarProtetorListenerSienna(window);

    const marcarProntoSeExistir = (): boolean => {
      if (!document.querySelector(".asw-menu-btn")) return false;
      if (!cancelado) setSiennaPronto(true);
      liberarTamanhosSienna(document);
      return true;
    };

    let observadorSienna: MutationObserver | null = null;
    if (!marcarProntoSeExistir()) {
      observadorSienna = new MutationObserver(() => {
        if (marcarProntoSeExistir()) {
          observadorSienna?.disconnect();
        }
      });
      observadorSienna.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    void import("sienna-accessibility").catch(() => {
      // Falha silenciosa: o restante do menu continua funcionando.
    });

    const sincronizarLeitorParagrafo = () => {
      const ativo =
        document.documentElement.classList.contains("asw-screen-reader");
      setLeitorParagrafoAtivo(ativo);
      if (!ativo) {
        limparDestaquesLeituraSienna(document);
      }
    };
    sincronizarLeitorParagrafo();

    const observadorHtml = new MutationObserver(sincronizarLeitorParagrafo);
    observadorHtml.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const observadorCores = new MutationObserver((mutacoes) => {
      for (const mutacao of mutacoes) {
        const alvo = mutacao.target;
        if (
          alvo instanceof HTMLElement &&
          alvo.hasAttribute("data-asw-orgcolor") &&
          !alvo.classList.contains("asw-reading")
        ) {
          restaurarCorElementoSienna(alvo);
        }
      }
    });
    observadorCores.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["class", "data-asw-orgcolor"],
    });

    const aoClicarNoMenuSienna = (evento: MouseEvent) => {
      const alvo = evento.target;
      if (alvo instanceof Element && alvo.closest(".asw-menu")) {
        window.setTimeout(() => liberarTamanhosSienna(document), 50);
      }
    };
    document.addEventListener("click", aoClicarNoMenuSienna);

    return () => {
      cancelado = true;
      observadorSienna?.disconnect();
      observadorHtml.disconnect();
      observadorCores.disconnect();
      document.removeEventListener("click", aoClicarNoMenuSienna);
    };
  }, []);

  // Libera tamanhos inline do Sienna a cada mudança de rota.
  useEffect(() => {
    if (!siennaPronto) return;
    liberarTamanhosSienna(document);
  }, [pathname, siennaPronto]);

  // Carrega o VLibras uma única vez (seguro com React Strict Mode).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const inicializarWidget = () => {
      if (
        !window.VLibras ||
        document.getElementById("vlibras-access-wrapper")
      ) {
        return;
      }
      new window.VLibras.Widget({
        rootPath: VLIBRAS_ROOT_PATH,
        position: "R",
      });
    };

    if (document.getElementById("vlibras-access-wrapper")) return;

    if (window.VLibras) {
      inicializarWidget();
      return;
    }

    const scriptExistente = document.querySelector<HTMLScriptElement>(
      `script[src="${VLIBRAS_SCRIPT_URL}"]`,
    );
    if (scriptExistente) {
      scriptExistente.addEventListener("load", inicializarWidget);
      return () => {
        scriptExistente.removeEventListener("load", inicializarWidget);
      };
    }

    const tag = document.createElement("script");
    tag.src = VLIBRAS_SCRIPT_URL;
    tag.async = true;
    tag.addEventListener("load", inicializarWidget);
    document.body.appendChild(tag);

    return () => {
      tag.removeEventListener("load", inicializarWidget);
    };
  }, []);

  // Listeners globais (click em capture na window e keydown em capture no document).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const aoClicarCapture = (evento: MouseEvent) => {
      const alvo = evento.target;
      if (!(alvo instanceof Element)) return;

      const dentroAcesso = Boolean(alvo.closest("#acesso"));
      const interativo = alvo.closest(SELETOR_INTERATIVO);
      const interativoSemTexto = Boolean(
        interativo && semTextoVisivel(interativo),
      );

      if (dentroAcesso || interativoSemTexto) {
        adicionarClasseTemporaria(interativo ?? alvo, "vlibras-links");
      }

      if (
        dentroAcesso ||
        !document.documentElement.classList.contains("asw-screen-reader")
      ) {
        return;
      }

      if (alvo.closest(".asw-menu, .asw-menu-btn, .asw-widget")) {
        return;
      }

      if (!interativo) {
        ultimoCliqueInterativoRef.current = null;
        return;
      }

      if (interativoSemTexto) {
        adicionarClasseTemporaria(alvo, "asw-widget");
        return;
      }

      const agora = Date.now();
      const anterior = ultimoCliqueInterativoRef.current;
      if (
        anterior &&
        anterior.el === interativo &&
        agora - anterior.hora <= JANELA_SEGUNDO_CLIQUE_MS
      ) {
        ultimoCliqueInterativoRef.current = null;
        adicionarClasseTemporaria(alvo, "asw-widget");
        return;
      }

      ultimoCliqueInterativoRef.current = { el: interativo, hora: agora };
    };

    const aoPressionarTeclaCapture = (evento: KeyboardEvent) => {
      if (siennaAberto(document)) {
        if (evento.key === "Escape") {
          evento.preventDefault();
          const fechar = document.querySelector<HTMLElement>(
            ".asw-menu .asw-menu-close",
          );
          fechar?.click();
          aoFocarBotaoPrincipalRef.current?.();
          return;
        }

        const alvo = evento.target;
        const menu = document.querySelector<HTMLElement>(".asw-menu");
        if (
          (evento.key === "Enter" || evento.key === " ") &&
          alvo instanceof HTMLElement &&
          alvo.getAttribute("role") === "button" &&
          alvo.tagName !== "BUTTON" &&
          alvo.tagName !== "A" &&
          menu?.contains(alvo)
        ) {
          evento.preventDefault();
          if (alvo.classList.contains("asw-menu-close")) {
            alvo.click();
            aoFocarBotaoPrincipalRef.current?.();
          } else {
            alvo.click();
          }
        }
        return;
      }

      if (
        evento.key === "Escape" &&
        !document.querySelector("#acesso-painel:not([hidden])") &&
        document.documentElement.classList.contains("asw-screen-reader")
      ) {
        evento.preventDefault();
        definirLeitorParagrafo(false);
      }
    };

    window.addEventListener("click", aoClicarCapture, true);
    document.addEventListener("keydown", aoPressionarTeclaCapture, true);

    return () => {
      window.removeEventListener("click", aoClicarCapture, true);
      document.removeEventListener("keydown", aoPressionarTeclaCapture, true);
    };
  }, [definirLeitorParagrafo]);

  return {
    siennaPronto,
    leitorParagrafoAtivo,
    abrirLibras,
    abrirAjustesSienna,
    definirLeitorParagrafo,
    alternarLeitorParagrafo,
  };
}
