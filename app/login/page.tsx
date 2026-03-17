"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { loginUser, resendConfirmationEmail } from "@/lib/api";
import { AnimatePresence } from "framer-motion";
import { Notification, NotificationType } from "@/components/ui/notification";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
} from "lucide-react";

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Novos estados para a funcionalidade de reenvio
  const [showResend, setShowResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { login } = useAuth();

  const addNotification = (text: string, type: "success" | "error") => {
    const newNotif: NotificationType = {
      id: Math.random(),
      text,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const removeNotif = (id: number) => {
    setNotifications((pv) => pv.filter((n) => n.id !== id));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowResend(false); // Reseta a exibição do botão a cada tentativa

    const loginData = {
      username: emailOrUsername,
      password: password,
    };

    try {
      const userData = await loginUser(loginData);
      addNotification("Login bem-sucedido! Redirecionando...", "success");
      login(userData);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message;

      // Verifica se o erro é sobre conta não ativada (seja por "não foi verificada" ou "Conta não ativada")
      if (
        errorMessage.toLowerCase().includes("não foi verificada") ||
        errorMessage.toLowerCase().includes("conta não ativada")
      ) {
        addNotification(
          "Sua conta ainda não foi verificada. Por favor, confirme seu e-mail antes de entrar.",
          "error",
        );
        setShowResend(true); // Exibe o botão de reenviar e-mail
      } else {
        addNotification(
          errorMessage || "Email/usuário ou senha inválidos. Tente novamente.",
          "error",
        );
      }

      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para gerenciar o contador de reenvio
  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown]);

  // Função para reenviar o e-mail
  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Utiliza a função do api.ts
      const data = await resendConfirmationEmail({ username: emailOrUsername });

      addNotification(
        data.message ||
          "E-mail reenviado com sucesso! Verifique sua caixa de entrada.",
        "success",
      );
      setCountdown(60); // Inicia o tempo de espera
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Erro de conexão ao tentar reenviar o e-mail.";
      addNotification(errorMessage, "error");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-1 w-72 fixed top-4 right-4 z-50 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <Notification removeNotif={removeNotif} {...n} key={n.id} />
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center h-screen bg-gray-50 px-4 ">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Link href="/" passHref>
              <Image
                src="/Logo_aquitemods.png"
                alt="Logo AquiTemODS"
                width={150}
                height={150}
                className="mx-auto"
              />
            </Link>
          </div>
          <div className="mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-[#3C6AB2] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </Link>
          </div>
          <Card
            className="rounded-2xl border border-[#3C6AB2]/70 bg-white shadow-lg
                      focus:outline-none focus:ring-2 focus:border-transparent
                      transition-all duration-300 placeholder-gray-400 text-sm
                      hover:shadow-md"
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Efetue o Login</CardTitle>
              <CardDescription>
                Entre com suas credenciais para ter a possibilidade de avaliar
                ou cadastrar um novo projeto na plataforma.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailOrUsername">
                    Email / Nome de usuário
                  </Label>
                  <Input
                    id="emailOrUsername"
                    type="text"
                    placeholder="Insira seu email ou nome de usuário"
                    required
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    disabled={isLoading}
                    className="w-full py-2
                      rounded-2xl border border-gray-200 bg-white shadow-sm
                      focus:ring-2 focus:border-[#3C6AB2]/70 transition-all duration-300 placeholder:text-gray-400
                      "
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full py-2 pr-10
                      rounded-2xl border border-gray-200 bg-white shadow-sm
                      focus:ring-2 focus:border-[#3C6AB2]/70 transition-all duration-300 placeholder:text-gray-400
                      "
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword ? "Esconder senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Bloco condicional de Reenviar E-mail mantendo a identidade visual */}
                {showResend && (
                  <div className="mt-2 p-4 bg-[#3C6AB2]/10 border border-[#3C6AB2]/20 rounded-xl flex flex-col items-center text-center space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 text-[#3C6AB2] font-semibold text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Conta não ativada
                    </div>
                    <p className="text-xs text-gray-600">
                      Enviamos um link de confirmação para o seu e-mail. Não
                      encontrou?
                    </p>

                    {countdown > 0 ? (
                      <div className="py-2 px-4 bg-[#3C6AB2]/20 rounded-lg text-xs font-medium text-[#3C6AB2] flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Aguarde {countdown}s para reenviar
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleResendEmail}
                        disabled={isResending}
                        variant="outline"
                        className="h-9 px-4 text-xs font-medium text-[#3C6AB2] border-[#3C6AB2]/40 hover:bg-[#3C6AB2]/10 hover:text-[#3C6AB2] hover:border-[#3C6AB2] rounded-lg transition-all w-full shadow-sm"
                      >
                        {isResending ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Enviando...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" />
                            Reenviar e-mail
                          </span>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-center space-y-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="hover:bg-[#D7386E] rounded-2xl hover:text-white flex justify-center mx-auto px-10 text-gray-700 border border-[#3C6AB2]/70 w-full disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Aguarde...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
                <Link href="/cadastro" className=" text-gray-600 ">
                  Novo por aqui?{" "}
                  <strong className="underline hover:text-[#D7386E] transition-colors">
                    {" "}
                    Cadastre-se
                  </strong>
                </Link>
              </CardFooter>
            </form>
          </Card>
          <div className="mt-4 text-center text-sm">
            <Link
              href="/esqueci-senha"
              className="underline text-gray-600 hover:text-[#D7386E] transition-colors"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
