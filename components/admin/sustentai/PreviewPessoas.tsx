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
  return (
    <div className="h-fit sticky top-8">
      <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-100 rounded-2xl p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <HeartHandshake className="text-[#D7386E] w-6 h-6" />
            <h3 className="text-xl font-bold text-gray-800">
              Gente que Constrói
            </h3>
          </div>
        </div>

        <div className="space-y-6">
          {pessoas.map((pessoa, index) => (
            <div
              key={pessoa.id}
              className={`relative group ${index !== pessoas.length - 1 ? "pb-8 border-b border-gray-200" : ""}`}
            >
              <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <img
                  src={pessoa.imagemUrl}
                  alt={pessoa.nome}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-bold text-[#3C6AB2] text-lg">
                {pessoa.nome}
              </h4>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                <strong className="text-gray-700">{pessoa.cargo}.</strong>{" "}
                <br />
                {pessoa.descricao}
              </p>

              {/* Overlay de Ações Admin */}
              <div className="absolute inset-0 flex items-start justify-end gap-3 mt-2 mr-2">
                <button
                  onClick={() => onEdit(pessoa.id)}
                  className="bg-white p-2 rounded-full text-blue-600 hover:scale-110 transition-transform shadow-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(pessoa.id)}
                  className="bg-red-500 p-2 rounded-full text-white hover:scale-110 transition-transform shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* BOTÃO ADICIONAR PESSOA */}
          <button
            onClick={onAdd}
            className="w-full mt-4 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold flex items-center justify-center gap-2 hover:border-[#3C6AB2] hover:text-[#3C6AB2] hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-5 h-5" /> Adicionar Pessoa
          </button>
        </div>
      </div>
    </div>
  );
}
