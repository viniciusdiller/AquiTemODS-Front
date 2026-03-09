"use client";
import React, { useState } from "react";
import {
  HeartHandshake,
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface Pessoa {
  id: number;
  nome: string;
  cargo: string;
  descricao: string;
  imagemUrl: string;
}

interface PreviewPessoasProps {
  pessoas: Pessoa[];
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
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const getFullImageUrl = (path?: string) => {
    if (!path) return "/placeholder-user.jpg";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    const normalized = path.replace(/\\/g, "/");
    return `${API_URL}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
  };

  const filteredPessoas =
    pessoas?.filter((pessoa) =>
      pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className="w-full">
      {/* BOTÃO ADICIONAR PESSOA */}
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

      <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-100 rounded-3xl p-6 md:p-8 lg:p-12 overflow-hidden relative shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-200/60 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 p-3 rounded-full">
              <HeartHandshake className="text-[#D7386E] w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Gente que Constrói
              </h2>
              <p className="text-sm text-gray-500">
                Gerencie os perfis do carrossel
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-80 z-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C6AB2] transition-all shadow-sm"
              placeholder="Pesquisar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredPessoas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-600">
              Nenhuma pessoa encontrada
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Tente pesquisar com outro nome."
                : "Ainda não adicionou ninguém à equipe."}
            </p>
          </div>
        ) : (
          <div className="w-full px-2 md:px-8 relative">
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              loop={searchTerm === "" && filteredPessoas.length > 3}
              navigation={true}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              style={
                {
                  "--swiper-navigation-color": "#D7386E",
                  "--swiper-navigation-size": "24px",
                } as React.CSSProperties
              }
              className="w-full !pb-4 !px-2"
            >
              {filteredPessoas.map((pessoa) => (
                <SwiperSlide key={pessoa.id} className="h-auto">
                  <div className="flex flex-col h-full bg-white md:rounded-2xl p-6 md:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all group relative">
                    {/* BOTÕES DE ADMINISTRAÇÃO (Ícones Redondos) */}
                    <div className="absolute top-8 right-8 md:top-6 md:right-6 flex flex-col gap-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(pessoa.id)}
                        className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm text-[#3C6AB2] hover:bg-[#3C6AB2] hover:text-white rounded-full shadow-sm border border-gray-200 transition-all"
                        title="Editar Perfil"
                      >
                        <Edit className="w-4 h-4 ml-0.5" />
                      </button>
                      <button
                        // Agora isto vai ativar o Modal da página principal!
                        onClick={() => onDelete(pessoa.id)}
                        className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm text-red-500 hover:bg-red-500 hover:text-white rounded-full shadow-sm border border-gray-200 transition-all"
                        title="Excluir Perfil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="relative w-full aspect-video md:aspect-[4/3] mb-5 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-100">
                      <img
                        src={getFullImageUrl(pessoa.imagemUrl)}
                        alt={pessoa.nome}
                        draggable={false}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex flex-col flex-grow text-left pr-12 md:pr-0">
                      <h4 className="font-bold text-[#3C6AB2] text-xl sm:text-2xl md:text-xl line-clamp-1">
                        {pessoa.nome}
                      </h4>
                      <p className="text-sm sm:text-base md:text-sm text-[#D7386E] font-bold mt-1 mb-3 line-clamp-1">
                        {pessoa.cargo}
                      </p>
                      <p className="text-sm sm:text-base md:text-sm text-gray-600 leading-relaxed line-clamp-4">
                        {pessoa.descricao}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
}
