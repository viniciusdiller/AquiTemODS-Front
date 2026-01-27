"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FaleConoscoButton from "@/components/FaleConoscoButton";
import { Loader2, Newspaper, MessageCircle } from "lucide-react";

interface SustentAiCard {
  id: number;
  titulo: string;
  linkDestino: string;
  imagemUrl: string;
}

export default function SustentAiPage() {
  const [cards, setCards] = useState<SustentAiCard[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/sustentai`)
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados SustentAí:", err);
        setLoading(false);
      });
  }, [API_URL]);

  // Função auxiliar para garantir URL completa da imagem
  const getFullImageUrl = (path: string) => {
    if (!path) return "/placeholder-image.png"; // Fallback
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D7386E] to-[#3C6AB2] py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        {/* Cabeçalho */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            {/* Ícone adicionado conforme pedido */}
            <Newspaper className="text-[#D7386E] w-8 h-8 sm:w-10 sm:h-10" />

            <h1 className="text-4xl font-extrabold inline-block pb-2 bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-no-repeat [background-position:0_100%] [background-size:100%_4px]">
              <span className="bg-gradient-to-r from-[#D7386E] to-[#3C6AB2] bg-clip-text text-transparent">
                SustentAí
              </span>
            </h1>
          </div>

          <p className="text-gray-700 leading-relaxed text-lg mb-8">
            Conheça a <strong>SustentAí</strong>, nossa newsletter dedicada a
            dar visibilidade a projetos e ações que transformam Saquarema
            através dos Objetivos de Desenvolvimento Sustentável. Aqui, fazemos
            a curadoria de iniciativas que inspiram, informam e apoiam a{" "}
            <strong>Agenda 2030</strong>. Clique nos cards para acessar as
            edições.
          </p>

          {/* Área do WhatsApp Estilizada */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="bg-green-50 p-3 rounded-full text-[#25D366]">
              <MessageCircle size={28} />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-gray-800 font-bold text-lg mb-1">
                Comunidade Oficial
              </h3>
              <p className="text-gray-500 text-sm">
                Receba novidades e edições em primeira mão no nosso canal do
                WhatsApp.
              </p>
            </div>

            <a
              href="https://whatsapp.com/channel/0029Vb61WtrAu3aPEBflxV0L"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-3 px-8 rounded-full shadow-sm transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              Entrar no Canal
            </a>
          </div>
        </section>

        {/* Grid de Cards Dinâmicos - Layout Mantido (1 coluna mobile) */}
        <section className="mt-8 border-t pt-8">
          {loading ? (
            <div className="text-center text-gray-500 py-10">
              <Loader2 className="animate-spin mx-auto" />
              Carregando iniciativas...
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Nenhuma iniciativa cadastrada no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {cards.map((card) => (
                <Link
                  key={card.id}
                  href={card.linkDestino}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block text-center h-full flex flex-col"
                >
                  <div className="overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300 relative aspect-[4/3]">
                    <Image
                      src={getFullImageUrl(card.imagemUrl)}
                      alt={card.titulo}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="mt-3 text-md font-semibold text-gray-800 group-hover:text-[#D7386E] transition-colors duration-300">
                    {card.titulo}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
      <FaleConoscoButton />
    </div>
  );
}
