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
  Grid,
} from "antd";
import {
  DeleteOutlined,
  ArrowLeftOutlined,
  MessageOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { adminGetReviewsByProject, adminDeleteReview } from "@/lib/api";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;
const { useBreakpoint } = Grid;

// Sugestão: Aumente o PAGE_SIZE para 6 ou 8 para preencher melhor o grid
const PAGE_SIZE = 8;

// --- 1. INTERFACES (Sem mudanças) ---
interface AvaliacaoAdmin {
  avaliacoesId: number;
  comentario: string;
  nota: number | null;
  usuario: {
    usuarioId: number;
    nomeCompleto: string;
    email: string;
  };
  parent_id: number | null;
  respostas?: AvaliacaoAdmin[];
}

interface PageData {
  projeto: {
    projetoId: number;
    nomeProjeto: string;
    ods: string;
  };
  avaliacoes: AvaliacaoAdmin[];
}

// --- 2. COMPONENTE RECURSIVO (REFATORADO PARA O GRID) ---
// Este componente agora é um 'card' (<div>) para funcionar dentro do grid
// ---
interface AdminReviewCommentItemProps {
  review: AvaliacaoAdmin;
  handleDelete: (id: number) => void;
  isReply: boolean;
  isMobile: boolean;
  isActionLoading: boolean;
}

const AdminReviewCommentItem: React.FC<AdminReviewCommentItemProps> = ({
  review,
  handleDelete,
  isReply,
  isMobile,
  isActionLoading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasReplies = review.respostas && review.respostas.length > 0;
  const replyCount = review.respostas?.length ?? 0;

  const deleteButton = (
    <Button
      type="primary"
      danger
      icon={<DeleteOutlined />}
      onClick={() => handleDelete(review.avaliacoesId)}
      loading={isActionLoading}
      size={isReply || isMobile ? "small" : "middle"}
      // --- CORREÇÃO DE ALINHAMENTO ---
      className="ml-auto" // Alterado de ml-8 para ml-auto
    >
      {isMobile ? null : "Excluir"}
    </Button>
  );

  const expandButton = !isReply && hasReplies && (
    <Button
      icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
      onClick={() => setIsExpanded(!isExpanded)}
      size={isMobile ? "small" : "middle"}
    >
      {isExpanded
        ? "Esconder"
        : `Ver ${replyCount} ${replyCount === 1 ? "Resposta" : "Respostas"}`}
    </Button>
  );

  return (
    // --- MUDANÇA: Isto não é mais um <List.Item>, é um card <div> ---
    // 'h-full' e 'flex-col' garantem que os cards no grid tenham a mesma altura
    <div
      className={`h-full flex flex-col p-4 border rounded-lg shadow-sm bg-white ${
        isReply ? "ml-4 md:ml-8" : "" // Indentação de resposta
      }`}
    >
      {/* 1. Meta (Cabeçalho do card) */}
      <div className="flex gap-3">
        <Avatar
          src={"/avatars/default-avatar.png"}
          size={isReply ? "small" : "default"}
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Text strong className={isReply ? "text-sm" : ""}>
              {review.usuario.nomeCompleto}
            </Text>
            {review.nota && (
              <Tag
                color={
                  review.nota < 3 ? "red" : review.nota > 3 ? "green" : "blue"
                }
              >
                {review.nota} estrela(s)
              </Tag>
            )}
            {isReply && (
              <Tag icon={<MessageOutlined />} color="default">
                Resposta
              </Tag>
            )}
          </div>
          <Text type="secondary" className={isReply ? "text-xs" : ""}>
            {review.usuario.email}
          </Text>
        </div>
      </div>

      {/* 2. Conteúdo (com 'flex-1' para empurrar o rodapé para baixo) */}
      <div
        className={`mt-3 ${
          isReply ? "pl-10 text-sm" : "pl-2 text-base"
        } flex-1`}
      >
        <Paragraph>
          {review.comentario || <Text type="secondary">(Sem comentário)</Text>}
        </Paragraph>
      </div>

      {/* 3. Respostas recursivas (se expandido) */}
      {isExpanded && hasReplies && (
        <div className="mt-4">
          <List
            itemLayout="vertical"
            dataSource={review.respostas}
            renderItem={(reply) => (
              <AdminReviewCommentItem
                key={reply.avaliacoesId} // Key aqui está correta (lista aninhada)
                review={reply}
                handleDelete={handleDelete}
                isReply={true}
                isMobile={isMobile}
                isActionLoading={isActionLoading}
              />
            )}
          />
        </div>
      )}

      {/* 4. Rodapé de Ações */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        {[expandButton, deleteButton].filter(Boolean)}
      </div>
    </div>
  );
};

// --- 3. COMPONENTE PRINCIPAL (ATUALIZADO) ---
const AdminComentariosDoProjeto: React.FC = () => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const params = useParams();
  const projetoId = params.id as string;
  const screens = useBreakpoint();

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
    // --- CORREÇÃO DO LOOP INFINITO ---
    // Removemos 'router' da lista de dependências
  }, [projetoId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = (id: number) => {
    confirm({
      title: "Você tem certeza que quer excluir este comentário?",
      content: "Esta ação (e suas respostas) não pode ser desfeita.",
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
          fetchData(); // Recarrega a árvore de comentários
        } catch (error: any) {
          message.error(error.message || "Falha ao excluir comentário.");
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  const isMobile = !screens.md;

  const pageTitle = pageData?.projeto?.nomeProjeto
    ? `Comentários de: ${pageData.projeto.nomeProjeto}`
    : "Carregando comentários...";

  // Paginação dos comentários-PAI
  const allAvaliacoes = pageData?.avaliacoes || [];
  const totalCount = allAvaliacoes.length;
  const paginatedAvaliacoes = allAvaliacoes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="p-4 md:p-8">
      {/* Cabeçalho responsivo (sem mudanças) */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
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
        <Link href="/admin/comentarios" passHref>
          <Button
            icon={<ArrowLeftOutlined />}
            size={isMobile ? "middle" : "large"}
            className={isMobile ? "w-full" : ""}
          >
            Voltar para Projetos
          </Button>
        </Link>
      </div>

      <Spin spinning={loading}>
        {/* --- MUDANÇA PARA O LAYOUT DE GRID --- */}
        <List
          // 1. Removemos classes de layout e fundo
          //    (itemLayout="vertical" e className="...")

          // 2. Adicionamos a prop 'grid'
          //    1 coluna em mobile, 2 em desktop
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
          dataSource={paginatedAvaliacoes}
          locale={{
            emptyText: <Empty description="Nenhum comentário encontrado." />,
          }}
          // 3. O renderItem agora envolve o componente no <List.Item>
          renderItem={(item: AvaliacaoAdmin) => (
            // --- CORREÇÃO DA KEY ---
            // A 'key' deve estar no item de lista de nível superior
            <List.Item key={item.avaliacoesId} style={{ height: "100%" }}>
              <AdminReviewCommentItem
                review={item}
                handleDelete={handleDelete}
                isReply={false}
                isMobile={isMobile}
                isActionLoading={isActionLoading}
              />
            </List.Item>
          )}
        />

        {/* Paginação (sem mudanças) */}
        {totalCount > PAGE_SIZE && (
          <div className="mt-6 text-center">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={totalCount}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              simple={isMobile}
            />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default AdminComentariosDoProjeto;
