"use client";
import React from "react";
import { HeartHandshake, Plus, Edit, Trash2 } from "lucide-react";

interface PreviewPessoasProps {
  pessoas: any[];
  onAdd: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function PreviewPessoas({
  pessoas,
  onAdd,
  onEdit,
  onDelete,
}: PreviewPessoasProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const getFullImageUrl = (path?: string) => {
    if (!path) return "/placeholder-user.jpg";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    const normalized = path.replace(/\\/g, "/");
    return `${API_URL}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
  };

  return (
    <div className="w-full">
      {/* ========================================== */}
      {/* BOTÃO ADICIONAR PESSOA (Isolado no topo)    */}
      {/* ========================================== */}
      <div
        onClick={onAdd}
        className="w-full mb-12 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:text-[#3C6AB2] hover:border-[#3C6AB2] hover:bg-blue-50 cursor-pointer transition-all py-10 shadow-sm"
      >
        <Plus className="w-10 h-10 mb-2" />
        <span className="font-bold text-lg">Adicionar Nova Pessoa</span>
        <p className="text-sm font-normal opacity-80 mt-1">
          Destaque um novo membro da equipe
        </p>
      </div>

      {/* ========================================== */}
      {/* SEÇÃO VISUAL: GENTE QUE CONSTRÓI             */}
      {/* ========================================== */}
      <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-100 rounded-3xl pt-8 md:p-8 lg:p-12 overflow-hidden relative">
        <div className="flex flex-col items-center justify-center text-center mb-8 px-6">
          <div className="bg-pink-100 p-3 rounded-full mb-4">
            <HeartHandshake className="text-[#D7386E] w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">
            Gente que Constrói
          </h3>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Conheça as pessoas por trás das iniciativas que fazem a diferença em
            nossa comunidade todos os dias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 w-full">
          {pessoas.map((pessoa) => (
            <div
              key={pessoa.id}
              className="w-full relative group flex flex-col h-full bg-white md:rounded-2xl p-6 md:p-4 md:shadow-sm border-t py-2 md:border border-gray-100 hover:bg-gray-50 md:hover:bg-white md:hover:shadow-md transition-all"
            >
              {/* Imagem Larga e no Topo */}
              <div className="relative w-full aspect-video md:aspect-[4/3] mb-5 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-100 md:border-none md:shadow-none">
                <img
                  src={getFullImageUrl(pessoa.imagemUrl)}
                  alt={pessoa.nome}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 group-hover:brightness-50"
                />

                {/* Overlay de Edição (Aparece na foto) */}
                <div className="absolute inset-0 flex items-start justify-end gap-2 p-2">
                  <button
                    onClick={() => onEdit(pessoa.id)}
                    className="bg-white p-2 rounded-full text-blue-600 hover:scale-110 shadow-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(pessoa.id)}
                    className="bg-red-500 p-2 rounded-full text-white hover:scale-110 shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
    </div>
  );
}
