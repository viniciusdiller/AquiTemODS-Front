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
} from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { getAllActiveProjetos } from "@/lib/api";
import AdminProjetoModal from "@/components/AdminProjetoModal";

import { Projeto } from "@/types/Interface-Projeto";

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  const router = useRouter();

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
  };

  const openEditModal = (projeto: Projeto) => {
    setSelectedItem(projeto);
    setIsEditModalVisible(true);
  };

  const handleModalClose = (shouldRefresh: boolean) => {
    setIsEditModalVisible(false);
    setSelectedItem(null);
    if (shouldRefresh) {
      fetchData(); // Recarrega os dados se uma edição foi salva
    }
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

  return (
    <div className="p-8">
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
        onChange={(e) => handleSearch(e.target.value)} // Busca em tempo real
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
            tabPosition="left"
          >
            {sortedCategories.map((ods) => (
              <TabPane
                tab={`${ods} (${groupedProjetos[ods].length})`}
                key={ods}
              >
                <Row gutter={[16, 16]}>
                  {groupedProjetos[ods].map((projeto) => (
                    <Col xs={24} md={12} lg={8} key={projeto.projetoId}>
                      <Card
                        hoverable
                        actions={[
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => openEditModal(projeto)}
                          >
                            Editar
                          </Button>,
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
                              <Text>Prefeitura: {projeto.prefeitura}</Text>
                              <Text>Secretaria: {projeto.secretaria}</Text>
                            </>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>
            ))}
          </Tabs>
        )}
      </Spin>

      {/* O MESMO MODAL, mas em modo "edit-only" */}
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
