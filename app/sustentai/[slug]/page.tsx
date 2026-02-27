"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { getAcaoSustentaiById } from "@/lib/api";

export default function PaginaAcaoInterna() {
  const params = useParams() as { slug?: string };
  const slug = params?.slug || "";

  const [acao, setAcao] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const getFullImageUrl = (path: string) => {
    if (!path) return "/enigmas_do_futuro.png";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  useEffect(() => {
    let mounted = true;
    const carregar = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!slug) throw new Error("ID da ação não informado");
        const dados = await getAcaoSustentaiById(slug);

        // Normaliza shape: pode vir como { conteudo: [...] } ou { blocos: [...] } ou { body: string }
        let blocos: any[] = [];
        if (!dados) {
          throw new Error("Ação não encontrada");
        }

        if (Array.isArray(dados.conteudo)) {
          blocos = dados.conteudo;
        } else if (Array.isArray(dados.blocos)) {
          blocos = dados.blocos;
        } else if (typeof dados.conteudo === "string" && dados.conteudo.trim()) {
          try {
            const parsed = JSON.parse(dados.conteudo);
            if (Array.isArray(parsed)) blocos = parsed;
          } catch (e) {
            // fallback: transformar o string em um único bloco de texto
            blocos = [
              { id: "1", type: "text", content: dados.conteudo, bgColor: "bg-white", isBold: false },
            ];
          }
        } else if (Array.isArray(dados.body)) {
          blocos = dados.body;
        } else if (typeof dados.body === "string" && dados.body.trim()) {
          try {
            const parsed = JSON.parse(dados.body);
            if (Array.isArray(parsed)) blocos = parsed;
          } catch (e) {
            blocos = [
              { id: "1", type: "text", content: dados.body, bgColor: "bg-white", isBold: false },
            ];
          }
        }

        const normalized = {
          titulo: dados.titulo || dados.title || "",
          data: dados.data || dados.createdAt || "",
          autor: dados.autor || dados.author || "",
          blocos: blocos.map((b: any, i: number) => {
            if (b.type === "image") {
              return { ...b, content: getFullImageUrl(b.content || b.url || b.imagemUrl || b.imagem || "") };
            }
            return b;
          }),
        };

        if (mounted) setAcao(normalized);
      } catch (err: any) {
        console.error("Erro ao carregar ação: ", err);
        if (mounted) setError(err.message || "Erro ao carregar conteúdo");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    carregar();
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center text-gray-500">Carregando conteúdo do artigo...</div>
      </div>
    );
  }

  if (error || !acao) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="max-w-2xl text-center">
          <p className="text-red-600 font-bold mb-4">{error || "Artigo não encontrado"}</p>
          <Link href="/sustentai" className="text-[#D7386E] font-semibold">Voltar para SustentAí</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden">
        {/* ========================================== */}
        {/* HEADER DO ARTIGO                           */}
        {/* ========================================== */}
        <div className="p-8 md:p-12 lg:p-16 border-b border-gray-100 bg-white relative">
          {/* Botão Voltar */}
          <Link
            href="/sustentai"
            className="inline-flex items-center gap-2 text-[#D7386E] font-semibold mb-8 hover:bg-pink-50 px-4 py-2 rounded-full transition-colors -ml-4"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar para SustentAí
          </Link>

          {/* Título */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {acao.titulo}
          </h1>

          {/* Metadados (Data e Autor) */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6 mt-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <Calendar className="w-4 h-4 text-[#3C6AB2]" /> {acao.data}
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                Por{" "}
                <span className="text-gray-800 font-bold">{acao.autor}</span>
              </div>
            </div>

            {/* Botão de Compartilhar Simbólico */}
            <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================== */}
        {/* RENDERIZADOR DE BLOCOS (O CONTEÚDO)        */}
        {/* ========================================== */}
        <div className="p-8 md:p-12 lg:p-16 space-y-8 md:space-y-10 bg-gray-50/30">
          {acao.blocos.map((bloco: any, idx: number) => {
            // 1. Renderiza Bloco de Imagem
            if (bloco.type === "image") {
              return (
                <div key={bloco.id || idx} className="w-full rounded-2xl overflow-hidden shadow-md my-10 group">
                  <img
                    src={bloco.content}
                    alt={acao.titulo}
                    className="w-full h-auto max-h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              );
            }

            // 2. Renderiza Bloco de Texto
            if (bloco.type === "text") {
              // Se o fundo for branco, tira o padding excessivo para parecer texto corrido de blog.
              // Se tiver cor, coloca padding para virar uma "Caixa de Destaque".
              const isColoredBox = bloco.bgColor && bloco.bgColor !== "bg-white";

              return (
                <div key={bloco.id || idx} className={`${isColoredBox ? `p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 ${bloco.bgColor}` : "py-2"}`}>
                  <p className={`text-lg md:text-xl leading-relaxed whitespace-pre-wrap ${bloco.isBold ? "font-bold text-gray-900" : "text-gray-700"} ${isColoredBox && !bloco.isBold ? "text-gray-800" : ""}`}>
                    {bloco.content}
                  </p>
                </div>
              );
            }

            return null; // Caso surja algum tipo de bloco não reconhecido
          })}
        </div>
      </div>
    </div>
  );
}
