"use client";
import React, { useState } from "react";
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

  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

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

  // Abre modal interno
  const confirmRemoveImage = (index: number) => {
    setImageToDelete(index);
  };

  // Executa a remoção e fecha
  const executeRemoveImage = () => {
    if (imageToDelete !== null) {
      const newImages = [...images];
      newImages.splice(imageToDelete, 1);
      updateBlock(block.id, "images", newImages);
      setImageToDelete(null);
    }
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
      className="flex items-stretch gap-2 group w-full"
    >
      {/* MODAL INTERNO PARA APAGAR IMAGEM INDIVIDUAL */}
      {imageToDelete !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900">
              Quer mesmo remover esta imagem?
            </h3>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setImageToDelete(null)}
                className="px-4 py-2 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={executeRemoveImage}
                className="px-4 py-2 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
              >
                Sim, remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alça de Arrastar Oculta */}
      <div
        {...attributes}
        {...listeners}
        className="w-8 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700"
        title="Arraste para reordenar"
      >
        <GripVertical className="w-6 h-6" />
      </div>

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

        <div className="space-y-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border border-gray-100 bg-gray-50 rounded-xl relative items-center"
            >
              <button
                onClick={() => confirmRemoveImage(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors z-10"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* ESQUERDA: Apenas a miniatura da imagem */}
              <div className="flex justify-center md:justify-start">
                {img.url ? (
                  <div className="w-56 h-40 relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white shrink-0">
                    <img
                      src={img.url}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white shrink-0">
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>

              {/* DIREITA: Input da URL e botão de upload abaixo */}
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase ml-1">
                    URL da Imagem
                  </label>
                  <input
                    type="text"
                    value={img.url}
                    onChange={(e) =>
                      handleUpdateImage(index, "url", e.target.value)
                    }
                    placeholder="Cole o link (URL) da imagem aqui"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3C6AB2]/50 focus:outline-none text-sm"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white px-5 py-2.5 rounded-xl font-medium cursor-pointer shadow-sm hover:opacity-90 transition-opacity">
                    <span className="text-sm whitespace-nowrap">
                      {img.url ? "Alterar arquivo" : "Selecionar arquivo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, index)}
                      className="sr-only"
                    />
                  </label>
                  <span className="text-xs text-gray-400 font-medium">
                    Apenas formatos de imagem
                  </span>
                </div>
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
