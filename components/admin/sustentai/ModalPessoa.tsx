"use client";
import React, { useEffect, useState } from "react";
import { X, Save, Image as ImageIcon, User, Briefcase } from "lucide-react";

interface ModalPessoaProps {
  isOpen: boolean;
  onClose: () => void;
  pessoaAtual?: any; // Recebe dados se for edição
  onSave: (dados: any) => void; // Envia para a API
}

export default function ModalPessoa({
  isOpen,
  onClose,
  pessoaAtual,
  onSave,
}: ModalPessoaProps) {
  // Estados dos inputs
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");

  // Efeito que preenche os campos quando o modal abre
  useEffect(() => {
    if (pessoaAtual) {
      setNome(pessoaAtual.nome || "");
      setCargo(pessoaAtual.cargo || "");
      setDescricao(pessoaAtual.descricao || "");
      setImagemUrl(pessoaAtual.imagemUrl || "");
    } else {
      setNome("");
      setCargo("");
      setDescricao("");
      setImagemUrl("");
    }
  }, [pessoaAtual, isOpen]);

  const handleSalvar = () => {
    // Monta o objeto e envia para a página principal salvar no banco
    onSave({
      id: pessoaAtual?.id, // Mantém o ID se for edição
      nome,
      cargo,
      descricao,
      imagemUrl,
    });
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header do Modal */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {pessoaAtual ? "Editar Pessoa" : "Adicionar Nova Pessoa"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full hover:bg-gray-200 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo / Função
              </label>
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5"
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
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL da Imagem
            </label>
            <input
              type="text"
              value={imagemUrl}
              onChange={(e) => setImagemUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white font-bold flex items-center gap-2 hover:opacity-90"
          >
            <Save className="w-4 h-4" />{" "}
            {pessoaAtual ? "Salvar Alterações" : "Salvar Pessoa"}
          </button>
        </div>
      </div>
    </div>
  );
}
