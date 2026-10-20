import { Pencil, Plug, SquareTerminal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  canConnect: boolean;
  readOnly: boolean;
  onConnect: () => void;
  onOpenTerminal: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function HostActions({ canConnect, readOnly, onConnect, onOpenTerminal, onEdit, onDelete }: Props) {
  const lockedHint = readOnly ? "Pattern hosts are read-only — edit ~/.ssh/config directly" : undefined;
  return (
    <div className="flex flex-wrap gap-3">
      <Button size="lg" onClick={onConnect} disabled={!canConnect}>
        <Plug /> Connect
      </Button>
      <Button size="lg" variant="secondary" onClick={onOpenTerminal}>
        <SquareTerminal /> Terminal
      </Button>
      <div className="flex-1" />
      <Button size="lg" variant="outline" onClick={onEdit} disabled={readOnly} title={lockedHint}>
        <Pencil /> Edit
      </Button>
      <Button size="lg" variant="destructive" onClick={onDelete} disabled={readOnly} title={lockedHint}>
        <Trash2 /> Delete
      </Button>
    </div>
  );
}
