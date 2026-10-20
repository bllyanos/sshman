import { useCallback, useEffect, useState } from "react";
import { HostService, type Host } from "@/lib/api";
import { errorMessage } from "@/lib/errorMessage";

export function useHosts() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setHosts(await HostService.ListHosts());
      setError(null);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    // pick up edits made to the file while sshman was in the background
    window.addEventListener("focus", reload);
    return () => window.removeEventListener("focus", reload);
  }, [reload]);

  const create = useCallback(
    async (h: Host) => {
      await HostService.CreateHost(h);
      await reload();
    },
    [reload],
  );

  const update = useCallback(
    async (alias: string, h: Host) => {
      await HostService.UpdateHost(alias, h);
      await reload();
    },
    [reload],
  );

  const remove = useCallback(
    async (alias: string) => {
      await HostService.DeleteHost(alias);
      await reload();
    },
    [reload],
  );

  return { hosts, loading, error, reload, create, update, remove };
}
