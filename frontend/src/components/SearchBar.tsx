import { forwardRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const SearchBar = forwardRef<HTMLInputElement, Props>(function SearchBar({ value, onChange, onKeyDown }, ref) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="search hosts…"
        aria-label="Search hosts"
        className="pr-9 pl-9"
        spellCheck={false}
      />
      <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 border-2 border-ink bg-muted px-1.5 font-mono text-[10px] font-bold">
        /
      </kbd>
    </div>
  );
});
