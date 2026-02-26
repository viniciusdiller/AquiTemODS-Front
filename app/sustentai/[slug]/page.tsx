"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";

// ==========================================
// MOCK DATA (Simulando o JSON que viria do Backend)
// ==========================================
const mockDadosDaAcao = {
  titulo: "Sala do Empreendedor concorre ao Selo de Referência do Sebrae",
  data: "10 de Abril de 2025",
  autor: "Equipe SustentAí",
  blocos: [
    {
      id: "1",
      type: "text",
      content:
        "A Sala do Empreendedor de Saquarema está vivendo um momento histórico! Estamos concorrendo ao cobiçado Selo de Referência em Atendimento do Sebrae, um reconhecimento que demonstra o nosso compromisso diário com o desenvolvimento da economia local e o apoio aos nossos empreendedores.",
      bgColor: "bg-white",
      isBold: true,
    },
    {
      id: "2",
      type: "image",
      content:
        "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=1200&auto=format&fit=crop&q=80",
      bgColor: "bg-transparent",
      isBold: false,
    },
    {
      id: "3",
      type: "text",
      content:
        "Para continuarmos oferecendo o melhor atendimento, a nossa equipe passou por um treinamento intensivo focado em resolução rápida de problemas de microempreendedores individuais (MEIs).\n\nNosso objetivo é desburocratizar processos e fazer com que quem quer abrir ou expandir um negócio em Saquarema tenha todo o suporte necessário, desde a formalização até a captação de crédito.",
      bgColor: "bg-pink-50",
      isBold: false,
    },
    {
      id: "4",
      type: "image",
      content: "/enigmas_do_futuro.png",
      bgColor: "bg-transparent",
      isBold: false,
    },
    {
      id: "5",
      type: "text",
      content:
        "Venha nos visitar e conhecer de perto nossos serviços!\nEstamos funcionando de segunda a sexta, das 09h às 17h, no centro da cidade. Esperamos por você!",
      bgColor: "bg-blue-50",
      isBold: true,
    },
  ],
};

export default function PaginaAcaoInterna() {
  const acao = mockDadosDaAcao;

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden">
        {/* ========================================== */}
        {/* HEADER DO ARTIGO                           */}
        {/* ========================================== */}
        <div className="p-8 md:p-12 lg:p-16 border-b border-gray-100 bg-white relative">
          {/* Botão Voltar */}
          <Link
            href="/sustentai"
            className="inline-flex items-center gap-2 text-[#D7386E] font-semibold mb-8 hover:bg-pink-50 px-4 py-2 rounded-full transition-colors -ml-4"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar para SustentAí
          </Link>

          {/* Título */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {acao.titulo}
          </h1>

          {/* Metadados (Data e Autor) */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6 mt-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <Calendar className="w-4 h-4 text-[#3C6AB2]" /> {acao.data}
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                Por{" "}
                <span className="text-gray-800 font-bold">{acao.autor}</span>
              </div>
            </div>

            {/* Botão de Compartilhar Simbólico */}
            <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================== */}
        {/* RENDERIZADOR DE BLOCOS (O CONTEÚDO)        */}
        {/* ========================================== */}
        <div className="p-8 md:p-12 lg:p-16 space-y-8 md:space-y-10 bg-gray-50/30">
          {acao.blocos.map((bloco) => {
            // 1. Renderiza Bloco de Imagem
            if (bloco.type === "image") {
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

            // 2. Renderiza Bloco de Texto
            if (bloco.type === "text") {
              // Se o fundo for branco, tira o padding excessivo para parecer texto corrido de blog.
              // Se tiver cor, coloca padding para virar uma "Caixa de Destaque".
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

            return null; // Caso surja algum tipo de bloco não reconhecido
          })}
        </div>
      </div>
    </div>
  );
}
