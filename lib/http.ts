export const NETWORK_ERROR_MESSAGE =
  "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";

/** Mensagens cruas que cada navegador devolve quando o fetch falha por rede. */
const RAW_NETWORK_MESSAGES = [
  "failed to fetch", // Chrome / Edge
  "networkerror when attempting to fetch resource", // Firefox
  "load failed", // Safari
  "network request failed",
  "network error", // axios
  "fetch failed", // Node / SSR
];

export class NetworkError extends Error {
  constructor(public cause?: unknown) {
    super(NETWORK_ERROR_MESSAGE);
    this.name = "NetworkError";
  }
}

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof NetworkError) return true;
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return RAW_NETWORK_MESSAGES.some((raw) => msg.includes(raw));
};

/**
 * Devolve sempre um texto seguro para mostrar ao usuário:
 * erros de rede viram a mensagem amigável e nunca vaza "Failed to fetch".
 */
export const getErrorMessage = (
  error: unknown,
  fallback = "Ocorreu um erro inesperado. Tente novamente.",
): string => {
  if (isNetworkError(error)) return NETWORK_ERROR_MESSAGE;
  if (error instanceof Error && error.message.trim()) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return fallback;
};

/**
 * Substituto do `fetch` que converte falhas de rede em NetworkError
 * (com mensagem amigável). Respostas HTTP de erro continuam chegando
 * normalmente em `response.ok`/`response.status`.
 */
export async function safeFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    // eslint-disable-next-line no-console
    console.error("Falha de rede:", error);
    throw new NetworkError(error);
  }
}

/** Lê o corpo JSON de uma resposta sem lançar quando vier vazio ou inválido. */
export async function readJsonSafe<T = any>(
  response: Response,
): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

/** Limpa a sessão de admin e manda para a tela de login. */
export function redirectToAdminLogin() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_token_expiry");
    document.cookie = "admin_token=; path=/; max-age=0;";
  } catch {
    // storage indisponível: segue para o login mesmo assim
  }
  window.location.href = "/admin/login";
}
