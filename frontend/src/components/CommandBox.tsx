import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CommandBox({ command, onCopy }: { command: string; onCopy: () => void }) {
  return (
    <div className="flex items-center gap-3 border-3 border-ink bg-ink py-2 pr-2 pl-4 shadow-brutal">
      <span className="font-mono text-sm font-bold text-cyan select-none">$</span>
      <code className="flex-1 truncate font-mono text-sm text-yellow">{command}</code>
      <Button size="sm" variant="outline" onClick={onCopy}>
        <Copy /> Copy
      </Button>
    </div>
  );
}
