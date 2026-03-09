// app/sustentai/[slug]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Share2,
  Loader2,
  Tag,
  ChevronRight,
} from "lucide-react";
import { useParams } from "next/navigation";
import { getAcaoSustentaiById, getAcaoConteudo } from "@/lib/api";
import DOMPurify from "dompurify";
import { toast } from "@/components/ui/use-toast";

export default function PaginaAcaoInterna() {
  const params = useParams() as { slug?: string };
  const slug = params?.slug || "";

  const [acao, setAcao] = useState<any | null>(null);
  const [blocos, setBlocos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const getFullImageUrl = (path: string) => {
    if (!path) return "/enigmas_do_futuro.png";
    if (
      path.startsWith("http") ||
      path.startsWith("blob:") ||
      path.startsWith("data:")
    )
      return path;
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

        let localBlocos: any[] = [];

        // Extração dos blocos...
        if (Array.isArray(dados.conteudo)) {
          localBlocos = dados.conteudo;
        } else if (Array.isArray(dados.blocos)) {
          localBlocos = dados.blocos;
        } else if (
          typeof dados.conteudo === "string" &&
          dados.conteudo.trim()
        ) {
          try {
            const parsed = JSON.parse(dados.conteudo);
            if (Array.isArray(parsed)) localBlocos = parsed;
          } catch (e) {
            localBlocos = [
              {
                id: "1",
                type: "text",
                content: dados.conteudo,
                bgColor: "#ffffff",
                isBold: false,
              },
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
              {
                id: "1",
                type: "text",
                content: dados.body,
                bgColor: "#ffffff",
                isBold: false,
              },
            ];
          }
        }

        // Fallback da API separada...
        if (localBlocos.length === 0) {
          try {
            const conteudoFallback: any = await getAcaoConteudo(slug).catch(
              () => null,
            );
            if (conteudoFallback) {
              if (Array.isArray(conteudoFallback.blocos))
                localBlocos = conteudoFallback.blocos;
              else if (Array.isArray(conteudoFallback.conteudo))
                localBlocos = conteudoFallback.conteudo;
              else if (Array.isArray(conteudoFallback))
                localBlocos = conteudoFallback;
              else if (
                typeof conteudoFallback === "string" &&
                conteudoFallback.trim()
              ) {
                try {
                  const parsed = JSON.parse(conteudoFallback);
                  if (Array.isArray(parsed)) localBlocos = parsed;
                } catch (e) {
                  localBlocos = [
                    {
                      id: "1",
                      type: "text",
                      content: conteudoFallback,
                      bgColor: "#ffffff",
                      isBold: false,
                    },
                  ];
                }
              }
            }
          } catch (e) {
            console.debug("getAcaoConteudo fallback falhou:", e);
          }
        }

        if (
          localBlocos.length === 0 &&
          (dados.conteudoHtml || dados.conteudoText)
        ) {
          const text = dados.conteudoHtml || dados.conteudoText;
          localBlocos = [
            {
              id: "1",
              type: "text",
              content: text,
              bgColor: "#ffffff",
              isBold: false,
            },
          ];
        }

        // Normalização dos Blocos (AGORA SUPORTA ARRAY DE IMAGENS)
        const normalized = {
          titulo: dados.titulo || dados.title || "",
          data: dados.data || dados.createdAt || "",
          autor: dados.autor || dados.author || "",
          tag: dados.tag || dados.categoria || "",
          corDestaque: dados.corDestaque,
          blocos: localBlocos.map((b: any) => {
            if (b && b.type === "image") {
              const rawSingle =
                b.content || b.url || b.imagemUrl || b.imagem || "";

              // Se tiver array de images (novo padrão do admin)
              if (b.images && Array.isArray(b.images) && b.images.length > 0) {
                b.images = b.images.map((img: any) => ({
                  ...img,
                  url: getFullImageUrl(img.url),
                }));
              } else {
                // Retrocompatibilidade para ações antigas
                b.images = rawSingle
                  ? [{ url: getFullImageUrl(rawSingle), link: b.link || "" }]
                  : [];
              }
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
    if (typeof window === "undefined" || typeof navigator === "undefined")
      return;
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({ title: acao?.titulo || "Prefeitura de Saquarema", url })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          toast({
            title: "Link copiado!",
            description: "O link foi copiado para a área de transferência.",
          });
        })
        .catch(() => {
          toast({
            title: "Erro",
            description: "Erro ao copiar o link.",
            variant: "destructive",
          });
        });
    } else {
      alert(`Copie este link para compartilhar:\n\n${url}`);
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
          <p className="text-red-600 font-bold mb-4">
            {error || "Artigo não encontrado"}
          </p>
          <Link href="/sustentai" className="text-[#D7386E] font-semibold">
            Voltar para SustentAí
          </Link>
        </div>
      </div>
    );
  }

  const getBgColor = (bg: string) => {
    if (!bg) return "#ffffff";
    const oldMap: Record<string, string> = {
      "bg-white": "#ffffff",
      "bg-pink-50": "#fdf2f8",
      "bg-blue-50": "#eff6ff",
      "bg-gray-100": "#f3f4f6",
    };
    return oldMap[bg] || bg;
  };

  const formatarData = (dataString: string) => {
    if (!dataString) return "Publicado recentemente";
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) return dataString;
      const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(data);
      return dataFormatada.replace(
        / de ([a-z])/g,
        (m, l) => ` de ${l.toUpperCase()}`,
      );
    } catch {
      return dataString;
    }
  };

  // Subcomponente de renderização da mídia (Agora trata se é Carrossel ou Imagem Única)
  const MediaViewer = ({
    img,
    idx,
    isCarousel = false,
  }: {
    img: any;
    idx: number;
    isCarousel?: boolean;
  }) => {
    if (!img.url) return null;
    const isPdf =
      img.url.toLowerCase().includes("application/pdf") ||
      img.url.split("?")[0].endsWith(".pdf");

    const content = isPdf ? (
      <iframe
        src={img.url}
        className={`w-full border border-gray-100 ${isCarousel ? "h-full absolute inset-0" : "h-[400px] md:h-[600px] rounded-2xl shadow-md"}`}
        title={`PDF ${idx + 1}`}
      />
    ) : (
      <img
        src={img.url}
        alt={`Mídia ${idx + 1}`}
        className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${
          isCarousel
            ? "h-full absolute inset-0" // Preenche toda a caixa do carrossel rigorosamente
            : "h-auto max-h-[600px] rounded-2xl shadow-md" // Comportamento normal para imagem única
        }`}
      />
    );

    if (img.link) {
      return (
        <a
          href={img.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full ${isCarousel ? "h-full" : ""}`}
        >
          {content}
        </a>
      );
    }
    return content;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-lg overflow-hidden">
        {/* HEADER DO ARTIGO */}
        <div className="pb-0 p-8 bg-white relative">
          <Link
            href="/sustentai"
            className="inline-flex items-center gap-2 text-[#D7386E] font-semibold mb-8 hover:bg-pink-50 px-4 py-2 rounded-full transition-colors -ml-4"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar para SustentAí
          </Link>

          {acao.tag && (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-gray-50 border border-gray-100 ${acao.corDestaque || "text-[#D7386E]"}`}
            >
              <Tag className="w-3 h-3" /> {acao.tag}
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {acao.titulo}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-gray-100 py-6 mt-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <Calendar className="w-4 h-4 text-[#3C6AB2]" />{" "}
                <span className="capitalize-first">
                  {formatarData(acao.data)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                Por{" "}
                <span className="text-gray-800 font-bold">
                  {acao.autor || "Equipe SustentAí"}
                </span>
              </div>
            </div>
            <button
              onClick={handleCompartilhar}
              className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
              title="Compartilhar"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="p-8 md:p-8 md:space-y-10 lg:p-10 space-y-8 bg-gray-50/30">
          {blocos.length > 0 ? (
            blocos.map((bloco: any, idx: number) => {
              if (bloco.type === "image") {
                const images = bloco.images || [];
                if (images.length === 0) return null;

                // Múltiplas imagens = CARROSSEL
                if (images.length > 1) {
                  return (
                    <div
                      key={bloco.id || idx}
                      className="w-full my-10 relative"
                    >
                      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 custom-scrollbar items-center">
                        {images.map((img: any, i: number) => (
                          <div
                            key={i}
                            // Largura de 85% a 70% permite ver a borda da próxima foto (ajuda a saber que dá pra deslizar)
                            // O aspect-[4/3] (celular) e aspect-video (PC) forçam uma altura limite perfeita.
                            className="w-[85%] sm:w-[75%] md:w-[70%] flex-shrink-0 snap-center relative group aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden shadow-sm bg-gray-100 border border-gray-200"
                          >
                            <MediaViewer img={img} idx={i} isCarousel={true} />

                            <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md z-10 pointer-events-none">
                              {i + 1} / {images.length}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mt-0 font-medium opacity-80">
                        Deslize para ver mais{" "}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                }

                // IMAGEM ÚNICA (Sem alteração do antigo)
                return (
                  <div
                    key={bloco.id || idx}
                    className="w-full my-10 group relative flex justify-center"
                  >
                    <MediaViewer img={images[0]} idx={0} isCarousel={false} />
                  </div>
                );
              }

              // BLOCO DE TEXTO
              if (bloco.type === "text") {
                const hexColor = getBgColor(bloco.bgColor);
                const isColoredBox =
                  hexColor !== "#ffffff" && hexColor !== "bg-white";
                const sanitizedHtml = DOMPurify.sanitize(bloco.content || "");

                return (
                  <div
                    key={bloco.id || idx}
                    className={`${isColoredBox ? "p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100" : "py-2"}`}
                    style={isColoredBox ? { backgroundColor: hexColor } : {}}
                  >
                    <div
                      className={`prose prose-lg max-w-none text-gray-700 leading-relaxed ${bloco.isBold ? "font-bold text-gray-900" : ""}`}
                      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                    />
                  </div>
                );
              }

              return null;
            })
          ) : (
            <div className="text-center text-gray-400 py-10 font-medium">
              O conteúdo completo deste artigo está sendo preparado e será
              disponibilizado em breve.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
