// components/shared/PopularEquipmentChart.tsx
"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface ChartData {
  name: string;
  total: number;
}

interface PopularEquipmentChartProps {
  data: ChartData[];
}

export function PopularEquipmentChart({ data }: PopularEquipmentChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
          }}
        />
        <Bar dataKey="total" fill="#166534" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
