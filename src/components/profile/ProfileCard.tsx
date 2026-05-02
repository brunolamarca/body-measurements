import Link from "next/link";
import { CalendarDays, ChevronRight, Dumbbell } from "lucide-react";
import { getInitials, formatRelative } from "@/lib/utils";

interface ProfileCardProps {
  id: string;
  name: string;
  avatarColor: string;
  measurementCount: number;
  lastMeasurementDate?: Date | null;
}

export function ProfileCard({
  id,
  name,
  avatarColor,
  measurementCount,
  lastMeasurementDate,
}: ProfileCardProps) {
  return (
    <Link href={`/profile/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl border bg-card hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
        {/* Color accent bar */}
        <div className="h-1.5 w-full" style={{ backgroundColor: avatarColor }} />

        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md"
              style={{
                background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}cc)`,
                boxShadow: `0 4px 14px ${avatarColor}40`,
              }}
            >
              {getInitials(name)}
            </div>

            {/* Arrow icon */}
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-primary/10 transition-all duration-200">
              <ChevronRight className="h-4 w-4 text-primary" />
            </div>
          </div>

          {/* Name */}
          <h3 className="font-bold text-base mb-1 truncate group-hover:text-primary transition-colors duration-200">
            {name}
          </h3>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Dumbbell className="h-3 w-3" />
              {measurementCount === 0
                ? "Nenhum registro"
                : `${measurementCount} registro${measurementCount !== 1 ? "s" : ""}`}
            </span>
            {lastMeasurementDate && (
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {formatRelative(lastMeasurementDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
