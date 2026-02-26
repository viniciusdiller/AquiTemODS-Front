"use client";
import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
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
  // 1. ESTADOS PARA PAGINAÇÃO
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const totalPages = Math.ceil(acoes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentAcoes = acoes.slice(startIndex, endIndex);

  // 3. FUNÇÃO DE TROCA DE PÁGINA
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="lg:col-span-2 space-y-12">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-8">
          Veja as últimas ações do SustentAí!
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* CAIXA DE ADICIONAR NOVA AÇÃO */}
          <div
            onClick={onAdd}
            className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:text-[#D7386E] hover:border-[#D7386E] hover:bg-pink-50 cursor-pointer transition-all h-64"
          >
            <Plus className="w-12 h-12 mb-2" />
            <span className="font-bold">Adicionar Nova Ação</span>
          </div>

          {/* CARDS MAP (Invertido para manter a lógica Masonry) */}
          {currentAcoes.map((acao, index) => (
            <div
              key={acao.id}
              className={`relative group border rounded-2xl overflow-hidden flex flex-col ${acao.corFundo} ${acao.corBorda} transition-all duration-300 ${
                index % 2 === 0 ? "md:mt-12" : ""
              }`}
            >
              <img
                src={acao.imagemUrl}
                alt={acao.titulo}
                className="w-full h-48 object-cover border-b border-white/50"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="font-bold text-gray-800 text-lg mb-3">
                  {acao.titulo}
                </h4>
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                  {acao.descricao}
                </p>
                <span
                  className={`inline-flex items-center gap-2 font-bold w-fit ${acao.corDestaque}`}
                >
                  {acao.linkTexto} <ArrowRight className="w-4 h-4" />
                </span>
              </div>

              {/* Overlay de Ações Admin */}
              <div className="absolute inset-0  flex items-center justify-end gap-3 h-8 mt-2 mr-2">
                <button
                  onClick={() => onEdit(acao.id)}
                  className="bg-white p-2 rounded-full text-blue-600 hover:scale-110 transition-transform shadow-lg"
                  title="Editar"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(acao.id)}
                  className="bg-red-500 p-2 rounded-full text-white hover:scale-110 transition-transform shadow-lg"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* ========================================== */}
        {/* COMPONENTES DA PAGINAÇÃO                   */}
        {/* ========================================== */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 pt-8 border-t border-gray-100">
            <Pagination>
              <PaginationContent className="gap-2 sm:gap-4">
                {/* Botão Anterior */}
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
  );
}
