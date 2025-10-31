// components/ui/FormattedDescription.tsx
import React from "react";

interface FormattedDescriptionProps {
  text: string | null | undefined;
}

const FormattedDescription: React.FC<FormattedDescriptionProps> = ({
  text,
}) => {
  if (!text) {
    return null;
  }

  const paragraphs = text.split("\n").filter((p) => p.trim().length > 0);

  if (paragraphs.length === 0) {
    return null;
  }

  return (
    /* 1. Removemos o 'space-y-1'. Agora não há margem EXTRA. */
    <div className="text-gray-600 leading-relaxed">
      {paragraphs.map((paragraph, index) => (
        /* 2. Mantemos 'm-0' para resetar a margem do navegador. */
        <p key={index} className="break-words m-0">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default FormattedDescription;
