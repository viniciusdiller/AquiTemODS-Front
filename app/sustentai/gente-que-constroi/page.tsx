"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, HeartHandshake, Loader2, Search, X } from "lucide-react";
import { getPessoasSustentai } from "@/lib/api";

export default function HistoricoGenteQueConstroiPage() {
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState("");

  const [pessoaSelecionada, setPessoaSelecionada] = useState<any | null>(null);

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const dadosPessoas = await getPessoasSustentai();
        setPessoas(dadosPessoas);
      } catch (error) {
        console.error("Erro ao carregar Hall da Fama:", error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarHistorico();
  }, []);

  const getFullImageUrl = (url: string | null) => {
    if (!url) return "/placeholder-user.jpg";
    if (url.startsWith("http") || url.startsWith("blob:")) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const pessoasFiltradas = pessoas.filter(
    (pessoa) =>
      pessoa.nome.toLowerCase().includes(busca.toLowerCase()) ||
      pessoa.cargo.toLowerCase().includes(busca.toLowerCase()),
  );

  const LIMITE_DESCRICAO = 120;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="w-12 h-12 text-[#D7386E] animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">
          Carregando Hall da Fama...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 px-4 sm:px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-auto">
            <Link
              href="/sustentai"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[#D7386E] font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Voltar para o SustentAí
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div className="bg-pink-100 p-3 rounded-full shrink-0">
                <HeartHandshake className="text-[#D7386E] w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Hall da Fama
              </h1>
            </div>
            <p className="text-gray-500 text-lg max-w-2xl">
              Um registro de todas as pessoas inspiradoras que já ajudaram a
              construir uma cidade melhor através do nosso projeto.
            </p>
          </div>

          {/* BARRA DE PESQUISA */}
          <div className="w-full md:w-96 relative shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome ou cargo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D7386E]/50 focus:border-[#D7386E] transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        {pessoasFiltradas.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {pessoasFiltradas.map((pessoa) => {
              const precisaVerMais =
                pessoa.descricao?.length > LIMITE_DESCRICAO;

              return (
                <div
                  key={pessoa.id}
                  className="group flex flex-col h-full bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative w-full aspect-square mb-3 sm:mb-5 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    <img
                      src={getFullImageUrl(pessoa.imagemUrl)}
                      alt={pessoa.nome}
                      draggable={false}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="flex flex-col flex-grow text-center px-1 sm:px-2">
                    <h4 className="font-bold text-[#3C6AB2] text-base sm:text-xl mb-1 leading-tight">
                      {pessoa.nome}
                    </h4>
                    <p className="text-[12px] sm:text-sm text-[#D7386E] font-bold mb-2 sm:mb-3 line-clamp-2">
                      {pessoa.cargo}
                    </p>

                    <div className="md:hidden text-xs text-gray-600 leading-relaxed mb-4 flex-grow text-justify">
                      {precisaVerMais ? (
                        <>
                          {pessoa.descricao.substring(0, LIMITE_DESCRICAO)}...
                          <button
                            onClick={() => setPessoaSelecionada(pessoa)}
                            className="text-[#3C6AB2] font-semibold hover:underline ml-1 focus:outline-none"
                          >
                            Ler mais
                          </button>
                        </>
                      ) : (
                        pessoa.descricao
                      )}
                    </div>

                    <div className="hidden md:block text-sm text-gray-600 leading-relaxed mb-4 flex-grow text-justify">
                      {pessoa.descricao}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-200 border-dashed shadow-sm">
            <HeartHandshake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500">
              Nenhuma pessoa encontrada
            </h3>
            <p className="text-gray-400 mt-2">
              Ninguém com o nome ou cargo "{busca}" foi encontrado.
            </p>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL / POP-UP (LER MAIS)                    */}
      {/* ========================================== */}
      {pessoaSelecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col">
            {/* Botão Fechar */}
            <button
              onClick={() => setPessoaSelecionada(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors z-10 shadow-sm"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Imagem no Modal usando as EXATAS mesmas classes da parte de fora para evitar cortes */}
            <div className="relative w-full aspect-square mb-4 sm:mb-5 rounded-xl overflow-hidden shrink-0 border border-gray-100">
              <img
                src={getFullImageUrl(pessoaSelecionada.imagemUrl)}
                alt={pessoaSelecionada.nome}
                draggable={false}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Textos Completos no Modal */}
            <div className="flex flex-col text-center px-1 sm:px-2">
              <h4 className="font-bold text-[#3C6AB2] text-xl sm:text-2xl mb-1 leading-tight">
                {pessoaSelecionada.nome}
              </h4>
              <p className="text-sm sm:text-base text-[#D7386E] font-bold mb-4">
                {pessoaSelecionada.cargo}
              </p>

              {/* Área de scroll se a descrição for colossal */}
              <div className="text-sm text-gray-600 leading-relaxed text-justify max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                {pessoaSelecionada.descricao}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
