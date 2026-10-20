const PALETTE = ["bg-yellow", "bg-pink", "bg-cyan", "bg-blue", "bg-lilac"] as const;

/** Stable accent color class for an alias. */
export function hostColor(alias: string): (typeof PALETTE)[number] {
  let hash = 0;
  for (const ch of alias) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

/** Up to two uppercase letters for the avatar tile. */
export function hostInitials(alias: string): string {
  const parts = alias.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (parts.length === 0) return "*";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
