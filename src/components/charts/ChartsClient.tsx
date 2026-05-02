"use client";

import { useState, useMemo } from "react";
import { subDays, subMonths, subYears, isAfter } from "date-fns";
import { MeasurementChart, METRIC_CONFIG } from "./MeasurementChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Measurement } from "@/generated/prisma/client";

const PERIODS = [
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "6m", months: 6 },
  { label: "1a", years: 1 },
  { label: "Tudo", all: true },
] as const;

type Period = (typeof PERIODS)[number];

interface StatsCardProps {
  label: string;
  measurements: Measurement[];
  metricKey: keyof Measurement;
  unit: string;
}

function StatsCard({ label, measurements, metricKey, unit }: StatsCardProps) {
  const values = measurements
    .map((m) => m[metricKey] as number | null)
    .filter((v): v is number => v != null);

  if (values.length === 0) return null;

  const first = values[values.length - 1];
  const last = values[0];
  const delta = last - first;
  const pct = first !== 0 ? (delta / first) * 100 : 0;
  const min = Math.min(...values);
  const max = Math.max(...values);

  return (
    <div className="border rounded-2xl bg-card p-4 text-sm hover:shadow-sm transition-shadow">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xl font-bold">
        {last.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
      </p>
      <p className={cn("text-xs mt-0.5", delta < 0 ? "text-green-600" : delta > 0 ? "text-red-500" : "text-muted-foreground")}>
        {delta === 0 ? "Sem variação" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)} ${unit} (${delta > 0 ? "+" : ""}${pct.toFixed(1)}%)`}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Min: {min.toFixed(1)} · Max: {max.toFixed(1)}
      </p>
    </div>
  );
}

interface ChartsClientProps {
  measurements: Measurement[];
}

export function ChartsClient({ measurements }: ChartsClientProps) {
  const allMetrics = Object.keys(METRIC_CONFIG);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(PERIODS[1]); // 90d
  const [activeMetrics, setActiveMetrics] = useState<string[]>(
    ["weightKg", "waistNavelCm", "glutesCm"]
  );

  const filteredMeasurements = useMemo(() => {
    if ("all" in selectedPeriod && selectedPeriod.all) return measurements;
    const now = new Date();
    let cutoff: Date;
    if ("days" in selectedPeriod) cutoff = subDays(now, selectedPeriod.days);
    else if ("months" in selectedPeriod) cutoff = subMonths(now, selectedPeriod.months);
    else cutoff = subYears(now, 1);
    return measurements.filter((m) => isAfter(new Date(m.date), cutoff));
  }, [measurements, selectedPeriod]);

  function toggleMetric(metric: string) {
    setActiveMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/25 text-4xl">
          📊
        </div>
        <h3 className="text-2xl font-bold mb-2">Sem dados para exibir</h3>
        <p className="text-muted-foreground max-w-sm">
          Adicione registros de medidas para ver os gráficos de evolução
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-sm text-muted-foreground mr-2">Período:</span>
        {PERIODS.map((p) => (
          <Button
            key={p.label}
            variant={selectedPeriod.label === p.label ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs px-3 rounded-lg"
            onClick={() => setSelectedPeriod(p)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      {/* Metric toggles */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Medidas visíveis:</p>
        <div className="flex flex-wrap gap-1.5">
          {allMetrics.map((metric) => {
            const config = METRIC_CONFIG[metric];
            const isActive = activeMetrics.includes(metric);
            return (
              <button
                key={metric}
                onClick={() => toggleMetric(metric)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                  isActive
                    ? "text-white border-transparent"
                    : "bg-background text-muted-foreground border-border hover:border-foreground"
                )}
                style={isActive ? { backgroundColor: config.color, borderColor: config.color } : {}}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      {activeMetrics.length === 0 ? (
        <p className="text-muted-foreground text-sm">Selecione ao menos uma medida para exibir o gráfico.</p>
      ) : (
        <MeasurementChart
          measurements={filteredMeasurements}
          activeMetrics={activeMetrics}
        />
      )}

      {/* Stats cards */}
      <div>
        <p className="text-sm font-semibold mb-3">Estatísticas do período</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {activeMetrics.map((metric) => {
            const config = METRIC_CONFIG[metric];
            return (
              <StatsCard
                key={metric}
                label={config.label}
                measurements={filteredMeasurements}
                metricKey={metric as keyof Measurement}
                unit={config.unit}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
