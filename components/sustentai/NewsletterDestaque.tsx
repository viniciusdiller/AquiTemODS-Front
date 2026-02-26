"use client";
import React, { useState } from "react";
import {
  HeartHandshake,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FadeInScroll } from "./Animationcards";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

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
      "Serviços para abrir, regularizar ou expandir sua empresa com apoio técnico. Inclui formalização de MEI e orientação sobre crédito.",
    imagemUrl:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Saiba mais sobre a Sala",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#D7386E]",
    corFundo: "bg-pink-50/30",
    corBorda: "border-pink-100",
  },
  {
    id: 2,
    titulo: "Emprega Saquá",
    descricao:
      "Buscando emprego ou procurando funcionários? Acesse nosso portal e tenha acesso a oportunidades e talentos de toda a nossa região.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Acessar portal de vagas",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#3C6AB2]",
    corFundo: "bg-blue-50/30",
    corBorda: "border-blue-100",
  },
  {
    id: 3,
    titulo: "Sala do Empreendedor",
    descricao:
      "Serviços para abrir, regularizar ou expandir sua empresa com apoio técnico. Inclui formalização de MEI e orientação sobre crédito.",
    imagemUrl:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Saiba mais sobre a Sala",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#D7386E]",
    corFundo: "bg-pink-50/30",
    corBorda: "border-pink-100",
  },
  {
    id: 4,
    titulo: "Emprega Saquá",
    descricao:
      "Buscando emprego ou procurando funcionários? Acesse nosso portal e tenha acesso a oportunidades e talentos de toda a nossa região.",
    imagemUrl: "/Cursos/vivi.png",
    linkTexto: "Acessar portal de vagas",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#3C6AB2]",
    corFundo: "bg-blue-50/30",
    corBorda: "border-blue-100",
  },
  {
    id: 5,
    titulo: "Sala do Empreendedor",
    descricao:
      "Serviços para abrir, regularizar ou expandir sua empresa com apoio técnico. Inclui formalização de MEI e orientação sobre crédito.",
    imagemUrl:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Saiba mais sobre a Sala",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#D7386E]",
    corFundo: "bg-pink-50/30",
    corBorda: "border-pink-100",
  },
  {
    id: 6,
    titulo: "Emprega Saquá",
    descricao:
      "Buscando emprego ou procurando funcionários? Acesse nosso portal e tenha acesso a oportunidades e talentos de toda a nossa região.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
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
    cargo: "Dona da casa do Empreendedor",
    descricao: "Chefe da Laila.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    nome: "Telma Cavalcante",
    cargo: "Diretora de Cultura",
    descricao:
      "Referência na valorização do artesanato, idealizadora da ExpoArte Saquarema, transformando cultura em pertencimento.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    nome: "Leticia Majosene",
    cargo: "Diretora de Projetos Estratégicos",
    descricao:
      "Idealizadora do Emprega Saquá. Seu compromisso com uma política pública centrada no cidadão garantiu o sucesso do projeto.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
  },
];

export default function NewsletterDestaque() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

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
      {/* Cabeçalho Animado */}
      {}
      <FadeInScroll>
        <div className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] p-8 text-white text-center">
          <p className="uppercase tracking-widest text-sm font-semibold mb-2 opacity-90">
            Prefeitura de Saquarema
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            {header.titulo}
          </h2>
          <p className="text-lg opacity-90">
            {header.subtitulo} - {header.data}
          </p>
        </div>
      </FadeInScroll>

      <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div id="newsletter-acoes">
            <FadeInScroll delay={100}>
              <h3 className="text-2xl font-bold text-gray-800 mb-8">
                Veja as últimas ações do SustentAí!
              </h3>
            </FadeInScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {currentAcoes.map((acao, index) => (
                <FadeInScroll
                  key={`page-${currentPage}-item-${acao.id}`}
                  delay={index * 150}
                  className={index % 2 !== 0 ? "md:mt-12" : ""}
                >
                  <div
                    className={`border rounded-2xl overflow-hidden flex flex-col ${acao.corFundo} ${acao.corBorda} transform hover:scale-105 transition-transform duration-300 hover:shadow-md `}
                  >
                    <img
                      src={acao.imagemUrl}
                      alt={acao.titulo}
                      className="w-full h-auto object-cover border-b border-white/50"
                    />
                    <div className="p-6 flex flex-col flex-grow">
                      <h4 className="font-bold text-gray-800 text-lg mb-3">
                        {acao.titulo}
                      </h4>
                      <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                        {acao.descricao}
                      </p>
                      <a
                        href={acao.linkDestino}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 font-bold hover:underline transition-all w-fit ${acao.corDestaque}`}
                      >
                        {acao.linkTexto} <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </FadeInScroll>
              ))}
            </div>

            {/* ========================================== */}
            {/* COMPONENTES DA PAGINAÇÃO                   */}
            {/* ========================================== */}
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

                    {/* Números das Páginas */}
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

                    {/* Botão Próximo */}
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
        </div>

        {/* ========================================== */}
        {/* BARRA LATERAL ANIMADA                        */}
        {/* ========================================== */}
        <div className="h-fit sticky top-8">
          <FadeInScroll delay={300}>
            <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-100 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-6">
                <HeartHandshake className="text-[#D7386E] w-6 h-6" />
                <h3 className="text-xl font-bold text-gray-800">
                  Gente que Constrói
                </h3>
              </div>

              <div className="space-y-6">
                {genteQueConstroi.map((pessoa, index) => (
                  <div
                    key={pessoa.id}
                    className={
                      index !== genteQueConstroi.length - 1
                        ? "pb-8 border-b border-gray-200"
                        : ""
                    }
                  >
                    <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                      <img
                        src={pessoa.imagemUrl}
                        alt={pessoa.nome}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-bold text-[#3C6AB2] text-lg">
                      {pessoa.nome}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      <strong className="text-gray-700">{pessoa.cargo}.</strong>{" "}
                      <br />
                      {pessoa.descricao}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeInScroll>
        </div>
      </div>
    </section>
  );
}
