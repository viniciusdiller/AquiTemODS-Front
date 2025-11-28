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
  Grid,
  Pagination,
} from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftOutlined, CommentOutlined } from "@ant-design/icons";
import { getAllActiveProjetos, adminGetReviewsByProject } from "@/lib/api";
import { Projeto } from "@/types/Interface-Projeto";

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PAGE_SIZE = 6; // Mesmo Page Size

const getFullImageUrl = (path: string): string => {
  if (!path) return "";
  const normalizedPath = path.replace(/\\/g, "/");
  const cleanPath = normalizedPath.startsWith("/")
    ? normalizedPath.substring(1)
    : normalizedPath;
  return `${API_URL}/${cleanPath}`;
};

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
            token
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
            error
          );
        }
      }
      setProjetos(projetosComComentarios);
      setFilteredProjetos(projetosComComentarios);
    } catch (error: any) {
      message.error(error.message || "Falha ao buscar projetos.");
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
        String(p.projetoId).includes(lowerCaseValue)
    );
    setFilteredProjetos(filtered);
    setCurrentPage(1);
  };

  const handleTabChange = () => {
    setCurrentPage(1);
  };

  // Lógica de agrupar projetos (levemente ajustada para consistência)
  const groupedProjetos = filteredProjetos.reduce((acc, projeto) => {
    const ods = projeto.ods || "Sem Categoria";
    if (!acc[ods]) {
      acc[ods] = [];
    }
    acc[ods].push(projeto);
    return acc;
  }, {} as { [key: string]: Projeto[] });

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

  // Lógica de paginação para a aba "Todos"
  const totalTodos = filteredProjetos.length;
  const paginatedTodos = filteredProjetos.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="p-4 md:p-8">
      <Link href="/admin/dashboard" passHref>
        <Button icon={<ArrowLeftOutlined />} type="text" className="mb-4">
          Voltar ao Dashboard
        </Button>
      </Link>

      <Title level={2} className="mb-6">
        Gerenciar Comentários por Projeto ({projetos.length})
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
                        <Link
                          href={`/admin/comentarios/${projeto.projetoId}`}
                          passHref
                          key="comentarios"
                        >
                          <Button
                            type="text"
                            icon={<CommentOutlined />}
                            className="hover:!bg-blue-500 hover:!text-white"
                          >
                            Ver Comentários
                          </Button>
                        </Link>,
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
                              <strong>Secretaria:</strong>{" "}
                              {projeto.secretaria || "N/A"}
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

            {/* Abas de Categoria (lógica original) */}
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
                            <Link
                              href={`/admin/comentarios/${projeto.projetoId}`}
                              passHref
                              key="comentarios"
                            >
                              <Button
                                type="text"
                                icon={<CommentOutlined />}
                                className="hover:!bg-blue-500 hover:!text-white"
                              >
                                Ver Comentários
                              </Button>
                            </Link>,
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
                                  {projeto.secretaria || "N/A"}
                                </Text>
                              </>
                            }
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {/* Lógica de paginação por aba */}
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
    </div>
  );
};

export default AdminComentariosPage;
