"use client";
import React, { useState } from "react";
import {
  HeartHandshake,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";
import { FadeInScroll } from "./Animationcards";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import Link from "next/link";

// ==========================================
// LISTA DE DADOS FICTÍCIOS (Mock Data)
// ==========================================
const header = {
  titulo: "SustentAí",
  subtitulo: "Segunda Edição",
  data: "Abril de 2025",
};

const acoesSustentai = [
  {
    id: 1,
    titulo: "Sala do Empreendedor",
    descricao:
      "Serviços para abrir, regularizar ou expandir sua empresa com apoio técnico.",
    imagemUrl:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Saiba mais sobre a Sala",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#D7386E]",
    corFundo: "bg-pink-50/30",
    corBorda: "border-pink-100",
    tag: "Empreendedorismo",
  },
  {
    id: 2,
    titulo: "Emprega Saquá",
    descricao:
      "Buscando emprego ou procurando funcionários? Acesse nosso portal de talentos.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&h=800&auto=format&fit=crop&q=60",
    linkTexto: "Acessar portal",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#3C6AB2]",
    corFundo: "bg-blue-50/30",
    corBorda: "border-blue-100",
  },
  {
    id: 3,
    titulo: "Apoio ao Artesão",
    descricao:
      "Valorizando nossos talentos locais que movimentam a economia criativa.",
    imagemUrl:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=600&h=300&auto=format&fit=crop&q=60",
    linkTexto: "Conheça mais",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#D7386E]",
    corFundo: "bg-pink-50/30",
    corBorda: "border-pink-100",
  },
  {
    id: 4,
    titulo: "Emprega Saquá 2",
    descricao:
      "Buscando emprego ou procurando funcionários? Acesse nosso portal e tenha acesso a oportunidades.",
    imagemUrl: "/Cursos/vivi.png",
    linkTexto: "Acessar portal de vagas",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#3C6AB2]",
    corFundo: "bg-blue-50/30",
    corBorda: "border-blue-100",
  },
  {
    id: 5,
    titulo: "Cursos Sebrae",
    descricao:
      "Ferramentas e estratégias gratuitas para empreender com sucesso.",
    imagemUrl:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Ver cursos",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#D7386E]",
    corFundo: "bg-pink-50/30",
    corBorda: "border-pink-100",
  },
  {
    id: 4,
    titulo: "Emprega Saquá 2",
    descricao:
      "Buscando emprego ou procurando funcionários? Acesse nosso portal e tenha acesso a oportunidades.",
    imagemUrl: "/Cursos/vivi.png",
    linkTexto: "Acessar portal de vagas",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#3C6AB2]",
    corFundo: "bg-blue-50/30",
    corBorda: "border-blue-100",
  },
  {
    id: 6,
    titulo: "Inovação",
    descricao: "Entenda mais sobre economia criativa e inovação.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Saiba mais",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#3C6AB2]",
    corFundo: "bg-blue-50/30",
    corBorda: "border-blue-100",
  },
  {
    id: 6,
    titulo: "Inovação",
    descricao: "Entenda mais sobre economia criativa e inovação.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Saiba mais",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#3C6AB2]",
    corFundo: "bg-blue-50/30",
    corBorda: "border-blue-100",
  },
  {
    id: 4,
    titulo: "Emprega Saquá 2",
    descricao:
      "Buscando emprego ou procurando funcionários? Acesse nosso portal e tenha acesso a oportunidades.",
    imagemUrl: "/Cursos/vivi.png",
    linkTexto: "Acessar portal de vagas",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#3C6AB2]",
    corFundo: "bg-blue-50/30",
    corBorda: "border-blue-100",
  },
];

const genteQueConstroi = [
  {
    id: 1,
    nome: "Carolina Guilhon",
    cargo: "Sala do Empreendedor",
    descricao:
      "Exemplo de dedicação e proatividade na construção de um ambiente de trabalho positivo.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    nome: "Telma Cavalcante",
    cargo: "Diretora de Cultura",
    descricao:
      "Referência na valorização do artesanato, idealizadora da ExpoArte Saquarema.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    nome: "Leticia Majosene",
    cargo: "Projetos Estratégicos",
    descricao:
      "Idealizadora do Emprega Saquá. Seu compromisso garantiu o sucesso do projeto.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
  },
];

export default function NewsletterDestaque() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

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
                Veja as últimas autalizações do SustentAí!
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
        {/* SEÇÃO 2: GENTE QUE CONSTRÓI (LINHA INFERIOR) */}
        {/* ========================================== */}
        <FadeInScroll delay={300}>
          {/* DIV MÃE sem padding lateral no celular para o card encostar nas bordas */}
          <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-100 rounded-3xl pt-8 md:p-8 lg:p-12 overflow-hidden">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 w-full">
              {genteQueConstroi.map((pessoa, index) => (
                <div
                  key={pessoa.id}
                  className="w-full relative group flex flex-col h-full bg-white md:rounded-2xl p-6 md:p-4 md:shadow-sm border-t py-2 md:border border-gray-100 hover:bg-gray-50 md:hover:bg-white md:hover:shadow-md transition-all"
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
          </div>
        </FadeInScroll>
      </div>
    </section>
  );
}
