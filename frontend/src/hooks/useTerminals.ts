import { useCallback, useEffect, useState } from "react";
import { TerminalService } from "@/lib/api";
import { loadTerminalPreference, saveTerminalPreference } from "@/lib/terminalPreference";

export function useTerminals() {
  const [available, setAvailable] = useState<string[]>([]);
  const [preferred, setPreferredState] = useState(loadTerminalPreference);

  useEffect(() => {
    TerminalService.AvailableTerminals().then(setAvailable, () => setAvailable([]));
  }, []);

  const setPreferred = useCallback((name: string) => {
    setPreferredState(name);
    saveTerminalPreference(name);
  }, []);

  // a remembered emulator that was uninstalled falls back to the default
  const active = available.includes(preferred) ? preferred : (available[0] ?? "");

  const connect = useCallback((alias: string) => TerminalService.Connect(alias, active), [active]);
  const openShell = useCallback(() => TerminalService.OpenTerminal(active), [active]);

  return { available, active, setPreferred, connect, openShell };
}
