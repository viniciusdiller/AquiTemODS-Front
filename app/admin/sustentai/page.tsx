"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Edit,
  Newspaper,
  LayoutDashboard,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import PreviewAcoes from "@/components/admin/sustentai/PreviewAcoes";
import PreviewPessoas from "@/components/admin/sustentai/PreviewPessoas";
import ModalAcao from "@/components/admin/sustentai/ModalAcao";
import ModalHeader from "@/components/admin/sustentai/ModalHeader";
import ModalPessoa from "@/components/admin/sustentai/ModalPessoa";
import {
  getAcoesSustentai,
  getPessoasSustentai,
  getHeaderSustentai,
  adminCreateAcao,
  adminUpdateAcao,
  adminDeleteAcao,
  adminCreatePessoa,
  adminUpdatePessoa,
  adminDeletePessoa,
  adminUpdateHeader,
} from "@/lib/api";

export default function AdminSustentaiPage() {
  const [header, setHeader] = useState({ titulo: "", subtitulo: "", data: "" });
  const [acoes, setAcoes] = useState<any[]>([]);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- ESTADOS DOS MODAIS ---
  const [isModalAcaoOpen, setIsModalAcaoOpen] = useState(false);
  const [acaoSendoEditada, setAcaoSendoEditada] = useState<any>(null);

  const [isModalPessoaOpen, setIsModalPessoaOpen] = useState(false);
  const [pessoaSendoEditada, setPessoaSendoEditada] = useState<any>(null);

  const [isModalHeaderOpen, setIsModalHeaderOpen] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 1. CARREGAR DADOS INICIAIS
  useEffect(() => {
    const carregarPainel = async () => {
      try {
        const [dadosAcoes, dadosPessoas, dadosHeader] = await Promise.all([
          getHeaderSustentai(),
          getAcoesSustentai(),
          getPessoasSustentai(),
        ]);
        setHeader(dadosHeader);
        setAcoes(dadosAcoes);
        setPessoas(dadosPessoas);
      } catch (error) {
        console.error("Erro ao carregar dados do admin:", error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarPainel();
  }, []);

  // 2. FUNÇÃO: SALVAR OU EDITAR AÇÃO
  const handleSalvarAcao = async (dadosDaAcao: any) => {
    if (!token) return alert("Sessão expirada. Faça login novamente.");

    try {
      if (acaoSendoEditada) {
        // Chama a API de Atualização (PUT)
        const acaoAtualizada = await adminUpdateAcao(
          acaoSendoEditada.id,
          dadosDaAcao,
          token,
        );
        // Atualiza a listagem na tela sem precisar dar F5
        setAcoes(
          acoes.map((a) => (a.id === acaoAtualizada.id ? acaoAtualizada : a)),
        );
      } else {
        // Chama a API de Criação (POST)
        const novaAcao = await adminCreateAcao(dadosDaAcao, token);
        // Adiciona a nova ação no final da lista
        setAcoes([...acoes, novaAcao]);
      }
      setIsModalAcaoOpen(false); // Fecha o modal
    } catch (error) {
      alert("Erro ao salvar a ação no servidor.");
    }
  };

  // 3. FUNÇÃO: EXCLUIR AÇÃO
  const handleDeleteAcao = async (id: number) => {
    if (!token) return alert("Sessão expirada. Faça login novamente.");

    if (
      confirm(
        "Tem certeza que deseja excluir esta ação do banco de dados? Esta ação é irreversível.",
      )
    ) {
      try {
        // Chama a API de Exclusão (DELETE)
        await adminDeleteAcao(id, token);
        // Remove o card da tela
        setAcoes(acoes.filter((a) => a.id !== id));
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  const handleSalvarPessoa = async (dados: any) => {
    if (!token) return alert("Sessão expirada.");
    try {
      if (pessoaSendoEditada) {
        // EDIÇÃO (PUT)
        const pessoaAtualizada = await adminUpdatePessoa(
          pessoaSendoEditada.id,
          dados,
          token,
        );
        setPessoas(
          pessoas.map((p) =>
            p.id === pessoaAtualizada.id ? pessoaAtualizada : p,
          ),
        );
      } else {
        // CRIAÇÃO (POST)
        const novaPessoa = await adminCreatePessoa(dados, token);
        setPessoas([...pessoas, novaPessoa]);
      }
      setIsModalPessoaOpen(false);
    } catch (error) {
      alert("Erro ao salvar pessoa.");
    }
  };

  const handleDeletePessoa = async (id: number) => {
    if (!token) return alert("Sessão expirada.");
    if (confirm("Deseja excluir este membro da equipe?")) {
      try {
        await adminDeletePessoa(id, token); // DELETE
        setPessoas(pessoas.filter((p) => p.id !== id));
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  const handleSalvarHeader = async (dados: any) => {
    if (!token) return alert("Sessão expirada. Faça login novamente.");

    try {
      const headerAtualizado = await adminUpdateHeader(dados, token);

      setHeader(headerAtualizado);
      setIsModalHeaderOpen(false);
    } catch (error) {
      alert("Erro ao atualizar o cabeçalho. Tente novamente.");
    }
  };

  const handleAbrirCriarAcao = () => {
    setAcaoSendoEditada(null);
    setIsModalAcaoOpen(true);
  };
  const handleAbrirEditarAcao = (id: number) => {
    setAcaoSendoEditada(acoes.find((a) => a.id === id));
    setIsModalAcaoOpen(true);
  };

  const handleAbrirCriarPessoa = () => {
    setPessoaSendoEditada(null);
    setIsModalPessoaOpen(true);
  };
  const handleAbrirEditarPessoa = (id: number) => {
    setPessoaSendoEditada(pessoas.find((p) => p.id === id));
    setIsModalPessoaOpen(true);
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="w-12 h-12 text-[#3C6AB2] animate-spin" />
        <p className="text-gray-500 font-medium">
          Carregando painel de controle...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER DO ADMIN */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-5">
            <Link
              href="/admin/dashboard"
              className="p-3.5 bg-gray-50 text-gray-500 hover:text-[#D7386E] hover:bg-pink-50 border border-gray-100 hover:border-pink-100 rounded-2xl transition-all duration-300 group shadow-sm flex-shrink-0"
              title="Voltar para o Dashboard"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </Link>

            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1 font-medium">
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin / SustentAí</span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                Gerenciar Página
              </h1>
            </div>
          </div>

          <Link
            href="/admin/sustentai/newsletter"
            className="w-full md:w-auto bg-gradient-to-r from-[#3C6AB2] to-[#2e528a] hover:opacity-90 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-all duration-300 transform hover:scale-[1.02]"
          >
            <Newspaper className="w-5 h-5" /> Gerenciar Newsletters
          </Link>
        </div>

        {/* ÁREA DE PREVIEW */}
        <section className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          {/* Cabeçalho da Newsletter */}
          <div className="relative group">
            <div className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] p-8 text-white text-center transition-opacity duration-300 group-hover:opacity-90">
              <p className="uppercase tracking-widest text-sm font-semibold mb-2 opacity-90">
                Prefeitura de Saquarema
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                {header.titulo}
              </h2>
              <p className="text-lg opacity-90">
                {header.subtitulo} - {header.data}
              </p>
            </div>
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsModalHeaderOpen(true)}
                className="bg-white text-gray-800 p-2 rounded-lg shadow-lg hover:bg-gray-100 flex items-center gap-2 font-medium"
              >
                <Edit className="w-4 h-4" /> Editar Cabeçalho
              </button>
            </div>
          </div>

          <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-20">
            <PreviewAcoes
              acoes={acoes}
              onAdd={handleAbrirCriarAcao}
              onEdit={handleAbrirEditarAcao}
              onDelete={handleDeleteAcao}
            />
            <PreviewPessoas
              pessoas={pessoas}
              onAdd={handleAbrirCriarPessoa}
              onEdit={handleAbrirEditarPessoa}
              onDelete={handleDeletePessoa}
            />
          </div>
        </section>
      </div>

      {/* RENDERIZAÇÃO DE MODAIS */}
      <ModalAcao
        isOpen={isModalAcaoOpen}
        onClose={() => setIsModalAcaoOpen(false)}
        acaoAtual={acaoSendoEditada}
        onSave={handleSalvarAcao}
      />

      <ModalPessoa
        isOpen={isModalPessoaOpen}
        onClose={() => setIsModalPessoaOpen(false)}
        pessoaAtual={pessoaSendoEditada}
        onSave={handleSalvarPessoa}
      />

      <ModalHeader
        isOpen={isModalHeaderOpen}
        onClose={() => setIsModalHeaderOpen(false)}
        headerAtual={header}
        onSave={handleSalvarHeader}
      />
    </div>
  );
}
