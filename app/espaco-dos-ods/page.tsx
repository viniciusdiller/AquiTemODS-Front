// EPAÇO MEI
import Link from "next/link";
import React from "react";
import Image from "next/image";

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
                  Aqui Tem ODS
                </span>
              </h1>
              <p className="text-gray-700 leading-relaxed text-lg">
                O{" "}
                <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-semibold">
                  AquitemODS{" "}
                </span>{" "}
                é um espaço de mobilização, aprendizado e conexão em torno dos{" "}
                <strong>Objetivos de Desenvolvimento Sustentável</strong>. Nosso
                propósito é transformar ideias em ações concretas que promovam
                um futuro mais justo, inclusivo e sustentável para todos.
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
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            O projeto surge como uma plataforma que aproxima cidadãos, empresas,
            instituições e o poder público em torno da Agenda 2030 da ONU. Aqui,
            cada ação, projeto ou iniciativa é pensada para fortalecer os
            pilares do desenvolvimento sustentável —{" "}
            <strong>social, ambiental e econômico</strong>.
          </p>

          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            No{" "}
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-semibold">
              AquitemODS{" "}
            </span>
            , você encontra cursos, oficinas, eventos e oportunidades voltadas
            para o fortalecimento de competências, empreendedorismo sustentável
            e inovação social. O objetivo é empoderar pessoas e comunidades a
            contribuírem com os 18 ODS, de forma prática e transformadora.
          </p>

          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            A iniciativa conta com o apoio da{" "}
            <strong>Prefeitura de Saquarema</strong>e de parceiros locais e
            regionais comprometidos com a construção de uma cidade mais
            sustentável, resiliente e solidária. Cada ação aqui apresentada é um
            passo concreto rumo ao cumprimento da Agenda 2030, mostrando que o
            desenvolvimento sustentável começa em nível local.
          </p>
        </section>

        {/* --- SEÇÃO DE CURSOS --- */}
        <section className="mt-12 border-t pt-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Capacitações e Conteúdos sobre os ODS:
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Exemplo de Curso */}
            <Link
              href="https://brasil.un.org/pt-br/sdgs"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/ODS18.png"
                  alt="ODS 18 - Parcerias e meios de implementação"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                Conheça os 18 Objetivos de Desenvolvimento Sustentável
              </p>
            </Link>

            <Link
              href="https://www.un.org/sustainabledevelopment/education/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/EducacaoODS.jpg"
                  alt="Educação para o Desenvolvimento Sustentável"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                Educação para o Desenvolvimento Sustentável
              </p>
            </Link>

            <Link
              href="https://sebrae.com.br/sites/PortalSebrae/cursosonline/empreendedorismo-sustentavel,0f2c9b8a6a28bb610VgnVCM1000004c00210aRCRD"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/EmpreendedorismoSustentavel.jpg"
                  alt="Empreendedorismo Sustentável"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                Empreendedorismo Sustentável
              </p>
            </Link>

            <Link
              href="https://www.pactoglobal.org.br/ods"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/Cursos/PactoGlobal.jpg"
                  alt="Pacto Global e os ODS no Brasil"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                Pacto Global e os ODS no Brasil
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
