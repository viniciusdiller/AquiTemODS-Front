"use client";
import React, { useEffect, useState } from "react";
import {
  X,
  Save,
  Image as ImageIcon,
  Type,
  Palette,
  LayoutTemplate,
  Tag,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface ModalAcaoProps {
  isOpen: boolean;
  onClose: () => void;
  acaoAtual?: any;
  onSave?: (dados: any) => void;
}

export default function ModalAcao({
  isOpen,
  onClose,
  acaoAtual,
  onSave,
}: ModalAcaoProps) {
  // Estados do formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tag, setTag] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [corDestaque, setCorDestaque] = useState("text-[#D7386E]");
  const [corFundo, setCorFundo] = useState("bg-pink-50/30");
  const [corBorda, setCorBorda] = useState("border-pink-100");

  // Preenche o formulário se for edição, ou limpa se for criação
  useEffect(() => {
    if (acaoAtual) {
      setTitulo(acaoAtual.titulo || "");
      setDescricao(acaoAtual.descricao || "");
      setTag(acaoAtual.tag || "");
      setImagemUrl(acaoAtual.imagemUrl || "");
      setCorDestaque(acaoAtual.corDestaque || "text-[#D7386E]");
      setCorFundo(acaoAtual.corFundo || "bg-pink-50/30");
      setCorBorda(acaoAtual.corBorda || "border-pink-100");
    } else {
      setTitulo("");
      setDescricao("");
      setTag("");
      setImagemUrl("");
      setCorDestaque("text-[#D7386E]");
      setCorFundo("bg-pink-50/30");
      setCorBorda("border-pink-100");
    }
  }, [acaoAtual, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header do Modal */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {acaoAtual ? "Editar Ação" : "Adicionar Nova Ação"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal (Formulário) */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          {/* Textos Principais */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#D7386E] font-semibold mb-2">
              <Type className="w-5 h-5" /> Textos Principais
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título da Ação
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Sala do Empreendedor"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D7386E]/50 focus:border-[#D7386E]"
                />
              </div>
              <div>
                {/* NOVO CAMPO: TAG */}
                <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Tag className="w-4 h-4 text-gray-400" /> Tag
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Ex: Inovação"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D7386E]/50 focus:border-[#D7386E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva a ação em poucas linhas..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D7386E]/50 focus:border-[#D7386E] resize-none"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Mídia */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#3C6AB2] font-semibold mb-2">
              <ImageIcon className="w-5 h-5" /> Mídia
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem de Capa
              </label>
              <input
                type="text"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
                placeholder="https://... ou /Cursos/imagem.png"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3C6AB2]/50 focus:border-[#3C6AB2]"
              />
              <p className="text-xs text-gray-500 mt-2">
                * O link de redirecionamento agora é gerado automaticamente pelo
                sistema.
              </p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Estilização */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-purple-600 font-semibold mb-2">
              <Palette className="w-5 h-5" /> Estilo Visual
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor do Destaque
                </label>
                <select
                  value={corDestaque}
                  onChange={(e) => setCorDestaque(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500/50 bg-white"
                >
                  <option value="text-[#D7386E]">Rosa (SustentAí)</option>
                  <option value="text-[#3C6AB2]">Azul (SustentAí)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor de Fundo
                </label>
                <select
                  value={corFundo}
                  onChange={(e) => setCorFundo(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500/50 bg-white"
                >
                  <option value="bg-pink-50/30">Fundo Rosa Claro</option>
                  <option value="bg-blue-50/30">Fundo Azul Claro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor da Borda
                </label>
                <select
                  value={corBorda}
                  onChange={(e) => setCorBorda(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500/50 bg-white"
                >
                  <option value="border-pink-100">Borda Rosa</option>
                  <option value="border-blue-100">Borda Azul</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer do Modal */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            {acaoAtual ? (
              <Link
                href={`/admin/sustentai/acao/${acaoAtual.id}`}
                className="px-4 py-2.5 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center gap-2 hover:bg-purple-200 transition-colors"
              >
                <LayoutTemplate className="w-4 h-4" /> Editar Página Interna
              </Link>
            ) : (
              <span className="text-xs text-gray-400">
                Salve a ação para criar conteúdo.
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors w-full sm:w-auto"
            >
              Cancelar
            </button>
            <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md w-full sm:w-auto">
              <Save className="w-4 h-4" /> {acaoAtual ? "Salvar" : "Criar Ação"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
