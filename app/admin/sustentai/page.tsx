"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Edit,
  Newspaper,
  LayoutDashboard,
  Loader2,
  ArrowLeft,
  BarChart2,
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
import { useToast } from "@/hooks/use-toast";
import { Modal } from "antd";

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

  const isMobile =
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 640px)").matches
      : false;

  useEffect(() => {
    const carregarPainel = async () => {
      try {
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
          const mappedAcoes = Array.isArray(dadosAcoes)
            ? dadosAcoes.map((a: any) => ({
                ...a,
                imagemUrl: a.imagemUrl || a.imagem || a.imagem_url || "",
              }))
            : [];
          setAcoes(mappedAcoes);
        } catch (err) {
          console.warn("Falha ao buscar ações (conteúdo) do SustentAí:", err);
          toast({
            title: "Backend não respondeu (ações)",
            description:
              "Não foi possível carregar as ações (conteúdo). Verifique o backend.",
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
            description:
              "Não foi possível carregar as pessoas. Verifique o backend.",
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

  const savingRef = useRef(false);

  const handleSalvarAcao = async (dadosDaAcao: any) => {
    if (savingRef.current) {
      console.warn(
        "handleSalvarAcao: já existe uma solicitação em andamento — ignorando",
      );
      return null;
    }
    savingRef.current = true;
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

      if (!token) {
        toast({
          title: "Sessão expirada",
          description: "Faça login novamente.",
          variant: "destructive",
        });
        savingRef.current = false;
        return null;
      }

      let resultado: any = null;
      if (acaoSendoEditada) {
        const acaoAtualizada = await adminUpdateAcao(
          acaoSendoEditada.id,
          dadosDaAcao,
          token,
        );
        setAcoes(
          acoes.map((a) => (a.id === acaoAtualizada.id ? acaoAtualizada : a)),
        );
        resultado = acaoAtualizada;
      } else {
        const novaAcao = await adminCreateAcao(dadosDaAcao, token);
        setAcoes([...acoes, novaAcao]);
        resultado = novaAcao;
      }
      setIsModalAcaoOpen(false);
      savingRef.current = false;
      return resultado;
    } catch (error) {
      console.error("Erro ao salvar a ação:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a ação no servidor.",
        variant: "destructive",
      });
      savingRef.current = false;
      return null;
    }
  };

  const handleDeleteAcao = async (id: number) => {
    if (!token) {
      toast({
        title: "Sessão expirada",
        description: "Faça login novamente.",
        variant: "destructive",
      });
      return;
    }
    if (isMobile) {
      const t = toast({
        title: "Confirmar exclusão",
        description: (
          <div>
            <div>
              Tem certeza que deseja excluir esta ação do banco de dados? Esta
              ação é irreversível.
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    await adminDeleteAcao(id, token);
                    setAcoes((prev) => prev.filter((a) => a.id !== id));
                    try {
                      t.dismiss();
                    } catch (err) {}
                    toast({
                      title: "Removido",
                      description: "Ação excluída com sucesso.",
                    });
                  } catch (error) {
                    try {
                      t.dismiss();
                    } catch (err) {}
                    toast({
                      title: "Erro",
                      description: "Erro ao excluir.",
                      variant: "destructive",
                    });
                  }
                }}
                className="px-3 py-1 rounded bg-red-600 text-white text-sm"
              >
                Excluir
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  try {
                    t.dismiss();
                  } catch (err) {}
                }}
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        ),
      });
      return;
    }

    Modal.confirm({
      title: "Confirmar exclusão",
      content:
        "Tem certeza que deseja excluir esta ação do banco de dados? Esta ação é irreversível.",
      okText: "Excluir",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          await adminDeleteAcao(id, token);
          setAcoes((prev) => prev.filter((a) => a.id !== id));
          toast({
            title: "Removido",
            description: "Ação excluída com sucesso.",
          });
        } catch (error) {
          toast({
            title: "Erro",
            description: "Erro ao excluir.",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleSalvarPessoa = async (dados: any) => {
    if (!token) {
      toast({
        title: "Sessão expirada",
        description: "Faça login novamente.",
        variant: "destructive",
      });
      return;
    }
    try {
      if (pessoaSendoEditada) {
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
        const novaPessoa = await adminCreatePessoa(dados, token);
        setPessoas([...pessoas, novaPessoa]);
      }
      setIsModalPessoaOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar pessoa.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePessoa = async (id: number) => {
    if (!token) {
      toast({
        title: "Sessão expirada",
        description: "Faça login novamente.",
        variant: "destructive",
      });
      return;
    }
    if (isMobile) {
      const t = toast({
        title: "Confirmar exclusão",
        description: (
          <div>
            <div>
              Deseja excluir este membro da equipe? Esta ação é irreversível.
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    await adminDeletePessoa(id, token);
                    setPessoas((prev) => prev.filter((p) => p.id !== id));
                    try {
                      t.dismiss();
                    } catch (err) {}
                    toast({
                      title: "Removido",
                      description: "Membro excluído com sucesso.",
                    });
                  } catch (error) {
                    try {
                      t.dismiss();
                    } catch (err) {}
                    toast({
                      title: "Erro",
                      description: "Erro ao excluir.",
                      variant: "destructive",
                    });
                  }
                }}
                className="px-3 py-1 rounded bg-red-600 text-white text-sm"
              >
                Excluir
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  try {
                    t.dismiss();
                  } catch (err) {}
                }}
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        ),
      });
      return;
    }

    Modal.confirm({
      title: "Confirmar exclusão",
      content:
        "Deseja excluir este membro da equipe? Esta ação é irreversível.",
      okText: "Excluir",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          await adminDeletePessoa(id, token);
          setPessoas((prev) => prev.filter((p) => p.id !== id));
          toast({
            title: "Removido",
            description: "Membro excluído com sucesso.",
          });
        } catch (error) {
          toast({
            title: "Erro",
            description: "Erro ao excluir.",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleSalvarHeader = async (dados: any) => {
    if (!token) {
      toast({
        title: "Sessão expirada",
        description: "Faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    try {
      const headerAtualizado = await adminUpdateHeader(dados, token);

      setHeader(headerAtualizado);
      setIsModalHeaderOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar o cabeçalho. Tente novamente.",
        variant: "destructive",
      });
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

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/admin/sustentai/newsletter"
              className="w-full md:w-auto bg-gradient-to-r from-[#3C6AB2] to-[#2e528a] hover:opacity-90 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Newspaper className="w-5 h-5" /> Gerenciar Newsletters
            </Link>

            <Link
              href="/admin/sustentai/indicadores"
              className="w-full md:w-auto bg-gradient-to-r from-[#1D6F42] to-[#15803d] hover:opacity-90 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-all duration-300 transform hover:scale-[1.02]"
            >
              <BarChart2 className="w-5 h-5" /> Indicadores SustentAí
            </Link>
          </div>
        </div>

        {/* ÁREA DE PREVIEW */}
        <section className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="relative group">
            <div className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] p-8 text-white text-center transition-opacity duration-300 group-hover:opacity-90">
              <p className="uppercase tracking-widest text-sm font-semibold mb-2 opacity-90">
                Prefeitura de Saquarema
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                {header?.titulo}
              </h2>
              <p className="text-lg opacity-90">
                {header?.subtitulo} - {header?.data}
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
