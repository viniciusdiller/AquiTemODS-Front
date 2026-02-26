"use client";
import React from "react";
import { X, Save, Type, Calendar } from "lucide-react";

interface ModalHeaderProps {
  isOpen: boolean;
  onClose: () => void;
  // headerAtual: any; // Futuramente você passará os dados atuais aqui para preencher os inputs
}

export default function ModalHeader({ isOpen, onClose }: ModalHeaderProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header do Modal */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Editar Cabeçalho</h2>
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal (Formulário de Edição) */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#D7386E] font-semibold mb-2">
              <Type className="w-5 h-5" /> Textos Principais
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título Grande
              </label>
              <input
                type="text"
                defaultValue="SustentAí" // Simula o dado já vindo do banco
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D7386E]/50 focus:border-[#D7386E] transition-all font-bold text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtítulo
              </label>
              <input
                type="text"
                defaultValue="Segunda Edição"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D7386E]/50 focus:border-[#D7386E] transition-all"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#3C6AB2] font-semibold mb-2">
              <Calendar className="w-5 h-5" /> Período
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mês e Ano de Referência
              </label>
              <input
                type="text"
                defaultValue="Abril de 2025"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3C6AB2]/50 focus:border-[#3C6AB2] transition-all"
              />
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
            <Save className="w-4 h-4" /> Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
