import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatDateShort(date: Date | string): string {
  return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
}

export function formatDateInput(date: Date | string): string {
  return format(new Date(date), "yyyy-MM-dd");
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}

export function formatMeasurement(value: number | null | undefined, unit = "cm"): string {
  if (value == null) return "—";
  return `${value.toFixed(1)} ${unit}`;
}

export function calcBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
