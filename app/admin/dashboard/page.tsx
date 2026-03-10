"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Button,
  Modal,
  message,
  Spin,
  Typography,
  Input,
  Dropdown,
  MenuProps,
  Grid,
} from "antd";
import {
  DatabaseOutlined,
  CommentOutlined,
  HomeOutlined,
  ReadOutlined,
  TeamOutlined,
  MenuOutlined,
  BookOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPendingAdminRequests } from "@/lib/api";
import AdminProjetoModal from "@/components/AdminProjetoModal";
import { Projeto } from "@/types/Interface-Projeto";
import {
  DASHBOARD_PAGE_SIZE,
  StatusProjeto,
} from "@/components/admin/dashboard/DashboardConstants";
import { DashboardListCard } from "@/components/admin/dashboard/DashboardListCard";
import { ProjectDetailsModal } from "@/components/admin/dashboard/ProjectDetailsModal";

const { Title } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface PendingData {
  cadastros: Projeto[];
  atualizacoes: Projeto[];
  exclusoes: Projeto[];
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PendingData>({
    cadastros: [],
    atualizacoes: [],
    exclusoes: [],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Projeto | null>(null);
  const router = useRouter();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [currentPages, setCurrentPages] = useState({
    cadastros: 1,
    atualizacoes: 1,
    exclusoes: 1,
  });
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const menuItems: MenuProps["items"] = [
    {
      key: "home",
      label: (
        <Link href="/" target="_blank" rel="noopener noreferrer">
          Ir para Home (Site)
        </Link>
      ),
      icon: <HomeOutlined />,
    },
    { type: "divider" },
    {
      key: "projetos",
      label: (
        <Link href="/admin/projetos-ativos">Gerenciar Projetos Ativos</Link>
      ),
      icon: <DatabaseOutlined style={{ color: "#1890ff" }} />,
    },
    {
      key: "sustentai",
      label: <Link href="/admin/sustentai">Gerenciar SustentAí</Link>,
      icon: <ReadOutlined style={{ color: "#D7386E" }} />,
    },
    {
      key: "cursos",
      label: <Link href="/admin/cursos">Gerenciar Cursos (Espaço ODS)</Link>,
      icon: <BookOutlined style={{ color: "#52c41a" }} />,
    },
    {
      key: "comentarios",
      label: <Link href="/admin/comentarios">Gerenciar Comentários</Link>,
      icon: <CommentOutlined style={{ color: "#3C6AB2" }} />,
    },
    {
      key: "usuarios",
      label: <Link href="/admin/usuarios">Gerenciar Usuários</Link>,
      icon: <TeamOutlined style={{ color: "#52c41a" }} />,
    },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Acesso negado.");
      router.push("/admin/login");
      return;
    }
    try {
      const pendingData = await getPendingAdminRequests(token);
      setData(pendingData);
      setCurrentPages({ cadastros: 1, atualizacoes: 1, exclusoes: 1 });
    } catch (error: any) {
      message.error(error.message || "Falha ao buscar dados.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async (
    action: "approve" | "reject",
    motivoRejeicao?: string,
  ) => {
    if (!selectedItem) return;

    setIsActionLoading(true);
    const token = localStorage.getItem("admin_token");

    try {
      const fetchOptions: RequestInit = {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      };

      if (action === "reject") {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          "Content-Type": "application/json",
        };
        fetchOptions.body = JSON.stringify({
          motivoRejeicao: motivoRejeicao || "",
        });
      }

      const response = await fetch(
        `${API_URL}/api/admin/${action}/${selectedItem.projetoId}`,
        fetchOptions,
      );

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || "Erro do servidor");
        } catch (e) {
          throw new Error("Falha na comunicação com o servidor.");
        }
      }

      const result = await response.json();
      message.success(result.message || `Ação executada com sucesso!`);

      setData((prevData) => {
        const newData = { ...prevData };
        (Object.keys(newData) as Array<keyof PendingData>).forEach((key) => {
          newData[key] = newData[key].filter(
            (item) => item.projetoId !== selectedItem.projetoId,
          );
        });
        return newData;
      });

      if (selectedItem.status === StatusProjeto.PENDENTE_APROVACAO)
        setCurrentPages((prev) => ({ ...prev, cadastros: 1 }));
      else if (selectedItem.status === StatusProjeto.PENDENTE_ATUALIZACAO)
        setCurrentPages((prev) => ({ ...prev, atualizacoes: 1 }));
      else if (selectedItem.status === StatusProjeto.PENDENTE_EXCLUSAO)
        setCurrentPages((prev) => ({ ...prev, exclusoes: 1 }));

      setModalVisible(false);
      setIsRejectModalVisible(false);
      setSelectedItem(null);
      setRejectionReason("");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEditAndApproveSubmit = async (values: any) => {
    if (!selectedItem) return;

    setIsActionLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      message.error("Autenticação expirada.");
      setIsActionLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admin/edit-and-approve/${selectedItem.projetoId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setIsEditModalVisible(false);
      setModalVisible(false);
      setSelectedItem(null);
      fetchData();
    } catch (error: any) {
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Spin spinning={loading}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <Title
            level={isMobile ? 3 : 2}
            className="m-0 md:text-left text-center"
          >
            Painel de Administração
          </Title>
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                size="large"
                icon={<MenuOutlined />}
                className="flex items-center gap-2"
              >
                Navegar pelo Sistema
              </Button>
            </Dropdown>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          <DashboardListCard
            title="Novos Cadastros"
            listData={data.cadastros}
            currentPage={currentPages.cadastros}
            pageSize={DASHBOARD_PAGE_SIZE}
            onPageChange={(p) =>
              setCurrentPages((prev) => ({ ...prev, cadastros: p }))
            }
            onDetailsClick={(item) => {
              setSelectedItem(item);
              setModalVisible(true);
            }}
          />
          <DashboardListCard
            title="Atualizações"
            listData={data.atualizacoes}
            currentPage={currentPages.atualizacoes}
            pageSize={DASHBOARD_PAGE_SIZE}
            onPageChange={(p) =>
              setCurrentPages((prev) => ({ ...prev, atualizacoes: p }))
            }
            onDetailsClick={(item) => {
              setSelectedItem(item);
              setModalVisible(true);
            }}
          />
          <DashboardListCard
            title="Exclusões"
            listData={data.exclusoes}
            currentPage={currentPages.exclusoes}
            pageSize={DASHBOARD_PAGE_SIZE}
            onPageChange={(p) =>
              setCurrentPages((prev) => ({ ...prev, exclusoes: p }))
            }
            onDetailsClick={(item) => {
              setSelectedItem(item);
              setModalVisible(true);
            }}
          />
        </Row>
      </Spin>

      <ProjectDetailsModal
        visible={modalVisible}
        selectedItem={selectedItem}
        isActionLoading={isActionLoading}
        onCancel={() => setModalVisible(false)}
        onRejectClick={() => setIsRejectModalVisible(true)}
        onEditClick={() => setIsEditModalVisible(true)}
        onApproveClick={() => handleAction("approve")}
      />

      {isEditModalVisible && (
        <AdminProjetoModal
          projeto={selectedItem}
          visible={isEditModalVisible}
          onClose={(shouldRefresh) => {
            setIsEditModalVisible(false);
            if (shouldRefresh) {
              setModalVisible(false);
              setSelectedItem(null);
              fetchData();
            }
          }}
          mode="edit-and-approve"
          onEditAndApprove={handleEditAndApproveSubmit}
        />
      )}

      <Modal
        title="Confirmar Rejeição"
        open={isRejectModalVisible}
        onCancel={() => {
          setIsRejectModalVisible(false);
          setRejectionReason("");
        }}
        onOk={() => handleAction("reject", rejectionReason)}
        confirmLoading={isActionLoading}
        okText="Confirmar Rejeição"
        cancelText="Voltar"
        okButtonProps={{ danger: true }}
      >
        <Typography.Text strong className="block mb-2">
          Por favor, informe o motivo da rejeição (será enviado ao usuário):
        </Typography.Text>
        <TextArea
          rows={4}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="O projeto foi rejeitado pois..."
        />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
