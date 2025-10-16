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
                Conectando prefeituras e gestões públicas a um futuro mais
                sustentável. Cadastre seus projetos e inspire outras cidades!
              </p>
            </div>

            <div className="mt-8 md:mt-0 md:w-1/3 flex-shrink-0">
              <img
                src="/odss.png"
                alt="Logo dos Objetivos de Desenvolvimento Sustentável"
                width={400}
                height={400}
                className="w-full h-auto rounded-2xl shadow-md"
              />
            </div>
          </div>
        </section>

        {/* --- O QUE É --- */}
        <section className="mb-8 border-t pt-8">
          <h2 className="text-3xl font-bold text-left mb-10">
            <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              O que é o Aqui Tem ODS?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            O Aqui Tem ODS um portfólio digital dedicado a dar visibilidade e a
            conectar projetos e iniciativas de prefeituras de todo o Brasil que
            contribuem para o alcance dos 17 Objetivos de Desenvolvimento
            Sustentável (ODS) da ONU.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Aqui, gestores públicos podem compartilhar suas ações, inspirar
            outras administrações e encontrar parceiros para fortalecer o
            movimento por um futuro mais justo, inclusivo e sustentável em seus
            municípios.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Este é um convite para que as prefeituras se tornem protagonistas na
            construção de um Brasil alinhado com a Agenda 2030. Juntos, podemos
            transformar boas ideias em grandes impactos, mostrando que o
            desenvolvimento local é o caminho para a mudança global.
          </p>
        </section>

        {/* --- RECURSOS --- */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Quais são os principais recursos do Aqui Tem ODS
            </span>
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed text-lg space-y-2">
            <li>
              Vitrine para projetos e iniciativas sustentáveis das prefeituras.
            </li>
            <li>
              Mapa interativo para localizar onde as ações acontecem nos
              municípios.
            </li>
            <li>
              Informações sobre cada projeto, seus objetivos e resultados.
            </li>
            <li>Conexão entre gestores públicos para troca de experiências.</li>
            <li>
              Plataforma gratuita que incentiva a sustentabilidade e a inovação
              na gestão pública.
            </li>
          </ul>
        </section>

        {/* --- COMO PARTICIPAR --- */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Sou de uma prefeitura e quero cadastrar nossos projetos, como
              faço?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Se sua prefeitura possui projetos ou iniciativas que contribuem para
            um ou mais ODS, basta acessar a página “
            <a
              href="/cadastro-projeto"
              className="text-blue-600 hover:underline"
            >
              Cadastro de Projeto
            </a>
            ”. Lá você encontrará o formulário para incluir as informações, que
            posteriormente serão validadas pela nossa equipe e publicadas aqui.
          </p>
        </section>

        {/* --- QUEM PODE PARTICIPAR --- */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Quem pode cadastrar projetos na plataforma?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            O Aqui Tem ODS uma plataforma institucional voltada para a gestão
            pública. O cadastro de projetos é exclusivo para representantes de
            prefeituras e órgãos municipais que desejam dar visibilidade às suas
            ações de sustentabilidade.
          </p>
        </section>

        {/* --- ATUALIZAR/EXCLUIR --- */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#007a73] mb-3">
            <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Já cadastramos um projeto e desejamos atualizar ou remover as
              informações, como fazemos?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Na página de “
            <a
              href="/cadastro-projeto"
              className="text-blue-600 hover:underline"
            >
              Cadastro de Projeto
            </a>
            ”, haverá também a opção de atualizar ou excluir seu cadastro. Basta
            preencher o formulário com as informações necessárias que faremos as
            alterações solicitadas.
          </p>
        </section>

        {/* --- LINK PARA CADASTRO DE PROJETO --- */}
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
