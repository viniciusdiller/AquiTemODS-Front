"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Edit, Newspaper, LayoutDashboard } from "lucide-react";

// Importando os componentes recém-criados
import PreviewAcoes from "@/components/admin/sustentai/PreviewAcoes";
import PreviewPessoas from "@/components/admin/sustentai/PreviewPessoas";
import ModalAcao from "@/components/admin/sustentai/ModalAcao";
import ModalHeader from "@/components/admin/sustentai/ModalHeader";
import ModalPessoa from "@/components/admin/sustentai/ModalPessoa";

// ==========================================
// DADOS INICIAIS (Mock)
// ==========================================
const initialHeader = {
  titulo: "SustentAí",
  subtitulo: "Segunda Edição",
  data: "Abril de 2025",
};

const initialAcoes = [
  {
    id: 1,
    titulo: "<Sala3></Sala3>r",
    descricao:
      "Serviços para abrir, regularizar ou expandir sua empresa com apoio técnico.",
    imagemUrl:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Saiba mais sobre a Sala",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#D7386E]",
    corFundo: "bg-pink-50/30",
    corBorda: "border-pink-100",
  },
  {
    id: 2,
    titulo: "Emprega Saquá",
    descricao:
      "Buscando emprego ou procurando funcionários? Acesse nosso portal de talentos.",
    imagemUrl: "/Cursos/vivi.png",
    linkTexto: "Acessar portal de vagas",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#3C6AB2]",
    corFundo: "bg-blue-50/30",
    corBorda: "border-blue-100",
  },
  {
    id: 3,
    titulo: "Sala Mídia",
    descricao:
      "Serviços para abrir, regularizar ou expandir sua empresa com apoio técnico.",
    imagemUrl: "/Cursos/vivi.png",
    linkTexto: "Saiba mais sobre a Sala",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#D7386E]",
    corFundo: "bg-pink-50/30",
    corBorda: "border-pink-100",
  },
  {
    id: 4,
    titulo: "Emprega Saquá",
    descricao:
      "Buscando emprego ou procurando funcionários? Acesse nosso portal de talentos.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Acessar portal de vagas",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#3C6AB2]",
    corFundo: "bg-blue-50/30",
    corBorda: "border-blue-100",
  },
  {
    id: 5,
    titulo: "Sala do Empreendedor",
    descricao:
      "Serviços para abrir, regularizar ou expandir sua empresa com apoio técnico.",
    imagemUrl:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Saiba mais sobre a Sala",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#D7386E]",
    corFundo: "bg-pink-50/30",
    corBorda: "border-pink-100",
  },
  {
    id: 4,
    titulo: "Emprega Saquá",
    descricao:
      "Buscando emprego ou procurando funcionários? Acesse nosso portal de talentos.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Acessar portal de vagas",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#3C6AB2]",
    corFundo: "bg-blue-50/30",
    corBorda: "border-blue-100",
  },
];

const initialPessoas = [
  {
    id: 1,
    nome: "Carolina Guilhon",
    cargo: "Dona da casa do Empreendedor",
    descricao: "Chefe da Laila.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    nome: "Telma Cavalcante",
    cargo: "Diretora de Cultura",
    descricao: "Referência na valorização do artesanato...",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
  },
];

export default function AdminSustentaiPage() {
  const [header, setHeader] = useState(initialHeader);
  const [acoes, setAcoes] = useState(initialAcoes);
  const [pessoas, setPessoas] = useState(initialPessoas);

  // Estados de controle dos Modais
  const [isModalHeaderOpen, setIsModalHeaderOpen] = useState(false);
  const [isModalPessoaOpen, setIsModalPessoaOpen] = useState(false);
  const [isModalAcaoOpen, setIsModalAcaoOpen] = useState(false);
  const [acaoSendoEditada, setAcaoSendoEditada] = useState<any>(null);

  // ==========================================
  // FUNÇÕES DE AÇÃO
  // ==========================================
  const handleAbrirCriarAcao = () => {
    setAcaoSendoEditada(null); // Garante que está vazio
    setIsModalAcaoOpen(true);
  };

  const handleAbrirEditarAcao = (id: number) => {
    const acaoClicada = acoes.find((acao) => acao.id === id);
    setAcaoSendoEditada(acaoClicada);
    setIsModalAcaoOpen(true);
  };

  const handleSalvarNovaAcao = (acaoSelecionada: any) => {
    // Adiciona a ação selecionada na lista que aparece na tela e fecha o modal
    // Usamos Date.now() apenas para gerar um ID único fictício caso o usuário adicione a mesma ação duas vezes
    setAcoes([...acoes, { ...acaoSelecionada, id: Date.now() }]);
    setIsModalAcaoOpen(false);
  };

  const handleDeleteAcao = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta ação da página?")) {
      setAcoes(acoes.filter((a) => a.id !== id));
    }
  };

  const handleDeletePessoa = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta pessoa?")) {
      setPessoas(pessoas.filter((p) => p.id !== id));
    }
  };

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
            {/* Componente que renderiza as ações */}
            <PreviewAcoes
              acoes={acoes}
              onAdd={handleAbrirCriarAcao}
              onEdit={handleAbrirEditarAcao}
              onDelete={handleDeleteAcao}
            />

            {/* Componente que renderiza a barra lateral */}
            <PreviewPessoas
              pessoas={pessoas}
              onAdd={() => setIsModalPessoaOpen(true)}
              onEdit={(id) => alert(`Editar pessoa ${id}`)}
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
      />
      <ModalHeader
        isOpen={isModalHeaderOpen}
        onClose={() => setIsModalHeaderOpen(false)}
      />
      <ModalPessoa
        isOpen={isModalPessoaOpen}
        onClose={() => setIsModalPessoaOpen(false)}
      />
    </div>
  );
}
