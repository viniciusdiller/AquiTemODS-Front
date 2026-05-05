"use client";
import React, { useState } from "react";
import { Video, Trash2, Plus, GripVertical, ChevronRight } from "lucide-react";
import { BlockImage } from "@/app/admin/sustentai/acao/[id]/page";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useToast } from "@/hooks/use-toast";

export default function VideoBlock({ block, updateBlock, removeBlock }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(block.id) });

  const { toast } = useToast();

  const [videoToDelete, setVideoToDelete] = useState<number | null>(null);

  // SOLUÇÃO: Cache-Buster imutável por sessão de edição (evita o vídeo piscar)
  const [cacheBuster] = useState(() => Date.now());

  const dndStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const videos: BlockImage[] = block.videos || [];

  const handleAddVideo = () => {
    updateBlock(block.id, "videos", [...videos, { url: "", link: "" }]);
  };

  const confirmRemoveVideo = (index: number) => {
    setVideoToDelete(index);
  };

  const executeRemoveVideo = () => {
    if (videoToDelete !== null) {
      const newVideos = [...videos];
      newVideos.splice(videoToDelete, 1);
      updateBlock(block.id, "videos", newVideos);
      setVideoToDelete(null);
    }
  };

  const handleUpdateVideo = (
    index: number,
    field: keyof BlockImage,
    value: string,
  ) => {
    const newVideos = [...videos];
    newVideos[index][field] = value;
    updateBlock(block.id, "videos", newVideos);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["video/mp4", "video/webm", "video/ogg"].includes(file.type)) {
      toast({
        title: "Formato não suportado",
        description: "Selecione apenas vídeos em MP4, WebM ou OGG.",
        className: "bg-red-100 border-red-300 text-red-600",
      });
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      handleUpdateVideo(index, "url", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const formatVideoUrl = (url: string) => {
    if (!url) return "";
    // O base64 de preview em tempo real ignora cache (Isso faz o upload no admin parecer instantâneo)
    if (url.startsWith("blob:") || url.startsWith("data:")) return url;

    let finalUrl = url;
    if (!url.startsWith("http")) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      finalUrl = `${baseUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
    }

    // Aplica o quebrador de cache travado para evitar flickering
    const separator = finalUrl.includes("?") ? "&" : "?";
    return `${finalUrl}${separator}v=${cacheBuster}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={dndStyle}
      className="flex items-stretch gap-2 group w-full"
    >
      {/* MODAL INTERNO PARA APAGAR VÍDEO INDIVIDUAL */}
      {videoToDelete !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900">
              Quer mesmo remover este vídeo?
            </h3>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setVideoToDelete(null)}
                className="px-4 py-2 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={executeRemoveVideo}
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
          <Video className="w-4 h-4" /> Bloco de Vídeo
        </div>

        <div className="space-y-4">
          {videos.map((video, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border border-gray-100 bg-gray-50 rounded-xl relative items-center"
            >
              <button
                onClick={() => confirmRemoveVideo(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors z-10"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex justify-center md:justify-start">
                {video.url ? (
                  <div className="w-56 h-40 relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-black shrink-0">
                    <video
                      src={formatVideoUrl(video.url)}
                      className="w-full h-full object-contain"
                      onLoadedMetadata={(e) => {
                        e.currentTarget.currentTime = 1;
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white shrink-0">
                    <Video className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase ml-1">
                    URL do Vídeo
                  </label>
                  <input
                    type="text"
                    value={video.url}
                    onChange={(e) =>
                      handleUpdateVideo(index, "url", e.target.value)
                    }
                    placeholder="Cole o link (URL) do vídeo aqui"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3C6AB2]/50 focus:outline-none text-sm"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#069bcc] to-[#355472] text-white px-5 py-2.5 rounded-xl font-medium cursor-pointer shadow-sm hover:opacity-90 transition-opacity">
                    <span className="text-sm whitespace-nowrap">
                      {video.url ? "Alterar arquivo" : "Selecionar arquivo"}
                    </span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      onChange={(e) => handleFileChange(e, index)}
                      className="sr-only"
                    />
                  </label>
                  <span className="text-xs text-gray-400 font-medium">
                    MP4, WebM ou OGG
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddVideo}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-[#3C6AB2] hover:text-[#3C6AB2] flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Adicionar{" "}
            {videos.length > 0 ? "outro vídeo" : "vídeo"}
          </button>
        </div>

        {videos.some((video) => video.url) && (
          <div className="mt-6 border-t pt-4">
            <label className="text-xs font-semibold text-gray-400 uppercase mb-4 block">
              Pré-visualização (Visão do Público)
            </label>

            <div className="bg-gray-50/30 rounded-2xl w-full">
              {(() => {
                const validVideos = videos.filter((video) => video.url);

                if (validVideos.length > 1) {
                  return (
                    <div className="w-full relative my-10">
                      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 custom-scrollbar items-center">
                        {validVideos.map((video, idx) => (
                          <div
                            key={idx}
                            className="w-[85%] sm:w-[75%] md:w-[70%] flex-shrink-0 snap-center relative group aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden shadow-sm bg-black border border-gray-200"
                          >
                            <video
                              src={formatVideoUrl(video.url)}
                              className="w-full h-full object-cover"
                              controls
                            />
                            <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md z-10 pointer-events-none">
                              {idx + 1} / {validVideos.length}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mt-0 font-medium opacity-80">
                        Deslize para ver mais{" "}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                }

                if (validVideos.length === 1) {
                  return (
                    <div className="w-full my-10 group relative flex justify-center">
                      <video
                        src={formatVideoUrl(validVideos[0].url)}
                        controls
                        className="w-full object-cover h-auto max-h-[600px] rounded-2xl shadow-md bg-black"
                      />
                    </div>
                  );
                }

                return null;
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
