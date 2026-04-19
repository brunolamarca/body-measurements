import { cn } from "@/lib/utils";

interface DeltaBadgeProps {
  current: number | null | undefined;
  previous: number | null | undefined;
}

export function DeltaBadge({ current, previous }: DeltaBadgeProps) {
  if (current == null || previous == null) return <span className="text-muted-foreground/50">—</span>;
  const delta = current - previous;
  if (Math.abs(delta) < 0.05) return <span className="text-muted-foreground text-xs">=</span>;

  return (
    <span
      className={cn(
        "text-xs font-medium",
        delta > 0 ? "text-red-500" : "text-green-600"
      )}
    >
      {delta > 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}
    </span>
  );
}
