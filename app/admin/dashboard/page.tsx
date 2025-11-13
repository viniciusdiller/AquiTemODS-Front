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
  Input,
  Select,
  Pagination,
  Grid,
} from "antd";
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  DatabaseOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPendingAdminRequests } from "@/lib/api";
import AdminProjetoModal from "@/components/AdminProjetoModal";
import { Projeto } from "@/types/Interface-Projeto";
import FormattedDescription from "@/components/FormattedDescription";

const { Text, Title } = Typography;
const { Column } = Table;
const { TextArea } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

enum StatusProjeto {
  PENDENTE_APROVACAO = "pendente_aprovacao",
  PENDENTE_ATUALIZACAO = "pendente_atualizacao",
  PENDENTE_EXCLUSAO = "pendente_exclusao",
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DASHBOARD_PAGE_SIZE = 5;

// Objeto para os ícones dos cards
const listIcons: { [key: string]: React.ReactNode } = {
  "Novos Cadastros": <UserAddOutlined style={{ color: "#52c41a" }} />,
  Atualizações: <EditOutlined style={{ color: "#1890ff" }} />,
  Exclusões: <DeleteOutlined style={{ color: "#f5222d" }} />,
};

interface PendingData {
  cadastros: Projeto[];
  atualizacoes: Projeto[];
  exclusoes: Projeto[];
}

const fieldConfig: {
  [key: string]: { label: string; order: number; group: string };
} = {
  projetoId: { label: "ID", order: 1, group: "identificacao" },
  prefeitura: { label: "Prefeitura", order: 2, group: "identificacao" },
  secretaria: { label: "Secretaria", order: 3, group: "identificacao" },
  nomeProjeto: { label: "Nome do Projeto", order: 10, group: "identificacao" },
  responsavelProjeto: {
    label: "Responsável",
    order: 11,
    group: "identificacao",
  },
  emailContato: { label: "Email", order: 20, group: "identificacao" },

  // --- Grupo de Informações do Projeto ---
  ods: { label: "ODS", order: 4, group: "info" },
  venceuPspe: { label: "Venceu o Prêmio PSPE", order: 6, group: "info" },
  endereco: { label: "Endereço", order: 22, group: "info" },
  descricao: { label: "Descrição", order: 30, group: "info" },
  descricaoDiferencial: { label: "Briefing", order: 31, group: "info" },
  outrasAlteracoes: { label: "Outras Alterações", order: 32, group: "info" },
  website: { label: "Website", order: 40, group: "info" },
  instagram: { label: "Instagram", order: 41, group: "info" },
  logoUrl: { label: "Logo Atual", order: 42, group: "info" },
  logo: { label: "Nova Logo", order: 42, group: "info" },
  projetoImg: { label: "Portfólio Atual", order: 43, group: "info" },
  odsRelacionadas: { label: "ODS Relacionadas", order: 50, group: "info" },
  apoio_planejamento: {
    label: "Apoio ao Planejamento",
    order: 60,
    group: "info",
  },
  escala: { label: "Escala de Impacto", order: 61, group: "info" },

  // --- Grupo de Metadados ---
  status: { label: "Status Atual", order: 5, group: "meta" },
  motivo: { label: "Motivo da Exclusão", order: 1000, group: "meta" },
  motivoExclusao: { label: "Motivo da Exclusão", order: 6, group: "meta" },
  createdAt: { label: "Data de Criação", order: 100, group: "meta" },
  updatedAt: { label: "Última Atualização", order: 101, group: "meta" },
};

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
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [currentPages, setCurrentPages] = useState({
    cadastros: 1,
    atualizacoes: 1,
    exclusoes: 1,
  });

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const getFullImageUrl = (path: string): string => {
    if (!path) return "";
    const normalizedPath = path.replace(/\\/g, "/");
    const cleanPath = normalizedPath.startsWith("/")
      ? normalizedPath.substring(1)
      : normalizedPath;
    return `${API_URL}/${cleanPath}`;
  };

