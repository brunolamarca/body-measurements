import { z } from "zod";

const measurementField = z
  .number()
  .positive("Deve ser um valor positivo")
  .max(999, "Valor muito alto")
  .optional()
  .nullable();

export const measurementSchema = z
  .object({
    date: z
      .string()
      .min(1, "Data obrigatória")
      .refine((v) => !isNaN(Date.parse(v)), "Data inválida")
      .refine(
        (v) => new Date(v) <= new Date(),
        "A data não pode ser futura"
      ),
    weightKg: measurementField,
    waistAboveNavelCm: measurementField,
    waistNavelCm: measurementField,
    rightArmCm: measurementField,
    leftArmCm: measurementField,
    rightForearmCm: measurementField,
    leftForearmCm: measurementField,
    glutesCm: measurementField,
    rightThighCm: measurementField,
    leftThighCm: measurementField,
    rightCalfCm: measurementField,
    leftCalfCm: measurementField,
    notes: z
      .string()
      .max(1000, "Anotações devem ter no máximo 1000 caracteres")
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      const fields = [
        data.weightKg,
        data.waistAboveNavelCm,
        data.waistNavelCm,
        data.rightArmCm,
        data.leftArmCm,
        data.rightForearmCm,
        data.leftForearmCm,
        data.glutesCm,
        data.rightThighCm,
        data.leftThighCm,
        data.rightCalfCm,
        data.leftCalfCm,
      ];
      return fields.some((f) => f != null && f > 0);
    },
    {
      message:
        "Informe ao menos uma medida ou o peso para salvar o registro",
      path: ["weightKg"],
    }
  );

export type MeasurementFormValues = z.infer<typeof measurementSchema>;
