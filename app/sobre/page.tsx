// Espaço dos Aqui Tem ODS React from "react";

export default function EspacoODSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D7386E] to-[#3C6AB2] py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        {/* --- CABEÇALHO --- */}
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
                <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
                  Aqui Tem ODS{" "}
                </span>
              </h1>
              <p className="text-gray-700 leading-relaxed text-lg">
                O {""}
                <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-bold">
                  AquitemODS{" "}
                </span>
                é uma iniciativa da Prefeitura Municipal de Saquarema,
                idealizada pela Secretaria de Governança e Sustentabilidade como
                produto do Laboratório de Inovação e Sustentabilidade Aplicada –
                Lab ISA.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                A plataforma nasce com o propósito de reunir, sistematizar e
                divulgar boas práticas de gestão pública municipal alinhadas aos
                Objetivos de Desenvolvimento Sustentável (ODS) da Agenda 2030 da
                ONU, promovendo o compartilhamento de experiências e o
                fortalecimento da cultura da sustentabilidade e da inovação no
                setor público.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Mais do que um banco de projetos, o {""}
                <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-bold">
                  AquitemODS{" "}
                </span>
                é um ecossistema de conhecimento e colaboração entre gestores,
                técnicos, servidores e cidadãos comprometidos com o
                desenvolvimento sustentável de Saquarema e de outros municípios.
              </p>
            </div>

            <div className="mt-8 md:mt-0 md:w-1/3 flex-shrink-0">
              <img
                src="/Logo_aquitemods.png"
                alt="Logo dos Objetivos de Desenvolvimento Sustentável"
                width={400}
                height={400}
                className="w-full h-auto rounded-2xl shadow-md mt-10"
              />
            </div>
          </div>
        </section>

        {/* --- O QUE É --- */}
        <section className="mb-8 border-t pt-8">
          <h2 className="text-3xl font-bold text-left mb-10">
            <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Origem e contexto: dos Seminários Saquarema 2030 ao Lab ISA
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            A criação do {""}
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-bold">
              AquitemODS{" "}
            </span>{" "}
            é um desdobramento direto dos Seminários Saquarema 2030, realizados
            pela Prefeitura de Saquarema com o objetivo de discutir caminhos
            para uma cidade mais sustentável, inovadora e preparada para os
            desafios do futuro.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            A primeira edição do Seminário Saquarema 2030, em maio de 2023,
            reuniu gestores públicos, especialistas, universidades e
            representantes da sociedade civil em um espaço de diálogo sobre
            planejamento territorial, mudanças climáticas, desenvolvimento
            econômico e políticas públicas integradas. O evento foi um marco de
            reflexão e construção coletiva, em que se reafirmou a importância do
            papel dos municípios na concretização dos ODS em nível local.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            A partir desse movimento, nasceu o Laboratório de Inovação e
            Sustentabilidade Aplicada – Lab ISA, uma iniciativa permanente
            voltada à criação de soluções inovadoras, experimentação de
            políticas públicas e disseminação de práticas sustentáveis. O {""}
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-bold">
              AquitemODS{" "}
            </span>{" "}
            é um dos principais produtos desse laboratório — transformando
            conhecimento em ação, e ação em legado.
          </p>
        </section>

        {/* --- RECURSOS --- */}
        <section className="mb-8 border-t pt-8">
          <h2 className="text-2xl font-semibold mb-3">
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Objetivo e proposta
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            A plataforma {""}
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-bold">
              AquitemODS{" "}
            </span>{" "}
            tem como principal objetivo identificar, valorizar e divulgar
            projetos, programas e políticas públicas implementadas por órgãos
            municipais que contribuem para o alcance dos 18 Objetivos de
            Desenvolvimento Sustentável.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Cada iniciativa cadastrada é mapeada, descrita e vinculada aos ODS
            correspondentes, permitindo uma leitura integrada das ações da
            gestão municipal e de como elas impactam positivamente a vida da
            população. Além disso, a plataforma visa:
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Além disso, a plataforma visa:
          </p>
          <ul className=" mt-3 list-disc list-inside text-gray-700 leading-relaxed text-lg space-y-2">
            <li>Incentivar o intercâmbio de experiências entre municípios; </li>
            <li>Estimular a gestão baseada em evidências e resultados;</li>
            <li>Fortalecer a transparência e o controle social; </li>
            <li>
              {" "}
              Engajar cidadãos, escolas, universidades e organizações locais na
              Agenda 2030;
            </li>
            <li>
              Promover a integração de políticas públicas sob a ótica da
              sustentabilidade, inovação e inclusão.
            </li>
          </ul>
        </section>

        {/* --- COMO PARTICIPAR --- */}
        <section className="mb-8 border-t pt-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Importância para a Gestão Pública e para a sociedade
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            A implementação dos ODS no nível local é reconhecida
            internacionalmente como essencial para o sucesso da Agenda 2030.
            Cidades são os espaços onde se concentram os maiores desafios —
            desigualdade, urbanização, mobilidade, meio ambiente — e também, as
            maiores oportunidades de transformação.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            O {""}
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-bold">
              AquitemODS{" "}
            </span>{" "}
            representa um avanço significativo na gestão pública municipal, pois
            permite:
          </p>

          <ul className=" mt-3 list-disc list-inside text-gray-700 leading-relaxed text-lg space-y-2">
            <li>
              {" "}
              A mensuração de resultados de políticas públicas sob o prisma da
              sustentabilidade;{" "}
            </li>
            <li>
              {" "}
              O fortalecimento da governança local, com integração entre
              secretarias e setores;
            </li>
            <li>
              {" "}
              A formação de um acervo público de boas práticas, que serve como
              referência para gestores de outros municípios;
            </li>
            <li>
              A valorização das ações já existentes, muitas vezes invisíveis à
              sociedade, que contribuem para um futuro mais sustentável.
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Para os cidadãos, a plataforma oferece transparência e inspiração.
            Ao conhecer as ações que impactam diretamente seu território — seja
            um projeto de reciclagem, educação ambiental, saúde preventiva,
            economia solidária ou inovação tecnológica — a população passa a
            compreender o papel que cada política desempenha no alcance das
            metas globais. Assim, o cidadão deixa de ser apenas espectador e se
            torna protagonista do desenvolvimento local.
          </p>
        </section>

        {/* --- QUEM PODE PARTICIPAR --- */}
        <section className="mb-8 border-t pt-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Impactos esperados
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            O{" "}
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-bold">
              AquitemODS{" "}
            </span>{" "}
            busca gerar impactos concretos e duradouros:
          </p>

          <ul className=" mt-3 list-disc list-inside text-gray-700 leading-relaxed text-lg space-y-2">
            <li>
              {" "}
              Ampliação do engajamento dos gestores públicos com a Agenda 2030;{" "}
            </li>
            <li>
              {" "}
              Disseminação de conhecimento técnico e metodológico entre
              municípios;
            </li>
            <li>
              {" "}
              Fortalecimento da cultura de inovação e sustentabilidade dentro da
              administração pública;
            </li>
            <li>
              Maior articulação intersetorial, integrando políticas de educação,
              meio ambiente, economia e governança;
            </li>
            <li>
              Aproximação entre governo e sociedade civil, com foco em soluções
              colaborativas e participativas;
            </li>
            <li>
              Monitoramento de resultados e acompanhamento do avanço dos ODS em
              nível municipal.
            </li>
          </ul>
        </section>

        {/* --- ATUALIZAR/EXCLUIR --- */}
        <section className="mb-8 border-t pt-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Um compromisso coletivo
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            O{" "}
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-bold">
              AquitemODS{" "}
            </span>{" "}
            reforça o compromisso da Prefeitura de Saquarema com a Agenda 2030
            das Nações Unidas, com os princípios de gestão participativa,
            inovação pública e desenvolvimento humano sustentável.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Ao disponibilizar uma plataforma acessível, viva e em constante
            atualização, Saquarema se posiciona como referência regional em
            governança sustentável, abrindo caminho para que outras cidades
            possam seguir o mesmo modelo.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            O projeto também reafirma a importância de trabalhar em rede:
            governos locais, instituições de ensino, setor privado e sociedade
            civil unidos em torno de um propósito comum — construir um futuro
            mais justo, equilibrado e sustentável para todos.
          </p>
        </section>

        <section className="mb-8 border-t pt-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              ODS Relacionados
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            O projeto contribui diretamente com:
          </p>
          <ul className=" mt-3 list-disc list-inside text-gray-700 leading-relaxed text-lg space-y-2">
            <li>
              {" "}
              <span className="text-[#FB9D24] font-semibold">ODS 11</span> —
              Cidades e Comunidades Sustentáveis: planejamento urbano e
              qualidade de vida.
            </li>
            <li>
              <span className="text-[#3F7E44] font-semibold">ODS 13</span> —
              Ação Contra a Mudança do Clima: práticas ambientais e soluções
              inovadoras.
            </li>
            <li>
              {" "}
              <span className="text-[#00689D] font-semibold">ODS 16</span> —
              Paz, Justiça e Instituições Eficazes: transparência e governança
              pública.
            </li>
            <li>
              {" "}
              <span className="text-[#18486B] font-semibold">ODS 17</span> —
              Parcerias e Meios de Implementação: cooperação e redes
              intersetoriais
            </li>
          </ul>

          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            E apoia indiretamente os ODS 4, 9 e 12, voltados à educação,
            inovação e consumo responsável.
          </p>
        </section>

        {/* --- LINK PARA CADASTRO DE PROJETO --- */}
        <section className="mt-12 border-t pt-8">
          <h2 className="text-3xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Saquarema e a Agenda 2030
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Com o{" "}
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-bold">
              AquitemODS
            </span>
            , Saquarema reafirma seu papel como cidade inovadora e comprometida
            com o desenvolvimento sustentável. Cada ação catalogada na
            plataforma representa um passo em direção a um futuro melhor — um
            futuro em que políticas públicas, tecnologia e cidadania caminham
            juntas.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Porque, em Saquarema, sustentabilidade não é discurso: é prática, é
            inovação, é compromisso.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            E é por isso que —{" "}
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent font-bold">
              AquitemODS.
            </span>{" "}
            💚
          </p>
        </section>

        <section className="mt-12 border-t pt-8">
          <h2 className="text-3xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Dê Visibilidade à sua Gestão!
            </span>
          </h2>
          <div className="flex justify-center">
            <a
              href="/cadastro-projeto"
              className="group block text-center w-full sm:w-1/2 lg:w-1/3"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <img
                  src="/logo_aquitemods.png"
                  alt="Logo do Aqui Tem ODS"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                Envie o Projeto da sua Cidade
              </p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
