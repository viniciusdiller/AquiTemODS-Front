"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Statistic,
  Row,
  Col,
  Spin,
  Empty,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  BarChartOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";

const { Title, Text } = Typography;

interface CursoStats {
  id: number;
  titulo: string;
  imagemUrl: string;
  visualizacoes: number;
  ativo: boolean;
}

const IndicadoresCursos = () => {
  const router = useRouter();
  const [cursos, setCursos] = useState<CursoStats[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getFullImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // CORREÇÃO DE CACHE: Adiciona timestamp e no-store
        const timestamp = new Date().getTime();
        const res = await fetch(`${API_URL}/api/cursos?t=${timestamp}`, {
            cache: 'no-store'
        });
        
        if (res.ok) {
          const data = await res.json();
          // Ordena pelos mais vistos
          const sortedData = data.sort((a: CursoStats, b: CursoStats) => b.visualizacoes - a.visualizacoes);
          setCursos(sortedData);
        }
      } catch (error) {
        console.error("Erro ao buscar indicadores", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  const totalVisualizacoes = cursos.reduce((acc, curr) => acc + (curr.visualizacoes || 0), 0);
  const cursoMaisVisto = cursos.length > 0 ? cursos[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            shape="circle"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            className="border-none shadow-none hover:bg-gray-100"
          />
          <div>
            <Title level={4} style={{ margin: 0 }} className="text-gray-800">
              Indicadores de <span className="text-purple-600 font-bold">Cursos ODS</span>
            </Title>
            <Text type="secondary" className="text-xs">
              Métricas de acesso e engajamento
            </Text>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Spin spinning={loading}>
          
          <Row gutter={[24, 24]} className="mb-8" style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap' }}>
            
            <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
              <Card className="shadow-sm border-l-4 border-l-purple-500 w-full flex flex-col justify-center" style={{ flex: 1 }}>
                <Statistic
                  title="Total de Cliques (Todos os Cursos)"
                  value={totalVisualizacoes}
                  prefix={<EyeOutlined />}
                  valueStyle={{ color: "#722ed1", fontWeight: "bold" }}
                />
              </Card>
            </Col>

            <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
              <Card className="shadow-sm border-l-4 border-l-yellow-500 w-full flex flex-col justify-center" style={{ flex: 1 }}>
                {cursoMaisVisto ? (
                  <div className="flex justify-between items-center h-full">
                    <div>
                        <Text type="secondary" className="block mb-1 text-xs uppercase tracking-wide">Curso Mais Acessado</Text>
                        <Text strong className="text-lg block leading-tight mb-2 line-clamp-2" title={cursoMaisVisto.titulo}>
                          {cursoMaisVisto.titulo}
                        </Text>
                        <div className="flex items-center gap-2">
                           <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
                             {cursoMaisVisto.visualizacoes} {cursoMaisVisto.visualizacoes === 1 ? 'acesso' : 'acessos'}
                           </span>
                           {!cursoMaisVisto.ativo && (
                             <span className="text-red-500 text-xs border border-red-200 px-1 rounded">Arquivado</span>
                           )}
                        </div>
                    </div>
                    <TrophyOutlined style={{ fontSize: '2.5rem', color: '#faad14', opacity: 0.3 }} />
                  </div>
                ) : (
                  <Statistic title="Curso Mais Acessado" value="-" />
                )}
              </Card>
            </Col>
          </Row>

          <Divider orientation="left" className="text-gray-500">Detalhamento por Curso</Divider>

          {cursos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cursos.map((curso, index) => (
                <Card 
                    key={curso.id} 
                    hoverable 
                    className={`shadow-sm transition-all hover:-translate-y-1 relative overflow-hidden ${!curso.ativo ? 'opacity-70 grayscale bg-gray-50' : 'bg-white'}`}
                    bodyStyle={{ padding: 0 }}
                >
                    {index < 3 && (
                        <div className={`absolute top-0 right-0 px-3 py-1 text-white text-xs font-bold rounded-bl-lg z-10 
                            ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                            #{index + 1}
                        </div>
                    )}

                    {!curso.ativo && (
                        <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-br z-10">
                            ARQUIVADO
                        </div>
                    )}

                    <div className="relative h-32 w-full bg-gray-100 border-b">
                        <Image 
                            src={getFullImageUrl(curso.imagemUrl)} 
                            alt={curso.titulo} 
                            fill 
                            className="object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 h-10 leading-tight" title={curso.titulo}>
                            {curso.titulo}
                        </h3>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <Text type="secondary" className="text-xs">Total de Cliques</Text>
                            <span className="text-lg font-bold text-purple-600 flex items-center gap-2">
                                <BarChartOutlined /> {curso.visualizacoes}
                            </span>
                        </div>
                    </div>
                </Card>
              ))}
            </div>
          ) : (
            <Empty description="Nenhum dado encontrado." />
          )}
        </Spin>
      </div>
    </div>
  );
};

export default IndicadoresCursos;