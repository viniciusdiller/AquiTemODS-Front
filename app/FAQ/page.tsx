import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import FaleConoscoButton from "@/components/FaleConoscoButton";
import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D7386E] to-[#3C6AB2] py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        {/* --- CABEÇALHO --- */}
        <section className="mb-8">
          <div className="md:flex md:items-center md:gap-8 lg:gap-12">
            <div className="md:w-2/3">
              <h1
                className=" text-4xl font-extrabold mb-6 inline-block pb-2
                  bg-gradient-to-r from-[#D7386E] to-[#3C6AB2]
                  bg-no-repeat
                  [background-position:0_100%]
                  [background-size:100%_4px]"
              >
                <span className=" bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
                  Perguntas Frequentes (FAQ)
                </span>
              </h1>
              <p className="text-gray-700 leading-relaxed text-lg">
                Tire suas dúvidas sobre o funcionamento da plataforma, o
                cadastro de projetos e os Objetivos de Desenvolvimento
                Sustentável (ODS).
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mt-4">
                Sua pergunta não está listada? Sinta-se à vontade para falar
                conosco! Estamos disponíveis no link 'Contato' no rodapé, no
                botão flutuante (canto inferior esquerdo do computador) ou no
                menu superior (pelo celular).
              </p>
            </div>
            <div className="mt-8 md:mt-0 md:w-1/3 flex-shrink-0 flex items-center justify-center">
              {/* Você pode substituir isso por uma imagem de FAQ se desejar */}
              <HelpCircle
                size={150}
                className="text-[#3C6AB2] opacity-20"
                strokeWidth={1}
              />
            </div>
          </div>
        </section>

        {/* --- SEÇÃO DE PERGUNTAS --- */}
        <section className="mb-8 border-t-2 pt-8">
          <h2 className="text-3xl font-bold text-left mb-10">
            <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Sobre o Projeto e os ODS
            </span>
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg text-left font-semibold">
                O que é a plataforma Aqui Tem ODS?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                O <strong>AquiTemODS</strong> é uma iniciativa da Prefeitura
                Municipal de Saquarema, idealizada pela Secretaria de Governança
                e Sustentabilidade (Lab ISA). É uma plataforma digital criada
                para reunir, organizar e divulgar boas práticas de gestão
                pública municipal que estejam alinhadas aos Objetivos de
                Desenvolvimento Sustentável (ODS) da ONU.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg text-left font-semibold">
                O que são os ODS (Objetivos de Desenvolvimento Sustentável)?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                São um conjunto de 17 metas globais estabelecidas pela
                Organização das Nações Unidas (ONU) em 2015. O propósito é
                erradicar a pobreza, proteger o planeta e promover prosperidade
                e paz para todas as pessoas até o ano de 2030, como parte da
                Agenda 2030.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg text-left font-semibold">
                Por que a plataforma lista 18 ODS em vez de 17?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                Além dos 17 ODS originais da ONU, o Brasil incorporou um 18º
                ODS, criado pela Comissão Nacional dos ODS (CNODS). Este
                objetivo adicional trata da <strong>Igualdade Étnico/Racial</strong>
                (Promoção dos Direitos Humanos e da Cidadania), reforçando o
                compromisso do país com a inclusão, equidade e justiça social.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* --- SEÇÃO DE CADASTRO --- */}
        <section className="mb-8 border-t-2 pt-8">
          <h2 className="text-3xl font-bold text-left mb-10">
            <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
              Cadastro e Gestão de Projetos
            </span>
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg text-left font-semibold">
                Quem pode cadastrar um projeto na plataforma?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                O cadastro está disponível para servidores públicos que desejem compartilhar boas práticas e projetos desenvolvidos em seu município, alinhados aos Objetivos de Desenvolvimento Sustentável (ODS) da Agenda 2030 da ONU, contribuindo para a valorização, visibilidade e troca de experiências entre gestões comprometidas com o desenvolvimento sustentável.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg text-left font-semibold">
                Como faço para CADASTRAR meu MEI na plataforma?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                1. Você precisa ter um cadastro de usuário e estar logado. Se
                não tiver,{" "}
                <Link href="/cadastro" className="text-blue-600 underline">
                  clique aqui para se cadastrar
                </Link>
                .
                <br />
                2. Acesse a página{" "}
                <Link
                  href="/cadastro-projeto"
                  className="text-blue-600 underline"
                >
                  "Cadastro de Projetos"
                </Link>{" "}
                no menu.
                <br />
                3. No seletor, escolha a opção "Cadastrar meu MEI na
                plataforma".
                <br />
                4. Preencha o formulário completo com as informações do
                responsável, dados do negócio, descrições, e anexe os arquivos
                solicitados (CCMEI, Logo, Portfólio).
                <br />
                5. Após o envio, seu cadastro passará por uma análise do
                administrador antes de ser publicado.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg text-left font-semibold">
                Como posso ATUALIZAR as informações de um projeto já cadastrado?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                1. Acesse a página{" "}
                <Link
                  href="/cadastro-projeto"
                  className="text-blue-600 underline"
                >
                  "Cadastro de Projetos"
                </Link>{" "}
                <br />
                2. Escolha a opção "Atualizar uma informação do meu projeto".
                <br />
                3. Você precisará preencher os dados de identificação
                obrigatórios (ID do Projeto, Prefeitura, Secretaria, Nome do
                Projeto e E-mail) para confirmar a autoria.
                <br />
                4. Em seguida, preencha <strong>apenas</strong> os campos que você deseja
                alterar. Campos deixados em branco não serão modificados.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg text-left font-semibold">
                Como posso EXCLUIR um projeto da plataforma?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed text-base">
                1. Acesse a página{" "}
                <Link
                  href="/cadastro-projeto"
                  className="text-blue-600 underline"
                >
                  "Cadastro de Projetos"
                </Link>{" "}
                <br />
                2. Escolha a opção "Excluir meu projeto da plataforma".
                <br />
                3. Você deverá preencher todos os campos de identificação (ID,
                Prefeitura, Secretaria, Nome do Projeto, Responsável e E-mail)
                para confirmar sua solicitação.
                <br />
                4. Após a confirmação, sua solicitação de exclusão será
                processada. <strong>Esta ação é permanente e não poderá ser revertida.</strong>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        <FaleConoscoButton />
      </div>
    </div>
  );
}
