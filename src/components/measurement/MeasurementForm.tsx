"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { measurementSchema, type MeasurementFormValues } from "@/schemas/measurement.schema";
import { createMeasurement, updateMeasurement } from "@/actions/measurements";
import { BodyDiagram } from "./BodyDiagram";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatDateInput } from "@/lib/utils";
import type { Measurement } from "@/generated/prisma/client";

interface MeasurementFormProps {
  profileId: string;
  measurementId?: string;
  defaultValues?: Partial<Measurement>;
  lastMeasurement?: Measurement | null;
}

const FIELD_LABELS: Record<string, string> = {
  weightKg: "Peso (kg)",
  waistAboveNavelCm: "Cin. acima umbigo (cm)",
  waistNavelCm: "Cin. umbigo (cm)",
  rightArmCm: "Braço Dir. (cm)",
  leftArmCm: "Braço Esq. (cm)",
  rightForearmCm: "Anteb. Dir. (cm)",
  leftForearmCm: "Anteb. Esq. (cm)",
  glutesCm: "Glúteos (cm)",
  rightThighCm: "Coxa Dir. (cm)",
  leftThighCm: "Coxa Esq. (cm)",
  rightCalfCm: "Pant. Dir. (cm)",
  leftCalfCm: "Pant. Esq. (cm)",
};

type MeasurementNumericField = keyof Omit<MeasurementFormValues, "date" | "notes">;

const MOBILE_GROUPS: { title: string; fields: MeasurementNumericField[] }[] = [
  { title: "Peso", fields: ["weightKg"] },
  { title: "Medidas de Cintura", fields: ["waistAboveNavelCm", "waistNavelCm", "glutesCm"] },
  { title: "Braços", fields: ["rightArmCm", "leftArmCm", "rightForearmCm", "leftForearmCm"] },
  { title: "Pernas", fields: ["rightThighCm", "leftThighCm", "rightCalfCm", "leftCalfCm"] },
];

export function MeasurementForm({
  profileId,
  measurementId,
  defaultValues,
  lastMeasurement,
}: MeasurementFormProps) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MeasurementFormValues>({
    resolver: zodResolver(measurementSchema) as never,
    defaultValues: {
      date: defaultValues?.date
        ? formatDateInput(defaultValues.date)
        : formatDateInput(new Date()),
      weightKg: defaultValues?.weightKg ?? null,
      waistAboveNavelCm: defaultValues?.waistAboveNavelCm ?? null,
      waistNavelCm: defaultValues?.waistNavelCm ?? null,
      rightArmCm: defaultValues?.rightArmCm ?? null,
      leftArmCm: defaultValues?.leftArmCm ?? null,
      rightForearmCm: defaultValues?.rightForearmCm ?? null,
      leftForearmCm: defaultValues?.leftForearmCm ?? null,
      glutesCm: defaultValues?.glutesCm ?? null,
      rightThighCm: defaultValues?.rightThighCm ?? null,
      leftThighCm: defaultValues?.leftThighCm ?? null,
      rightCalfCm: defaultValues?.rightCalfCm ?? null,
      leftCalfCm: defaultValues?.leftCalfCm ?? null,
      notes: defaultValues?.notes ?? null,
    },
  });

  function copyFromLast() {
    if (!lastMeasurement) return;
    const fields: MeasurementNumericField[] = [
      "weightKg", "waistAboveNavelCm", "waistNavelCm",
      "rightArmCm", "leftArmCm", "rightForearmCm", "leftForearmCm",
      "glutesCm", "rightThighCm", "leftThighCm", "rightCalfCm", "leftCalfCm",
    ];
    const patch: Partial<MeasurementFormValues> = {};
    fields.forEach((f) => {
      const val = lastMeasurement[f as keyof Measurement];
      if (typeof val === "number") patch[f] = val;
    });
    reset((prev) => ({ ...prev, ...patch }));
    toast.info("Medidas do último registro copiadas");
  }

  async function onSubmit(data: MeasurementFormValues) {
    const result = measurementId
      ? await updateMeasurement(profileId, measurementId, data)
      : await createMeasurement(profileId, data);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(measurementId ? "Registro atualizado!" : "Medidas registradas!");
    router.push(result.redirectTo ?? `/profile/${profileId}/measurements`);
  }

  const globalError = (errors as Record<string, { message?: string; type?: string }>).weightKg;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Date row + copy button */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div className="grid gap-1.5">
          <Label htmlFor="date">Data do registro</Label>
          <Input
            id="date"
            type="date"
            {...register("date")}
            className="w-44"
            aria-invalid={!!errors.date}
          />
          {errors.date && (
            <p className="text-xs text-destructive">{errors.date.message}</p>
          )}
        </div>
        {lastMeasurement && !measurementId && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyFromLast}
            className="shrink-0"
          >
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            Copiar último registro
          </Button>
        )}
      </div>

      {/* Global error for "at least one field" */}
      {globalError?.type === "custom" && (
        <p className="text-sm text-destructive">{globalError.message}</p>
      )}

      {/* Desktop: body diagram */}
      <div className="hidden md:block">
        <p className="text-sm text-muted-foreground mb-2">
          Preencha os campos ao redor da silhueta. Todos são opcionais.
        </p>
        <BodyDiagram control={control} />
      </div>

      {/* Mobile: grouped fields */}
      <div className="md:hidden space-y-5">
        <p className="text-sm text-muted-foreground">
          Todos os campos são opcionais. Informe ao menos um para salvar.
        </p>
        {MOBILE_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              {group.title}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {group.fields.map((fieldName) => {
                const unit = fieldName === "weightKg" ? "kg" : "cm";
                return (
                  <div key={fieldName} className="grid gap-1.5">
                    <Label className="text-xs">{FIELD_LABELS[fieldName]}</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name={fieldName}
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="999"
                            placeholder="—"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                            }
                            className="pr-8 text-sm"
                          />
                        )}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                        {unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Notes */}
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Anotações / observações</Label>
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <Textarea
              id="notes"
              placeholder="Ex: Pós-treino de perna, me senti mais definido..."
              rows={3}
              maxLength={1000}
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value || null)}
            />
          )}
        />
        {errors.notes && (
          <p className="text-xs text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Salvando..."
            : measurementId
            ? "Salvar alterações"
            : "Salvar registro"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/profile/${profileId}/measurements`)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
