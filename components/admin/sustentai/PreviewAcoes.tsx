"use client";
import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

interface PreviewAcoesProps {
  acoes: any[];
  onAdd: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function PreviewAcoes({
  acoes,
  onAdd,
  onEdit,
  onDelete,
}: PreviewAcoesProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const getFullImageUrl = (path?: string) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    // normaliza barras e garante concatenação correta
    const normalized = path.replace(/\\/g, "/");
    return `${API_URL}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
  };
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const totalPages = Math.ceil(acoes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAcoes = acoes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="w-full">
      {/* ========================================== */}
      {/* BOTÃO ADICIONAR (Agora isolado acima de tudo) */}
      {/* ========================================== */}
      {/* Botão que abre o modal de criação (chama onAdd) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          if (typeof onAdd === "function") onAdd();
        }}
        aria-label="Adicionar Novo Card"
        className="w-full mb-16 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:text-[#D7386E] hover:border-[#D7386E] hover:bg-pink-50 cursor-pointer transition-all py-10 shadow-sm"
      >
        <Plus className="w-10 h-10 mb-2" />
        <span className="font-bold text-lg">Adicionar Novo Card</span>
        <p className="text-sm font-normal opacity-80 mt-1">Crie um novo card para a vitrine</p>
      </button>

      <div id="newsletter-acoes">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-gray-800">
            Veja as últimas atualizações do SustentAí!
          </h3>
          <p className="text-gray-500 mt-2">
            Iniciativas que transformam a nossa cidade.
          </p>
        </div>

        {/* GRID MASONRY (Exatamente igual ao front) */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {currentAcoes.map((acao) => (
            <div
              key={acao.id}
              className={`relative group border rounded-2xl overflow-hidden flex flex-col h-fit ${acao.corFundo} ${acao.corBorda} transform hover:scale-105 transition-all duration-300 hover:shadow-md break-inside-avoid`}
            >
              {/* IMAGEM + TAG */}
              <div className="relative w-full h-auto">
                <img
                  src={getFullImageUrl(acao.imagemUrl)}
                  alt={acao.titulo}
                  className="w-full h-auto object-cover border-b border-white/50 group-hover:brightness-50 transition-all duration-300"
                />
                {acao.tag && (
                  <div
                    className={`absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${acao.corDestaque}`}
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
                {/* No admin, permite visualizar o artigo público */}
                {/* monta o href público usando slug quando disponível, senão usa id */}
                <Link
                  href={`/sustentai/${acao.slug || acao.slugUrl || acao.slug_url || acao.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 font-bold hover:underline transition-all w-fit ${acao.corDestaque}`}
                >
                  Ler artigo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* OVERLAY DE ADMIN (Editar/Excluir) */}
              <div className="absolute inset-0 flex items-start justify-end gap-2 p-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit(acao.id);
                  }}
                  className="bg-white p-2 rounded-full text-blue-600 hover:scale-110 transition-transform shadow-xl"
                  title="Editar"
                >
                  <Edit className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(acao.id);
                  }}
                  className="bg-red-500 p-2 rounded-full text-white hover:scale-110 transition-transform shadow-xl"
                  title="Excluir"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>
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
                    className={`group flex items-center gap-2 px-4 py-2 rounded-full border border-transparent transition-all duration-300 ${currentPage === 1 ? "pointer-events-none opacity-40 text-gray-400" : "text-gray-600 hover:text-[#D7386E] hover:bg-pink-50 hover:border-pink-100"}`}
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
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 border ${page === currentPage ? "bg-[#D7386E] text-white border-[#D7386E] shadow-md shadow-pink-200 transform scale-110" : "bg-white text-gray-500 border-gray-100 hover:border-[#D7386E] hover:text-[#D7386E] hover:bg-pink-50"}`}
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
                    className={`group flex items-center gap-2 px-4 py-2 rounded-full border border-transparent transition-all duration-300 ${currentPage === totalPages ? "pointer-events-none opacity-40 text-gray-400" : "text-gray-600 hover:text-[#D7386E] hover:bg-pink-50 hover:border-pink-100"}`}
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
  );
}
