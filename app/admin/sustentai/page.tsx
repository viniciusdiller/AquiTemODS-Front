"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Edit, Newspaper, LayoutDashboard, Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

export default function AdminSustentaiPage() {
  const { toast } = useToast();
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
        // Faz chamadas individualmente para lidar melhor com 404/erros de servidor
        try {
          const dadosHeader = await getHeaderSustentai();
          setHeader(dadosHeader);
        } catch (err) {
          console.warn("Falha ao buscar header SustentAí:", err);
          toast({
            title: "Backend não respondeu (header)",
            description:
              "Não foi possível carregar o cabeçalho. Verifique se o servidor backend está rodando e se NEXT_PUBLIC_API_URL está correto.",
            variant: "destructive",
          });
        }

        try {
          const dadosAcoes = await getAcoesSustentai();
          // Normaliza nomes de campo para garantir compatibilidade com o preview
          const mappedAcoes = Array.isArray(dadosAcoes)
            ? dadosAcoes.map((a: any) => ({
                ...a,
                imagemUrl: a.imagemUrl || a.imagem || a.imagem_url || "",
              }))
            : [];
          setAcoes(mappedAcoes);
        } catch (err) {
          console.warn("Falha ao buscar ações SustentAí:", err);
          toast({
            title: "Backend não respondeu (ações)",
            description: "Não foi possível carregar as ações. Verifique o backend.",
            variant: "destructive",
          });
        }

        try {
          const dadosPessoas = await getPessoasSustentai();
          const mappedPessoas = Array.isArray(dadosPessoas)
            ? dadosPessoas.map((p: any) => ({
                ...p,
                imagemUrl: p.imagemUrl || p.imagem || p.imagem_url || "",
              }))
            : [];
          setPessoas(mappedPessoas);
        } catch (err) {
          console.warn("Falha ao buscar pessoas SustentAí:", err);
          toast({
            title: "Backend não respondeu (pessoas)",
            description: "Não foi possível carregar as pessoas. Verifique o backend.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do admin:", error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarPainel();
  }, []);

  // 2. FUNÇÃO: SALVAR OU EDITAR AÇÃO
  const savingRef = useRef(false);

  const handleSalvarAcao = async (dadosDaAcao: any) => {
    if (savingRef.current) {
      console.warn("handleSalvarAcao: já existe uma solicitação em andamento — ignorando");
      return null;
    }
    savingRef.current = true;
    // Se o Modal já realizou a requisição e nos passou o objeto criado/atualizado,
    // ele virá com um `id` — então apenas atualizamos o estado local sem chamar a API.
    try {
      if (!dadosDaAcao) return;

      if (dadosDaAcao.id) {
        const resultado = dadosDaAcao;
        if (acaoSendoEditada) {
          setAcoes(acoes.map((a) => (a.id === resultado.id ? resultado : a)));
        } else {
          setAcoes([...acoes, resultado]);
        }
        setIsModalAcaoOpen(false);
        savingRef.current = false;
        return resultado;
      }

      // Caso o Modal apenas nos envie os dados (payload) e não tenha feito a chamada,
      // seguimos com o fluxo antigo: chamamos a API aqui.
      if (!token) {
        toast({ title: "Sessão expirada", description: "Faça login novamente.", variant: "destructive" });
        savingRef.current = false;
        return null;
      }

      let resultado: any = null;
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
        resultado = acaoAtualizada;
      } else {
        // Chama a API de Criação (POST)
        const novaAcao = await adminCreateAcao(dadosDaAcao, token);
        // Adiciona a nova ação no final da lista
        setAcoes([...acoes, novaAcao]);
        resultado = novaAcao;
      }
      setIsModalAcaoOpen(false); // Fecha o modal
      savingRef.current = false;
      return resultado;
    } catch (error) {
      console.error('Erro ao salvar a ação:', error);
      toast({ title: "Erro", description: "Erro ao salvar a ação no servidor.", variant: "destructive" });
      savingRef.current = false;
      return null;
    }
  };

  // 3. FUNÇÃO: EXCLUIR AÇÃO
  const handleDeleteAcao = async (id: number) => {
    if (!token) {
      toast({ title: "Sessão expirada", description: "Faça login novamente.", variant: "destructive" });
      return;
    }
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
        toast({ title: "Erro", description: "Erro ao excluir.", variant: "destructive" });
      }
    }
  };

  const handleSalvarPessoa = async (dados: any) => {
    if (!token) {
      toast({ title: "Sessão expirada", description: "Faça login novamente.", variant: "destructive" });
      return;
    }
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
      toast({ title: "Erro", description: "Erro ao salvar pessoa.", variant: "destructive" });
    }
  };

  const handleDeletePessoa = async (id: number) => {
    if (!token) {
      toast({ title: "Sessão expirada", description: "Faça login novamente.", variant: "destructive" });
      return;
    }
    if (confirm("Deseja excluir este membro da equipe?")) {
      try {
        await adminDeletePessoa(id, token); // DELETE
        setPessoas(pessoas.filter((p) => p.id !== id));
      } catch (error) {
        toast({ title: "Erro", description: "Erro ao excluir.", variant: "destructive" });
      }
    }
  };

  const handleSalvarHeader = async (dados: any) => {
    if (!token) {
      toast({ title: "Sessão expirada", description: "Faça login novamente.", variant: "destructive" });
      return;
    }

    try {
      const headerAtualizado = await adminUpdateHeader(dados, token);

      setHeader(headerAtualizado);
      setIsModalHeaderOpen(false);
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao atualizar o cabeçalho. Tente novamente.", variant: "destructive" });
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <LayoutDashboard className="w-4 h-4" />{" "}
              <span>Admin / SustentAí</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gerenciar Página SustentAí
            </h1>
          </div>
          <Link
            href="/admin/sustentai/newsletter"
            className="bg-[#3C6AB2] hover:bg-[#2e528a] text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 shadow-sm"
          >
            <Newspaper className="w-5 h-5" /> Gerenciar Newsletters em PDF
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
