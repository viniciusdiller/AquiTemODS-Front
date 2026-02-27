"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, Share2, Loader2, Tag } from "lucide-react";
import { getAcaoSustentaiById, getAcaoConteudo } from "@/lib/api";

// Tipagem para facilitar a leitura do código
interface Block {
  id: string;
  type: "text" | "image";
  content: string;
  bgColor: string;
  isBold: boolean;
}

export default function PaginaAcaoInterna() {
  const params = useParams();
  const idAcao = params.slug as string;

  // Estados vazios aguardando os dados
  const [acao, setAcao] = useState<any>(null);
  const [blocos, setBlocos] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const buscarDadosDaPagina = async () => {
      try {
        // Busca os dados da Capa (Título, Data) e o Conteúdo (Blocos) ao mesmo tempo!
        const [dadosAcao, dadosConteudo] = await Promise.all([
          getAcaoSustentaiById(idAcao),
          getAcaoConteudo(idAcao),
        ]);

        setAcao(dadosAcao);

        // Se a API retornar blocos, salva no estado. Se não, deixa um array vazio.
        if (dadosConteudo && dadosConteudo.blocos) {
          setBlocos(dadosConteudo.blocos);
        }
      } catch (error) {
        console.error("Erro ao carregar a página:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (idAcao) {
      buscarDadosDaPagina();
    }
  }, [idAcao]);

  // Função para compartilhar a página
  const handleCompartilhar = () => {
    if (navigator.share) {
      navigator.share({
        title: acao?.titulo || "Prefeitura de Saquarema",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  // 1. TELA DE CARREGAMENTO
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-[#D7386E] animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">
          Carregando artigo...
        </p>
      </div>
    );
  }

  // 2. TELA DE ERRO (Caso o ID não exista ou dê erro na API)
  if (!acao && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Página não encontrada
        </h1>
        <Link
          href="/sustentai"
          className="text-[#3C6AB2] hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para o início
        </Link>
      </div>
    );
  }

  // 3. A TELA PRINCIPAL (RENDERIZAÇÃO)
  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden">
        {/* ========================================== */}
        {/* HEADER DO ARTIGO                           */}
        {/* ========================================== */}
        <div className="p-8 md:p-12 lg:p-16 border-b border-gray-100 bg-white relative">
          <Link
            href="/sustentai"
            className="inline-flex items-center gap-2 text-[#D7386E] font-semibold mb-8 hover:bg-pink-50 px-4 py-2 rounded-full transition-colors -ml-4"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar para SustentAí
          </Link>

          {/* Tag Dinâmica (Se existir) */}
          {acao.tag && (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-gray-50 border border-gray-100 ${acao.corDestaque || "text-[#D7386E]"}`}
            >
              <Tag className="w-3 h-3" /> {acao.tag}
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {acao.titulo}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6 mt-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <Calendar className="w-4 h-4 text-[#3C6AB2]" />
                {/* Aqui você pode formatar a data que vem do banco (ex: criado_em) ou usar um texto fixo caso a API retorne */}
                {acao.data || "Publicado recentemente"}
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                Por{" "}
                <span className="text-gray-800 font-bold">
                  Equipe SustentAí
                </span>
              </div>
            </div>

            <button
              onClick={handleCompartilhar}
              className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
              title="Compartilhar"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================== */}
        {/* RENDERIZADOR DE BLOCOS (O CONTEÚDO)        */}
        {/* ========================================== */}
        <div className="p-8 md:p-12 lg:p-16 space-y-8 md:space-y-10 bg-gray-50/30 min-h-[400px]">
          {blocos.length > 0 ? (
            blocos.map((bloco) => {
              // Renderiza Bloco de Imagem
              if (bloco.type === "image" && bloco.content) {
                return (
                  <div
                    key={bloco.id}
                    className="w-full rounded-2xl overflow-hidden shadow-md my-10 group"
                  >
                    <img
                      src={bloco.content}
                      alt="Ilustração da ação"
                      className="w-full h-auto max-h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                );
              }

              // Renderiza Bloco de Texto
              if (bloco.type === "text" && bloco.content) {
                const isColoredBox = bloco.bgColor !== "bg-white";

                return (
                  <div
                    key={bloco.id}
                    className={`
                      ${isColoredBox ? `p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 ${bloco.bgColor}` : "py-2"}
                    `}
                  >
                    <p
                      className={`
                        text-lg md:text-xl leading-relaxed whitespace-pre-wrap
                        ${bloco.isBold ? "font-bold text-gray-900" : "text-gray-700"}
                        ${isColoredBox && !bloco.isBold ? "text-gray-800" : ""}
                      `}
                    >
                      {bloco.content}
                    </p>
                  </div>
                );
              }

              return null;
            })
          ) : (
            // Mensagem caso o administrador ainda não tenha montado os blocos para essa ação
            <div className="text-center text-gray-400 py-10 font-medium">
              O conteúdo completo deste artigo está sendo preparado e será
              disponibilizado em breve.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
