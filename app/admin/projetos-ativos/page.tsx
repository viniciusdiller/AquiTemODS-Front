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
  Avatar,
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
} from "@ant-design/icons";
import {
  getAllActiveProjetos,
  adminUpdateProjeto, // Esta função não está sendo usada neste arquivo, mas mantida
  adminDeleteProjeto,
  adminExportProjetos,
} from "@/lib/api";
import AdminProjetoModal from "@/components/AdminProjetoModal";
import { Projeto } from "@/types/Interface-Projeto";

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PAGE_SIZE = 6;

const getFullImageUrl = (path: string): string => {
  if (!path) return "";
  const normalizedPath = path.replace(/\\/g, "/");
  const cleanPath = normalizedPath.startsWith("/")
    ? normalizedPath.substring(1)
    : normalizedPath;
  return `${API_URL}/${cleanPath}`;
};

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
      const data = await getAllActiveProjetos(token);
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

  // --- ALTERAÇÃO 1: ATUALIZADO handleSearch PARA INCLUIR ID ---
  const handleSearch = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    const filtered = projetos.filter(
      (p) =>
        p.nomeProjeto.toLowerCase().includes(lowerCaseValue) ||
        p.prefeitura.toLowerCase().includes(lowerCaseValue) ||
        p.secretaria.toLowerCase().includes(lowerCaseValue) ||
        String(p.projetoId).includes(lowerCaseValue)
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
    if (shouldRefresh) {
      fetchData();
    }
  };

  const handleDelete = async (projetoId: number) => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Autenticação expirada.");
      return;
    }

    setLoading(true);
    try {
      await adminDeleteProjeto(projetoId, token);
      message.success("Projeto excluído com sucesso!");
      fetchData();
    } catch (error: any) {
      message.error(error.message || "Falha ao excluir o projeto.");
      setLoading(false);
    }
  };

  // --- NOVA FUNÇÃO: EXPORTAR PROJETOS ---
  const handleExport = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Sessão expirada.");
      return;
    }

    setExporting(true);
    try {
      const blob = await adminExportProjetos(token);

      // Cria um link temporário para forçar o download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `projetos_AquiTemODS${
        new Date().toISOString().split("T")[0]
      }.csv`; // Nome do arquivo com data
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      message.success("Relatório gerado com sucesso!");
    } catch (error: any) {
      console.error(error);
      message.error("Erro ao gerar relatório. Tente novamente.");
    } finally {
      setExporting(false);
    }
  };

  const handleTabChange = () => {
    setCurrentPage(1);
  };

  // Agrupa os projetos por ODS (para as abas de categoria)
  const groupedProjetos = filteredProjetos.reduce((acc, projeto) => {
    const ods = projeto.ods || "Sem Categoria";
    if (!acc[ods]) {
      acc[ods] = [];
    }
    acc[ods].push(projeto);
    return acc;
  }, {} as { [key: string]: Projeto[] });

  // Ordena as categorias
  const sortedCategories = Object.keys(groupedProjetos).sort((a, b) => {
    const aNum = parseInt(a.split(" ")[1]);
    const bNum = parseInt(b.split(" ")[1]);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return a.localeCompare(b);
  });

  const tabPosition = screens.md ? "left" : "top";

  const totalTodos = filteredProjetos.length;
  const paginatedTodos = filteredProjetos.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="p-4 md:p-8">
      {/* Cabeçalho com Botão Voltar e Botão Exportar */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <Link href="/admin/dashboard" passHref>
          <Button icon={<ArrowLeftOutlined />} type="text">
            Voltar ao Dashboard
          </Button>
        </Link>

        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExport}
          loading={exporting}
          className="bg-green-600 hover:!bg-green-700 border-green-600 hover:!border-green-700"
        >
          Exportar Planilha (CSV)
        </Button>
      </div>

      <Title level={2} className="mb-6">
        Gerenciar Projetos Ativos ({projetos.length})
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
          <Empty description="Nenhum projeto ativo encontrado." />
        ) : (
          <Tabs
            defaultActiveKey="todos"
            tabPosition={tabPosition}
            onChange={handleTabChange}
          >
            <TabPane tab={`Todos os Projetos (${totalTodos})`} key="todos">
              <Row gutter={[16, 16]}>
                {paginatedTodos.map((projeto) => (
                  <Col xs={24} md={12} lg={8} key={projeto.projetoId}>
                    <Card
                      hoverable
                      actions={[
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => openEditModal(projeto)}
                          className="hover:!bg-blue-500 hover:!text-white"
                        >
                          Editar
                        </Button>,
                        <Popconfirm
                          key="delete"
                          title="Excluir Projeto"
                          description="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
                          onConfirm={() => handleDelete(projeto.projetoId)}
                          okText="Sim, Excluir"
                          cancelText="Não"
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            className="hover:!bg-red-500 hover:!text-white"
                          >
                            Excluir
                          </Button>
                        </Popconfirm>,
                      ]}
                    >
                      <Card.Meta
                        avatar={
                          <Avatar
                            src={getFullImageUrl(projeto.logoUrl || "")}
                          />
                        }
                        title={projeto.nomeProjeto}
                        description={
                          <>
                            <Text>
                              <strong>ID do Projeto:</strong>{" "}
                              {projeto.projetoId}
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

              {totalTodos > PAGE_SIZE && (
                <div className="mt-6 text-center">
                  <Pagination
                    current={currentPage}
                    pageSize={PAGE_SIZE}
                    total={totalTodos}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </TabPane>

            {sortedCategories.map((ods) => {
              const allProjetosForOds = groupedProjetos[ods];
              const totalCount = allProjetosForOds.length;
              const projetosToShow = allProjetosForOds.slice(
                (currentPage - 1) * PAGE_SIZE,
                currentPage * PAGE_SIZE
              );

              return (
                <TabPane tab={`${ods} (${allProjetosForOds.length})`} key={ods}>
                  <Row gutter={[16, 16]}>
                    {projetosToShow.map((projeto) => (
                      <Col xs={24} md={12} lg={8} key={projeto.projetoId}>
                        <Card
                          hoverable
                          actions={[
                            <Button
                              type="text"
                              icon={<EditOutlined />}
                              onClick={() => openEditModal(projeto)}
                              className="hover:!bg-blue-500 hover:!text-white"
                            >
                              Editar
                            </Button>,
                            <Popconfirm
                              key="delete"
                              title="Excluir Projeto"
                              description="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
                              onConfirm={() => handleDelete(projeto.projetoId)}
                              okText="Sim, Excluir"
                              cancelText="Não"
                              okButtonProps={{ danger: true }}
                            >
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                className="hover:!bg-red-500 hover:!text-white"
                              >
                                Excluir
                              </Button>
                            </Popconfirm>,
                          ]}
                        >
                          <Card.Meta
                            avatar={
                              <Avatar
                                src={getFullImageUrl(projeto.logoUrl || "")}
                              />
                            }
                            title={projeto.nomeProjeto}
                            description={
                              <>
                                <Text>
                                  <strong>ID do Projeto:</strong>{" "}
                                  {projeto.projetoId}
                                </Text>
                                <br />
                                <Text>
                                  <strong>Prefeitura:</strong>{" "}
                                  {projeto.prefeitura}
                                </Text>
                                <br />
                                <Text>
                                  <strong>Secretaria:</strong>{" "}
                                  {projeto.secretaria}
                                </Text>
                              </>
                            }
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {/* Paginação para as abas de Categoria */}
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