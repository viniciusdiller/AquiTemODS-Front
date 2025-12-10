"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Statistic,
  Row,
  Col,
  Spin,
  message,
  Typography,
  Button,
} from "antd";
import {
  ArrowLeftOutlined,
  TrophyOutlined,
  BulbOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  HomeOutlined,
  GlobalOutlined,
  UserOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { getAdminStats } from "@/lib/api";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const { Title, Text } = Typography;

const ODS_COLORS: { [key: number]: string } = {
  1: "#E5243B", // Erradicação da Pobreza
  2: "#DDA63A", // Fome Zero
  3: "#4C9F38", // Saúde e Bem-Estar
  4: "#C5192D", // Educação de Qualidade
  5: "#FF3A21", // Igualdade de Gênero
  6: "#26BDE2", // Água Potável e Saneamento
  7: "#FCC30B", // Energia Acessível e Limpa
  8: "#A21942", // Trabalho Decente
  9: "#FD6925", // Indústria, Inovação
  10: "#DD1367", // Redução das Desigualdades
  11: "#FD9D24", // Cidades Sustentáveis
  12: "#BF8B2E", // Consumo Responsável
  13: "#3F7E44", // Ação contra Mudança Global do Clima
  14: "#0A97D9", // Vida na Água
  15: "#56C02B", // Vida Terrestre
  16: "#00689D", // Paz, Justiça
  17: "#19486A", // Parcerias
  18: "#4c4c4c", // (Opcional) ODS 18 - Igualdade Racial (Cor simbólica/proposta)
};

const getOdsColor = (odsName: string) => {
  if (!odsName) return "#8884d8";
  const numero = parseInt(odsName.replace(/\D/g, ""));
  return ODS_COLORS[numero] || "#8884d8";
};

// --- CONFIGURAÇÃO DE LABELS ---

const chartConfigEscala = {
  votos: { label: "Qtd. Projetos", color: "#00AEEF" },
} satisfies ChartConfig;

const chartConfigApoio = {
  value: { label: "Citações", color: "#FDB713" },
} satisfies ChartConfig;

const chartConfigViews = {
  views: { label: "Acessos", color: "#8884d8" },
} satisfies ChartConfig;

const chartConfigProjetos = {
  qtd: { label: "Projetos", color: "#3C6AB2" },
} satisfies ChartConfig;

export default function AdminIndicadoresPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }
      try {
        const stats = await getAdminStats(token);
        setData(stats);
      } catch (error) {
        message.error("Erro ao carregar indicadores.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" tip="Carregando dados..." />
      </div>
    );

  const SummaryCard = ({
    title,
    value,
    icon,
    colorBg,
    colorText,
    suffix,
  }: any) => (
    <Card
      bordered={false}
      className="shadow-sm h-full"
      bodyStyle={{ padding: "20px", background: colorBg, borderRadius: "8px" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <Text
            type="secondary"
            className="font-medium uppercase text-xs tracking-wider"
            style={{ color: colorText, opacity: 0.8 }}
          >
            {title}
          </Text>
          <Statistic
            value={value}
            valueStyle={{
              color: colorText,
              fontWeight: "800",
              fontSize: "28px",
            }}
            suffix={
              suffix && (
                <span className="text-lg opacity-70 font-semibold ml-1">
                  {suffix}
                </span>
              )
            }
          />
        </div>
        <div
          className="p-3 rounded-full bg-white bg-opacity-30 text-3xl"
          style={{ color: colorText }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );

  const hoverCursorColor = { fill: "#d1d5db", opacity: 0.15 };

  return (
    <div className="p-6 min-h-screen bg-[#f4f7fe]">
      <div className="max-w-7xl mx-auto">
        {/* CABEÇALHO */}
        <div className="flex items-center mb-6">
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
              title="Média de Escala (0-10)"
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
          <Col xs={24} sm={6}>
            <SummaryCard
              title="Usuários Cadastrados"
              value={data?.totalUsuarios || 0}
              icon={<UserOutlined />}
              colorBg="#F6FFED"
              colorText="#389E0D"
            />
          </Col>

          <Col xs={24} sm={6}>
            <SummaryCard
              title="Acessos Página Inicial"
              value={data?.pageViews?.home || 0}
              icon={<HomeOutlined />}
              colorBg="#E6F7FF"
              colorText="#0050B3"
            />
          </Col>

          <Col xs={24} sm={6}>
            <SummaryCard
              title="Acessos Espaço ODS"
              value={data?.pageViews?.espacoOds || 0}
              icon={<GlobalOutlined />}
              colorBg="#F0F5FF"
              colorText="#2F54EB"
            />
          </Col>

          <Col xs={24} sm={6}>
            <SummaryCard
              title="Cliques 'Enigmas do Futuro'"
              value={data?.pageViews?.gameClick || 0}
              icon={<RocketOutlined />}
              colorBg="#FFF2E8"
              colorText="#D4380D"
            />
          </Col>
        </Row>

        {/* 3. GRÁFICOS PRINCIPAIS (COMPARATIVO ODS) */}
        <Title
          level={5}
          className="mb-4 text-gray-500 uppercase text-xs tracking-widest mt-4"
        >
          Análise por ODS (Oferta vs Demanda)
        </Title>
        <Row gutter={[16, 16]}>
          {/* OFERTA DE PROJETOS */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <>
                  <BulbOutlined className="mr-2 text-blue-600" />
                  Oferta de Projetos (Cadastrados)
                </>
              }
              className="shadow-sm rounded-lg h-full"
              size="small"
              bordered={false}
            >
              <Text type="secondary" className="block mb-4 text-xs">
                Quantidade de projetos ativos em cada ODS.
              </Text>
              <ChartContainer
                config={chartConfigProjetos}
                className="h-[300px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={data?.chartProjetosPorOds}
                  margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                  barSize={24}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#eee"
                  />
                  <XAxis
                    dataKey="ods"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#666" }}
                    dy={10}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    allowDecimals={false}
                    width={30}
                    tick={{ fontSize: 11, fill: "#666" }}
                  />
                  <ChartTooltip
                    cursor={hoverCursorColor}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        className="bg-white border border-gray-200 shadow-xl"
                      />
                    }
                  />
                  <Bar dataKey="qtd" radius={[4, 4, 0, 0]}>
                    <LabelList
                      dataKey="qtd"
                      position="top"
                      style={{
                        fill: "#666",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    />
                    {data?.chartProjetosPorOds?.map(
                      (entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getOdsColor(entry.ods)}
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </Card>
          </Col>

          {/* INTERESSE PÚBLICO */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <>
                  <BarChartOutlined className="mr-2 text-purple-600" />
                  Interesse Público (Acessos)
                </>
              }
              className="shadow-sm rounded-lg h-full"
              size="small"
              bordered={false}
            >
              <Text type="secondary" className="block mb-4 text-xs">
                Categorias mais visitadas pela população.
              </Text>
              <ChartContainer
                config={chartConfigViews}
                className="h-[300px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={data?.chartVisualizacoes}
                  margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                  barSize={24}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#eee"
                  />
                  <XAxis
                    dataKey="ods"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#666" }}
                    dy={10}
                    interval={0}
                    height={60}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis
                    hide
                    allowDecimals={false}
                    width={30}
                    tick={{ fontSize: 11, fill: "#666" }}
                  />
                  <ChartTooltip
                    cursor={hoverCursorColor}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        className="bg-white border border-gray-200 shadow-xl"
                      />
                    }
                  />
                  <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                    <LabelList
                      dataKey="views"
                      position="top"
                      style={{
                        fill: "#666",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    />
                    {data?.chartVisualizacoes?.map(
                      (entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getOdsColor(entry.ods)}
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </Card>
          </Col>
        </Row>

        {/* 4. GRÁFICOS SECUNDÁRIOS */}
        <Row gutter={[16, 16]} className="mt-6">
          {/* APOIO AO PLANEJAMENTO */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <>
                  <CheckCircleOutlined className="mr-2 text-yellow-500" />
                  De que forma a plataforma pode Apoiar ao Planejamento
                </>
              }
              className="shadow-sm rounded-lg h-full"
              size="small"
              bordered={false}
            >
              <Text type="secondary" className="block mb-4 text-xs">
                Frequência das categorias citadas pelos gestores.
              </Text>
              <ChartContainer
                config={chartConfigApoio}
                className="h-[300px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={data?.chartApoio}
                  layout="vertical"
                  margin={{ left: 5, right: 40, top: 10, bottom: 10 }}
                  barSize={24}
                >
                  <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                    stroke="#eee"
                  />
                  <YAxis
                    dataKey="label"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={180}
                    tick={{ fontSize: 11, fill: "#666" }}
                  />
                  <XAxis dataKey="value" type="number" hide />
                  <ChartTooltip
                    cursor={hoverCursorColor}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        className="bg-white border border-gray-200 shadow-xl"
                      />
                    }
                  />
                  <Bar
                    dataKey="value"
                    fill="var(--color-value)"
                    radius={[0, 4, 4, 0]}
                  >
                    <LabelList
                      dataKey="value"
                      position="right"
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        fill: "#666",
                      }}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </Card>
          </Col>

          {/* DISTRIBUIÇÃO DE ESCALA */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <>
                  <RiseOutlined className="mr-2 text-blue-500" />
                  Distribuição da Escala de Impacto
                </>
              }
              className="shadow-sm rounded-lg h-full"
              size="small"
              bordered={false}
            >
              <Text type="secondary" className="block mb-4 text-xs">
                Quantidade de projetos por nota atribuída (0 a 10).
              </Text>
              <ChartContainer
                config={chartConfigEscala}
                className="h-[300px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={data?.chartEscala}
                  margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                  barSize={32}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#eee"
                  />
                  <XAxis
                    dataKey="nota"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                    dy={10}
                  />
                  <YAxis hide />
                  <ChartTooltip
                    cursor={hoverCursorColor}
                    content={
                      <ChartTooltipContent
                        indicator="dashed"
                        className="bg-white border border-gray-200 shadow-xl"
                      />
                    }
                  />
                  <Bar
                    dataKey="votos"
                    fill="var(--color-votos)"
                    radius={[8, 8, 0, 0]}
                  >
                    <LabelList
                      dataKey="votos"
                      position="top"
                      style={{
                        fill: "#666",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
