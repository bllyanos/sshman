import { cn } from "cn";

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  className?: string;
};

export function FieldCard({ label, value, placeholder = "—", className }: Props) {
  return (
    <div className={cn("border-2 border-ink bg-white p-3", className)}>
      <div className="mb-1 text-[11px] font-bold tracking-widest uppercase">{label}</div>
      <div className={cn("font-mono text-sm [overflow-wrap:anywhere]", !value && "text-muted-foreground")}>{value || placeholder}</div>
    </div>
  );
}
