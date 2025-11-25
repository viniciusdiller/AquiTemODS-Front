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
  Image as AntdImage,
  Tag,
  Popconfirm,
  Rate,
} from "antd";
import { CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { adminUpdateProjeto } from "@/lib/api";
import { Projeto, Imagens } from "@/types/Interface-Projeto";
import { ApoioPlanejamento } from "@/app/cadastro-projeto/page";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import "@/app/cadastro-projeto/quill-styles.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <Spin
      size="large"
      style={{ display: "block", margin: "20px auto", minHeight: "150px" }}
    />
  ),
});

const quillModules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  onEditAndApprove: (values: any) => Promise<void>;
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
  const [outrasAlteracoes, setOutrasAlteracoes] = useState<string | null>(null);

  const [currentLogo, setCurrentLogo] = useState<string | null>(null);

  const [currentPortfolio, setCurrentPortfolio] = useState<Imagens[]>([]);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string[]>([]);
  const [logoToDelete, setLogoToDelete] = useState<boolean>(false);

  useEffect(() => {
    if (projeto) {
      let dataToEdit: any = { ...projeto };

      setCurrentLogo(projeto.logoUrl || null);

      setCurrentPortfolio(projeto.projetoImg || []);
      setPortfolioToDelete([]);
      setLogoToDelete(false);

      if (
        projeto.status === "pendente_atualizacao" &&
        projeto.dados_atualizacao
      ) {
        dataToEdit = { ...projeto, ...projeto.dados_atualizacao };
        setOutrasAlteracoes(projeto.dados_atualizacao.outrasAlteracoes || null);
        if (projeto.dados_atualizacao.logo) {
          setCurrentLogo(projeto.dados_atualizacao.logo);
        }
        if (projeto.dados_atualizacao.imagens) {
          const novasImagens = projeto.dados_atualizacao.imagens.map(
            (url: string, index: number) => ({
              id: `new-${index}`,
              url: url,
            })
          );

          setCurrentPortfolio(novasImagens);
        }
        delete dataToEdit.outrasAlteracoes;
      } else {
        setOutrasAlteracoes(null);
      }

      if (dataToEdit.hasOwnProperty("venceuPspe")) {
        dataToEdit.venceuPspe =
          String(dataToEdit.venceuPspe).toLowerCase() === "true" ||
          dataToEdit.venceuPspe === true;
      }

      if (typeof dataToEdit.odsRelacionadas === "string") {
        dataToEdit.odsRelacionadas = dataToEdit.odsRelacionadas
          .split(",")
          .map((s: string) => s.trim());
      }
      if (typeof dataToEdit.apoio_planejamento === "string") {
        dataToEdit.apoio_planejamento = dataToEdit.apoio_planejamento
          .split(",")
          .map((s: string) => s.trim());
      }

      editForm.setFieldsValue(dataToEdit);
    } else {
      editForm.resetFields();
      setOutrasAlteracoes(null);
      setCurrentLogo(null);
      setCurrentPortfolio([]);
      setPortfolioToDelete([]);
      setLogoToDelete(false);
    }
  }, [projeto, visible, editForm]);

  const handleSubmit = async (values: any) => {
    if (!projeto) return;

    setIsEditLoading(true);

    if (Array.isArray(values.odsRelacionadas)) {
      values.odsRelacionadas = values.odsRelacionadas.join(", ");
    }

    if (Array.isArray(values.apoio_planejamento)) {
      values.apoio_planejamento = values.apoio_planejamento.join(", ");
    }

    const finalValues = { ...values };

    if (logoToDelete) {
      finalValues.logoUrl = null;
    }

    if (portfolioToDelete.length > 0) {
      finalValues.urlsParaExcluir = portfolioToDelete;
    }

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        message.error("Autenticação expirada.");
        setIsEditLoading(false);
        return;
      }

      if (mode === "edit-and-approve") {
        await onEditAndApprove(finalValues);
        message.success("Projeto editado e aprovado!");
      } else {
        await adminUpdateProjeto(projeto.projetoId, finalValues, token);
        message.success("Projeto atualizado com sucesso!");
      }

      onClose(true);
    } catch (error: any) {
      message.error(error.message || "Falha ao salvar.");
    } finally {
      setIsEditLoading(false);
    }
  };

  const getFullImageUrl = (path: string): string => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:")) {
      return path;
    }
    const normalizedPath = path.replace(/\\/g, "/");
    const cleanPath = normalizedPath.startsWith("/")
      ? normalizedPath.substring(1)
      : normalizedPath;
    return `${API_URL}/${cleanPath}`;
  };

  const handleViewOficio = () => {
    if (projeto?.oficioUrl) {
      window.open(getFullImageUrl(projeto.oficioUrl), "_blank");
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
          {outrasAlteracoes && (
            <Alert
              message="Solicitação de 'Outras Alterações' do Usuário"
              description={
                <Typography.Paragraph pre-wrap>
                  {outrasAlteracoes}
                </Typography.Paragraph>
              }
              type="info"
              showIcon
              className="mb-4"
            />
          )}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="responsavelProjeto"
                label="Responsável pelo Projeto"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="oficio"
                label="Ofício do Projeto"
                rules={[{ required: true }]}
              >
                {projeto?.oficioUrl ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Button type="primary" onClick={handleViewOficio}>
                      Visualizar Ofício Anexado
                    </Button>
                  </div>
                ) : (
                  <span style={{ color: "red" }}>Nenhum ofício anexado.</span>
                )}
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
                label="Site da Prefeitura"
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
            className="quill-editor-container"
          >
            <ReactQuill
              theme="snow"
              modules={quillModules}
              placeholder="Descreva o projeto em detalhes, você pode usar negrito, itálico..."
              style={{ minHeight: "10px" }}
            />
          </Form.Item>

          <Form.Item name="odsRelacionadas" label="ODS Relacionadas">
            <Select mode="multiple" placeholder="Selecione as ODS relacionadas">
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

          <Form.Item
            name="venceuPspe"
            label="Venceu o Prêmio PSPE?"
            rules={[{ required: true, message: "Selecione uma opção" }]}
          >
            <Select placeholder="Selecione uma opção">
              <Option value={true}>Sim</Option>
              <Option value={false}>Não</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="apoio_planejamento"
            label="De que forma você acredita que a plataforma Aqui tem ODS pode apoiar o planejamento, monitoramento e a integração das ações da sua secretaria ou setor?"
          >
            <Select
              mode="multiple"
              placeholder="Selecione todas as opções que se aplicam."
              allowClear
            >
              {/* Usamos a constante importada */}
              {ApoioPlanejamento.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="escala"
            label="Nota de Impacto (0-10)"
            help="Nota que o usuário deu sobre o impacto da plataforma."
          >
            <Rate count={10} />
          </Form.Item>

          {/* --- SEÇÃO DE GERENCIAMENTO DE IMAGENS --- */}
          <Title level={5} className="mt-4">
            Gerenciamento de Imagens
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <Title level={5} style={{ fontSize: "16px" }}>
                Logo
              </Title>
              {currentLogo ? (
                <div style={{ position: "relative", width: "fit-content" }}>
                  <AntdImage
                    src={getFullImageUrl(currentLogo)}
                    alt="Logo do Projeto"
                    style={{
                      width: 150,
                      height: 150,
                      objectFit: "cover",
                      border: "1px solid #d9d9d9",
                      borderRadius: "8px",
                    }}
                    fallback="/placeholder-logo.svg"
                  />
                  <Popconfirm
                    title="Remover esta logo?"
                    okText="Remover"
                    cancelText="Cancelar"
                    okType="danger"
                    placement="topRight"
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                    onConfirm={() => {
                      setLogoToDelete(true);
                      setCurrentLogo(null);
                      message.info("Logo marcada para remoção.");
                    }}
                  >
                    <Button
                      type="primary"
                      danger
                      icon={<CloseOutlined />}
                      style={{ position: "absolute", top: 5, right: 5 }}
                      size="small"
                      title="Remover Logo"
                    />
                  </Popconfirm>
                </div>
              ) : (
                <p>{logoToDelete ? "Logo será removida." : "Nenhuma logo."}</p>
              )}
            </Col>
            <Col span={12}>
              <Title level={5} style={{ fontSize: "16px" }}>
                Imagens do Portfólio
              </Title>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {currentPortfolio.length > 0 ? (
                  currentPortfolio.map((img) => (
                    <div
                      key={img.url}
                      style={{ position: "relative", width: "fit-content" }}
                    >
                      <AntdImage
                        src={getFullImageUrl(img.url)}
                        alt="Imagem do Portfólio"
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          border: "1px solid #d9d9d9",
                          borderRadius: "8px",
                        }}
                        fallback="/placeholder-logo.svg"
                      />
                      <Popconfirm
                        title="Tem certeza que quer remover esta imagem?"
                        okText="Remover"
                        cancelText="Cancelar"
                        okType="danger"
                        placement="topRight"
                        icon={
                          <QuestionCircleOutlined style={{ color: "red" }} />
                        }
                        onConfirm={() => {
                          setPortfolioToDelete((prev) => [...prev, img.url]);
                          setCurrentPortfolio((prev) =>
                            prev.filter((i) => i.url !== img.url)
                          );
                          message.info("Imagem marcada para remoção.");
                        }}
                      >
                        <Button
                          type="primary"
                          danger
                          icon={<CloseOutlined />}
                          style={{ position: "absolute", top: 5, right: 5 }}
                          size="small"
                          title="Remover Imagem"
                        />
                      </Popconfirm>
                    </div>
                  ))
                ) : (
                  <p>Nenhuma imagem no portfólio.</p>
                )}
                {portfolioToDelete.length > 0 && (
                  <Tag color="red" style={{ marginTop: 10, width: "100%" }}>
                    {portfolioToDelete.length} imagem(ns) serão removidas.
                  </Tag>
                )}
              </div>
            </Col>
          </Row>
        </Spin>
      </Form>
    </Modal>
  );
};

export default AdminProjetoModal;
