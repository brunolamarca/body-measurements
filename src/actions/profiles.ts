"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { profileSchema } from "@/schemas/profile.schema";

type ActionResult<T = void> =
  | { success: true; data: T; redirectTo?: string }
  | { success: false; error: string };

export async function getProfiles() {
  return prisma.profile.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { measurements: true } },
      measurements: {
        orderBy: { date: "desc" },
        take: 1,
        select: { date: true },
      },
    },
  });
}

export async function getProfile(id: string) {
  return prisma.profile.findUnique({ where: { id } });
}

export async function createProfile(formData: unknown): Promise<ActionResult<string>> {
  const parsed = profileSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  const { birthdate, ...rest } = parsed.data;
  const profile = await prisma.profile.create({
    data: {
      ...rest,
      birthdate: birthdate ? new Date(birthdate) : null,
    },
  });
  revalidatePath("/");
  return { success: true, data: profile.id, redirectTo: `/profile/${profile.id}` };
}

export async function updateProfile(
  id: string,
  formData: unknown
): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  const { birthdate, ...rest } = parsed.data;
  await prisma.profile.update({
    where: { id },
    data: {
      ...rest,
      birthdate: birthdate ? new Date(birthdate) : null,
    },
  });
  revalidatePath(`/profile/${id}`);
  revalidatePath("/");
  return { success: true, data: undefined, redirectTo: `/profile/${id}` };
}

export async function deleteProfile(id: string): Promise<ActionResult> {
  await prisma.profile.delete({ where: { id } });
  revalidatePath("/");
  return { success: true, data: undefined, redirectTo: "/" };
}
