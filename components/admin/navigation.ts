import {
  BarChart3,
  Database,
  GraduationCap,
  Inbox,
  MessageSquare,
  Newspaper,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin/dashboard", label: "Solicitações", icon: Inbox },
  { href: "/admin/projetos-ativos", label: "Projetos", icon: Database },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/comentarios", label: "Comentários", icon: MessageSquare },
  { href: "/admin/sustentai", label: "SustentAí", icon: Newspaper },
  { href: "/admin/cursos", label: "Cursos", icon: GraduationCap },
  { href: "/admin/indicadores", label: "Indicadores", icon: BarChart3 },
];

/** Telas que não mostram o menu lateral. */
const SEM_MENU = ["/admin/login"];

export const semMenuLateral = (pathname: string): boolean =>
  SEM_MENU.some((rota) => pathname === rota || pathname.startsWith(`${rota}/`));

export const rotaAtiva = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(`${href}/`);

export const formatarTempo = (segundos: number): string => {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
};
