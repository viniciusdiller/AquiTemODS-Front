"use client";

import React from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorBg: string;
  colorText: string;
  suffix?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  colorBg,
  colorText,
  suffix,
}) => {
  return (
    <div className="flex h-full items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl"
        style={{ backgroundColor: colorBg, color: colorText }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {title}
        </div>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-gray-900">
            {value ?? 0}
          </span>
          {suffix && (
            <span className="text-sm font-semibold text-gray-400">
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
