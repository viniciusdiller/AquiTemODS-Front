"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { extrairTrechosDaPagina } from "@/lib/acessibilidade";

export type SituacaoLeitura = "parado" | "lendo" | "pausado";
export type VelocidadeLeitura = "0.75" | "1" | "1.25" | "1.5";

const MENSAGEM_INICIAL =
  "Lê em voz alta o conteúdo principal, sem menus nem rodapé.";

export interface OpcoesUseLeitorPagina {
  pathname: string;
  aoDevolverFoco?: (situacao: SituacaoLeitura) => void;
}

export function useLeitorPagina({
  pathname,
  aoDevolverFoco,
}: OpcoesUseLeitorPagina) {
  const [suportaVoz, setSuportaVoz] = useState(false);
  const [situacao, setSituacao] = useState<SituacaoLeitura>("parado");
  const [mensagemVoz, setMensagemVoz] = useState(MENSAGEM_INICIAL);
  const [velocidade, setVelocidadeState] = useState<VelocidadeLeitura>("1");

  const trechosRef = useRef<string[]>([]);
  const posicaoRef = useRef(0);
  const situacaoRef = useRef<SituacaoLeitura>("parado");
  const rodadaRef = useRef(0);
  const vozRef = useRef<SpeechSynthesisVoice | null>(null);
  const velocidadeRef = useRef<VelocidadeLeitura>("1");
  const pathnameAnteriorRef = useRef(pathname);
  const aoDevolverFocoRef = useRef(aoDevolverFoco);

  useEffect(() => {
    aoDevolverFocoRef.current = aoDevolverFoco;
  }, [aoDevolverFoco]);

  const silenciar = useCallback(() => {
    rodadaRef.current += 1;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const atualizarSituacao = useCallback(
    (novaSituacao: SituacaoLeitura, mensagem: string) => {
      situacaoRef.current = novaSituacao;
      setSituacao(novaSituacao);
      setMensagemVoz(mensagem);
      if (typeof window !== "undefined") {
        window.requestAnimationFrame(() => {
          aoDevolverFocoRef.current?.(novaSituacao);
        });
      }
    },
    [],
  );

  const parar = useCallback(
    (mensagem = "Leitura parada.") => {
      silenciar();
      posicaoRef.current = 0;
      atualizarSituacao("parado", mensagem);
    },
    [atualizarSituacao, silenciar],
  );

  const falar = useCallback(() => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      typeof window.SpeechSynthesisUtterance === "undefined"
    ) {
      return;
    }

    const trechos = trechosRef.current;
    const indice = posicaoRef.current;
    if (indice >= trechos.length) {
      parar("Leitura concluída.");
      return;
    }

    const minhaRodada = rodadaRef.current;
    const fala = new window.SpeechSynthesisUtterance(trechos[indice]);
    fala.lang = "pt-BR";
    if (vozRef.current) fala.voice = vozRef.current;
    fala.rate = Number(velocidadeRef.current) || 1;

    fala.onend = () => {
      if (minhaRodada !== rodadaRef.current || situacaoRef.current !== "lendo") {
        return;
      }
      posicaoRef.current += 1;
      falar();
    };

    fala.onerror = (erro) => {
      if (
        minhaRodada !== rodadaRef.current ||
        erro.error === "interrupted" ||
        erro.error === "canceled"
      ) {
        return;
      }
      parar("Não foi possível ler a página neste navegador.");
    };

    atualizarSituacao(
      "lendo",
      `Lendo… trecho ${indice + 1} de ${trechos.length}.`,
    );
    window.speechSynthesis.speak(fala);
  }, [atualizarSituacao, parar]);

  const ler = useCallback(() => {
    silenciar();
    const trechos = extrairTrechosDaPagina(document);
    trechosRef.current = trechos;
    posicaoRef.current = 0;

    if (!trechos.length) {
      parar("Não há texto para ler nesta página.");
      return;
    }

    falar();
  }, [falar, parar, silenciar]);

  const pausar = useCallback(() => {
    if (situacaoRef.current !== "lendo") return;
    silenciar();
    atualizarSituacao(
      "pausado",
      `Pausado no trecho ${posicaoRef.current + 1} de ${trechosRef.current.length}.`,
    );
  }, [atualizarSituacao, silenciar]);

  const continuar = useCallback(() => {
    if (situacaoRef.current !== "pausado") return;
    falar();
  }, [falar]);

  const alterarVelocidade = useCallback(
    (novaVelocidade: VelocidadeLeitura) => {
      velocidadeRef.current = novaVelocidade;
      setVelocidadeState(novaVelocidade);
      if (situacaoRef.current === "lendo") {
        silenciar();
        falar();
      }
    },
    [falar, silenciar],
  );

  // Detecta suporte à Web Speech API, seleciona voz pt-BR/pt* e escuta pagehide.
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      typeof window.SpeechSynthesisUtterance === "undefined"
    ) {
      return;
    }

    setSuportaVoz(true);
    const sintese = window.speechSynthesis;

    const escolherVoz = () => {
      const vozes = sintese.getVoices();
      vozRef.current =
        vozes.find((candidata) => /^pt[-_]BR$/i.test(candidata.lang)) ??
        vozes.find((candidata) => /^pt/i.test(candidata.lang)) ??
        null;
    };

    escolherVoz();
    sintese.addEventListener?.("voiceschanged", escolherVoz);

    const aoSairDaPagina = () => {
      silenciar();
    };
    window.addEventListener("pagehide", aoSairDaPagina);

    return () => {
      sintese.removeEventListener?.("voiceschanged", escolherVoz);
      window.removeEventListener("pagehide", aoSairDaPagina);
      silenciar();
    };
  }, [silenciar]);

  // Para automaticamente ao navegar entre rotas.
  useEffect(() => {
    if (pathnameAnteriorRef.current === pathname) return;
    pathnameAnteriorRef.current = pathname;
    if (situacaoRef.current !== "parado") {
      parar("A tela mudou. Use “Ouvir” para ler a nova tela.");
    }
  }, [parar, pathname]);

  return {
    suportaVoz,
    situacao,
    mensagemVoz,
    velocidade,
    ler,
    pausar,
    continuar,
    parar,
    alterarVelocidade,
  };
}
