"use client";

import React, { useState } from "react";
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
    "ODS 18",
  ],
  "ODS 2 - Fome Zero e Agricultura Sustentável": [
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
    "ODS 18",
  ],
  "ODS 3 - Saúde e Bem-estar": [
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
    "ODS 18",
  ],
  "ODS 4 - Educação de Qualidade": [
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
    "ODS 18",
  ],
  "ODS 5 - Igualdade de Gênero": [
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
    "ODS 18",
  ],
  "ODS 6 - Água Potável e Saneamento": [
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
    "ODS 18",
  ],
  "ODS 7 - Energia Acessível e Limpa": [
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
  "ODS 9 - Indústria, Inovação e Infraestrutura": [
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
    "ODS 11",
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
    "ODS 12",
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
    "ODS 13",
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
    "ODS 14",
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
    "ODS 15",
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
    "ODS 16",
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
    "ODS 17",
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
    "ODS 18",
  ],
};

const { Option } = Select;
const { TextArea } = Input;

type FlowStep = "initial" | "register" | "update" | "delete" | "submitted";

const CadastroProjetoPaje: React.FC = () => {
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

  const handleLogoChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setLogoFileList(fileList);

  const handlePortfolioChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setPortfolioFileList(fileList);

  useEffect(() => {
    // Se ainda estiver a verificar o estado de login, não faz nada
    if (isLoading) {
      return;
    }

    // Se a verificação terminou e não há utilizador, redireciona
    if (!user) {
      toast.error("Você precisa estar logado para cadastrar um Projeto.");
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // 5. Adicionar um estado de carregamento para a página
  // Isto impede que o formulário apareça rapidamente antes do redirecionamento
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  const handleMaskChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    maskFn: (value: string) => string
  ) => {
    const { name, value } = e.target;
    form.setFieldsValue({ [name]: maskFn(value) });
  };

  const resetAll = () => {
    form.resetFields();
    setLogoFileList([]);
    setPortfolioFileList([]);
    setFlowStep("initial");
  };

  const handleRegisterSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value && key !== "logo" && key !== "projeto") {
          if (key === "ODS Relacionadas" && Array.isArray(value)) {
            formData.append(key, value.join(", "));
          } else {
            formData.append(key, value as string);
          }
        }
      });

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
      const { projetoId, ...updateData } = values; // Extrai o ID do projeto
      if (!projetoId) {
        message.error("O ID do projeto é obrigatório para a atualização.");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      Object.entries(updateData).forEach(([key, value]) => {
        if (value && key !== "portfolio" && key !== "logo") {
          if (key === "locais" && Array.isArray(value)) {
            formData.append("areasAtuacao", value.join(", "));
          } else if (key === "ODS Relacionadas" && Array.isArray(value)) {
            formData.append(key, value.join(", "));
          } else {
            formData.append(key, value as string);
          }
        }
      });

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
      const { projetoId, motivo } = values; // Extrai o ID e o motivo
      if (!projetoId) {
        message.error("O ID do projeto é obrigatório para a exclusão.");
        setLoading(false);
        return;
      }

      // ALTERADO: Chama a nova função da API apenas com os dados necessários
      await solicitarExclusaoProjeto(projetoId, { motivo });

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
            onChange={(value) => setFlowStep(value as FlowStep)}
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
              <Input placeholder="Ex: Prefeitura Municipal de Saquarema" />
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
                name="secretaria"
              />
            </Form.Item>
          </Col>
        </Row>
      </section>

      {/* O RESTANTE DO FORMULÁRIO CONTINUA IGUAL */}
      {/* ... (seções Informações do Projeto, Contato e Localização, Detalhes e Mídia) ... */}

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
              <Input placeholder="Ex: Aqui tem Ods" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="ods" // <-- CORRIGIDO
              label="Categoria Principal"
              rules={[{ required: true, message: "Selecione uma categoria!" }]}
            >
              <Select
                placeholder="Selecione a categoria principal"
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
          <Col xs={24} md={12}></Col>
          <Col xs={24} md={12}></Col>
        </Row>
        {selectedCategory ? (
          <Form.Item
            name="odsRelacionadas"
            label={`Tags de Busca Sugeridas (${selectedCategory})`}
            help="Selecione no máximo 5 ODS para facilitar a busca do seu negócio."
            rules={[
              { required: true, message: "Selecione pelo menos uma tag!" },
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
              {odsRelacionadas[selectedCategory]?.map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <p className="text-gray-600 mb-6 mt-2">
            *Selecione uma Categoria na seção "Informações do Projeto" para ver
            as ODS sugeridas.*
          </p>
        )}
      </section>

      {/* --------------------- Contato e Localização --------------------- */}
      <section className="mb-8 border-t pt-4">
        {commonTitle("Contato e Localização")}
        <Form.Item
          name="emailContato"
          label="E-mail de Contato Principal"
          rules={[
            { required: true, message: "O e-mail é obrigatório!" },
            {
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Formato de e-mail inválido!",
            },
          ]}
        >
          <Input placeholder="contato@email.com" />
        </Form.Item>
        <Form.Item name="endereco" label="Endereço Físico (se houver)">
          <Input placeholder="Rua, Bairro, Nº" />
        </Form.Item>
      </section>

      {/* --------------------- Detalhes e Mídia --------------------- */}
      <section className="mb-8 border-t pt-5">
        {commonTitle("Detalhes e Mídia")}
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
            rows={4}
            placeholder="Fale um pouco mais detalhadamente sobre o que o seu projeto faz, como ele agrega para a sociedade. Essa é a informação que os usuários da plataforma irão ver."
          />
        </Form.Item>
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
            rows={2}
            placeholder="Descreva brevemente qual é o diferencial do seu projeto."
          />
        </Form.Item>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item name="website" label="Site da Prefeitura">
              <Input placeholder="Cole o link da página da sua Prefeitura" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="instagram" label="Instagram (Opcional)">
              <Input placeholder="Cole o link do seu perfil" />
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
        {commonTitle("Identificação do Negócio")}
        <p className="text-gray-600 mb-6 -mt-4">
          Para iniciar a atualização, confirme os dados de identificação do
          negócio e do responsável.
        </p>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            {/* CORREÇÃO: name="prefeitura" */}
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
              <Input placeholder="Nome da Prefeitura" />
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
              <Input placeholder="Insira o ID do Projeto que você deseja atualizar" />
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
                  message: "O CF é  inválido!",
                },
              ]}
            >
              <Input
                placeholder="Nome da Secretaria"
                name="secretaria"
                onChange={(e) => e}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}></Col>
          <Col xs={24} md={12}></Col>
        </Row>
        <Form.Item
          name="emailContato"
          label="E-mail de Contato Principal"
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
          <Input placeholder="contato@email.com" />
        </Form.Item>
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
          >
            <Button icon={<UploadOutlined />}>Carregar Nova Logo</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="descricao" label="Nova Descrição do Serviço/Produto">
          <TextArea
            rows={4}
            placeholder="Fale um pouco mais detalhadamente sobre o que o seu projeto faz, como ele agrega para a sociedade. Essa é a informação que os usuários da plataforma irão ver."
          />
        </Form.Item>
        <Form.Item
          name="odsRelacionadas"
          label="Novas Tags de Busca (Até 5)"
          help="Selecione até 5 ODS relacionadas. As novas tags substituirão as atuais."
          rules={[
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
            placeholder="Selecione as tags"
            maxTagCount={5}
          >
            {Object.values(odsRelacionadas)
              .flat()
              .map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
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

        {/* --------------------- IDENTIFICAÇÃO OBRIGATÓRIA --------------------- */}
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="nomeResponsavel"
              label="Nome da Prefeitura"
              rules={[
                {
                  required: true,
                  message:
                    "O nome da Prefeitura é neceesário para identificação!",
                },
              ]}
            >
              <Input placeholder="Nome da Prefeitura" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
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
              <Input placeholder="Insira o ID do Projeto que você deseja excluir" />
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
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={24}>
            <Form.Item
              name="nomeProjeto"
              label="Nome do Projeto"
              rules={[
                { required: true, message: "Insira o nome do seu Projeto!" },
              ]}
            >
              <Input placeholder="Ex: Aqui tem ODS" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="emailContato"
          label="E-mail de Contato Principal"
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
          <Input placeholder="contato@email.com" />
        </Form.Item>
        {/* --------------------- FIM DA IDENTIFICAÇÃO OBRIGATÓRIA --------------------- */}

        <Form.Item name="motivo" label="Motivo da exclusão (Opcional)">
          <TextArea
            rows={3}
            placeholder="Sua opinião é importante para nós. Se puder, nos diga por que está saindo."
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
        <Button type="primary" key="console" onClick={resetAll}>
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
              onClick={() => setFlowStep("initial")}
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

export default CadastroProjetoPaje;
