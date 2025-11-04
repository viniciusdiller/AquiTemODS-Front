// EPAÇO MEI
import Link from "next/link";
import React from "react";
import Image from "next/image";
import FaleConoscoButton from "@/components/FaleConoscoButton";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D7386E] to-[#3C6AB2] py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        {/* --- SEÇÃO INICIAL --- */}
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
                <strong>Objetivos de Desenvolvimento Sustentável(ODS)</strong>{" "}
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
              <p className="text-gray-700 leading-relaxed text-lg">
                erradicar a pobreza, proteger o planeta e promover prosperidade
                e paz para todas as pessoas até 2030.
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

        {/* --- CONTEÚDO PRINCIPAL --- */}
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
              ambiente, mobilidade, economia) sob uma mesma visão de futuro;{" "}
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

        {/* --- SEÇÃO DE CURSOS --- */}
        <section className="mt-12 border-t pt-6">
          <h2 className="text-3xl font-semibold text-center mb-10">
            <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Capacitações e Conteúdos sobre os ODS:
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Exemplo de Curso */}
            <Link
              href="https://brasil.un.org/sites/default/files/2020-09/agenda2030-pt-br.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/1.png"
                  alt="Agenda 2030"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                Transformando Nosso Mundo: A Agenda 2030 para o Desenvolvimento
                Sustentável
              </p>
            </Link>

            <Link
              href="https://www.gov.br/culturaviva/pt-br/biblioteca-cultura-viva/documentos-e-publicacoes/cartilhas/nacoes-unidas-objetivos-de-desenvolvimento-sustentavel-agenda-2030.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/2.png"
                  alt="Cartilha dos ODS"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                Cartilha dos ODS
              </p>
            </Link>

            <Link
              href="https://www.escolavirtual.gov.br/curso/719"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/curso1.png"
                  alt="curso1"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                Agenda para o desenvolvimento sustentável: conceitos,
                mobilização e articulação
              </p>
            </Link>

            <Link
              href="https://www.escolavirtual.gov.br/curso/841"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/curso2.png"
                  alt="Agenda 2030 para o desenvolvimento sustentável: desafios para a
                implementação"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                Agenda 2030 para o desenvolvimento sustentável: desafios para a
                implementação
              </p>
            </Link>

            <Link
              href="https://www.escolaaberta3setor.org.br/sebrades-cursos/esg-e-os-objetivos-do-desenvolvimento-sustentavel/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/curso3.jpg"
                  alt="ESG e os Objetivos do Desenvolvimento Sustentável"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                ESG e os Objetivos do Desenvolvimento Sustentável
              </p>
            </Link>

            <Link
              href="https://procids.ufms.br/curso-multiplicadores-dos-ods/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/curso4.png"
                  alt="Curso Multiplicadores dos ODS"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                Curso Multiplicadores dos ODS
              </p>
            </Link>
            <Link
              href="https://emasp.prefeitura.sp.gov.br/formacoes/monitoramento-e-avaliacao-dos-objetivos-de-desenvolvimento-sustentavel-em-cidades-ibero-americanas-ead/?utm_source=chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/curso5.png"
                  alt="Monitoramento e Avaliação dos Objetivos de Desenvolvimento
                Sustentável em Cidades Ibero Americanas"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                Monitoramento e Avaliação dos Objetivos de Desenvolvimento
                Sustentável em Cidades Ibero Americanas
              </p>
            </Link>

            <Link
              href="https://suap.enap.gov.br/vitrine/curso/1847/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/curso6.png"
                  alt="ODS na prática: Agenda 2030 como estratégia de desenvolvimento local"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                ODS na prática: Agenda 2030 como estratégia de desenvolvimento
                local
              </p>
            </Link>
          </div>
        </section>

        <section className="mt-8 border-t pt-6">
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Os ODS e a Agenda 2030 representam{" "}
            <strong>um compromisso coletivo pelo futuro</strong>. E os
            municípios, ao adotarem essas metas,{" "}
            <strong>
              transformam compromissos globais em ações reais no território
            </strong>
            , mostrando que as{" "}
            <strong>mudanças que o mundo precisa começam em cada cidade</strong>{" "}
            — e em Saquarema, <strong>AquiTemODS.</strong>
          </p>
        </section>
      </div>
      <FaleConoscoButton />
    </div>
  );
}
