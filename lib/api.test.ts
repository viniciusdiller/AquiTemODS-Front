import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAdminStats, loginUser } from "./api";
import { NETWORK_ERROR_MESSAGE } from "./http";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

describe("lib/api — tratamento de erros", () => {
  let location: { href: string };

  beforeEach(() => {
    location = { href: "" };
    vi.stubGlobal("location", location);
    vi.spyOn(console, "error").mockImplementation(() => {});
    localStorage.setItem("admin_token", "tok");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("fetchApi: backend offline vira mensagem amigável (sem 'Failed to fetch')", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );
    await expect(loginUser({ username: "a", password: "b" })).rejects.toThrow(
      NETWORK_ERROR_MESSAGE,
    );
  });

  it("fetchApi: login com credenciais inválidas mostra a mensagem do servidor e NÃO redireciona", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(json({ message: "Credenciais inválidas" }, 401)),
    );
    await expect(loginUser({ username: "a", password: "b" })).rejects.toThrow(
      "Credenciais inválidas",
    );
    expect(location.href).toBe("");
  });

  it("admin: 401 (token vencido) limpa a sessão e redireciona para /admin/login", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({}, 401)));
    await expect(getAdminStats("tok")).rejects.toThrow("Sessão expirada");
    expect(location.href).toBe("/admin/login");
    expect(localStorage.getItem("admin_token")).toBeNull();
  });

  it("admin: rede fora do ar vira mensagem amigável", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );
    await expect(getAdminStats("tok")).rejects.toThrow(NETWORK_ERROR_MESSAGE);
  });

  it("admin: erro 500 com corpo HTML não quebra e usa a mensagem padrão", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(new Response("<html>502</html>", { status: 502 })),
    );
    await expect(getAdminStats("tok")).rejects.toThrow(
      "Erro ao buscar estatísticas do painel.",
    );
  });

  it("admin: envia o token no header Authorization", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    await getAdminStats("tok");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer tok");
  });
});