  const renderValue = (key: string, value: any): React.ReactNode => {
    if (value === null || value === undefined || value === "") {
      return <Text type="secondary">Não informado</Text>;
    }

    if (key === "descricao") {
      return (
        <div
          className="prose prose-sm max-w-none prose-p:my-1"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      );
    }

    if (key === "descricaoDiferencial") {
      return <FormattedDescription text={value} />;
    }

    if (
      key === "motivo" ||
      key === "motivoExclusao" ||
      key === "outrasAlteracoes"
    ) {
      return (
        <Typography.Paragraph style={{ whiteSpace: "pre-wrap", margin: 0 }}>
          {String(value)}
        </Typography.Paragraph>
      );
    }

    if (key === "createdAt" || key === "updatedAt") {
      try {
        const date = new Date(value);

        return new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(date);
      } catch (error) {
        return String(value);
      }
    }

    if (key === "venceuPspe") {
      const boolValue =
        String(value).toLowerCase() === "true" || value === true;
      return boolValue ? "Sim" : "Não";
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
      setCurrentPages({
        cadastros: 1,
        atualizacoes: 1,
        exclusoes: 1,
      });
    } catch (error: any) {
      message.error(error.message || "Falha ao buscar dados.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async (
    action: "approve" | "reject",
    motivoRejeicao?: string
  ) => {
    if (!selectedItem) return;

    setIsActionLoading(true);
    const token = localStorage.getItem("admin_token");

    try {
      const fetchOptions: RequestInit = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (action === "reject") {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          "Content-Type": "application/json",
        };
        fetchOptions.body = JSON.stringify({
          motivoRejeicao: motivoRejeicao || "",
        });
      }

      const response = await fetch(
        `${API_URL}/api/admin/${action}/${selectedItem.projetoId}`,
        fetchOptions
      );

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || "Erro do servidor");
        } catch (e) {
          console.error("Erro não-JSON da API:", errorText);
          throw new Error(
            "Falha na comunicação com o servidor. (Recebeu HTML)"
          );
        }
      }

      const result = await response.json();

      message.success(result.message || `Ação executada com sucesso!`);

      setData((prevData) => {
        const newData = { ...prevData };

        (Object.keys(newData) as Array<keyof PendingData>).forEach((key) => {
          newData[key] = newData[key].filter(
            (item) => item.projetoId !== selectedItem.projetoId
          );
        });
        return newData;
      });

      if (selectedItem.status === StatusProjeto.PENDENTE_APROVACAO) {
        handlePageChange("cadastros")(1);
      } else if (selectedItem.status === StatusProjeto.PENDENTE_ATUALIZACAO) {
        handlePageChange("atualizacoes")(1);
      } else if (selectedItem.status === StatusProjeto.PENDENTE_EXCLUSAO) {
        handlePageChange("exclusoes")(1);
      }

