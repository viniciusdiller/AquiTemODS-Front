import React from "react";
import { HeartHandshake, ArrowRight } from "lucide-react";

// ==========================================
// LISTA DE DADOS FICTÍCIOS (Mock Data)
// Fácil de substituir pelos dados reais depois
// ==========================================
const acoesSustentai = [
  {
    id: 1,
    titulo: "Sala do Empreendedor",
    descricao:
      "Serviços para abrir, regularizar ou expandir sua empresa com apoio técnico. Inclui formalização de MEI e orientação sobre crédito.",
    imagemUrl:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Saiba mais sobre a Sala",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#D7386E]",
    corFundo: "bg-pink-50/30",
    corBorda: "border-pink-100",
  },
  {
    id: 2,
    titulo: "Emprega Saquá",
    descricao:
      "Buscando emprego ou procurando funcionários? Acesse nosso portal e tenha acesso a oportunidades e talentos de toda a nossa região.",
    // Usando uma foto com proporção diferente para mostrar que o card se adapta à imagem
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Acessar portal de vagas",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#3C6AB2]",
    corFundo: "bg-blue-50/30",
    corBorda: "border-blue-100",
  },
  {
    id: 3,
    titulo: "Sala do Empreendedor",
    descricao:
      "Serviços para abrir, regularizar ou expandir sua empresa com apoio técnico. Inclui formalização de MEI e orientação sobre crédito.",
    imagemUrl:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=500&auto=format&fit=crop&q=60", // Foto fictícia
    linkTexto: "Saiba mais sobre a Sala",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#D7386E]",
    corFundo: "bg-pink-50/30",
    corBorda: "border-pink-100",
  },
  {
    id: 4,
    titulo: "Emprega Saquá",
    descricao:
      "Buscando emprego ou procurando funcionários? Acesse nosso portal e tenha acesso a oportunidades e talentos de toda a nossa região.",
    // Usando uma foto com proporção diferente para mostrar que o card se adapta à imagem
    imagemUrl: "/Cursos/vivi.png",
    linkTexto: "Acessar portal de vagas",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#3C6AB2]",
    corFundo: "bg-blue-50/30",
    corBorda: "border-blue-100",
  },
  {
    id: 5,
    titulo: "Sala do Empreendedor",
    descricao:
      "Serviços para abrir, regularizar ou expandir sua empresa com apoio técnico. Inclui formalização de MEI e orientação sobre crédito.",
    imagemUrl:
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=500&auto=format&fit=crop&q=60", // Foto fictícia
    linkTexto: "Saiba mais sobre a Sala",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#D7386E]",
    corFundo: "bg-pink-50/30",
    corBorda: "border-pink-100",
  },
  {
    id: 6,
    titulo: "Emprega Saquá",
    descricao:
      "Buscando emprego ou procurando funcionários? Acesse nosso portal e tenha acesso a oportunidades e talentos de toda a nossa região.",
    // Usando uma foto com proporção diferente para mostrar que o card se adapta à imagem
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
    linkTexto: "Acessar portal de vagas",
    linkDestino: "https://www.flamengo.com.br/",
    corDestaque: "text-[#3C6AB2]",
    corFundo: "bg-blue-50/30",
    corBorda: "border-blue-100",
  },
];

const genteQueConstroi = [
  {
    id: 1,
    nome: "Carolina Guilhon",
    cargo: "Dona da casa do Empreendedor",
    descricao: "Chefe da Laila.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    nome: "Telma Cavalcante",
    cargo: "Diretora de Cultura",
    descricao:
      "Referência na valorização do artesanato, idealizadora da ExpoArte Saquarema, transformando cultura em pertencimento.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    nome: "Leticia Majosene",
    cargo: "Diretora de Projetos Estratégicos",
    descricao:
      "Idealizadora do Emprega Saquá. Seu compromisso com uma política pública centrada no cidadão garantiu o sucesso do projeto.",
    imagemUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&auto=format&fit=crop&q=60",
  },
];
// ==========================
// MOCK DATA
// ==========================
export default function NewsletterDestaque() {
  return (
    <section className="mb-16 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
      {/* Cabeçalho da Newsletter */}
      <div className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] p-8 text-white text-center">
        <p className="uppercase tracking-widest text-sm font-semibold mb-2 opacity-90">
          Prefeitura de Saquarema
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">SustentAí</h2>
        <p className="text-lg opacity-90">Segunda Edição - Abril de 2025</p>
      </div>

      <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-8">
              Veja as últimas ações do SustentAí!
            </h3>

            {/* O 'items-start' impede que os cards estiquem para ter a mesma altura, respeitando o tamanho da foto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {acoesSustentai.map((acao, index) => (
                <div
                  key={acao.id}
                  // A mágica do desalinhamento acontece aqui: se for o segundo item (índice 1), ele ganha uma margem no topo.
                  className={`border rounded-2xl overflow-hidden flex flex-col ${acao.corFundo} ${acao.corBorda} transition-all duration-300 hover:shadow-md ${
                    index % 2 !== 0 ? "md:mt-12" : ""
                  }`}
                >
                  {/* Imagem no topo - Altura livre (h-auto) para ditar o tamanho da box */}
                  <img
                    src={acao.imagemUrl}
                    alt={acao.titulo}
                    className="w-full h-auto object-cover border-b border-white/50"
                  />

                  {/* Conteúdo Textual */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="font-bold text-gray-800 text-lg mb-3">
                      {acao.titulo}
                    </h4>
                    <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                      {acao.descricao}
                    </p>

                    {/* Frase que é um href na parte de baixo */}
                    <a
                      href={acao.linkDestino}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 font-bold hover:underline transition-all w-fit ${acao.corDestaque}`}
                    >
                      {acao.linkTexto} <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* BARRA LATERAL (Direita) GERADA PELO MAP      */}
        {/* ========================================== */}
        <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-100 rounded-2xl p-6 lg:p-8 h-fit sticky top-8">
          <div className="flex items-center gap-2 mb-6">
            <HeartHandshake className="text-[#D7386E] w-6 h-6" />
            <h3 className="text-xl font-bold text-gray-800">
              Gente que Constrói
            </h3>
          </div>

          <div className="space-y-6">
            {genteQueConstroi.map((pessoa, index) => (
              <div
                key={pessoa.id}
                className={
                  index !== genteQueConstroi.length - 1
                    ? "pb-8 border-b border-gray-200"
                    : ""
                }
              >
                {/* Container da imagem com overflow-hidden para o efeito de hover funcionar nas bordas */}
                <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                  <img
                    src={pessoa.imagemUrl}
                    alt={pessoa.nome}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h4 className="font-bold text-[#3C6AB2] text-lg">
                  {pessoa.nome}
                </h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  <strong className="text-gray-700">{pessoa.cargo}.</strong>{" "}
                  <br />
                  {pessoa.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
