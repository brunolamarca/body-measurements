"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { subDays } from "date-fns";
import { formatDateShort } from "@/lib/utils";
import type { Measurement } from "@/generated/prisma/client";

interface ProfileSparklineProps {
  measurements: Measurement[];
}

export function ProfileSparkline({ measurements }: ProfileSparklineProps) {
  const cutoff = subDays(new Date(), 90);
  const data = measurements
    .filter((m) => m.weightKg != null && new Date(m.date) >= cutoff)
    .reverse()
    .map((m) => ({
      date: formatDateShort(m.date),
      peso: m.weightKg,
    }));

  if (data.length < 2) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        Adicione ao menos 2 registros com peso nos últimos 90 dias
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
        <Tooltip
          contentStyle={{ fontSize: 12 }}
          formatter={(v) => [`${v} kg`, "Peso"]}
        />
        <Line
          type="monotone"
          dataKey="peso"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
