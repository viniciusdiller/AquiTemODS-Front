"use client";

import React from "react";
import { Card, Typography } from "antd";
import {
  BulbOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const { Text } = Typography;

const ODS_COLORS: { [key: number]: string } = {
  1: "#E5243B",
  2: "#DDA63A",
  3: "#4C9F38",
  4: "#C5192D",
  5: "#FF3A21",
  6: "#26BDE2",
  7: "#FCC30B",
  8: "#A21942",
  9: "#FD6925",
  10: "#DD1367",
  11: "#FD9D24",
  12: "#BF8B2E",
  13: "#3F7E44",
  14: "#0A97D9",
  15: "#56C02B",
  16: "#00689D",
  17: "#19486A",
  18: "#4c4c4c",
};

export const getOdsColor = (odsName: string) => {
  if (!odsName) return "#8884d8";
  const numero = parseInt(odsName.replace(/\D/g, ""));
  return ODS_COLORS[numero] || "#8884d8";
};

const hoverCursorColor = { fill: "#d1d5db", opacity: 0.15 };

// Configurações do Shadcn UI Charts
const chartConfigProjetos = {
  qtd: { label: "Projetos", color: "#3C6AB2" },
} satisfies ChartConfig;
const chartConfigViews = {
  views: { label: "Acessos", color: "#8884d8" },
} satisfies ChartConfig;
const chartConfigApoio = {
  value: { label: "Citações", color: "#FDB713" },
} satisfies ChartConfig;
const chartConfigEscala = {
  votos: { label: "Qtd. Projetos", color: "#00AEEF" },
} satisfies ChartConfig;

// --- 1. Gráfico de Oferta de Projetos ---
export const OfertaProjetosChart = ({ data }: { data: any[] }) => (
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
    <ChartContainer config={chartConfigProjetos} className="h-[300px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
        barSize={24}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eee" />
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
            style={{ fill: "#666", fontWeight: "bold", fontSize: 12 }}
          />
          {data?.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={getOdsColor(entry.ods)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  </Card>
);

// --- 2. Gráfico de Interesse Público ---
export const InteressePublicoChart = ({ data }: { data: any[] }) => (
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
    <ChartContainer config={chartConfigViews} className="h-[300px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
        barSize={24}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eee" />
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
            style={{ fill: "#666", fontWeight: "bold", fontSize: 12 }}
          />
          {data?.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={getOdsColor(entry.ods)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  </Card>
);

// --- 3. Gráfico de Apoio ao Planejamento ---
export const ApoioPlanejamentoChart = ({ data }: { data: any[] }) => (
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
    <ChartContainer config={chartConfigApoio} className="h-[300px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ left: 5, right: 40, top: 10, bottom: 10 }}
        barSize={24}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#eee" />
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
        <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]}>
          <LabelList
            dataKey="value"
            position="right"
            style={{ fontSize: 12, fontWeight: "bold", fill: "#666" }}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  </Card>
);

// --- 4. Gráfico de Escala de Impacto ---
export const EscalaImpactoChart = ({ data }: { data: any[] }) => (
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
    <ChartContainer config={chartConfigEscala} className="h-[300px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
        barSize={32}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eee" />
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
        <Bar dataKey="votos" fill="var(--color-votos)" radius={[8, 8, 0, 0]}>
          <LabelList
            dataKey="votos"
            position="top"
            style={{ fill: "#666", fontWeight: "bold", fontSize: 12 }}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  </Card>
);
