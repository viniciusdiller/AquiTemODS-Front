"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Spin,
  Typography,
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
  ArrowLeftOutlined,
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

const { Title, Text } = Typography;
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
      message.error(error.message || "Falha ao buscar projetos.");
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
      message.error(error.message || "Falha ao alterar o status do projeto.");
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
      message.error(error.message || "Falha ao excluir o projeto.");
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
                hoverable
                className={
                  !projeto.ativo
                    ? "grayscale opacity-80 bg-gray-50 border-gray-300"
                    : ""
                }
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => openEditModal(projeto)}
                    className="hover:!bg-blue-500 hover:!text-white text-blue-500"
                  >
                    Editar
                  </Button>,
                  <Popconfirm
                    key="toggle"
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
                      icon={
                        projeto.ativo ? (
                          <StopOutlined />
                        ) : (
                          <CheckCircleOutlined />
                        )
                      }
                      className={
                        projeto.ativo
                          ? "hover:!bg-orange-500 hover:!text-white text-orange-500"
                          : "hover:!bg-green-500 hover:!text-white text-green-600"
                      }
                    >
                      {projeto.ativo ? "Desativar" : "Reativar"}
                    </Button>
                  </Popconfirm>,
                  <Popconfirm
                    key="delete"
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
                      icon={<DeleteOutlined />}
                      className="hover:!bg-red-500 hover:!text-white"
                    >
                      Excluir BD
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  // --- AQUI ESTÁ A INTEGRAÇÃO COM O PrefeituraLogo ---
                  avatar={
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 overflow-hidden shrink-0">
                      <PrefeituraLogo
                        nomePrefeitura={projeto.prefeitura || ""}
                        tipo="p"
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  }
                  title={
                    <span className="flex items-center gap-2">
                      <span
                        className={
                          !projeto.ativo ? "line-through text-gray-500" : ""
                        }
                      >
                        {projeto.nomeProjeto}
                      </span>
                      {!projeto.ativo && (
                        <span className="text-red-500 text-xs font-normal border border-red-500 rounded px-1">
                          Inativo
                        </span>
                      )}
                    </span>
                  }
                  description={
                    <>
                      <Text>
                        <strong>ID do Projeto:</strong> {projeto.projetoId}
                      </Text>
                      <br />
                      <Text>
                        <strong>Prefeitura:</strong> {projeto.prefeitura}
                      </Text>
                      <br />
                      <Text>
                        <strong>Secretaria:</strong> {projeto.secretaria}
                      </Text>
                    </>
                  }
                />
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
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <Link href="/admin/dashboard" passHref>
          <Button icon={<ArrowLeftOutlined />} type="text">
            Voltar ao Dashboard
          </Button>
        </Link>

        <div className="flex gap-3 flex-wrap">
          <Link href="/admin/indicadores" passHref>
            <Button
              type="primary"
              icon={<BarChartOutlined />}
              className="bg-[#D7386E] hover:!bg-[#b32e5a] border-[#D7386E] hover:!border-[#2e5491] text-white"
            >
              Ver Indicadores
            </Button>
          </Link>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={exporting}
            className="bg-green-600 hover:!bg-green-700 border-green-600 hover:!border-green-700"
          >
            Exportar CSV
          </Button>
        </div>
      </div>

      <Title level={2} className="mb-6">
        Gerenciar Projetos ({filteredProjetos.length})
      </Title>

      <Search
        placeholder="Buscar por ID, nome, prefeitura ou secretaria..."
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        enterButton
        size="large"
        className="mb-6"
      />

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
  );
};

export default ProjetosAtivosPage;
