"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  Row,
  Col,
  Checkbox,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import dynamic from "next/dynamic";
import { solicitarAtualizacaoProjeto } from "@/lib/api";
import {
  categorias,
  odsRelacionadas,
  cidadesRJ,
  quillModules,
  MAX_QUILL_LENGTH,
} from "@/constants/cadastroProjeto";
import {
  stripEmojis,
  getQuillTextLength,
  customUploadAction,
  onFinishFailed,
  validateQuill,
  maskId,
  commonTitle,
  translateQuillToolbar,
} from "@/components/helpers";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const { Option } = Select;
const { TextArea } = Input;

interface Props {
  setLoading: (loading: boolean) => void;
  onSuccess: (msg: { title: string; subTitle: string }) => void;
}

export const UpdateForm: React.FC<Props> = ({ setLoading, onSuccess }) => {
  const [form] = Form.useForm();
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  const [oficioFileList, setOficioFileList] = useState<UploadFile[]>([]);
  const [portfolioFileList, setPortfolioFileList] = useState<UploadFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quillTextLength, setQuillTextLength] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (translateQuillToolbar()) clearInterval(intervalId);
    }, 200);
    return () => clearInterval(intervalId);
  }, []);

  const handleFormValuesChange = (changedValues: any) => {
    if (changedValues.hasOwnProperty("descricao")) {
      setQuillTextLength(getQuillTextLength(changedValues.descricao));
    }
  };

  const handleUpdateSubmit = async (values: any) => {
    setLoading(true);
    try {
      const { projetoId, ...updateData } = values;
      const formData = new FormData();

      Object.entries(updateData).forEach(([key, value]) => {
        if (key === "descricao" && (value === "<p><br></p>" || value === ""))
          return;
        if (
          value &&
          key !== "logo" &&
          key !== "projeto" &&
          key !== "venceuPspe"
        ) {
          if (key === "locais" && Array.isArray(value))
            formData.append("areasAtuacao", value.join(", "));
          else if (key === "ODS Relacionadas" && Array.isArray(value))
            formData.append(key, value.join(", "));
          else formData.append(key, value as string);
        }
      });

      if (updateData.venceuPspe !== undefined)
        formData.append("venceuPspe", String(updateData.venceuPspe));
      if (logoFileList.length > 0 && logoFileList[0].originFileObj)
        formData.append("logo", logoFileList[0].originFileObj);
      if (oficioFileList.length > 0 && oficioFileList[0].originFileObj)
        formData.append("oficio", oficioFileList[0].originFileObj);
      portfolioFileList.forEach((file) => {
        if (file.originFileObj) formData.append("imagens", file.originFileObj);
      });

      await solicitarAtualizacaoProjeto(projetoId, formData);
      onSuccess({
        title: "Atualização enviada com sucesso!",
        subTitle:
          "Recebemos suas alterações. Elas serão analisadas e aplicadas em seu perfil em breve.",
      });
    } catch (error: any) {
      message.error(
        error.message || "Ocorreu um erro ao enviar a atualização.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleUpdateSubmit}
      onValuesChange={handleFormValuesChange}
      autoComplete="off"
      onFinishFailed={onFinishFailed}
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
              label="Projeto da Prefeitura Municipal"
              rules={[
                { required: true, message: "Insira o nome da Prefeitura!" },
              ]}
            >
              <Select
                showSearch
                placeholder="Selecione a Prefeitura"
                optionFilterProp="label"
                options={cidadesRJ.map((cidade) => ({
                  value: `Prefeitura Municipal de ${cidade}`,
                  label: `Prefeitura Municipal de ${cidade}`,
                }))}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
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
                onChange={(e) =>
                  form.setFieldsValue({
                    projetoId: maskId(stripEmojis(e.target.value)),
                  })
                }
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
                onChange={(e) =>
                  form.setFieldsValue({
                    secretaria: stripEmojis(e.target.value),
                  })
                }
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
                onChange={(e) =>
                  form.setFieldsValue({
                    responsavelProjeto: stripEmojis(e.target.value),
                  })
                }
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
                onChange={(e) =>
                  form.setFieldsValue({
                    nomeProjeto: stripEmojis(e.target.value),
                  })
                }
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
                  type: "email",
                },
              ]}
            >
              <Input
                placeholder="contato@email.com"
                onChange={(e) =>
                  form.setFieldsValue({
                    emailContato: stripEmojis(e.target.value),
                  })
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Col xs={24} md={12}>
          <Form.Item
            name="oficio"
            label="Ofício de Requerimento de Inclusão"
            rules={[
              {
                required: true,
                message: "O envio do Ofício é obrigatório!",
                validator: (_, value) =>
                  oficioFileList && oficioFileList.length > 0
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("O envio do Ofício é obrigatório!"),
                      ),
              },
            ]}
            help="Anexe o documento de ofício (.pdf) com anuência do secretário da pasta."
          >
            <Upload
              customRequest={customUploadAction}
              fileList={oficioFileList}
              onChange={({ fileList }) => setOficioFileList(fileList)}
              listType="picture"
              maxCount={1}
              accept=".pdf,image/png, image/jpg, image/jpeg, image/webp"
              onRemove={() => {
                setOficioFileList([]);
                form.validateFields(["oficio"]);
              }}
            >
              <Button icon={<UploadOutlined />}>Carregar Ofício</Button>
            </Upload>
          </Form.Item>
        </Col>
      </section>

      <section className="mb-8 border-t pt-4">
        {commonTitle("Informações para Atualizar")}
        <p className="text-gray-600 mb-6 -mt-4">
          Preencha apenas os campos que deseja alterar.{" "}
          <strong>Os campos deixados em branco não serão modificados.</strong>
        </p>

        <Form.Item
          label="Nova Logo (Opcional)"
          help="Envie 1 nova imagem para substituir a logo atual. (.jpg, .jpeg ou .png)"
        >
          <Upload
            customRequest={customUploadAction}
            fileList={logoFileList}
            onChange={({ fileList }) => setLogoFileList(fileList)}
            listType="picture"
            maxCount={1}
            accept="image/png, image/jpg, image/jpeg, image/webp"
          >
            <Button icon={<UploadOutlined />}>Carregar Nova Logo</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          className="mt-10"
          name="descricaoDiferencial"
          label="Novo Briefing do Projeto (Resumo)"
        >
          <TextArea
            showCount
            maxLength={150}
            rows={2}
            placeholder="Descreva brevemente o que é o seu projeto. (Em até 150 caracteres)"
            onChange={(e) =>
              form.setFieldsValue({
                descricaoDiferencial: stripEmojis(e.target.value),
              })
            }
          />
        </Form.Item>

        <Form.Item
          name="descricao"
          label="Nova Descrição do projeto"
          rules={[{ validator: validateQuill(false) }]}
          help={
            <div className="flex justify-between w-full">
              <span>Se preenchido, substituirá a descrição atual.</span>
              <span
                className={
                  quillTextLength > MAX_QUILL_LENGTH
                    ? "text-red-500 font-medium"
                    : "text-gray-500"
                }
              >
                {quillTextLength}/{MAX_QUILL_LENGTH}
              </span>
            </div>
          }
        >
          <ReactQuill
            theme="snow"
            modules={quillModules}
            placeholder="Fale um pouco mais detalhadamente sobre o que o seu projeto faz..."
            style={{ minHeight: "10px" }}
          />
        </Form.Item>

        <Form.Item
          className="mt-10"
          name="outrasAlteracoes"
          label="Outras Alterações (Opcional)"
          help="Se precisar alterar algo que não está no formulário (ex: site, instagram, endereço), descreva aqui."
        >
          <TextArea
            rows={3}
            placeholder="Ex: Por favor, alterar o website para https://novosite.com"
            onChange={(e) =>
              form.setFieldsValue({
                outrasAlteracoes: stripEmojis(e.target.value),
              })
            }
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
          className="mt-10"
          name="portfolio"
          label="Novas Imagens do Portfólio (até 4)"
          help="As imagens enviadas aqui irão substituir as atuais. (.jpg, .jpeg ou .png)"
        >
          <Upload
            customRequest={customUploadAction}
            fileList={portfolioFileList}
            onChange={({ fileList }) => setPortfolioFileList(fileList)}
            listType="picture"
            multiple
            maxCount={4}
            accept="image/png, image/jpg, image/jpeg, image/webp"
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
                      new Error("Você precisa confirmar esta caixa."),
                    ),
            },
          ]}
        >
          <Checkbox>
            Confirmo que as informações fornecidas são verdadeiras e de minha
            responsabilidade. Estou ciente de que poderão ser utilizadas pela
            Prefeitura de Saquarema...
          </Checkbox>
        </Form.Item>
      </section>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          style={{ height: 45, fontSize: "1rem" }}
        >
          Enviar Atualização
        </Button>
      </Form.Item>
    </Form>
  );
};
