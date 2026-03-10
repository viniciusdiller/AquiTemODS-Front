import React from "react";
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

export const DASHBOARD_PAGE_SIZE = 5;

export enum StatusProjeto {
  PENDENTE_APROVACAO = "pendente_aprovacao",
  PENDENTE_ATUALIZACAO = "pendente_atualizacao",
  PENDENTE_EXCLUSAO = "pendente_exclusao",
}

export const listIcons: { [key: string]: React.ReactNode } = {
  "Novos Cadastros": <UserAddOutlined style={{ color: "#52c41a" }} />,
  Atualizações: <EditOutlined style={{ color: "#1890ff" }} />,
  Exclusões: <DeleteOutlined style={{ color: "#f5222d" }} />,
};

export const fieldConfig: {
  [key: string]: { label: string; order: number; group: string };
} = {
  projetoId: { label: "ID", order: 1, group: "identificacao" },
  prefeitura: { label: "Prefeitura", order: 2, group: "identificacao" },
  secretaria: { label: "Secretaria", order: 3, group: "identificacao" },
  nomeProjeto: { label: "Nome do Projeto", order: 10, group: "identificacao" },
  responsavelProjeto: {
    label: "Responsável",
    order: 11,
    group: "identificacao",
  },
  emailContato: { label: "Email", order: 20, group: "identificacao" },
  oficioUrl: { label: "Ofício Atual", order: 43, group: "identificacao" },
  oficio: { label: "Novo Ofício", order: 43, group: "identificacao" },

  // --- Grupo de Informações do Projeto ---
  ods: { label: "ODS", order: 4, group: "info" },
  venceuPspe: { label: "Venceu o Prêmio PSPE", order: 6, group: "info" },
  endereco: { label: "Endereço", order: 22, group: "info" },
  descricao: { label: "Descrição", order: 30, group: "info" },
  descricaoDiferencial: { label: "Briefing", order: 31, group: "info" },
  outrasAlteracoes: { label: "Outras Alterações", order: 32, group: "info" },
  website: { label: "Website", order: 40, group: "info" },
  instagram: { label: "Instagram", order: 41, group: "info" },
  linkProjeto: { label: "Link do Projeto", order: 42, group: "info" },
  logoUrl: { label: "Logo Atual", order: 43, group: "info" },
  logo: { label: "Nova Logo", order: 44, group: "info" },
  projetoImg: { label: "Portfólio Atual", order: 45, group: "info" },
  odsRelacionadas: { label: "ODS Relacionadas", order: 50, group: "info" },
  apoio_planejamento: {
    label: "Apoio ao Planejamento",
    order: 60,
    group: "info",
  },
  escala: { label: "Escala de Impacto", order: 61, group: "info" },

  // --- Grupo de Metadados ---
  status: { label: "Status Atual", order: 5, group: "meta" },
  motivo: { label: "Motivo da Exclusão", order: 1000, group: "meta" },
  motivoExclusao: { label: "Motivo da Exclusão", order: 6, group: "meta" },
  createdAt: { label: "Data de Criação", order: 100, group: "meta" },
  updatedAt: { label: "Última Atualização", order: 101, group: "meta" },
};
