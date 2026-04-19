import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Measurement } from "@/generated/prisma";

export function measurementsToCsv(measurements: Measurement[], profileName: string): string {
  const headers = [
    "Data",
    "Peso (kg)",
    "Cintura acima umbigo (cm)",
    "Cintura no umbigo (cm)",
    "Braço direito (cm)",
    "Braço esquerdo (cm)",
    "Antebraço direito (cm)",
    "Antebraço esquerdo (cm)",
    "Glúteos (cm)",
    "Coxa direita (cm)",
    "Coxa esquerda (cm)",
    "Panturrilha direita (cm)",
    "Panturrilha esquerda (cm)",
    "Notas",
  ];

  const rows = measurements.map((m) => [
    format(new Date(m.date), "dd/MM/yyyy", { locale: ptBR }),
    m.weightKg ?? "",
    m.waistAboveNavelCm ?? "",
    m.waistNavelCm ?? "",
    m.rightArmCm ?? "",
    m.leftArmCm ?? "",
    m.rightForearmCm ?? "",
    m.leftForearmCm ?? "",
    m.glutesCm ?? "",
    m.rightThighCm ?? "",
    m.leftThighCm ?? "",
    m.rightCalfCm ?? "",
    m.leftCalfCm ?? "",
    m.notes ? `"${m.notes.replace(/"/g, '""')}"` : "",
  ]);

  const bom = "\uFEFF"; // BOM for Excel UTF-8 detection
  return bom + [headers, ...rows].map((r) => r.join(";")).join("\n");
}
