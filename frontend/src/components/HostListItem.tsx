import { Lock } from "lucide-react";
import { cn } from "cn";
import type { Host } from "@/lib/api";
import { hostTarget } from "@/lib/sshCommand";
import { HostAvatar } from "./HostAvatar";
import { HostContextMenu, type HostMenuActions } from "./HostContextMenu";

type Props = {
  host: Host;
  selected: boolean;
  onSelect: () => void;
  actions: HostMenuActions;
};

export function HostListItem({ host, selected, onSelect, actions }: Props) {
  return (
    <li>
      <HostContextMenu host={host} actions={actions}>
        <button
          type="button"
          onClick={onSelect}
          onContextMenu={onSelect}
          onDoubleClick={() => actions.connect(host)}
          aria-current={selected}
          className={cn(
            "group flex w-full items-center gap-3 border-b-2 border-ink px-4 py-3 text-left transition-colors",
            selected ? "bg-ink text-paper" : "bg-white hover:bg-yellow/40",
          )}
        >
          <HostAvatar alias={host.alias} className={cn(selected && "border-paper")} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-base leading-tight font-bold">{host.alias}</span>
              {host.readOnly && <Lock className="size-3.5 shrink-0" aria-label="read-only" />}
            </div>
            <div className={cn("truncate font-mono text-xs", selected ? "text-paper/70" : "text-muted-foreground")}>
              {hostTarget(host)}
            </div>
          </div>
        </button>
      </HostContextMenu>
    </li>
  );
}
