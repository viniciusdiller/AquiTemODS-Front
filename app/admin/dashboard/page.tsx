"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  List,
  Modal,
  message,
  Descriptions,
  Spin,
  Empty,
  Typography,
  Image,
} from "antd";
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Text } = Typography;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Configuração de rótulos e ordem dos campos
const fieldConfig: { [key: string]: { label: string; order: number } } = {

  projetoId: { label: "ID", order: 1 },
  ODS: { label: "ODS", order: 4 },
  prefeitura: { label: "Prefeitura", order: 2 },
  nomeProjeto: { label: "Nome do Projeto", order: 10 },
  emailProjeto: { label: "Email", order: 20 },
  endereco: { label: "Endereço", order: 22 },
  descricao: { label: "Descrição", order: 30 },
  descricaoDiferencial: { label: "Diferencial", order: 31 },
  website: { label: "Website", order: 40 },
  odsRelacionadas: { label: "ODS Relacionadas", order: 50 },
  instagram: { label: "Instagram", order: 41 },
  logoUrl: { label: "Logo Atual", order: 42 },
  logo: { label: "Nova Logo", order: 42 },
  projetoImg: { label: "Portfólio Atual", order: 44 },
  projetos: { label: "Novo Portfólio", order: 44 },
  status: { label: "Status Atual", order: 5 },

  createdAt: { label: "Data de Criação", order: 100 },
  updatedAt: { label: "Última Atualização", order: 101 },
};

interface projetoImg {
  url: string;
}

interface Projeto {
  projetoID: number;
  nomeProjeto: string;
  emailProjeto: string;
  prefeitura: string;
  ods: string[];
  odsRelacionadas: string;
  descricao: string;
  descricaoDiferencial: string;
  website?: string;
  instagram?: string;
  logoUrl?: string;

  projetoImg?: projetoImg[];
  dados_atualizacao?: any;
  [key: string]: any;
}

interface PendingData {
  cadastros: Projeto[];
  atualizacoes: Projeto[];
  exclusoes: Projeto[];
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PendingData>({
    cadastros: [],
    atualizacoes: [],
    exclusoes: [],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Projeto | null>(
    null
  );
  const router = useRouter();

  const getFullImageUrl = (path: string): string => {
    if (!path) return "";
    return path.startsWith("http") || path.startsWith("https")
      ? path
      : `${API_URL}${path.startsWith("/") ? path : "/" + path}`;
  };

  const renderValue = (
    key: string,
    value: any,
    nomeFantasia: string
  ): React.ReactNode => {
    if ((key === "projetoImg" || key === "projetos") && Array.isArray(value)) {
      const imagesUrls = value
        .map((item) => (typeof item === "string" ? item : item.url))
        .map(getFullImageUrl)
        .filter(Boolean);

      if (imagesUrls.length > 0) {
        return (
          <Row gutter={[8, 8]}>
            {imagesUrls.map((imageUrl, index) => (
              <Col key={index}>
                <Image src={imageUrl} alt={`Projeto ${index + 1}`} width={80} />
              </Col>
            ))}
          </Row>
        );
      }
      return <Text type="secondary">Nenhuma imagem.</Text>;
    }

    if (
      (key === "logoUrl" || key === "logo") &&
      typeof value === "string" &&
      value
    ) {
      return (
        <Image
          src={getFullImageUrl(value)}
          alt={`Logo de ${nomeFantasia}`}
          width={150}
        />
      );
    }

    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }

    return String(value);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Acesso negado.");
      router.push("/admin/login");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/admin/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Falha ao buscar dados.");
      const pendingData = await response.json();
      setData(pendingData);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async (action: "approve" | "reject") => {
    if (!selectedItem) return;
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(
        `${API_URL}/api/admin/${action}/${selectedItem.projetoId}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      message.success(`Ação executada com sucesso!`);
      setModalVisible(false);
      fetchData();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (item: Projeto) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderList = (
    title: string,
    listData: Projeto[],
    icon: React.ReactNode
  ) => (
    <Col xs={24} md={12} lg={8}>
      <Card title={`${title} (${listData.length})`}>
        {listData.length > 0 ? (
          <List
            dataSource={listData}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="link" onClick={() => showModal(item)}>
                    Detalhes
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.nomeFantasia}
                  description={`CNPJ: ${item.cnpj}`}
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="Nenhuma solicitação" />
        )}
      </Card>
    </Col>
  );

  return (
    <div className="p-8">
      <Spin spinning={loading}>
        <h1 className="text-2xl font-bold mb-6">Painel de Administração</h1>
        <Row gutter={[16, 16]}>
          {renderList("Novos Cadastros", data.cadastros, <UserAddOutlined />)}
          {renderList("Atualizações", data.atualizacoes, <EditOutlined />)}
          {renderList("Exclusões", data.exclusoes, <DeleteOutlined />)}
        </Row>
      </Spin>

      {selectedItem && (
        <Modal
          title={`Detalhes de ${selectedItem.nomeFantasia}`}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={800}
          footer={[
            <Button
              key="reject"
              onClick={() => handleAction("reject")}
              icon={<CloseOutlined />}
              danger
            >
              Recusar
            </Button>,
            <Button
              key="confirm"
              type="primary"
              onClick={() => handleAction("approve")}
              icon={<CheckOutlined />}
            >
              Confirmar
            </Button>,
          ]}
        >
          <Descriptions bordered column={1} size="small">
            {Object.entries(selectedItem)
              .filter(
                ([key, value]) =>
                  key !== "dados_atualizacao" &&
                  value !== null &&
                  value !== "" &&
                  value !== undefined
              )
              .sort(
                ([keyA], [keyB]) =>
                  (fieldConfig[keyA]?.order ?? 999) -
                  (fieldConfig[keyB]?.order ?? 999)
              )
              .map(([key, value]) => (
                <Descriptions.Item
                  key={key}
                  label={fieldConfig[key]?.label ?? key}
                >
                  {renderValue(key, value, selectedItem.nomeFantasia)}
                </Descriptions.Item>
              ))}

            {selectedItem.dados_atualizacao &&
              Object.keys(selectedItem.dados_atualizacao).length > 0 && (
                <Descriptions.Item
                  label={<Text strong>Dados para Atualizar</Text>}
                  style={{ backgroundColor: "#e6f7ff" }}
                >
                  <div className="space-y-3 p-2">
                    {Object.entries(selectedItem.dados_atualizacao)
                      .sort(
                        ([keyA], [keyB]) =>
                          (fieldConfig[keyA]?.order ?? 999) -
                          (fieldConfig[keyB]?.order ?? 999)
                      )
                      .map(([key, value]) => (
                        <div key={key}>
                          <Text strong>{fieldConfig[key]?.label ?? key}:</Text>
                          <div className="pl-4 mt-1">
                            {renderValue(key, value, selectedItem.nomeFantasia)}
                          </div>
                        </div>
                      ))}
                  </div>
                </Descriptions.Item>
              )}
          </Descriptions>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
