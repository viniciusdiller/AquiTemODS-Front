"use client";
import React, { useEffect, useRef, useState } from "react";
import { X, Save, Image as ImageIcon, User, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ModalPessoaProps {
  isOpen: boolean;
  onClose: () => void;
  pessoaAtual?: any; // Recebe dados se for edição
  onSave: (dados: any) => void; // Envia para a API (pode receber FormData)
}

export default function ModalPessoa({
  isOpen,
  onClose,
  pessoaAtual,
  onSave,
}: ModalPessoaProps) {
  const { toast } = useToast();
  // Estados dos inputs
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [descricao, setDescricao] = useState("");
  // Troquei imagemUrl por selectedFile + preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const submittedRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efeito que preenche os campos quando o modal abre
  useEffect(() => {
    if (pessoaAtual) {
      setNome(pessoaAtual.nome || "");
      setCargo(pessoaAtual.cargo || "");
      setDescricao(pessoaAtual.descricao || "");
      setSelectedFile(null);
      // exibe imagem existente enquanto nenhum arquivo é selecionado
      setPreviewUrl(pessoaAtual.imagemUrl || null);
    } else {
      setNome("");
      setCargo("");
      setDescricao("");
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    submittedRef.current = false;
    setIsSubmitting(false);
  }, [pessoaAtual, isOpen]);

  useEffect(() => {
    if (!selectedFile) return;
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleSalvar = async () => {
    if (submittedRef.current) return;

    // Validações básicas
    if (!nome.trim() || !descricao.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e descrição são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Para criação exigimos arquivo (backend pede imagem ou imagemUrl)
    const isEditing = Boolean(pessoaAtual && pessoaAtual.id);
    if (!isEditing && !selectedFile) {
      toast({
        title: "Imagem necessária",
        description: "Por favor selecione uma imagem para a pessoa.",
        variant: "destructive",
      });
      return;
    }

    submittedRef.current = true;
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("nome", nome);
      form.append("cargo", cargo);
      form.append("descricao", descricao);

      // Se houver arquivo, envia como campo 'imagem' (multer: upload.single('imagem'))
      if (selectedFile) {
        form.append("imagem", selectedFile, selectedFile.name);
      } else if (pessoaAtual?.imagemUrl) {
        // se estiver editando e não enviou novo arquivo, envia imagemUrl como campo para o backend
        form.append("imagemUrl", pessoaAtual.imagemUrl);
      }

      // inclui id quando editar para conveniência do handler pai
      if (isEditing) form.append("id", String(pessoaAtual.id));

      // Delega ao pai para chamar adminCreatePessoa/adminUpdatePessoa
      await onSave(form);
      toast({
        title: "Sucesso",
        description: isEditing
          ? "Pessoa atualizada."
          : "Pessoa criada com sucesso.",
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      submittedRef.current = false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header do Modal */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {pessoaAtual ? "Editar Pessoa" : "Adicionar Nova Pessoa"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full hover:bg-gray-200 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo / Função
              </label>
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5"
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
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 resize-none"
            />
          </div>

          {/* Upload de imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handlePickFile}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white font-medium hover:opacity-90"
              >
                <ImageIcon className="w-4 h-4" />
                {selectedFile ? "Alterar Imagem" : "Selecionar Imagem"}
              </button>

              {previewUrl ? (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  {/* mostra preview local (object URL) ou url retornada */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center text-gray-400">
                  <User className="w-6 h-6" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Envie uma imagem para a pessoa (obrigatório ao criar).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white font-bold flex items-center gap-2 hover:opacity-90"
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4" />{" "}
            {pessoaAtual ? "Salvar Alterações" : "Salvar Pessoa"}
          </button>
        </div>
      </div>
    </div>
  );
}
