// types/projeto.ts

// Copiada do seu app/admin/dashboard/page.tsx
export interface Imagens {
  url: string;
}

// Copiada e exportada do seu app/admin/dashboard/page.tsx
export interface Projeto {
  projetoId: number;
  nomeProjeto: string;
  prefeitura: string;
  responsavelProjeto?: string;
  logoUrl?: string;
  projetoImg?: Imagens[];
  dados_atualizacao?: any;
  status: string;
  venceuPspe: boolean;
  venda?: string;
  escala?: number;
  [key: string]: any;
}
