"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeftOutlined,
  SearchOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Spin, Empty, Button, Input, Pagination } from "antd";
import ModernCarousel from "@/components/ModernCarousel";
import { getProjetosByOds } from "@/lib/api";

const categories = [
  {
    id: "ODS1",
    title: "ODS 1 - Erradicação da Pobreza",
    backgroundimg: "/categorias/fundo_ods1.png",
  },
  {
    id: "ODS2",
    title: "ODS 2 - Fome Zero e Agricultura Sustentável",
    backgroundimg: "/categorias/fundo_ods2.png",
  },
  {
    id: "ODS3",
    title: "ODS 3 - Saúde e Bem-estar",
    backgroundimg: "/categorias/fundo_ods3.png",
  },
  {
    id: "ODS4",
    title: "ODS 4 - Educação de Qualidade",
    backgroundimg: "/categorias/fundo_ods4.png",
  },
  {
    id: "ODS5",
    title: "ODS 5 - Igualdade de Gênero",
    backgroundimg: "/categorias/fundo_ods5.png",
  },
  {
    id: "ODS6",
    title: "ODS 6 - Água Potável e Saneamento",
    backgroundimg: "/categorias/fundo_ods6.png",
  },
  {
    id: "ODS7",
    title: "ODS 7 - Energia Acessível e Limpa",
    backgroundimg: "/categorias/fundo_ods7.png",
  },
  {
    id: "ODS8",
    title: "ODS 8 - Trabalho Decente e Crescimento Econômico",
    backgroundimg: "/categorias/fundo_ods8.png",
  },
  {
    id: "ODS9",
    title: "ODS 9 - Indústria, Inovação e Infraestrutura",
    backgroundimg: "/categorias/fundo_ods9.png",
  },
  {
    id: "ODS10",
    title: "ODS 10 - Redução das Desigualdades",
    backgroundimg: "/categorias/fundo_ods10.png",
  },
  {
    id: "ODS11",
    title: "ODS 11 - Cidades e Comunidades Sustentáveis",
    backgroundimg: "/categorias/fundo_ods11.png",
  },
  {
    id: "ODS12",
    title: "ODS 12 - Consumo e Produção Responsáveis",
    backgroundimg: "/categorias/fundo_ods12.png",
  },
  {
    id: "ODS13",
    title: "ODS 13 - Ação Contra a Mudança Global do Clima",
    backgroundimg: "/categorias/fundo_ods13.png",
  },
  {
    id: "ODS14",
    title: "ODS 14 - Vida na Água",
    backgroundimg: "/categorias/fundo_ods14.png",
  },
  {
    id: "ODS15",
    title: "ODS 15 - Vida Terrestre",
    backgroundimg: "/categorias/fundo_ods15.png",
  },
  {
    id: "ODS16",
    title: "ODS 16 - Paz, Justiça e Instituições Eficazes",
    backgroundimg: "/categorias/fundo_ods16.png",
  },
  {
    id: "ODS17",
    title: "ODS 17 - Parcerias e Meios de Implementação",
    backgroundimg: "/categorias/fundo_ods17.png",
  },
  {
    id: "ODS18",
    title: "ODS 18 - Igualdade Étnico/Racial",
    backgroundimg: "/categorias/fundo_ods18.png",
  },
];

// --- INTERFACES DE DADOS ---
interface Projeto {
  projetoId: number;
  nomeProjeto: string;
  descricaoDiferencial: string;
  endereco: string;
  prefeitura: string;
  ods: string;
  logoUrl?: string;
}

const PROJETOS_PER_PAGE = 8;

