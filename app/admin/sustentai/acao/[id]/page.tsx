"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Image as ImageIcon,
  Type,
  Save,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  getAcaoConteudo,
  adminUpdateAcaoConteudo,
  adminCreateAcao,
  adminCreateAcaoConteudo,
} from "@/lib/api";
import TextBlock from "@/components/admin/sustentai/construtor/TextBlock";
import ImageBlock from "@/components/admin/sustentai/construtor/ImageBlock";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type BlockType = "text" | "image";

export interface BlockImage {
  url: string;
  link?: string;
}

export interface Block {
  id: string | number; // Adaptado para suportar IDs numéricos que vêm da API
  type: BlockType;
  content: string;
  bgColor: string;
  isBold: boolean;
  link?: string;
  images?: BlockImage[];
}

// Gera um ID sempre único na hora de criar novos blocos
const generateUniqueId = () =>
  Date.now().toString() + Math.random().toString(36).substring(2, 6);

export default function AdminConstrutorAcaoPage() {
  const params = useParams();
  const router = useRouter();
  const idAcao = params?.id as string;

  const { toast } = useToast();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const carregarConteudo = async () => {
      setIsLoading(true);
      try {
        if (!idAcao) return;
        const dados = await getAcaoConteudo(idAcao).catch(() => null);

        if (dados && Array.isArray(dados.blocos) && dados.blocos.length > 0) {
          const blocosMigrados = dados.blocos.map((b: any) => {
            if (b.type === "image" && !b.images) {
              return {
                ...b,
                images: b.content
                  ? [{ url: b.content, link: b.link || "" }]
                  : [],
              };
            }
            return b;
          });
          setBlocks(blocosMigrados);
        } else {
          setBlocks([
            {
              id: generateUniqueId(),
              type: "text",
              content: "",
              bgColor: "#ffffff",
              isBold: false,
            },
          ]);
        }
      } catch (error) {
        setBlocks([
          {
            id: generateUniqueId(),
            type: "text",
            content: "",
            bgColor: "#ffffff",
            isBold: false,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    carregarConteudo();
  }, [idAcao]);

  const addTextBlock = () =>
    setBlocks((prev) => [
      ...prev,
      {
        id: generateUniqueId(),
        type: "text",
        content: "",
        bgColor: "#ffffff",
        isBold: false,
      },
    ]);

  const addImageBlock = () =>
    setBlocks((prev) => [
      ...prev,
      {
        id: generateUniqueId(),
        type: "image",
        content: "",
        bgColor: "#ffffff",
        isBold: false,
        images: [],
      },
    ]);

  const updateBlock = (id: string | number, field: keyof Block, value: any) =>
    setBlocks((prev) =>
      prev.map((b) =>
        String(b.id) === String(id) ? { ...b, [field]: value } : b,
      ),
    );

  const removeBlock = (id: string | number) =>
    setBlocks((prev) => prev.filter((b) => String(b.id) !== String(id)));

  const handleSalvar = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token)
      return toast({ title: "Sessão expirada", variant: "destructive" });
    if (!idAcao) return;

    setIsSaving(true);
    try {
      let targetId = idAcao;
      const blocksParaSalvar = blocks.map((b, index) => ({
        ...b,
        ordem: index,
      }));

      if (idAcao === "novo") {
        const created = await adminCreateAcao(
          { titulo: "Nova Ação", descricao: "" },
          token,
        );
        targetId =
          (created && (created.id || created._id || created.data?.id)) || null;
        if (!targetId) throw new Error("Falha ao criar nova ação");

        await adminCreateAcaoConteudo(
          targetId as string,
          blocksParaSalvar,
          token,
        );
        router.replace(`/admin/sustentai/acao/${targetId}`);
      } else {
        await adminUpdateAcaoConteudo(
          targetId as string,
          blocksParaSalvar,
          token,
        );
      }
      toast({ title: "Salvo", description: "Conteúdo salvo com sucesso." });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Erro ao salvar",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || String(active.id) === String(over.id)) return;

    setBlocks((items) => {
      const oldIndex = items.findIndex(
        (item) => String(item.id) === String(active.id),
      );
      const newIndex = items.findIndex(
        (item) => String(item.id) === String(over.id),
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(items, oldIndex, newIndex);
      }
      return items;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="w-12 h-12 text-[#D7386E] animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">
          Carregando construtor...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-200 gap-4">
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
                Monte o conteúdo da ação em blocos com texto rico.
              </p>
            </div>
          </div>

          <button
            onClick={handleSalvar}
            disabled={isSaving}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
              isSaving
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white hover:opacity-90"
            }`}
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? "Salvando..." : "Salvar Página"}
          </button>
        </div>

        <div className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => String(b.id))}
              strategy={verticalListSortingStrategy}
            >
              {blocks.map((block) =>
                block.type === "text" ? (
                  <TextBlock
                    key={block.id}
                    block={block}
                    updateBlock={updateBlock}
                    removeBlock={removeBlock}
                  />
                ) : (
                  <ImageBlock
                    key={block.id}
                    block={block}
                    updateBlock={updateBlock}
                    removeBlock={removeBlock}
                  />
                ),
              )}
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 py-8 border-t border-dashed border-gray-300">
          <button
            onClick={addTextBlock}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-gray-200 shadow-sm text-gray-700 font-medium hover:border-[#D7386E] hover:text-[#D7386E] transition-all"
          >
            <Plus className="w-5 h-5" /> <Type className="w-5 h-5" /> Adicionar
            Texto
          </button>
          <button
            onClick={addImageBlock}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-gray-200 shadow-sm text-gray-700 font-medium hover:border-[#3C6AB2] hover:text-[#3C6AB2] transition-all"
          >
            <Plus className="w-5 h-5" /> <ImageIcon className="w-5 h-5" />{" "}
            Adicionar Imagem
          </button>
        </div>
      </div>
    </div>
  );
}
