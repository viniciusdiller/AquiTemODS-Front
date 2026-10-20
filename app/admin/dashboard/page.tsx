"use client";

import {
  getErrorMessage,
  readJsonSafe,
  redirectToAdminLogin,
  safeFetch,
} from "@/lib/http";
import React, { useState, useEffect, useCallback } from "react";
import { Row, Modal, message, Spin, Typography, Input } from "antd";
import { useRouter } from "next/navigation";
import { getPendingAdminRequests } from "@/lib/api";
import AdminProjetoModal from "@/components/AdminProjetoModal";
import { Projeto } from "@/types/Interface-Projeto";
import {
  DASHBOARD_PAGE_SIZE,
  StatusProjeto,
} from "@/components/admin/dashboard/DashboardConstants";
import { DashboardListCard } from "@/components/admin/dashboard/DashboardListCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectDetailsModal } from "@/components/admin/dashboard/ProjectDetailsModal";

const { TextArea } = Input;
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
      message.error(getErrorMessage(error, "Falha ao buscar dados."));
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

      const response = await safeFetch(
        `${API_URL}/api/admin/${action}/${selectedItem.projetoId}`,
        fetchOptions,
      );

      if (response.status === 401) {
        redirectToAdminLogin();
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      if (!response.ok) {
        const errorJson = await readJsonSafe(response);
        throw new Error(
          errorJson?.message || "Falha na comunicação com o servidor.",
        );
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
      message.error(getErrorMessage(error));
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
      const response = await safeFetch(
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
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <AdminPageHeader
          title="Painel de Administração"
          subtitle="Analise as solicitações pendentes e acesse as áreas de gestão da plataforma."
          stats={[
            { label: "Novos cadastros", value: data.cadastros.length },
            { label: "Atualizações", value: data.atualizacoes.length },
            { label: "Exclusões", value: data.exclusoes.length },
            {
              label: "Total pendente",
              value:
                data.cadastros.length +
                data.atualizacoes.length +
                data.exclusoes.length,
            },
          ]}
        />

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Solicitações pendentes
          </h2>
          <Spin spinning={loading}>
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
        </section>
      </div>

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
