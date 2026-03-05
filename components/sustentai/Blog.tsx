// components/sustentai/Blog.tsx
"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
import GenteQueConstroiCarousel from "./GenteQueConstroiCarousel";

export default function NewsletterDestaque() {
  const [header, setHeader] = useState({ titulo: "", subtitulo: "", data: "" });
  const [acoesSustentai, setAcoesSustentai] = useState<any[]>([]);
  const [genteQueConstroi, setGenteQueConstroi] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getFullImageUrl = (path: string) => {
    if (!path) return "/placeholder-image.png";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  useEffect(() => {
    let mounted = true;

    const buscarDadosDoBackend = async () => {
      setIsLoading(true);

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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 ">
            {header.titulo}
          </h2>
          <p className="text-lg md:text-xl opacity-90">
            {header.subtitulo} - {header.data}
          </p>
        </div>
      </FadeInScroll>

      <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-20">
        {/* ========================================== */}
        {/* SEÇÃO 1: AÇÕES                             */}
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
                  <div className="relative w-full h-auto">
                    <img
                      src={acao.imagemUrl}
                      alt={acao.titulo}
                      className="w-full h-auto object-cover border-b border-white/50 group-hover:brightness-50 transition-all duration-300"
                    />
                    {acao.tag && (
                      <div
                        className={`absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold uppercase 
                        tracking-wider shadow-sm ${acao.corDestaque}`}
                      >
                        {acao.tag}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow transition-all duration-300 group-hover:brightness-95">
                    <h4 className={`font-bold ${acao.corTexto} text-lg mb-3`}>
                      {acao.titulo}
                    </h4>
                    <p
                      className={`text-gray-600 mb-6 flex-grow leading-relaxed ${acao.corTexto}`}
                    >
                      {acao.descricao}
                    </p>

                    <Link
                      href={`/sustentai/${acao.id}`}
                      className={`inline-flex items-center gap-2 font-bold hover:underline transition-all w-fit ${acao.corDestaque}`}
                    >
                      Ver Mais <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </FadeInScroll>
            ))}
          </div>

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
        {/* SEÇÃO 2: GENTE QUE CONSTRÓI (NOVO COMPONENTE)*/}
        {/* ========================================== */}
        <FadeInScroll delay={300}>
          <GenteQueConstroiCarousel pessoas={genteQueConstroi} />
        </FadeInScroll>
      </div>
    </section>
  );
}
