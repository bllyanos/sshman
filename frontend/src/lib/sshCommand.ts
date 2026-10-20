import type { HostFields } from "./hostFields";

const PATTERN = /[*?!]/;

/**
 * The alias usable on the ssh command line: the first concrete pattern of
 * the Host line, or null when every pattern is a wildcard (e.g. `Host *`).
 */
export function connectAlias(alias: string): string | null {
  return alias.split(/\s+/).find((p) => p !== "" && !PATTERN.test(p)) ?? null;
}

export function sshCommand(alias: string): string | null {
  const target = connectAlias(alias);
  return target ? `ssh ${target}` : null;
}

/** "user@hostname:port" with missing parts left out. */
export function hostTarget(h: Pick<HostFields, "user" | "hostName" | "port" | "alias">): string {
  const host = h.hostName || connectAlias(h.alias) || h.alias;
  const user = h.user ? `${h.user}@` : "";
  const port = h.port && h.port !== "22" ? `:${h.port}` : "";
  return `${user}${host}${port}`;
}
