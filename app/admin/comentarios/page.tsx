"use client";

import { getErrorMessage } from "@/lib/http";
import React, { useState, useEffect, useCallback } from "react";
import {
  Spin,
  message,
  Empty,
  Row,
  Col,
  Tabs,
  Input,
  Grid,
  Pagination,
} from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAllActiveProjetos, adminGetReviewsByProject } from "@/lib/api";
import { Projeto } from "@/types/Interface-Projeto";
import { PrefeituraLogo } from "@/components/ui/PrefeituraLogo";

const { Search } = Input;
const { useBreakpoint } = Grid;

const PAGE_SIZE = 6; // Mesmo Page Size

const ProjetoCard: React.FC<{ projeto: Projeto }> = ({ projeto }) => (
  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
    <div className="flex-1 p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <PrefeituraLogo
            nomePrefeitura={projeto.prefeitura || ""}
            tipo="p"
            className="h-full w-full object-contain p-1"
          />
        </div>
        <div className="min-w-0">
          <h3 className="m-0 text-base font-semibold leading-snug text-gray-900">
            {projeto.nomeProjeto}
          </h3>
          <p className="mt-1 text-xs text-gray-400">ID #{projeto.projetoId}</p>
        </div>
      </div>
      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex gap-2">
          <dt className="shrink-0 font-medium text-gray-500">Prefeitura</dt>
          <dd className="m-0 text-gray-800">{projeto.prefeitura}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 font-medium text-gray-500">Secretaria</dt>
          <dd className="m-0 text-gray-800">{projeto.secretaria || "N/A"}</dd>
        </div>
      </dl>
    </div>
    <Link
      href={`/admin/comentarios/${projeto.projetoId}`}
      className="flex items-center justify-center gap-2 border-t border-gray-100 bg-gray-50/70 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
    >
      <MessageSquare className="h-4 w-4" />
      Ver Comentários
    </Link>
  </div>
);

const ProjetosGrid: React.FC<{
  lista: Projeto[];
  currentPage: number;
  onPageChange: (page: number) => void;
}> = ({ lista, currentPage, onPageChange }) => (
  <>
    <Row gutter={[16, 16]}>
      {lista
        .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
        .map((projeto) => (
          <Col xs={24} md={12} lg={8} key={projeto.projetoId}>
            <ProjetoCard projeto={projeto} />
          </Col>
        ))}
    </Row>
    {lista.length > PAGE_SIZE && (
      <div className="mt-6 text-center">
        <Pagination
          current={currentPage}
          pageSize={PAGE_SIZE}
          total={lista.length}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>
    )}
  </>
);

const AdminComentariosPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [filteredProjetos, setFilteredProjetos] = useState<Projeto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const screens = useBreakpoint();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Acesso negado.");
      router.push("/admin/login");
      return;
    }
    try {
      const allProjetos = await getAllActiveProjetos(token);

      const projetosComComentarios: Projeto[] = [];

      for (const projeto of allProjetos) {
        try {
          const response = await adminGetReviewsByProject(
            String(projeto.projetoId),
            token,
          );
          let reviewsList = [];
          if (Array.isArray(response)) {
            reviewsList = response;
          } else if (response && Array.isArray(response.data)) {
            reviewsList = response.data;
          } else if (response && Array.isArray(response.reviews)) {
            reviewsList = response.reviews;
          } else if (response && Array.isArray(response.avaliacoes)) {
            reviewsList = response.avaliacoes;
          }

          if (reviewsList.length > 0) {
            projetosComComentarios.push(projeto);
          }
        } catch (error) {
          console.error(
            `Erro ao verificar reviews do projeto ${projeto.projetoId}:`,
            error,
          );
        }
      }
      setProjetos(projetosComComentarios);
      setFilteredProjetos(projetosComComentarios);
    } catch (error: any) {
      message.error(getErrorMessage(error, "Falha ao buscar projetos."));
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Lógica de busca atualizada para incluir ID
  const handleSearch = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    const filtered = projetos.filter(
      (p) =>
        p.nomeProjeto.toLowerCase().includes(lowerCaseValue) ||
        p.prefeitura.toLowerCase().includes(lowerCaseValue) ||
        (p.secretaria && p.secretaria.toLowerCase().includes(lowerCaseValue)) ||
        String(p.projetoId).includes(lowerCaseValue),
    );
    setFilteredProjetos(filtered);
    setCurrentPage(1);
  };

  const handleTabChange = () => {
    setCurrentPage(1);
  };

  // Lógica de agrupar projetos (levemente ajustada para consistência)
  const groupedProjetos = filteredProjetos.reduce(
    (acc, projeto) => {
      const ods = projeto.ods || "Sem Categoria";
      if (!acc[ods]) {
        acc[ods] = [];
      }
      acc[ods].push(projeto);
      return acc;
    },
    {} as { [key: string]: Projeto[] },
  );

  // Lógica de ordenar categorias
  const sortedCategories = Object.keys(groupedProjetos).sort((a, b) => {
    if (a === "Sem Categoria") return 1;
    if (b === "Sem Categoria") return -1;
    const aNum = parseInt(a.split(" ")[1]);
    const bNum = parseInt(b.split(" ")[1]);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return a.localeCompare(b);
  });

  const tabPosition = screens.md ? "left" : "top";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPageHeader
          title="Gerenciar Comentários"
          subtitle="Escolha um projeto para moderar as avaliações recebidas."
          backHref="/admin/dashboard"
          backLabel="Voltar ao Dashboard"
          stats={[
            { label: "Projetos com comentários", value: projetos.length },
            { label: "Resultados", value: filteredProjetos.length },
            { label: "Categorias ODS", value: sortedCategories.length },
          ]}
        />

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <Search
            placeholder="Buscar por ID, nome, prefeitura ou secretaria..."
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            enterButton
            size="large"
            allowClear
            className="max-w-3xl custom-search"
          />
        </div>

        <Spin spinning={loading}>
          {filteredProjetos.length === 0 && !loading ? (
            <Empty description="Nenhum projeto ativo encontrado." />
          ) : (
            <Tabs
              defaultActiveKey="todos"
              tabPosition={tabPosition}
              onChange={handleTabChange}
              items={[
                {
                  key: "todos",
                  label: `Todos os Projetos (${filteredProjetos.length})`,
                  children: (
                    <ProjetosGrid
                      lista={filteredProjetos}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                    />
                  ),
                },
                ...sortedCategories.map((ods) => ({
                  key: ods,
                  label: `${ods} (${groupedProjetos[ods].length})`,
                  children: (
                    <ProjetosGrid
                      lista={groupedProjetos[ods]}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                    />
                  ),
                })),
              ]}
            />
          )}
        </Spin>
      </div>

      <style jsx global>{`
        .custom-search .ant-input-search-button {
          background: #d6386d !important;
        }
        .ant-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #d6386d !important;
        }
        .ant-tabs .ant-tabs-ink-bar {
          background: #d6386d !important;
        }
      `}</style>
    </div>
  );
};

export default AdminComentariosPage;
