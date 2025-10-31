// components/ReviewComment.tsx
import React, { useState } from "react";
import Image from "next/image";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import FormattedDescription from "@/components/FormattedDescription";
// Assumindo que StarRating está sendo exportado de 'page.tsx'
import { StarRating } from "@/app/categoria/[slug]/[nome]/page";

// Tipos
type User = {
  usuarioId: number;
  nomeCompleto: string;
};

type Review = {
  avaliacoesId: number;
  comentario: string;
  nota: number | null;
  usuario: User;
  respostas?: Review[]; // O '?' causa o erro, pois pode ser undefined
};

type ReviewCommentProps = {
  review: Review;
  onReplyClick: (parentId: number) => void;
  onDeleteClick: (reviewId: number) => void;
  currentUser: { usuarioId: number } | null;
  allowReply: boolean;
};

export const ReviewComment = ({
  review,
  onReplyClick,
  onDeleteClick,
  currentUser,
  allowReply,
}: ReviewCommentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // --- CORREÇÃO 1 ---
  // Use optional chaining (?.), e 'nullish coalescing' (??) para
  // calcular 'replyCount' e 'hasReplies' de forma segura.
  const replyCount = review.respostas?.length ?? 0;
  const hasReplies = replyCount > 0;
  // --- FIM DA CORREÇÃO 1 ---

  return (
    <div className="flex gap-4 py-2 items-start">
      {/* Avatar */}
      <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 my-top ml-4">
        <Image
          src="/avatars/default-avatar.png"
          alt={`Avatar de ${review.usuario.nomeCompleto}`}
          width={48}
          height={48}
          className="rounded-full w-full h-full object-cover"
        />
      </div>

      {/* Conteúdo do Comentário */}
      <div className="flex-1">
        {/* ... (Nome de usuário, botão de excluir, estrelas, texto) ... */}
        <div className="flex items-center gap-2">
          <p
            className={` text-gray-800 font-semibold ${
              allowReply ? " text-base" : "text-sm text-gray-500"
            }`}
          >
            {review.usuario.nomeCompleto}
            {currentUser &&
              currentUser.usuarioId === review.usuario.usuarioId && (
                <button
                  onClick={() => onDeleteClick(review.avaliacoesId)}
                  className="ml-3 text-sm text-red-500 hover:text-red-700"
                  aria-label="Excluir seu comentário"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
          </p>
        </div>

        {review.nota && review.nota > 0 && (
          <div className="flex items-center gap-1 my-1">
            <StarRating rating={review.nota} />
          </div>
        )}

        <p className="text-gray-600 break-words">
          <FormattedDescription text={review.comentario} />
        </p>

        {/* --- SEÇÃO DE BOTÕES --- */}
        <div className="flex items-center gap-4 mt-2">
          {/* Botão de Responder */}
          {allowReply && (
            <button
              onClick={() => onReplyClick(review.avaliacoesId)}
              className="text-sm font-medium text-[#3C6AB2] hover:text-[#D7386E] flex items-center gap-1"
            >
              Responder
            </button>
          )}

          {/* Botão de Ver/Esconder Respostas */}
          {hasReplies && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-medium text-[#D7386E] hover:[#3C6AB2] flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" /> Esconder Respostas
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" /> Ver{" "}
                  {/* --- CORREÇÃO 2 --- */}
                  {/* Use a variável segura 'replyCount' que calculamos acima */}
                  {replyCount} {replyCount === 1 ? "Resposta" : "Respostas"}
                  {/* --- FIM DA CORREÇÃO 2 --- */}
                </>
              )}
            </button>
          )}
        </div>
        {/* --- FIM DA SEÇÃO DE BOTÕES --- */}

        {/* --- RENDERIZAÇÃO CONDICIONAL DAS RESPOSTAS --- */}
        {isExpanded && hasReplies && (
          <div className="mt-2 pt-4 border-l-2 border-gray-200 space-y-4">
            {/* --- CORREÇÃO 3 --- */}
            {/* Use optional chaining (?.) aqui. O map só será executado se 'respostas' existir. */}
            {review.respostas?.map((reply) => (
              <ReviewComment
                key={reply.avaliacoesId}
                review={reply}
                onReplyClick={onReplyClick}
                onDeleteClick={onDeleteClick}
                currentUser={currentUser}
                allowReply={false}
              />
            ))}
            {/* --- FIM DA CORREÇÃO 3 --- */}
          </div>
        )}
        {/* --- FIM DA RENDERIZAÇÃO CONDICIONAL --- */}
      </div>
    </div>
  );
};
