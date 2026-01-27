"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Typography,
  Button,
  Spin,
  Row,
  Col,
  Statistic,
  Tag,
  Empty,
} from "antd";
import {
  ArrowLeftOutlined,
  TrophyOutlined,
  EyeOutlined,
  GlobalOutlined,
  ThunderboltFilled,
  BarChartOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

// Paleta de cores oficial do projeto
const COLORS = {
  pink: "#D7386E",
  blue: "#3C6AB2",
  green: "#1D6F42",
  gold: "#FAAD14",
  grayBg: "#f8fafc",
};

export default function SustentAiIndicatorsPage() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<any[]>([]);
  const [navClicks, setNavClicks] = useState(0);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCards, resStats] = await Promise.all([
          fetch(`${API_URL}/api/sustentai`),
          fetch(`${API_URL}/api/admin/stats`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
            },
          }),
        ]);

        const dataCards = await resCards.json();
        const dataStats = await resStats.json();

        if (Array.isArray(dataCards)) {
          setCards(dataCards);
        } else {
          setCards([]);
        }

        if (dataStats?.pageViews?.sustentAiNav) {
          setNavClicks(dataStats.pageViews.sustentAiNav);
        } else {
          setNavClicks(0);
        }
      } catch (err) {
        console.error("Erro ao carregar indicadores:", err);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // --- CÁLCULOS ---
  const totalClicksCards = Array.isArray(cards)
    ? cards.reduce((acc, card) => acc + (card.visualizacoes || 0), 0)
    : 0;

  const mostPopularBox =
    Array.isArray(cards) && cards.length > 0
      ? [...cards].sort(
          (a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0),
        )[0]
      : null;

  // Prepara dados para o gráfico (Top 10)
  const chartData = Array.isArray(cards)
    ? [...cards]
        .sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0))
        .slice(0, 10)
        .map((card) => ({
          name:
            card.titulo.length > 20
              ? card.titulo.substring(0, 20) + "..."
              : card.titulo,
          fullTitle: card.titulo,
          clicks: card.visualizacoes || 0,
        }))
    : [];

  // Configuração das colunas da tabela
  const columns: ColumnsType<any> = [
    {
      title: "Rank",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => {
        const rank = index + 1;
        let icon = null;
        if (rank === 1) icon = "🥇";
        else if (rank === 2) icon = "🥈";
        else if (rank === 3) icon = "🥉";

        return (
          <div className="font-bold text-gray-500">
            {icon ? <span className="text-lg">{icon}</span> : `#${rank}`}
          </div>
        );
      },
    },
    {
      title: "Iniciativa (Box)",
      dataIndex: "titulo",
      key: "titulo",
      render: (text) => (
        <Text
          strong
          style={{ color: "#334155" }}
          className="text-xs sm:text-sm"
        >
          {text}
        </Text>
      ),
    },
    {
      title: "Link",
      dataIndex: "linkDestino",
      key: "linkDestino",
      responsive: ["md"] as const,
      render: (link) => (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs"
        >
          <GlobalOutlined /> Acessar
        </a>
      ),
    },
    {
      title: "Clicks",
      dataIndex: "visualizacoes",
      key: "visualizacoes",
      align: "right",
      sorter: (a, b) => (a.visualizacoes || 0) - (b.visualizacoes || 0),
      render: (value) => (
        <Tag
          color={value > 0 ? "blue" : "default"}
          className="rounded-full font-semibold border-0 bg-blue-50 text-blue-700 text-[10px] sm:text-xs px-2"
        >
          {value || 0}
        </Tag>
      ),
    },
  ];

  return (
    // CORREÇÃO: overflow-x-hidden para evitar scroll lateral
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 font-sans overflow-x-hidden w-full">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            className="text-gray-500 hover:bg-gray-200 rounded-full"
          />
          <Title
            level={3}
            style={{ margin: 0, color: "#1e293b", fontSize: "1.5rem" }}
          >
            Dashboard SustentAí
          </Title>
        </div>
        <Text className="text-gray-500 ml-0 md:ml-11 block text-sm md:text-base">
          Visão geral de performance e interesse nas iniciativas.
        </Text>
      </div>

      {loading ? (
        <div className="h-[60vh] flex flex-col justify-center items-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-400">Carregando métricas...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-6 w-full">
          {/* 1. KPIs Cards */}
          {/* Use gutter menor em mobile para evitar overflow das margens negativas */}
          <Row gutter={[16, 16]}>
            {/* KPI 1: Acessos Navbar */}
            <Col xs={24} md={8}>
              <Card
                bordered={false}
                className="shadow-sm hover:shadow-md transition-shadow h-full rounded-2xl relative overflow-hidden"
                bodyStyle={{ padding: "20px" }}
              >
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <Text className="text-gray-500 font-medium uppercase text-[10px] sm:text-xs tracking-wider">
                      Tráfego da Página
                    </Text>
                    <Title
                      level={2}
                      style={{
                        margin: "8px 0 0",
                        color: "#1e293b",
                        fontSize: "2rem",
                      }}
                    >
                      {navClicks}
                    </Title>
                    <div className="mt-2 text-xs text-green-600 bg-green-50 inline-block px-2 py-1 rounded-md font-medium">
                      <RiseOutlined /> Acessos Menu
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-blue-50 rounded-xl text-blue-500">
                    <GlobalOutlined style={{ fontSize: "20px" }} />
                  </div>
                </div>
              </Card>
            </Col>

            {/* KPI 2: Total Cliques Cards */}
            <Col xs={24} md={8}>
              <Card
                bordered={false}
                className="shadow-sm hover:shadow-md transition-shadow h-full rounded-2xl relative overflow-hidden"
                bodyStyle={{ padding: "20px" }}
              >
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <Text className="text-gray-500 font-medium uppercase text-[10px] sm:text-xs tracking-wider">
                      Interesse Total
                    </Text>
                    <Title
                      level={2}
                      style={{
                        margin: "8px 0 0",
                        color: COLORS.pink,
                        fontSize: "2rem",
                      }}
                    >
                      {totalClicksCards}
                    </Title>
                    <div className="mt-2 text-xs text-pink-600 bg-pink-50 inline-block px-2 py-1 rounded-md font-medium">
                      <ThunderboltFilled /> Cliques Cards
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-pink-50 rounded-xl text-pink-500">
                    <EyeOutlined style={{ fontSize: "20px" }} />
                  </div>
                </div>
              </Card>
            </Col>

            {/* KPI 3: Top Performance */}
            <Col xs={24} md={8}>
              <Card
                bordered={false}
                className="shadow-sm hover:shadow-md transition-shadow h-full rounded-2xl relative overflow-hidden bg-gradient-to-br from-white to-yellow-50"
                bodyStyle={{ padding: "20px" }}
              >
                <div className="flex justify-between items-start z-10 relative">
                  <div className="w-full">
                    <Text className="text-yellow-600 font-bold uppercase text-[10px] sm:text-xs tracking-wider flex items-center gap-1">
                      <TrophyOutlined /> Destaque
                    </Text>

                    {mostPopularBox ? (
                      <div className="mt-3">
                        <Text
                          className="text-gray-800 font-semibold block text-sm sm:text-base line-clamp-1"
                          title={mostPopularBox.titulo}
                        >
                          {mostPopularBox.titulo}
                        </Text>
                        <div className="flex items-center gap-2 mt-2">
                          <Tag color="gold" className="m-0 font-bold border-0">
                            {mostPopularBox.visualizacoes} acessos
                          </Tag>
                        </div>
                      </div>
                    ) : (
                      <Text className="block mt-4 text-gray-400 italic text-xs">
                        Sem dados
                      </Text>
                    )}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* 2. Charts & Tables Section */}
          <Row gutter={[16, 16]}>
            {/* Gráfico de Barras */}
            <Col xs={24} lg={16}>
              <Card
                bordered={false}
                title={
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">
                    <BarChartOutlined className="mr-2" />
                    Ranking
                  </span>
                }
                className="shadow-sm rounded-2xl h-full w-full"
                bodyStyle={{ padding: "10px 10px 10px 0" }}
              >
                <div className="w-full h-[300px] sm:h-[400px]">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        barSize={20}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={100}
                          tick={{ fontSize: 10, fill: "#64748b" }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "#f1f5f9" }}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            fontSize: "12px",
                          }}
                        />
                        <Bar
                          dataKey="clicks"
                          name="Cliques"
                          radius={[0, 4, 4, 0]}
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index < 3 ? COLORS.pink : COLORS.blue}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Empty
                      description="Sem dados"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </div>
              </Card>
            </Col>

            {/* Tabela de Listagem */}
            <Col xs={24} lg={8}>
              <Card
                bordered={false}
                title={
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">
                    Detalhes
                  </span>
                }
                className="shadow-sm rounded-2xl h-full w-full"
                bodyStyle={{ padding: 0 }}
              >
                <Table
                  dataSource={
                    Array.isArray(cards)
                      ? [...cards].sort(
                          (a, b) =>
                            (b.visualizacoes || 0) - (a.visualizacoes || 0),
                        )
                      : []
                  }
                  columns={columns}
                  rowKey="id"
                  pagination={{
                    pageSize: 6,
                    size: "small",
                    hideOnSinglePage: true,
                    style: {
                      paddingRight: 16,
                      paddingBottom: 8,
                      fontSize: "12px",
                    },
                  }}
                  size="small"
                  scroll={{ x: true }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
