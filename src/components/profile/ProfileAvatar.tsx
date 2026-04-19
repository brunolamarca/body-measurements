import { getInitials } from "@/lib/utils";

interface ProfileAvatarProps {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-xl",
};

export function ProfileAvatar({ name, color, size = "md", className = "" }: ProfileAvatarProps) {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: color }}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
