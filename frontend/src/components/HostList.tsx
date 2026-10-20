import type { Host } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HostListItem } from "./HostListItem";

type Props = {
  hosts: Host[];
  selectedAlias: string | null;
  onSelect: (alias: string) => void;
  onConnect: (host: Host) => void;
  emptyText: string;
};

export function HostList({ hosts, selectedAlias, onSelect, onConnect, emptyText }: Props) {
  if (hosts.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center font-mono text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }
  return (
    <ScrollArea className="min-h-0 flex-1">
      <ul>
        {hosts.map((h) => (
          <HostListItem
            key={h.alias}
            host={h}
            selected={h.alias === selectedAlias}
            onSelect={() => onSelect(h.alias)}
            onConnect={() => onConnect(h)}
          />
        ))}
      </ul>
    </ScrollArea>
  );
}
