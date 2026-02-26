"use client";
import React from "react";
import {
  X,
  Save,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  Palette,
} from "lucide-react";

interface ModalAcaoProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave: (data: any) => void; // Deixei comentado, pois será implementado depois
}

export default function ModalAcao({ isOpen, onClose }: ModalAcaoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header do Modal */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            Adicionar Nova Ação
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
          {/* Seção: Textos Principais */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#D7386E] font-semibold mb-2">
              <Type className="w-5 h-5" /> Textos Principais
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título da Ação
              </label>
              <input
                type="text"
                placeholder="Ex: Sala do Empreendedor"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D7386E]/50 focus:border-[#D7386E] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                rows={3}
                placeholder="Descreva a ação em poucas linhas..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D7386E]/50 focus:border-[#D7386E] transition-all resize-none"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Seção: Mídia e Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#3C6AB2] font-semibold mb-2">
              <LinkIcon className="w-5 h-5" /> Mídia e Direcionamento
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gray-400" /> URL da Imagem
              </label>
              <input
                type="text"
                placeholder="https://... ou /Cursos/imagem.png"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3C6AB2]/50 focus:border-[#3C6AB2] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto do Botão (Link)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Saiba mais"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3C6AB2]/50 focus:border-[#3C6AB2] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de Destino
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3C6AB2]/50 focus:border-[#3C6AB2] transition-all"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Seção: Estilização (Classes Tailwind) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-purple-600 font-semibold mb-2">
              <Palette className="w-5 h-5" /> Estilo Visual
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor do Destaque (Texto)
                </label>
                <select className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all bg-white">
                  <option value="text-[#D7386E]">Rosa (SustentAí)</option>
                  <option value="text-[#3C6AB2]">Azul (SustentAí)</option>
                  <option value="text-green-600">Verde</option>
                  <option value="text-orange-600">Laranja</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor de Fundo
                </label>
                <select className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all bg-white">
                  <option value="bg-pink-50/30">Fundo Rosa Claro</option>
                  <option value="bg-blue-50/30">Fundo Azul Claro</option>
                  <option value="bg-gray-50/50">Fundo Cinza Claro</option>
                  <option value="bg-white">Branco</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor da Borda
                </label>
                <select className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all bg-white">
                  <option value="border-pink-100">Borda Rosa</option>
                  <option value="border-blue-100">Borda Azul</option>
                  <option value="border-gray-200">Borda Cinza</option>
                  <option value="border-transparent">Sem Borda</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * A combinação das cores define a aparência do card na tela
              principal.
            </p>
          </div>
        </div>

        {/* Footer do Modal (Botões de Ação) */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md">
            <Save className="w-4 h-4" /> Salvar Ação
          </button>
        </div>
      </div>
    </div>
  );
}
