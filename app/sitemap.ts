import { MetadataRoute } from "next";

// --- INÍCIO DA CONFIGURAÇÃO ---

// 1. URL PÚBLICA (para o Google)
const baseUrl = "https://aquitemods.saquarema.rj.gov.br";

// 2. URL INTERNA (para o Next.js buscar os dados no backend)
// Como ambos rodam no mesmo servidor Linux, usamos localhost.
const backendApiBaseUrl = "http://localhost:3303"; // <--- ALTERAÇÃO PRINCIPAL

// Interface para os dados do projeto
interface Projeto {
  id: number;
  nome: string;
  ods: number;
  updatedAt: string; // ou Date
}

// --- FIM DA CONFIGURAÇÃO ---

/**
 * Função para "slugify" o nome do projeto.
 */
function slugify(nome: string): string {
  return encodeURIComponent(nome);
}

/**
 * Função para criar o slug da ODS
 */
function getOdsSlug(ods: number): string {
  return `ods-${ods}`;
}

// Função principal do sitemap
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Buscar projetos dinâmicos
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    // Usando a URL interna para o fetch
    const res = await fetch(`${backendApiBaseUrl}/api/projetos`, {
      next: { revalidate: 3600 }, // Atualiza a cada 1 hora
    });

    if (!res.ok) {
      throw new Error(`Sitemap: Falha ao buscar projetos: ${res.statusText}`);
    }

    const projetos: Projeto[] = await res.json();

    projectRoutes = projetos.map((projeto) => ({
      url: `${baseUrl}/categoria/${getOdsSlug(projeto.ods)}/${slugify(
        projeto.nome
      )}`, // URL pública
      lastModified: new Date(projeto.updatedAt),
      priority: 0.6,
      changeFrequency: "monthly",
    }));
  } catch (error) {
    console.error("Sitemap: Erro ao gerar sitemap para projetos:", error);
  }

  // 2. Páginas de Categoria (ODS 1-17)
  const odsCategories: MetadataRoute.Sitemap = Array.from(
    { length: 17 },
    (_, i) => i + 1
  ).map((odsNum) => ({
    url: `${baseUrl}/categoria/${getOdsSlug(odsNum)}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  // 3. Páginas Estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      priority: 1.0,
      changeFrequency: "daily",
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/FAQ`,
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/espaco-dos-ods`,
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      url: `${baseUrl}/enigmas-do-futuro`,
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "monthly",
    },
  ];

  // 4. Combina todas as rotas
  return [...staticRoutes, ...odsCategories, ...projectRoutes];
}
