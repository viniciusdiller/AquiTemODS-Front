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

// Adiciona hooks e funções de API para integrar com admin SustentAi
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
  // Estados do formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tag, setTag] = useState("");
  // Somente envio por arquivo: armazena o arquivo selecionado e uma URL de preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const getFullImageUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    const normalized = path.replace(/\\/g, "/");
    return `${API_URL}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
  };

  const [corDestaque, setCorDestaque] = useState("text-[#D7386E]");
  const [corFundo, setCorFundo] = useState("bg-pink-50/30");
  const [corBorda, setCorBorda] = useState("border-pink-100");

  // Novo estado para submissão
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const submittedRef = useRef(false);

  // Preenche o formulário se for edição, ou limpa se for criação
  useEffect(() => {
    if (acaoAtual) {
      setTitulo(acaoAtual.titulo || "");
      setDescricao(acaoAtual.descricao || "");
      setTag(acaoAtual.tag || "");
      // mostra preview da imagem já salva (quando existir)
      setPreviewUrl(acaoAtual.imagemUrl || null);
      setCorDestaque(acaoAtual.corDestaque || "text-[#D7386E]");
      setCorFundo(acaoAtual.corFundo || "bg-pink-50/30");
      setCorBorda(acaoAtual.corBorda || "border-pink-100");
    } else {
      setTitulo("");
      setDescricao("");
      setTag("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setCorDestaque("text-[#D7386E]");
      setCorFundo("bg-pink-50/30");
      setCorBorda("border-pink-100");
    }
  }, [acaoAtual, isOpen]);

  // libera objectURL quando trocar de arquivo para evitar memory leaks
  useEffect(() => {
    if (!selectedFile) return;
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => {
      try {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      } catch (e) {
        // ignore
      }
    };
  }, [selectedFile]);

  const handleClose = () => {
    // Reseta o flag para permitir novas submissões quando o modal for fechado
    submittedRef.current = false;
    onClose();
  };

  // Handler para criar/atualizar ação usando API de admin
  async function handleSave() {
    // Proteção contra submissões duplicadas rápidas
    if (submittedRef.current) {
      console.log("ModalAcao: submissão já em andamento ou já enviada — ignorando");
      return;
    }

    submittedRef.current = true;
    // evita múltiplos cliques
    if (isSubmitting) return;
    setIsSubmitting(true);

    // VALIDAÇÃO CLIENT-SIDE: evita enviar payload vazio que o servidor rejeita
    if (!titulo || !descricao) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e a descrição antes de salvar.",
      });
      setIsSubmitting(false);
      submittedRef.current = false;
      return;
    }

    // Agora o fluxo exige um arquivo — validação
    if (!selectedFile) {
      toast({ title: "Arquivo obrigatório", description: "Selecione uma imagem para enviar." });
      setIsSubmitting(false);
      submittedRef.current = false;
      return;
    }

    // Helper: gera um slug simples a partir do título (compatível com a maioria dos backends)
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
      slug: acaoAtual?.slug || generateSlug(titulo),
      publicado: true,
      ordem: acaoAtual?.ordem ?? 0,
    };

    // Prepara FormData com o arquivo e os campos
    const form = new FormData();
    form.append("imagem", selectedFile, selectedFile.name);
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) form.append(key, String(value));
    });
    const bodyToSend = form;

    // feedback inicial (opcional) para indicar que a requisição começou
    try {
      toast({ title: "Enviando", description: "Enviando dados para o servidor..." });
    } catch (e) {
      // ignore se o toast falhar
    }

    try {
      if (acaoAtual && acaoAtual.id) {
        // inclui o id em um campo textual apenas para acompanhar (o backend usa a rota com id)
        form.append("id", String(acaoAtual.id));
      }

      if (onSave) {
        const maybePromise = onSave(bodyToSend);
        // Use an explicit null/undefined check to satisfy TypeScript strict null checks
        if (maybePromise != null && typeof (maybePromise as any).then === "function") {
          await maybePromise; // aguarda conclusão para dar feedback mais consistente
        }
      }

      // Fecha o modal; o handleClose resetará submittedRef
      handleClose();
    } catch (error: any) {
      console.error("Erro ao salvar ação:", error);
      const message = error?.message || "Ocorreu um erro ao salvar a ação.";
      const details = error?.data || error?.response?.data;
      console.warn("Detalhes do erro da API:", details);

      // Permite nova tentativa se houve erro
      submittedRef.current = false;

      const description = details && typeof details === "object" ? JSON.stringify(details) : String(details || message);
      toast({ title: "Erro", description: description });
    } finally {
      setIsSubmitting(false);
      // NOTA: não resetar submittedRef aqui em caso de sucesso — handleClose fará isso.
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header do Modal */}
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

        {/* Corpo do Modal (Formulário) */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          {/* Textos Principais */}
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
                {/* NOVO CAMPO: TAG */}
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

          {/* Mídia */}
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
                      accept="image/*"
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
                    <img src={getFullImageUrl(previewUrl) || undefined} alt="Preview" className="max-h-40 rounded-xl object-contain border" />
                  ) : (
                    <div className="h-24 w-full flex items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
                      Nenhuma imagem selecionada
                    </div>
                  )}
                  {selectedFile && (
                    <p className="text-xs text-gray-500 mt-2">Arquivo selecionado: {selectedFile.name}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">* Envie um arquivo de imagem. O backend deve gravar a imagem e retornar a URL.</p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Estilização */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-purple-600 font-semibold mb-2">
              <Palette className="w-5 h-5" /> Estilo Visual
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor do Destaque
                </label>
                <select
                  value={corDestaque}
                  onChange={(e) => setCorDestaque(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500/50 bg-white"
                >
                  <option value="text-[#D7386E]">Rosa (SustentAí)</option>
                  <option value="text-[#3C6AB2]">Azul (SustentAí)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor de Fundo
                </label>
                <select
                  value={corFundo}
                  onChange={(e) => setCorFundo(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500/50 bg-white"
                >
                  <option value="bg-pink-50/30">Fundo Rosa Claro</option>
                  <option value="bg-blue-50/30">Fundo Azul Claro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor da Borda
                </label>
                <select
                  value={corBorda}
                  onChange={(e) => setCorBorda(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500/50 bg-white"
                >
                  <option value="border-pink-100">Borda Rosa</option>
                  <option value="border-blue-100">Borda Azul</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer do Modal */}
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
              className={`px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md w-full sm:w-auto ${isSubmitting ? 'opacity-60 pointer-events-none' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{acaoAtual ? "Salvando..." : "Criando..."}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> {acaoAtual ? "Salvar" : "Criar Ação"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
