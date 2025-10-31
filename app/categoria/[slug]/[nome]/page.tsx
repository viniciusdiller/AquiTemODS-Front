"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Globe,
  Instagram,
  Trash2,
  SearchX,
  CalendarDays,
} from "lucide-react";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { TiltImage } from "@/components/ui/TiltImage";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import {
  getProjetoByNome,
  deleteReview,
  formatarDataParaMesAno,
} from "@/lib/api";
import AvaliacaoModalButton from "@/components/Pop-up Coments";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { motion, useInView } from "framer-motion";
import TagsAnimate from "@/components/ui/tagsanimate";
import ImageGrid from "@/components/ProjectImages";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import FormattedDescription from "@/components/FormattedDescription";
import OdsTag from "@/components/ui/OdsTag";

const CustomStarIcon = ({
  fillPercentage = "100%",
}: {
  fillPercentage?: string;
}) => {
  const uniqueId = `grad-${Math.random()}`;
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-yellow-400"
    >
      <defs>
        <linearGradient id={uniqueId}>
          <stop offset="0%" stopColor="currentColor" />
          <stop offset={fillPercentage} stopColor="currentColor" />
          <stop
            offset={fillPercentage}
            stopColor="transparent"
            stopOpacity="1"
          />
        </linearGradient>
      </defs>
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill={`url(#${uniqueId})`}
        stroke="currentColor"
      />
    </svg>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        let fillPercentage = "0%";
        if (starValue <= rating) {
          fillPercentage = "100%";
        } else if (starValue - 1 < rating && starValue > rating) {
          fillPercentage = `${(rating - index) * 100}%`;
        }
        return <CustomStarIcon key={index} fillPercentage={fillPercentage} />;
      })}
    </div>
  );
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const normalizeImagePath = (filePath: string) => {
  if (!filePath) return "";
  let normalized = filePath.replace(/\\/g, "/");
  const uploadsIndex = normalized.indexOf("uploads/");
  if (uploadsIndex !== -1) {
    normalized = normalized.substring(uploadsIndex);
  }
  if (normalized.startsWith("/")) {
    normalized = normalized.substring(1);
  }
  return normalized;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={itemVariants}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

// --- Componente de Conteúdo da Página (Lógica Principal) ---

function ProjetoPageContent() {
  const params = useParams();
  const { user } = useAuth();

  const categorySlug = params.slug as string;
  const nomeDoProjeto = decodeURIComponent(params.nome as string);

  const [projeto, setProjeto] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  const [descricaoExpandida, setDescricaoExpandida] = useState(false);

  const sobreProjetoRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  const fetchProjetoData = async () => {
    if (!nomeDoProjeto) {
      setIsLoading(false);
      return;
    }

    try {
      const detailsData = await getProjetoByNome(nomeDoProjeto);

      if (detailsData && detailsData.projetoId) {
        setProjeto(detailsData);
        setReviews(detailsData.avaliacoes || []);
      } else {
        setProjeto(null);
        setReviews([]);
      }
    } catch (error) {
      console.error("Falha ao buscar dados do Projeto:", error);
      setProjeto(null);
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      setIsLoading(true);
      await fetchProjetoData();
      setIsLoading(false);
    };
    initialFetch();
  }, [nomeDoProjeto]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
          <Loader2 className="mx-auto h-16 w-16 text-blue-600 animate-spin mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            A carregar dados do Projeto...
          </h1>
          <p className="text-gray-600">
            A preparar os detalhes do Projeto. Por favor, aguarde um momento.
          </p>
        </div>
      </div>
    );
  }

  if (!projeto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <SearchX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Projeto Não Encontrado
          </h2>
          <p className="text-gray-600 mb-6 max-w-sm">
            O projeto que você está procurando não existe, foi removido ou o
            link está incorreto.
          </p>
          <Button
            asChild
            className="rounded-full px-6 hover:cursor-pointer hover:text-white bg-gradient-to-br from-[#D7386E] to-[#3C6AB2] text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg active:scale-95 transition-all"
          >
            <Link href="/">Voltar para a Página Inicial</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleDeleteClick = (avaliacaoId: number) => {
    if (!user?.token) {
      toast.error("Você precisa estar logado para excluir um comentário.");
      return;
    }
    setReviewToDelete(avaliacaoId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete || !user?.token) {
      setIsDeleteDialogOpen(false);
      return;
    }
    try {
      await deleteReview(reviewToDelete, user.token);
      toast.success("Comentário excluído com sucesso!");
      setReviews(reviews.filter((r) => r.avaliacoesId !== reviewToDelete));
    } catch (error: any) {
      toast.error(error.message || "Não foi possível excluir o comentário.");
    } finally {
      setIsDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  // Adaptação das variáveis para o layout
  const rating = projeto.media || 0;
  const portfolioImages = (projeto.projetoImg || []).map(
    (image: any, index: number) => ({
      id: `${projeto.projetoId}-${index}`,
      img: `${API_URL}/${normalizeImagePath(image.url)}`,
    })
  );

  const odsTags = (projeto.odsRelacionadas || "")
    .split(",")
    .map((tag: string) => tag.trim())
    .filter(Boolean);

  const REVIEWS_PER_PAGE = 4;
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D7386E] to-[#3C6AB2]">
      <motion.header
        ref={headerRef}
        className="sticky top-0 z-20"
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/80">
          <div className="w-full px-4 sm:px-6 py-3 grid grid-cols-[auto_1fr_auto] items-center">
            <Link
              href={`/categoria/${categorySlug}`}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#D7386E] transition-colors p-2 -ml-3 sm:ml-8 md:ml-12 lg:ml-36 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Voltar</span>
            </Link>
            <h1 className="absolute left-1/2 -translate-x-1/2 text-md font-semibold text-gray-800 truncate ml-3 break-words max-w-[60%]">
              {projeto.nomeProjeto}
            </h1>
          </div>
        </div>
      </motion.header>
      <motion.main
        className="w-full p-4 md:p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        <div className="space-y-8">
          <motion.section
            className="bg-white p-6 rounded-3xl shadow-lg md:mx-auto md:max-w-[85%]"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2 flex flex-col">
                <div className="mb-6 text-center md:text-left">
                  <div className="flex flex-col miletrezentos:flex-row">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 border-l-4 border-[#D7386E] pl-3">
                      {projeto.nomeProjeto}
                    </h2>
                    <span className="flex items-center text-sm text-gray-500 border-gray-300 md:ml-4">
                      | {projeto.prefeitura}
                    </span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <StarRating rating={rating} />
                    <span className="text-gray-700 font-semibold">
                      {rating.toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({reviews.length} avaliações)
                    </span>
                    {projeto.createdAt && (
                      <div className="hidden sm:flex items-center text-sm text-gray-500 border-l-2 border-gray-300 pl-4">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        <span>
                          Membro desde {/* <<< 2. USE A NOVA FUNÇÃO AQUI */}
                          {formatarDataParaMesAno(projeto.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                  {projeto.createdAt && (
                    <div className="flex items-center text-sm text-gray-500 border-l-2 border-gray-300 pl-4 mt-4 sm:hidden">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      <span>
                        Membro desde {/* <<< 2. USE A NOVA FUNÇÃO AQUI */}
                        {formatarDataParaMesAno(projeto.createdAt)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed md:pl-2">
                  <FormattedDescription text={projeto.descricaoDiferencial} />
                </p>
                <div className="hidden quinhentos:flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-6">
                  <div className="flex items-center gap-6">
                    {projeto.instagram && (
                      <a
                        href={projeto.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors hover:cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center">
                          <Instagram size={18} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-medium">Instagram</span>
                      </a>
                    )}
                    {projeto.website && (
                      <a
                        href={projeto.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <Globe size={18} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-medium">
                          {projeto.prefeitura}
                        </span>
                      </a>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {projeto.ods &&
                      (() => {
                        const odsString = String(projeto.ods);
                        const match = odsString.match(/\d+/);
                        const odsNumber = match ? match[0] : null;
                        return odsNumber ? (
                          <OdsTag odsNumber={odsNumber} />
                        ) : null;
                      })()}
                    <TagsAnimate tags={odsTags} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center md:col-span-1">
                <div className="max-w-48 mas-h-48 md:max-w-56 md:max-h-56 bg-white rounded-2xl flex items-center justify-center p-4">
                  <TiltImage
                    src={
                      (projeto.logoUrl &&
                        `${API_URL}/${normalizeImagePath(projeto.logoUrl)}`) ||
                      "/logo_aquitemods.png"
                    }
                    alt={`Logo de ${projeto.nomeProjeto}`}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="quinhentos:hidden flex flex-col items-center justify-center gap-6 mt-6 col-span-full">
                <div className="flex items-center gap-6">
                  {projeto.instagram && (
                    <a
                      href={projeto.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center">
                        <Instagram size={18} strokeWidth={2} />
                      </div>
                      <span className="text-sm font-medium">Instagram</span>
                    </a>
                  )}
                  {projeto.website && (
                    <a
                      href={projeto.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                        <Globe size={18} strokeWidth={2} />
                      </div>
                      <span className="text-sm font-medium">
                        {projeto.prefeitura}
                      </span>
                    </a>
                  )}
                </div>

                <div>
                  {projeto.ods &&
                    (() => {
                      const odsString = String(projeto.ods);
                      const match = odsString.match(/\d+/);
                      const odsNumber = match ? match[0] : null;
                      return odsNumber ? (
                        <OdsTag odsNumber={odsNumber} />
                      ) : null;
                    })()}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <TagsAnimate tags={odsTags} />
                </div>
              </div>
            </div>
          </motion.section>

          {projeto.descricao && ( // Mostra apenas se a descrição existir
            <motion.section
              ref={sobreProjetoRef}
              className="bg-white p-6 rounded-3xl shadow-lg md:mx-auto md:max-w-[85%] space-y-4 mb-8" // Adiciona margem inferior
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-bold text-gray-900 border-l-4 border-[#D7386E] pl-3">
                Sobre o Projeto
              </h3>
              <div>
                <div
                  className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
                    descricaoExpandida ? "max-h-none" : "max-h-24"
                  }`}
                >
                  <p className="text-gray-700 leading-relaxed md:pl-2 break-words">
                    {" "}
                    {/* Mudei break-all para break-words */}
                    <FormattedDescription text={projeto.descricao} />
                  </p>
                  {/* Efeito de fade para texto recolhido */}
                  {!descricaoExpandida && (
                    <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setDescricaoExpandida(!descricaoExpandida);

                    if (descricaoExpandida) {
                      const headerHeight = headerRef.current?.offsetHeight || 0;

                      const sectionTop =
                        sobreProjetoRef.current?.offsetTop || 0;

                      const scrollToPosition = sectionTop - headerHeight - 20;

                      window.scrollTo({
                        top: scrollToPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="text-md font-bold  text-[#D7386E] hover:text-[#3C6AB2]  mt-2 md:pl-2 "
                  aria-expanded={descricaoExpandida}
                >
                  {descricaoExpandida ? "Ler menos" : "Ler mais"}
                </button>
              </div>

              {/* Seção do Link (mostrada apenas se o link existir) */}
              {projeto.linkProjeto && (
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm mt-4">
                  {" "}
                  {/* Adicionado mt-4 */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-link flex-shrink-0 text-[#3C6AB2]"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <a
                    href={projeto.linkProjeto}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-[#D7386E] hover:underline font-medium break-all"
                  >
                    {projeto.linkProjeto}
                  </a>
                </div>
              )}
            </motion.section>
          )}

          {Array.isArray(portfolioImages) &&
            portfolioImages.some((item) => item && item.img) && (
              <AnimatedSection>
                <div className="bg-white p-6 rounded-3xl shadow-lg md:mx-auto md:max-w-[85%]">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 border-l-4 border-[#D7386E] pl-3">
                      Portfólio
                    </h3>
                    <p className="text-sm text-gray-600">
                      Clique em uma imagem para visualizar em tamanho completo
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl shadow-md border border-gray-200">
                    <ImageGrid items={portfolioImages} />
                  </div>
                </div>
              </AnimatedSection>
            )}

          <AnimatedSection>
            <div className="bg-white p-6 rounded-3xl shadow-md md:mx-auto md:max-w-[85%]">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-[#D7386E] pl-3">
                Avaliações
              </h3>
              <AvaliacaoModalButton
                projetoId={projeto.projetoId.toString()}
                onReviewSubmit={fetchProjetoData}
              />
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  <>
                    <div key={currentPage} className="space-y-4">
                      {paginatedReviews
                        .slice()
                        .reverse()
                        .map((review) => (
                          <div
                            key={review.avaliacoesId}
                            className="flex gap-4 py-2 items-start border-b"
                          >
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 my-auto ml-4">
                              <Image
                                src="/avatars/default-avatar.png"
                                alt={`Avatar de ${review.usuario.nomeCompleto}`}
                                width={48}
                                height={48}
                                className="rounded-full w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-800 ">
                                  {review.usuario.nomeCompleto}
                                  {user &&
                                    user.usuarioId ===
                                      review.usuario.usuarioId && (
                                      <button
                                        onClick={() =>
                                          handleDeleteClick(review.avaliacoesId)
                                        }
                                        className="ml-3 text-sm text-red-500 hover:text-red-700"
                                        aria-label="Excluir seu comentário"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 my-1">
                                <StarRating rating={review.nota} />
                              </div>
                              <p className="text-gray-600 break-words">
                                <FormattedDescription
                                  text={review.comentario}
                                />
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="pt-4 flex justify-end rounded-lg">
                        <Pagination>
                          <PaginationContent>
                            {[...Array(totalPages)].map((_, i) => (
                              <PaginationItem key={i}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(i + 1);
                                  }}
                                  isActive={currentPage === i + 1}
                                  className={
                                    currentPage === i + 1
                                      ? "bg-[#D7386E] text-white"
                                      : ""
                                  }
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Ainda não há avaliações para este projeto.
                  </p>
                )}
              </div>
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá
                      permanentemente o seu comentário.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setReviewToDelete(null)}
                      className="rounded-full"
                    >
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleConfirmDelete}
                      asChild
                      className="rounded-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      <button>Sim, excluir</button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </AnimatedSection>
        </div>
      </motion.main>
    </div>
  );
}

// --- Componente Wrapper com Suspense ---
export default function ProjetoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p>Carregando...</p>
        </div>
      }
    >
      <ProjetoPageContent />
    </Suspense>
  );
}
