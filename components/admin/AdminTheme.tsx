"use client";

import React from "react";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";

/** Tema do antd para o painel: rosa da marca, cantos e fonte iguais ao restante do portal. */
export default function AdminTheme({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        token: {
          colorPrimary: "#D7386E",
          colorSuccess: "#16a34a",
          colorWarning: "#C77700",
          colorError: "#DC2626",
          colorInfo: "#D7386E",
          colorText: "#2A1420",
          colorTextSecondary: "#6B5560",
          colorBorder: "#EBDDE3",
          colorBorderSecondary: "#F3E8ED",
          colorBgLayout: "#FAF5F7",
          borderRadius: 10,
          fontFamily: "var(--font-poppins), system-ui, sans-serif",
        },
        components: {
          Card: { borderRadiusLG: 14, headerFontSize: 15 },
          Tabs: { itemSelectedColor: "#B02456", inkBarColor: "#D7386E" },
          Button: {
            controlHeight: 38,
            primaryShadow: "none",
            defaultShadow: "none",
          },
          Input: { controlHeight: 40 },
          Modal: { borderRadiusLG: 16 },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
