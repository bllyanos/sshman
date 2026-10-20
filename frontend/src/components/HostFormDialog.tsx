import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Host, HostService } from "@/lib/api";
import { isValid, validateHost, type HostErrors } from "@/lib/validateHost";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HostForm, type HostDraft } from "./HostForm";

const EMPTY: HostDraft = { alias: "", hostName: "", user: "", port: "", identityFile: "", options: [] };

type Props = {
  open: boolean;
  /** Host being edited; null creates a new one. */
  host: Host | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (host: Host) => Promise<void>;
};

const toDraft = (h: Host | null): HostDraft =>
  h ? { ...h, options: h.options.map((o) => ({ ...o })) } : { ...EMPTY, options: [] };

const trimDraft = (d: HostDraft): HostDraft => ({
  alias: d.alias.trim(),
  hostName: d.hostName.trim(),
  user: d.user.trim(),
  port: d.port.trim(),
  identityFile: d.identityFile.trim(),
  options: d.options
    .map((o) => ({ key: o.key.trim(), value: o.value.trim() }))
    .filter((o) => o.key !== "" || o.value !== ""),
});

export function HostFormDialog({ open, host, onOpenChange, onSubmit }: Props) {
  const [draft, setDraft] = useState<HostDraft>(EMPTY);
  const [errors, setErrors] = useState<HostErrors>({});
  const [keys, setKeys] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDraft(toDraft(host));
    setErrors({});
    HostService.ListKeys().then(setKeys, () => setKeys([]));
  }, [open, host]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = trimDraft(draft);
    const found = validateHost(clean);
    setErrors(found);
    if (!isValid(found)) return;
    setSaving(true);
    try {
      await onSubmit(new Host({ ...clean, readOnly: false }));
      onOpenChange(false);
    } catch {
      // the parent reports the error; keep the form open for a retry
    } finally {
      setSaving(false);
    }
  };

  const editing = host !== null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit host" : "New host"}</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {editing ? `changes rewrite only the "${host.alias}" block` : "appended to ~/.ssh/config"}
          </DialogDescription>
        </DialogHeader>
        <form id="host-form" onSubmit={submit} className="min-h-0">
          <ScrollArea className="h-full max-h-[60vh] pr-3">
            <div className="p-1 pb-2">
              <HostForm draft={draft} errors={errors} keys={keys} onChange={setDraft} />
            </div>
          </ScrollArea>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="host-form" disabled={saving}>
            <Save /> {editing ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
