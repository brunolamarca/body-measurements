"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308",
  "#84cc16", "#22c55e", "#10b981", "#14b8a6",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6",
  "#a855f7", "#ec4899", "#f43f5e", "#64748b",
  "#78716c", "#6b7280", "#0f172a", "#1e293b",
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        className="w-10 h-10 rounded-full border-2 border-border cursor-pointer hover:scale-110 transition-transform"
        style={{ backgroundColor: value }}
        aria-label="Escolher cor do avatar"
      />
      <PopoverContent className="w-56 p-3">
        <p className="text-xs text-muted-foreground mb-2">Cores predefinidas</p>
        <div className="grid grid-cols-5 gap-1.5 mb-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                value === color ? "border-foreground scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
              aria-label={color}
            />
          ))}
        </div>
        <div className="border-t pt-2">
          <p className="text-xs text-muted-foreground mb-1">Cor personalizada</p>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-8 rounded cursor-pointer"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
