// Enigmas do Futuro
import React from "react";

export default function EnigmasDoFuturoPage() {
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
                  Enigmas do Futuro
                </span>
              </h1>
              <p className="text-gray-700 leading-relaxed text-lg">
                Aqui você encontra enigmas, reflexões e inspiração para aprender
                sobre os ODS e moldar um futuro melhor.
              </p>
            </div>

            <div className="mt-8 md:mt-0 md:w-1/3 flex-shrink-0">
              <img
                src="/logo_jogo_ods.jpeg"
                alt="Logo do jogo Enigmas do Futuro"
                width={400}
                height={400}
                className="w-full h-auto rounded-2xl shadow-md"
              />
            </div>
          </div>
        </section>
        {/* --- CONTEÚDO PRINCIPAL --- */}
        <section className="mt-8 border-t pt-6">
          <h2 className="text-3xl font-bold text-left mb-10">
            <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              O que é "ODS: Enigmas do Futuro"?
            </span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            "ODS: Enigmas do Futuro" é um jogo interativo de mistério e
            adivinhação baseado nos 17 Objetivos de Desenvolvimento Sustentável
            (ODS) da ONU.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            O propósito do jogo é usar a lógica e o raciocínio para desvendar
            enigmas que apresentam cenários e soluções inovadoras ligados a cada
            um dos ODS. É uma forma envolvente e divertida de aprender sobre e
            refletir sobre os desafios e o futuro da sustentabilidade global.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            A iniciativa "ODS: Enigmas do Futuro" nasceu com a missão de ir além
            das cartilhas e dos textos formais. Nosso objetivo principal é
            ensinar crianças e adolescentes mais sobre os 17 Objetivos de
            Desenvolvimento Sustentável (ODS) da ONU, de uma maneira divertida,
            descontraída e estimulante.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Acreditamos que, ao transformar cada ODS em um mistério a ser
            resolvido, estamos ativando o raciocínio lógico, a curiosidade e o
            espírito de colaboração das novas gerações. Em vez de apenas
            memorizar metas, os jovens são convidados a pensar criticamente e
            descobrir, por conta própria, como as soluções inovadoras estão
            moldando um futuro mais justo e sustentável. É um convite para que
            eles se tornem os detetives do futuro!
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            Mais do que um jogo de enigmas, "ODS: Enigmas do Futuro" é uma
            ferramenta de conscientização e aprendizado ativo sobre o
            desenvolvimento sustentável, reafirmando o compromisso de educar as
            novas gerações para que se tornem agentes de transformação, capazes
            de solucionar os desafios e construir o futuro que desejamos para o
            nosso planeta.
          </p>
        </section>
        {/* --- LINK PARA O JOGO --- */}
        <section className="mt-12 border-t pt-6">
          <h2 className="text-3xl font-bold text-left mb-10">
            <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Link para o Enigmas do Futuro:
            </span>
          </h2>
          <div className="flex justify-center">
            <a
              href="https://enigma-do-futuro.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block text-center w-full sm:w-1/2 lg:w-1/3"
            >
              <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300">
                <img
                  src="/enigmas_do_futuro.png"
                  alt="Capa do Jogo Enigmas do Futuro"
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                Jogar Enigmas do Futuro
              </p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
