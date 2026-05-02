import { getInitials } from "@/lib/utils";

interface ProfileAvatarProps {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-xl",
};

const shadowMap = {
  sm: "0 2px 8px",
  md: "0 3px 10px",
  lg: "0 6px 20px",
};

export function ProfileAvatar({ name, color, size = "md", className = "" }: ProfileAvatarProps) {
  return (
    <div
      className={`rounded-2xl flex items-center justify-center font-bold text-white shrink-0 ${sizeClasses[size]} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        boxShadow: `${shadowMap[size]} ${color}55`,
      }}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
