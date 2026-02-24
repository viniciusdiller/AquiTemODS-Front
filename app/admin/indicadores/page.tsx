"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  message,
  Typography,
  Button,
  DatePicker,
} from "antd";
import {
  ArrowLeftOutlined,
  TrophyOutlined,
  BulbOutlined,
  RiseOutlined,
  HomeOutlined,
  GlobalOutlined,
  UserOutlined,
  RocketOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAdminStats } from "@/lib/api";
import dayjs from "dayjs";
import { Newspaper } from "lucide-react";

// Nossos componentes separados
import { SummaryCard } from "@/components/admin//indicadores/SummaryCard";
import {
  OfertaProjetosChart,
  InteressePublicoChart,
  ApoioPlanejamentoChart,
  EscalaImpactoChart,
} from "@/components/admin//indicadores/IndicadoresChats";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function AdminIndicadoresPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Estado do Filtro de Datas
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  const router = useRouter();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    try {
      let startDate, endDate;

      // Se tiver datas selecionadas, formata para mandar na URL
      if (dateRange && dateRange[0] && dateRange[1]) {
        startDate = dateRange[0].format("YYYY-MM-DD");
        endDate = dateRange[1].format("YYYY-MM-DD");
      }

      // getAdminStats deve estar atualizado no lib/api.ts para aceitar esses parâmetros
      const stats = await getAdminStats(token, startDate, endDate);
      setData(stats);
    } catch (error) {
      message.error("Erro ao carregar indicadores.");
    } finally {
      setLoading(false);
    }
  }, [router, dateRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleExportIndicators = () => {
    if (!data) {
      message.warning("Aguarde o carregamento dos dados.");
      return;
    }

    try {
      const dataAtual = new Date();
      const dataFormatada = dataAtual.toLocaleString("pt-BR");

      const metaRows = [
        ["Relatório de Indicadores - Aqui Tem ODS"],
        ["Gerado em", dataFormatada],
        [],
      ];
      const headers = ["Categoria", "Indicador", "Valor"];

      const fixedRows = [
        ["Resumo Geral", "Projetos Ativos", data.totalProjetos || 0],
        ["Resumo Geral", "Média de Impacto (0-10)", data.mediaEscala || 0],
        ["Resumo Geral", "Premiados PSPE", data.statsPspe?.[0]?.value || 0],
        ["Resumo Geral", "Não Premiados", data.statsPspe?.[1]?.value || 0],
        ["Trafego", "Usuários Cadastrados", data.totalUsuarios || 0],
        ["Trafego", "Acessos Home", data.pageViews?.home || 0],
        ["Trafego", "Acessos Espaço ODS", data.pageViews?.espacoOds || 0],
        [
          "Trafego",
          "Cliques Enigmas do Futuro",
          data.pageViews?.gameClick || 0,
        ],
        [
          "Trafego",
          "Compartilhamentos de Perfil",
          data.pageViews?.compartilhamento || 0,
        ],
        ["Trafego", "Acessos SustentAí", data.pageViews?.sustentAiNav || 0],
      ];

      const ofertaRows = (data.chartProjetosPorOds || []).map((item: any) => [
        "Oferta (Projetos Cadastrados)",
        item.ods,
        item.qtd,
      ]);
      const demandaRows = (data.chartVisualizacoes || []).map((item: any) => [
        "Demanda (Visualizações/Interesse)",
        item.ods,
        item.views,
      ]);
      const apoioRows = (data.chartApoio || []).map((item: any) => [
        "Apoio ao Planejamento",
        item.label,
        item.value,
      ]);
      const escalaRows = (data.chartEscala || []).map((item: any) => [
        "Distribuição da Escala de Impacto",
        item.nota,
        item.votos,
      ]);

      const allRows = [
        ...metaRows,
        headers,
        ...fixedRows,
        ...ofertaRows,
        ...demandaRows,
        ...apoioRows,
        ...escalaRows,
      ];
      const csvContent =
        "\uFEFF" +
        allRows
          .map((row) => row.map((item: any) => `"${item}"`).join(";"))
          .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `indicadores_aquitemods_${dataAtual.toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar CSV:", error);
      message.error("Erro ao gerar o arquivo.");
    }
  };

  if (loading && !data)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" tip="Carregando dados..." />
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-[#f4f7fe]">
      <div className="max-w-7xl mx-auto">
        {/* CABEÇALHO E FILTRO */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Link href="/admin/dashboard" passHref>
              <Button icon={<ArrowLeftOutlined />} type="text" className="mr-4">
                Voltar
              </Button>
            </Link>
            <div>
              <Title level={3} style={{ margin: 0, color: "#333" }}>
                Painel de Indicadores
              </Title>
              <Text type="secondary">
                Visão geral do impacto dos projetos ativos.
              </Text>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-4">
            <div className="flex items-center bg-white p-2 rounded-xl shadow-sm border border-gray-200">
              <CalendarOutlined className="text-gray-400 mr-2 ml-2" />
              <RangePicker
                format="DD/MM/YYYY"
                placeholder={["Data Inicial", "Data Final"]}
                bordered={false}
                onChange={(dates) => setDateRange(dates as any)}
                className="w-full sm:w-auto"
              />
            </div>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportIndicators}
              style={{ backgroundColor: "#1D6F42", borderColor: "#1D6F42" }}
            >
              Exportar (Excel)
            </Button>
          </div>
        </div>

        {/* LOADING DO FILTRO */}
        {loading && data && (
          <div className="w-full text-center py-4 mb-4">
            <Spin tip="Atualizando painel..." />
          </div>
        )}

        {/* NAVEGAÇÃO PREFEITURAS */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24}>
            <Link href="/admin/indicadores/prefeituras">
              <Card
                hoverable
                className="cursor-pointer shadow-sm border-l-4 border-l-[#1D6F42]"
                bodyStyle={{ padding: "20px" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full text-[#1D6F42]">
                      <HomeOutlined style={{ fontSize: "24px" }} />
                    </div>
                    <div>
                      <Title level={4} style={{ margin: 0, color: "#333" }}>
                        Relatório por Prefeitura
                      </Title>
                      <Text type="secondary">
                        Clique para visualizar a distribuição de projetos entre
                        as 92 prefeituras.
                      </Text>
                    </div>
                  </div>
                  <ArrowLeftOutlined
                    style={{ fontSize: "20px", transform: "rotate(180deg)" }}
                    className="text-gray-400"
                  />
                </div>
              </Card>
            </Link>
          </Col>
        </Row>

        {/* 1. CARDS DE RESUMO GERAL */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <SummaryCard
              title="Projetos Ativos"
              value={data?.totalProjetos}
              icon={<BulbOutlined />}
              colorBg="#E6F7FF"
              colorText="#0050B3"
            />
          </Col>
          <Col xs={24} sm={8}>
            <SummaryCard
              title="Média de Impacto (0-10)"
              value={data?.mediaEscala}
              icon={<RiseOutlined />}
              colorBg="#FFF7E6"
              colorText="#D46B08"
              suffix="/ 10"
            />
          </Col>
          <Col xs={24} sm={8}>
            <SummaryCard
              title="Premiados PSPE"
              value={data?.statsPspe[0].value}
              icon={<TrophyOutlined />}
              colorBg="#FFF0F6"
              colorText="#C41D7F"
              suffix={`de ${data?.totalProjetos}`}
            />
          </Col>
        </Row>

        {/* 2. CARDS DE TRÁFEGO */}
        <Title
          level={5}
          className="mb-4 text-gray-500 uppercase text-xs tracking-widest mt-8"
        >
          Tráfego e Engajamento
        </Title>
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={8}>
            <SummaryCard
              title="Usuários Cadastrados"
              value={data?.totalUsuarios || 0}
              icon={<UserOutlined />}
              colorBg="#F6FFED"
              colorText="#389E0D"
            />
          </Col>
          <Col xs={24} sm={8}>
            <SummaryCard
              title="Acessos Página Inicial"
              value={data?.pageViews?.home || 0}
              icon={<HomeOutlined />}
              colorBg="#E6F7FF"
              colorText="#0050B3"
            />
          </Col>
          <Col xs={24} sm={8}>
            <SummaryCard
              title="Acessos Espaço ODS"
              value={data?.pageViews?.espacoOds || 0}
              icon={<GlobalOutlined />}
              colorBg="#F0F5FF"
              colorText="#2F54EB"
            />
          </Col>
          <Col xs={24} sm={8}>
            <SummaryCard
              title="Cliques 'Enigmas do Futuro'"
              value={data?.pageViews?.gameClick || 0}
              icon={<RocketOutlined />}
              colorBg="#FFF2E8"
              colorText="#D4380D"
            />
          </Col>
          <Col xs={24} sm={8}>
            <SummaryCard
              title="Acessos SustentAí"
              value={data?.pageViews?.sustentAiNav || 0}
              icon={<Newspaper size={28} />}
              colorBg="#FFF0F6"
              colorText="#D7386E"
            />
          </Col>
          <Col xs={24} sm={8}>
            <SummaryCard
              title="Compartilhamento de Projetos"
              value={data?.pageViews?.compartilhamento || 0}
              icon={<ShareAltOutlined />}
              colorBg="#FFF0F6"
              colorText="#EB2F96"
            />
          </Col>
        </Row>

        {/* 3. GRÁFICOS (Importados dos Componentes) */}
        <Title
          level={5}
          className="mb-4 text-gray-500 uppercase text-xs tracking-widest mt-4"
        >
          Análise por ODS (Oferta vs Demanda)
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <OfertaProjetosChart data={data?.chartProjetosPorOds} />
          </Col>
          <Col xs={24} lg={12}>
            <InteressePublicoChart data={data?.chartVisualizacoes} />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mt-6">
          <Col xs={24} lg={12}>
            <ApoioPlanejamentoChart data={data?.chartApoio} />
          </Col>
          <Col xs={24} lg={12}>
            <EscalaImpactoChart data={data?.chartEscala} />
          </Col>
        </Row>
      </div>
    </div>
  );
}
