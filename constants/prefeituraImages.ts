import { cidadesRJ } from "./cidades";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const normalizePrefeitura = (prefeitura: string) =>
  prefeitura.replace(/^Prefeitura Municipal de /i, "").trim();

// Tipo de entrada do mapa: pode ser apenas o nome base (string)
// ou um objeto com nomes separados para lista e detalhe.
type PrefImageEntry =
  | string
  | {
      list: string; // nome base usado na listagem (ex.: <base>--g.png)
      detail: string; // nome base usado na página interna (ex.: <base>--p.png)
    };

// Gera um mapa automático a partir da lista de cidades exportada em constants/cidades.ts
// Neste mapa automático usamos o slug como base para ambos (list e detail)
const buildAutoMap = (): Record<string, PrefImageEntry> => {
  const map: Record<string, PrefImageEntry> = {};
  for (const cidade of cidadesRJ) {
    const key = slugify(normalizePrefeitura(cidade));
    map[key] = key; // usa o mesmo nome base para lista e detalhe por padrão
  }
  return map;
};

const autoMap = buildAutoMap();

// Overrides manuais quando o nome do arquivo não corresponder exatamente ao slug.
// Você pode fornecer apenas uma string (mesmo nome base para lista e detalhe)
// ou um objeto com { list, detail } para nomes distintos.
const manualOverrides: Record<string, PrefImageEntry> = {
  // Exemplo com mesmo nome base:
  // "angra-dos-reis": "prefeitura-angra.png",

};

export const PREFEITURA_IMAGE_MAP: Record<string, PrefImageEntry> = {
  ...autoMap,
  ...manualOverrides,
};

const getImageBase = (
  prefeitura: string | undefined,
  type: "list" | "detail"
): string => {
  if (!prefeitura) return "default";
  const slug = slugify(normalizePrefeitura(prefeitura));
  const entry = PREFEITURA_IMAGE_MAP[slug];
  if (!entry) return slug;
  if (typeof entry === "string") return entry; // mesmo nome base para ambos
  return type === "list" ? entry.list ?? slug : entry.detail ?? slug;
};

export const getPrefeituraListImage = (prefeitura?: string) => {
  const base = getImageBase(prefeitura, "list");
  return `/prefeituras/${base}--g.png`;
};

export const getPrefeituraDetailImage = (prefeitura?: string) => {
  const base = getImageBase(prefeitura, "detail");
  return `/prefeituras/${base}--p.png`;
};