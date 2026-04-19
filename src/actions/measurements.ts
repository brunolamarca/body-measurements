"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { measurementSchema } from "@/schemas/measurement.schema";

type ActionResult<T = void> =
  | { success: true; data: T; redirectTo?: string }
  | { success: false; error: string };

export async function getMeasurements(profileId: string) {
  return prisma.measurement.findMany({
    where: { profileId },
    orderBy: { date: "desc" },
  });
}

export async function getMeasurement(measurementId: string) {
  return prisma.measurement.findUnique({ where: { id: measurementId } });
}

export async function getLastMeasurement(profileId: string) {
  return prisma.measurement.findFirst({
    where: { profileId },
    orderBy: { date: "desc" },
  });
}

export async function createMeasurement(
  profileId: string,
  formData: unknown
): Promise<ActionResult<string>> {
  const parsed = measurementSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  const { date, ...rest } = parsed.data;
  const measurement = await prisma.measurement.create({
    data: { profileId, date: new Date(date), ...rest },
  });
  revalidatePath(`/profile/${profileId}/measurements`);
  revalidatePath(`/profile/${profileId}`);
  return {
    success: true,
    data: measurement.id,
    redirectTo: `/profile/${profileId}/measurements`,
  };
}

export async function updateMeasurement(
  profileId: string,
  measurementId: string,
  formData: unknown
): Promise<ActionResult> {
  const parsed = measurementSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  const { date, ...rest } = parsed.data;
  await prisma.measurement.update({
    where: { id: measurementId },
    data: { date: new Date(date), ...rest },
  });
  revalidatePath(`/profile/${profileId}/measurements`);
  revalidatePath(`/profile/${profileId}`);
  return {
    success: true,
    data: undefined,
    redirectTo: `/profile/${profileId}/measurements`,
  };
}

export async function deleteMeasurement(
  profileId: string,
  measurementId: string
): Promise<ActionResult> {
  await prisma.measurement.delete({ where: { id: measurementId } });
  revalidatePath(`/profile/${profileId}/measurements`);
  revalidatePath(`/profile/${profileId}`);
  return {
    success: true,
    data: undefined,
    redirectTo: `/profile/${profileId}/measurements`,
  };
}
