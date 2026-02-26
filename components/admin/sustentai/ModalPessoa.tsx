"use client";
import React from "react";
import { X, Save, Image as ImageIcon, User, Briefcase } from "lucide-react";

interface ModalPessoaProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalPessoa({ isOpen, onClose }: ModalPessoaProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header do Modal */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            Adicionar Nova Pessoa
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
          {/* Seção: Informações Pessoais */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#3C6AB2] font-semibold mb-2">
              <User className="w-5 h-5" /> Informações do Perfil
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Carolina Guilhon"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3C6AB2]/50 focus:border-[#3C6AB2] transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-gray-400" /> Cargo / Função
                </label>
                <input
                  type="text"
                  placeholder="Ex: Diretora de Cultura"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3C6AB2]/50 focus:border-[#3C6AB2] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição / Resumo
              </label>
              <textarea
                rows={3}
                placeholder="Escreva um breve resumo sobre as contribuições desta pessoa..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3C6AB2]/50 focus:border-[#3C6AB2] transition-all resize-none"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Seção: Mídia */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#D7386E] font-semibold mb-2">
              <ImageIcon className="w-5 h-5" /> Foto de Perfil
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="https://... ou /Cursos/imagem.png"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D7386E]/50 focus:border-[#D7386E] transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Recomendado imagens quadradas (proporção 1:1) para melhor
                enquadramento no card.
              </p>
            </div>
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
            <Save className="w-4 h-4" /> Salvar Pessoa
          </button>
        </div>
      </div>
    </div>
  );
}
