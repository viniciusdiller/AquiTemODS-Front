import React from "react";
import { Modal, Button, Descriptions, Typography, Alert, Table } from "antd";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { Projeto } from "@/types/Interface-Projeto";
import { fieldConfig, StatusProjeto } from "./DashboardConstants";
import { renderValue } from "./DashboardHelpers";
import { PrefeituraLogo } from "@/components/ui/PrefeituraLogo";

const { Title } = Typography;
const { Column } = Table;

interface Props {
  visible: boolean;
  selectedItem: Projeto | null;
  isActionLoading: boolean;
  onCancel: () => void;
  onRejectClick: () => void;
  onEditClick: () => void;
  onApproveClick: () => void;
}

export const ProjectDetailsModal: React.FC<Props> = ({
  visible,
  selectedItem,
  isActionLoading,
  onCancel,
  onRejectClick,
  onEditClick,
  onApproveClick,
}) => {
  if (!selectedItem) return null;

  const renderDiffTable = (
    status: "pendente_atualizacao" | "pendente_exclusao",
    alertType: "info" | "error",
    title: string,
    keysToFilter: string[] = [],
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
      oficio: { oldKey: "oficioUrl", labelKey: "oficio" },
    };

    const diffDataAll = Object.entries(selectedItem.dados_atualizacao)
      .filter(([key]) => !keysToFilter.includes(key))
      .map(([key, newValue]) => {
        const mapping = keyMap[key];
        const oldKey = mapping ? mapping.oldKey : key;
        const labelKey = mapping ? mapping.labelKey : key;

        const oldValue = (selectedItem as any)[oldKey];
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
          (fieldConfig[b.newKey]?.order ?? 999),
      );

    const outrasAlteracoesUpdate = diffDataAll.find(
      (d) => d.newKey === "outrasAlteracoes",
    );
    const diffData = diffDataAll.filter((d) => d.newKey !== "outrasAlteracoes");

    const identificacaoDiff = diffData.filter(
      (d) =>
        fieldConfig[d.newKey]?.group === "identificacao" ||
        fieldConfig[d.key]?.group === "identificacao",
    );

    const infoDiff = diffData.filter(
      (d) =>
        fieldConfig[d.newKey]?.group === "info" ||
        fieldConfig[d.key]?.group === "info",
    );

    const metaDiff = diffData.filter(
      (d) =>
        (fieldConfig[d.newKey]?.group === "meta" ||
          fieldConfig[d.key]?.group === "meta") &&
        fieldConfig[d.newKey]?.group !== "identificacao" &&
        fieldConfig[d.key]?.group !== "identificacao" &&
        fieldConfig[d.newKey]?.group !== "info" &&
        fieldConfig[d.key]?.group !== "info",
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
                      outrasAlteracoesUpdate.newValue,
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

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-full border shadow-sm flex items-center justify-center overflow-hidden">
            {/* AQUI MOSTRA A LOGO NO TÍTULO DO MODAL */}
            <PrefeituraLogo
              nomePrefeitura={selectedItem.prefeitura}
              tipo="p"
              className="max-w-full max-h-full object-contain p-1.5"
            />
          </div>
          <span>Detalhes de {selectedItem.nomeProjeto}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button
          key="reject"
          onClick={onRejectClick}
          icon={<CloseOutlined />}
          danger
          loading={isActionLoading}
        >
          Recusar
        </Button>,
        selectedItem.status !== StatusProjeto.PENDENTE_EXCLUSAO && (
          <Button
            key="edit_and_approve"
            onClick={onEditClick}
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
            onClick={onApproveClick}
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
            onClick={onApproveClick}
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
              fieldConfig[key],
          )
          .sort(
            ([keyA], [keyB]) =>
              (fieldConfig[keyA]?.order ?? 999) -
              (fieldConfig[keyB]?.order ?? 999),
          );

        const identificacaoEntries = allEntries.filter(
          ([key]) => fieldConfig[key]?.group === "identificacao",
        );
        const infoEntries = allEntries.filter(
          ([key]) => fieldConfig[key]?.group === "info",
        );
        const metaEntries = allEntries.filter(
          ([key]) => fieldConfig[key]?.group === "meta",
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
        ["projetoId", "confirmacao"],
      )}
      {renderDiffTable("pendente_atualizacao", "info", "Dados para Atualizar", [
        "motivoExclusao",
      ])}
    </Modal>
  );
};
