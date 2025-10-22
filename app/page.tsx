"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import ImageCarousel from "../components/ImageCarousel";
import { Search } from "lucide-react";
import ButtonWrapper from "../components/ui/button-home";
import FaleConoscoButton from "@/components/FaleConoscoButton";

export { categories };
const categories = [
  {
    id: "ODS1",
    title: "ODS 1 - Erradicação da Pobreza",
    backgroundimg: "/categorias/fundo_ods1.png",
    tagsinv:
      "ods1, ods 1, ODS-1, erradicação da pobreza, erradicacao da pobreza, erradicar a pobreza, pobreza, pobreza extrema, miséria, pobreza severa, vulnerabilidade, vulnerabilidade social, exclusão social, exclusão, desigualdade, desigualdade de renda, desigualdades, pobreza multidimensional, privação, insegurança econômica, insegurança alimentar, fome, desnutrição, segurança alimentar, alimentação, acesso à alimentação, acesso a alimentos, nutrição, renda, renda mínima, renda básica, renda básica universal, transferência de renda, Bolsa Família, bolsa familia, auxilio emergencial, auxílio emergencial, benefícios sociais, proteção social, seguridade social, assistência social, políticas sociais, políticas públicas, programas sociais, inclusão social, inclusão econômica, inclusão produtiva, emprego, desemprego, subemprego, trabalho decente, informalidade, economia informal, trabalho informal, emprego formal, mercado de trabalho, geração de renda, microcrédito, microfinanças, empreendedorismo social, empreendedorismo, economia solidária, cooperativas, habitação, moradia, sem-teto, sem teto, favelas, saneamento, água potável, acesso à água, acesso a serviços básicos, saúde, acesso à saúde, educação, acesso à educação, alfabetização, analfabetismo, crianças em pobreza, famílias em pobreza, mulheres em pobreza, igualdade de gênero e pobreza, juventude vulnerável, idosos vulneráveis, migrantes em pobreza, deslocamento, refugiados, choque econômico, choques climáticos, resiliência, resiliência comunitária, proteção contra choques, redes de segurança, segurança econômica, indicadores de pobreza, medida de pobreza, linha de pobreza, linha internacional de pobreza, pobreza por renda, pobreza não monetária, índice de pobreza, meta 2030, Agenda 2030, Objetivos de Desenvolvimento Sustentável, Sustainable Development Goal 1, SDG 1, ONU, United Nations, financiamento para pobreza, recursos para desenvolvimento, políticas sensíveis ao gênero, equidade, justiça social, direitos econômicos, direitos sociais, acesso a serviços, acesso a tecnologia, controle de terra, titularidade da terra, segurança alimentar e nutricional, apoio a agricultores familiares, agricultura familiar, desenvolvimento rural, ruralidade e pobreza, urbanização e pobreza, periferia, mobilização de recursos, investimentos sociais, avaliação de impacto, monitoramento e avaliação, indicadores sociais, dados desagregados, pobreza por região, pobreza urbana, pobreza rural, programas de transferência condicionada, transferência condicionada, assistência técnica, capacitação, formação profissional, inclusão digital, acesso a crédito, combate à pobreza, estratégias antipobreza, redução da pobreza, políticas públicas antipobreza, ninguém ficará para trás, no one left behind, dignidade humana, bem-estar, qualidade de vida, serviços comunitários, centros de referência, mitigação da pobreza, prevenção da pobreza, cobertura social, cobertura universal, cobertura dos pobres, proteção a grupos vulneráveis, sustentabilidade e pobreza, desenvolvimento inclusivo, crescimento inclusivo, segurança social universal",
  },
  {
    id: "ODS2",
    title: "ODS 2 - Fome Zero e Agricultura Sustentável",
    backgroundimg: "/categorias/fundo_ods2.png",
    tagsinv:
      "ods2, ods 2, ODS-2, fome zero, erradicação da fome, erradicacao da fome, combate à fome, segurança alimentar, segurança alimentar e nutricional, alimentação saudável, alimentação adequada, nutrição, nutrição infantil, desnutrição, má nutrição, subnutrição, carência nutricional, deficiências nutricionais, obesidade, obesidade infantil, sobrepeso, alimentação equilibrada, dieta saudável, agricultura sustentável, agricultura, produção agrícola, produção de alimentos, sistema alimentar sustentável, sistemas alimentares, agroecologia, agricultura orgânica, agricultura familiar, agricultores familiares, pequeno produtor, agricultura local, produção local, agroindústria, agroindústria familiar, agroturismo, agrofloresta, manejo sustentável, agropecuária sustentável, pecuária sustentável, pesca sustentável, aquicultura sustentável, alimentos orgânicos, produtos orgânicos, alimentos naturais, soberania alimentar, abastecimento alimentar, cadeia produtiva dos alimentos, cadeia alimentar, logística alimentar, desperdício de alimentos, redução do desperdício, aproveitamento de alimentos, bancos de alimentos, doação de alimentos, programas de alimentação, merenda escolar, alimentação escolar, PNAE, Programa Nacional de Alimentação Escolar, PAA, Programa de Aquisição de Alimentos, combate à fome, combate à insegurança alimentar, combate à desnutrição, combate ao desperdício, fome no mundo, fome no Brasil, agricultura resiliente, adaptação climática na agricultura, mudanças climáticas e agricultura, resiliência alimentar, tecnologias agrícolas, inovação agrícola, extensão rural, assistência técnica rural, crédito rural, financiamento agrícola, apoio a agricultores, valorização do campo, desenvolvimento rural, desenvolvimento sustentável no campo, reforma agrária, acesso à terra, direito à terra, posse da terra, recursos naturais, fertilidade do solo, conservação do solo, manejo da água, irrigação sustentável, sementes nativas, sementes crioulas, biodiversidade agrícola, polinizadores, agrodiversidade, alimentos nutritivos, micronutrientes, vitaminas e minerais, saúde alimentar, programas nutricionais, políticas alimentares, políticas públicas de nutrição, combate à fome infantil, amamentação, aleitamento materno, alimentação de gestantes, segurança alimentar das famílias, população em vulnerabilidade alimentar, acesso a alimentos, acesso à alimentação, direito humano à alimentação adequada, DHAA, direito à nutrição, equidade alimentar, mulheres na agricultura, juventude rural, mulheres rurais, igualdade de gênero na agricultura, acesso à tecnologia agrícola, mecanização sustentável, produtividade agrícola, eficiência agrícola, colheita, plantio sustentável, agricultura de precisão, bioeconomia, biotecnologia agrícola, economia circular na agricultura, agricultura regenerativa, recuperação de solos degradados, adaptação climática, mitigação climática na agricultura, gestão sustentável da água, ODS 2 Fome Zero e Agricultura Sustentável, Objetivo de Desenvolvimento Sustentável 2, Sustainable Development Goal 2, SDG 2, ONU, United Nations, Agenda 2030, metas ODS2, meta 2.1, meta 2.2, meta 2.3, meta 2.4, meta 2.5, produção sustentável, sistemas de produção resilientes, preservação genética, recursos genéticos, bancos de sementes, variabilidade genética, agricultura de baixo carbono, práticas agrícolas sustentáveis, soberania alimentar e nutricional, políticas agrícolas, cooperação internacional para agricultura, investimento agrícola, financiamento rural, comércio justo, fair trade, acesso a mercados, mercados locais, cadeias curtas de comercialização, feiras livres, feiras orgânicas, alimentação sustentável, consumo consciente, consumo responsável, redução da fome, eliminação da fome, fome zero e agricultura sustentável",
  },
  {
    id: "ODS3",
    title: "ODS 3 - Saúde e Bem-estar",
    backgroundimg: "/categorias/fundo_ods3.png",
    tagsinv:
      "ods3, ods 3, ODS-3, saúde e bem-estar, saude e bem estar, saúde, bem-estar, bem estar, qualidade de vida, sistema de saúde, sistema único de saúde, SUS, saúde pública, saúde coletiva, atenção básica, atenção primária à saúde, promoção da saúde, prevenção de doenças, tratamento, reabilitação, cuidados médicos, assistência médica, acesso à saúde, serviços de saúde, hospitais, clínicas, unidades de saúde, profissionais de saúde, médicos, enfermeiros, agentes comunitários, agentes de saúde, vacinação, imunização, campanhas de vacinação, vacinas, doenças infecciosas, doenças transmissíveis, doenças não transmissíveis, doenças crônicas, doenças cardiovasculares, câncer, diabetes, hipertensão, obesidade, saúde mental, depressão, ansiedade, suicídio, prevenção ao suicídio, Setembro Amarelo, uso de substâncias, drogas, alcoolismo, tabagismo, reabilitação de dependentes, saúde reprodutiva, saúde materna, saúde infantil, mortalidade infantil, mortalidade materna, gravidez, parto seguro, pré-natal, aleitamento materno, amamentação, nutrição materna, nutrição infantil, planejamento familiar, direitos reprodutivos, saúde sexual e reprodutiva, infecções sexualmente transmissíveis, ISTs, HIV, AIDS, hepatite, tuberculose, malária, dengue, zika, chikungunya, hanseníase, doenças tropicais negligenciadas, epidemias, pandemias, COVID-19, coronavírus, resposta à pandemia, vigilância sanitária, vigilância epidemiológica, controle de doenças, campanhas de saúde, saneamento, água potável, higiene, saúde ambiental, poluição, poluição do ar, poluição da água, qualidade do ar, segurança alimentar e nutricional, alimentação saudável, atividade física, esportes, exercícios, estilo de vida saudável, prevenção ao sedentarismo, saúde ocupacional, segurança do trabalho, acidentes de trabalho, primeiros socorros, acidentes de trânsito, segurança viária, transporte seguro, trauma, violência, violência doméstica, violência contra a mulher, violência infantil, homicídios, segurança pública e saúde, paz e bem-estar, saúde comunitária, assistência social e saúde, saúde das populações vulneráveis, idosos, pessoas com deficiência, gestantes, adolescentes, crianças, população LGBTQIA+, população negra, povos indígenas, saúde rural, saúde urbana, desigualdade em saúde, equidade em saúde, determinantes sociais da saúde, indicadores de saúde, expectativa de vida, taxa de mortalidade, morbidade, cobertura vacinal, políticas públicas de saúde, planos de saúde, acesso universal à saúde, cobertura universal de saúde, fortalecimento do SUS, financiamento da saúde, investimento em saúde, pesquisa em saúde, inovação médica, biotecnologia, farmacêutica, medicamentos, acesso a medicamentos, medicamentos essenciais, farmacovigilância, uso racional de medicamentos, medicina tradicional, fitoterapia, terapias complementares, telemedicina, saúde digital, prontuário eletrônico, dados de saúde, inteligência artificial na saúde, transformação digital na saúde, educação em saúde, campanhas educativas, hábitos saudáveis, autocuidado, saúde preventiva, bem-estar emocional, equilíbrio mental, saúde psicológica, psicologia, psiquiatria, terapia, mindfulness, meditação, qualidade do sono, descanso, lazer e saúde, saúde no trabalho, ergonomia, alimentação balanceada, combate ao estresse, redução de riscos à saúde, políticas de segurança viária, emergências médicas, resposta humanitária, catástrofes naturais e saúde, mudanças climáticas e saúde, resiliência em saúde, infraestrutura hospitalar, saneamento básico, água e saúde, saúde global, cooperação internacional em saúde, OMS, Organização Mundial da Saúde, ONU, United Nations, Objetivo de Desenvolvimento Sustentável 3, Sustainable Development Goal 3, SDG 3, Agenda 2030, meta 3.1, meta 3.2, meta 3.3, meta 3.4, meta 3.5, meta 3.6, meta 3.7, meta 3.8, meta 3.9, meta 3.a, meta 3.b, meta 3.c, meta 3.d, saúde universal, cobertura universal, fortalecimento da capacidade nacional de saúde, combate à pandemia, combate à epidemia, fortalecimento dos sistemas de saúde, saúde e desenvolvimento sustentável",
  },
  {
    id: "ODS4",
    title: "ODS 4 - Educação de Qualidade",
    backgroundimg: "/categorias/fundo_ods4.png",
    tagsinv:
      "ods4, ods 4, ODS-4, educação de qualidade, educacao de qualidade, educação, ensino, aprendizagem, escola, escolas, ensino fundamental, ensino médio, educação infantil, creche, pré-escola, ensino superior, universidades, faculdades, cursos técnicos, EJA, educação de jovens e adultos, alfabetização, letramento, analfabetismo, alfabetização infantil, alfabetização de adultos, leitura, escrita, matemática básica, raciocínio lógico, habilidades cognitivas, ensino de ciências, ensino de artes, educação física, ensino tecnológico, inovação educacional, metodologias ativas, ensino híbrido, educação digital, educação a distância, EAD, plataformas de aprendizagem, ensino online, tecnologia educacional, edtech, acesso à educação, acesso à escola, universalização da educação, inclusão educacional, educação inclusiva, educação especial, pessoas com deficiência, estudantes com deficiência, acessibilidade, equidade educacional, igualdade de oportunidades, educação para todos, qualidade do ensino, formação de professores, capacitação docente, valorização do magistério, carreira docente, piso salarial docente, condições de trabalho, infraestrutura escolar, merenda escolar, transporte escolar, material didático, recursos pedagógicos, bibliotecas escolares, laboratórios de ciências, laboratórios de informática, internet nas escolas, conectividade educacional, inovação na educação, currículos inclusivos, currículo escolar, BNCC, Base Nacional Comum Curricular, competências socioemocionais, habilidades do século XXI, pensamento crítico, criatividade, resolução de problemas, colaboração, comunicação, empatia, educação emocional, educação socioemocional, aprendizagem contínua, aprendizagem ao longo da vida, educação permanente, formação continuada, educação técnica, educação profissional, qualificação profissional, empregabilidade, formação cidadã, cidadania, ética, valores, respeito, diversidade, multiculturalismo, interculturalidade, educação antirracista, educação indígena, educação quilombola, educação do campo, educação rural, educação urbana, desigualdade educacional, evasão escolar, abandono escolar, repetência, desempenho escolar, avaliação educacional, IDEB, indicadores educacionais, políticas públicas de educação, financiamento da educação, FUNDEB, investimentos em educação, planos de educação, PNE, Plano Nacional de Educação, gestão escolar, liderança educacional, participação da comunidade, conselhos escolares, engajamento estudantil, protagonismo juvenil, educação ambiental, sustentabilidade na educação, ODS e escolas, cultura de paz, direitos humanos na educação, educação em direitos humanos, igualdade de gênero na educação, meninas na escola, mulheres na ciência, educação STEM, ciência, tecnologia, engenharia e matemática, educação científica, feiras de ciências, olimpíadas do conhecimento, olimpíadas de matemática, ensino técnico e tecnológico, inovação e pesquisa, bolsas de estudo, programas de intercâmbio, mobilidade estudantil, internacionalização da educação, UNESCO, ONU, United Nations, Objetivo de Desenvolvimento Sustentável 4, Sustainable Development Goal 4, SDG 4, Agenda 2030, meta 4.1, meta 4.2, meta 4.3, meta 4.4, meta 4.5, meta 4.6, meta 4.7, meta 4.a, meta 4.b, meta 4.c, educação de qualidade para todos, aprendizagem inclusiva, oportunidades educacionais iguais, educação e desenvolvimento sustentável, educação transformadora, educação global, cidadania global, cultura de sustentabilidade, direito à educação, erradicação do analfabetismo, educação acessível, educação gratuita, ensino gratuito, inclusão digital, tecnologias educacionais, ferramentas pedagógicas, inovação social na educação, aprendizagem significativa, ambiente de aprendizagem seguro, escolas seguras, combate ao bullying, combate à violência escolar, bem-estar estudantil, saúde mental na escola, apoio psicopedagógico, acompanhamento escolar, tutoria, mentoria, desenvolvimento pessoal, educação e trabalho, formação técnica e profissional, juventude e educação, oportunidades de aprendizado, desenvolvimento humano e educação, qualidade da educação brasileira, desafios da educação, educação pós-pandemia, recuperação da aprendizagem, ensino remoto, aprendizagem híbrida, escolas sustentáveis, educação para o futuro",
  },
  {
    id: "ODS5",
    title: "ODS 5 - Igualdade de Gênero",
    backgroundimg: "/categorias/fundo_ods5.png",
    tagsinv:
      "ods5, ods 5, ODS-5, igualdade de gênero, igualdade de genero, equidade de gênero, equidade de genero, empoderamento feminino, empoderamento das mulheres, direitos das mulheres, direitos das meninas, mulheres e meninas, gênero, diversidade de gênero, justiça de gênero, discriminação de gênero, fim da discriminação, combate ao machismo, combate à misoginia, machismo, misoginia, patriarcado, sexismo, estereótipos de gênero, papéis de gênero, igualdade de oportunidades, equidade salarial, igualdade salarial, diferença salarial, paridade de gênero, liderança feminina, participação feminina, representatividade feminina, mulheres na política, mulheres no poder, participação das mulheres, mulheres na ciência, mulheres na tecnologia, mulheres na educação, mulheres na economia, mulheres empreendedoras, empreendedorismo feminino, mulheres rurais, mulheres urbanas, mulheres negras, mulheres indígenas, mulheres com deficiência, interseccionalidade, feminismo, movimento feminista, ativismo feminino, direitos humanos das mulheres, autonomia feminina, autonomia econômica, independência financeira feminina, mulheres no mercado de trabalho, empregabilidade feminina, inserção laboral, assédio, assédio sexual, assédio moral, violência de gênero, violência contra a mulher, violência doméstica, violência psicológica, violência sexual, feminicídio, combate ao feminicídio, Lei Maria da Penha, proteção às mulheres, rede de apoio às mulheres, centros de referência da mulher, políticas públicas para mulheres, programas de apoio à mulher, acolhimento de vítimas, empatia e respeito, igualdade no lar, divisão justa do trabalho doméstico, cuidado compartilhado, corresponsabilidade familiar, licença-maternidade, licença-paternidade, licença parental, mães solo, paternidade responsável, cuidados com a família, cuidados com crianças e idosos, trabalho do cuidado, reconhecimento do trabalho doméstico, trabalho não remunerado, valorização do cuidado, inclusão de gênero, educação para a igualdade, educação de meninas, meninas na escola, combate ao casamento infantil, combate ao casamento precoce, fim da mutilação genital feminina, direitos reprodutivos, saúde sexual e reprodutiva, planejamento familiar, acesso a contraceptivos, acesso à saúde reprodutiva, liberdade reprodutiva, escolha sobre o próprio corpo, maternidade segura, parto humanizado, gestação segura, combate à mortalidade materna, saúde das mulheres, saúde menstrual, dignidade menstrual, acesso a absorventes, pobreza menstrual, igualdade no esporte, mulheres no esporte, mulheres na cultura, mulheres nas artes, mulheres na mídia, representatividade na mídia, estereótipos midiáticos, mídia e gênero, publicidade e gênero, empoderamento social, empoderamento político, empoderamento econômico, participação comunitária, mulheres líderes, igualdade de acesso à tecnologia, inclusão digital feminina, mulheres na inovação, mulheres em STEM, ciência, tecnologia, engenharia e matemática, liderança feminina na ciência, educação em gênero, formação em gênero, capacitação para mulheres, apoio ao empreendedorismo feminino, microcrédito para mulheres, cooperativas de mulheres, economia solidária feminina, acesso à propriedade, acesso a recursos produtivos, acesso a financiamento, herança e propriedade, igualdade de direitos econômicos, direito à terra, políticas sensíveis ao gênero, orçamentos sensíveis ao gênero, programas governamentais de gênero, igualdade e sustentabilidade, desenvolvimento sustentável e gênero, mulheres e meio ambiente, mulheres e clima, ativismo climático feminino, mulheres em cargos decisórios, participação paritária, quotas de gênero, representação igualitária, ONU Mulheres, ONU, United Nations, Objetivo de Desenvolvimento Sustentável 5, Sustainable Development Goal 5, SDG 5, Agenda 2030, meta 5.1, meta 5.2, meta 5.3, meta 5.4, meta 5.5, meta 5.6, meta 5.a, meta 5.b, meta 5.c, empoderamento de todas as mulheres e meninas, igualdade plena de direitos, direitos e oportunidades iguais, eliminar todas as formas de violência de gênero, eliminar práticas nocivas, fortalecer políticas públicas de igualdade de gênero, igualdade de gênero e desenvolvimento sustentável, mulheres e justiça social, direitos humanos e gênero, paridade e inclusão, sociedade igualitária, transformação social e igualdade de gênero",
  },
  {
    id: "ODS6",
    title: "ODS 6 - Água Potável e Saneamento",
    backgroundimg: "/categorias/fundo_ods6.png",
    tagsinv:
      "gastronomia, culinária, cozinha, alimentação, comida, restaurante, lanchonete, bar, hamburgueria, pizzaria, sorveteria, confeitaria, padaria, cafeteria, churrascaria, quiosque, marmita, marmitex, self-service, buffet, delivery, comida saudável, alimentação saudável, fit, fitness, marmita fitness, comida caseira, comida japonesa, sushi, sashimi, comida chinesa, yakissoba, comida italiana, massas, lasanha, espaguete, comida brasileira, feijoada, moqueca, acarajé, pastel, quentinha, bebida, sucos, refrigerante, cerveja artesanal, drinks",
  },
  {
    id: "ODS7",
    title: "ODS 7 - Energia Limpa e Acessível",
    backgroundimg: "/categorias/fundo_ods7.png",
    tagsinv:
      "ods6, ods 6, ODS-6, água potável e saneamento, agua potavel e saneamento, água limpa, saneamento básico, abastecimento de água, fornecimento de água, tratamento de água, purificação da água, qualidade da água, recursos hídricos, gestão da água, gestão hídrica, gestão integrada da água, uso sustentável da água, conservação da água, economia de água, reuso de água, reaproveitamento de água, reciclagem de água, água cinza, dessalinização, captação de água da chuva, água subterrânea, aquíferos, rios, lagos, nascentes, bacias hidrográficas, proteção de nascentes, proteção de mananciais, mananciais, poluição da água, despoluição de rios, limpeza de rios, saneamento rural, saneamento urbano, tratamento de esgoto, coleta de esgoto, rede de esgoto, esgotamento sanitário, fossas sépticas, sistemas alternativos de saneamento, esgoto tratado, drenagem urbana, controle de enchentes, manejo de águas pluviais, infraestrutura hídrica, infraestrutura de saneamento, acesso à água potável, acesso ao saneamento, acesso universal à água, acesso universal ao saneamento, direito humano à água, direito humano ao saneamento, desigualdade no acesso à água, desigualdade no acesso ao saneamento, comunidades sem água, comunidades sem saneamento, áreas rurais e água, favelas e saneamento, vulnerabilidade hídrica, pobreza hídrica, escassez de água, crise da água, seca, desertificação, mudanças climáticas e água, resiliência hídrica, segurança hídrica, disponibilidade de água, qualidade e quantidade da água, monitoramento da água, indicadores de qualidade da água, gestão sustentável dos recursos hídricos, políticas públicas de saneamento, Plano Nacional de Saneamento, PLANSAB, regulação do saneamento, agências reguladoras, marcos legais do saneamento, universalização do saneamento, investimentos em saneamento, infraestrutura sustentável, inovação em saneamento, tecnologias de saneamento, tecnologias de purificação, tecnologias de reuso, eficiência hídrica, uso racional da água, consumo consciente de água, educação ambiental e água, educação para o uso da água, campanhas de conscientização, preservação dos rios, revitalização de bacias, reflorestamento de matas ciliares, proteção de ecossistemas aquáticos, biodiversidade aquática, zonas úmidas, oceanos e rios, mares limpos, esgoto zero, poluentes, resíduos líquidos, descarte de resíduos, poluição industrial, poluição agrícola, agrotóxicos e água, fertilizantes e contaminação, microplásticos, produtos químicos perigosos, tratamento de resíduos industriais, tratamento de efluentes, controle de poluição, água e saúde, doenças de veiculação hídrica, diarreia, cólera, dengue, saneamento e saúde pública, higiene, higiene pessoal, higiene das mãos, lavagem das mãos, banheiros, banheiros públicos, instalações sanitárias, infraestrutura escolar e saneamento, saneamento em hospitais, saneamento em comunidades, saneamento ecológico, soluções baseadas na natureza, infraestrutura verde, proteção de nascentes e florestas, restauração de ecossistemas, governança da água, participação comunitária na gestão da água, gestão local da água, conselhos de bacia hidrográfica, gestão compartilhada da água, cooperação internacional pela água, recursos transfronteiriços, bacias internacionais, acordos sobre a água, diplomacia da água, ONU, United Nations, Objetivo de Desenvolvimento Sustentável 6, Sustainable Development Goal 6, SDG 6, Agenda 2030, meta 6.1, meta 6.2, meta 6.3, meta 6.4, meta 6.5, meta 6.6, meta 6.a, meta 6.b, garantir disponibilidade e gestão sustentável da água e saneamento para todos, água e desenvolvimento sustentável, água limpa e saneamento para todos, ODS Água, sustentabilidade hídrica, ciclo da água, tratamento sustentável, inovação hídrica, políticas integradas de água e saneamento, governança sustentável da água, acesso equitativo à água, gestão participativa da água",
  },
  {
    id: "ODS8",
    title: "ODS 8 - Trabalho Decente e Crescimento Econômico",
    backgroundimg: "/categorias/fundo_ods8.png",
    tagsinv:
      "ods7, ods 7, ODS-7, energia limpa e acessível, energia sustentável, energia renovável, energias renováveis, energia acessível, acesso à energia, eletricidade para todos, eletrificação rural, eletrificação urbana, energia solar, painéis solares, energia fotovoltaica, energia eólica, turbinas eólicas, energia hidráulica, hidrelétrica, pequenas centrais hidrelétricas, energia geotérmica, energia das marés, energia oceânica, biomassa, biogás, biocombustíveis, etanol, biodiesel, hidrogênio verde, transição energética, matriz energética sustentável, descarbonização, neutralidade de carbono, energia limpa, energia verde, eficiência energética, uso eficiente de energia, conservação de energia, economia de energia, redução do consumo energético, tecnologia energética, inovação em energia, redes inteligentes, smart grid, medidores inteligentes, armazenamento de energia, baterias, baterias de lítio, armazenamento térmico, microgeração distribuída, geração distribuída, energia descentralizada, mini usinas solares, comunidades energéticas, cooperativas de energia, energia comunitária, acesso universal à energia, pobreza energética, equidade energética, energia e inclusão social, energia para o desenvolvimento, segurança energética, fontes de energia sustentáveis, fontes alternativas de energia, energia limpa no transporte, mobilidade elétrica, carros elétricos, veículos híbridos, transporte sustentável, estações de recarga, infraestrutura elétrica, redes de distribuição, transmissão de energia, geração de energia, produção de energia sustentável, energia e indústria, eficiência industrial, edifícios sustentáveis, iluminação pública eficiente, LED, aquecimento solar, aquecimento de água, refrigeração eficiente, energia para agricultura, bombeamento solar, irrigação solar, energia rural, acesso à eletricidade em áreas isoladas, soluções off-grid, mini redes elétricas, microgrids, tecnologias de baixo carbono, investimentos em energia renovável, financiamento verde, políticas energéticas, políticas de energia sustentável, marcos regulatórios de energia, tarifas de energia, incentivos fiscais para energia limpa, subsídios à energia sustentável, economia de baixo carbono, sustentabilidade energética, energias do futuro, inovação tecnológica em energia, pesquisa em energia, energias emergentes, startups de energia, energia e clima, mudanças climáticas e energia, redução de emissões, emissões de gases de efeito estufa, mitigação climática, neutralidade climática, adaptação energética, energia e desenvolvimento sustentável, energia e meio ambiente, energia e pobreza, energia e saúde, energia e educação, energia para o bem-estar, desenvolvimento econômico sustentável, crescimento verde, energia acessível e confiável, energia resiliente, infraestrutura energética sustentável, energia inclusiva, energia nas cidades, energia nas comunidades rurais, energia e produtividade, ONU, United Nations, Objetivo de Desenvolvimento Sustentável 7, Sustainable Development Goal 7, SDG 7, Agenda 2030, meta 7.1, meta 7.2, meta 7.3, meta 7.a, meta 7.b, acesso confiável e moderno à energia, aumento da participação das energias renováveis, duplicar a eficiência energética global, tecnologia energética moderna, cooperação internacional em energia, inovação sustentável, sustentabilidade energética global, energia limpa para todos, energia acessível e sustentável, energia do futuro, eletrificação sustentável, futuro energético, transição para energia verde",
  },
  {
    id: "ODS9",
    title: "ODS 9 - Indústria, Inovação e Infraestrutura",
    backgroundimg: "/categorias/fundo_ods9.png",
    tagsinv:
      "ods9, ods 9, ODS-9, indústria, inovação e infraestrutura, desenvolvimento industrial, industrialização sustentável, inovação tecnológica, infraestrutura resiliente, infraestrutura sustentável, tecnologia, ciência e tecnologia, pesquisa e desenvolvimento, P&D, desenvolvimento tecnológico, inovação industrial, modernização industrial, indústria 4.0, automação industrial, robótica, inteligência artificial, IA, machine learning, internet das coisas, IoT, impressão 3D, manufatura aditiva, transformação digital, digitalização da indústria, sustentabilidade industrial, eficiência produtiva, produção limpa, produção sustentável, economia de baixo carbono, descarbonização industrial, energias renováveis na indústria, ecoeficiência, tecnologias limpas, processos sustentáveis, inovação sustentável, design sustentável, economia circular, reciclagem industrial, reaproveitamento de materiais, logística reversa, cadeias de valor sustentáveis, cadeias produtivas sustentáveis, cadeias de suprimentos, supply chain sustentável, infraestrutura de transporte, transporte ferroviário, transporte rodoviário, portos, aeroportos, infraestrutura urbana, infraestrutura rural, infraestrutura digital, conectividade, inclusão digital, internet banda larga, 5G, redes inteligentes, telecomunicações, infraestrutura energética, energia para a indústria, redes elétricas, energia renovável industrial, infraestrutura hídrica, abastecimento industrial, saneamento industrial, infraestrutura verde, infraestrutura resiliente a desastres, resiliência industrial, infraestrutura inteligente, cidades industriais, polos industriais, parques tecnológicos, distritos industriais, clusters de inovação, incubadoras tecnológicas, aceleradoras de startups, startups industriais, empreendedorismo tecnológico, investimento em inovação, investimento em infraestrutura, financiamento sustentável, crédito industrial, políticas industriais, políticas de inovação, políticas de infraestrutura, desenvolvimento científico, cooperação científica, transferência de tecnologia, propriedade intelectual, patentes, pesquisa aplicada, universidades e inovação, centros de pesquisa, inovação aberta, parcerias público-privadas, PPP, investimento público e privado, modernização da infraestrutura, infraestrutura sustentável para o desenvolvimento, infraestrutura inclusiva, acesso à infraestrutura, acesso à tecnologia, apoio às indústrias locais, indústrias sustentáveis, indústrias de base, indústrias criativas, engenharia, construção civil sustentável, materiais sustentáveis, construção verde, planejamento urbano e industrial, transporte sustentável, logística sustentável, infraestrutura logística, corredores de transporte, corredores industriais, inovação em transporte, veículos elétricos, mobilidade industrial sustentável, redução de emissões industriais, neutralidade de carbono na indústria, economia verde industrial, competitividade industrial, produtividade industrial, inovação produtiva, tecnologia verde, soluções inovadoras, engenharia de produção, infraestrutura social, infraestrutura de saúde, infraestrutura educacional, infraestrutura cultural, infraestrutura econômica, sustentabilidade tecnológica, ONU, United Nations, Objetivo de Desenvolvimento Sustentável 9, Sustainable Development Goal 9, SDG 9, Agenda 2030, meta 9.1, meta 9.2, meta 9.3, meta 9.4, meta 9.5, meta 9.a, meta 9.b, meta 9.c, promover industrialização sustentável, fomentar inovação, construir infraestrutura resiliente, desenvolvimento tecnológico inclusivo, inovação para o desenvolvimento sustentável, indústria e desenvolvimento sustentável, infraestrutura para o crescimento econômico, inovação para o bem-estar, tecnologia sustentável, progresso tecnológico, engenharia sustentável, transformação industrial sustentável",
  },
  {
    id: "ODS10",
    title: "ODS 10 - Redução das Desigualdades",
    backgroundimg: "/categorias/fundo_ods10.png",
    tagsinv:
      "ods10, ods 10, ODS-10, redução das desigualdades, reducao das desigualdades, desigualdade social, desigualdade econômica, desigualdade de renda, pobreza, inclusão social, inclusão econômica, equidade, justiça social, direitos humanos, direitos econômicos, direitos sociais, acesso a serviços, acesso à saúde, acesso à educação, acesso à moradia, acesso à tecnologia, igualdade de oportunidades, oportunidades iguais, igualdade de gênero, equidade de gênero, mulheres e igualdade, juventude e inclusão, inclusão de pessoas com deficiência, pessoas com deficiência, idosos, inclusão racial, equidade racial, igualdade racial, povos indígenas, comunidades tradicionais, minorias, direitos das minorias, empoderamento de grupos vulneráveis, vulnerabilidade social, proteção social, segurança social, políticas públicas inclusivas, programas sociais, transferência de renda, redistribuição de renda, tributação progressiva, financiamento social, acesso a crédito, microcrédito, empreendedorismo inclusivo, economia inclusiva, crescimento inclusivo, mobilidade social, igualdade urbana, redução da pobreza urbana, redução da pobreza rural, desenvolvimento regional, desenvolvimento sustentável, cidades inclusivas, planejamento urbano inclusivo, transporte acessível, mobilidade urbana, inclusão digital, digitalização inclusiva, tecnologia para todos, participação política, engajamento cívico, democracia participativa, liderança comunitária, representação de minorias, combate à discriminação, combate ao racismo, combate à xenofobia, combate à homofobia, combate à transfobia, combate à intolerância, combate à exclusão, igualdade perante a lei, acesso à justiça, proteção legal, legislação antidiscriminatória, direitos civis, direitos políticos, proteção de direitos, cooperação internacional, solidariedade internacional, apoio a refugiados, migração segura, migração regular, migração justa, remessas, integração de migrantes, inclusão econômica de migrantes, políticas de imigração, mobilização de recursos, programas de desenvolvimento inclusivo, redução das disparidades, monitoramento de desigualdades, indicadores sociais, indicadores econômicos, ODS 10 Desigualdade, Objetivo de Desenvolvimento Sustentável 10, Sustainable Development Goal 10, SDG 10, ONU, United Nations, Agenda 2030, meta 10.1, meta 10.2, meta 10.3, meta 10.4, meta 10.5, meta 10.6, meta 10.7, promover a igualdade dentro dos países e entre países, reduzir a desigualdade de renda, promover a inclusão social, econômica e política, empoderamento de todos, combater discriminação, reduzir disparidades, desenvolvimento sustentável e equidade, crescimento inclusivo e sustentável, igualdade para todos, oportunidades iguais para todos",
  },
  {
    id: "ODS11",
    title: "ODS 11 - Cidades e Comunidades Sustentáveis",
    backgroundimg: "/categorias/fundo_ods11.png",
    tagsinv:
      "ods11, ods 11, ODS-11, cidades e comunidades sustentáveis, cidades sustentáveis, desenvolvimento urbano sustentável, planejamento urbano, planejamento territorial, urbanização, crescimento urbano, mobilidade urbana, transporte público, transporte sustentável, transporte coletivo, ciclovias, transporte ativo, pedestres, acessibilidade urbana, inclusão urbana, habitação, moradia adequada, habitação social, regularização fundiária, infraestrutura urbana, saneamento urbano, água e esgoto, gestão de resíduos, coleta de lixo, reciclagem, resíduos sólidos, resíduos urbanos, gestão ambiental urbana, espaços públicos, praças, parques, áreas verdes, áreas de lazer, preservação ambiental, proteção de áreas verdes, biodiversidade urbana, mitigação de impactos urbanos, poluição do ar, poluição sonora, poluição hídrica, qualidade do ar, qualidade ambiental, eficiência energética urbana, iluminação pública eficiente, energia sustentável em cidades, cidades inteligentes, smart cities, tecnologias urbanas, digitalização urbana, governança urbana, participação comunitária, engajamento cidadão, conselhos comunitários, segurança urbana, redução da criminalidade, prevenção da violência, resiliência urbana, adaptação a desastres, gestão de riscos, prevenção de desastres naturais, infraestrutura resiliente, recuperação pós-desastres, planejamento de emergência, mudanças climáticas e cidades, urbanização inclusiva, equidade urbana, redução de desigualdades, cidades inclusivas, integração social, inclusão de pessoas com deficiência, acessibilidade, transporte acessível, moradia digna, comunidades vulneráveis, favelas, habitação informal, combate à segregação urbana, redução da pobreza urbana, economia urbana, empregos urbanos, empreendedorismo urbano, políticas públicas urbanas, financiamento urbano, investimentos urbanos, desenvolvimento local, revitalização urbana, preservação do patrimônio, patrimônio histórico, cultura urbana, identidade cultural, cultura local, turismo sustentável, cidades resilientes, sustentabilidade ambiental, ODS 11 Cidades, ONU, United Nations, Objetivo de Desenvolvimento Sustentável 11, Sustainable Development Goal 11, SDG 11, Agenda 2030, meta 11.1, meta 11.2, meta 11.3, meta 11.4, meta 11.5, meta 11.6, meta 11.7, meta 11.a, meta 11.b, meta 11.c, tornar as cidades e os assentamentos humanos inclusivos, seguros, resilientes e sustentáveis, transporte seguro e acessível, habitação adequada e acessível, proteção do patrimônio cultural, redução de impactos ambientais urbanos, resiliência a desastres, cidades inclusivas e sustentáveis, desenvolvimento urbano sustentável, governança e planejamento urbano, qualidade de vida urbana, infraestrutura sustentável, comunidades resilientes, cidades inteligentes e inclusivas, planejamento participativo, sustentabilidade urbana",
  },
  {
    id: "ODS12",
    title: "ODS 12 - Consumo e Produção Responsáveis",
    backgroundimg: "/categorias/fundo_ods12.png",
    tagsinv:
      "ods12, ods 12, ODS-12, consumo e produção responsáveis, consumo responsável, produção responsável, sustentabilidade, desenvolvimento sustentável, economia circular, economia verde, desperdício, redução de desperdício, redução de resíduos, gestão de resíduos, reciclagem, reaproveitamento, reutilização, reutilizar, reciclar, resíduos sólidos, resíduos orgânicos, compostagem, embalagens sustentáveis, embalagens recicláveis, design sustentável, produtos sustentáveis, ecoeficiência, eficiência de recursos, recursos naturais, uso consciente de recursos, consumo consciente, consumo sustentável, pegada ecológica, pegada de carbono, emissões de gases de efeito estufa, emissão de carbono, carbono neutro, neutralidade de carbono, energias renováveis, energia limpa, água, água potável, uso racional da água, sustentabilidade hídrica, agricultura sustentável, agricultura orgânica, agricultura regenerativa, produção agrícola sustentável, produção industrial sustentável, logística sustentável, transporte sustentável, cadeias produtivas sustentáveis, responsabilidade corporativa, responsabilidade social empresarial, ESG, empresas sustentáveis, políticas públicas sustentáveis, regulamentação ambiental, educação ambiental, conscientização ambiental, hábitos de consumo, consumo inteligente, produtos ecológicos, produtos verdes, impacto ambiental, avaliação de ciclo de vida, ciclo de vida do produto, sustentabilidade em alimentos, alimentos sustentáveis, alimentos orgânicos, alimentação saudável, segurança alimentar, embalagens biodegradáveis, resíduos perigosos, gestão ambiental, auditoria ambiental, relatórios de sustentabilidade, certificações ambientais, ISO 14001, indicadores de sustentabilidade, monitoramento ambiental, tecnologias sustentáveis, inovação sustentável, economia sustentável, redução de poluição, poluição ambiental, poluição industrial, transporte limpo, mobilidade sustentável, transporte público, veículos elétricos, veículos híbridos, políticas de incentivo à sustentabilidade, metas de desenvolvimento sustentável, Agenda 2030, ONU, United Nations, Objetivo de Desenvolvimento Sustentável 12, Sustainable Development Goal 12, SDG 12, meta 12.1, meta 12.2, meta 12.3, meta 12.4, meta 12.5, meta 12.6, meta 12.7, meta 12.8, padrões de consumo e produção sustentáveis, reduzir impactos ambientais, eficiência energética, consumo consciente de energia, gestão sustentável de recursos, desenvolvimento econômico sustentável, sustentabilidade corporativa, incentivo à economia circular, práticas empresariais sustentáveis, comércio sustentável, responsabilidade ambiental, sustentabilidade no dia a dia, redução do desperdício alimentar, combate ao desperdício de alimentos, segurança e sustentabilidade alimentar, produtos recicláveis e reutilizáveis, integração de sustentabilidade em políticas públicas, educação para sustentabilidade, cidadania ambiental, ética ambiental, sustentabilidade global",
  },
  {
    id: "ODS13",
    title: "ODS 13 - Ação Contra a Mudança Global do Clima",
    backgroundimg: "/categorias/fundo_ods13.png",
    tagsinv:
      "ods13, ods 13, ODS-13, ação contra a mudança global do clima, mudanca climatica, mudanca do clima, mudança climática, mudanças climáticas, clima, aquecimento global, descarbonização, neutralidade de carbono, emissões de gases de efeito estufa, gases de efeito estufa, CO2, carbono, redução de carbono, mitigação climática, adaptação climática, resiliência climática, resiliência a desastres, desastres naturais, risco climático, vulnerabilidade climática, prevenção de desastres, planejamento climático, políticas climáticas, legislação climática, acordos climáticos, Acordo de Paris, ONU, United Nations, metas climáticas, meta 13.1, meta 13.2, meta 13.3, educação climática, conscientização climática, capacitação climática, ciência do clima, pesquisa climática, monitoramento climático, alertas de desastres, sistemas de alerta precoce, emergência climática, eventos extremos, ondas de calor, tempestades, furacões, ciclones, inundações, enchentes, secas, desertificação, erosão do solo, degradação ambiental, mudanças ambientais, adaptação urbana ao clima, cidades resilientes, infraestrutura resiliente, gestão de riscos, agricultura resiliente, produção agrícola sustentável, recursos hídricos, gestão da água, segurança alimentar, energia renovável, energia limpa, eficiência energética, transporte sustentável, mobilidade sustentável, reflorestamento, restauração de ecossistemas, preservação ambiental, biodiversidade, proteção de florestas, florestas, oceanos, mares, zonas costeiras, economia de baixo carbono, finanças verdes, investimentos sustentáveis, cooperativismo climático, inovação tecnológica, tecnologias limpas, sustentabilidade, desenvolvimento sustentável, Agenda 2030, Objetivos de Desenvolvimento Sustentável, Sustainable Development Goals, SDG 13, Objetivo de Desenvolvimento Sustentável 13, combate às mudanças climáticas, ação climática, políticas públicas climáticas, governança climática, responsabilidade ambiental, adaptação e mitigação, desenvolvimento resiliente, educação ambiental, sensibilização ambiental, engajamento comunitário, ONU Mulheres e clima, cooperação internacional, solidariedade climática, ciência e tecnologia climática, tecnologias de adaptação, sustentabilidade global, redução de riscos climáticos, sistemas de proteção climática, infraestrutura verde, cidades verdes, consumo sustentável, impactos climáticos, vulnerabilidade social e clima, justiça climática, direitos humanos e clima, clima e saúde, clima e economia, clima e agricultura, proteção dos ecossistemas, conservação ambiental, neutralidade climática, carbono neutro, pegada de carbono, compensação de carbono, projetos de carbono, créditos de carbono, adaptação aos impactos climáticos, desenvolvimento sustentável e clima, resiliência comunitária, ação climática global",
  },
  {
    id: "ODS14",
    title: "ODS 14 - Vida na Água",
    backgroundimg: "/categorias/fundo_ods14.png",
    tagsinv:
      "ods14, ods 14, ODS-14, vida na água, oceanos, mares, ecossistemas marinhos, biodiversidade marinha, conservação marinha, proteção dos oceanos, pesca sustentável, sobrepesca, aquicultura sustentável, poluição marinha, poluição dos oceanos, resíduos plásticos, microplásticos, descarte de resíduos, poluição química, derramamento de óleo, eutrofização, zonas costeiras, habitats marinhos, recifes de corais, corais, manguezais, estuários, áreas marinhas protegidas, reservas marinhas, conservação costeira, turismo sustentável, economia azul, exploração sustentável de recursos marinhos, pesca artesanal, pesca responsável, práticas pesqueiras, gestão pesqueira, quotas de pesca, monitoramento pesqueiro, rastreamento de pesca, cadeias de suprimento sustentáveis, comércio sustentável de peixes, proteção de espécies marinhas, espécies ameaçadas, tartarugas marinhas, peixes, mamíferos marinhos, golfinhos, baleias, aves marinhas, proteção de aves marinhas, biodiversidade aquática, serviços ecossistêmicos, mitigação de impactos ambientais, mudanças climáticas e oceanos, acidificação dos oceanos, aquecimento dos oceanos, aumento do nível do mar, erosão costeira, proteção costeira, restauração de habitats, reflorestamento de manguezais, educação ambiental marinha, conscientização sobre oceanos, ciência marinha, pesquisa oceânica, monitoramento ambiental, tecnologia e inovação marinha, sustentabilidade marinha, políticas públicas marinhas, legislação ambiental, marcos legais de conservação, cooperação internacional, acordos internacionais sobre oceanos, Agenda 2030, ONU, United Nations, Objetivo de Desenvolvimento Sustentável 14, Sustainable Development Goal 14, SDG 14, meta 14.1, meta 14.2, meta 14.3, meta 14.4, meta 14.5, meta 14.6, meta 14.7, meta 14.a, meta 14.b, meta 14.c, proteção e conservação da vida marinha, redução da poluição marinha, gestão sustentável de oceanos, pesca responsável e sustentável, conservação e uso sustentável da biodiversidade marinha, preservação dos ecossistemas aquáticos, desenvolvimento sustentável dos oceanos, economia azul sustentável, resiliência de habitats marinhos, proteção de espécies ameaçadas, monitoramento da vida marinha, sustentabilidade costeira e marinha, ODS 14 Vida na Água",
  },
  {
    id: "ODS15",
    title: "ODS 15 - Vida Terrestre",
    backgroundimg: "/categorias/fundo_ods15.png",
    tagsinv:
      "ods15, ods 15, ODS-15, vida terrestre, ecossistemas terrestres, biodiversidade, conservação da biodiversidade, proteção da natureza, florestas, desmatamento, reflorestamento, restauração florestal, manejo florestal sustentável, conservação de florestas, áreas protegidas, parques nacionais, reservas naturais, fauna, flora, espécies ameaçadas, espécies em extinção, animais silvestres, proteção de animais, proteção de plantas, desertificação, degradação do solo, erosão do solo, solo saudável, agroflorestas, agricultura sustentável, pastagens sustentáveis, restauração de habitats, corredores ecológicos, conectividade ecológica, ecologia, serviços ecossistêmicos, água e solo, poluição do solo, poluição ambiental, mudanças climáticas e ecossistemas, mitigação climática, adaptação climática, manejo de recursos naturais, recursos florestais, uso sustentável da terra, exploração sustentável de recursos, combate à caça ilegal, tráfico de animais, exploração ilegal de madeira, sustentabilidade ambiental, educação ambiental, conscientização ambiental, ciência e pesquisa ambiental, monitoramento ambiental, governança ambiental, políticas públicas ambientais, legislação ambiental, marco legal de conservação, cooperação internacional, convenções ambientais, Convenção sobre Diversidade Biológica, Agenda 2030, ONU, United Nations, Objetivo de Desenvolvimento Sustentável 15, Sustainable Development Goal 15, SDG 15, meta 15.1, meta 15.2, meta 15.3, meta 15.4, meta 15.5, meta 15.6, meta 15.7, meta 15.a, meta 15.b, meta 15.c, combater a desertificação, restaurar ecossistemas degradados, promover o uso sustentável da terra, conservar a biodiversidade terrestre, proteger habitats e espécies, reduzir a degradação ambiental, promover práticas sustentáveis de manejo florestal, proteger florestas nativas, conservar a fauna e flora, sustentabilidade ecológica, equilíbrio ambiental, desenvolvimento sustentável e biodiversidade, ODS 15 Vida Terrestre, proteção da vida selvagem, conservação de ecossistemas, sustentabilidade dos recursos naturais, gestão sustentável da terra",
  },
  {
    id: "ODS16",
    title: "ODS 16 - Paz, Justiça e Instituições Eficazes",
    backgroundimg: "/categorias/fundo_ods16.png",
    tagsinv:
      "ods16, ods 16, ODS-16, paz, justiça e instituições eficazes, paz, segurança, segurança pública, direitos humanos, justiça, acesso à justiça, estado de direito, instituições fortes, instituições eficazes, governança, transparência, combate à corrupção, integridade, ética, participação cidadã, engajamento cívico, democracia, direitos civis, direitos políticos, liberdade de expressão, liberdade de imprensa, liberdade de informação, liberdade religiosa, igualdade perante a lei, combate à discriminação, inclusão social, proteção de minorias, proteção de grupos vulneráveis, jovens, mulheres, pessoas com deficiência, povos indígenas, combate à violência, violência urbana, violência doméstica, violência contra mulheres, violência infantil, segurança comunitária, policiamento comunitário, prevenção da criminalidade, sistema penal, sistema judiciário, prisões, reintegração social, reabilitação, mediação de conflitos, resolução pacífica de conflitos, diplomacia, acordos de paz, cooperação internacional, tratados internacionais, combate ao tráfico de drogas, combate ao tráfico de armas, combate ao crime organizado, combate ao terrorismo, justiça restaurativa, fortalecimento institucional, gestão pública eficiente, administração pública transparente, políticas públicas, políticas anticorrupção, monitoramento e avaliação de políticas, participação democrática, conselhos comunitários, orçamento participativo, educação cívica, cidadania, capacitação institucional, capacitação de servidores públicos, legislação, marcos legais, tribunais, fiscalização, auditoria, accountability, combate à impunidade, proteção de dados, segurança digital, cybersegurança, combate à violência online, proteção de crianças online, tecnologia e governança, inovação no setor público, mecanismos de denúncia, indicadores de governança, promoção da paz, prevenção de conflitos, ODS 16 Paz, ONU, United Nations, Objetivo de Desenvolvimento Sustentável 16, Sustainable Development Goal 16, SDG 16, Agenda 2030, meta 16.1, meta 16.2, meta 16.3, meta 16.4, meta 16.5, meta 16.6, meta 16.7, meta 16.8, meta 16.9, meta 16.a, meta 16.b, meta 16.c, promover sociedades pacíficas, justas e inclusivas, acesso universal à justiça, instituições eficazes e responsáveis, redução da violência, promoção da paz e segurança, fortalecimento de instituições, governança democrática, combate à corrupção e impunidade, inclusão social e cidadania, direitos iguais para todos",
  },
  {
    id: "ODS17",
    title: "ODS 17 - Parcerias e Meios de Implementação",
    backgroundimg: "/categorias/fundo_ods17.png",
    tagsinv:
      "ods17, ods 17, ODS-17, parcerias e meios de implementação, parcerias, cooperação, cooperação internacional, alianças estratégicas, parcerias globais, desenvolvimento sustentável, financiamento para o desenvolvimento, investimento sustentável, mobilização de recursos, assistência técnica, transferência de tecnologia, inovação, capacitação, fortalecimento institucional, comércio internacional, comércio justo, comércio sustentável, acesso a mercados, integração econômica, acordos comerciais, cooperação entre países, solidariedade internacional, ajuda externa, ajuda humanitária, financiamento público, financiamento privado, investimento estrangeiro direto, parcerias público-privadas, PPP, colaboração entre setor público e privado, organizações internacionais, ONU, United Nations, bancos multilaterais, Fundo Monetário Internacional, FMI, Banco Mundial, desenvolvimento econômico, desenvolvimento social, redução da pobreza, metas da Agenda 2030, Agenda 2030, Objetivos de Desenvolvimento Sustentável, Sustainable Development Goals, SDGs, SDG 17, meta 17.1, meta 17.2, meta 17.3, meta 17.4, meta 17.5, meta 17.6, meta 17.7, meta 17.8, meta 17.9, meta 17.10, meta 17.11, meta 17.12, meta 17.13, meta 17.14, meta 17.15, meta 17.16, meta 17.17, mobilização de recursos domésticos, fortalecimento de capacidades nacionais, tecnologia e inovação sustentável, acesso a informações e dados, estatísticas confiáveis, monitoramento de indicadores, desenvolvimento de capacidades, governança eficaz, transparência, responsabilidade, combate à corrupção, troca de conhecimento, aprendizado conjunto, redes de colaboração, parcerias para pesquisa e ciência, ciência e tecnologia para desenvolvimento, parcerias para educação, saúde, energia, água, saneamento, infraestrutura, parcerias multissetoriais, engajamento da sociedade civil, engajamento do setor privado, fortalecimento do setor financeiro, crédito sustentável, investimento em infraestrutura, apoio a pequenas e médias empresas, cooperação para comércio, integração regional, desenvolvimento inclusivo, economia global sustentável, sustentabilidade global, ODS 17 Parcerias, Objetivo de Desenvolvimento Sustentável 17, Sustainable Development Goal 17, SDG 17, implementação da Agenda 2030, colaboração internacional, promoção de parcerias para o desenvolvimento sustentável, parcerias globais para os ODS, fortalecimento da cooperação multilateral, construção de alianças estratégicas",
  },
  {
    id: "ODS18",
    title: "ODS 18 - Igualdade Étnico/Racial",
    backgroundimg: "/categorias/fundo_ods18.png",
    tagsinv:
      "ods18, ods 18, ODS-18, igualdade étnico-racial, igualdade étnico racial, equidade racial, diversidade racial, inclusão racial, combate ao racismo, antirracismo, discriminação racial, preconceito racial, intolerância, justiça racial, representatividade, diversidade cultural, diversidade étnica, minorias étnicas, povos indígenas, comunidades quilombolas, afrodescendentes, negros, pardos, populações vulneráveis, inclusão social, inclusão educativa, acesso à educação, igualdade de oportunidades, equidade de oportunidades, empregabilidade racial, mercado de trabalho inclusivo, liderança negra, mulheres negras, jovens negros, igualdade de gênero e raça, diversidade no trabalho, políticas públicas antirracistas, legislação antidiscriminatória, combate à violência racial, direitos humanos, proteção de direitos, acesso à saúde, saúde para todos, inclusão econômica, empreendedorismo negro, economia inclusiva, programas de diversidade, ações afirmativas, cotas raciais, educação antirracista, conscientização social, sensibilização racial, cultura e identidade, valorização da cultura afro-brasileira, valorização de tradições indígenas, combate à exclusão, integração social, mobilidade social, ODS 18 Igualdade Étnico-Racial, ONU, United Nations, Objetivo de Desenvolvimento Sustentável 18, Agenda 2030, meta 18.1, meta 18.2, meta 18.3, promover a igualdade étnico-racial, reduzir desigualdades raciais, inclusão de minorias étnicas, empoderamento de grupos racialmente marginalizados, desenvolvimento sustentável e equidade racial, justiça social e racial",
  },
];

