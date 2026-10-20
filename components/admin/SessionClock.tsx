"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { redirectToAdminLogin } from "@/lib/http";
import { formatarTempo } from "./navigation";

/** Mostra quanto falta para a sessão acabar e leva ao login quando termina. */
export default function SessionClock() {
  const [restante, setRestante] = useState<number | null>(null);

  useEffect(() => {
    const verificar = () => {
      const expira = parseInt(
        localStorage.getItem("admin_token_expiry") ?? "",
        10,
      );
      if (!expira) return;
      const diff = Math.floor((expira - Date.now()) / 1000);
      if (diff <= 0) {
        redirectToAdminLogin();
      } else {
        setRestante(diff);
      }
    };
    verificar();
    const intervalo = setInterval(verificar, 1000);
    return () => clearInterval(intervalo);
  }, []);

  if (restante === null) return null;
  const acabando = restante < 1800;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
        acabando ? "bg-amber-50 text-amber-800" : "text-slate-500"
      }`}
      role={acabando ? "status" : undefined}
    >
      <Clock className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <span>
        Sessão:{" "}
        <span className="font-medium tabular-nums">
          {formatarTempo(restante)}
        </span>
      </span>
    </div>
  );
}
