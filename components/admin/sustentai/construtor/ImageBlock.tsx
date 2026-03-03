// components/admin/sustentai/construtor/ImageBlock.tsx
"use client";
import React from "react";
import { ImageIcon, Trash2 } from "lucide-react";

export default function ImageBlock({
  block,
  updateBlock,
  removeBlock,
  handleSelectFileForBlock,
}: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 relative group transition-all">
      <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-50 md:group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => removeBlock(block.id)}
          className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
          title="Remover Imagem"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-500 uppercase tracking-widest">
        <ImageIcon className="w-4 h-4" /> Bloco de Imagem
      </div>

      <div className="space-y-3 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div>
            <label className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white px-4 py-2 rounded-xl font-medium cursor-pointer shadow-md hover:opacity-90">
              <span className="text-sm">Selecionar arquivo</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  handleSelectFileForBlock(block.id, f);
                }}
                className="sr-only"
              />
            </label>
            <div className="text-xs text-gray-500 mt-2">
              Aceita imagens e PDFs.
            </div>
          </div>

          <div className="md:col-span-2">
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(block.id, "content", e.target.value)}
              placeholder="Ou cole a URL da imagem/PDF"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3C6AB2]/50 focus:outline-none"
            />

            <div className="mt-3">
              <label className="text-xs font-semibold text-gray-500 ml-1">
                Link de redirecionamento da imagem (Opcional):
              </label>
              <input
                type="url"
                value={block.link || ""}
                onChange={(e) => updateBlock(block.id, "link", e.target.value)}
                placeholder="Ex: https://saquarema.rj.gov.br"
                className="w-full p-2.5 mt-1 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3C6AB2]/50 focus:outline-none text-sm bg-gray-50/50"
              />
            </div>

            {block.content && (
              <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden border border-gray-100 relative bg-gray-50 mt-3">
                {(() => {
                  const src = block.content;
                  const lower = (src || "").toLowerCase();
                  const isPdf =
                    lower.startsWith("data:application/pdf") ||
                    (src && src.toLowerCase().split("?")[0].endsWith(".pdf")) ||
                    (src && src.includes("application/pdf"));

                  if (isPdf) {
                    return (
                      <object
                        data={src}
                        type="application/pdf"
                        className="w-full h-full"
                      >
                        <iframe
                          src={src}
                          className="w-full h-full"
                          title="Preview PDF"
                        />
                      </object>
                    );
                  }

                  return (
                    <img
                      src={src}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
