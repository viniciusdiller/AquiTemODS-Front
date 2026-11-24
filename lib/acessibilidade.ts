/**
 * Lógica pura e helpers de DOM para o menu de acessibilidade
 * (VLibras, Sienna Accessibility 2.1.0 e leitura em voz alta via Web Speech API).
 */

export const VLIBRAS_SCRIPT_URL = "https://vlibras.gov.br/app/vlibras-plugin.js";
export const VLIBRAS_ROOT_PATH = "https://vlibras.gov.br/app";
export const CHAVE_DICA_LIBRAS = "acesso-dica-libras";

export const MENSAGEM_LIBRAS_INDISPONIVEL =
  "O VLibras está indisponível no momento. Tente novamente em instantes.";
export const MENSAGEM_DICA_LIBRAS =
  "Dica: arraste o avatar pela barra azul para tirá-lo da frente.";

export const IGNORAR_NA_LEITURA = [
  "[aria-hidden='true']",
  "[hidden]",
  "script",
  "style",
  "template",
  "dialog",
  "select",
  "#acesso",
  ".asw-container",
  "[data-acesso-ignorar]",
].join(",");

export const TAMANHO_TRECHO = 220;

const SELETOR_BLOCO_LEITURA =
  "h1, h2, h3, h4, h5, h6, p, li, dt, dd, button, a, td, th, small, strong";

