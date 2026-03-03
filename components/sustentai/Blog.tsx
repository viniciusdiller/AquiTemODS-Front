"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  HeartHandshake,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Tag,
  Loader2,
} from "lucide-react";
import { FadeInScroll } from "./Animationcards";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import Link from "next/link";
import {
  getAcoesSustentai,
  getPessoasSustentai,
  getHeaderSustentai,
} from "@/lib/api";

export default function NewsletterDestaque() {
  const [header, setHeader] = useState({ titulo: "", subtitulo: "", data: "" });

  // 1. COMEÇA VAZIO!
  const [acoesSustentai, setAcoesSustentai] = useState<any[]>([]);
  const [genteQueConstroi, setGenteQueConstroi] = useState<any[]>([]);

  // 2. ESTADO DO LOADER (Começa ativado)
  const [isLoading, setIsLoading] = useState(true);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Ref para o scroll da lista de pessoas
  const carrosselRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getFullImageUrl = (path: string) => {
    if (!path) return "/placeholder-image.png";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  // 3. O EFEITO MÁGICO (Roda sozinho ao abrir a página)
  useEffect(() => {
    let mounted = true;

    const buscarDadosDoBackend = async () => {
      setIsLoading(true);

      // Buscas separadas para evitar falha em cascata
      const [acoesResult, pessoasResult, headerResult] = await Promise.all([
        getAcoesSustentai().catch((err) => {
          console.error("Erro ao buscar ações SustentAí:", err);
          return [] as any[];
        }),
        getPessoasSustentai().catch((err) => {
          console.error("Erro ao buscar pessoas SustentAí:", err);
          return [] as any[];
        }),
        getHeaderSustentai().catch((err) => {
          console.error("Erro ao buscar header SustentAí:", err);
          return { titulo: "", subtitulo: "", data: "" };
        }),
      ]);

      if (!mounted) return;

      // Normalize shape e prefixa imagens relativas
      const mappedAcoes = Array.isArray(acoesResult)
        ? acoesResult.map((a: any) => ({
            ...a,
            imagemUrl: getFullImageUrl(
              a.imagemUrl || a.imagem || a.imagem_url || "",
            ),
            linkDestino: a.linkDestino || a.link || `/sustentai/${a.id}`,
          }))
        : [];

      const mappedPessoas = Array.isArray(pessoasResult)
        ? pessoasResult.map((p: any) => ({
            ...p,
            imagemUrl: getFullImageUrl(
              p.imagemUrl || p.imagem || p.imagem_url || "",
            ),
          }))
        : [];

      if (mounted) {
        setAcoesSustentai(mappedAcoes);
        setGenteQueConstroi(mappedPessoas);
        setHeader(headerResult || { titulo: "", subtitulo: "", data: "" });
        setIsLoading(false);
      }
    };

    buscarDadosDoBackend();

    return () => {
      mounted = false;
    };
  }, []);

  // Lógica de rolar o carrossel nas setas
  const scrollCarrossel = (direcao: "esq" | "dir") => {
    if (carrosselRef.current) {
      const { scrollLeft, clientWidth } = carrosselRef.current;
      const scrollAmount = clientWidth * 0.8; // Rola 80% do contêiner visível
      carrosselRef.current.scrollTo({
        left:
          direcao === "dir"
            ? scrollLeft + scrollAmount
            : scrollLeft - scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // 4. A TELA DE CARREGAMENTO (Enquanto isLoading for true, o código para aqui)
  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl mb-16 gap-4">
        <Loader2 className="w-10 h-10 text-[#D7386E] animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">
          Carregando novidades...
        </p>
      </div>
    );
  }
  const totalPages = Math.ceil(acoesSustentai.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAcoes = acoesSustentai.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document
        .getElementById("newsletter-acoes")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="mb-16 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
      {/* Cabeçalho */}
      <FadeInScroll>
        <div className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] p-8 md:p-12 text-white text-center">
          <p className="uppercase tracking-widest text-sm font-semibold mb-2 opacity-90">
            Prefeitura de Saquarema
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            {header.titulo}
          </h2>
          <p className="text-lg md:text-xl opacity-90">
            {header.subtitulo} - {header.data}
          </p>
        </div>
      </FadeInScroll>

      {/* Container Principal Centralizado */}
      <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-20">
        {/* ========================================== */}
        {/* SEÇÃO 1: AÇÕES (GRID MASONRY CENTRALIZADO) */}
        {/* ========================================== */}
        <div id="newsletter-acoes">
          <FadeInScroll delay={100}>
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-gray-800">
                Veja as últimas atualizações do SustentAí!
              </h3>
              <p className="text-gray-500 mt-2">
                Iniciativas que transformam a nossa cidade.
              </p>
            </div>
          </FadeInScroll>

          {/* O grid de Masonry com as colunas */}
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            {currentAcoes.map((acao, index) => (
              <FadeInScroll
                key={`page-${currentPage}-item-${acao.id}`}
                delay={index * 150}
                className="break-inside-avoid"
              >
                <div
                  className={`relative group border rounded-2xl overflow-hidden flex flex-col h-fit ${acao.corFundo} ${acao.corBorda} transform hover:scale-105  transition-all duration-300 hover:shadow-md`}
                >
                  {/* DIV DA IMAGEM + TAG */}
                  <div className="relative w-full h-auto">
                    <img
                      src={acao.imagemUrl}
                      alt={acao.titulo}
                      className="w-full h-auto object-cover border-b border-white/50 group-hover:brightness-50 transition-all duration-300"
                    />
                    {/* TAG AQUI */}
                    {acao.tag && (
                      <div
                        className={`absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold uppercase 
                        tracking-wider shadow-sm ${acao.corDestaque}`}
                      >
                        {acao.tag}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow transition-all duration-300 group-hover:brightness-95">
                    <h4 className="font-bold text-gray-800 text-lg mb-3">
                      {acao.titulo}
                    </h4>
                    <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                      {acao.descricao}
                    </p>

                    {/* LINK AUTOMÁTICO */}
                    <Link
                      href={`/sustentai/${acao.id}`}
                      className={`inline-flex items-center gap-2 font-bold hover:underline transition-all w-fit ${acao.corDestaque}`}
                    >
                      Ler artigo <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </FadeInScroll>
            ))}
          </div>

          {/* PAGINAÇÃO */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 pt-8 border-t border-gray-100">
              <Pagination>
                <PaginationContent className="gap-2 sm:gap-4">
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={`group flex items-center gap-2 px-4 py-2 rounded-full border border-transparent transition-all duration-300 ${
                        currentPage === 1
                          ? "pointer-events-none opacity-40 text-gray-400"
                          : "text-gray-600 hover:text-[#D7386E] hover:bg-pink-50 hover:border-pink-100"
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 border ${
                            page === currentPage
                              ? "bg-[#D7386E] text-white border-[#D7386E] shadow-md shadow-pink-200 transform scale-110"
                              : "bg-white text-gray-500 border-gray-100 hover:border-[#D7386E] hover:text-[#D7386E] hover:bg-pink-50"
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={`group flex items-center gap-2 px-4 py-2 rounded-full border border-transparent transition-all duration-300 ${
                        currentPage === totalPages
                          ? "pointer-events-none opacity-40 text-gray-400"
                          : "text-gray-600 hover:text-[#D7386E] hover:bg-pink-50 hover:border-pink-100"
                      }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* SEÇÃO 2: GENTE QUE CONSTRÓI (CARROSSEL MANTENDO LAYOUT) */}
        {/* ========================================== */}
        <FadeInScroll delay={300}>
          {/* DIV MÃE sem padding lateral no celular para o card encostar nas bordas */}
          <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-100 rounded-3xl pt-8 md:p-8 lg:p-12 overflow-hidden relative group/wrapper">
            <div className="flex flex-col items-center justify-center text-center mb-8 px-6">
              <div className="bg-pink-100 p-3 rounded-full mb-4">
                <HeartHandshake className="text-[#D7386E] w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800">
                Gente que Constrói
              </h3>
              <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                Conheça as pessoas por trás das iniciativas que fazem a
                diferença em nossa comunidade todos os dias.
              </p>
            </div>

            {/* Container Relativo para as Setas e Scroll */}
            <div className="relative w-full flex items-center">
              {/* Seta Esquerda (Aparece em telas médias/grandes no hover) */}
              <button
                onClick={() => scrollCarrossel("esq")}
                className="absolute -left-4 md:-left-6 z-10 p-3 bg-white border border-gray-200 text-[#D7386E] rounded-full shadow-md hover:bg-pink-50 hover:scale-110 transition-all hidden md:flex opacity-0 group-hover/wrapper:opacity-100"
                aria-label="Rolar para a esquerda"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Area com Scroll Horizontal */}
              <div
                ref={carrosselRef}
                className="flex w-full overflow-x-auto gap-0 md:gap-8 snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {genteQueConstroi.map((pessoa, index) => (
                  <div
                    key={pessoa.id}
                    // AQUI está a mágica: w-full no mobile, 33% (menos o gap) no desktop. Mesmo card, mesma classe.
                    className="w-full min-w-full md:min-w-[calc(33.33%-1.33rem)] md:w-[calc(33.33%-1.33rem)] flex-shrink-0 snap-center relative group flex flex-col h-full bg-white md:rounded-2xl p-6 md:p-4 md:shadow-sm border-t py-2 md:border border-gray-100 hover:bg-gray-50 md:hover:bg-white md:hover:shadow-md transition-all"
                  >
                    {/* Imagem Larga e no Topo */}
                    <div className="relative w-full aspect-video md:aspect-[4/3] mb-5 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-100 md:border-none md:shadow-none">
                      <img
                        src={pessoa.imagemUrl}
                        alt={pessoa.nome}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Textos Embaixo da Imagem */}
                    <div className="flex flex-col flex-grow text-left">
                      <h4 className="font-bold text-[#3C6AB2] text-xl sm:text-2xl md:text-xl">
                        {pessoa.nome}
                      </h4>
                      <p className="text-sm sm:text-base md:text-sm text-[#D7386E] font-bold mt-1 mb-3">
                        {pessoa.cargo}
                      </p>
                      <p className="text-sm sm:text-base md:text-sm text-gray-600 leading-relaxed">
                        {pessoa.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Seta Direita */}
              <button
                onClick={() => scrollCarrossel("dir")}
                className="absolute -right-4 md:-right-6 z-10 p-3 bg-white border border-gray-200 text-[#D7386E] rounded-full shadow-md hover:bg-[#D7386E] hover:text-white hover:scale-110 transition-all hidden md:flex opacity-90 group-hover/wrapper:opacity-100"
                aria-label="Rolar para a direita"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-8 flex justify-center w-full">
              <Link
                href="/sustentai/gente-que-constroi"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white border-2 border-pink-100 text-[#D7386E] font-bold text-lg hover:bg-[#D7386E] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Ver histórico completo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </FadeInScroll>
      </div>
    </section>
  );
}
