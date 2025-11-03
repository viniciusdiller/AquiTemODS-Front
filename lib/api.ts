const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchApi(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (options.headers && "Authorization" in options.headers) {
    headers["Authorization"] = (options.headers as Record<string, string>)[
      "Authorization"
    ];
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    if (response.status === 401) {
      // Limpa o usuário do localStorage
      localStorage.removeItem("user");
      // Força o redirecionamento pa ra a página de login
      window.location.href = "/login";

      // Lança um erro para interromper a execução do código que chamou a API
      throw new Error("Sessão expirada. Redirecionando para login...");
    }
    const errorMessage =
      typeof data === "object" && data.message
        ? data.message
        : `API error: ${response.statusText}`;
    throw new Error(errorMessage);
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
  token: string
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
  token: string
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
  fetchApi(`/api/projetos/categoria/${encodeURIComponent(ods)}`);

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
    ""
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
  token: string
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
  token: string // <--- MUDOU
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
