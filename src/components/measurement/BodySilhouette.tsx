export function BodySilhouette() {
  return (
    <svg
      viewBox="0 0 200 500"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-muted-foreground/25 fill-current"
      aria-hidden="true"
    >
      {/* Head */}
      <ellipse cx="100" cy="38" rx="27" ry="30" />
      {/* Neck */}
      <rect x="89" y="65" width="22" height="18" rx="4" />
      {/* Torso */}
      <path d="M 62,82 L 138,82 L 148,235 L 52,235 Z" />
      {/* Left shoulder / arm (anatomical left = screen right) */}
      <path d="M 138,88 L 163,96 L 170,190 L 152,188 L 148,98 Z" />
      {/* Right shoulder / arm (anatomical right = screen left) */}
      <path d="M 62,88 L 37,96 L 30,190 L 48,188 L 52,98 Z" />
      {/* Left forearm */}
      <path d="M 152,188 L 170,190 L 174,255 L 156,253 Z" />
      {/* Right forearm */}
      <path d="M 48,188 L 30,190 L 26,255 L 44,253 Z" />
      {/* Hips */}
      <path d="M 52,235 L 148,235 L 153,278 L 47,278 Z" />
      {/* Left thigh (anatomical left = screen right) */}
      <path d="M 108,278 L 150,278 L 148,395 L 110,392 Z" />
      {/* Right thigh (anatomical right = screen left) */}
      <path d="M 50,278 L 92,278 L 90,395 L 52,392 Z" />
      {/* Left calf */}
      <path d="M 110,392 L 148,395 L 145,490 L 112,487 Z" />
      {/* Right calf */}
      <path d="M 52,392 L 90,395 L 87,490 L 55,487 Z" />
    </svg>
  );
}
