import { Label } from "@/components/ui/label";

type Props = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormField({ id, label, error, hint, children, className }: Props) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 text-[11px] font-bold tracking-widest uppercase">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 inline-block bg-red px-1.5 font-mono text-[11px] font-bold">{error}</p>
      ) : (
        hint && <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
