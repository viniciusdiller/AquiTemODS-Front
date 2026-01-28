"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FaleConoscoButton from "@/components/FaleConoscoButton";
import {
  Loader2,
  Newspaper,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { registerSustentAiCardClick } from "@/lib/api";

// Imports da UI de Paginação
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

interface SustentAiCard {
  id: number;
  titulo: string;
  linkDestino: string;
  imagemUrl: string;
}

export default function SustentAiPage() {
  const [cards, setCards] = useState<SustentAiCard[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CONFIGURAÇÃO DA PAGINAÇÃO ---
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/sustentai`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCards(data);
        } else {
          console.error("Resposta da API inválida:", data);
          setCards([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados SustentAí:", err);
        setCards([]);
        setLoading(false);
      });
  }, [API_URL]);

  const getFullImageUrl = (path: string) => {
    if (!path) return "/placeholder-image.png";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  // Cálculos da Paginação
  const totalPages = Math.ceil(cards.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCards = cards.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document
        .getElementById("cards-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D7386E] to-[#3C6AB2] py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        {/* Cabeçalho */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Newspaper className="text-[#D7386E] w-8 h-8 sm:w-10 sm:h-10" />

            <h1 className="text-4xl font-extrabold inline-block pb-2 bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-no-repeat [background-position:0_100%] [background-size:100%_4px]">
              <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
                SustentAí
              </span>
            </h1>
          </div>

          <p className="text-gray-700 leading-relaxed text-lg mb-8">
            Conheça a <strong>SustentAí</strong>, nossa newsletter dedicada a
            dar visibilidade a projetos e ações que transformam Saquarema
            através dos Objetivos de Desenvolvimento Sustentável.
          </p>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="bg-green-50 p-3 rounded-full text-[#25D366]">
              <MessageCircle size={28} />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-gray-800 font-bold text-lg mb-1">
                Comunidade Oficial
              </h3>
              <p className="text-gray-500 text-sm">
                Receba novidades no nosso canal do WhatsApp.
              </p>
            </div>
            <a
              href="https://whatsapp.com/channel/0029Vb61WtrAu3aPEBflxV0L"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-3 px-8 rounded-full shadow-sm transition-all whitespace-nowrap"
            >
              Entrar no Canal
            </a>
          </div>
        </section>

        {/* Grid de Cards */}
        <section id="cards-section" className="mt-8 border-t pt-8">
          {loading ? (
            <div className="text-center text-gray-500 py-10">
              <Loader2 className="animate-spin mx-auto mb-2" />
              Carregando iniciativas...
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Nenhuma iniciativa cadastrada no momento.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {currentCards.map((card) => (
                  <Link
                    key={card.id}
                    href={card.linkDestino}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block text-center h-full flex flex-col"
                    onClick={() => registerSustentAiCardClick(card.id)}
                  >
                    <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300 relative aspect-[4/3]">
                      <Image
                        src={getFullImageUrl(card.imagemUrl)}
                        alt={card.titulo}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                      {card.titulo}
                    </p>
                  </Link>
                ))}
              </div>

              {/* --- PAGINAÇÃO ESTILIZADA --- */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <Pagination>
                    <PaginationContent className="gap-2 sm:gap-4">
                      {/* Botão Anterior Customizado */}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                          className={`
                            group flex items-center gap-2 px-4 py-2 rounded-full border border-transparent transition-all duration-300
                            ${
                              currentPage === 1
                                ? "pointer-events-none opacity-40 text-gray-400"
                                : "text-gray-600 hover:text-[#D7386E] hover:bg-pink-50 hover:border-pink-100"
                            }
                          `}
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
                              className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 border
                                ${
                                  page === currentPage
                                    ? "bg-[#D7386E] text-white border-[#D7386E] shadow-md shadow-pink-200 transform scale-110"
                                    : "bg-white text-gray-500 border-gray-100 hover:border-[#D7386E] hover:text-[#D7386E] hover:bg-pink-50"
                                }
                              `}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}

                      {/* Botão Próximo Customizado */}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                          className={`
                             group flex items-center gap-2 px-4 py-2 rounded-full border border-transparent transition-all duration-300
                            ${
                              currentPage === totalPages
                                ? "pointer-events-none opacity-40 text-gray-400"
                                : "text-gray-600 hover:text-[#D7386E] hover:bg-pink-50 hover:border-pink-100"
                            }
                          `}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </PaginationLink>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </section>
      </div>
      <FaleConoscoButton />
    </div>
  );
}
