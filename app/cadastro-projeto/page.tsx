"use client";

import React, { useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  message,
  Spin,
  Row,
  Col,
  Result,
  Checkbox,
  Radio,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  cadastrarProjeto,
  solicitarAtualizacaoProjeto,
  solicitarExclusaoProjeto,
} from "@/lib/api";

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

const odsRelacionadas: { [key: string]: string[] } = {
  "ODS 1 - Erradicação da Pobreza": [
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 2 - Fome Zero e Agricultura Sustentável": [
    "ODS 1",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 3 - Saúde e Bem-estar": [
    "ODS 1",
    "ODS 2",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 4 - Educação de Qualidade": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 5 - Igualdade de Gênero": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 6 - Água Potável e Saneamento": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 7 - Energia Acessível e Limpa": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 8 - Trabalho Decente e Crescimento Econômico": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 9 - Indústria, Inovação e Infraestrutura": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 10 - Redução das Desigualdades": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 11 - Cidades e Comunidades Sustentáveis": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 12 - Consumo e Produção Responsáveis": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 13 - Ação Contra a Mudança Global do Clima": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 14 - Vida na Água": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 15",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 15 - Vida Terrestre": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 16",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 16 - Paz, Justiça e Instituições Eficazes": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 17",
    "ODS 18",
  ],
  "ODS 17 - Parcerias e Meios de Implementação": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 18",
  ],
  "ODS 18 - Igualdade Étnico/Racial": [
    "ODS 1",
    "ODS 2",
    "ODS 3",
    "ODS 4",
    "ODS 5",
    "ODS 6 ",
    "ODS 7",
    "ODS 8",
    "ODS 9",
    "ODS 10",
    "ODS 11",
    "ODS 12",
    "ODS 13",
    "ODS 14",
    "ODS 15",
    "ODS 16",
    "ODS 17",
  ],
};

const { Option } = Select;
const { TextArea } = Input;

type FlowStep = "initial" | "register" | "update" | "delete" | "submitted";

const CadastroProjetoPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  const [portfolioFileList, setPortfolioFileList] = useState<UploadFile[]>([]);
  const [flowStep, setFlowStep] = useState<FlowStep>("initial");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState({
    title: "",
    subTitle: "",
  });
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const toastShownRef = useRef(false);

  const stripEmojis = (value: string) => {
    if (!value) return "";
    return value.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ""
    );
  };

  const handleLogoChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setLogoFileList(fileList);

  const handlePortfolioChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setPortfolioFileList(fileList);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      if (!toastShownRef.current) {
        toast.error("Você precisa estar logado para cadastrar um Projeto.");
        toastShownRef.current = true;
      }
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex items-center space-x-3">
          <p className="text-xl font-medium text-gray-700">
            Verificando autenticação
          </p>

          {/* Os Pontos Pulsantes */}
          <div className="flex space-x-1.5">
            <span className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    );
  }

  const maskId = (value: string) => {
    return value.replace(/\D/g, "");
  };

  const resetAll = () => {
    form.resetFields();
    setLogoFileList([]);
    setPortfolioFileList([]);
    setSelectedCategory(null);
    setFlowStep("initial");
  };

  const handleRegisterSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (
          value &&
          key !== "logo" &&
          key !== "projeto" &&
          key !== "venceuPspe"
        ) {
          if (key === "ODS Relacionadas" && Array.isArray(value)) {
            formData.append(key, value.join(", "));
          } else {
            formData.append(key, value as string);
          }
        }
      });

      formData.append("venceuPspe", String(values.venceuPspe));

      if (logoFileList.length > 0 && logoFileList[0].originFileObj) {
        formData.append("logo", logoFileList[0].originFileObj);
      }

      portfolioFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("imagens", file.originFileObj);
        }
      });

      await cadastrarProjeto(formData);

      setSubmittedMessage({
        title: "Cadastro realizado com sucesso!",
        subTitle:
          "Sua solicitação foi recebida. Em breve seu projeto estará visível na plataforma para todo o Brasil.",
      });
      setFlowStep("submitted");
    } catch (error: any) {
      message.error(
        error.message || "Ocorreu um erro. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (values: any) => {
    setLoading(true);
    try {
      const { projetoId, ...updateData } = values;
      if (!projetoId) {
        message.error("O ID do projeto é obrigatório para a atualização.");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      Object.entries(updateData).forEach(([key, value]) => {
        if (
          value &&
          key !== "logo" &&
          key !== "projeto" &&
          key !== "venceuPspe"
        ) {
          if (key === "locais" && Array.isArray(value)) {
            formData.append("areasAtuacao", value.join(", "));
          } else if (key === "ODS Relacionadas" && Array.isArray(value)) {
            formData.append(key, value.join(", "));
          } else {
            formData.append(key, value as string);
          }
        }
      });

      if (updateData.venceuPspe !== undefined) {
        formData.append("venceuPspe", String(updateData.venceuPspe));
      }

      if (logoFileList.length > 0 && logoFileList[0].originFileObj) {
        formData.append("logo", logoFileList[0].originFileObj);
      }

      portfolioFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("imagens", file.originFileObj);
        }
      });

      await solicitarAtualizacaoProjeto(projetoId, formData);
      setSubmittedMessage({
        title: "Atualização enviada com sucesso!",
        subTitle:
          "Recebemos suas alterações. Elas serão analisadas e aplicadas em seu perfil em breve.",
      });
      setFlowStep("submitted");
    } catch (error: any) {
      message.error(
        error.message || "Ocorreu um erro ao enviar a atualização."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async (values: any) => {
    setLoading(true);
    try {
      const {
        projetoId,
        nomeProjeto,
        motivo,
        prefeitura,
        secretaria,
        emailContato,
      } = values;

      if (
        !projetoId ||
        !nomeProjeto ||
        !motivo ||
        !prefeitura ||
        !secretaria ||
        !emailContato
      ) {
        message.error("Todos os campos do formulário são obrigatórios.");
        setLoading(false);
        return;
      }

      const dadosParaEnviar = {
        projetoId,
        nomeProjeto,
        motivo,
        prefeitura,
        secretaria,
        emailContato,
      };

      await solicitarExclusaoProjeto(projetoId, dadosParaEnviar);

      setSubmittedMessage({
        title: "Solicitação de exclusão recebida!",
        subTitle:
          "Sua solicitação foi registrada. A remoção do seu perfil da plataforma será processada em breve. Sentiremos sua falta!",
      });
      setFlowStep("submitted");
    } catch (error: any) {
      message.error(
        error.message || "Ocorreu um erro ao solicitar a exclusão."
      );
    } finally {
      setLoading(false);
    }
  };

  const customUploadAction = async (options: any) => {
    const { onSuccess, onError, file } = options;
    setTimeout(() => {
      try {
        onSuccess(file);
      } catch (err) {
        onError(new Error("Erro no upload simulado"));
      }
    }, 500);
  };

  const commonTitle = (title: string) => (
    <h2
      className="relative text-2xl font-semibold text-gray-800 mb-6 pl-4 
        before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 
        before:bg-gradient-to-t from-[#D7386E] to-[#3C6AB2]"
    >
      {title}
    </h2>
  );

  const renderInitialChoice = () => (
    <>
      <h1 className="text-4xl font-extrabold mb-6 inline-block pb-2 bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-no-repeat [background-position:0_100%] [background-size:100%_4px]">
        <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
          AQUI TEM ODS
        </span>
      </h1>
      <p className="text-gray-700 leading-relaxed text-lg mt-4 mb-8">
        Bem-vindo ao portal <strong>Aqui Tem ODS</strong>! Este espaço foi
        criado para fortalecer iniciativas alinhadas aos Objetivos de
        Desenvolvimento Sustentável em Saquarema. Aqui, você pode adicionar,
        atualizar ou remover projetos que contribuem para um futuro mais justo,
        sustentável e colaborativo.
      </p>
      <section className="flex flex-col border-t pt-6">
        <Form.Item
          layout="vertical"
          label={
            <span className="text-lg font-semibold">
              O que você deseja fazer?
            </span>
          }
        >
          <Select
            placeholder="Selecione uma ação"
            onChange={(value) => {
              setSelectedCategory(null);
              form.resetFields();
              setFlowStep(value as FlowStep);
            }}
            size="large"
          >
            <Option value="register">
              Cadastrar meu projeto na plataforma
            </Option>
            <Option value="update">
              Atualizar uma informação do meu projeto
            </Option>
            <Option value="delete">Excluir meu projeto da plataforma</Option>
          </Select>
        </Form.Item>
      </section>
    </>
  );

  const renderRegisterForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleRegisterSubmit}
      autoComplete="off"
    >
      <section className="mb-8 border-t pt-4">
        {commonTitle("Informações do Responsável")}
        <Row gutter={24}>
          <Col xs={24} md={12}>
            {/* CORREÇÃO: name="prefeitura" */}
            <Form.Item
              name="prefeitura"
              label="Nome da Prefeitura"
              rules={[
                { required: true, message: "Insira o nome da Prefeitura!" },
              ]}
            >
              <Input
                placeholder="Ex: Prefeitura Municipal de Saquarema"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ prefeitura: strippedValue });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            {/* CORREÇÃO: name="secretaria" */}
            <Form.Item
              name="secretaria"
              label="Nome da Secretaria"
              rules={[
                {
                  required: true,
                  message: "O Nome da Secretaria é obrigatório!",
                },
              ]}
            >
              <Input
                placeholder="Ex: Secretaria Municipal de Governança e Sustentabilidade"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ secretaria: strippedValue });
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24}>
            <Form.Item
              name="responsavelProjeto"
              label="Responsável pelo Projeto"
              rules={[
                { required: true, message: "Insira o nome do responsável!" },
              ]}
            >
              <Input
                placeholder="Ex: João da Silva"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ responsavelProjeto: strippedValue });
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </section>

      {/* --------------------- Informações do Projeto --------------------- */}
      <section className="mb-8 border-t pt-4">
        {commonTitle("Informações do Projeto")}
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="nomeProjeto"
              label="Nome do Projeto"
              rules={[
                { required: true, message: "Insira o nome do seu Projeto!" },
              ]}
            >
              <Input
                placeholder="Ex: Aqui tem ODS"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ nomeProjeto: strippedValue });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="ods"
              label="ODS principal do Projeto"
              rules={[{ required: true, message: "Selecione uma categoria!" }]}
            >
              <Select
                placeholder="Selecione a ODS principal do Projeto"
                onSelect={(value: string) => setSelectedCategory(value)}
                onChange={() => form.setFieldsValue({ odsRelacionadas: [] })}
              >
                {categorias.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="linkProjeto"
              label="Link do Projeto"
              rules={[
                {
                  required: true,
                  message: "Por favor, insira o link do projeto!",
                },
              ]}
            >
              <Input
                placeholder="Ex: link para um vídeo, site, rede social, etc."
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ linkProjeto: strippedValue });
                }}
              />
            </Form.Item>
            <Form.Item
              name="venceuPspe"
              label="O Projeto é vencedor do Prêmio Sebrae Prefeitura Empreendedora?"
              rules={[{ required: true, message: "Selecione uma opção!" }]}
              initialValue={false}
            >
              <Radio.Group>
                <Radio value={true}>Sim</Radio>
                <Radio value={false}>Não</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            {selectedCategory ? (
              <Form.Item
                name="odsRelacionadas"
                label={`Outras ODS relacionadas`}
                help="Selecione no máximo 5 ODS que também tenham relação ao seu projeto."
                rules={[
                  { required: true, message: "Selecione pelo menos uma tag!" },
                  {
                    validator: (_, value) =>
                      value && value.length > 5
                        ? Promise.reject(
                            new Error("Selecione no máximo 5 tags!")
                          )
                        : Promise.resolve(),
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Selecione até 5 ODS relacionadas"
                  maxTagCount={5}
                >
                  {odsRelacionadas[selectedCategory]?.map((tag) => (
                    <Option key={tag} value={tag}>
                      {tag}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              <p className="text-gray-600 mb-6 mt-2">
                *Selecione uma Categoria na seção "Informações do Projeto" para
                ver as ODS sugeridas.*
              </p>
            )}
          </Col>
        </Row>
      </section>

      {/* --------------------- Contato e Localização --------------------- */}
      <section className="mb-8 border-t pt-4">
        {commonTitle("Contato e Localização")}
        <Form.Item
          name="emailContato"
          label="E-mail de Contato do projeto"
          rules={[
            { required: true, message: "O e-mail é obrigatório!" },
            {
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Formato de e-mail inválido!",
            },
          ]}
        >
          <Input
            placeholder="contato@email.com"
            onChange={(e) => {
              const strippedValue = stripEmojis(e.target.value);
              form.setFieldsValue({ emailContato: strippedValue });
            }}
          />
        </Form.Item>
        <Form.Item name="endereco" label="Endereço Físico (se houver)">
          <Input
            placeholder="Rua, Bairro, Nº"
            onChange={(e) => {
              const strippedValue = stripEmojis(e.target.value);
              form.setFieldsValue({ endereco: strippedValue });
            }}
          />
        </Form.Item>
      </section>

      {/* --------------------- Detalhes e Mídia --------------------- */}
      <section className="mb-8 border-t pt-5">
        {commonTitle("Descrição do Projeto")}
        <Form.Item
          name="descricaoDiferencial"
          label="Briefing do Projeto"
          rules={[
            {
              required: true,
              message: "Por favor, faça um resumo do seu projeto!",
            },
          ]}
        >
          <TextArea
            showCount
            maxLength={150}
            rows={2}
            placeholder="Descreva brevemente o que é o seu projeto. (Em até 150 caracteres)"
            onChange={(e) => {
              const strippedValue = stripEmojis(e.target.value);
              form.setFieldsValue({ descricaoDiferencial: strippedValue });
            }}
          />
        </Form.Item>
        <Form.Item
          name="descricao"
          label="Descrição detalhada do seu Projeto"
          rules={[
            {
              required: true,
              message: "Por favor, descreva seu projeto!",
            },
          ]}
        >
          <TextArea
            showCount
            maxLength={5000}
            rows={4}
            placeholder="Fale um pouco mais detalhadamente sobre o que o seu projeto faz, como ele agrega para a sociedade. Essa é a informação que os usuários da plataforma irão ver. (Em até 5000 caracteres)"
            onChange={(e) => {
              const strippedValue = stripEmojis(e.target.value);
              form.setFieldsValue({ descricao: strippedValue });
            }}
          />
        </Form.Item>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item name="website" label="Site da Prefeitura">
              <Input
                placeholder="Cole o link da página da sua Prefeitura"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ website: strippedValue });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="instagram" label="Instagram (Opcional)">
              <Input
                placeholder="Cole o link do seu perfil"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ instagram: strippedValue });
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Logo do seu Projeto"
              help="Envie 1 imagem para ser a logo do seu projeto."
            >
              <Upload
                customRequest={customUploadAction}
                fileList={logoFileList}
                onChange={handleLogoChange}
                listType="picture"
                maxCount={1}
                accept="image/png, image/jpeg, image/webp"
              >
                <Button icon={<UploadOutlined />}>Carregar Logo</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Imagens do seu Projeto"
              help="Envie até 4 imagens."
            >
              <Upload
                customRequest={customUploadAction}
                fileList={portfolioFileList}
                onChange={handlePortfolioChange}
                listType="picture"
                multiple
                maxCount={4}
                accept="image/png, image/jpeg, image/webp"
              >
                <Button icon={<UploadOutlined />}>Carregar Portfólio</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Form.Item
            name="confirmacao"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Você precisa confirmar esta caixa.")
                      ),
              },
            ]}
          >
            <Checkbox>
              Confirmo que as informações são verdadeiras e de minha
              responsabilidade. Estou ciente de que poderão ser usadas pela
              Prefeitura para divulgação e apoio ao empreendedorismo em
              Saquarema, de acordo com a Lei Geral de Proteção de Dados.
            </Checkbox>
          </Form.Item>
        </Row>
      </section>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          style={{ height: 45, fontSize: "1rem" }}
        >
          Enviar Cadastro
        </Button>
      </Form.Item>
    </Form>
  );

  const renderUpdateForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleUpdateSubmit}
      autoComplete="off"
    >
      <section className="mb-8 border-t pt-4">
        {commonTitle("Identificação do Projeto")}
        <p className="text-gray-600 mb-6 -mt-4">
          Para iniciar a atualização, confirme os dados de identificação do
          projeto.
        </p>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="prefeitura"
              label="Nome da Prefeitura"
              rules={[
                {
                  required: true,
                  message: "O nome é obrigatório para identificação!",
                },
              ]}
            >
              <Input
                placeholder="Ex: Prefeitura Municipal de Saquarema"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ prefeitura: strippedValue });
                }}
              />
            </Form.Item>
            <Form.Item
              name="projetoId"
              label="ID do Projeto"
              rules={[
                {
                  required: true,
                  message: "Insira o ID do seu Projeto para atualização!",
                },
              ]}
            >
              <Input
                placeholder="Insira o ID do Projeto que você deseja atualizar"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                  const valorLimpo = maskId(stripEmojis(e.target.value));
                  form.setFieldsValue({ projetoId: valorLimpo });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="secretaria"
              label="Nome da Secretaria"
              rules={[
                {
                  required: true,
                  message: "É necessário preencher este campo!",
                },
              ]}
            >
              <Input
                placeholder="Ex: Secretaria Municipal de Governança e Sustentabilidade"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ secretaria: strippedValue });
                }}
              />
            </Form.Item>

            <Form.Item
              name="responsavelProjeto"
              label="Responsável pelo Projeto"
              rules={[
                {
                  required: true,
                  message:
                    "O nome do responsável é obrigatório para identificação!",
                },
              ]}
            >
              <Input
                placeholder="Ex: João da Silva"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ responsavelProjeto: strippedValue });
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="nomeProjeto"
              label="Nome do Projeto"
              rules={[
                {
                  required: true,
                  message: "Insira o nome do seu Projeto para identificação!",
                },
              ]}
            >
              <Input
                placeholder="Ex: Aqui tem ODS"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ nomeProjeto: strippedValue });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="emailContato"
              label="E-mail de Contato do projeto"
              rules={[
                {
                  required: true,
                  message: "O e-mail é obrigatório para identificação!",
                },
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "E-mail inválido!",
                },
              ]}
            >
              <Input
                placeholder="contato@email.com"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ emailContato: strippedValue });
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </section>
      <section className="mb-8 border-t pt-4">
        {commonTitle("Informações para Atualizar")}
        <p className="text-gray-600 mb-6 -mt-4">
          Preencha apenas os campos que deseja alterar.{" "}
          <strong>Os campos deixados em branco não serão modificados.</strong>
        </p>

        {/* Adiciona upload de Logo como opcional na atualização */}
        <Form.Item
          label="Nova Logo (Opcional)"
          help="Envie 1 nova imagem para substituir a logo atual."
        >
          <Upload
            customRequest={customUploadAction}
            fileList={logoFileList}
            onChange={handleLogoChange}
            listType="picture"
            maxCount={1}
            accept="image/png, image/jpeg, image/webp"
          >
            <Button icon={<UploadOutlined />}>Carregar Nova Logo</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="descricaoDiferencial"
          label="Novo Briefing do Projeto (Resumo)"
        >
          <TextArea
            showCount
            maxLength={150}
            rows={2}
            placeholder="Descreva brevemente o que é o seu projeto. (Em até 150 caracteres)"
            onChange={(e) => {
              const strippedValue = stripEmojis(e.target.value);
              form.setFieldsValue({ descricaoDiferencial: strippedValue });
            }}
          />
        </Form.Item>

        <Form.Item name="descricao" label="Nova Descrição do projeto">
          <TextArea
            showCount
            maxLength={5000}
            rows={4}
            placeholder="Fale um pouco mais detalhadamente sobre o que o seu projeto faz, como ele agrega para a sociedade. Essa é a informação que os usuários da plataforma irão ver. (Em até 5000 caracteres)"
            onChange={(e) => {
              const strippedValue = stripEmojis(e.target.value);
              form.setFieldsValue({ descricao: strippedValue });
            }}
          />
        </Form.Item>

        <Form.Item
          name="outrasAlteracoes"
          label="Outras Alterações (Opcional)"
          help="Se precisar alterar algo que não está no formulário (ex: site, instagram, endereço), descreva aqui."
        >
          <TextArea
            rows={3}
            placeholder="Ex: Por favor, alterar o website para https://novosite.com e o Instagram para @novoinsta."
            onChange={(e) => {
              const strippedValue = stripEmojis(e.target.value);
              form.setFieldsValue({ outrasAlteracoes: strippedValue });
            }}
          />
        </Form.Item>

        <Form.Item
          name="ods"
          label="Nova ODS Principal (Opcional)"
          help="Selecione uma nova ODS principal para alterar a atual. Isso redefinirá as ODS relacionadas."
          className="mt-10"
        >
          <Select
            placeholder="Selecione a NOVA ODS principal do Projeto"
            onSelect={(value: string) => setSelectedCategory(value)}
            onChange={() => form.setFieldsValue({ odsRelacionadas: [] })}
            allowClear
          >
            {categorias.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedCategory ? (
          <Form.Item
            name="odsRelacionadas"
            label="Novas ODS Relacionadas"
            help="Selecione no máximo 5 ODS. Elas substituirão as atuais."
            rules={[
              // Nenhuma regra 'required'
              {
                validator: (_, value) =>
                  value && value.length > 5
                    ? Promise.reject(new Error("Selecione no máximo 5 tags!"))
                    : Promise.resolve(),
              },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Selecione até 5 ODS relacionadas"
              maxTagCount={5}
            >
              {/* Popula baseado no selectedCategory */}
              {odsRelacionadas[selectedCategory]?.map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <p className="text-gray-600 mb-6 mt-2">
            *Selecione uma Nova ODS Principal acima para ver as ODS relacionadas
            sugeridas.*
          </p>
        )}

        <Form.Item
          name="venceuPspe"
          label="Venceu o prêmio PSPE? (Opcional)"
          help="Selecione 'Sim' ou 'Não' para alterar o status atual."
        >
          <Select placeholder="Não alterar" allowClear>
            <Option value={true}>Sim</Option>
            <Option value={false}>Não</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="portfolio"
          label="Novas Fotos do Portfólio (até 4)"
          help="As imagens enviadas aqui irão substituir as atuais."
        >
          <Upload
            customRequest={customUploadAction}
            fileList={portfolioFileList}
            onChange={handlePortfolioChange}
            listType="picture"
            multiple
            maxCount={4}
            accept="image/png, image/jpeg, image/webp"
          >
            <Button icon={<UploadOutlined />}>Carregar Novas Imagens</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="confirmacao"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("Você precisa confirmar esta caixa.")
                    ),
            },
          ]}
        >
          <Checkbox>
            Confirmo que as informações fornecidas são verdadeiras e de minha
            responsabilidade. Estou ciente de que poderão ser utilizadas pela
            Prefeitura de Saquarema para divulgação e fortalecimento de ações
            relacionadas aos Objetivos de Desenvolvimento Sustentável (ODS), em
            conformidade com a Lei Geral de Proteção de Dados (LGPD).
          </Checkbox>
        </Form.Item>
      </section>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          style={{ height: 45, fontSize: "1rem" }}
        >
          Enviar Atualização
        </Button>
      </Form.Item>
    </Form>
  );

  //PÁGINA DE FORMULÁRIO DE EXCLUSÃO
  const renderDeleteForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleDeleteSubmit}
      autoComplete="off"
    >
      <section className="mb-8 border-t pt-4">
        {commonTitle("Exclusão de Cadastro Projeto")}
        <p className="text-red-700 bg-red-50 p-4 rounded-md mb-6 -mt-2">
          <b>Atenção:</b> Esta ação é permanente e removerá seu Projeto da nossa
          plataforma. Para voltar, será necessário um novo cadastro. Para
          prosseguir, confirme sua identidade.
        </p>

        {/* --------------------- IDENTIFICAÇÃO OBRIGATÓRIA (Layout Corrigido) --------------------- */}

        {/* ID do Projeto (Largura Total) */}
        <Row gutter={24}>
          <Col xs={24}>
            <Form.Item
              name="projetoId"
              label="ID do Projeto"
              rules={[
                {
                  required: true,
                  message: "Insira o ID do seu Projeto para exclusão!",
                },
              ]}
            >
              <Input
                placeholder="Insira o ID do Projeto que você deseja excluir"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                  const valorLimpo = maskId(stripEmojis(e.target.value));
                  form.setFieldsValue({ projetoId: valorLimpo });
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Prefeitura e Secretaria (Meio a Meio) */}
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="prefeitura"
              label="Nome da Prefeitura"
              rules={[
                {
                  required: true,
                  message:
                    "O nome da Prefeitura é necessário para identificação!",
                },
              ]}
            >
              <Input
                placeholder="Ex: Prefeitura Municipal de Saquarema"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ prefeitura: strippedValue });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="secretaria"
              label="Nome da Secretaria"
              rules={[
                {
                  required: true,
                  message: "Digite o nome da Secretaria!",
                },
              ]}
            >
              <Input
                placeholder="Ex: Secretaria Municipal de Governança e Sustentabilidade"
                name="secretaria"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ secretaria: strippedValue });
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Nome do Projeto e Responsável (Meio a Meio) */}
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="nomeProjeto"
              label="Nome do Projeto"
              rules={[
                { required: true, message: "Insira o nome do seu Projeto!" },
              ]}
            >
              <Input
                placeholder="Ex: Aqui tem ODS"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ nomeProjeto: strippedValue });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="responsavelProjeto"
              label="Nome do Responsável pelo Projeto"
              rules={[
                { required: true, message: "Insira o nome do responsável!" },
              ]}
            >
              <Input
                placeholder="Ex: João da Silva"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ responsavelProjeto: strippedValue });
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Email de Contato (Largura Total) */}
        <Row gutter={24}>
          <Col xs={24}>
            <Form.Item
              name="emailContato"
              label="E-mail de Contato do projeto"
              rules={[
                {
                  required: true,
                  message: "O e-mail é obrigatório para identificação!",
                },
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "E-mail inválido!",
                },
              ]}
            >
              <Input
                placeholder="contato@email.com"
                onChange={(e) => {
                  const strippedValue = stripEmojis(e.target.value);
                  form.setFieldsValue({ emailContato: strippedValue });
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* --------------------- FIM DA IDENTIFICAÇÃO OBRIGATÓRIA --------------------- */}

        <Form.Item name="motivo" label="Motivo da exclusão">
          <TextArea
            rows={3}
            placeholder="Sua opinião é importante para nós. Se puder, nos diga por que está saindo."
            onChange={(e) => {
              const strippedValue = stripEmojis(e.target.value);
              form.setFieldsValue({ motivo: strippedValue });
            }}
          />
        </Form.Item>
        <Form.Item
          name="confirmacao"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("Você precisa confirmar a exclusão!")
                    ),
            },
          ]}
        >
          <Checkbox>
            Sim, eu entendo que esta ação é irreversível e desejo excluir meu
            cadastro.
          </Checkbox>
        </Form.Item>
      </section>
      <Form.Item>
        <Button
          type="primary"
          danger
          htmlType="submit"
          block
          loading={loading}
          style={{ height: 45, fontSize: "1rem" }}
        >
          Confirmar Exclusão de Projeto
        </Button>
      </Form.Item>
    </Form>
  );

  const renderSuccess = () => (
    <Result
      status="success"
      title={submittedMessage.title}
      subTitle={submittedMessage.subTitle}
      extra={[
        <Button
          type="primary"
          key="console"
          onClick={resetAll}
          className="mb-6"
        >
          Voltar ao Início
        </Button>,
      ]}
    />
  );

  const renderContent = () => {
    switch (flowStep) {
      case "register":
        return renderRegisterForm();
      case "update":
        return renderUpdateForm();
      case "delete":
        return renderDeleteForm();
      case "submitted":
        return renderSuccess();
      case "initial":
      default:
        return renderInitialChoice();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D7386E] to-[#3C6AB2] py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        <Spin spinning={loading} tip="A processar...">
          {flowStep !== "initial" && flowStep !== "submitted" && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={resetAll}
              className="mb-6"
            >
              Voltar ao início
            </Button>
          )}
          {renderContent()}
        </Spin>
      </div>
    </div>
  );
};

export default CadastroProjetoPage;
