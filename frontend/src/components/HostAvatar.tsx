import { cn } from "cn";
import { hostColor, hostInitials } from "@/lib/hostColor";

export function HostAvatar({ alias, className }: { alias: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex size-10 shrink-0 items-center justify-center border-2 border-ink font-mono text-sm font-bold text-ink",
        hostColor(alias),
        className,
      )}
    >
      {hostInitials(alias)}
    </div>
  );
}
