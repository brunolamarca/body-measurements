import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter ao menos 2 caracteres")
    .max(60, "Nome muito longo"),
  birthdate: z.string().optional().nullable(),
  gender: z.enum(["masculino", "feminino", "outro"]).optional().nullable(),
  heightCm: z
    .number()
    .min(50, "Altura inválida (mín. 50cm)")
    .max(280, "Altura inválida (máx. 280cm)")
    .optional()
    .nullable(),
  avatarColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida")
    .default("#3b82f6"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
