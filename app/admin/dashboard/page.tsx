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
  Avatar,
  Table,
  Form, // NOVO: Importa o Form
  Input, // NOVO: Importa o Input
  Select,
} from "antd";
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { getPendingAdminRequests } from "@/lib/api";

const { Text, Title } = Typography;
const { Column } = Table; // Para a tabela de diff
const { TextArea } = Input; // NOVO: Para o campo de descrição
const { Option } = Select;

enum StatusProjeto {
  PENDENTE_APROVACAO = "pendente_aprovacao",
  PENDENTE_ATUALIZACAO = "pendente_atualizacao",
  PENDENTE_EXCLUSAO = "pendente_exclusao",
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Objeto para os ícones dos cards
const listIcons: { [key: string]: React.ReactNode } = {
  "Novos Cadastros": <UserAddOutlined style={{ color: "#52c41a" }} />,
  Atualizações: <EditOutlined style={{ color: "#1890ff" }} />,
  Exclusões: <DeleteOutlined style={{ color: "#f5222d" }} />,
};

// ... (fieldConfig, interfaces Imagens, Projeto, PendingData permanecem iguais) ...
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

const categorias = [
  "ODS 1 - Erradicação da Pobreza",
  "ODS 2 - Fome Zero e Agricultura Sustentável",
  "ODS 3 - Saúde e Bem-estar",
  "ODS 4 - Educação de Qualidade",
  "ODS 5 - Igualdade de Gênero",
  "ODS 6 - Água Potável e Saneamento",
  "ODS 7 - Energia Acessível e Limpa",
  "ODS 8 - Trabalho Decente e Crescimento Econômico",
  "ODS 9 - Indústria, Inovação e Infraestrutura",
  "ODS 10 - Redução das Desigualdades",
  "ODS 11 - Cidades e Comunidades Sustentáveis",
  "ODS 12 - Consumo e Produção Responsáveis",
  "ODS 13 - Ação Contra a Mudança Global do Clima",
  "ODS 14 - Vida na Água",
  "ODS 15 - Vida Terrestre",
  "ODS 16 - Paz, Justiça e Instituições Eficazes",
  "ODS 17 - Parcerias e Meios de Implementação",
  "ODS 18 - Igualdade Étnico/Racial",
];

const fieldConfig: { [key: string]: { label: string; order: number } } = {
  projetoId: { label: "ID", order: 1 },
  ods: { label: "ODS", order: 4 },
  prefeitura: { label: "Prefeitura", order: 2 },
  secretaria: { label: "Secretaria", order: 3 },
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
  status: { label: "Status Atual", order: 5 },
  motivo: { label: "Motivo da Exclusão", order: 1000 },
  motivoExclusao: { label: "Motivo da Exclusão", order: 6 },
  createdAt: { label: "Data de Criação", order: 100 },
  updatedAt: { label: "Última Atualização", order: 101 },
};
// ...

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
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editForm] = Form.useForm();

  const getFullImageUrl = (path: string): string => {
    if (!path) return "";
    const normalizedPath = path.replace(/\\/g, "/");
    const cleanPath = normalizedPath.startsWith("/")
      ? normalizedPath.substring(1)
      : normalizedPath;
    return `${API_URL}/${cleanPath}`;
  };

  const renderValue = (key: string, value: any): React.ReactNode => {
    // Adicionando um fallback para valores nulos ou vazios
    if (value === null || value === undefined || value === "") {
      return <Text type="secondary">Não informado</Text>;
    }

    if (
      (key === "projetoImg" || key === "imagens") &&
      Array.isArray(value) &&
      value.length > 0
    ) {
      const imagesUrls = value
        .map((item) => (typeof item === "string" ? item : item.url))
        .map(getFullImageUrl)
        .filter(Boolean);

      return (
        <Image.PreviewGroup>
          <Row gutter={[8, 8]}>
            {imagesUrls.map((imageUrl, index) => (
              <Col key={index}>
                <Image src={imageUrl} alt={`Imagem ${index + 1}`} width={80} />
              </Col>
            ))}
          </Row>
        </Image.PreviewGroup>
      );
    }

    if (
      (key === "logoUrl" || key === "logo") &&
      typeof value === "string" &&
      value
    ) {
      return <Image src={getFullImageUrl(value)} alt="Logo" width={150} />;
    }

    if (typeof value === "object" && value !== null)
      return JSON.stringify(value);

    if (key === "odsRelacionadas" && Array.isArray(value)) {
      return value.join(", ");
    }

    return String(value);
  };

  const fetchData = useCallback(async () => {
    // ... (lógica de fetchData inalterada) ...
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
    // ... (lógica de handleAction inalterada) ...
    if (!selectedItem) return;

    setIsActionLoading(true);
    const token = localStorage.getItem("admin_token");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/${action}/${selectedItem.projetoId}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      message.success(`Ação executada com sucesso!`);

      setData((prevData) => {
        const newData = { ...prevData };

        (Object.keys(newData) as Array<keyof PendingData>).forEach((key) => {
          newData[key] = newData[key].filter(
            (item) => item.projetoId !== selectedItem.projetoId
          );
        });
        return newData;
      });

      setModalVisible(false);
      setSelectedItem(null);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const showModal = (item: Projeto) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleOpenEditModal = () => {
    if (!selectedItem) return;

    let dataToEdit = {};

    if (selectedItem.status === StatusProjeto.PENDENTE_APROVACAO) {
      dataToEdit = { ...selectedItem };
    } else if (selectedItem.status === StatusProjeto.PENDENTE_ATUALIZACAO) {
      // Mescla os dados: base é o item original, atualizações são aplicadas por cima
      dataToEdit = { ...selectedItem, ...selectedItem.dados_atualizacao };
    }

    // Converte 'odsRelacionadas' de string para array, se necessário
    if (typeof (dataToEdit as any).odsRelacionadas === "string") {
      (dataToEdit as any).odsRelacionadas = (dataToEdit as any).odsRelacionadas
        .split(",")
        .map((s: string) => s.trim());
    }

    editForm.setFieldsValue(dataToEdit);
    setIsEditModalVisible(true);
  };

  // NOVO: Função para submeter a edição
  const handleEditAndApprove = async (values: any) => {
    if (!selectedItem) return;

    setIsEditLoading(true);
    const token = localStorage.getItem("admin_token");

    // Converte 'odsRelacionadas' de array para string
    if (Array.isArray(values.odsRelacionadas)) {
      values.odsRelacionadas = values.odsRelacionadas.join(", ");
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admin/edit-and-approve/${selectedItem.projetoId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values), // Envia os dados editados do formulário
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      message.success(result.message || "Projeto editado e aprovado!");

      // Fecha ambos os modais
      setIsEditModalVisible(false);
      setModalVisible(false);
      setSelectedItem(null);

      fetchData(); // Recarrega os dados do dashboard
    } catch (error: any) {
      message.error(error.message || "Falha ao editar e aprovar.");
    } finally {
      setIsEditLoading(false);
    }
  };

  // ## MELHORIA: Renderiza a tabela de comparação (Diff) ##
  const renderDiffTable = (
    status: "pendente_atualizacao" | "pendente_exclusao",
    alertType: "info" | "error",
    title: string,
    keysToFilter: string[] = []
  ) => {
    if (
      !selectedItem ||
      selectedItem.status !== status ||
      !selectedItem.dados_atualizacao
    ) {
      return null;
    }

    // Mapa de chaves (como já tínhamos)
    const keyMap: { [newKey: string]: { oldKey: string; labelKey: string } } = {
      logo: { oldKey: "logoUrl", labelKey: "logo" },
      imagens: { oldKey: "projetoImg", labelKey: "projetoImg" },
    };

    // Prepara os dados para a tabela
    const diffData = Object.entries(selectedItem.dados_atualizacao)
      .filter(([key]) => !keysToFilter.includes(key)) // Usa o novo parâmetro
      .map(([key, newValue]) => {
        const mapping = keyMap[key];
        const oldKey = mapping ? mapping.oldKey : key;
        const labelKey = mapping ? mapping.labelKey : key;

        const oldValue = selectedItem[oldKey];
        const fieldLabel = fieldConfig[labelKey]?.label ?? `Novo ${key}`;

        let finalLabel = fieldLabel;
        if (labelKey === "projetoImg") finalLabel = "Portfólio";
        if (labelKey === "logo") finalLabel = "Logo";

        // Ajusta o label de 'motivo' se for o caso de exclusão
        if (key === "motivo") finalLabel = "Motivo da Exclusão";

        return {
          key: oldKey,
          newKey: key,
          field: finalLabel,
          oldValue: oldValue,
          newValue: newValue,
        };
      })
      .sort(
        (a, b) =>
          (fieldConfig[a.newKey]?.order ?? 999) -
          (fieldConfig[b.newKey]?.order ?? 999)
      );

    // Define a cor do título com base no tipo de alerta
    const titleColor = alertType === "info" ? "#0050b3" : "#d4380d"; // Cor de erro do Antd

    return (
      <Alert
        type={alertType} // Parâmetro
        showIcon
        className="mt-6"
        style={{ overflow: "hidden" }}
        message={
          <Title level={4} style={{ margin: 0, color: titleColor }}>
            {title} {/* Parâmetro */}
          </Title>
        }
        description={
          <Table
            dataSource={diffData}
            pagination={false}
            size="middle"
            bordered
            className="mt-4"
            scroll={{ x: true }}
          >
            {/* As colunas permanecem exatamente iguais */}
            <Column title="Campo" dataIndex="field" key="field" width={150} />
            <Column
              title="Valor Antigo"
              dataIndex="oldValue"
              key="oldValue"
              width={400} // Usando os valores que ajustamos
              render={(value, record: any) => renderValue(record.key, value)}
            />
            <Column
              title="Valor Novo"
              dataIndex="newValue"
              key="newValue"
              width={450} // Usando os valores que ajustamos
              render={(value, record: any) => renderValue(record.newKey, value)}
            />
          </Table>
        }
      />
    );
  };

  // ## MELHORIA: Adiciona ícones e avatares aos cards e listas ##
  const renderList = (title: string, listData: Projeto[]) => (
    <Col xs={24} md={12} lg={8}>
      <Card
        title={
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {listIcons[title]}
            {title} ({listData.length})
          </span>
        }
      >
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
                  avatar={
                    <Avatar
                      src={getFullImageUrl(item.logoUrl || "")}
                      icon={listIcons[title]} // Icone de fallback
                    />
                  }
                  title={item.nomeProjeto}
                  description={`Prefeitura: ${item.prefeitura}`}
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
        <Title level={2} className="mb-6">
          Painel de Administração
        </Title>
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
          width={1000}
          footer={[
            <Button
              key="reject"
              onClick={() => handleAction("reject")}
              icon={<CloseOutlined />}
              danger
              loading={isActionLoading}
            >
              Recusar{" "}
            </Button>, // Só mostra botões de aprovação se não for exclusão
            selectedItem.status !== StatusProjeto.PENDENTE_EXCLUSAO ? (
              <Button
                key="approve_direct"
                onClick={() => handleAction("approve")}
                icon={<CheckOutlined />}
                loading={isActionLoading}
              >
                Aprovar Direto{" "}
              </Button>
            ) : (
              // Botão de "Confirmar Exclusão"
              <Button
                key="approve_delete"
                type="primary"
                danger
                onClick={() => handleAction("approve")}
                icon={<CheckOutlined />}
                loading={isActionLoading}
              >
                Confirmar Exclusão{" "}
              </Button>
            ), // Só mostra "Editar" se não for exclusão
            selectedItem.status !== StatusProjeto.PENDENTE_EXCLUSAO && (
              <Button
                key="edit_and_approve"
                type="primary"
                onClick={handleOpenEditModal} // <-- AQUI ESTÁ A MÁGICA
                icon={<EditOutlined />}
                loading={isActionLoading}
              >
                Editar{" "}
              </Button>
            ),
          ]}
        >
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
              .filter(
                ([key]) =>
                  key !== "dados_atualizacao" &&
                  key !== "logoUrl" &&
                  key !== "projetoImg" &&
                  key !== "status"
              )
              .sort(
                ([keyA], [keyB]) =>
                  (fieldConfig[keyA]?.order ?? 999) -
                  (fieldConfig[keyB]?.order ?? 999)
              )
              .map(
                ([key, value]) =>
                  // Removemos a checagem 'value &&' para exibir campos "Não informado"
                  fieldConfig[key] && ( // Apenas renderiza se estiver no config
                    <Descriptions.Item
                      key={key}
                      label={fieldConfig[key]?.label ?? key}
                    >
                      {renderValue(key, value)}
                    </Descriptions.Item>
                  )
              )}
          </Descriptions>

          {renderDiffTable(
            "pendente_exclusao",
            "error",
            "Solicitação de Exclusão",
            ["projetoId", "confirmacao"] // Campos do form de exclusão que não queremos mostrar
          )}

          {/* Chamada para a tabela de ATUALIZAÇÃO */}
          {renderDiffTable(
            "pendente_atualizacao",
            "info",
            "Dados para Atualizar",
            ["motivoExclusao"] // Campos do form de atualização que não queremos mostrar
          )}
        </Modal>
      )}

      <Modal
        title="Editar e Aprovar Projeto"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isEditLoading}
            onClick={() => editForm.submit()} // Aciona o onFinish do Form
          >
            Salvar e Aprovar
          </Button>,
        ]}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditAndApprove}
          autoComplete="off"
        >
          <Spin spinning={isEditLoading}>
            <Title level={5} className="mt-4">
              Informações Principais
            </Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="nomeProjeto"
                  label="Nome do Projeto"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ods"
                  label="ODS Principal"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Selecione a ODS principal">
                    {categorias.map((cat) => (
                      <Option key={cat} value={cat}>
                        {cat}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="prefeitura"
                  label="Prefeitura"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="secretaria"
                  label="Secretaria"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Title level={5} className="mt-4">
              Contato e Links
            </Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="emailContato"
                  label="Email de Contato"
                  rules={[{ required: true, type: "email" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="linkProjeto"
                  label="Link do Projeto"
                  rules={[{ required: true, type: "url" }]}
                >
                  <Input placeholder="http://..." />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="website"
                  label="Website"
                  rules={[{ type: "url" }]}
                >
                  <Input placeholder="http://..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="instagram"
                  label="Instagram"
                  rules={[{ type: "url" }]}
                >
                  <Input placeholder="http://instagram.com/..." />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="endereco" label="Endereço">
              <Input />
            </Form.Item>

            <Title level={5} className="mt-4">
              Detalhes
            </Title>
            <Form.Item
              name="descricaoDiferencial"
              label="Briefing (Descrição Curta)"
              rules={[{ required: true }]}
            >
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item
              name="descricao"
              label="Descrição Completa"
              rules={[{ required: true }]}
            >
              <TextArea rows={5} />
            </Form.Item>
            <Form.Item name="odsRelacionadas" label="ODS Relacionadas">
              <Select
                mode="multiple"
                placeholder="Selecione as ODS relacionadas"
              >
                {/* Lista simplificada de todas as ODS */}
                {categorias
                  .map((cat) => cat.split(" - ")[0])
                  .filter(
                    (v, i, a) => a.indexOf(v) === i && !v.startsWith("ODS 18")
                  )
                  .map((ods) => (
                    <Option key={ods} value={ods}>
                      {ods}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Alert
              message="Aviso sobre Arquivos"
              description="A 'Nova Logo' e as 'Novas Imagens' enviadas pelo usuário (visíveis na tela anterior) serão aprovadas automaticamente junto com estas edições. Não é possível adicionar novos arquivos nesta tela."
              type="warning"
              showIcon
              className="mt-4"
            />
          </Spin>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
