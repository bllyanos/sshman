import { Lock } from "lucide-react";
import { cn } from "cn";
import type { Host } from "@/lib/api";
import { hostColor } from "@/lib/hostColor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CommandBox } from "./CommandBox";
import { FieldCard } from "./FieldCard";
import { HostActions } from "./HostActions";
import { OptionsTable } from "./OptionsTable";

type Props = {
  host: Host;
  /** The ssh command shown and copied, or null for pattern hosts. */
  command: string | null;
  onConnect: () => void;
  onOpenTerminal: () => void;
  onCopy: (command: string) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function HostDetail({ host, command, onConnect, onOpenTerminal, onCopy, onEdit, onDelete }: Props) {
  return (
    <section className="brutal-box @container flex min-w-0 flex-1 flex-col bg-paper">
      <header className={cn("border-b-3 border-ink px-5 pt-5 pb-5 @2xl:px-8 @2xl:pt-7 @2xl:pb-6", hostColor(host.alias))}>
        <div className="mb-3 flex gap-2">
          <Badge variant="outline">host</Badge>
          {host.readOnly && (
            <Badge variant="outline">
              <Lock /> pattern · read-only
            </Badge>
          )}
        </div>
        <h2 className="text-4xl leading-[0.95] font-bold tracking-tighter break-all @2xl:text-5xl">{host.alias}</h2>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-6 p-5 @2xl:gap-7 @2xl:p-8">
          {command && <CommandBox command={command} onCopy={() => onCopy(command)} />}

          <HostActions
            canConnect={command !== null}
            readOnly={host.readOnly}
            onConnect={onConnect}
            onOpenTerminal={onOpenTerminal}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          <div className="grid grid-cols-2 gap-3 @2xl:gap-4">
            <FieldCard
              label="Hostname"
              value={host.hostName}
              placeholder="same as alias"
              className="col-span-2 @3xl:col-span-1"
            />
            <FieldCard label="User" value={host.user} placeholder="current user" />
            <FieldCard label="Port" value={host.port} placeholder="22" />
            <FieldCard
              label="Identity file"
              value={host.identityFile}
              placeholder="ssh default"
              className="col-span-2 @3xl:col-span-1"
            />
          </div>

          <OptionsTable options={host.options} />
        </div>
      </ScrollArea>
    </section>
  );
}
