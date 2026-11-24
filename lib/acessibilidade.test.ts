import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  TAMANHO_TRECHO,
  dividirEmTrechos,
  escalaDaFonte,
  extrairTrechosDaPagina,
  garantirMenuSiennaNoDom,
  instalarProtetorListenerSienna,
  liberarTamanhosSienna,
  limparDestaquesLeituraSienna,
  restaurarCorElementoSienna,
  rotaSemMenu,
  siennaAberto,
  textoDaPagina,
  traduzirRotulosSienna,
} from "./acessibilidade";

beforeEach(() => {
  document.body.innerHTML = "";
  document.documentElement.className = "";
  window.localStorage.clear();
  delete window.__asw__onClickScreenReader;
});

describe("rotaSemMenu", () => {
  it.each(["/admin", "/admin/", "/admin/usuarios"])(
    "esconde o menu em %s",
    (rota) => {
      expect(rotaSemMenu(rota)).toBe(true);
    },
  );

  it.each(["/", "/projetos/1", "/administracao", "/meu/admin", "/Admin"])(
    "mostra o menu em %s",
    (rota) => {
      expect(rotaSemMenu(rota)).toBe(false);
    },
  );
});

describe("dividirEmTrechos", () => {
  it("retorna lista vazia para texto vazio ou só espaços", () => {
    expect(dividirEmTrechos("")).toEqual([]);
    expect(dividirEmTrechos("   \n\t  ")).toEqual([]);
  });

  it("mantém texto curto em um único trecho", () => {
    expect(dividirEmTrechos("Primeira frase. Segunda frase.")).toEqual([
      "Primeira frase. Segunda frase.",
    ]);
  });

  it("corta no fim da frase respeitando TAMANHO_TRECHO", () => {
    const fraseA = `${"A".repeat(130)}. `;
    const fraseB = `${"B".repeat(130)}. `;
    const fraseC = `${"C".repeat(50)}.`;
    const trechos = dividirEmTrechos(fraseA + fraseB + fraseC);

    expect(trechos).toHaveLength(2);
    expect(trechos[0].length).toBeLessThanOrEqual(TAMANHO_TRECHO);
    expect(trechos[0]).toBe(`${"A".repeat(130)}.`);
    expect(trechos[1]).toBe(`${"B".repeat(130)}. ${"C".repeat(50)}.`);
  });
});

describe("textoDaPagina e extrairTrechosDaPagina", () => {
  it("prioriza <main> visível e ignora elementos ocultos, menus, selects e scripts", () => {
    document.body.innerHTML = `
      <header><p>Cabeçalho ignorado</p></header>
      <main hidden><p>Main oculto</p></main>
      <main>
        <h1>Aqui Tem ODS</h1>
        <p><span>Saquarema</span><span>Sustentável</span></p>
        <p aria-hidden="true">Oculto aria</p>
        <p hidden>Oculto hidden</p>
        <div data-acesso-ignorar>Ignorado custom</div>
        <select><option>Opção ignorada</option></select>
        <script>console.log("ignorado")</script>
        <div id="acesso"><button>Acessibilidade</button></div>
        <div class="asw-container"><button>Sienna</button></div>
      </main>
      <footer><p>Rodapé ignorado</p></footer>
    `;

    expect(textoDaPagina(document)).toBe(
      "Aqui Tem ODS. Saquarema, Sustentável.",
    );
    expect(extrairTrechosDaPagina(document)).toEqual([
      "Aqui Tem ODS. Saquarema, Sustentável.",
    ]);
  });

  it("usa document.body quando não há <main>", () => {
    document.body.innerHTML = `<p>Conteúdo direto no body</p>`;
    expect(textoDaPagina(document)).toBe("Conteúdo direto no body.");
  });
});

describe("escalaDaFonte e liberarTamanhosSienna", () => {
  it("retorna 1 por padrão ou quando JSON é inválido", () => {
    expect(escalaDaFonte(null)).toBe(1);
    expect(escalaDaFonte(window.localStorage)).toBe(1);

    window.localStorage.setItem("asw-user-settings", "{invalido");
    expect(escalaDaFonte(window.localStorage)).toBe(1);
  });

  it("lê fontSize configurado no localStorage", () => {
    window.localStorage.setItem(
      "asw-user-settings",
      JSON.stringify({ states: { fontSize: 1.2 } }),
    );
    expect(escalaDaFonte(window.localStorage)).toBe(1.2);
  });

  it("remove font-size inline e data-asw-org-font-size quando escala é 1", () => {
    document.body.innerHTML = `
      <p id="p1" data-asw-org-font-size="16" style="font-size: 16px; color: red;">Texto</p>
    `;
    liberarTamanhosSienna(document);

    const p1 = document.getElementById("p1") as HTMLElement;
    expect(p1.style.fontSize).toBe("");
    expect(p1.style.color).toBe("red");
    expect(p1.hasAttribute("data-asw-org-font-size")).toBe(false);
  });

  it("preserva font-size inline quando escala é diferente de 1", () => {
    window.localStorage.setItem(
      "asw-user-settings",
      JSON.stringify({ states: { fontSize: 1.3 } }),
    );
    document.body.innerHTML = `
      <p id="p1" data-asw-org-font-size="16" style="font-size: 20.8px;">Texto</p>
    `;
    liberarTamanhosSienna(document);

    const p1 = document.getElementById("p1") as HTMLElement;
    expect(p1.style.fontSize).toBe("20.8px");
    expect(p1.getAttribute("data-asw-org-font-size")).toBe("16");
  });
});

