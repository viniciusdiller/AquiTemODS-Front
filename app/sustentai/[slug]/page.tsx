"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2, Loader2, Tag } from "lucide-react";
import { useParams } from "next/navigation";
import { getAcaoSustentaiById, getAcaoConteudo } from "@/lib/api";

export default function PaginaAcaoInterna() {
  const params = useParams() as { slug?: string };
  const slug = params?.slug || "";

  const [acao, setAcao] = useState<any | null>(null);
  const [blocos, setBlocos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const getFullImageUrl = (path: string) => {
    if (!path) return "/enigmas_do_futuro.png";
    // aceitamos data: (base64), blob: e http(s) como URLs válidas
    if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return path;
    return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  useEffect(() => {
    let mounted = true;

    const carregar = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!slug) throw new Error("ID da ação não informado");

        const dados = await getAcaoSustentaiById(slug);

        if (!dados) throw new Error("Ação não encontrada");

        // Normaliza shape: pode vir como { conteudo: [...] } ou { blocos: [...] } ou { body: string }
        let localBlocos: any[] = [];

        if (Array.isArray(dados.conteudo)) {
          localBlocos = dados.conteudo;
        } else if (Array.isArray(dados.blocos)) {
          localBlocos = dados.blocos;
        } else if (typeof dados.conteudo === "string" && dados.conteudo.trim()) {
          try {
            const parsed = JSON.parse(dados.conteudo);
            if (Array.isArray(parsed)) localBlocos = parsed;
          } catch (e) {
            localBlocos = [
              { id: "1", type: "text", content: dados.conteudo, bgColor: "bg-white", isBold: false },
            ];
          }
        } else if (Array.isArray(dados.body)) {
          localBlocos = dados.body;
        } else if (typeof dados.body === "string" && dados.body.trim()) {
          try {
            const parsed = JSON.parse(dados.body);
            if (Array.isArray(parsed)) localBlocos = parsed;
          } catch (e) {
            localBlocos = [
              { id: "1", type: "text", content: dados.body, bgColor: "bg-white", isBold: false },
            ];
          }
        }

        // Fallbacks adicionais
        if (localBlocos.length === 0) {
          // Se não encontramos blocos no recurso principal, tenta buscar o conteúdo específico (rota /conteudo)
          try {
            const conteudoFallback: any = await getAcaoConteudo(slug).catch(() => null);
            if (conteudoFallback) {
              if (Array.isArray(conteudoFallback.blocos)) {
                localBlocos = conteudoFallback.blocos;
              } else if (Array.isArray(conteudoFallback.conteudo)) {
                localBlocos = conteudoFallback.conteudo;
              } else if (Array.isArray(conteudoFallback)) {
                localBlocos = conteudoFallback;
              } else if (typeof conteudoFallback === 'string' && conteudoFallback.trim()) {
                try {
                  const parsed = JSON.parse(conteudoFallback);
                  if (Array.isArray(parsed)) localBlocos = parsed;
                } catch (e) {
                  // não é JSON — criar um bloco de texto simples
                  localBlocos = [{ id: "1", type: "text", content: conteudoFallback, bgColor: "bg-white", isBold: false }];
                }
              }
            }
          } catch (e) {
            // ignora falhas no fallback — mantemos localBlocos vazios e aplicamos os fallbacks abaixo
            // eslint-disable-next-line no-console
            console.debug('getAcaoConteudo fallback falhou:', e);
          }
        }

        if (localBlocos.length === 0 && (dados.conteudoHtml || dados.conteudoText)) {
          const text = dados.conteudoHtml || dados.conteudoText;
          localBlocos = [{ id: "1", type: "text", content: text, bgColor: "bg-white", isBold: false }];
        }

        const normalized = {
          titulo: dados.titulo || dados.title || "",
          data: dados.data || dados.createdAt || "",
          autor: dados.autor || dados.author || "",
          tag: dados.tag || dados.categoria || "",
          corDestaque: dados.corDestaque,
          blocos: localBlocos.map((b: any) => {
            if (b && b.type === "image") {
              const raw = b.content || b.url || b.imagemUrl || b.imagem || "";
              return { ...b, content: getFullImageUrl(raw) };
            }
            return b;
          }),
        };

        if (mounted) {
          setAcao(normalized);
          setBlocos(normalized.blocos || []);
        }
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

  const handleCompartilhar = () => {
    if (navigator.share) {
      navigator.share({ title: acao?.titulo || "Prefeitura de Saquarema", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center text-gray-500">
          <Loader2 className="w-10 h-10 text-[#D7386E] animate-spin mx-auto" />
          <div className="mt-3">Carregando conteúdo do artigo...</div>
        </div>
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
        {/* HEADER DO ARTIGO */}
        <div className="p-8 md:p-12 lg:p-16 border-b border-gray-100 bg-white relative">
          <Link href="/sustentai" className="inline-flex items-center gap-2 text-[#D7386E] font-semibold mb-8 hover:bg-pink-50 px-4 py-2 rounded-full transition-colors -ml-4">
            <ArrowLeft className="w-5 h-5" /> Voltar para SustentAí
          </Link>

          {acao.tag && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-gray-50 border border-gray-100 ${acao.corDestaque || "text-[#D7386E]"}`}>
              <Tag className="w-3 h-3" /> {acao.tag}
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">{acao.titulo}</h1>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6 mt-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <Calendar className="w-4 h-4 text-[#3C6AB2]" /> {acao.data || "Publicado recentemente"}
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                Por <span className="text-gray-800 font-bold">{acao.autor || "Equipe SustentAí"}</span>
              </div>
            </div>

            <button onClick={handleCompartilhar} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors" title="Compartilhar">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="p-8 md:p-12 lg:p-16 space-y-8 md:space-y-10 bg-gray-50/30">
          {blocos.length > 0 ? (
            blocos.map((bloco: any, idx: number) => {
              if (bloco.type === "image") {
                return (
                  <div key={bloco.id || idx} className="w-full rounded-2xl overflow-hidden shadow-md my-10 group">
                    <img src={bloco.content} alt={acao.titulo} className="w-full h-auto max-h-[500px] object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                );
              }

              if (bloco.type === "text") {
                const isColoredBox = bloco.bgColor && bloco.bgColor !== "bg-white";
                return (
                  <div key={bloco.id || idx} className={`${isColoredBox ? `p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 ${bloco.bgColor}` : "py-2"}`}>
                    <p className={`text-lg md:text-xl leading-relaxed whitespace-pre-wrap ${bloco.isBold ? "font-bold text-gray-900" : "text-gray-700"} ${isColoredBox && !bloco.isBold ? "text-gray-800" : ""}`}>
                      {bloco.content}
                    </p>
                  </div>
                );
              }

              return null;
            })
          ) : (
            <div className="text-center text-gray-400 py-10 font-medium">O conteúdo completo deste artigo está sendo preparado e será disponibilizado em breve.</div>
          )}
        </div>
      </div>
    </div>
  );
}
