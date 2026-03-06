"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  X,
  Save,
  Image as ImageIcon,
  Type,
  Palette,
  LayoutTemplate,
  Tag,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getAcoesSustentai } from "@/lib/api";

interface ModalAcaoProps {
  isOpen: boolean;
  onClose: () => void;
  acaoAtual?: any;
  onSave?: (dados: any) => void;
}

export default function ModalAcao({
  isOpen,
  onClose,
  acaoAtual,
  onSave,
}: ModalAcaoProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tag, setTag] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getFullImageUrl = (path?: string | null) => {
    if (!path) return null;
    if (
      path.startsWith("http") ||
      path.startsWith("blob:") ||
      path.startsWith("data:")
    )
      return path;
    const normalized = path.replace(/\\/g, "/");
    return `${API_URL}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
  };

  // Estados das cores
  const [corDestaque, setCorDestaque] = useState("text-[#D7386E]");
  const [corFundo, setCorFundo] = useState("bg-pink-50/30");
  const [corBorda, setCorBorda] = useState("border-pink-100");
  const [corTexto, setCorTexto] = useState("text-gray-800"); // NOVO ESTADO

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const submittedRef = useRef(false);

  useEffect(() => {
    if (acaoAtual) {
      setTitulo(acaoAtual.titulo || "");
      setDescricao(acaoAtual.descricao || "");
      setTag(acaoAtual.tag || "");
      setPreviewUrl(acaoAtual.imagemUrl || null);
      setCorDestaque(acaoAtual.corDestaque || "text-[#D7386E]");
      setCorFundo(acaoAtual.corFundo || "bg-pink-50/30");
      setCorBorda(acaoAtual.corBorda || "border-pink-100");
      setCorTexto(acaoAtual.corTexto || "text-gray-800");
    } else {
      setTitulo("");
      setDescricao("");
      setTag("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setCorDestaque("text-[#D7386E]");
      setCorFundo("bg-pink-50/30");
      setCorBorda("border-pink-100");
      setCorTexto("text-gray-800");
    }
  }, [acaoAtual, isOpen]);

  // Libera objectURL para evitar memory leaks
  useEffect(() => {
    if (!selectedFile) return;
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => {
      try {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      } catch (e) {}
    };
  }, [selectedFile]);

  const handleClose = () => {
    submittedRef.current = false;
    onClose();
  };

  async function handleSave() {
    if (submittedRef.current || isSubmitting) return;

    submittedRef.current = true;
    setIsSubmitting(true);

    if (!titulo || !descricao) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e a descrição antes de salvar.",
        className: "bg-gray-100 border-gray-300 text-gray-800",
      });
      setIsSubmitting(false);
      submittedRef.current = false;
      return;
    }

    if (!selectedFile && !acaoAtual) {
      toast({
        title: "Arquivo obrigatório",
        description: "Selecione uma imagem para enviar.",
        className: "bg-gray-100 border-gray-300 text-gray-800",
      });
      setIsSubmitting(false);
      submittedRef.current = false;
      return;
    }

    const generateSlug = (text: string) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    const payload: any = {
      titulo,
      descricao,
      tag,
      corDestaque,
      corFundo,
      corBorda,
      corTexto, // ENVIANDO A NOVA PROPRIEDADE
      slug: acaoAtual?.slug || generateSlug(titulo),
      publicado: true,
      ordem: acaoAtual?.ordem ?? 0,
    };

    // Verificação local prévia: evita criar duas ações com mesmo título
    try {
      const todas = await getAcoesSustentai().catch(() => []);
      if (Array.isArray(todas) && todas.length > 0) {
        const tituloNormalize = (titulo || "").trim().toLowerCase();
        const conflitante = todas.find((a: any) => {
          if (!a) return false;
          const otherTitle = (a.titulo || a.title || a.name || "").trim().toLowerCase();
          if (!otherTitle) return false;
          // se estivermos editando, ignorar o próprio registro
          if (acaoAtual && (acaoAtual.id || acaoAtual._id) && (a.id === acaoAtual.id || a.id === acaoAtual._id)) return false;
          return otherTitle === tituloNormalize;
        });
        if (conflitante) {
          toast({
            title: "Título duplicado",
            description: "Já existe uma ação com esse título. Escolha outro título ou edite a existente.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          submittedRef.current = false;
          return;
        }
      }
    } catch (e) {
      // se falhar a verificação, continua e deixa o backend validar
      console.debug("Verificação de títulos falhou, prosseguindo:", e);
    }

    const form = new FormData();
    if (selectedFile) {
      form.append("imagem", selectedFile, selectedFile.name);
    }
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        form.append(key, String(value));
    });

    try {
      toast({
        title: "Enviando",
        description: "Enviando dados para o servidor...",
        className: "bg-gray-100 border-gray-300 text-gray-800",
      });

      if (acaoAtual?.id) {
        form.append("id", String(acaoAtual.id));
      }

      if (onSave) {
        const maybePromise = onSave(form);
        if (
          maybePromise != null &&
          typeof (maybePromise as any).then === "function"
        ) {
          await maybePromise;
        }
      }

      toast({
        title: "Sucesso!",
        description: "Ação salva com êxito.",
        className: "bg-green-600 border-green-700 text-white",
      });

      handleClose();
    } catch (error: any) {
      console.error("Erro ao salvar ação:", error);
      const message = error?.message || "Ocorreu um erro ao salvar a ação.";
      const details = error?.data || error?.response?.data;

      submittedRef.current = false;

      const description =
        details && typeof details === "object"
          ? JSON.stringify(details)
          : String(details || message);

      toast({
        title: "Erro",
        description: description,
        className: "bg-gray-100 border-red-300 text-red-600",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {acaoAtual ? "Editar Ação" : "Adicionar Nova Ação"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#D7386E] font-semibold mb-2">
              <Type className="w-5 h-5" /> Textos Principais
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título da Ação
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Sala do Empreendedor"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D7386E]/50 focus:border-[#D7386E]"
                />
              </div>
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Tag className="w-4 h-4 text-gray-400" /> Tag
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Ex: Inovação"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D7386E]/50 focus:border-[#D7386E]"
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
                placeholder="Descreva a ação em poucas linhas..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D7386E]/50 focus:border-[#D7386E] resize-none"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#3C6AB2] font-semibold mb-2">
              <ImageIcon className="w-5 h-5" /> Mídia
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem de Capa
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div>
                  <label className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white px-4 py-2 rounded-xl font-medium cursor-pointer shadow-md hover:opacity-90">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm">Selecionar imagem</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setSelectedFile(f);
                      }}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div className="flex-1">
                  {previewUrl ? (
                    (() => {
                      const src = getFullImageUrl(previewUrl) || previewUrl;
                      const lower = (previewUrl || "").toLowerCase();
                      const isDataPdf = lower.startsWith(
                        "data:application/pdf",
                      );
                      const isPdfExt =
                        src && src.toLowerCase().split("?")[0].endsWith(".pdf");
                      const isPdfByType =
                        selectedFile?.type === "application/pdf";
                      const isPdf = isDataPdf || isPdfExt || isPdfByType;

                      if (isPdf) {
                        return (
                          <div className="w-full h-40 md:h-56 rounded-xl overflow-hidden bg-gray-100 border">
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
                          </div>
                        );
                      }

                      return (
                        <img
                          src={src}
                          alt="Preview"
                          className="max-h-40 rounded-xl object-contain border"
                        />
                      );
                    })()
                  ) : (
                    <div className="h-24 w-full flex items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
                      Nenhuma imagem selecionada
                    </div>
                  )}
                  {selectedFile && (
                    <p className="text-xs text-gray-500 mt-2">
                      Arquivo selecionado: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-purple-600 font-semibold mb-2">
              <Palette className="w-5 h-5" /> Estilo Visual
            </div>
            {/* NOVO GRID DE 4 COLUNAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 truncate">
                  Cor do Texto
                </label>
                <select
                  value={corTexto}
                  onChange={(e) => setCorTexto(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500/50 bg-white"
                >
                  <option value="text-gray-800">Cinza Escuro (Padrão)</option>
                  <option value="text-[#D7386E]">Rosa (SustentAí)</option>
                  <option value="text-[#3C6AB2]">Azul (SustentAí)</option>
                  <option value="text-slate-900">Preto</option>
                  <option value="text-white">Branco</option>
                  <option value="text-gray-500">Cinza Médio</option>
                  <option value="text-emerald-700">Verde Escuro</option>
                  <option value="text-purple-700">Roxo Escuro</option>
                  <option value="text-red-700">Vermelho Escuro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 truncate">
                  Cor do Destaque (Tag/Ícone)
                </label>
                <select
                  value={corDestaque}
                  onChange={(e) => setCorDestaque(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500/50 bg-white"
                >
                  <option value="text-[#D7386E]">Rosa (SustentAí)</option>
                  <option value="text-[#3C6AB2]">Azul (SustentAí)</option>
                  <option value="text-emerald-600">Verde</option>
                  <option value="text-amber-600">Amarelo</option>
                  <option value="text-orange-500">Laranja</option>
                  <option value="text-purple-600">Roxo</option>
                  <option value="text-red-600">Vermelho</option>
                  <option value="text-slate-900">Preto / Escuro</option>
                  <option value="text-white">Branco</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 truncate">
                  Cor de Fundo
                </label>
                <select
                  value={corFundo}
                  onChange={(e) => setCorFundo(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500/50 bg-white"
                >
                  <option value="bg-pink-50/30">Fundo Rosa Claro</option>
                  <option value="bg-blue-50/30">Fundo Azul Claro</option>
                  <option value="bg-emerald-50/30">Fundo Verde Claro</option>
                  <option value="bg-amber-50/30">Fundo Amarelo Claro</option>
                  <option value="bg-orange-50/30">Fundo Laranja Claro</option>
                  <option value="bg-purple-50/30">Fundo Roxo Claro</option>
                  <option value="bg-red-50/30">Fundo Vermelho Claro</option>
                  <option value="bg-slate-400/30">Fundo Cinza Claro</option>
                  <option value="bg-white">Fundo Branco</option>
                  <option value="bg-slate-900">Fundo Escuro (Preto)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 truncate">
                  Cor da Borda
                </label>
                <select
                  value={corBorda}
                  onChange={(e) => setCorBorda(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500/50 bg-white"
                >
                  <option value="border-pink-100">Borda Rosa</option>
                  <option value="border-blue-100">Borda Azul</option>
                  <option value="border-emerald-100">Borda Verde</option>
                  <option value="border-amber-100">Borda Amarelo</option>
                  <option value="border-orange-100">Borda Laranja</option>
                  <option value="border-purple-100">Borda Roxo</option>
                  <option value="border-red-100">Borda Vermelha</option>
                  <option value="border-slate-200">Borda Escura (Cinza)</option>
                  <option value="border-gray-100">Borda Branca / Sutil</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            {acaoAtual ? (
              <Link
                href={`/admin/sustentai/acao/${acaoAtual.id}`}
                className="px-4 py-2.5 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center gap-2 hover:bg-purple-200 transition-colors"
              >
                <LayoutTemplate className="w-4 h-4" /> Editar Página Interna
              </Link>
            ) : (
              <span className="text-xs text-gray-400">
                Salve a ação para criar conteúdo.
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors w-full sm:w-auto"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className={`px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md w-full sm:w-auto ${isSubmitting ? "opacity-60 pointer-events-none" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{acaoAtual ? "Salvando..." : "Criando..."}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />{" "}
                  {acaoAtual ? "Salvar" : "Criar Ação"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