export default function HomePage() {
  const [visibleCards, setVisibleCards] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const totalItems = categories.length + 1;
    const timer = setInterval(() => {
      setVisibleCards((prev) => {
        if (prev < totalItems) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 150);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.body.offsetHeight;
      if (scrollPosition >= bottomPosition - 100) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.tagsinv.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col flex-grow bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 to-white pt-8">
        <Image
          src="/logo2sq.png"
          alt="Logo Prefeitura de Saquarema"
          width={2660}
          height={898}
          className="hidden md:hidden mx-auto h-20 w-auto mb-5"
        />
        <div>
          <Link href="/" target="about:blank">
            <Image
              src="/Logo_aquitemods.png"
              alt="Logo Aqui Tem ODS"
              width={2660}
              height={898}
              className="md:block mx-auto h-14 sm:h-20 w-auto mb-5 milecem:h-24"
            />
          </Link>
        </div>
        <ImageCarousel />

        <section className="flex-grow container mx-auto px-4 py-8 md:py-8 relative z-10 -mt-[1px] md:-mt-[1px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Banco de{" "}
              <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
                Projetos
              </span>{" "}
              do Rio de Janeiro
            </h2>
            <p className="text-xl font-bold text-gray-700 md:text-gray-600 max-w-2xl mx-auto">
              O banco de dados digital dos projetos que fazem a economia do
              estado do Rio de Janeiro acontecer. Conheça o{" "}
              <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
                AquiTemODS!
              </span>{" "}
            </p>
            <div className="max-w-md mx-auto mt-6">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Pesquisar por categoria..."
                  className="
                w-full pl-12 pr-4 py-3
                rounded-2xl border border-gray-200 bg-white shadow-sm
                focus:outline-none focus:ring-2 focus:ring-[#D7386E]/70 focus:border-transparent
                transition-all duration-300 placeholder-gray-400 text-sm
                hover:shadow-md
              "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={
                  index < visibleCards
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 50, scale: 0.9 }
                }
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <Link href={`/categoria/${category.id}`}>
                  <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] ">
                    <div className="relative w-full rounded-md overflow-hidden h-40 flex justify-center items-center">
                      {category.backgroundimg && (
                        <Image
                          src={category.backgroundimg}
                          alt={category.title}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div
                        className={`absolute inset-0 bg-black backdrop-blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300 `}
                      />
                      <div className="relative p-6">
                        <h3 className=" font-poppins text-2xl font-bold text-white mb-auto group-hover: text-shadow-lg">
                          {category.title}
                        </h3>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#3C6AB2] to-transparent group-hover:via-[#D7386E] transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {showScrollTop && (
          <motion.button
            type="button"
            aria-label="Voltar ao topo"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="
            fixed bottom-6 left-6 z-50 
            bg-blue-600 hover:bg-green-500
            text-white font-semibold font-sans 
            px-5 py-3 rounded-full 
            shadow-lg shadow-blue-600/50 
            flex items-center gap-2
            transition-colors duration-300
            md:hidden
            select-none
            cursor-pointer
          "
          >
            <ArrowUp size={20} />
          </motion.button>
        )}

        <div className="mt-auto pt-10 pb-24">
          <div className="text-center text-gray-600 mb-3">
            <h3>Gostaria que seu Projeto aparecesse na Banco?</h3>
          </div>
          <ButtonWrapper />
          <FaleConoscoButton />
        </div>
      </div>
    </>
  );
}