describe("restaurarCorElementoSienna e limparDestaquesLeituraSienna", () => {
  it("restaura cor original quando havia cor inline", () => {
    document.body.innerHTML = `
      <p id="p1" class="asw-reading" data-asw-orgcolor="rgb(20, 33, 61)" style="color: rgb(255, 255, 255) !important;">Texto</p>
    `;
    const p1 = document.getElementById("p1") as HTMLElement;
    restaurarCorElementoSienna(p1);

    expect(p1.style.color).toBe("rgb(20, 33, 61)");
    expect(p1.hasAttribute("data-asw-orgcolor")).toBe(false);
  });

  it("remove propriedade color quando data-asw-orgcolor era vazio e limpa .asw-reading", () => {
    document.body.innerHTML = `
      <p id="p1" class="asw-reading" data-asw-orgcolor="" style="color: #ffffff !important;">Texto</p>
      <span id="s1" data-asw-orgcolor="" style="color: #ffffff !important;">Resto</span>
    `;

    limparDestaquesLeituraSienna(document);

    const p1 = document.getElementById("p1") as HTMLElement;
    const s1 = document.getElementById("s1") as HTMLElement;
    expect(p1.classList.contains("asw-reading")).toBe(false);
    expect(p1.style.color).toBe("");
    expect(p1.hasAttribute("data-asw-orgcolor")).toBe(false);
    expect(s1.style.color).toBe("");
    expect(s1.hasAttribute("data-asw-orgcolor")).toBe(false);
  });
});

describe("traduzirRotulosSienna", () => {
  it("traduz fechar, restaurar, select e botões do menu .asw-menu", () => {
    document.body.innerHTML = `
      <div class="asw-menu">
        <div class="asw-menu-close" aria-label="Close" title="Close"></div>
        <div class="asw-menu-reset" aria-label="Reset" title="Reset"></div>
        <select aria-label="Language"><option value="pt">Português</option></select>
        <button class="asw-btn" aria-label="Highlight Links">Destacar links\nExtra</button>
      </div>
    `;

    traduzirRotulosSienna(document);

    const fechar = document.querySelector(".asw-menu-close") as HTMLElement;
    const restaurar = document.querySelector(".asw-menu-reset") as HTMLElement;
    const select = document.querySelector(".asw-menu select") as HTMLElement;
    const btn = document.querySelector(".asw-btn") as HTMLElement;

    expect(fechar.getAttribute("aria-label")).toBe(
      "Fechar os ajustes de leitura",
    );
    expect(fechar.title).toBe("Fechar");
    expect(restaurar.getAttribute("aria-label")).toBe(
      "Restaurar as configurações",
    );
    expect(restaurar.title).toBe("Restaurar as configurações");
    expect(select.getAttribute("aria-label")).toBe("Idioma do menu");
    expect(btn.getAttribute("aria-label")).toBe("Destacar links");
  });
});

describe("siennaAberto e garantirMenuSiennaNoDom", () => {
  it("identifica se o menu do Sienna está aberto ou fechado", () => {
    expect(siennaAberto(document)).toBe(false);

    document.body.innerHTML = `
      <div id="wrapper" style="display: none;"><div class="asw-menu"></div></div>
    `;
    expect(siennaAberto(document)).toBe(false);

    (document.getElementById("wrapper") as HTMLElement).style.display = "block";
    expect(siennaAberto(document)).toBe(true);
  });

  it("cria .asw-menu sob demanda via .asw-menu-btn e o mantém fechado", () => {
    const botao = document.createElement("button");
    botao.className = "asw-menu-btn";
    botao.addEventListener("click", () => {
      let wrapper = document.getElementById("sienna-wrapper");
      if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.id = "sienna-wrapper";
        wrapper.style.display = "block";
        wrapper.innerHTML = `
          <div class="asw-menu">
            <button class="asw-menu-close"></button>
          </div>
        `;
        wrapper
          .querySelector(".asw-menu-close")
          ?.addEventListener("click", () => {
            wrapper!.style.display = "none";
          });
        document.body.appendChild(wrapper);
      } else {
        wrapper.style.display =
          wrapper.style.display === "none" ? "block" : "none";
      }
    });
    document.body.appendChild(botao);

    const menu = garantirMenuSiennaNoDom(document);
    expect(menu).not.toBeNull();
    expect(siennaAberto(document)).toBe(false);
  });
});

describe("instalarProtetorListenerSienna", () => {
  it("faz polyfill de SVGElement.prototype.innerText usando textContent", () => {
    instalarProtetorListenerSienna(window);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.textContent = "Ícone SVG";
    expect((svg as unknown as { innerText: string }).innerText).toBe(
      "Ícone SVG",
    );
  });

  it("remove o listener click (capture) anterior ao sobrescrever __asw__onClickScreenReader", () => {
    instalarProtetorListenerSienna(window);

    const primeiro = vi.fn();
    const segundo = vi.fn();
    const removeSpy = vi.spyOn(document, "removeEventListener");

    window.__asw__onClickScreenReader = primeiro;
    document.addEventListener("click", primeiro, true);

    window.__asw__onClickScreenReader = segundo;
    document.addEventListener("click", segundo, true);

    expect(removeSpy).toHaveBeenCalledWith("click", primeiro, true);

    document.body.click();
    expect(primeiro).not.toHaveBeenCalled();
    expect(segundo).toHaveBeenCalledTimes(1);

    document.removeEventListener("click", segundo, true);
    removeSpy.mockRestore();
  });
});
