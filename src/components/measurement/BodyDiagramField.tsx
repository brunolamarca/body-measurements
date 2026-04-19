"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { MeasurementFormValues } from "@/schemas/measurement.schema";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BodyDiagramFieldProps {
  label: string;
  fieldName: keyof Omit<MeasurementFormValues, "date" | "notes">;
  unit?: string;
  hint?: string;
  control: Control<MeasurementFormValues>;
  side?: "left" | "right" | "center";
  style?: React.CSSProperties;
  className?: string;
}

export function BodyDiagramField({
  label,
  fieldName,
  unit = "cm",
  hint,
  control,
  side = "left",
  style,
  className,
}: BodyDiagramFieldProps) {
  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field, fieldState }) => (
        <div
          className={cn("absolute flex flex-col gap-0.5", className)}
          style={style}
        >
          <div
            className={cn(
              "flex items-center gap-0.5",
              side === "right" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <span className="text-[10px] font-medium text-muted-foreground leading-none whitespace-nowrap">
              {label}
            </span>
            {hint && (
              <Tooltip>
                <TooltipTrigger
                  tabIndex={-1}
                  className="text-muted-foreground/60 cursor-help"
                >
                  <HelpCircle className="h-2.5 w-2.5" />
                </TooltipTrigger>
                <TooltipContent side={side === "right" ? "left" : "right"} className="max-w-[180px] text-xs">
                  {hint}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="relative flex items-center">
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
              className={cn(
                "h-7 text-xs pr-7 w-20",
                fieldState.error && "border-destructive"
              )}
            />
            <span className="absolute right-2 text-[10px] text-muted-foreground pointer-events-none">
              {unit}
            </span>
          </div>
        </div>
      )}
    />
  );
}
