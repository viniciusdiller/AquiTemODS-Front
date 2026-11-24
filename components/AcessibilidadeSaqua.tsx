"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Hand,
  MousePointerClick,
  Pause,
  Play,
  SlidersHorizontal,
  Square,
  Volume2,
  X,
} from "lucide-react";
import { rotaSemMenu } from "@/lib/acessibilidade";
import {
  type SituacaoLeitura,
  type VelocidadeLeitura,
  useLeitorPagina,
} from "@/hooks/use-leitor-pagina";
import { useAcessibilidadeVendors } from "@/hooks/use-acessibilidade-vendors";

function MenuAcessibilidade({ pathname }: { pathname: string }) {
  const [aberto, setAberto] = useState(false);
  const [playerExpandido, setPlayerExpandido] = useState(false);

  const caixaRef = useRef<HTMLDivElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);
  const botaoPrincipalRef = useRef<HTMLButtonElement>(null);
  const botaoPrincipalOuvirRef = useRef<HTMLButtonElement>(null);

  const focarBotaoPrincipal = useCallback(() => {
    botaoPrincipalRef.current?.focus();
  }, []);

  const devolverFocoPlayer = useCallback((_situacao: SituacaoLeitura) => {
    const ativo = document.activeElement;
    if (
      ativo === document.body ||
      (ativo instanceof HTMLButtonElement && ativo.disabled)
    ) {
      botaoPrincipalOuvirRef.current?.focus();
    }
  }, []);

  const {
    suportaVoz,
    situacao,
    mensagemVoz,
    velocidade,
    ler,
    pausar,
    continuar,
    parar,
    alterarVelocidade,
  } = useLeitorPagina({
    pathname,
    aoDevolverFoco: devolverFocoPlayer,
  });

  const {
    siennaPronto,
    leitorParagrafoAtivo,
    abrirLibras,
    abrirAjustesSienna,
    definirLeitorParagrafo,
    alternarLeitorParagrafo,
  } = useAcessibilidadeVendors({
    pathname,
    aoFocarBotaoPrincipal: focarBotaoPrincipal,
  });

  // Exclusão mútua: se o leitor por parágrafo for ativado pelo menu do Sienna, para a leitura da página inteira.
  useEffect(() => {
    if (leitorParagrafoAtivo && situacao !== "parado") {
      parar();
    }
  }, [leitorParagrafoAtivo, parar, situacao]);

  // Ao abrir o painel, foca o primeiro controle disponível.
  useEffect(() => {
    if (!aberto) return;
    const primeiro = painelRef.current?.querySelector<HTMLElement>(
      "button:not([disabled]), select:not([disabled])",
    );
    primeiro?.focus();
  }, [aberto]);

  // Fecha ao clicar fora (composedPath) ou pressionar Esc (devolvendo foco ao botão principal).
  useEffect(() => {
    if (!aberto) return;

    const aoClicarFora = (evento: MouseEvent) => {
      const caixa = caixaRef.current;
      if (!caixa) return;
      const caminho =
        typeof evento.composedPath === "function" ? evento.composedPath() : [];
      const dentro =
        caminho.length > 0
          ? caminho.includes(caixa)
          : evento.target instanceof Node && caixa.contains(evento.target);
      if (!dentro) setAberto(false);
    };

    const aoPressionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        setAberto(false);
        focarBotaoPrincipal();
      }
    };

    document.addEventListener("click", aoClicarFora);
    document.addEventListener("keydown", aoPressionarTecla);
    return () => {
      document.removeEventListener("click", aoClicarFora);
      document.removeEventListener("keydown", aoPressionarTecla);
    };
  }, [aberto, focarBotaoPrincipal]);

  const algumLeitorAtivo = situacao !== "parado" || leitorParagrafoAtivo;

  const acionarLibras = () => {
    setAberto(false);
    abrirLibras();
  };

  const acionarAjustes = () => {
    setAberto(false);
    abrirAjustesSienna();
  };

  const acionarLeitorParagrafo = () => {
    if (!leitorParagrafoAtivo && situacao !== "parado") {
      parar();
    }
    alternarLeitorParagrafo();
  };

  const acionarBotaoPrincipalOuvir = () => {
    if (situacao === "lendo") {
      pausar();
      return;
    }
    if (leitorParagrafoAtivo) {
      definirLeitorParagrafo(false);
    }
    if (situacao === "pausado") {
      continuar();
    } else {
      ler();
    }
  };

  const textoBotaoPrincipalOuvir =
    situacao === "lendo"
      ? "Pausar"
      : situacao === "pausado"
        ? "Continuar"
        : "Ouvir";

  return (
    <div id="acesso" className="acesso asw-widget" ref={caixaRef}>
      <div
        id="acesso-painel"
        ref={painelRef}
        className="acesso-pilulas"
        role="group"
        aria-label="Ferramentas de acessibilidade"
        hidden={!aberto}
      >
        <button
          type="button"
          id="acesso-libras"
          className="acesso-pilula"
          onClick={acionarLibras}
        >
          <span className="acesso-pilula-icone" aria-hidden="true">
            <Hand size={17} />
          </span>
          <span>Traduzir em Libras</span>
        </button>

        {siennaPronto && (
          <button
            type="button"
            id="acesso-ajustes"
            className="acesso-pilula"
            onClick={acionarAjustes}
          >
            <span className="acesso-pilula-icone" aria-hidden="true">
              <SlidersHorizontal size={17} />
            </span>
            <span>Menu de acessibilidade</span>
          </button>
        )}

        {siennaPronto && suportaVoz && (
          <button
            type="button"
            id="acesso-ouvir-paragrafo"
            className="acesso-pilula"
            aria-pressed={leitorParagrafoAtivo}
            onClick={acionarLeitorParagrafo}
          >
            <span className="acesso-pilula-icone" aria-hidden="true">
              <MousePointerClick size={17} />
            </span>
            <span>Ouvir por parágrafo</span>
            {leitorParagrafoAtivo && (
              <span className="acesso-pilula-badge">Ativo</span>
            )}
          </button>
        )}

        {suportaVoz &&
          (!playerExpandido ? (
            <button
              type="button"
              id="acesso-ouvir"
              className="acesso-pilula"
              onClick={() => setPlayerExpandido(true)}
            >
              <span className="acesso-pilula-icone" aria-hidden="true">
                <Volume2 size={17} />
              </span>
              <span>Ouvir página inteira</span>
              {situacao === "lendo" && (
                <span className="acesso-pilula-badge">Lendo</span>
              )}
              {situacao === "pausado" && (
                <span className="acesso-pilula-badge">Pausado</span>
              )}
            </button>
          ) : (
            <section
              id="ouvir"
              className="acesso-pilula-player"
              aria-label="Ouvir página inteira"
            >
              <div className="acesso-player-cabecalho">
                <span className="acesso-player-titulo">
                  <Volume2 size={16} aria-hidden="true" />
                  Ouvir página inteira
                </span>
                <button
                  type="button"
                  className="acesso-player-fechar"
                  aria-label="Recolher controles de leitura"
                  onClick={() => setPlayerExpandido(false)}
                >
                  <X size={15} aria-hidden="true" />
                </button>
              </div>

              <div className="acesso-player-controles">
                <button
                  type="button"
                  ref={botaoPrincipalOuvirRef}
                  className="ouvir-acao ouvir-acao-principal"
                  onClick={acionarBotaoPrincipalOuvir}
                >
                  {situacao === "lendo" ? (
                    <Pause size={15} aria-hidden="true" />
                  ) : (
                    <Play size={15} aria-hidden="true" />
                  )}
                  {textoBotaoPrincipalOuvir}
                </button>

                {situacao !== "parado" && (
                  <button
                    type="button"
                    className="ouvir-acao"
                    onClick={() => parar()}
                  >
                    <Square size={14} aria-hidden="true" />
                    Parar
                  </button>
                )}

                <select
                  id="ouvir-velocidade"
                  className="ouvir-velocidade-compacta"
                  aria-label="Velocidade da leitura"
                  value={velocidade}
                  onChange={(e) =>
                    alterarVelocidade(e.target.value as VelocidadeLeitura)
                  }
                >
                  <option value="0.75">0,75×</option>
                  <option value="1">1×</option>
                  <option value="1.25">1,25×</option>
                  <option value="1.5">1,5×</option>
                </select>
              </div>

              <p id="ouvir-estado" className="ouvir-estado" aria-live="polite">
                {mensagemVoz}
              </p>
            </section>
          ))}
      </div>

      <button
        type="button"
        id="acesso-botao"
        ref={botaoPrincipalRef}
        className={`acesso-botao${algumLeitorAtivo ? " ativo" : ""}`}
        aria-expanded={aberto}
        aria-controls="acesso-painel"
        aria-label="Acessibilidade: Libras, ajustes de leitura e ouvir a página"
        onClick={() => setAberto((anterior) => !anterior)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="6.8" r="1.5" />
          <path d="M7 9.6 12 11l5-1.4M12 11v3.4M9.4 18.2 12 14.4l2.6 3.8" />
        </svg>
        <span className="acesso-botao-texto">Acessibilidade</span>
      </button>
    </div>
  );
}

/**
 * Menu de acessibilidade (Libras, ajustes de leitura e ouvir a página).
 * Não monta hooks nem carrega scripts no painel administrativo (/admin).
 */
export default function AcessibilidadeSaqua() {
  const pathname = usePathname() ?? "/";
  if (rotaSemMenu(pathname)) return null;
  return <MenuAcessibilidade pathname={pathname} />;
}
