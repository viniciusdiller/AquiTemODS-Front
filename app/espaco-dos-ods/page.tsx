"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import FaleConoscoButton from "@/components/FaleConoscoButton";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface Curso {
  id: number;
  titulo: string;
  tag: string;
  linkDestino: string;
  imagemUrl: string;
}

export default function SobrePage() {
  const jaContabilizou = useRef(false);

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para a paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // Contabiliza visualização da página Espaço ODS
    if (!jaContabilizou.current) {
      jaContabilizou.current = true;
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/projetos/visualizacao/ESPACO_ODS`,
        { method: "POST" },
      ).catch((err) => console.error("Erro contador Espaço ODS:", err));
    }

    // Busca os cursos ativos no backend
    const fetchCursos = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cursos?status=ativo`,
        );
        if (res.ok) {
          const data = await res.json();
          setCursos(data);
        } else {
          console.error("Erro ao buscar cursos: Resposta não OK");
        }
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  const getFullImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  };

  // Registra o clique no curso de forma assíncrona sem travar a navegação
  const handleCursoClick = async (id: number) => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${id}/click`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Erro ao registrar clique:", error);
    }
  };

  // Lógica matemática da paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCursos = cursos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cursos.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D7386E] to-[#3C6AB2] py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        <section className="mb-8">
          <div className="md:flex md:items-start md:gap-8 lg:gap-12">
            <div className="md:w-2/3">
              <h1
                className=" text-4xl font-extrabold mb-6 inline-block pb-2
                    bg-gradient-to-r from-[#D7386E] to-[#3C6AB2]
                    bg-no-repeat
                    [background-position:0_100%]
                    [background-size:100%_4px]"
              >
                <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent ">
                  Os Objetivos de Desenvolvimento Sustentável no Brasil
                </span>
              </h1>
              <p className="text-gray-700 leading-relaxed text-lg">
                Os{" "}
                <strong>Objetivos de Desenvolvimento Sustentável (ODS)</strong>{" "}
                são um conjunto de{" "}
                <strong>
                  metas globais estabelecidas pela Organização das Nações Unidas
                  (ONU)
                </strong>{" "}
                em 2015, com o propósito de{" "}
                <strong>
                  erradicar a pobreza, proteger o planeta e promover
                  prosperidade e paz para todas as pessoas até 2030.
                </strong>
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mt-4">
                A Agenda 2030 é o pacto internacional que reúne esses objetivos
                — um plano de ação global, assinado por 193 países, que propõe
                um novo modelo de desenvolvimento baseado no equilíbrio entre as
                dimensões econômica, social, ambiental e institucional. No
                Brasil, além dos 17 ODS originais da ONU, foi incorporado um 18º
                ODS, criado pela Comissão Nacional dos ODS (CNODS), que trata da
                Promoção dos Direitos Humanos e da Cidadania, reforçando o
                compromisso brasileiro com a inclusão, a equidade e a justiça
                social.
              </p>
            </div>

            <div className="mt-8 md:mt-0 md:w-1/3 flex-shrink-0">
              <Image
                src="/odss.png"
                alt="Imagem representando os Objetivos de Desenvolvimento Sustentável"
                width={400}
                height={400}
                className="w-full h-auto rounded-2xl shadow-md"
              />
            </div>
          </div>
        </section>

        <section className="mt-8 border-t pt-6">
          <h2 className="text-3xl font-semibold text-left mb-10">
            <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Por que os ODS são importantes?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Os ODS funcionam como um guia universal de políticas públicas e
            ações locais. Eles apontam caminhos concretos para enfrentar
            desafios como desigualdade, mudanças climáticas, pobreza,
            desemprego, saneamento, educação, saúde e meio ambiente, entre
            outros.
          </p>

          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Cada objetivo está interligado, mostrando que o desenvolvimento
            sustentável depende da cooperação entre governos, empresas e
            cidadãos.
          </p>

          <p className="text-gray-700 leading-relaxed text-lg mt-4 mb-8">
            Implementar os ODS significa melhorar a qualidade de vida das
            pessoas, proteger os recursos naturais e fortalecer a gestão pública
            com base em resultados e transparência.
          </p>
        </section>

        <section className="mb-8 border-t pt-8">
          <h2 className="text-3xl font-semibold text-left mb-10">
            <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              O papel dos municípios
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Os <strong>municípios são o coração da Agenda 2030</strong>. É nas
            cidades, vilas e comunidades que os ODS se tornam realidade — onde
            as políticas públicas ganham forma e afetam diretamente a vida das
            pessoas.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Quando um município adota os ODS como diretriz de planejamento e
            gestão, ele:
          </p>

          <ul className=" mt-3 list-disc list-inside text-gray-700 leading-relaxed text-lg space-y-2">
            <li>
              <strong>Integra políticas públicas</strong> (educação, saúde, meio
              ambiente, mobilidade, economia) sob uma mesma visão de futuro;
            </li>
            <li>
              <strong>Monitora resultados e indicadores locais</strong>,
              fortalecendo a transparência e a eficiência administrativa;
            </li>
            <li>
              <strong>Estimula a participação social</strong>, aproximando
              cidadãos, servidores e instituições em torno de metas comuns;
            </li>
            <li>
              <strong>Atrai investimentos e parcerias</strong> nacionais e
              internacionais voltadas ao desenvolvimento sustentável;
            </li>
            <li>
              <strong>Inspira inovação e cooperação</strong>, permitindo que
              boas práticas sejam replicadas em outras cidades.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Assim, a atuação municipal é decisiva: quanto mais alinhadas às
            metas da Agenda 2030 estiverem as políticas locais, maior será o
            impacto coletivo para o país e para o planeta.
          </p>
        </section>

        <section className="mt-8 border-t pt-6">
          <h2 className="text-3xl font-semibold text-left mb-10">
            <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Um compromisso que começa no território
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            No Brasil, diversas cidades já criaram planos locais de
            desenvolvimento sustentável, laboratórios de inovação, observatórios
            de indicadores e plataformas de boas práticas — como o Aqui tem ODS,
            de Saquarema. Essas iniciativas demonstram que o desenvolvimento
            sustentável se constrói de baixo para cima, com o protagonismo dos
            governos locais e a participação ativa da sociedade.
          </p>

          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Cada projeto municipal alinhado aos ODS — seja na educação, na
            economia, no meio ambiente ou na inclusão social — contribui para um
            mundo mais equilibrado, justo e humano.
          </p>
        </section>

        <section className="mt-12 border-t pt-6">
          <h2 className="text-3xl font-semibold text-center mb-10">
            <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Capacitações e Conteúdos sobre os ODS:
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-center items-center py-10">
                <Loader2 className="animate-spin text-[#D7386E] w-10 h-10" />
              </div>
            ) : cursos.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-10 text-gray-500">
                Nenhuma capacitação encontrada no momento.
              </div>
            ) : (
              currentCursos.map((curso) => (
                <Link
                  key={curso.id}
                  href={curso.linkDestino}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block text-center"
                  onClick={() => handleCursoClick(curso.id)}
                >
                  <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300 relative aspect-[4/3] bg-gray-50">
                    {curso.tag && (
                      <div className="absolute top-2 right-2 z-10 bg-slate-50 text-black text-[10px] uppercase font-bold px-2 py-1 rounded-full shadow-md">
                        {curso.tag}
                      </div>
                    )}
                    <Image
                      src={getFullImageUrl(curso.imagemUrl)}
                      alt={curso.titulo}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                    {curso.titulo}
                  </p>
                </Link>
              ))
            )}
          </div>

          {/* Novos Controles de Paginação (Mais modernos) */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 sm:gap-6 mt-14">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="group flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full bg-white border border-gray-200 text-gray-600 font-semibold shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#D7386E] hover:text-[#D7386E] transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-medium text-sm hidden sm:inline">
                  Página
                </span>
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] text-white font-bold shadow-md">
                  {currentPage}
                </span>
                <span className="text-gray-500 font-medium text-sm">
                  de {totalPages}
                </span>
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="group flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full bg-white border border-gray-200 text-gray-600 font-semibold shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#3C6AB2] hover:text-[#3C6AB2] transition-all duration-300"
              >
                <span className="hidden sm:inline">Próxima</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </section>

        <section className="mt-12 border-t pt-6">
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Os ODS e a Agenda 2030 representam{" "}
            <strong>um compromisso coletivo pelo futuro</strong>. E os
            municípios, ao adotarem essas metas,{" "}
            <strong>
              transformam compromissos globais em ações reais no território
            </strong>
            , mostrando que as{" "}
            <strong>mudanças que o mundo precisa começam em cada cidade</strong>{" "}
            — e em Saquarema,{" "}
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-bold">
              #AquiTemODS.{" "}
            </span>
          </p>
        </section>
      </div>
      <FaleConoscoButton />
    </div>
  );
}
