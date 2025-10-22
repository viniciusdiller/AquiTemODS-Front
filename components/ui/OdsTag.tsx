import React from "react";
import { getOdsColor } from "@/lib/odsColors";

interface OdsTagProps {
  odsNumber: string | number;
  className?: string;
}

// --- FUNÇÃO AUXILIAR PARA CALCULAR LUMINÂNCIA (MAIS PRECISA) ---
function getLuminance(hexColor: string): number {
  // Remove o '#' e converte para RGB
  const rgb = parseInt(hexColor.substring(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  // Fórmula padrão de luminância (percepção humana)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance;
}
// --- FIM DA FUNÇÃO AUXILIAR ---

const OdsTag: React.FC<OdsTagProps> = ({ odsNumber, className = "" }) => {
  const bgColor = getOdsColor(odsNumber);

  // --- ALTERAÇÃO NA LÓGICA DE COR DO TEXTO ---
  // Calcula a luminância da cor de fundo
  const luminance = getLuminance(bgColor);
  // Define a cor do texto: se a luminância for > 0.5 (mais clara), usa preto, senão branco
  const textColor = luminance > 0.5 ? "#000000" : "#FFFFFF";
  // --- FIM DA ALTERAÇÃO ---

  return (
    <span
      style={{
        backgroundColor: bgColor,
        color: textColor, // Usa a nova cor calculada
        padding: "5px 12px",
        borderRadius: "20px",
        fontSize: "0.875rem",
        fontWeight: 600,
        display: "inline-block",
        lineHeight: 1.2,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        whiteSpace: "nowrap",
      }}
      className={` ${className}`}
    >
      ODS - {odsNumber} {/* Texto já corrigido */}
    </span>
  );
};

export default OdsTag;
