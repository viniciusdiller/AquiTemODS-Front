"use client";
import React from "react";
import { Type, Trash2, X, ArrowUp, ArrowDown } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const presetColors = [
  "",
  "#ab5c76",
  "#000000",
  "#ffffff",
  "#ff0000",
  "#ffa500",
  "#ffff00",
  "#008000",
  "#0000ff",
  "#800080",
  "#cccccc",
  "#888888",
  "#D7386E",
  "#3C6AB2",
  "#fdf2f8",
  "#eff6ff",
];

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: presetColors }, { background: presetColors }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
};

const hexToRgba = (hex: string, alpha: number) => {
  if (!hex || hex === "transparent") return "transparent";
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getBaseHex = (color: string) => {
  if (!color || color === "transparent") return "#ffffff";
  if (color.startsWith("rgba")) {
    const parts = color.match(/\d+/g);
    if (parts && parts.length >= 3) {
      const r = parseInt(parts[0], 10).toString(16).padStart(2, "0");
      const g = parseInt(parts[1], 10).toString(16).padStart(2, "0");
      const b = parseInt(parts[2], 10).toString(16).padStart(2, "0");
      return `#${r}${g}${b}`;
    }
    return "#ffffff";
  }
  return color;
};

const getAlphaFromColor = (color: string) => {
  if (!color || color === "transparent") return 0;
  if (color.startsWith("rgba")) {
    const parts = color.split(",");
    return parseFloat(parts[parts.length - 1]);
  }
  return 1;
};

export default function TextBlock({
  block,
  updateBlock,
  removeBlock,
  moveUp,
  moveDown,
  isFirst,
  isLast,
}: any) {
  const getBgStyle = (bg: string) => {
    if (!bg || bg === "transparent") return "transparent";
    const oldMap: Record<string, string> = {
      "bg-white": "#ffffff",
      "bg-pink-50": "#fdf2f8",
      "bg-blue-50": "#eff6ff",
      "bg-gray-100": "#f3f4f6",
    };
    return oldMap[bg] || bg;
  };

  const bgColor = getBgStyle(block.bgColor);
  const pickerColor = getBaseHex(bgColor);
  const currentAlpha = getAlphaFromColor(bgColor);

  const isPresetDropdown = [
    "bg-white",
    "bg-pink-50",
    "bg-blue-50",
    "bg-gray-100",
    "transparent",
  ].includes(block.bgColor);

  const selectValue = isPresetDropdown ? block.bgColor : "custom";

  return (
    <div
      className="p-5 rounded-2xl shadow-sm border border-gray-200 relative group transition-all"
      style={{ backgroundColor: bgColor }}
    >
      <div className="absolute top-4 right-4 flex gap-3 opacity-100 md:opacity-50 md:group-hover:opacity-100 transition-opacity z-10 items-center flex-wrap justify-end">
        {/* Controle de Fundo com Transparência */}
        <div className="flex items-center gap-2 bg-white/90 p-1.5 px-3 rounded-lg shadow-sm border border-gray-200 backdrop-blur-sm">
          <label className="text-xs font-semibold text-gray-700">Fundo:</label>

          <select
            value={selectValue}
            onChange={(e) => {
              if (e.target.value !== "custom") {
                updateBlock(block.id, "bgColor", e.target.value);
              }
            }}
            className="text-xs border border-gray-200 rounded cursor-pointer px-1 py-1 bg-gray-50 text-gray-700 focus:outline-none hover:border-gray-300"
          >
            <option value="bg-white">Branco</option>
            <option value="bg-pink-50">Rosa Claro</option>
            <option value="bg-blue-50">Azul Claro</option>
            <option value="bg-gray-100">Cinza</option>
            <option value="transparent">Transparente</option>
            {!isPresetDropdown && (
              <option value="custom">Personalizado...</option>
            )}
          </select>

          <div className="w-px h-4 bg-gray-300 mx-1"></div>

          {/* Seletor de Cor + Slider de Opacidade */}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={pickerColor}
              onChange={(e) =>
                updateBlock(
                  block.id,
                  "bgColor",
                  hexToRgba(e.target.value, currentAlpha || 1),
                )
              }
              className="w-5 h-5 p-0 border-0 rounded cursor-pointer overflow-hidden"
              title="Escolha a cor base"
            />

            <div
              className="flex flex-col items-center gap-0.5"
              title="Opacidade"
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={currentAlpha}
                onChange={(e) =>
                  updateBlock(
                    block.id,
                    "bgColor",
                    hexToRgba(pickerColor, parseFloat(e.target.value)),
                  )
                }
                className="w-12 h-1.5 accent-pink-500 cursor-pointer"
              />
              <span className="text-[8px] font-bold text-gray-500">
                {Math.round(currentAlpha * 100)}%
              </span>
            </div>
          </div>

          <button
            onClick={() => updateBlock(block.id, "bgColor", "transparent")}
            className={`p-1 rounded transition-colors ${block.bgColor === "transparent" ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500"}`}
            title="Remover cor de fundo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1 bg-white/90 p-1.5 rounded-lg shadow-sm border border-gray-200 backdrop-blur-sm">
          <button
            onClick={moveUp}
            disabled={isFirst}
            className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-gray-100"
            title="Mover para cima"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={moveDown}
            disabled={isLast}
            className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-gray-100"
            title="Mover para baixo"
          >
            <ArrowDown className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-gray-300 mx-1"></div>

          <button
            onClick={() => removeBlock(block.id)}
            className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50"
            title="Excluir Bloco"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-600 uppercase tracking-widest mt-8 md:mt-0">
        <Type className="w-4 h-4" /> Bloco de Texto
      </div>

      <div className="bg-white/80 rounded-xl overflow-hidden border border-gray-300">
        <ReactQuill
          theme="snow"
          value={block.content}
          onChange={(content) => updateBlock(block.id, "content", content)}
          modules={modules}
          className="min-h-[150px] bg-transparent"
          placeholder="Escreva seu texto aqui..."
        />
      </div>
    </div>
  );
}
