"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatDateShort } from "@/lib/utils";
import type { Measurement } from "@/generated/prisma/client";

export const METRIC_CONFIG: Record<
  string,
  { label: string; color: string; unit: string }
> = {
  weightKg: { label: "Peso", color: "#3b82f6", unit: "kg" },
  waistNavelCm: { label: "Cin. umbigo", color: "#f59e0b", unit: "cm" },
  waistAboveNavelCm: { label: "Cin. acima", color: "#f97316", unit: "cm" },
  glutesCm: { label: "Glúteos", color: "#ec4899", unit: "cm" },
  rightArmCm: { label: "Braço D.", color: "#22c55e", unit: "cm" },
  leftArmCm: { label: "Braço E.", color: "#10b981", unit: "cm" },
  rightForearmCm: { label: "Anteb. D.", color: "#06b6d4", unit: "cm" },
  leftForearmCm: { label: "Anteb. E.", color: "#0891b2", unit: "cm" },
  rightThighCm: { label: "Coxa D.", color: "#8b5cf6", unit: "cm" },
  leftThighCm: { label: "Coxa E.", color: "#a855f7", unit: "cm" },
  rightCalfCm: { label: "Pant. D.", color: "#64748b", unit: "cm" },
  leftCalfCm: { label: "Pant. E.", color: "#94a3b8", unit: "cm" },
};

interface MeasurementChartProps {
  measurements: Measurement[];
  activeMetrics: string[];
}

export function MeasurementChart({ measurements, activeMetrics }: MeasurementChartProps) {
  const weightMetrics = activeMetrics.filter((m) => m === "weightKg");
  const cmMetrics = activeMetrics.filter((m) => m !== "weightKg");

  const data = [...measurements]
    .reverse()
    .map((m) => {
      const point: Record<string, string | number | null> = {
        date: formatDateShort(m.date),
        notes: m.notes ?? null,
      };
      activeMetrics.forEach((metric) => {
        point[metric] = m[metric as keyof Measurement] as number | null;
      });
      return point;
    });

  if (data.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
        <p className="text-4xl mb-3">📈</p>
        <p className="font-medium">Dados insuficientes</p>
        <p className="text-sm">Adicione ao menos 2 registros para ver o gráfico</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weight chart (separate axis) */}
      {weightMetrics.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Peso (kg)
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 4, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} domain={["auto", "auto"]} unit="kg" />
              <Tooltip
                contentStyle={{ fontSize: 12 }}
                formatter={(v) => [`${v} kg`, METRIC_CONFIG.weightKg.label]}
              />
              <Line
                type="monotone"
                dataKey="weightKg"
                name={METRIC_CONFIG.weightKg.label}
                stroke={METRIC_CONFIG.weightKg.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Centimeter metrics chart */}
      {cmMetrics.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Medidas (cm)
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 4, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} domain={["auto", "auto"]} unit="cm" />
              <Tooltip
                contentStyle={{ fontSize: 12 }}
                formatter={(v, name) => [
                  `${v} ${METRIC_CONFIG[String(name)]?.unit ?? ""}`,
                  METRIC_CONFIG[String(name)]?.label ?? name,
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) => METRIC_CONFIG[value]?.label ?? value}
              />
              {cmMetrics.map((metric) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  name={metric}
                  stroke={METRIC_CONFIG[metric]?.color ?? "#888"}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
