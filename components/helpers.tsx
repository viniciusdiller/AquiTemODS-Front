import React from "react";
import { toast } from "sonner";
import { campoLabels, MAX_QUILL_LENGTH } from "@/constants/cadastroProjeto";

export const stripEmojis = (value: string) => {
  if (!value) return "";
  return value.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    "",
  );
};

export const getQuillTextLength = (value: string) => {
  if (typeof window === "undefined" || !value || value === "<p><br></p>")
    return 0;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = value;
  return (tempDiv.textContent || tempDiv.innerText || "").trim().length;
};

export const maskId = (value: string) => value.replace(/\D/g, "");

export const customUploadAction = async (options: any) => {
  const { onSuccess, onError, file } = options;
  setTimeout(() => {
    try {
      onSuccess(file);
    } catch (err) {
      onError(new Error("Erro no upload simulado"));
    }
  }, 500);
};

export const onFinishFailed = (errorInfo: any) => {
  if (!errorInfo.errorFields || errorInfo.errorFields.length === 0) return;
  const labelsComErro = errorInfo.errorFields
    .map((field: any) => campoLabels[field.name[0]] || field.name[0])
    .filter(
      (value: string, index: number, self: string[]) =>
        self.indexOf(value) === index,
    );

  if (labelsComErro.length > 0) {
    const plural = labelsComErro.length > 1;
    toast.error(
      `Por favor, preencha o(s) campo(s) obrigatório(s): ${labelsComErro.join(", ")}.`,
    );
  } else {
    toast.error("Por favor, verifique os campos obrigatórios.");
  }
};

export const validateQuill = (required: boolean) => (_: any, value: string) => {
  const textContentLength = getQuillTextLength(value);
  if (required && textContentLength === 0) {
    return Promise.reject(new Error("Por favor, descreva seu projeto!"));
  }
  if (textContentLength > MAX_QUILL_LENGTH) {
    return Promise.reject(
      new Error(
        `A descrição não pode ter mais de ${MAX_QUILL_LENGTH} caracteres (atualmente com ${textContentLength}).`,
      ),
    );
  }
  return Promise.resolve();
};

export const commonTitle = (title: string) => (
  <h2 className="relative text-2xl font-semibold text-gray-800 mb-6 pl-4 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-t from-[#D7386E] to-[#3C6AB2]">
    {title}
  </h2>
);

export const translateQuillToolbar = () => {
  const toolbar = document.querySelector(".ql-toolbar");
  if (!toolbar) return false;

  const boldButton = toolbar.querySelector(".ql-bold") as HTMLElement;
  if (boldButton && boldButton.title === "Negrito") return true;

  const translations: { [key: string]: string } = {
    ".ql-bold": "Negrito",
    ".ql-italic": "Itálico",
    ".ql-underline": "Sublinhado",
    ".ql-strike": "Riscado",
    '.ql-list[value="ordered"]': "Lista ordenada",
    '.ql-list[value="bullet"]': "Lista com marcadores",
    ".ql-link": "Inserir link",
    ".ql-clean": "Remover formatação",
    ".ql-header .ql-picker-label": "Normal",
  };

  Object.entries(translations).forEach(([selector, title]) => {
    const el = toolbar.querySelector(selector) as HTMLElement;
    if (el) {
      if (el.tagName === "BUTTON") el.title = title;
      else if (el.classList.contains("ql-picker-label"))
        el.setAttribute("data-label", title);
    }
  });

  toolbar.querySelectorAll(".ql-header .ql-picker-item").forEach((item) => {
    const value = item.getAttribute("data-value");
    if (value === "1") item.setAttribute("data-label", "Título 1");
    else if (value === "2") item.setAttribute("data-label", "Título 2");
    else if (value === "3") item.setAttribute("data-label", "Título 3");
    else item.setAttribute("data-label", "Normal");
  });

  return (
    (toolbar.querySelector(".ql-bold") as HTMLElement)?.title === "Negrito"
  );
};
