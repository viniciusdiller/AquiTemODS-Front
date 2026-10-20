import { describe, expect, it } from "vitest";
import {
  ADMIN_NAV,
  formatarTempo,
  rotaAtiva,
  semMenuLateral,
} from "./navigation";

describe("semMenuLateral", () => {
  it("esconde o menu só no login", () => {
    expect(semMenuLateral("/admin/login")).toBe(true);
    expect(semMenuLateral("/admin/dashboard")).toBe(false);
    expect(semMenuLateral("/admin/indicadores")).toBe(false);
  });

  it("não confunde rotas parecidas com o login", () => {
    expect(semMenuLateral("/admin/login-antigo")).toBe(false);
    expect(semMenuLateral("/admin")).toBe(false);
  });
});

describe("rotaAtiva", () => {
  it("marca a rota exata e as subrotas", () => {
    expect(rotaAtiva("/admin/comentarios", "/admin/comentarios")).toBe(true);
    expect(rotaAtiva("/admin/comentarios/12", "/admin/comentarios")).toBe(true);
  });

  it("não marca rotas que só começam com o mesmo texto", () => {
    expect(rotaAtiva("/admin/usuarios-antigos", "/admin/usuarios")).toBe(false);
    expect(rotaAtiva("/admin/dashboard", "/admin/usuarios")).toBe(false);
  });

  it("todo item do menu aponta para uma rota do admin, sem repetição", () => {
    const hrefs = ADMIN_NAV.map((n) => n.href);
    expect(hrefs.every((h) => h.startsWith("/admin/"))).toBe(true);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe("formatarTempo", () => {
  it("formata em HH:MM:SS", () => {
    expect(formatarTempo(0)).toBe("00:00:00");
    expect(formatarTempo(59)).toBe("00:00:59");
    expect(formatarTempo(3661)).toBe("01:01:01");
    expect(formatarTempo(28800)).toBe("08:00:00");
  });
});
