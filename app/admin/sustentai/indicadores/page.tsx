"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Statistic, Row, Col, Spin, Empty, Divider, Pagination } from "antd";
import { ArrowLeftOutlined, EyeOutlined, BarChartOutlined, TrophyOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BlocoStats {
  id: number;
  titulo: string;
  imagemUrl?: string;
  cliques: number;
  ativo: boolean;
  descricao?: string;
}

const IndicadoresSustentai = () => {
  const router = useRouter();
  const [blocos, setBlocos] = useState<BlocoStats[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [lastEndpoint, setLastEndpoint] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 9;

  const getFullImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  // Tenta priorizar o endpoint de AÇÕES do SustentAí e normaliza o resultado
  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    const timestamp = new Date().getTime();
    const endpoints = [
      `/api/sustentai/acoes`,
      `/api/admin/sustentai/acoes`,
      `/api/sustentai/blocos`,
      `/api/sustentai`,
    ];

    for (const ep of endpoints) {
      const url = `${API_URL}${ep}?t=${timestamp}`;
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          console.debug(`endpoint ${ep} respondeu ${res.status}`);
          continue;
        }

        const data = await res.json().catch(() => null);
        if (!data) continue;

        const arr = Array.isArray(data) ? data : data.items || null;
        if (!arr || !Array.isArray(arr)) continue;

        // Se veio vazio, considera inválido — queremos os blocos/ações gerenciáveis
        if (arr.length === 0) continue;

        const normalized = arr.map((d: any) => ({
          id: d.id,
          titulo: d.titulo || d.title || d.name || "",
          descricao: d.descricao || d.description || d.summary || "",
          imagemUrl: d.imagemUrl || d.imagem || d.imagem_url || d.image || "",
          cliques: typeof d.cliques === "number" ? d.cliques : d.views || d.accesses || 0,
          ativo: typeof d.ativo === "boolean" ? d.ativo : true,
        }));

        const sorted = normalized.sort((a: BlocoStats, b: BlocoStats) => b.cliques - a.cliques);
        setBlocos(sorted);
        setLastEndpoint(ep);
        setLoading(false);
        return;
      } catch (err: any) {
        console.warn("Erro ao consultar", url, err);
        continue;
      }
    }

    // Se nenhum endpoint de AÇÕES respondeu, mostra instrução clara ao admin
    setBlocos([]);
    setFetchError(
      "Nenhum endpoint de AÇÕES (/api/sustentai/acoes) respondeu com dados. Peça ao backend para expor GET /api/sustentai/acoes retornando lista de ações com campo `cliques` e POST /api/sustentai/acoes/:id/click para incrementar. Verifique NEXT_PUBLIC_API_URL."
    );
    setLastEndpoint(null);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [API_URL]);

  // reset page if blocos length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [blocos.length]);

  const totalCliques = blocos.reduce((acc, curr) => acc + (curr.cliques || 0), 0);
  const blocoMaisClicado = blocos.length > 0 ? blocos[0] : null;

  const totalBlocks = blocos.length;
  const totalPages = Math.max(1, Math.ceil(totalBlocks / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageBlocos = blocos.slice(startIndex, endIndex);

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
            <h3 className="text-gray-800 text-lg m-0">Indicadores do SustentAí</h3>
            <div className="text-xs text-gray-500">Cliques por bloco do SustentAí</div>
          </div>

          {/* espaço reservado à direita (botão Recarregar removido conforme solicitado) */}
          <div className="ml-auto" />
        </div>
      </div>

      {fetchError && (
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="text-sm text-red-600">{fetchError}</div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Spin spinning={loading}>
          <Row gutter={[24, 24]} className="mb-8">
            <Col xs={24} md={8}>
              <Card className="shadow-sm border-l-4 border-l-green-500 w-full flex flex-col justify-center" style={{ minHeight: 120 }}>
                <Statistic
                  title="Total de Cliques (SustentAí)"
                  value={totalCliques}
                  prefix={<EyeOutlined />}
                  valueStyle={{ color: "#1D6F42", fontWeight: "bold" }}
                />
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="shadow-sm border-l-4 border-l-blue-500 w-full flex flex-col justify-center" style={{ minHeight: 120 }}>
                <Statistic
                  title="Total de Blocos"
                  value={totalBlocks}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ color: "#2F54EB", fontWeight: "bold" }}
                />
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="shadow-sm border-l-4 border-l-yellow-500 w-full flex flex-col justify-center" style={{ minHeight: 120 }}>
                {blocoMaisClicado ? (
                  <div className="flex justify-between items-center">
                    <div className="pr-4">
                      <div className="block mb-1 text-xs uppercase tracking-wide text-gray-500">Bloco Mais Clicado</div>
                      <div className="text-lg font-semibold text-gray-800 line-clamp-2" title={blocoMaisClicado.titulo}>
                        {blocoMaisClicado.titulo}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
                          {blocoMaisClicado.cliques} {blocoMaisClicado.cliques === 1 ? 'clique' : 'cliques'}
                        </span>
                        {!blocoMaisClicado.ativo && (
                          <span className="text-red-500 text-xs border border-red-200 px-1 rounded">Arquivado</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <TrophyOutlined style={{ fontSize: '1.9rem', color: '#faad14', opacity: 0.3 }} />
                    </div>
                  </div>
                ) : (
                  <Statistic title="Bloco Mais Clicado" value="-" />
                )}
              </Card>
            </Col>
          </Row>

          <Divider orientation="left" className="text-gray-500">Detalhamento por Bloco</Divider>

          {blocos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageBlocos.map((bloco, index) => (
                  <Card
                    key={bloco.id}
                    hoverable
                    className={`shadow-sm transition-all hover:-translate-y-1 relative overflow-hidden ${!bloco.ativo ? 'opacity-70 grayscale bg-gray-50' : 'bg-white'}`}
                    bodyStyle={{ padding: 0 }}
                  >
                    {!bloco.ativo && (
                      <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-br z-10">ARQUIVADO</div>
                    )}

                    <div className="relative h-32 w-full bg-gray-100 border-b">
                      {bloco.imagemUrl ? (
                        <Image src={getFullImageUrl(bloco.imagemUrl)} alt={bloco.titulo} fill className="object-cover" />
                      ) : null}
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 h-10 leading-tight" title={bloco.titulo}>{bloco.titulo}</h3>
                      {bloco.descricao && <p className="text-xs text-gray-500 line-clamp-3 mb-2">{bloco.descricao}</p>}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500">Total de Cliques</div>
                        <div className="text-lg font-bold text-green-600 flex items-center gap-2"><BarChartOutlined /> {bloco.cliques}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  pageSize={ITEMS_PER_PAGE}
                  total={totalBlocks}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <Empty description="Nenhum dado encontrado." />
          )}
        </Spin>
      </div>
    </div>
  );
};

export default IndicadoresSustentai;
