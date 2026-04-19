import Link from "next/link";
import { ProfileAvatar } from "./ProfileAvatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelative } from "@/lib/utils";

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
    <Link href={`/profile/${id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="flex items-center gap-4 p-5">
          <ProfileAvatar name={name} color={avatarColor} size="lg" />
          <div className="min-w-0">
            <p className="font-semibold truncate group-hover:text-primary transition-colors">
              {name}
            </p>
            <p className="text-sm text-muted-foreground">
              {measurementCount === 0
                ? "Nenhum registro"
                : `${measurementCount} registro${measurementCount !== 1 ? "s" : ""}`}
            </p>
            {lastMeasurementDate && (
              <p className="text-xs text-muted-foreground">
                Último: {formatRelative(lastMeasurementDate)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
