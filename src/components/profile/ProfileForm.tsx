"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { profileSchema, type ProfileFormValues } from "@/schemas/profile.schema";
import { createProfile, updateProfile } from "@/actions/profiles";
import { ProfileAvatar } from "./ProfileAvatar";
import { ColorPicker } from "./ColorPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateInput } from "@/lib/utils";

interface ProfileFormProps {
  profileId?: string;
  defaultValues?: {
    name?: string;
    birthdate?: Date | null;
    gender?: "masculino" | "feminino" | "outro" | null;
    heightCm?: number | null;
    avatarColor?: string;
  };
}

export function ProfileForm({ profileId, defaultValues }: ProfileFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as never,
    defaultValues: {
      name: defaultValues?.name ?? "",
      birthdate: defaultValues?.birthdate
        ? formatDateInput(defaultValues.birthdate)
        : "",
      gender: defaultValues?.gender ?? undefined,
      heightCm: defaultValues?.heightCm ?? undefined,
      avatarColor: defaultValues?.avatarColor ?? "#3b82f6",
    },
  });

  const avatarColor = watch("avatarColor");
  const name = watch("name");

  async function onSubmit(data: ProfileFormValues) {
    const result = profileId
      ? await updateProfile(profileId, data)
      : await createProfile(data);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(profileId ? "Perfil atualizado!" : "Perfil criado com sucesso!");
    router.push(result.redirectTo ?? "/");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      {/* Avatar preview */}
      <div className="flex items-center gap-4">
        <ProfileAvatar name={name || "?"} color={avatarColor} size="lg" />
        <div>
          <p className="text-sm font-medium mb-1">Cor do avatar</p>
          <ColorPicker
            value={avatarColor}
            onChange={(color) => setValue("avatarColor", color)}
          />
        </div>
      </div>

      {/* Name */}
      <div className="grid gap-1.5">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          placeholder="Ex: João Silva"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Birthdate */}
      <div className="grid gap-1.5">
        <Label htmlFor="birthdate">Data de nascimento</Label>
        <Input
          id="birthdate"
          type="date"
          {...register("birthdate")}
        />
      </div>

      {/* Gender */}
      <div className="grid gap-1.5">
        <Label htmlFor="gender">Gênero</Label>
        <Select
          onValueChange={(val) => setValue("gender", val as "masculino" | "feminino" | "outro")}
          defaultValue={defaultValues?.gender ?? undefined}
        >
          <SelectTrigger id="gender">
            <SelectValue placeholder="Selecione (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="feminino">Feminino</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Height */}
      <div className="grid gap-1.5">
        <Label htmlFor="heightCm">Altura</Label>
        <div className="relative">
          <Input
            id="heightCm"
            type="number"
            step="0.1"
            placeholder="Ex: 175"
            {...register("heightCm", {
              setValueAs: (v) => (v === "" ? null : parseFloat(v)),
            })}
            className="pr-10"
            aria-invalid={!!errors.heightCm}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            cm
          </span>
        </div>
        {errors.heightCm && (
          <p className="text-xs text-destructive">{errors.heightCm.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Salvando..."
            : profileId
            ? "Salvar alterações"
            : "Criar perfil"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
