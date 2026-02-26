"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Image as ImageIcon,
  Type,
  Save,
  Trash2,
  Bold,
} from "lucide-react";
import Link from "next/link";

// Tipagem dos blocos
type BlockType = "text" | "image";

interface Block {
  id: string;
  type: BlockType;
  content: string;
  bgColor: string; // Para o fundo da div
  isBold: boolean; // Para texto em negrito
}

export default function AdminConstrutorAcaoPage() {
  // Estado inicial simulando que a página começou com um bloco de texto vazio
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: "1",
      type: "text",
      content: "Escreva o texto introdutório aqui...",
      bgColor: "bg-white",
      isBold: false,
    },
  ]);

  // Funções para adicionar blocos
  const addTextBlock = () => {
    setBlocks([
      ...blocks,
      {
        id: Date.now().toString(),
        type: "text",
        content: "",
        bgColor: "bg-white",
        isBold: false,
      },
    ]);
  };

  const addImageBlock = () => {
    setBlocks([
      ...blocks,
      {
        id: Date.now().toString(),
        type: "image",
        content: "",
        bgColor: "bg-transparent",
        isBold: false,
      },
    ]);
  };

  // Funções para editar blocos
  const updateBlock = (id: string, field: keyof Block, value: any) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cabeçalho do Construtor */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/sustentai"
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Construtor da Página
              </h1>
              <p className="text-gray-500 text-sm">
                Monte o conteúdo da ação em blocos.
              </p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Save className="w-4 h-4" /> Salvar Página
          </button>
        </div>

        {/* Editor de Blocos */}
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 relative group transition-all"
            >
              {/* Barra de Ferramentas do Bloco (Aparece ao lado) */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                {block.type === "text" && (
                  <>
                    <button
                      onClick={() =>
                        updateBlock(block.id, "isBold", !block.isBold)
                      }
                      className={`p-2 rounded-lg border ${block.isBold ? "bg-gray-200 border-gray-400" : "bg-gray-50 border-gray-200"} hover:bg-gray-200`}
                      title="Negrito"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <select
                      value={block.bgColor}
                      onChange={(e) =>
                        updateBlock(block.id, "bgColor", e.target.value)
                      }
                      className="text-sm border border-gray-200 rounded-lg px-2 bg-gray-50"
                    >
                      <option value="bg-white">Fundo Branco</option>
                      <option value="bg-pink-50">Fundo Rosa Claro</option>
                      <option value="bg-blue-50">Fundo Azul Claro</option>
                      <option value="bg-gray-100">Fundo Cinza</option>
                    </select>
                  </>
                )}
                <button
                  onClick={() => removeBlock(block.id)}
                  className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-500 uppercase tracking-widest">
                {block.type === "text" ? (
                  <>
                    <Type className="w-4 h-4" /> Bloco de Texto
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" /> Bloco de Imagem
                  </>
                )}
              </div>

              {/* Renderização do Input baseado no tipo do Bloco */}
              {block.type === "text" ? (
                <textarea
                  value={block.content}
                  onChange={(e) =>
                    updateBlock(block.id, "content", e.target.value)
                  }
                  placeholder="Digite seu texto aqui..."
                  className={`w-full min-h-[100px] p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D7386E]/50 focus:outline-none resize-y ${block.bgColor} ${block.isBold ? "font-bold" : "font-normal"}`}
                />
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) =>
                      updateBlock(block.id, "content", e.target.value)
                    }
                    placeholder="URL da imagem (ex: /Cursos/foto.png)"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3C6AB2]/50 focus:outline-none"
                  />
                  {block.content && (
                    <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-100 relative bg-gray-50">
                      <img
                        src={block.content}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botões para Adicionar Novos Blocos */}
        <div className="flex justify-center gap-4 py-8 border-t border-dashed border-gray-300">
          <button
            onClick={addTextBlock}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 shadow-sm text-gray-700 font-medium hover:border-[#D7386E] hover:text-[#D7386E] transition-all"
          >
            <Plus className="w-4 h-4" /> <Type className="w-4 h-4" /> Adicionar
            Texto
          </button>
          <button
            onClick={addImageBlock}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 shadow-sm text-gray-700 font-medium hover:border-[#3C6AB2] hover:text-[#3C6AB2] transition-all"
          >
            <Plus className="w-4 h-4" /> <ImageIcon className="w-4 h-4" />{" "}
            Adicionar Imagem
          </button>
        </div>
      </div>
    </div>
  );
}
