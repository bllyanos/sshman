import { Plus, X } from "lucide-react";
import type { Option } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  options: Option[];
  onChange: (options: Option[]) => void;
  error?: string;
};

export function OptionsEditor({ options, onChange, error }: Props) {
  const set = (i: number, patch: Partial<Option>) =>
    onChange(options.map((o, j) => (j === i ? { ...o, ...patch } : o)));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-widest uppercase">Other options</span>
        <Button type="button" size="xs" variant="outline" onClick={() => onChange([...options, { key: "", value: "" }])}>
          <Plus /> Add
        </Button>
      </div>
      {options.length === 0 && (
        <p className="border-2 border-dashed border-ink p-3 text-center font-mono text-xs text-muted-foreground">
          e.g. IdentitiesOnly yes · ProxyJump bastion · ForwardAgent no
        </p>
      )}
      <div className="flex flex-col gap-2">
        {options.map((o, i) => (
          <div key={i} className="flex gap-2">
            <Input
              aria-label="Option key"
              placeholder="Key"
              value={o.key}
              onChange={(e) => set(i, { key: e.target.value })}
              className="w-2/5"
              spellCheck={false}
            />
            <Input
              aria-label="Option value"
              placeholder="value"
              value={o.value}
              onChange={(e) => set(i, { value: e.target.value })}
              spellCheck={false}
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label="Remove option"
              onClick={() => onChange(options.filter((_, j) => j !== i))}
            >
              <X />
            </Button>
          </div>
        ))}
      </div>
      {error && <p className="mt-1.5 inline-block bg-red px-1.5 font-mono text-[11px] font-bold">{error}</p>}
    </div>
  );
}
