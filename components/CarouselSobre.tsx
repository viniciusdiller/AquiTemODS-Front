"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 1. ATUALIZEI OS SLIDES PARA COMEÇAR COM SUA LOGO
const slides = [
  { src: "/Logo_aquitemods.png", alt: "Logo Aqui Tem ODS" },
  { src: "/Logo-Lab-ISA.png", alt: "Logo Lab ISA" },
  {
    src: "/logoSMGS.png",
    alt: "Logo da Secretaria Municipal de Governança e Sustentabilidade",
  },
  // Adicione mais slides aqui conforme necessário
];

// 2. RENOMEEI O COMPONENTE
export default function CarouselSobre() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => resetTimeout();
  }, [current]);

  const prevSlide = () => {
    resetTimeout();
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const nextSlide = () => {
    resetTimeout();
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  return (
    <div className="relative group w-full overflow-hidden rounded-2xl shadow-md mt-10 aspect-video">
      <div className="w-full h-full flex transition-transform ease-out duration-500">
        {slides.map((slide, i) => (
          <Image
            key={i}
            src={slide.src}
            alt={slide.alt}
            fill
            style={{ objectFit: "contain" }}
            className={`transition-opacity duration-700 ease-in-out ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            priority={i === 0}
          />
        ))}
      </div>
      {/* Gradiente (opcional, pode remover se não gostar) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-100/10 via-transparent to-transparent" />
      {/* Setas de Navegação */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/60 backdrop-blur-sm rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} className="text-gray-800" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/60 backdrop-blur-sm rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white"
        aria-label="Next slide"
      >
        <ChevronRight size={24} className="text-gray-800" />
      </button>
      {/* Pontos Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              resetTimeout();
              setCurrent(i);
            }}
            className={`w-2.5 h-2.5 rounded-full ring-1 ring-white/50 transition-all duration-300 ${
              current === i ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