export default function CategoryPage() {
  const params = useParams();
  const slug = (params.slug as string)?.toUpperCase();
  const router = useRouter();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const category = useMemo(
    () => categories.find((cat) => cat.id === slug),
    [slug]
  );

  const getImageUrl = (url?: string) => {
    if (!url) {
      return "/Logo_aquitemods.png";
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    return `${baseUrl}/${url.startsWith("/") ? url.substring(1) : url}`;
  };

  useEffect(() => {
    if (slug) {
      const fetchProjetos = async () => {
        setIsLoading(true);
        setError(null);
        setCurrentPage(1);

        const categoryInfo = categories.find((cat) => cat.id === slug);
        if (!categoryInfo) {
          setError("Categoria não encontrada.");
          setIsLoading(false);
          return;
        }

        try {
          const data = await getProjetosByOds(categoryInfo.title);
          setProjetos(data);
        } catch (err: any) {
          setError(err.message || "Falha ao carregar os projetos.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProjetos();
    }
  }, [slug]);

  const filteredProjetos = useMemo(
    () =>
      projetos.filter((projeto) =>
        projeto.nomeProjeto.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [projetos, searchTerm]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginatedProjetos = useMemo(() => {
    const startIndex = (currentPage - 1) * PROJETOS_PER_PAGE;
    const endIndex = startIndex + PROJETOS_PER_PAGE;
    return filteredProjetos.slice(startIndex, endIndex);
  }, [filteredProjetos, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
          <Spin size="large" />
          <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-2">
            Carregando Projetos...
          </h1>
          <p className="text-gray-600">
            Estamos buscando os projetos alinhados a este ODS.
          </p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Empty description={error || "Categoria não encontrada."}>
          <Button type="primary" onClick={() => router.push("/")}>
            Voltar ao Início
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="relative h-48 md:h-64 w-full flex items-center justify-center text-white overflow-hidden shadow-lg">
        <Image
          src={category.backgroundimg || "/placeholder.jpg"}
          alt={`Background for ${category.title}`}
          fill
          className="object-cover z-0"
          priority
        />

        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10"></div>

        <Link
          href="/"
          className="absolute top-4 left-4 z-30 flex items-center gap-2 px-2 py-1 md:px-4 md:py-2 text-sm font-medium text-white/90 transition-all duration-300 bg-white/10 border border-white/20 rounded-full backdrop-blur-md hover:bg-white/20 hover:text-white hover:scale-105 hover:border-white/40 shadow-sm"
        >
          <ArrowLeftOutlined />
          <span>Voltar</span>
        </Link>

        <div className="container mx-auto px-4 pt-6 relative z-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold capitalize"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.6)" }}
          >
            {category.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/90 mt-2 text-sm md:text-base max-w-2xl mx-auto"
            style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.7)" }}
          >
            Explore os projetos do Rio de Janeiro que contribuem para este ODS.
          </motion.p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 lg:px-24">
        {/* Layout principal de duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* COLUNA ESQUERDA: LISTA DE PROJETOS */}
          <div className="flex flex-col lg:col-span-3">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-bold text-gray-800 tracking-tight mb-4"
            >
              Projetos
            </motion.h2>
            <div className="relative mb-6">
              <Input
                size="large"
                placeholder="Pesquisar por nome do projeto..."
                prefix={<SearchOutlined className="text-gray-400" />}
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {filteredProjetos.length > 0 ? (
              <>
                <div className="space-y-4 pb-1 milecem:grid milecem:grid-cols-2 milecem:gap-4 milecem:space-y-0">
                  {/* Map over PAGINATED projects */}
                  {paginatedProjetos.map((projeto, index) => (
                    <Link
                      href={`/categoria/${slug}/${encodeURIComponent(
                        projeto.nomeProjeto
                      )}`}
                      key={projeto.projetoId}
                      className="block"
                    >
                      {/* --- CARD PRINCIPAL COM relative --- */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative bg-white rounded-xl shadow-md p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col h-full" // Adicionado `relative`
                      >
                        {/* --- LOGO ABSOLUTA NO CANTO SUPERIOR DIREITO --- */}
                        <div
                          className="absolute top-4 right-4 w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm z-10" // Posicionamento e estilo redondo
                        >
                          <Image
                            src={getImageUrl(projeto.logoUrl)}
                            alt={`Logo ${projeto.nomeProjeto}`}
                            fill
                            sizes="48px"
                            className="object-contain" // Ou object-cover se preferir preenchimento
                          />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 break-words pr-16">
                          {projeto.nomeProjeto}
                        </h3>

                        <p className="text-gray-600 my-2 mt-6 text-sm break-words flex-grow line-clamp-3 pr-4">
                          {projeto.descricaoDiferencial}
                        </p>

                        <div className="flex items-start gap-2 text-sm text-gray-500 mt-auto pt-2 border-t border-gray-100">
                          <EnvironmentOutlined className="mt-1 flex-shrink-0 text-gray-400" />
                          <span className="break-words">
                            {projeto.prefeitura}
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* --- PAGINATION COMPONENT --- */}
                {filteredProjetos.length > PROJETOS_PER_PAGE && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      current={currentPage}
                      pageSize={PROJETOS_PER_PAGE}
                      total={filteredProjetos.length}
                      onChange={handlePageChange}
                      showSizeChanger={false} // Hides the page size selector
                    />
                  </div>
                )}
                {/* --- END PAGINATION --- */}
              </>
            ) : (
              <div className="mt-8">
                <Empty description="Nenhum projeto encontrado para esta categoria ou busca." />
              </div>
            )}
          </div>

          {/* COLUNA DIREITA: CARROSSEL */}
          <div className="lg:col-span-2 lg:sticky lg:top-8 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mb-4"
            >
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                Conheça também
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Explore outras categorias de ODS
              </p>
            </motion.div>
            <div className="w-full h-[300px] md:h-[500px] rounded-2xl shadow-lg overflow-hidden border border-blue-600">
              <ModernCarousel currentCategoryId={category.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
