"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Pega o ID da URL e router
import {
  ArrowLeft,
  Plus,
  Image as ImageIcon,
  Type,
  Save,
  Trash2,
  Bold,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { getAcaoConteudo, adminUpdateAcaoConteudo, adminCreateAcao, adminCreateAcaoConteudo } from "@/lib/api";

type BlockType = "text" | "image";

interface Block {
  id: string;
  type: BlockType;
  content: string;
  bgColor: string;
  isBold: boolean;
}

export default function AdminConstrutorAcaoPage() {
  const params = useParams();
  const router = useRouter();
  const idAcao = params?.id as string;

  const { toast } = useToast();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const carregarConteudo = async () => {
      setIsLoading(true);
      try {
        if (!idAcao) return;
        const dados = await getAcaoConteudo(idAcao).catch((e) => {
          console.warn("getAcaoConteudo falhou:", e);
          return null;
        });

        if (dados && Array.isArray(dados.blocos) && dados.blocos.length > 0) {
          setBlocks(dados.blocos);
        } else {
          setBlocks([
            {
              id: Date.now().toString(),
              type: "text",
              content: "",
              bgColor: "bg-white",
              isBold: false,
            },
          ]);
        }
      } catch (error) {
        console.error("Erro ao buscar o conteúdo da ação:", error);
        setBlocks([
          {
            id: Date.now().toString(),
            type: "text",
            content: "",
            bgColor: "bg-white",
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
      { id: Date.now().toString(), type: "text", content: "", bgColor: "bg-white", isBold: false },
    ]);

  const addImageBlock = () =>
    setBlocks((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "image", content: "", bgColor: "bg-transparent", isBold: false },
    ]);

  const updateBlock = (id: string, field: keyof Block, value: any) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)));

  // Lida com seleção de arquivo para blocos do tipo 'image'. Converte em data URL para preview e envio.
  const handleSelectFileForBlock = (id: string, file: File | null) => {
    if (!file) return updateBlock(id, 'content', '');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // salva data: URL (ou URL direto) no conteúdo do bloco
      updateBlock(id, 'content', result);
      // opcional: armazena nome do arquivo para feedback
      updateBlock(id, 'bgColor', 'file:' + (file.name || ''));
    };
    // Para imagens e PDFs usamos readAsDataURL
    reader.readAsDataURL(file);
  };

  const removeBlock = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id));

  const handleSalvar = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast({ title: "Sessão expirada", description: "Faça login novamente.", variant: "destructive" });
      return;
    }

    if (!idAcao) {
      toast({ title: "ID inválido", description: "Não foi possível identificar a ação.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      // Se estamos criando uma nova ação (rota /admin/sustentai/acao/novo), primeiro cria a ação
      let targetId = idAcao;
      if (idAcao === "novo") {
        // cria uma ação mínima para obter um ID válido
        const created = await adminCreateAcao({ titulo: "Nova Ação", descricao: "" }, token as string);
        // tenta extrair id do retorno
        targetId = (created && (created.id || created._id || created.data?.id)) || null;
        if (!targetId) {
          throw new Error("Falha ao criar nova ação antes de salvar o conteúdo.");
        }
      }

      // Envia { blocos } como payload para manter compatibilidade com backend
      if (idAcao === "novo") {
        // Backend agora expõe POST para criar conteúdo associado a uma ação recém-criada
        // os helpers esperam o array de blocos como 2º argumento
        await adminCreateAcaoConteudo(targetId as string, blocks, token as string);
      } else {
        // Atualização normal via PUT
        // envia diretamente o array de blocos
        await adminUpdateAcaoConteudo(targetId as string, blocks, token as string);
      }

      // Se criamos a ação agora e a rota era 'novo', navega para a rota do novo id para refletir URL
      if (idAcao === "novo") {
        // substitui a rota atual pela do novo id
        try {
          router.replace(`/admin/sustentai/acao/${targetId}`);
        } catch (e) {
          // fallback: força reload para a rota esperada
          window.location.href = `/admin/sustentai/acao/${targetId}`;
        }
      }

      toast({ title: "Salvo", description: "Conteúdo salvo com sucesso." });
    } catch (err: any) {
      console.error("Erro ao salvar conteúdo:", err);
      const msg = err?.message || (err?.data && JSON.stringify(err.data)) || "Erro ao salvar";
      toast({ title: "Erro", description: msg, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // Tela de Carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="w-12 h-12 text-[#D7386E] animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Carregando construtor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cabeçalho do Construtor */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-200 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/sustentai" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Construtor da Página</h1>
              <p className="text-gray-500 text-sm">Monte o conteúdo da ação em blocos.</p>
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
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? "Salvando..." : "Salvar Página"}
          </button>
        </div>

        {/* Editor de Blocos */}
        <div className="space-y-4">
          {blocks.map((block) => (
            <div key={block.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 relative group transition-all">
              {/* Barra de Ferramentas do Bloco */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-50 md:group-hover:opacity-100 transition-opacity z-10">
                {block.type === "text" && (
                  <>
                    <button
                      onClick={() => updateBlock(block.id, "isBold", !block.isBold)}
                      className={`p-2 rounded-lg border ${block.isBold ? "bg-gray-200 border-gray-400 text-black" : "bg-gray-50 border-gray-200 text-gray-500"} hover:bg-gray-200`}
                      title="Negrito"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <select
                      value={block.bgColor}
                      onChange={(e) => updateBlock(block.id, "bgColor", e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-2 bg-gray-50 text-gray-600 focus:outline-none"
                    >
                      <option value="bg-white">Fundo Branco</option>
                      <option value="bg-pink-50">Fundo Rosa</option>
                      <option value="bg-blue-50">Fundo Azul</option>
                      <option value="bg-gray-100">Fundo Cinza</option>
                    </select>
                  </>
                )}

                <button onClick={() => removeBlock(block.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
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

              {/* Renderização do Input */}
              {block.type === "text" ? (
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                  placeholder="Digite seu texto aqui..."
                  className={`w-full min-h-[120px] p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D7386E]/50 focus:outline-none resize-y ${block.bgColor} ${block.isBold ? "font-bold text-gray-900" : "font-normal text-gray-700"}`}
                />
              ) : (
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
                      <div className="text-xs text-gray-500 mt-2">Aceita imagens e PDFs. Será convertido em preview.</div>
                    </div>

                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, "content", e.target.value)}
                        placeholder="Ou cole a URL da imagem/PDF (ex: https://... ou /Cursos/foto.png)"
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3C6AB2]/50 focus:outline-none"
                      />

                      {block.content && (
                        <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden border border-gray-100 relative bg-gray-50 mt-3">
                          {(() => {
                            const src = block.content;
                            const lower = (src || "").toLowerCase();
                            const isDataPdf = lower.startsWith("data:application/pdf");
                            const isPdfExt = src && src.toLowerCase().split("?")[0].endsWith(".pdf");
                            const isPdf = isDataPdf || isPdfExt || (src && src.includes("application/pdf"));

                            if (isPdf) {
                              return (
                                <object data={src} type="application/pdf" className="w-full h-full">
                                  <iframe src={src} className="w-full h-full" title="Preview PDF" />
                                </object>
                              );
                            }

                            return <img src={src} alt="Preview" className="w-full h-full object-contain" />;
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botões para Adicionar Novos Blocos */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 py-8 border-t border-dashed border-gray-300">
          <button onClick={addTextBlock} className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-gray-200 shadow-sm text-gray-700 font-medium hover:border-[#D7386E] hover:text-[#D7386E] hover:bg-pink-50 transition-all">
            <Plus className="w-5 h-5" /> <Type className="w-5 h-5" /> Adicionar Texto
          </button>
          <button onClick={addImageBlock} className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-gray-200 shadow-sm text-gray-700 font-medium hover:border-[#3C6AB2] hover:text-[#3C6AB2] hover:bg-blue-50 transition-all">
            <Plus className="w-5 h-5" /> <ImageIcon className="w-5 h-5" /> Adicionar Imagem
          </button>
        </div>
      </div>
    </div>
  );
}
