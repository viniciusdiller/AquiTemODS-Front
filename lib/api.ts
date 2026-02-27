// Define a base da API. Em desenvolvimento, usa fallback para localhost:3001 para conveniência.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function fetchApi(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (options.headers && (options.headers as Record<string, string>)["Authorization"]) {
    headers["Authorization"] = (options.headers as Record<string, string>)["Authorization"];
  }

  const url = `${API_URL}${path}`;

  // Debug: logar detalhes da requisição para ajudar a diagnosticar 404/rotas não encontradas
  try {
    // Não vaza objetos grandes; converte body stringificada quando for string
    const bodyPreview = options.body
      ? typeof options.body === "string"
        ? options.body
        : "[non-string body]"
      : undefined;
    // eslint-disable-next-line no-console
    console.debug("fetchApi ->", (options.method || "GET").toUpperCase(), url, { headers, body: bodyPreview });
  } catch (e) {
    // ignore
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkError: any) {
    // Erro de rede (backend offline, CORS, DNS, etc.)
    const message = `Não foi possível conectar ao servidor API em ${API_URL}. Verifique se o backend está rodando.`;
    const err: any = new Error(message);
    err.cause = networkError;
    // eslint-disable-next-line no-console
    console.error(message, networkError);
    throw err;
  }

  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  let data: any = {};
  // Tenta parsear JSON apenas quando o content-type indicar JSON
  if (contentType.includes("application/json")) {
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      // Se falhar no parse, mantém o texto cru para ajudar no debug
      data = text;
    }
  } else {
    // Resposta não-JSON (ex.: página de erro HTML) — devolve texto cru
    data = text;
  }

  if (!response.ok) {
    if (response.status === 401) {
      // SÓ REDIRECIONA SE O 401 NÃO VIER DA PÁGINA DE LOGIN
      if (path !== "/api/auth/login") {
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Sessão expirada. Redirecionando para login...");
      }
    }

    // Tenta extrair mensagem útil da resposta
    const errorMessage =
      typeof data === "object" && data && (data.message || data.error)
        ? data.message || data.error
        : typeof data === "string" && data.trim()
        ? data
        : `API error: ${response.status} ${response.statusText}`;

    // Cria um Error enriquecido com os dados da resposta para facilitar debug no frontend
    const err: any = new Error(errorMessage);
    err.status = response.status;
    err.statusText = response.statusText;
    err.data = data; // objeto ou texto retornado pela API
    // compatibilidade: anexa um response com os dados
    err.response = { status: response.status, statusText: response.statusText, data };

    throw err;
  }

  return data;
}

