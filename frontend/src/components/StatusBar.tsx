import { SquareTerminal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  configPath: string;
  terminals: string[];
  activeTerminal: string;
  onTerminalChange: (name: string) => void;
};

export function StatusBar({ configPath, terminals, activeTerminal, onTerminalChange }: Props) {
  return (
    <footer className="flex h-12 shrink-0 items-center gap-4 border-t-3 border-ink bg-white px-5 font-mono text-xs">
      <span className="border-2 border-ink bg-cyan px-1.5 py-0.5 font-bold">CONFIG</span>
      <span className="truncate">{configPath}</span>
      <div className="flex-1" />
      <SquareTerminal className="size-4" />
      {terminals.length > 0 ? (
        <Select value={activeTerminal} onValueChange={onTerminalChange}>
          <SelectTrigger size="sm" className="min-w-36" aria-label="Terminal emulator">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {terminals.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <span className="border-2 border-ink bg-red px-1.5 py-0.5 font-bold">no terminal found</span>
      )}
    </footer>
  );
}
