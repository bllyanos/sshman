import { Copy, Pencil, Plug, Trash2 } from "lucide-react";
import type { Host } from "@/lib/api";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export type HostMenuActions = {
  /** The ssh command for the host, or null when it can't be connected to. */
  command: (host: Host) => string | null;
  connect: (host: Host) => void;
  copy: (command: string) => void;
  edit: (host: Host) => void;
  remove: (host: Host) => void;
};

type Props = {
  host: Host;
  actions: HostMenuActions;
  children: React.ReactNode;
};

/** Right-click menu for a host; read-only hosts get edit/delete disabled. */
export function HostContextMenu({ host, actions, children }: Props) {
  const command = actions.command(host);
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>{host.alias}</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem disabled={!command} onSelect={() => actions.connect(host)}>
          <Plug /> Connect <ContextMenuShortcut>dbl-click</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled={!command} onSelect={() => command && actions.copy(command)}>
          <Copy /> Copy ssh command
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled={host.readOnly} onSelect={() => actions.edit(host)}>
          <Pencil /> Edit
        </ContextMenuItem>
        <ContextMenuItem variant="destructive" disabled={host.readOnly} onSelect={() => actions.remove(host)}>
          <Trash2 /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
