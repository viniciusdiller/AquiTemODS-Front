import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import AccessibilityStyles from "@/components/AccessibilityStyles"; // 1. IMPORTE O NOVO COMPONENTE
import { ConditionalNavbar } from "@/components/ConditionalNavbar";
import { ConditionalAccessibility } from "@/components/ConditionalAccessibility";

import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Aqui Tem ODS",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Aqui Tem ODS",
    description:
      "Seu guia completo para explorar e conhecer os projetos que movimentam a economia do Rio de Janeiro.",
    url: "https://aquitemods.saquarema.rj.gov.br/",
    siteName: "AquiTemODS",
    images: [
      {
        url: "/logo_aquitemods.png",
        width: 1200,
        height: 630,
        alt: "AquiTemODS Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <AccessibilityStyles />
      </head>
      <body
        className={`${poppins.variable} bg-white flex flex-col min-h-screen`}
      >
        <ConfigProvider
          locale={ptBR}
          theme={{
            token: {
              colorPrimary: "#D7386E",

              colorLink: "#3C6AB2",
            },
          }}
        >
          <AuthProvider>
            <ConditionalNavbar />
            <main className="flex-grow">{children}</main>
            <ConditionalFooter />
            <Toaster richColors />
            <ConditionalAccessibility />
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
