import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import AccessibilityStyles from "@/components/AccessibilityStyles";
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
  description:
    "O ponto de encontro entre inovação, gestão e sustentabilidade. Conheça o AquiTemODS!",

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "192x192" }, // Para Android
      { url: "/favicon.png", type: "image/png", sizes: "512x512" }, // Para Android (maior)
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json", // Para Web App (PWA)

  // --- 3. OPEN GRAPH (WHATSAPP, FACEBOOK, LINKEDIN, ETC.) ---
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://aquitemods.saquarema.rj.gov.br/",
    title: "Aqui Tem ODS",
    description:
      "O ponto de encontro entre inovação, gestão e sustentabilidade. Conheça o AquiTemODS!",
    images: [
      {
        url: "https://aquitemods.saquarema.rj.gov.br//og-image.png",
        width: 1200,
        height: 630,
        alt: "Logo Aqui Tem ODS",
      },
    ],
    siteName: "Aqui Tem ODS",
  },

  // --- 4. TWITTER CARDS (ESPECÍFICO DO TWITTER) ---
  twitter: {
    card: "summary_large_image",
    title: "Aqui Tem ODS",
    description: "Conectando projetos sociais a voluntários e doadores.",
    images: ["https://aquitemods.saquarema.rj.gov.br//og-image.png"],
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
