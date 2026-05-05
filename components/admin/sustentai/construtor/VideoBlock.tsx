import React, { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface VideoBlockProps {
  block: any;
  updateBlock: (
    id: string | number,
    field: "id" | "type" | "content" | "bgColor" | "isBold" | "link" | "images",
    value: any,
  ) => void;
  removeBlock: (id: string | number) => void;
}
export default function VideoBlock({
  block,
  updateBlock,
  removeBlock,
}: VideoBlockProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBlock(block.id, "content", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFullUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("data:") || path.startsWith("http")) return path;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <div className="flex flex-col gap-4 p-4 mb-4 border border-gray-200 rounded-lg shadow-sm bg-white">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">Bloco de Vídeo</h3>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeBlock(block.id)} // Ajustado para passar o ID
          type="button"
        >
          <Trash className="w-4 h-4 mr-2" />
          Remover
        </Button>
      </div>

      <input
        type="file"
        accept="video/mp4,video/webm,video/ogg"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      {/* Trocado de bloco.conteudo para block.content */}
      {block.content && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Preview do Vídeo:</p>
          <video
            controls
            src={getFullUrl(block.content)}
            className="w-full max-h-[400px] rounded-md bg-black"
          />
        </div>
      )}
    </div>
  );
}
