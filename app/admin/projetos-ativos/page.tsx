"use client";

import { getErrorMessage } from "@/lib/http";
import React, { useState, useEffect, useCallback } from "react";
import {
  Spin,
  message,
  Empty,
  Card,
  Row,
  Col,
  Button,
  Tabs,
  Input,
  Popconfirm,
  Grid,
  Pagination,
} from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AdminPageHeader,
  headerButtonClass,
} from "@/components/admin/AdminPageHeader";
import {
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  BarChartOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  adminGetAllProjetosGeral,
  adminToggleProjetoStatus,
  adminDeleteProjeto,
  adminExportProjetos,
} from "@/lib/api";
import AdminProjetoModal from "@/components/AdminProjetoModal";
import { Projeto } from "@/types/Interface-Projeto";
import { PrefeituraLogo } from "@/components/ui/PrefeituraLogo"; // <--- Importação adicionada

const { Search } = Input;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const PAGE_SIZE = 6;

const ProjetosAtivosPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [filteredProjetos, setFilteredProjetos] = useState<Projeto[]>([]);
  const [selectedItem, setSelectedItem] = useState<Projeto | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [exporting, setExporting] = useState(false);
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
      const data = await adminGetAllProjetosGeral(token);
      setProjetos(data);
      setFilteredProjetos(data);
    } catch (error: any) {
      message.error(getErrorMessage(error, "Falha ao buscar projetos."));
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    const filtered = projetos.filter(
      (p) =>
        p.nomeProjeto.toLowerCase().includes(lowerCaseValue) ||
        (p.prefeitura || "").toLowerCase().includes(lowerCaseValue) ||
        (p.secretaria || "").toLowerCase().includes(lowerCaseValue) ||
        String(p.projetoId).includes(lowerCaseValue),
    );
    setFilteredProjetos(filtered);
    setCurrentPage(1);
  };

  const openEditModal = (projeto: Projeto) => {
    setSelectedItem(projeto);
    setIsEditModalVisible(true);
  };

  const handleModalClose = (shouldRefresh: boolean) => {
    setIsEditModalVisible(false);
    setSelectedItem(null);
    if (shouldRefresh) fetchData();
  };

  const handleToggleStatus = async (projeto: Projeto) => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Autenticação expirada.");
      return;
    }
    setLoading(true);
    try {
      await adminToggleProjetoStatus(projeto.projetoId, !projeto.ativo, token);
      message.success(
        `Projeto ${projeto.ativo ? "desativado" : "reativado"} com sucesso!`,
      );
      fetchData();
    } catch (error: any) {
      message.error(
        getErrorMessage(error, "Falha ao alterar o status do projeto."),
      );
      setLoading(false);
    }
  };

  const handleDeleteDefinitivo = async (projetoId: number) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    setLoading(true);
    try {
      await adminDeleteProjeto(projetoId, token);
      message.success("Projeto excluído permanentemente do banco de dados!");
      fetchData();
    } catch (error: any) {
      message.error(getErrorMessage(error, "Falha ao excluir o projeto."));
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    setExporting(true);
    try {
      const blob = await adminExportProjetos(token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `projetos_AquiTemODS_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      message.success("Relatório gerado com sucesso!");
    } catch (error: any) {
      message.error("Erro ao gerar relatório. Tente novamente.");
    } finally {
      setExporting(false);
    }
  };

  const handleTabChange = () => {
    setCurrentPage(1);
  };

  const ativos = filteredProjetos.filter((p) => p.ativo);
  const inativos = filteredProjetos.filter((p) => !p.ativo);

  const groupedProjetos = filteredProjetos.reduce(
    (acc, projeto) => {
      const ods = projeto.ods || "Sem Categoria";
      if (!acc[ods]) acc[ods] = [];
      acc[ods].push(projeto);
      return acc;
    },
    {} as { [key: string]: Projeto[] },
  );

  const sortedCategories = Object.keys(groupedProjetos).sort((a, b) => {
    const aNum = parseInt(a.split(" ")[1]);
    const bNum = parseInt(b.split(" ")[1]);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return a.localeCompare(b);
  });

  const tabPosition = screens.md ? "left" : "top";

  const renderProjetosGrid = (lista: Projeto[]) => {
    const totalCount = lista.length;
    const projetosToShow = lista.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE,
    );

    if (totalCount === 0) {
      return <Empty description="Nenhum projeto encontrado nesta aba." />;
    }

    return (
      <>
        <Row gutter={[16, 16]}>
          {projetosToShow.map((projeto) => (
            <Col xs={24} md={12} lg={8} key={projeto.projetoId}>
              <Card
                className={`h-full overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                  projeto.ativo
                    ? "border-gray-100 hover:border-primary/30"
                    : "border-gray-200 bg-gray-50"
                }`}
                styles={{ body: { padding: 0 } }}
              >
                <div className={`p-5 ${!projeto.ativo ? "opacity-70" : ""}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                      <PrefeituraLogo
                        nomePrefeitura={projeto.prefeitura || ""}
                        tipo="p"
                        className="h-full w-full object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={`m-0 text-base font-semibold leading-snug ${
                            projeto.ativo
                              ? "text-gray-900"
                              : "text-gray-500 line-through"
                          }`}
                        >
                          {projeto.nomeProjeto}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            projeto.ativo
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {projeto.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        ID #{projeto.projetoId}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-4 space-y-1.5 text-sm">
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-medium text-gray-500">
                        Prefeitura
                      </dt>
                      <dd className="m-0 text-gray-800">
                        {projeto.prefeitura}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="shrink-0 font-medium text-gray-500">
                        Secretaria
                      </dt>
                      <dd className="m-0 text-gray-800">
                        {projeto.secretaria}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-3 py-2">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => openEditModal(projeto)}
                    className="!font-medium !text-primary hover:!bg-primary/10"
                  >
                    Editar
                  </Button>
                  <Popconfirm
                    title={
                      projeto.ativo ? "Desativar Projeto" : "Reativar Projeto"
                    }
                    description={
                      projeto.ativo
                        ? "Ocultar este projeto do site público?"
                        : "Voltar a exibir este projeto no site público?"
                    }
                    onConfirm={() => handleToggleStatus(projeto)}
                    okText="Sim"
                    cancelText="Não"
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={
                        projeto.ativo ? (
                          <StopOutlined />
                        ) : (
                          <CheckCircleOutlined />
                        )
                      }
                      className={
                        projeto.ativo
                          ? "!text-orange-500 hover:!bg-orange-50"
                          : "!text-green-600 hover:!bg-green-50"
                      }
                    >
                      {projeto.ativo ? "Desativar" : "Reativar"}
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    title="Excluir do Banco de Dados"
                    description="ATENÇÃO: Deseja apagar definitivamente? Isso não pode ser desfeito."
                    onConfirm={() => handleDeleteDefinitivo(projeto.projetoId)}
                    okText="Sim, Apagar BD"
                    cancelText="Não"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                    >
                      Excluir BD
                    </Button>
                  </Popconfirm>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {totalCount > PAGE_SIZE && (
          <div className="mt-6 text-center">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={totalCount}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPageHeader
          title="Gerenciar Projetos"
          subtitle="Edite, oculte do site público ou exclua os projetos cadastrados."
          backHref="/admin/dashboard"
          backLabel="Voltar ao Dashboard"
          actions={
            <>
              <Link href="/admin/indicadores" className={headerButtonClass}>
                <BarChartOutlined />
                Ver Indicadores
              </Link>
              <button
                type="button"
                onClick={handleExport}
                disabled={exporting}
                className={headerButtonClass}
              >
                <DownloadOutlined />
                {exporting ? "Gerando..." : "Exportar CSV"}
              </button>
            </>
          }
          stats={[
            { label: "Projetos", value: projetos.length },
            { label: "Ativos", value: projetos.filter((p) => p.ativo).length },
            {
              label: "Inativos",
              value: projetos.filter((p) => !p.ativo).length,
            },
            { label: "Resultados", value: filteredProjetos.length },
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
            <Empty description="Nenhum projeto encontrado com este filtro." />
          ) : (
            <Tabs
              defaultActiveKey="geral"
              tabPosition={tabPosition}
              onChange={handleTabChange}
            >
              <TabPane
                tab={
                  <span className="font-semibold text-gray-700">
                    Geral ({filteredProjetos.length})
                  </span>
                }
                key="geral"
              >
                {renderProjetosGrid(filteredProjetos)}
              </TabPane>

              <TabPane
                tab={
                  <span className="font-semibold text-green-600">
                    Ativos ({ativos.length})
                  </span>
                }
                key="ativos"
              >
                {renderProjetosGrid(ativos)}
              </TabPane>

              <TabPane
                tab={
                  <span className="font-semibold text-red-500">
                    Inativos ({inativos.length})
                  </span>
                }
                key="inativos"
              >
                {renderProjetosGrid(inativos)}
              </TabPane>

              {sortedCategories.map((ods) => {
                const odsList = groupedProjetos[ods];
                return (
                  <TabPane tab={`${ods} (${odsList.length})`} key={ods}>
                    {renderProjetosGrid(odsList)}
                  </TabPane>
                );
              })}
            </Tabs>
          )}
        </Spin>

        <AdminProjetoModal
          projeto={selectedItem}
          visible={isEditModalVisible}
          onClose={handleModalClose}
          mode="edit-only"
          onEditAndApprove={async () => {}}
        />
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

export default ProjetosAtivosPage;
