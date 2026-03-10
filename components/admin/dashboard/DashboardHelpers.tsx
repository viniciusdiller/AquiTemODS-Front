import React from "react";
import { Typography, Image, Button, Row, Col } from "antd";
import FormattedDescription from "@/components/FormattedDescription";

const { Text } = Typography;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getFullImageUrl = (path: string): string => {
  if (!path) return "";
  const normalizedPath = path.replace(/\\/g, "/");
  const cleanPath = normalizedPath.startsWith("/")
    ? normalizedPath.substring(1)
    : normalizedPath;
  return `${API_URL}/${cleanPath}`;
};

export const renderValue = (key: string, value: any): React.ReactNode => {
  if (value === null || value === undefined || value === "") {
    return <Text type="secondary">Não informado</Text>;
  }

  if (key === "linkProjeto" || key === "website") {
    const Clicavel = String(value);
    let href = Clicavel;
    if (!/^https?:\/\//i.test(href)) {
      href = `https://${href}`;
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#d6386d", textDecoration: "underline" }}
      >
        {Clicavel}
      </a>
    );
  }

  if (key === "instagram") {
    const val = String(value).trim();
    let href = val;

    if (val.includes("instagram.com") || /^https?:\/\//i.test(val)) {
      if (!/^https?:\/\//i.test(href)) {
        href = `https://${href}`;
      }
    } else {
      const handle = val.replace(/^@/, "");
      href = `https://www.instagram.com/${handle}`;
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#d6386d", textDecoration: "underline" }}
      >
        {val}
      </a>
    );
  }

  if (key === "descricao") {
    return (
      <div
        className="prose prose-sm max-w-none prose-p:my-1"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  }

  if (key === "descricaoDiferencial") {
    return <FormattedDescription text={value} />;
  }

  if (
    key === "motivo" ||
    key === "motivoExclusao" ||
    key === "outrasAlteracoes"
  ) {
    return (
      <Typography.Paragraph style={{ whiteSpace: "pre-wrap", margin: 0 }}>
        {String(value)}
      </Typography.Paragraph>
    );
  }

  if (key === "createdAt" || key === "updatedAt") {
    try {
      const date = new Date(value);
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
    } catch (error) {
      return String(value);
    }
  }

  if (key === "venceuPspe") {
    const boolValue = String(value).toLowerCase() === "true" || value === true;
    return boolValue ? "Sim" : "Não";
  }

  if (
    (key === "projetoImg" || key === "imagens") &&
    Array.isArray(value) &&
    value.length > 0
  ) {
    const imagesUrls = value
      .map((item) => (typeof item === "string" ? item : item.url))
      .map(getFullImageUrl)
      .filter(Boolean);

    return (
      <Image.PreviewGroup>
        <Row gutter={[8, 8]}>
          {imagesUrls.map((imageUrl, index) => (
            <Col key={index}>
              <Image src={imageUrl} alt={`Imagem ${index + 1}`} width={80} />
            </Col>
          ))}
        </Row>
      </Image.PreviewGroup>
    );
  }

  if (
    (key === "logoUrl" || key === "logo") &&
    typeof value === "string" &&
    value
  ) {
    return <Image src={getFullImageUrl(value)} alt="Logo" width={150} />;
  }

  if (
    (key === "oficioUrl" || key === "oficio") &&
    typeof value === "string" &&
    value
  ) {
    const url = getFullImageUrl(value);
    const isPdf = url.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      return (
        <Button type="primary" href={url} target="_blank" size="small">
          Visualizar PDF
        </Button>
      );
    }

    return <Image src={url} alt="Ofício" width={150} />;
  }

  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  if (key === "odsRelacionadas" && Array.isArray(value))
    return value.join(", ");

  return String(value);
};
