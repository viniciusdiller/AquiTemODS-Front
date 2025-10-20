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
  Alert,
} from "antd";
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { getPendingAdminRequests } from "@/lib/api";

const { Text, Title } = Typography;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fieldConfig: { [key: string]: { label: string; order: number } } = {
  projetoId: { label: "ID", order: 1 },
  ods: { label: "ODS", order: 4 },
  prefeitura: { label: "Prefeitura", order: 2 },
  nomeProjeto: { label: "Nome do Projeto", order: 10 },
  emailContato: { label: "Email", order: 20 },
  endereco: { label: "Endereço", order: 22 },
  descricao: { label: "Descrição", order: 30 },
  descricaoDiferencial: { label: "Diferencial", order: 31 },
  website: { label: "Website", order: 40 },
  odsRelacionadas: { label: "ODS Relacionadas", order: 50 },
  instagram: { label: "Instagram", order: 41 },
  logoUrl: { label: "Logo Atual", order: 42 },
  logo: { label: "Nova Logo", order: 42 },
  projetoImg: { label: "Portfólio Atual", order: 43 },
  imagens: { label: "Novo Portfólio", order: 45 },
  status: { label: "Status Atual", order: 5 },
  motivoExclusao: { label: "Motivo da Exclusão", order: 6 },
  createdAt: { label: "Data de Criação", order: 100 },
  updatedAt: { label: "Última Atualização", order: 101 },
};

interface Imagens {
  url: string;
}

interface Projeto {
  projetoId: number;
  nomeProjeto: string;
  prefeitura: string;
  logoUrl?: string;
  projetoImg?: Imagens[];
  dados_atualizacao?: any;
  status: string;
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
  const [selectedItem, setSelectedItem] = useState<Projeto | null>(null);
  const router = useRouter();

  const getFullImageUrl = (path: string): string => {
    if (!path) return "";
    const normalizedPath = path.replace(/\\/g, "/");
    const cleanPath = normalizedPath.startsWith("/") ? normalizedPath.substring(1) : normalizedPath;
    return `${API_URL}/${cleanPath}`;
  };

  const renderValue = (key: string, value: any): React.ReactNode => {
    if ((key === "projetoImg" || key === "imagens") && Array.isArray(value) && value.length > 0) {
      const imagesUrls = value
        .map((item) => (typeof item === "string" ? item : item.url))
        .map(getFullImageUrl)
        .filter(Boolean);

      return (
        <Row gutter={[8, 8]}>
          {imagesUrls.map((imageUrl, index) => (
            <Col key={index}>
              <Image src={imageUrl} alt={`Imagem ${index + 1}`} width={80} />
            </Col>
          ))}
        </Row>
      );
    }

    if ((key === "logoUrl" || key === "logo") && typeof value === "string" && value) {
      return <Image src={getFullImageUrl(value)} alt="Logo" width={150} />;
    }

    if (typeof value === "object" && value !== null) return JSON.stringify(value);

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
      const pendingData = await getPendingAdminRequests(token);
      setData(pendingData);
    } catch (error: any) {
      message.error(error.message || "Falha ao buscar dados.");
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
      message.error(error.message || "Falha ao executar ação.");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (item: Projeto) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderList = (title: string, listData: Projeto[]) => (
    <Col xs={24} md={12} lg={8}>
      <Card title={`${title} (${listData.length})`}>
        {listData.length > 0 ? (
          <List
            dataSource={listData}
            renderItem={(item) => (
              <List.Item actions={[<Button type="link" onClick={() => showModal(item)}>Detalhes</Button>]}>
                <List.Item.Meta title={item.nomeProjeto} description={`Prefeitura: ${item.prefeitura}`} />
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
        <Title level={2} className="mb-6">Painel de Administração</Title>
        <Row gutter={[16, 16]}>
          {renderList("Novos Cadastros", data.cadastros)}
          {renderList("Atualizações", data.atualizacoes)}
          {renderList("Exclusões", data.exclusoes)}
        </Row>
      </Spin>

      {selectedItem && (
        <Modal
          title={`Detalhes de ${selectedItem.nomeProjeto}`}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={800}
          footer={[
            <Button key="reject" onClick={() => handleAction("reject")} icon={<CloseOutlined />} danger>Recusar</Button>,
            <Button key="confirm" type="primary" onClick={() => handleAction("approve")} icon={<CheckOutlined />}>Confirmar</Button>,
          ]}
        >
          {selectedItem.status === 'pendente_exclusao' && selectedItem.dados_atualizacao?.motivoExclusao && (
            <Alert
              message="Solicitação de Exclusão"
              description={<Text>{selectedItem.dados_atualizacao.motivoExclusao}</Text>}
              type="error"
              showIcon
              icon={<ExclamationCircleOutlined />}
              className="mb-4"
            />
          )}

          <Title level={4}>Dados do Projeto</Title>
          <Descriptions bordered column={1} size="small">
            
            {selectedItem.logoUrl && (
              <Descriptions.Item label={fieldConfig.logoUrl.label}>
                {renderValue("logoUrl", selectedItem.logoUrl)}
              </Descriptions.Item>
            )}

            {selectedItem.projetoImg && selectedItem.projetoImg.length > 0 && (
               <Descriptions.Item label={fieldConfig.projetoImg.label}>
                  {renderValue("projetoImg", selectedItem.projetoImg)}
               </Descriptions.Item>
            )}
            
            {Object.entries(selectedItem)
              .filter(([key]) => 
                key !== "dados_atualizacao" &&
                key !== "logoUrl" &&
                key !== "projetoImg" &&
                key !== "status"
              )
              .sort(([keyA], [keyB]) => (fieldConfig[keyA]?.order ?? 999) - (fieldConfig[keyB]?.order ?? 999))
              .map(([key, value]) => (
                value && <Descriptions.Item key={key} label={fieldConfig[key]?.label ?? key}>
                  {renderValue(key, value)}
                </Descriptions.Item>
              ))}
          </Descriptions>

          {selectedItem.status === 'pendente_atualizacao' && selectedItem.dados_atualizacao && Object.keys(selectedItem.dados_atualizacao).length > 0 && (
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: "#e6f7ff" }}>
              <Title level={4} className="text-blue-800">Dados para Atualizar</Title>
              <Descriptions bordered column={1} size="small" className="mt-2">
                {Object.entries(selectedItem.dados_atualizacao)
                  .filter(([key]) => key !== "imagens" && key !== "motivoExclusao")
                  .sort(([keyA], [keyB]) => (fieldConfig[keyA]?.order ?? 999) - (fieldConfig[keyB]?.order ?? 999))
                  .map(([key, value]) => (
                    <Descriptions.Item key={key} label={fieldConfig[key]?.label ?? `Novo ${key}`}>
                      {renderValue(key, value)}
                    </Descriptions.Item>
                  ))}
              </Descriptions>

              {selectedItem.dados_atualizacao.imagens && (
                <div className="mt-4">
                  <Title level={5} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                    {fieldConfig.imagens.label}
                  </Title>
                   <div className="pt-2">
                     {renderValue("imagens", selectedItem.dados_atualizacao.imagens)}
                   </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;