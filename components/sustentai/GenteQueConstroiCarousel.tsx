// components/sustentai/GenteQueConstroiCarousel.tsx
"use client";
import React from "react";
import Link from "next/link";
import { HeartHandshake, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

interface Pessoa {
  id: string | number;
  nome: string;
  cargo: string;
  descricao: string;
  imagemUrl: string;
}

interface GenteQueConstroiCarouselProps {
  pessoas: Pessoa[];
}

export default function GenteQueConstroiCarousel({
  pessoas,
}: GenteQueConstroiCarouselProps) {
  if (!pessoas || pessoas.length === 0) return null;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-100 rounded-3xl pt-8 md:p-8 lg:p-12 overflow-hidden relative group/wrapper">
      <div className="flex flex-col items-center justify-center text-center mb-8 px-6">
        <div className="bg-pink-100 p-3 rounded-full mb-4">
          <HeartHandshake className="text-[#D7386E] w-8 h-8" />
        </div>
        <h3 className="text-3xl font-bold text-gray-800">Gente que Constrói</h3>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
          Conheça as pessoas por trás das iniciativas que fazem a diferença em
          nossa comunidade todos os dias.
        </p>
      </div>

      <div className="w-full">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          loop={pessoas.length > 3}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="w-full !pb-4 cursor-grab active:cursor-grabbing"
        >
          {pessoas.map((pessoa) => (
            <SwiperSlide key={pessoa.id} className="h-auto">
              <div className="flex flex-col h-full bg-white md:rounded-2xl p-6 md:p-4 md:shadow-sm border-t py-2 md:border border-gray-100 hover:bg-gray-50 md:hover:bg-white md:hover:shadow-md transition-all group">
                {/* Imagem Larga e no Topo */}
                <div className="relative w-full aspect-video md:aspect-[4/3] mb-5 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-100 md:border-none md:shadow-none">
                  <img
                    src={pessoa.imagemUrl}
                    alt={pessoa.nome}
                    draggable={false}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Textos Embaixo da Imagem */}
                <div className="flex flex-col flex-grow text-left">
                  <h4 className="font-bold text-[#3C6AB2] text-xl sm:text-2xl md:text-xl">
                    {pessoa.nome}
                  </h4>
                  <p className="text-sm sm:text-base md:text-sm text-[#D7386E] font-bold mt-1 mb-3">
                    {pessoa.cargo}
                  </p>
                  <p className="text-sm sm:text-base md:text-sm text-gray-600 leading-relaxed">
                    {pessoa.descricao}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mt-8 flex justify-center w-full">
        <Link
          href="/sustentai/gente-que-constroi"
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white border-2 border-pink-100 text-[#D7386E] font-bold text-lg hover:bg-[#D7386E] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
        >
          Ver histórico completo
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
