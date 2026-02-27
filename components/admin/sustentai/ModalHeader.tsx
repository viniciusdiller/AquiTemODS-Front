"use client";
import React, { useEffect, useState } from "react";
import { X, Save, Type, Calendar } from "lucide-react";

interface ModalHeaderProps {
  isOpen: boolean;
  onClose: () => void;
  headerAtual: any;
  onSave: (dados: any) => void;
}

export default function ModalHeader({
  isOpen,
  onClose,
  headerAtual,
  onSave,
}: ModalHeaderProps) {
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    if (headerAtual) {
      setTitulo(headerAtual.titulo || "");
      setSubtitulo(headerAtual.subtitulo || "");
      setData(headerAtual.data || "");
    }
  }, [headerAtual, isOpen]);

  const handleSalvar = () => {
    onSave({ titulo, subtitulo, data });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Editar Cabeçalho</h2>
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full hover:bg-gray-200 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Título Grande
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-bold"
            />

            <label className="block text-sm font-medium text-gray-700">
              Subtítulo
            </label>
            <input
              type="text"
              value={subtitulo}
              onChange={(e) => setSubtitulo(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5"
            />

            <label className="block text-sm font-medium text-gray-700">
              Mês e Ano de Referência
            </label>
            <input
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white font-bold flex items-center gap-2 hover:opacity-90"
          >
            <Save className="w-4 h-4" /> Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
