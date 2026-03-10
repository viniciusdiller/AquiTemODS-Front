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
  Radio,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import dynamic from "next/dynamic";
import { Slider } from "@/components/ui/slider";
import { cadastrarProjeto } from "@/lib/api";
import {
  categorias,
  odsRelacionadas,
  ApoioPlanejamento,
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
  commonTitle,
  translateQuillToolbar,
} from "@/components/helpers";
import { PrefeituraLogo } from "@/components/ui/PrefeituraLogo";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const { Option } = Select;
const { TextArea } = Input;

interface Props {
  setLoading: (loading: boolean) => void;
  onSuccess: (msg: { title: string; subTitle: string }) => void;
}

export const RegisterForm: React.FC<Props> = ({ setLoading, onSuccess }) => {
  const [form] = Form.useForm();
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  const [oficioFileList, setOficioFileList] = useState<UploadFile[]>([]);
  const [portfolioFileList, setPortfolioFileList] = useState<UploadFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quillTextLength, setQuillTextLength] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  const escalaValue = Form.useWatch("escala", form);
  const apoioPlanejamentoValue = Form.useWatch("apoio_planejamento", form);

  const prefeituraSelecionada = Form.useWatch("prefeitura", form);

  useEffect(() => {
    if (escalaValue !== undefined) setSliderValue(escalaValue);
  }, [escalaValue]);

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

  const handleRegisterSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (
        values.apoio_planejamento &&
        Array.isArray(values.apoio_planejamento)
      ) {
        const apoioArray = values.apoio_planejamento as string[];
        const outroValue = values.apoio_planejamento_outro;

        if (apoioArray.includes("Outro") && outroValue) {
          values.apoio_planejamento = apoioArray.map((item) =>
            item === "Outro" ? `Outro: ${outroValue}` : item,
          );
        }
      }

      delete values.apoio_planejamento_outro;

      Object.entries(values).forEach(([key, value]) => {
        if (key === "descricao" && (value === "<p><br></p>" || value === ""))
          return;

        if (
          value &&
          key !== "logo" &&
          key !== "projeto" &&
          key !== "venceuPspe"
        ) {
          if (
            (key === "ODS Relacionadas" || key === "apoio_planejamento") &&
            Array.isArray(value)
          ) {
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
      if (oficioFileList.length > 0 && oficioFileList[0].originFileObj) {
        formData.append("oficio", oficioFileList[0].originFileObj);
      }
      portfolioFileList.forEach((file) => {
        if (file.originFileObj) formData.append("imagens", file.originFileObj);
      });

      await cadastrarProjeto(formData);
      onSuccess({
        title: "Cadastro realizado com sucesso!",
        subTitle:
          "Sua solicitação foi recebida. Em breve seu projeto estará visível na plataforma para todo o Brasil.",
      });
    } catch (error: any) {
      message.error(
        error.message || "Ocorreu um erro. Por favor, tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleRegisterSubmit}
      onValuesChange={handleFormValuesChange}
      autoComplete="off"
      onFinishFailed={onFinishFailed}
    >
      <section className="mb-8 border-t pt-4">
        {commonTitle("Informações do Responsável")}
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
            {prefeituraSelecionada && (
              <div className="mt-2 mb-6 flex items-center gap-4 p-4 border rounded-md bg-blue-50/50">
                <div className="w-16 h-16 flex-shrink-0 bg-white rounded-full flex items-center justify-center border shadow-sm overflow-hidden">
                  <PrefeituraLogo
                    nomePrefeitura={prefeituraSelecionada}
                    tipo="p"
                    className="max-w-full max-h-full p-2"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Logótipo vinculado com sucesso!
                  </p>
                  <p className="text-xs text-gray-500">
                    A imagem de{" "}
                    <strong>
                      {prefeituraSelecionada.replace(
                        "Prefeitura Municipal de ",
                        "",
                      )}
                    </strong>{" "}
                    será exibida na plataforma.
                  </p>
                </div>
              </div>
            )}
          </Col>
          <Col xs={24} md={12}>
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
                onChange={(e) =>
                  form.setFieldsValue({
                    secretaria: stripEmojis(e.target.value),
                  })
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="responsavelProjeto"
              label="Responsável pelo Projeto"
              rules={[
                { required: true, message: "Insira o nome do responsável!" },
              ]}
            >
              <Input
                placeholder="Escolha Apenas um Responsável Principal"
                onChange={(e) =>
                  form.setFieldsValue({
                    responsavelProjeto: stripEmojis(e.target.value),
                  })
                }
              />
            </Form.Item>
          </Col>
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
              help="Anexe o documento de ofício (.pdf) com anuência do secretário da pasta para a requisição de inclusão de projeto na plataforma."
            >
              <Upload
                customRequest={customUploadAction}
                fileList={oficioFileList}
                onChange={({ fileList }) => setOficioFileList(fileList)}
                listType="picture"
                maxCount={1}
                accept=".pdf,image/png, image/jpg,image/jpeg"
                onRemove={() => {
                  setOficioFileList([]);
                  form.validateFields(["oficio"]);
                }}
              >
                <Button icon={<UploadOutlined />}>Carregar Ofício</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </section>

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
                placeholder="Insira o link principal do projeto"
                onChange={(e) =>
                  form.setFieldsValue({
                    linkProjeto: stripEmojis(e.target.value),
                  })
                }
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
                label="Outras ODS relacionadas"
                help="Selecione no máximo 5 ODS que também tenham relação ao seu projeto."
                rules={[
                  { required: true, message: "Selecione pelo menos uma tag!" },
                  {
                    validator: (_, value) =>
                      value && value.length > 5
                        ? Promise.reject(
                            new Error("Selecione no máximo 5 tags!"),
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

        <Form.Item
          name="apoio_planejamento"
          label="De que forma você acredita que a plataforma Aqui tem ODS pode apoiar o planejamento, monitoramento e a integração das ações da sua secretaria ou setor?"
          rules={[
            { required: true, message: "Selecione pelo menos uma opção." },
          ]}
          help="Selecione todas as opções que se aplicam."
        >
          <Checkbox.Group
            options={ApoioPlanejamento}
            className="flex flex-col space-y-1 ml-4"
          />
        </Form.Item>

        {Array.isArray(apoioPlanejamentoValue) &&
          apoioPlanejamentoValue.includes("Outro") && (
            <Form.Item
              name="apoio_planejamento_outro"
              label=" "
              colon={false}
              className="ml-2 -mt-8 mb-4"
              rules={[
                {
                  required: true,
                  message: "Por favor, especifique a outra forma de apoio.",
                },
                {
                  max: 80,
                  message:
                    "A especificação não pode ter mais de 80 caracteres.",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Especifique a opção 'Outro'..."
                maxLength={80}
                showCount
                rows={2}
                onChange={(e) =>
                  form.setFieldsValue({
                    apoio_planejamento_outro: stripEmojis(e.target.value),
                  })
                }
              />
            </Form.Item>
          )}

        <Form.Item
          rules={[{ required: true, message: "Por favor, avalie o impacto!" }]}
          name="escala"
          label="Em uma escala de 0 a 10, onde 0 = nenhum impacto e 10 = impacto muito positivo, como você avalia o potencial do Aqui tem ODS para fortalecer a gestão pública sustentável e o alcance das metas da Agenda 2030 em Saquarema?"
          className="mt-10"
        >
          <>
            <Slider
              value={[sliderValue]}
              max={10}
              step={1}
              onValueChange={(value) => {
                setSliderValue(value[0]);
                form.setFieldsValue({ escala: value[0] });
              }}
            />
            <div className="text-center font-bold text-lg text-primary mt-2">
              {sliderValue}
            </div>
          </>
        </Form.Item>
      </section>

      <section className="mb-8 border-t pt-4">
        {commonTitle("Contato e Localização")}
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
              form.setFieldsValue({ emailContato: stripEmojis(e.target.value) })
            }
          />
        </Form.Item>
        <Form.Item name="endereco" label="Endereço Físico (se houver)">
          <Input
            placeholder="Rua, Bairro, Nº"
            onChange={(e) =>
              form.setFieldsValue({ endereco: stripEmojis(e.target.value) })
            }
          />
        </Form.Item>
      </section>

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
            onChange={(e) =>
              form.setFieldsValue({
                descricaoDiferencial: stripEmojis(e.target.value),
              })
            }
          />
        </Form.Item>

        <Form.Item
          name="descricao"
          label="Descrição detalhada do seu Projeto"
          rules={[
            {
              validator: validateQuill(true),
              required: true,
              message: "Por favor, descreva seu projeto!",
            },
          ]}
          help={
            <div className="flex justify-end w-full">
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

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="website"
              label="Site da Prefeitura (Opcional)"
              className="mt-8"
            >
              <Input
                placeholder="Cole o link da página da sua Prefeitura"
                onChange={(e) =>
                  form.setFieldsValue({ website: stripEmojis(e.target.value) })
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="instagram"
              label="Instagram (Opcional)"
              className="mt-8"
            >
              <Input
                placeholder="Cole o link do seu perfil"
                onChange={(e) =>
                  form.setFieldsValue({
                    instagram: stripEmojis(e.target.value),
                  })
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Imagens do seu Projeto"
              help="Envie até 4 imagens. (.jpg, .jpeg ou .png)"
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
                        new Error("Você precisa confirmar esta caixa."),
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
          style={{ height: 45, fontSize: "1rem" }}
        >
          Enviar Cadastro
        </Button>
      </Form.Item>
    </Form>
  );
};
