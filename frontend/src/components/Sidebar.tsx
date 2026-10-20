import { forwardRef } from "react";
import { Plus } from "lucide-react";
import type { Host } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { HostList } from "./HostList";
import { SearchBar } from "./SearchBar";

type Props = {
  hosts: Host[];
  total: number;
  query: string;
  onQueryChange: (q: string) => void;
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  selectedAlias: string | null;
  onSelect: (alias: string) => void;
  onConnect: (host: Host) => void;
  onNew: () => void;
};

export const Sidebar = forwardRef<HTMLInputElement, Props>(function Sidebar(props, searchRef) {
  const { hosts, total, query, onNew } = props;
  return (
    <aside className="brutal-box flex w-[340px] shrink-0 flex-col bg-white">
      <header className="flex items-end justify-between gap-3 border-b-3 border-ink bg-yellow px-4 pt-4 pb-3">
        <div>
          <h1 className="text-4xl leading-none font-bold tracking-tighter">
            SSH<span className="text-pink [-webkit-text-stroke:1.5px_var(--ink)]">/</span>MAN
          </h1>
          <p className="mt-1 font-mono text-[11px] font-bold uppercase">
            {total} host{total === 1 ? "" : "s"} configured
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={onNew} title="New host (Ctrl+N)">
          <Plus /> New
        </Button>
      </header>
      <div className="border-b-2 border-ink p-3">
        <SearchBar ref={searchRef} value={query} onChange={props.onQueryChange} onKeyDown={props.onSearchKeyDown} />
      </div>
      <HostList
        hosts={hosts}
        selectedAlias={props.selectedAlias}
        onSelect={props.onSelect}
        onConnect={props.onConnect}
        emptyText={query ? `no host matches “${query}”` : "no hosts yet — press NEW"}
      />
    </aside>
  );
});
