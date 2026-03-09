"use client";
import React from "react";
import { ImageIcon, Trash2, Plus, GripVertical } from "lucide-react";
import { BlockImage } from "@/app/admin/sustentai/acao/[id]/page";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ImageBlock({ block, updateBlock, removeBlock }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(block.id) });

  const dndStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const images: BlockImage[] = block.images || [];

  const handleAddImage = () => {
    updateBlock(block.id, "images", [...images, { url: "", link: "" }]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    updateBlock(block.id, "images", newImages);
  };

  const handleUpdateImage = (
    index: number,
    field: keyof BlockImage,
    value: string,
  ) => {
    const newImages = [...images];
    newImages[index][field] = value;
    updateBlock(block.id, "images", newImages);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleUpdateImage(index, "url", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      ref={setNodeRef}
      style={dndStyle}
      className="flex items-stretch gap-5 group w-full"
    >
      {/* Alça de Arrastar Oculta (Lado esquerdo, altura total) */}
      <div
        {...attributes}
        {...listeners}
        className="w-8 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700"
        title="Arraste para reordenar"
      >
        <GripVertical className="w-6 h-6" />
      </div>

      {/* Bloco Real de Conteúdo */}
      <div className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-gray-200 relative transition-all">
        <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-50 md:group-hover:opacity-100 transition-opacity z-10 bg-white/80 p-1 rounded-lg shadow-sm backdrop-blur-sm">
          <button
            onClick={() => removeBlock(block.id)}
            className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50"
            title="Remover Bloco"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-500 uppercase tracking-widest mt-8 md:mt-0">
          <ImageIcon className="w-4 h-4" /> Bloco de Imagem
        </div>

        {/* Lista de Edição das Imagens do Bloco */}
        <div className="space-y-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-100 bg-gray-50 rounded-xl relative"
            >
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex flex-col justify-center">
                <label className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white px-4 py-2 rounded-xl font-medium cursor-pointer shadow-sm hover:opacity-90">
                  <span className="text-sm">Selecionar arquivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                    className="sr-only"
                  />
                </label>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  Apenas imagem
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <input
                  type="text"
                  value={img.url}
                  onChange={(e) =>
                    handleUpdateImage(index, "url", e.target.value)
                  }
                  placeholder="Ou cole a URL da imagem"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3C6AB2]/50 focus:outline-none text-sm"
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleAddImage}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-[#3C6AB2] hover:text-[#3C6AB2] flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Adicionar{" "}
            {images.length > 0 ? "outra imagem" : "imagem"}
          </button>
        </div>

        {/* Preview das imagens (Carrossel Nativo UI) */}
        {images.length > 0 && images.some((img) => img.url) && (
          <div className="mt-6 border-t pt-4">
            <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">
              Pré-visualização
            </label>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 custom-scrollbar">
              {images.map((img, idx) => {
                if (!img.url) return null;

                return (
                  <div
                    key={idx}
                    className="snap-center shrink-0 w-full md:w-3/4 lg:w-2/3 h-48 md:h-64 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 relative shadow-sm"
                  >
                    <img
                      src={img.url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                    {images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-md">
                        {idx + 1} / {images.length}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
