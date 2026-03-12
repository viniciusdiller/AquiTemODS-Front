"use client";

import React, { useState, useEffect } from "react";
import { formatPrefeituraSlug } from "@/constants/prefeituraImages";

interface PrefeituraLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  nomePrefeitura: string;
  tipo: "p" | "g";
}

const EXTENSOES = ["webp", "png", "jpg", "jpeg"];

export const PrefeituraLogo: React.FC<PrefeituraLogoProps> = ({
  nomePrefeitura,
  tipo,
  className,
  alt,
  ...rest
}) => {
  const slug = formatPrefeituraSlug(nomePrefeitura);

  const buildAttempts = () => {
    const attempts: string[] = [];

    EXTENSOES.forEach((ext) => {
      attempts.push(`/LogoPrefeituras/${slug}--${tipo}.${ext}`);
    });

    EXTENSOES.forEach((ext) => {
      attempts.push(`/LogoPrefeituras/${slug}.${ext}`);
    });

    attempts.push("/logo_aquitemods.png");

    return attempts;
  };

  const [attempts, setAttempts] = useState<string[]>(buildAttempts());
  const [currentAttemptIndex, setCurrentAttemptIndex] = useState(0);

  useEffect(() => {
    setAttempts(buildAttempts());
    setCurrentAttemptIndex(0);
  }, [nomePrefeitura, tipo]);

  const handleError = () => {
    if (currentAttemptIndex < attempts.length - 1) {
      setCurrentAttemptIndex((prev) => prev + 1);
    }
  };

  return (
    <img
      src={attempts[currentAttemptIndex]}
      alt={alt || `Logo ${nomePrefeitura}`}
      onError={handleError}
      className={`object-contain ${className || ""}`}
      {...rest}
    />
  );
};
