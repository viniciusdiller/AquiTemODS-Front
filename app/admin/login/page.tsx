"use client";

import { safeFetch } from "@/lib/http";
import React, { useState } from "react";
import { message } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";

// URL da sua API backend
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AdminLoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = { username, password };
    setLoading(true);
    try {
      const response = await safeFetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("admin_token", data.token);

        const expiryTime = Date.now() + 28800 * 1000;
        localStorage.setItem("admin_token_expiry", expiryTime.toString());
        document.cookie = `admin_token=${data.token}; path=/; max-age=28800;`;
        // -----------------------------------

        // Compatibilidade antiga
        try {
          localStorage.setItem("user", JSON.stringify({ token: data.token }));
          localStorage.setItem("token", data.token);
        } catch (e) {
          console.warn("Falha ao gravar no localStorage", e);
        }

        message.success("Login bem-sucedido!");
        router.push("/admin/dashboard");
      } else {
        message.error(data.message || "Usuário ou senha inválidos.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      message.error("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50/60 py-3 pl-11 pr-11 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[hsl(339_65%_53%)] focus:bg-white focus:ring-4 focus:ring-[hsl(339_65%_53%)]/15 disabled:opacity-60";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel de marca */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[hsl(339_65%_30%)] via-primary to-[hsl(339_75%_68%)] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full border-[48px] border-white/10" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <Link
          href="/"
          className="relative flex w-fit items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao site
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-md text-white"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium backdrop-blur">
            <ShieldCheck className="h-4 w-4" />
            Área restrita
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Painel do Administrador
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            Gerencie projetos, cursos, usuários e indicadores da plataforma
            AquiTemODS em um só lugar.
          </p>
        </motion.div>

        <p className="relative text-xs text-white/60">
          © {new Date().getFullYear()} AquiTemODS
        </p>
      </aside>

      {/* Formulário */}
      <main className="relative flex items-center justify-center bg-gray-50 px-6 py-12">
        <Link
          href="/"
          className="absolute left-6 top-6 flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-[hsl(339_65%_53%)] lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-3xl border border-[hsl(339_65%_53%)]/20 bg-white p-8 shadow-xl sm:p-10"
        >
          <div className="mb-8 text-center">
            <Image
              src="/logo_aquitemods.png"
              alt="Logo AquiTemODS"
              width={120}
              height={120}
              className="mx-auto mb-5"
              priority
            />
            <h2 className="text-2xl font-bold text-gray-900">
              Bem-vindo de volta
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Entre com suas credenciais de administrador.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Usuário
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition-colors hover:text-[hsl(339_65%_53%)]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-[hsl(339_65%_43%)] py-3 text-sm font-semibold text-white shadow-lg shadow-[hsl(339_65%_53%)]/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[hsl(339_65%_53%)]/30 disabled:translate-y-0 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLoginPage;
