import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  NETWORK_ERROR_MESSAGE,
  NetworkError,
  getErrorMessage,
  isNetworkError,
  readJsonSafe,
  redirectToAdminLogin,
  safeFetch,
} from "./http";

describe("isNetworkError / getErrorMessage", () => {
  it.each([
    "Failed to fetch",
    "NetworkError when attempting to fetch resource.",
    "Load failed",
    "Network Error",
    "fetch failed",
  ])("reconhece a mensagem crua de rede %j", (raw) => {
    expect(isNetworkError(new TypeError(raw))).toBe(true);
    expect(getErrorMessage(new TypeError(raw))).toBe(NETWORK_ERROR_MESSAGE);
  });

  it("nunca devolve 'Failed to fetch' ao usuário", () => {
    expect(getErrorMessage(new TypeError("Failed to fetch"), "x")).not.toMatch(
      /failed to fetch/i,
    );
  });

  it("mantém a mensagem de erros que não são de rede", () => {
    expect(getErrorMessage(new Error("Usuário ou senha inválidos."))).toBe(
      "Usuário ou senha inválidos.",
    );
  });

  it("usa o fallback para valores desconhecidos ou mensagem vazia", () => {
    expect(getErrorMessage(null, "fallback")).toBe("fallback");
    expect(getErrorMessage(undefined, "fallback")).toBe("fallback");
    expect(getErrorMessage(new Error("   "), "fallback")).toBe("fallback");
    expect(getErrorMessage({ foo: 1 }, "fallback")).toBe("fallback");
  });

  it("aceita string como erro", () => {
    expect(getErrorMessage("Falhou", "fallback")).toBe("Falhou");
  });

  it("considera NetworkError como erro de rede", () => {
    expect(isNetworkError(new NetworkError())).toBe(true);
  });
});

describe("safeFetch", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("converte falha de rede em NetworkError amigável", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );
    const promise = safeFetch("http://x");
    await expect(promise).rejects.toBeInstanceOf(NetworkError);
    await expect(promise).rejects.toThrow(NETWORK_ERROR_MESSAGE);
  });

  it("devolve a resposta HTTP mesmo quando o status é de erro", async () => {
    const res = new Response("{}", { status: 500 });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(res));
    await expect(safeFetch("http://x")).resolves.toBe(res);
  });

  it("não mascara AbortError", async () => {
    const abort = new DOMException("abortado", "AbortError");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(abort));
    await expect(safeFetch("http://x")).rejects.toBe(abort);
  });
});

describe("readJsonSafe", () => {
  it("lê JSON válido", async () => {
    expect(await readJsonSafe(new Response('{"message":"ok"}'))).toEqual({
      message: "ok",
    });
  });

  it("devolve null para corpo vazio ou HTML", async () => {
    expect(await readJsonSafe(new Response(""))).toBeNull();
    expect(await readJsonSafe(new Response("<html>502</html>"))).toBeNull();
  });
});

describe("redirectToAdminLogin", () => {
  it("limpa a sessão de admin e vai para /admin/login", () => {
    localStorage.setItem("admin_token", "abc");
    localStorage.setItem("admin_token_expiry", "123");
    const location = { href: "" };
    vi.stubGlobal("location", location);

    redirectToAdminLogin();

    expect(localStorage.getItem("admin_token")).toBeNull();
    expect(localStorage.getItem("admin_token_expiry")).toBeNull();
    expect(location.href).toBe("/admin/login");
    vi.unstubAllGlobals();
  });
});