export const registerUser = (data: any) =>
  fetchApi("/api/auth/cadastro", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const loginUser = (data: any) =>
  fetchApi("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const confirmAccount = (token: string) =>
  fetchApi(`/api/auth/confirm-account?token=${token}`, {
    method: "GET",
  });

export const updateUserProfile = (
  data: { nomeCompleto?: string; email?: string },
  token: string,
) =>
  fetchApi("/api/users/profile", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const changeUserPassword = (
  data: { currentPassword?: string; newPassword?: string },
  token: string,
) =>
  fetchApi("/api/users/password", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const requestPasswordReset = (data: { email: string }) =>
  fetchApi("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteUserAccount = (token: string) =>
  fetchApi("/api/users/profile", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllProjetos = () => fetchApi("/api/projetos");

export const getProjetosByOds = (ods: string) =>
  fetchApi(
    `/api/projetos/categoria/${encodeURIComponent(encodeURIComponent(ods))}`,
  );

export const getProjetoById = (id: string) => fetchApi(`/api/projetos/${id}`);

export const getProjetoByNome = (nome: string) =>
  fetchApi(`/api/projetos/nome/${encodeURIComponent(nome)}`);

export const cadastrarProjeto = (data: FormData) =>
  fetchApi("/api/projetos", {
    method: "POST",
    body: data,
  });

export const solicitarAtualizacaoProjeto = (id: string, data: FormData) =>
  fetchApi(`/api/projetos/solicitar-atualizacao/${id}`, {
    method: "PUT",
    body: data,
  });

export const solicitarExclusaoProjeto = (id: string, data: any) =>
  fetchApi(`/api/projetos/solicitar-exclusao/${id}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getReviewsByEstablishment = (id: string) =>
  fetchApi(`/api/avaliacoes/projetos/${id}`);

export const submitReview = (data: any, token: string) =>
  fetchApi("/api/avaliacoes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const confirmEmailChange = (token: string) =>
  fetchApi(`/api/auth/confirm-email-change?token=${token}`, {
    method: "GET",
  });

export const resetPassword = (data: { token: string; newPassword: string }) =>
  fetchApi("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteReview = (id: number, token: string) =>
  fetchApi(`/api/avaliacoes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getPendingAdminRequests = (token: string) =>
  fetchApi("/api/admin/pending", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * Remove emojis de uma string.
 * @param text A string de entrada.
 * @returns A string sem emojis.
 */
export const removeEmojis = (text: string): string => {
  if (!text) return "";
  // Regex que corresponde aos emojis para substituí-los por uma string vazia
  return text.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    "",
  );
};

/**
 * Formata uma data para o formato "Mês de Ano" em português.
 * Exemplo: "outubro de 2025"
 * @param dateString A data em formato de string (ex: "2025-10-15T...")
 * @returns A data formatada.
 */
export function formatarDataParaMesAno(dateString: string): string {
  if (!dateString) {
    return "";
  }
  const data = new Date(dateString);
  // Intl.DateTimeFormat é nativo do JavaScript e não precisa de imports problemáticos
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(data);
}

export const getAllActiveProjetos = async (token: string) => {
  const response = await fetch(`${API_URL}/api/admin/projetos-ativos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Falha ao buscar projetos ativos");
  }
  return response.json();
};

export const adminUpdateProjeto = async (
  id: number,
  data: any,
  token: string,
) => {
  const response = await fetch(`${API_URL}/api/admin/projeto/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao atualizar projeto");
  }
  return response.json();
};

export const adminDeleteProjeto = async (id: number, token: string) => {
  const response = await fetch(`${API_URL}/api/admin/projeto/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao excluir projeto");
  }
  // Respostas DELETE bem-sucedidas podem não ter corpo
  return { success: true };
};

export const adminGetReviewsByProject = (
  projetoId: string,
  token: string, // <--- MUDOU
) =>
  fetchApi(`/api/admin/avaliacoes/projeto/${projetoId}`, {
    // <--- MUDOU
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const adminDeleteReview = (id: number, token: string) =>
  fetchApi(`/api/admin/avaliacoes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const adminExportProjetos = async (token: string) => {
  const response = await fetch(`${API_URL}/api/admin/exportar-projetos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Falha ao exportar projetos");
  }

  // Retorna o Blob do arquivo para download
  return response.blob();
};

export const getAdminStats = async (
  token: string,
  startDate?: string,
  endDate?: string,
) => {
  let queryParams = "";

  if (startDate && endDate) {
    queryParams = `?startDate=${startDate}&endDate=${endDate}`;
  }

  // ATENÇÃO PARA ESTA LINHA: ela precisa concatenar o queryParams na URL
  const response = await fetch(`${API_URL}/api/admin/stats${queryParams}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar estatísticas do painel.");
  }

  return response.json();
};

export const registerShareClick = () =>
  fetchApi("/api/projetos/visualizacao/COMPARTILHAMENTO", {
    method: "POST",
  });

export const registerSustentAiNavClick = () =>
  fetchApi("/api/sustentai/click-nav", { method: "POST" });

export const registerSustentAiCardClick = (id: number) =>
  fetchApi(`/api/sustentai/click-card/${id}`, { method: "POST" });

export const getAllUsers = (token: string) =>
  fetchApi("/api/admin/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const adminUpdateUser = (id: number, data: any, token: string) =>
  fetchApi(`/api/admin/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const adminDeleteUser = (id: number, token: string) =>
  fetchApi(`/api/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const adminChangeUserPassword = (
  id: number,
  newPassword: string,
  token: string,
) =>
  fetchApi(`/api/admin/users/${id}/password`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword }),
  });

export const adminResendConfirmation = (id: number, token: string) =>
  fetchApi(`/api/admin/users/${id}/resend-confirmation`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// ==========================================
// AÇÕES SUSTENTAÍ (Público e Admin)
// ==========================================

// PÚBLICO: Buscar todas as ações (Não precisa de token)
export const getAcoesSustentai = () => fetchApi("/api/sustentai/acoes");

// PÚBLICO: Buscar uma ação específica por ID/Slug para a página interna
export const getAcaoSustentaiById = (id: string | number) =>
  fetchApi(`/api/sustentai/acoes/${id}`);

// ADMIN: Criar nova ação (Precisa do Token de Admin)
export const adminCreateAcao = (data: any, token: string) => {
  const isForm = typeof FormData !== 'undefined' && data instanceof FormData;
  return fetchApi('/api/admin/sustentai/acoes', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    },
    body: isForm ? data : JSON.stringify(data),
  });
};

// ADMIN: Atualizar ação existente (Precisa do Token de Admin)
export const adminUpdateAcao = (id: number, data: any, token: string) => {
  const isForm = typeof FormData !== 'undefined' && data instanceof FormData;
  return fetchApi(`/api/admin/sustentai/acoes/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    },
    body: isForm ? data : JSON.stringify(data),
  });
};

// ADMIN: Deletar ação (Precisa do Token de Admin)
export const adminDeleteAcao = (id: number, token: string) =>
  fetchApi(`/api/admin/sustentai/acoes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

// ADMIN: Atualizar conteúdo da página interna da ação (Precisa do Token de Admin)
export const adminUpdateAcaoConteudo = (id: number, data: any, token: string) =>
  fetchApi(`/api/admin/sustentai/acoes/${id}/conteudo`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

// ==========================================
// GENTE QUE CONSTRÓI (Pessoas - Público e Admin)
// ==========================================

// PÚBLICO: Buscar todas as pessoas
export const getPessoasSustentai = () => fetchApi("/api/sustentai/pessoas");

// ADMIN: Criar nova pessoa
export const adminCreatePessoa = (data: any, token: string) => {
  const isForm = typeof FormData !== 'undefined' && data instanceof FormData;
  return fetchApi('/api/admin/sustentai/pessoas', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    },
    body: isForm ? data : JSON.stringify(data),
  });
};

// ADMIN: Atualizar pessoa
export const adminUpdatePessoa = (id: number, data: any, token: string) => {
  const isForm = typeof FormData !== 'undefined' && data instanceof FormData;
  return fetchApi(`/api/admin/sustentai/pessoas/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    },
    body: isForm ? data : JSON.stringify(data),
  });
};

// ADMIN: Deletar pessoa
export const adminDeletePessoa = (id: number, token: string) =>
  fetchApi(`/api/admin/sustentai/pessoas/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

export const getHeaderSustentai = () => fetchApi("/api/sustentai/header");

// ADMIN: Atualizar o cabeçalho (Precisa do Token)
export const adminUpdateHeader = (data: any, token: string) =>
  fetchApi("/api/admin/sustentai/header", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
