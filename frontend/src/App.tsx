import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { HostService, type Host } from "@/lib/api";
import { copyText } from "@/lib/clipboard";
import { errorMessage } from "@/lib/errorMessage";
import { filterHosts } from "@/lib/hostFilter";
import { connectAlias } from "@/lib/sshCommand";
import { useHosts } from "@/hooks/useHosts";
import { useHotkeys } from "@/hooks/useHotkeys";
import { useTerminals } from "@/hooks/useTerminals";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DeleteHostDialog } from "@/components/DeleteHostDialog";
import { EmptyDetail } from "@/components/EmptyDetail";
import { HostDetail } from "@/components/HostDetail";
import { HostFormDialog } from "@/components/HostFormDialog";
import { Sidebar } from "@/components/Sidebar";
import { StatusBar } from "@/components/StatusBar";

type FormState = { open: boolean; host: Host | null };

export default function App() {
  const { hosts, loading, error, create, update, remove } = useHosts();
  const terminals = useTerminals();
  const [query, setQuery] = useState("");
  const [selectedAlias, setSelectedAlias] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ open: false, host: null });
  const [deleting, setDeleting] = useState<string | null>(null);
  const [configPath, setConfigPath] = useState("~/.ssh/config");
  const searchRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(() => filterHosts(hosts, query), [hosts, query]);
  const selected = hosts.find((h) => h.alias === selectedAlias) ?? null;

  useEffect(() => {
    HostService.ConfigPath().then(setConfigPath, () => {});
  }, []);

  // keep a host selected once the list is loaded or after deletions
  useEffect(() => {
    if (!selected && visible.length > 0) setSelectedAlias(visible[0].alias);
  }, [selected, visible]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const openNew = () => setForm({ open: true, host: null });
  useHotkeys({ onFocusSearch: () => searchRef.current?.focus(), onNew: openNew });

  const run = async (action: () => Promise<unknown>, success?: string) => {
    try {
      await action();
      if (success) toast.success(success);
    } catch (err) {
      toast.error(errorMessage(err));
      throw err;
    }
  };

  const connect = (h: Host) => {
    const alias = connectAlias(h.alias);
    if (!alias) return;
    run(async () => {
      const used = await terminals.connect(alias);
      toast.success(`ssh ${alias} → ${used}`);
    }).catch(() => {});
  };

  const openShell = () =>
    run(async () => {
      const used = await terminals.openShell();
      toast.success(`opened ${used}`);
    }).catch(() => {});

  const copy = (command: string) => run(() => copyText(command), "copied to clipboard").catch(() => {});

  const submitForm = async (h: Host) => {
    const editing = form.host;
    await run(
      () => (editing ? update(editing.alias, h) : create(h)),
      editing ? `saved ${h.alias}` : `created ${h.alias}`,
    );
    setSelectedAlias(h.alias);
  };

  const confirmDelete = (alias: string) => {
    run(() => remove(alias), `deleted ${alias} — backup in config.bak`)
      .then(() => setSelectedAlias(null))
      .catch(() => {});
    setDeleting(null);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const i = visible.findIndex((h) => h.alias === selectedAlias);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = visible[Math.min(Math.max(i + (e.key === "ArrowDown" ? 1 : -1), 0), visible.length - 1)];
      if (next) setSelectedAlias(next.alias);
    } else if (e.key === "Enter" && selected) {
      connect(selected);
    } else if (e.key === "Escape") {
      setQuery("");
      e.currentTarget.blur();
    }
  };

  return (
    <TooltipProvider>
      <div className="dot-grid flex h-full flex-col">
        <main className="flex min-h-0 flex-1 gap-5 p-5">
          <Sidebar
            ref={searchRef}
            hosts={visible}
            total={hosts.length}
            query={query}
            onQueryChange={setQuery}
            onSearchKeyDown={onSearchKeyDown}
            selectedAlias={selectedAlias}
            onSelect={setSelectedAlias}
            onConnect={connect}
            onNew={openNew}
          />
          {selected ? (
            <HostDetail
              host={selected}
              onConnect={() => connect(selected)}
              onOpenTerminal={openShell}
              onCopy={copy}
              onEdit={() => setForm({ open: true, host: selected })}
              onDelete={() => setDeleting(selected.alias)}
            />
          ) : (
            <EmptyDetail onNew={openNew} message={loading ? "loading…" : "no host selected"} />
          )}
        </main>
        <StatusBar
          configPath={configPath}
          terminals={terminals.available}
          activeTerminal={terminals.active}
          onTerminalChange={terminals.setPreferred}
        />
      </div>
      <HostFormDialog
        open={form.open}
        host={form.host}
        onOpenChange={(open) => setForm((f) => ({ ...f, open }))}
        onSubmit={submitForm}
      />
      <DeleteHostDialog alias={deleting} onOpenChange={(o) => !o && setDeleting(null)} onConfirm={confirmDelete} />
      <Toaster position="bottom-right" />
    </TooltipProvider>
  );
}
