// Adapter over the generated Wails bindings: the rest of the UI depends on
// these types only, so binding generator modes (class vs interface, nullable
// slices) never leak into components.
import * as HostBindings from "../../bindings/sshman/services/hostservice";
import * as TerminalBindings from "../../bindings/sshman/services/terminalservice";
import type { Host as RawHost } from "../../bindings/sshman/internal/sshconfig/models";

export type Option = { key: string; value: string };
export type Host = Omit<RawHost, "options"> & { options: Option[] };

const toHost = (h: RawHost): Host => ({ ...h, options: h.options ?? [] });

export const HostService = {
  ConfigPath: () => HostBindings.ConfigPath(),
  ListHosts: async (): Promise<Host[]> => ((await HostBindings.ListHosts()) ?? []).map(toHost),
  ListKeys: async (): Promise<string[]> => (await HostBindings.ListKeys()) ?? [],
  CreateHost: (h: Host) => HostBindings.CreateHost(h),
  UpdateHost: (alias: string, h: Host) => HostBindings.UpdateHost(alias, h),
  DeleteHost: (alias: string) => HostBindings.DeleteHost(alias),
};

export const TerminalService = {
  AvailableTerminals: async (): Promise<string[]> => (await TerminalBindings.AvailableTerminals()) ?? [],
  Connect: (alias: string, preferred: string) => TerminalBindings.Connect(alias, preferred),
  OpenTerminal: (preferred: string) => TerminalBindings.OpenTerminal(preferred),
  SSHClient: async (preferred: string): Promise<string> =>
    ((await TerminalBindings.SSHClient(preferred)) ?? ["ssh"]).join(" "),
};
