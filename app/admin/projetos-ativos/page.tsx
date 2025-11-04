// app/admin/projetos-ativos/page.tsx
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
} from "@ant-design/icons";
import {
  getAllActiveProjetos,
  adminUpdateProjeto,
  adminDeleteProjeto,
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

  const handleSearch = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    const filtered = projetos.filter(
      (p) =>
        p.nomeProjeto.toLowerCase().includes(lowerCaseValue) ||
        p.prefeitura.toLowerCase().includes(lowerCaseValue) ||
        p.secretaria.toLowerCase().includes(lowerCaseValue)
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

  // 4. FUNÇÃO PARA RESETAR PÁGINA AO TROCAR DE ABA
  const handleTabChange = () => {
    setCurrentPage(1);
  };

  // Agrupa os projetos por ODS
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

  return (
    <div className="p-4 md:p-8">
      <Link href="/admin/dashboard" passHref>
        <Button icon={<ArrowLeftOutlined />} type="text" className="mb-4">
          Voltar ao Dashboard
        </Button>
      </Link>

      <Title level={2} className="mb-6">
        Gerenciar Projetos Ativos ({filteredProjetos.length})
      </Title>

      <Search
        placeholder="Buscar por nome, prefeitura ou secretaria..."
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
            defaultActiveKey="ODS 1 - Erradicação da Pobreza"
            tabPosition={tabPosition}
            onChange={handleTabChange} // 4. ADICIONADO onChange
          >
            {sortedCategories.map((ods) => {
              // 5. LÓGICA DE PAGINAÇÃO POR ABA
              const allProjetosForOds = groupedProjetos[ods];
              const totalCount = allProjetosForOds.length;
              const projetosToShow = allProjetosForOds.slice(
                (currentPage - 1) * PAGE_SIZE,
                currentPage * PAGE_SIZE
              );

              return (
                <TabPane tab={`${ods} (${allProjetosForOds.length})`} key={ods}>
                  <Row gutter={[16, 16]}>
                    {projetosToShow.map(
                      (
                        projeto // Mapeia apenas 'projetosToShow'
                      ) => (
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
                                onConfirm={() =>
                                  handleDelete(projeto.projetoId)
                                }
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
                      )
                    )}
                  </Row>

                  {/* 6. RENDERIZAR O COMPONENTE DE PAGINAÇÃO */}
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

      {/* O MESSO MODAL, mas em modo "edit-only" */}
      <AdminProjetoModal
        projeto={selectedItem}
        visible={isEditModalVisible}
        onClose={handleModalClose}
        mode="edit-only"
        // Passa uma função vazia pois o modal "edit-only" não usa
        onEditAndApprove={async () => {}}
      />
    </div>
  );
};

export default ProjetosAtivosPage;
