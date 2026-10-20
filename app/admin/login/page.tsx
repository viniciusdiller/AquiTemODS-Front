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
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
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
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-11 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:opacity-60";
  const labelClass = "text-xs font-bold uppercase tracking-wider text-gray-700";

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Painel de marca */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#2b0a1c] via-[#5a1237] to-[#1b1030] lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full border-[56px] border-white/5" />
        <div className="pointer-events-none absolute bottom-24 right-24 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md"
        >
          <Image
            src="/logo_aquitemods.png"
            alt="Logo AquiTemODS"
            width={170}
            height={170}
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-xl text-center text-white"
        >
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight">
            Painel de Gestão do{" "}
            <span className="bg-gradient-to-r from-[hsl(339_90%_70%)] to-[hsl(30_95%_65%)] bg-clip-text text-transparent">
              AquiTemODS
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/80">
            Plataforma municipal para aprovação de projetos, moderação de
            avaliações, gestão de usuários e acompanhamento dos indicadores das
            ODS.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["Aprovação de Projetos", "Indicadores e Relatórios"].map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium backdrop-blur"
              >
                <CheckCircle2 className="h-4 w-4 text-[hsl(339_90%_70%)]" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="relative flex items-center justify-between border-t border-white/15 pt-5 text-xs text-white/70">
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Prefeitura Municipal de Saquarema
          </span>
          <span>SMGS • LabISA</span>
        </div>
      </aside>

      {/* Formulário */}
      <main className="flex flex-col bg-white px-6 py-8 sm:px-12 lg:px-16">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao portal
        </Link>

        <div className="flex flex-1 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-md"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Acesso Administrativo
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Informe suas credenciais para gerenciar a plataforma.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label htmlFor="username" className={labelClass}>
                  Usuário ou e-mail
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="username"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="Seu usuário cadastrado"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className={labelClass}>
                  Senha
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Sua senha de acesso"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition-colors hover:text-primary"
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-[hsl(339_65%_43%)] py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:translate-y-0 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Entrar no Painel
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} AquiTemODS • Prefeitura de Saquarema
        </p>
      </main>
    </div>
  );
};

export default AdminLoginPage;