/** O menu não aparece no painel administrativo (/admin e subrotas). */
export function rotaSemMenu(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

/** Retorna o <main> visível da página; se não existir, usa document.body. */
export function conteudoPrincipal(doc: Document): HTMLElement {
  const mains = Array.from(doc.querySelectorAll<HTMLElement>("main"));
  return mains.find((el) => !el.closest("[hidden]")) ?? doc.body;
}

/**
 * Extrai o texto visível do conteúdo principal em frases, ignorando elementos
 * ocultos, scripts, seletores e o próprio menu de acessibilidade.
 */
export function textoDaPagina(doc: Document): string {
  const raiz = conteudoPrincipal(doc);
  if (!raiz) return "";

  const percorrer = doc.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
  const blocos: string[] = [];
  let blocoAtual: Element | null = null;
  let paiAnterior: Element | null = null;
  let noDeTexto: Node | null;

  while ((noDeTexto = percorrer.nextNode())) {
    const pai = noDeTexto.parentElement;
    const conteudo = (noDeTexto.nodeValue ?? "").replace(/\s+/g, " ");
    if (!conteudo.trim() || !pai || pai.closest(IGNORAR_NA_LEITURA)) continue;

    const bloco = pai.closest(SELETOR_BLOCO_LEITURA) ?? pai;
    if (bloco !== blocoAtual) {
      blocos.push("");
      blocoAtual = bloco;
    } else if (
      pai !== paiAnterior &&
      !/[\s,.;:]$/.test(blocos[blocos.length - 1])
    ) {
      blocos[blocos.length - 1] += ", ";
    }

    blocos[blocos.length - 1] += conteudo;
    paiAnterior = pai;
  }

  return blocos
    .map((bloco) => bloco.trim())
    .filter(Boolean)
    .map((bloco) => (/[.!?:…]$/.test(bloco) ? bloco : `${bloco}.`))
    .join(" ");
}

/** Divide um texto em trechos curtos respeitando fins de frase até o limite. */
export function dividirEmTrechos(
  texto: string,
  tamanhoMaximo = TAMANHO_TRECHO,
): string[] {
  const limpo = texto.trim();
  if (!limpo) return [];

  const frases = limpo.match(/[^.!?…]+[.!?…]*\s*/g) ?? [];
  const lista: string[] = [];
  let atual = "";

  for (const frase of frases) {
    if ((atual + frase).length > tamanhoMaximo && atual) {
      lista.push(atual.trim());
      atual = "";
    }
    atual += frase;
  }

  if (atual.trim()) lista.push(atual.trim());
  return lista;
}

/** Extrai e divide em trechos o conteúdo principal da página. */
export function extrairTrechosDaPagina(doc: Document): string[] {
  return dividirEmTrechos(textoDaPagina(doc));
}

/**
 * Correções de runtime para o Sienna 2.1.0:
 * - Polyfill de SVGElement.prototype.innerText (fallback para textContent).
 * - Setter em window.__asw__onClickScreenReader que remove o listener click
 *   (capture) anterior antes de registrar um novo, evitando vazamento.
 */
export function instalarProtetorListenerSienna(win: Window): void {
  const svgCtor = (win as unknown as { SVGElement?: typeof SVGElement })
    .SVGElement;
  if (svgCtor?.prototype && !("innerText" in svgCtor.prototype)) {
    Object.defineProperty(svgCtor.prototype, "innerText", {
      configurable: true,
      get(this: SVGElement) {
        return this.textContent ?? "";
      },
      set(this: SVGElement, valor: string) {
        this.textContent = valor;
      },
    });
  }

  const desc = Object.getOwnPropertyDescriptor(win, "__asw__onClickScreenReader");
  if (desc?.set) return;

  let listenerAtual: EventListener | undefined = win.__asw__onClickScreenReader;
  Object.defineProperty(win, "__asw__onClickScreenReader", {
    configurable: true,
    enumerable: true,
    get() {
      return listenerAtual;
    },
    set(novoListener: EventListener | undefined) {
      if (listenerAtual && listenerAtual !== novoListener) {
        win.document.removeEventListener("click", listenerAtual, true);
      }
      listenerAtual = novoListener;
    },
  });
}

/** Lê a escala de fonte salva pelo Sienna no localStorage (padrão 1). */
export function escalaDaFonte(
  storage: Pick<Storage, "getItem"> | null | undefined,
): number {
  if (!storage) return 1;
  try {
    const salvo = JSON.parse(storage.getItem("asw-user-settings") || "{}") as {
      states?: { fontSize?: unknown };
    };
    return Number(salvo?.states?.fontSize) || 1;
  } catch {
    return 1;
  }
}

/**
 * Quando fontSize === 1, remove font-size inline e data-asw-org-font-size
 * gravados pelo Sienna 2.1.0 para preservar tipografia fluida do CSS.
 */
export function liberarTamanhosSienna(
  doc: Document,
  storage?: Pick<Storage, "getItem"> | null,
): void {
  const store = storage === undefined ? doc.defaultView?.localStorage : storage;
  if (escalaDaFonte(store) !== 1) return;

  doc
    .querySelectorAll<HTMLElement>("[data-asw-org-font-size]")
    .forEach((elemento) => {
      elemento.style.removeProperty("font-size");
      elemento.removeAttribute("data-asw-org-font-size");
    });
}

/** Restaura a cor original salva em data-asw-orgcolor pelo leitor do Sienna. */
export function restaurarCorElementoSienna(el: Element): void {
  if (!(el instanceof HTMLElement)) return;
  if (!el.hasAttribute("data-asw-orgcolor")) return;

  const corOriginal = el.getAttribute("data-asw-orgcolor") ?? "";
  if (corOriginal) {
    el.style.color = corOriginal;
  } else {
    el.style.removeProperty("color");
  }
  el.removeAttribute("data-asw-orgcolor");
}

/** Remove destaques .asw-reading e restaura cores alteradas pelo Sienna. */
export function limparDestaquesLeituraSienna(doc: Document): void {
  doc.querySelectorAll(".asw-reading").forEach((el) => {
    el.classList.remove("asw-reading");
    restaurarCorElementoSienna(el);
  });
  doc.querySelectorAll("[data-asw-orgcolor]").forEach((el) => {
    restaurarCorElementoSienna(el);
  });
}

/** Traduz aria-label e title em inglês do menu .asw-menu do Sienna para pt-BR. */
export function traduzirRotulosSienna(doc: Document): void {
  const menu = doc.querySelector<HTMLElement>(".asw-menu");
  if (!menu) return;

  const fechar = menu.querySelector<HTMLElement>(".asw-menu-close");
  if (fechar) {
    fechar.setAttribute("aria-label", "Fechar os ajustes de leitura");
    fechar.title = "Fechar";
  }

  const restaurar = menu.querySelector<HTMLElement>(".asw-menu-reset");
  if (restaurar) {
    restaurar.setAttribute("aria-label", "Restaurar as configurações");
    restaurar.title = "Restaurar as configurações";
  }

  menu.querySelectorAll<HTMLElement>("[aria-label]").forEach((elemento) => {
    if (elemento === fechar || elemento === restaurar) return;
    if (elemento.tagName === "SELECT") {
      elemento.setAttribute("aria-label", "Idioma do menu");
      return;
    }
    const textoBruto = elemento.innerText || elemento.textContent || "";
    const texto = textoBruto.trim().split("\n")[0]?.trim();
    if (texto) elemento.setAttribute("aria-label", texto);
  });
}

/** Indica se o painel do Sienna está aberto na tela. */
export function siennaAberto(doc: Document): boolean {
  const menu = doc.querySelector<HTMLElement>(".asw-menu");
  return Boolean(
    menu && menu.parentElement && menu.parentElement.style.display !== "none",
  );
}

/**
 * Garante que .asw-menu exista no DOM (o Sienna o cria sob demanda no primeiro
 * clique em .asw-menu-btn), mantendo-o fechado caso não estivesse aberto.
 */
export function garantirMenuSiennaNoDom(doc: Document): HTMLElement | null {
  const existente = doc.querySelector<HTMLElement>(".asw-menu");
  if (existente) return existente;

  const botao = doc.querySelector<HTMLElement>(".asw-menu-btn");
  if (!botao) return null;

  botao.click();
  const criado = doc.querySelector<HTMLElement>(".asw-menu");
  if (criado && siennaAberto(doc)) {
    const fechar = criado.querySelector<HTMLElement>(".asw-menu-close");
    if (fechar) {
      fechar.click();
    } else {
      botao.click();
    }
  }
  return criado;
}