      setModalVisible(false);
      setIsRejectModalVisible(false);
      setSelectedItem(null);
      setRejectionReason("");
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
    setIsEditModalVisible(true);
  };

  const handleEditAndApproveSubmit = async (values: any) => {
    if (!selectedItem) return;

    setIsActionLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Autenticação expirada.");
      setIsActionLoading(false);
      return;
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
          body: JSON.stringify(values),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setIsEditModalVisible(false);
      setModalVisible(false);
      setSelectedItem(null);
      fetchData();
    } catch (error: any) {
      setIsActionLoading(false);
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

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

    const keyMap: { [newKey: string]: { oldKey: string; labelKey: string } } = {
      logo: { oldKey: "logoUrl", labelKey: "logo" },
      imagens: { oldKey: "projetoImg", labelKey: "projetoImg" },
    };

    const diffDataAll = Object.entries(selectedItem.dados_atualizacao)
      .filter(([key]) => !keysToFilter.includes(key))
      .map(([key, newValue]) => {
        const mapping = keyMap[key];
        const oldKey = mapping ? mapping.oldKey : key;
        const labelKey = mapping ? mapping.labelKey : key;

        const oldValue = selectedItem[oldKey];
        const fieldLabel = fieldConfig[labelKey]?.label ?? `Novo ${key}`;

        let finalLabel = fieldLabel;
        if (labelKey === "projetoImg") finalLabel = "Portfólio";
        if (labelKey === "logo") finalLabel = "Logo";

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

    // 2. Extrai 'outrasAlteracoes' dos dados
    const outrasAlteracoesUpdate = diffDataAll.find(
      (d) => d.newKey === "outrasAlteracoes"
    );

    const diffData = diffDataAll.filter((d) => d.newKey !== "outrasAlteracoes");

    // 4. Filtra os dados da tabela (AGORA USANDO 'diffData')
    const identificacaoDiff = diffData.filter(
      (d) =>
        fieldConfig[d.newKey]?.group === "identificacao" ||
        fieldConfig[d.key]?.group === "identificacao"
    );

    const infoDiff = diffData.filter(
      (d) =>
        fieldConfig[d.newKey]?.group === "info" ||
        fieldConfig[d.key]?.group === "info"
    );

    const metaDiff = diffData.filter(
      (d) =>
        (fieldConfig[d.newKey]?.group === "meta" ||
          fieldConfig[d.key]?.group === "meta") &&
        fieldConfig[d.newKey]?.group !== "identificacao" &&
        fieldConfig[d.key]?.group !== "identificacao" &&
        fieldConfig[d.newKey]?.group !== "info" &&
        fieldConfig[d.key]?.group !== "info"
    );

    const titleColor = alertType === "info" ? "#0050b3" : "#d4380d";

    const columns = [
      <Column title="Campo" dataIndex="field" key="field" width={150} />,
      <Column
        title="Valor Antigo"
        dataIndex="oldValue"
        key="oldValue"
        width={400}
        render={(value, record: any) => renderValue(record.key, value)}
      />,
      <Column
        title="Valor Novo"
        dataIndex="newValue"
        key="newValue"
        width={450}
        render={(value, record: any) => renderValue(record.newKey, value)}
      />,
    ];

    return (
      <Alert
        type={alertType}
        showIcon
        className="mt-6"
        style={{ overflow: "hidden" }}
        message={
          <Title level={4} style={{ margin: 0, color: titleColor }}>
            {title}
          </Title>
        }
        description={
          <>
            {outrasAlteracoesUpdate && (
              <Alert
                message="Atenção: Pedido de 'Outras Alterações' (Ação Manual)"
                description={
                  <Typography.Paragraph
                    style={{
                      whiteSpace: "pre-wrap",
                      margin: 0,
                      padding: "8px",
                      background: "#fff",
                      borderRadius: "4px",
                    }}
                  >
                    {renderValue(
                      "outrasAlteracoes",
                      outrasAlteracoesUpdate.newValue
                    )}
                  </Typography.Paragraph>
                }
                type="warning"
                showIcon
                className="my-4"
              />
            )}

            {identificacaoDiff.length > 0 && (
              <>
                <Title
                  level={5}
                  style={{ color: titleColor, marginTop: "16px" }}
                >
                  Identificação do Projeto
                </Title>
                <Table
                  dataSource={identificacaoDiff}
                  pagination={false}
                  size="middle"
                  bordered
                  className="mt-4"
                  scroll={{ x: true }}
                >
                  {columns.map((col) => col)}
                </Table>
              </>
            )}

            {infoDiff.length > 0 && (
              <>
                <Title
                  level={5}
                  style={{ color: titleColor, marginTop: "24px" }}
                >
                  Informações do Projeto
                </Title>
                <Table
                  dataSource={infoDiff}
                  pagination={false}
                  size="middle"
                  bordered
                  className="mt-4"
                  scroll={{ x: true }}
                >
                  {columns.map((col) => col)}
                </Table>
              </>
            )}

            {metaDiff.length > 0 && (
              <>
                <Table
                  dataSource={metaDiff}
                  pagination={false}
                  size="middle"
                  bordered
                  className="mt-4"
                  scroll={{ x: true }}
                >
                  {columns.map((col) => col)}
                </Table>
              </>
            )}
          </>
        }
      />
    );
  };

  const handlePageChange = (listKey: keyof PendingData) => (page: number) => {
    setCurrentPages((prev) => ({
      ...prev,
      [listKey]: page,
    }));
  };

  const renderList = (
    title: string,
    listData: Projeto[],
    listKey: keyof PendingData
  ) => {
    const totalCount = listData.length;
    const currentPage = currentPages[listKey];
    const pagedData = listData.slice(
      (currentPage - 1) * DASHBOARD_PAGE_SIZE,
      currentPage * DASHBOARD_PAGE_SIZE
    );

    return (
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
            <>
              {" "}
              <List
                dataSource={pagedData}
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
                          icon={listIcons[title]}
                        />
                      }
                      title={item.nomeProjeto}
                      description={`Prefeitura: ${item.prefeitura}`}
                    />
                  </List.Item>
                )}
              />
              {totalCount > DASHBOARD_PAGE_SIZE && (
                <div className="mt-4 text-center">
                  <Pagination
                    current={currentPage}
                    pageSize={DASHBOARD_PAGE_SIZE}
                    total={totalCount}
                    onChange={handlePageChange(listKey)}
                    size="small"
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          ) : (
            <Empty description="Nenhuma solicitação" />
          )}
        </Card>
      </Col>
    );
  };

  return (
    <div className="p-8">
      <Spin spinning={loading}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <Title
            level={isMobile ? 3 : 2}
            className="m-0 md:text-left text-center"
          >
            Painel de Administração
          </Title>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Link href="/admin/projetos-ativos" passHref>
              <Button
                type="primary"
                icon={<DatabaseOutlined />}
                size="large"
                className={isMobile ? "w-full" : ""}
              >
                Gerenciar Projetos Ativos
              </Button>
            </Link>

            <Link href="/admin/comentarios" passHref>
              <Button
                icon={<CommentOutlined />}
                size="large"
                style={{ backgroundColor: "#3C6AB2", color: "#fff" }}
                className={isMobile ? "w-full" : ""}
              >
                Gerenciar Comentários
              </Button>
            </Link>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {renderList("Novos Cadastros", data.cadastros, "cadastros")}
          {renderList("Atualizações", data.atualizacoes, "atualizacoes")}
          {renderList("Exclusões", data.exclusoes, "exclusoes")}
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
              onClick={() => setIsRejectModalVisible(true)}
              icon={<CloseOutlined />}
              danger
              loading={isActionLoading}
            >
              Recusar
            </Button>,

            selectedItem.status !== StatusProjeto.PENDENTE_EXCLUSAO && (
              <Button
                key="edit_and_approve"
                onClick={handleOpenEditModal}
                icon={<EditOutlined />}
                loading={isActionLoading}
              >
                Editar Informações
              </Button>
            ),

            selectedItem.status !== StatusProjeto.PENDENTE_EXCLUSAO ? (
              <Button
                key="approve_direct"
                type="primary"
                onClick={() => handleAction("approve")}
                icon={<CheckOutlined />}
                loading={isActionLoading}
              >
                Aprovar Direto
              </Button>
            ) : (
              <Button
                key="approve_delete"
                type="primary"
                danger
                onClick={() => handleAction("approve")}
                icon={<CheckOutlined />}
                loading={isActionLoading}
              >
                Confirmar Exclusão
              </Button>
            ),
          ]}
        >
          {(() => {
            const allEntries = Object.entries(selectedItem)
              .filter(
                ([key]) =>
                  key !== "dados_atualizacao" &&
                  key !== "logoUrl" &&
                  key !== "projetoImg" &&
                  key !== "status" &&
                  fieldConfig[key]
              )
              .sort(
                ([keyA], [keyB]) =>
                  (fieldConfig[keyA]?.order ?? 999) -
                  (fieldConfig[keyB]?.order ?? 999)
              );

            const identificacaoEntries = allEntries.filter(
              ([key]) => fieldConfig[key]?.group === "identificacao"
            );
            const infoEntries = allEntries.filter(
              ([key]) => fieldConfig[key]?.group === "info"
            );
            const metaEntries = allEntries.filter(
              ([key]) => fieldConfig[key]?.group === "meta"
            );

            return (
              <>
                {identificacaoEntries.length > 0 && (
                  <>
                    <Title level={4} className="mt-4">
                      Identificação do Projeto
                    </Title>
                    <Descriptions bordered column={1} size="small">
                      {identificacaoEntries.map(([key, value]) => (
                        <Descriptions.Item
                          key={key}
                          label={fieldConfig[key]?.label ?? key}
                        >
                          {renderValue(key, value)}
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  </>
                )}

                <Title level={4} className="mt-6">
                  Informações do Projeto
                </Title>
                <Descriptions bordered column={1} size="small">
                  {selectedItem.logoUrl && (
                    <Descriptions.Item label={fieldConfig.logoUrl.label}>
                      {renderValue("logoUrl", selectedItem.logoUrl)}
                    </Descriptions.Item>
                  )}
                  {selectedItem.projetoImg &&
                    selectedItem.projetoImg.length > 0 && (
                      <Descriptions.Item label={fieldConfig.projetoImg.label}>
                        {renderValue("projetoImg", selectedItem.projetoImg)}
                      </Descriptions.Item>
                    )}
                  {infoEntries.map(([key, value]) => (
                    <Descriptions.Item
                      key={key}
                      label={fieldConfig[key]?.label ?? key}
                    >
                      {renderValue(key, value)}
                    </Descriptions.Item>
                  ))}
                </Descriptions>

                {metaEntries.length > 0 && (
                  <>
                    <Title level={4} className="mt-6">
                      Metadados
                    </Title>
                    <Descriptions bordered column={1} size="small">
                      {metaEntries.map(([key, value]) => (
                        <Descriptions.Item
                          key={key}
                          label={fieldConfig[key]?.label ?? key}
                        >
                          {renderValue(key, value)}
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  </>
                )}
              </>
            );
          })()}

          {renderDiffTable(
            "pendente_exclusao",
            "error",
            "Solicitação de Exclusão",
            ["projetoId", "confirmacao"]
          )}

          {renderDiffTable(
            "pendente_atualizacao",
            "info",
            "Dados para Atualizar",
            ["motivoExclusao"]
          )}
        </Modal>
      )}

      <AdminProjetoModal
        projeto={selectedItem}
        visible={isEditModalVisible}
        onClose={(shouldRefresh) => {
          setIsEditModalVisible(false);
          if (shouldRefresh) {
            setModalVisible(false);
            setSelectedItem(null);
            fetchData();
          }
        }}
        mode="edit-and-approve"
        onEditAndApprove={handleEditAndApproveSubmit}
      />

      <Modal
        title="Confirmar Rejeição"
        open={isRejectModalVisible}
        onCancel={() => {
          setIsRejectModalVisible(false);
          setRejectionReason("");
        }}
        onOk={() => handleAction("reject", rejectionReason)}
        confirmLoading={isActionLoading}
        okText="Confirmar Rejeição"
        cancelText="Voltar"
        okButtonProps={{ danger: true }}
      >
        <Typography.Text strong className="block mb-2">
          Por favor, informe o motivo da rejeição (será enviado ao usuário):
        </Typography.Text>
        <TextArea
          rows={4}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="O projeto foi rejeitado pois..."
        />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
