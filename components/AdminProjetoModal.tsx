// app/admin/components/AdminProjetoModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Spin,
  Alert,
  message,
  Typography,
} from "antd";
import { adminUpdateProjeto } from "@/lib/api";
import { Projeto } from "@/types/Interface-Projeto";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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

interface AdminProjetoModalProps {
  projeto: Projeto | null;
  visible: boolean;
  onClose: (shouldRefresh: boolean) => void;

  mode: "edit-and-approve" | "edit-only";
  onEditAndApprove: (values: any) => Promise<void>; // Função do dashboard
}

const AdminProjetoModal: React.FC<AdminProjetoModalProps> = ({
  projeto,
  visible,
  onClose,
  mode,
  onEditAndApprove,
}) => {
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editForm] = Form.useForm();

  // Preenche o formulário quando o projeto selecionado muda
  useEffect(() => {
    if (projeto) {
      let dataToEdit: any = { ...projeto };

      // Se for um item de atualização, mescla os dados
      if (
        projeto.status === "pendente_atualizacao" &&
        projeto.dados_atualizacao
      ) {
        dataToEdit = { ...projeto, ...projeto.dados_atualizacao };
      }

      if (typeof dataToEdit.odsRelacionadas === "string") {
        dataToEdit.odsRelacionadas = dataToEdit.odsRelacionadas
          .split(",")
          .map((s: string) => s.trim());
      }

      editForm.setFieldsValue(dataToEdit);
    } else {
      editForm.resetFields();
    }
  }, [projeto, visible, editForm]);

  const handleSubmit = async (values: any) => {
    if (!projeto) return;

    setIsEditLoading(true);

    if (Array.isArray(values.odsRelacionadas)) {
      values.odsRelacionadas = values.odsRelacionadas.join(", ");
    }

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        message.error("Autenticação expirada.");
        setIsEditLoading(false);
        return;
      }

      if (mode === "edit-and-approve") {
        await onEditAndApprove(values);

        message.success("Projeto editado e aprovado!");
      } else {
        await adminUpdateProjeto(projeto.projetoId, values, token);
        message.success("Projeto atualizado com sucesso!");
      }

      onClose(true);
    } catch (error: any) {
      message.error(error.message || "Falha ao salvar.");
    } finally {
      setIsEditLoading(false);
    }
  };

  return (
    <Modal
      title={
        mode === "edit-and-approve"
          ? "Editar e Aprovar Projeto"
          : "Editar Projeto"
      }
      open={visible}
      onCancel={() => onClose(false)}
      width={900}
      footer={[
        <Button key="cancel" onClick={() => onClose(false)}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isEditLoading}
          onClick={() => editForm.submit()}
        >
          {mode === "edit-and-approve" ? "Salvar e Aprovar" : "Salvar Edições"}
        </Button>,
      ]}
    >
      <Form
        form={editForm}
        layout="vertical"
        onFinish={handleSubmit}
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
            <Select mode="multiple" placeholder="Selecione as ODS relacionadas">
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
  );
};

export default AdminProjetoModal;
