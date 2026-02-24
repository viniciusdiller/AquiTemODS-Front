"use client";

import React from "react";
import { Card, Statistic, Typography } from "antd";

const { Text } = Typography;

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
    <Card
      bordered={false}
      className="shadow-sm h-full"
      bodyStyle={{ padding: "20px", background: colorBg, borderRadius: "8px" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <Text
            type="secondary"
            className="font-medium uppercase text-xs tracking-wider"
            style={{ color: colorText, opacity: 0.8 }}
          >
            {title}
          </Text>
          <Statistic
            value={value}
            valueStyle={{
              color: colorText,
              fontWeight: "800",
              fontSize: "28px",
            }}
            suffix={
              suffix && (
                <span className="text-lg opacity-70 font-semibold ml-1">
                  {suffix}
                </span>
              )
            }
          />
        </div>
        <div
          className="p-3 rounded-full bg-white bg-opacity-30 text-3xl"
          style={{ color: colorText }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};
