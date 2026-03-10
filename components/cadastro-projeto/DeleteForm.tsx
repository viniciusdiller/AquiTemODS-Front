"use client";

import React from "react";
import { Form, Input, Button, Row, Col, Checkbox, message, Select } from "antd";
import { solicitarExclusaoProjeto } from "@/lib/api";
import {
  stripEmojis,
  onFinishFailed,
  maskId,
  commonTitle,
} from "@/components/helpers";
import { cidadesRJ } from "@/constants/cadastroProjeto";

const { TextArea } = Input;

interface Props {
  setLoading: (loading: boolean) => void;
  onSuccess: (msg: { title: string; subTitle: string }) => void;
}

export const DeleteForm: React.FC<Props> = ({ setLoading, onSuccess }) => {
  const [form] = Form.useForm();

  const handleDeleteSubmit = async (values: any) => {
    setLoading(true);
    try {
      await solicitarExclusaoProjeto(values.projetoId, values);
      onSuccess({
        title: "Solicitação de exclusão recebida!",
        subTitle:
          "Sua solicitação foi registrada. A remoção do seu perfil da plataforma será processada em breve. Sentiremos sua falta!",
      });
    } catch (error: any) {
      message.error(
        error.message || "Ocorreu um erro ao solicitar a exclusão.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleDeleteSubmit}
      autoComplete="off"
      onFinishFailed={onFinishFailed}
    >
      <section className="mb-8 border-t pt-4">
        {commonTitle("Exclusão de Cadastro Projeto")}
        <p className="text-red-700 bg-red-50 p-4 rounded-md mb-6 -mt-2">
          <b>Atenção:</b> Esta ação é permanente e removerá seu Projeto da nossa
          plataforma. Para voltar, será necessário um novo cadastro. Para
          prosseguir, confirme sua identidade.
        </p>

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
                onChange={(e) =>
                  form.setFieldsValue({
                    projetoId: maskId(stripEmojis(e.target.value)),
                  })
                }
              />
            </Form.Item>
          </Col>
        </Row>

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
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="secretaria"
              label="Nome da Secretaria"
              rules={[
                { required: true, message: "Digite o nome da Secretaria!" },
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
              name="responsavelProjeto"
              label="Nome do Responsável pelo Projeto"
              rules={[
                { required: true, message: "Insira o nome do responsável!" },
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
          <Col xs={24}>
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

        <Form.Item name="motivo" label="Motivo da exclusão">
          <TextArea
            rows={3}
            placeholder="Sua opinião é importante para nós. Se puder, nos diga por que está saindo."
            onChange={(e) =>
              form.setFieldsValue({ motivo: stripEmojis(e.target.value) })
            }
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
                      new Error("Você precisa confirmar a exclusão!"),
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
          style={{ height: 45, fontSize: "1rem" }}
        >
          Confirmar Exclusão de Projeto
        </Button>
      </Form.Item>
    </Form>
  );
};
