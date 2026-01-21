"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  message,
  Typography,
  Button,
  Table,
  Input,
  Modal,
  Tag,
  List,
  Empty,
  Statistic,
} from "antd";
import {
  ArrowLeftOutlined,
  SearchOutlined,
  BankOutlined,
  EyeOutlined,
  ProjectOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { getAllActiveProjetos } from "@/lib/api";
import { Projeto } from "@/types/Interface-Projeto";

const { Title, Text } = Typography;

// LISTA OFICIAL E PADRONIZADA (92 Municípios do RJ)
const CIDADES_RJ = [
  "Angra dos Reis", "Aperibé", "Araruama", "Areal", "Armação dos Búzios", "Arraial do Cabo",
  "Barra do Piraí", "Barra Mansa", "Belford Roxo", "Bom Jardim", "Bom Jesus do Itabapoana",
  "Cabo Frio", "Cachoeiras de Macacu", "Cambuci", "Campos dos Goytacazes", "Cantagalo",
  "Carapebus", "Cardoso Moreira", "Carmo", "Casimiro de Abreu", "Comendador Levy Gasparian",
  "Conceição de Macabu", "Cordeiro", "Duas Barras", "Duque de Caxias", "Engenheiro Paulo de Frontin",
  "Guapimirim", "Iguaba Grande", "Itaboraí", "Itaguaí", "Italva", "Itaocara", "Itaperuna",
  "Itatiaia", "Japeri", "Laje do Muriaé", "Macaé", "Macuco", "Magé", "Mangaratiba", "Maricá",
  "Mendes", "Mesquita", "Miguel Pereira", "Miracema", "Natividade", "Nilópolis", "Niterói",
  "Nova Friburgo", "Nova Iguaçu", "Paracambi", "Paraíba do Sul", "Paraty", "Paty do Alferes",
  "Petrópolis", "Pinheiral", "Piraí", "Porciúncula", "Porto Real", "Quatis", "Queimados",
  "Quissamã", "Resende", "Rio Bonito", "Rio Claro", "Rio das Flores", "Rio das Ostras",
  "Rio de Janeiro", "Santo Antônio de Pádua", "Santa Maria Madalena",
  "São Fidélis", "São Francisco de Itabapoana", "São Gonçalo", "São João da Barra",
  "São João de Meriti", "São José de Ubá", "São José do Vale do Rio Preto", "São Pedro da Aldeia",
  "São Sebastião do Alto", "Sapucaia", "Saquarema", "Seropédica", "Silva Jardim", "Sumidouro",
  "Tanguá", "Teresópolis", "Trajano de Moraes", "Três Rios", "Valença", "Varre-Sai",
  "Vassouras", "Volta Redonda"
];

// CORES DO PODIUM
const COLORS = {
  GOLD: "#FFD700",   // Dourado
  SILVER: "#C0C0C0", // Prata
  BRONZE: "#CD7F32", // Bronze
  DEFAULT: "#1D6F42" // Verde Padrão
};

export default function ProjetosPorPrefeituraPage() {
  const [loading, setLoading] = useState(true);
  const [dataTabela, setDataTabela] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [todosProjetos, setTodosProjetos] = useState<Projeto[]>([]);
  const [searchText, setSearchText] = useState("");

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrefeitura, setSelectedPrefeitura] = useState("");
  const [projetosDaPrefeitura, setProjetosDaPrefeitura] = useState<Projeto[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      // 1. Busca TODOS os projetos ativos
      const projetos: Projeto[] = await getAllActiveProjetos(token);
      setTodosProjetos(projetos);

      // 2. Agrupa a contagem ESTRITAMENTE pela lista oficial
      const contagemMap: Record<string, number> = {};

      projetos.forEach(p => {
        if (p.prefeitura) {
          // Limpa o prefixo padrão para comparar apenas o nome da cidade
          let nomeLimpo = p.prefeitura.replace(/Prefeitura Municipal de /i, "").trim();

          // Verifica se este nome existe na lista oficial CIDADES_RJ (ignora case)
          const nomeOficial = CIDADES_RJ.find(c =>
            c.toLowerCase() === nomeLimpo.toLowerCase()
          );

          // SÓ CONTA SE FOR UMA CIDADE OFICIAL DA LISTA
          if (nomeOficial) {
            contagemMap[nomeOficial] = (contagemMap[nomeOficial] || 0) + 1;
          }
        }
      });

      // 3. Monta os dados finais APENAS com quem tem qtd > 0
      const dadosCompletos = Object.entries(contagemMap)
        .map(([nome, qtd], index) => ({
          id: index,
          nome: nome,
          qtd: qtd
        }))
        .filter(item => item.qtd > 0) // Remove quem tem 0
        .sort((a, b) => b.qtd - a.qtd); // Ordena do maior para o menor

      setDataTabela(dadosCompletos);
      setFilteredData(dadosCompletos);
    } catch (error) {
      console.error(error);
      message.error("Erro ao carregar lista de prefeituras.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = dataTabela.filter((item) =>
      item.nome.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleOpenModal = (nomePrefeitura: string) => {
    setSelectedPrefeitura(nomePrefeitura);

    // Filtra os projetos usando a mesma lógica estrita para exibir no modal
    const projetosFiltrados = todosProjetos.filter(p => {
      if (!p.prefeitura) return false;
      const pNome = p.prefeitura.replace(/Prefeitura Municipal de /i, "").trim().toLowerCase();
      return pNome === nomePrefeitura.toLowerCase();
    });

    setProjetosDaPrefeitura(projetosFiltrados);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Ranking",
      key: "index",
      width: 80,
      render: (_: any, __: any, index: number) => {
        let icon = null;
        if (index === 0) icon = <TrophyOutlined style={{ color: COLORS.GOLD }} />;
        else if (index === 1) icon = <TrophyOutlined style={{ color: COLORS.SILVER }} />;
        else if (index === 2) icon = <TrophyOutlined style={{ color: COLORS.BRONZE }} />;
        
        return (
          <span className="font-bold text-gray-600 flex items-center gap-2">
            #{index + 1} {icon}
          </span>
        );
      },
    },
    {
      title: "Prefeitura",
      dataIndex: "nome",
      key: "nome",
      render: (text: string) => (
        <span className="font-medium text-base">
          Prefeitura Municipal de {text}
        </span>
      ),
    },
    {
      title: "Projetos Ativos",
      dataIndex: "qtd",
      key: "qtd",
      sorter: (a: any, b: any) => a.qtd - b.qtd,
      render: (qtd: number) => (
        <Tag color="green" style={{ fontSize: '14px', padding: '4px 10px' }}>
          {qtd} {qtd === 1 ? 'Projeto' : 'Projetos'}
        </Tag>
      ),
    },
    {
      title: "Ação",
      key: "action",
      width: 150,
      render: (_: any, record: any) => (
        <Button
          type="primary"
          ghost
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleOpenModal(record.nome)}
          style={{ borderColor: "#1D6F42", color: "#1D6F42" }}
        >
          Ver Projetos
        </Button>
      ),
    },
  ];

  // Top 10 baseados apenas nos que têm projetos
  const chartData = dataTabela.slice(0, 10);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" tip="Calculando dados das prefeituras..." />
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-[#f4f7fe]">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
          <Link href="/admin/indicadores" passHref>
            <Button icon={<ArrowLeftOutlined />} type="text" className="mr-4">
              Voltar aos Indicadores
            </Button>
          </Link>
          <div>
            <Title level={3} style={{ margin: 0, color: "#333" }}>
              Ranking de Prefeituras
            </Title>
            <Text type="secondary">
              Listagem oficial das prefeituras com participação ativa na plataforma.
            </Text>
          </div>
        </div>

        {/* ESTATÍSTICAS RÁPIDAS - PODIUM + TOTAL */}
        <Row gutter={[16, 16]} className="mb-6">
          {/* TOTAL */}
          <Col xs={24} sm={6}>
            <Card bordered={false} className="shadow-sm h-full">
              <Statistic
                title="Participantes"
                value={dataTabela.length}
                suffix={`/ ${CIDADES_RJ.length}`}
                valueStyle={{ color: '#1D6F42' }}
                prefix={<BankOutlined />}
              />
              <div className="text-gray-400 text-xs mt-1">
                Municípios ativos
              </div>
            </Card>
          </Col>

          {/* 1º LUGAR */}
          <Col xs={24} sm={6}>
            <Card bordered={false} className="shadow-sm h-full border-b-4 border-b-[#FFD700]">
              <Statistic
                title="1º Lugar"
                value={dataTabela[0]?.nome || "-"}
                valueStyle={{ color: '#333', fontSize: '1rem', fontWeight: 'bold' }}
                prefix={<TrophyOutlined style={{ color: COLORS.GOLD, fontSize: '24px' }} />}
              />
              <div className="text-gray-500 text-xs mt-1 font-semibold">
                {dataTabela[0]?.qtd || 0} Projetos
              </div>
            </Card>
          </Col>

          {/* 2º LUGAR */}
          <Col xs={24} sm={6}>
            <Card bordered={false} className="shadow-sm h-full border-b-4 border-b-[#C0C0C0]">
              <Statistic
                title="2º Lugar"
                value={dataTabela[1]?.nome || "-"}
                valueStyle={{ color: '#333', fontSize: '1rem', fontWeight: 'bold' }}
                prefix={<TrophyOutlined style={{ color: COLORS.SILVER, fontSize: '24px' }} />}
              />
              <div className="text-gray-500 text-xs mt-1 font-semibold">
                {dataTabela[1]?.qtd || 0} Projetos
              </div>
            </Card>
          </Col>

          {/* 3º LUGAR */}
          <Col xs={24} sm={6}>
            <Card bordered={false} className="shadow-sm h-full border-b-4 border-b-[#CD7F32]">
              <Statistic
                title="3º Lugar"
                value={dataTabela[2]?.nome || "-"}
                valueStyle={{ color: '#333', fontSize: '1rem', fontWeight: 'bold' }}
                prefix={<TrophyOutlined style={{ color: COLORS.BRONZE, fontSize: '24px' }} />}
              />
              <div className="text-gray-500 text-xs mt-1 font-semibold">
                {dataTabela[2]?.qtd || 0} Projetos
              </div>
            </Card>
          </Col>
        </Row>

        {/* GRÁFICO TOP 10 */}
        {dataTabela.length > 0 && (
          <Row gutter={[16, 16]} className="mb-6">
            <Col span={24}>
              <Card title="Top 10 Prefeituras mais Ativas" bordered={false} className="shadow-sm">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="nome"
                        type="category"
                        width={140}
                        tick={{ fontSize: 11, fill: '#555' }}
                        interval={0}
                      />
                      <Tooltip
                        cursor={{ fill: '#f0f0f0' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="qtd" radius={[0, 4, 4, 0]} barSize={24}>
                        <LabelList dataKey="qtd" position="right" fill="#666" fontSize={12} fontWeight="bold" />
                        {chartData.map((entry, index) => {
                          let fillColor = COLORS.DEFAULT;
                          if (index === 0) fillColor = COLORS.GOLD;
                          if (index === 1) fillColor = COLORS.SILVER;
                          if (index === 2) fillColor = COLORS.BRONZE;

                          return <Cell key={`cell-${index}`} fill={fillColor} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {/* TABELA DE DADOS */}
        <Card bordered={false} className="shadow-sm">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <BankOutlined className="text-xl text-[#1D6F42]" />
              <span className="font-semibold text-lg">Ranking Geral </span>
            </div>
            <Input
              placeholder="Buscar prefeitura..."
              prefix={<SearchOutlined className="text-gray-400" />}
              onChange={handleSearch}
              style={{ width: 300 }}
              allowClear
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: false }}
            locale={{ emptyText: "Nenhuma prefeitura oficial com projetos encontrada." }}
          />
        </Card>

        {/* MODAL: LISTAGEM DE PROJETOS */}
        <Modal
          title={
            <div className="flex items-center gap-2 text-[#1D6F42]">
              <BankOutlined style={{ fontSize: '22px' }} />
              <span className="text-lg">Projetos de {selectedPrefeitura}</span>
            </div>
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
          ]}
          width={700}
          centered
        >
          <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4">
            {projetosDaPrefeitura.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={projetosDaPrefeitura}
                renderItem={(projeto) => (
                  <List.Item className="hover:bg-gray-50 transition-colors rounded-lg p-2 mb-2 border border-gray-100">
                    <List.Item.Meta
                      avatar={
                        <div className="bg-green-100 p-3 rounded-lg flex items-center justify-center h-12 w-12">
                          <ProjectOutlined className="text-[#1D6F42] text-xl" />
                        </div>
                      }
                      title={
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-base text-gray-800">
                            {projeto.nomeProjeto}
                          </span>
                          {projeto.venceuPspe && <Tag color="gold">🏆 PSPE</Tag>}
                        </div>
                      }
                      // --- AQUI ESTÁ A ALTERAÇÃO DA DESCRIÇÃO ---
                      description={
                        <div className="flex flex-col gap-1 mt-2">
                          {/* Secretaria em cima */}
                          <Text type="secondary" className="text-xs">
                            <span className="font-bold">Secretaria:</span> {projeto.secretaria || "N/A"}
                          </Text>

                          {/* Responsável em baixo */}
                          <Text type="secondary" className="text-xs">
                            <span className="font-bold">Responsável:</span> {projeto.responsavelProjeto || "N/A"}
                          </Text>

                          <div className="flex gap-2 mt-1 items-center">
                            <Tag color="blue">{projeto.ods || "ODS Geral"}</Tag>
                            <Tag>{projeto.status}</Tag>
                            <span className="text-[10px] text-gray-400">ID: {projeto.projetoId}</span>
                          </div>
                        </div>
                      }
                      // ------------------------------------------
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="Nenhum projeto encontrado." />
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}