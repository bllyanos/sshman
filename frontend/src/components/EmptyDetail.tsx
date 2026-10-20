import { Plus, Server } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyDetail({ onNew, message }: { onNew: () => void; message: string }) {
  return (
    <section className="brutal-box flex flex-1 flex-col items-center justify-center gap-6 bg-white p-10 text-center">
      <div className="flex size-24 rotate-[-6deg] items-center justify-center border-3 border-ink bg-pink shadow-brutal">
        <Server className="size-12" strokeWidth={2.5} />
      </div>
      <div>
        <h2 className="text-3xl font-bold tracking-tight uppercase">{message}</h2>
        <p className="mt-2 font-mono text-sm text-muted-foreground">pick a host on the left or add a new one</p>
      </div>
      <Button size="lg" variant="accent" onClick={onNew}>
        <Plus /> New host
      </Button>
    </section>
  );
}
