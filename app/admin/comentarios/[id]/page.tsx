"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  List,
  Button,
  Spin,
  message,
  Modal,
  Typography,
  Tag,
  Empty,
  Avatar,
  Pagination,
  Grid, // 1. IMPORTAR GRID
} from "antd";
import { DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { adminGetReviewsByProject, adminDeleteReview } from "@/lib/api";

const { Title, Text } = Typography;
const { confirm } = Modal;
const { useBreakpoint } = Grid; // 2. INICIAR O HOOK DE BREAKPOINT

const PAGE_SIZE = 5;

// Interface para a Avaliação (sem mudanças)
interface AvaliacaoAdmin {
  avaliacoesId: number;
  comentario: string;
  nota: number;
  usuario: {
    usuarioId: number;
    nomeCompleto: string;
    email: string;
  };
}

// Interface para os dados da página (sem mudanças)
interface PageData {
  projeto: {
    projetoId: number;
    nomeProjeto: string;
    ods: string;
  };
  avaliacoes: AvaliacaoAdmin[];
}

const AdminComentariosDoProjeto: React.FC = () => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const params = useParams();
  const projetoId = params.id as string;

  const screens = useBreakpoint(); // 3. OBTER O ESTADO DA TELA

  // fetchData, useEffect, e handleDelete (sem mudanças)
  const fetchData = useCallback(async () => {
    if (!projetoId) return;

    setLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Acesso negado. Faça login novamente.");
      router.push("/admin/login");
      return;
    }

    try {
      const data = await adminGetReviewsByProject(projetoId, token);
      setPageData(data);
      setCurrentPage(1);
    } catch (error: any) {
      message.error(error.message || "Falha ao buscar comentários.");
    } finally {
      setLoading(false);
    }
  }, [projetoId, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = (id: number) => {
    confirm({
      title: "Você tem certeza que quer excluir este comentário?",
      content: "Esta ação não pode ser desfeita.",
      okText: "Sim, excluir",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        setIsActionLoading(true);
        const token = localStorage.getItem("admin_token");
        if (!token) {
          message.error("Sessão expirada.");
          setIsActionLoading(false);
          return;
        }

        try {
          await adminDeleteReview(id, token);
          message.success("Comentário excluído com sucesso!");
          fetchData();
        } catch (error: any) {
          message.error(error.message || "Falha ao excluir comentário.");
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  const pageTitle = pageData?.projeto?.nomeProjeto
    ? `Comentários de: ${pageData.projeto.nomeProjeto}`
    : "Carregando comentários...";

  // Lógica de paginação (sem mudanças)
  const allAvaliacoes = pageData?.avaliacoes || [];
  const totalCount = allAvaliacoes.length;
  const paginatedAvaliacoes = allAvaliacoes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Determina se a tela é pequena (md = 768px)
  const isMobile = !screens.md;

  return (
    // 4. PADDING RESPONSIVO
    <div className="p-4 md:p-8">
      {/* 5. CABEÇALHO RESPONSIVO */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
        {/* Bloco Título + Tag */}
        <div>
          <Title level={isMobile ? 3 : 2} className="m-0" ellipsis>
            {pageTitle}
          </Title>
          {pageData?.projeto?.ods && (
            <Tag
              color="blue"
              className="mt-2"
              style={{ fontSize: "14px", padding: "5px 10px" }}
            >
              Categoria: {pageData.projeto.ods}
            </Tag>
          )}
        </div>

        {/* Bloco Botão Voltar */}
        <Link href="/admin/comentarios" passHref>
          <Button
            icon={<ArrowLeftOutlined />}
            size={isMobile ? "middle" : "large"}
            // Ocupa 100% da largura no mobile
            className={isMobile ? "w-full" : ""}
          >
            Voltar para Projetos
          </Button>
        </Link>
      </div>

      <Spin spinning={loading}>
        <List
          className="bg-white p-4 md:p-6 rounded-lg shadow-sm"
          itemLayout="vertical"
          dataSource={paginatedAvaliacoes}
          locale={{
            emptyText: (
              <Empty description="Nenhum comentário encontrado para este projeto." />
            ),
          }}
          renderItem={(item: AvaliacaoAdmin) => (
            <List.Item
              key={item.avaliacoesId}
              actions={[
                // 6. BOTÃO DE EXCLUIR RESPONSIVO
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(item.avaliacoesId)}
                  loading={isActionLoading}
                >
                  {/* O texto "Excluir" some em telas pequenas */}
                  {isMobile ? null : "Excluir"}
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={"/avatars/default-avatar.png"} />}
                title={
                  // Adicionado flex-wrap para caso o nome e a tag fiquem grandes
                  <div className="flex flex-wrap items-center gap-2">
                    <Text strong>{item.usuario.nomeCompleto}</Text>
                    <Tag
                      color={
                        item.nota < 3 ? "red" : item.nota > 3 ? "green" : "blue"
                      }
                    >
                      {item.nota} estrela(s)
                    </Tag>
                  </div>
                }
                description={<Text type="secondary">{item.usuario.email}</Text>}
              />
              <div className="mt-3 pl-2 text-base">
                {item.comentario || (
                  <Text type="secondary">(Sem comentário)</Text>
                )}
              </div>
            </List.Item>
          )}
        />

        {totalCount > PAGE_SIZE && (
          <div className="mt-6 text-center">
            {/* 7. PAGINAÇÃO RESPONSIVA */}
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={totalCount}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              // Usa o modo "simple" em telas pequenas
              simple={isMobile}
            />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default AdminComentariosDoProjeto;
