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
  Pagination, // 1. Mantemos a paginação
} from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftOutlined,
  CommentOutlined, // 2. Trocamos os ícones de Edit/Delete por este
} from "@ant-design/icons";
import {
  getAllActiveProjetos,
  // Não precisamos de 'adminUpdateProjeto' ou 'adminDeleteProjeto' aqui
} from "@/lib/api";
// Não precisamos do AdminProjetoModal
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

// 3. Renomeamos o componente
const AdminComentariosPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [filteredProjetos, setFilteredProjetos] = useState<Projeto[]>([]);
  // Não precisamos de 'selectedItem' ou 'isEditModalVisible'
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

  // Lógica de busca (idêntica)
  const handleSearch = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    const filtered = projetos.filter(
      (p) =>
        p.nomeProjeto.toLowerCase().includes(lowerCaseValue) ||
        p.prefeitura.toLowerCase().includes(lowerCaseValue) ||
        (p.secretaria && p.secretaria.toLowerCase().includes(lowerCaseValue)) // Adicionamos verificação se secretaria existe
    );
    setFilteredProjetos(filtered);
    setCurrentPage(1);
  };

  // 4. Removemos as funções de Modal e Delete
  // (openEditModal, handleModalClose, handleDelete)

  // Lógica de troca de aba (idêntica)
  const handleTabChange = () => {
    setCurrentPage(1);
  };

  // Lógica de agrupar projetos (idêntica)
  const groupedProjetos = filteredProjetos.reduce((acc, projeto) => {
    // 5. Garantimos que 'ods' existe, ou vai para 'Sem Categoria'
    const odsKey = projeto.ods || "Sem Categoria";
    const ods = odsKey.startsWith("ODS") ? odsKey : `ODS ${odsKey}`;

    if (ods === "ODS Sem Categoria") {
      if (!acc["Sem Categoria"]) acc["Sem Categoria"] = [];
      acc["Sem Categoria"].push(projeto);
    } else {
      if (!acc[ods]) acc[ods] = [];
      acc[ods].push(projeto);
    }
    return acc;
  }, {} as { [key: string]: Projeto[] });

  // Lógica de ordenar categorias (idêntica)
  const sortedCategories = Object.keys(groupedProjetos).sort((a, b) => {
    if (a === "Sem Categoria") return 1; // Joga "Sem Categoria" para o final
    if (b === "Sem Categoria") return -1;
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

      {/* 6. Título da página atualizado */}
      <Title level={2} className="mb-6">
        Gerenciar Comentários por Projeto ({filteredProjetos.length})
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
            // 7. Definimos a aba ativa padrão para a primeira da lista
            defaultActiveKey={sortedCategories[0]}
            tabPosition={tabPosition}
            onChange={handleTabChange}
          >
            {sortedCategories.map((ods) => {
              // Lógica de paginação por aba (idêntica)
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
                            // --- 8. AÇÕES DO CARD ATUALIZADAS ---
                            actions={[
                              <Link
                                href={`/admin/comentarios/${projeto.projetoId}`}
                                passHref
                                key="comentarios"
                              >
                                <Button
                                  type="text"
                                  icon={<CommentOutlined />}
                                  // Usamos a mesma classe de hover do seu botão de editar
                                  className="hover:!bg-blue-500 hover:!text-white"
                                >
                                  Ver Comentários
                                </Button>
                              </Link>,
                            ]}
                            // --- FIM DAS AÇÕES ---
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
                                  <Text>Prefeitura: {projeto.prefeitura}</Text>
                                  <br />
                                  <Text>
                                    Secretaria: {projeto.secretaria || "N/A"}
                                  </Text>
                                </>
                              }
                            />
                          </Card>
                        </Col>
                      )
                    )}
                  </Row>

                  {/* Lógica de paginação (idêntica) */}
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

      {/* 9. Removemos o Modal de Edição */}
    </div>
  );
};

export default AdminComentariosPage;
