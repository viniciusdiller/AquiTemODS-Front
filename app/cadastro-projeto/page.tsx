"use client";

import React, { useState, useRef, useEffect } from "react";
import { Select, Spin, Result, Button, Form } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RegisterForm } from "@/components/cadastro-projeto/RegisterForm";
import { UpdateForm } from "@/components/cadastro-projeto/UpdateForm";
import { DeleteForm } from "@/components/cadastro-projeto/DeleteForm";

import "./quill-styles.css";
import "react-quill/dist/quill.snow.css";

const { Option } = Select;
type FlowStep = "initial" | "register" | "update" | "delete" | "submitted";

const CadastroProjetoPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>("initial");
  const [submittedMessage, setSubmittedMessage] = useState({
    title: "",
    subTitle: "",
  });

  const { user, isLoading } = useAuth();
  const router = useRouter();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;
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
          <div className="flex space-x-1.5">
            <span className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    );
  }

  const resetAll = () => {
    setFlowStep("initial");
    setLoading(false);
  };

  const handleSuccess = (msg: { title: string; subTitle: string }) => {
    setSubmittedMessage(msg);
    setFlowStep("submitted");
  };

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

  const renderContent = () => {
    switch (flowStep) {
      case "register":
        return (
          <RegisterForm setLoading={setLoading} onSuccess={handleSuccess} />
        );
      case "update":
        return <UpdateForm setLoading={setLoading} onSuccess={handleSuccess} />;
      case "delete":
        return <DeleteForm setLoading={setLoading} onSuccess={handleSuccess} />;
      case "submitted":
        return (
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
      case "initial":
      default:
        return renderInitialChoice();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D7386E] to-[#3C6AB2] py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        <Spin spinning={loading} tip="Processando...">
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
