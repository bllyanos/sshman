import type { HostFields } from "./hostFields";

/** Every whitespace-separated term must appear in alias, hostname or user. */
export function filterHosts<T extends Pick<HostFields, "alias" | "hostName" | "user">>(
  hosts: T[],
  query: string,
): T[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return hosts;
  return hosts.filter((h) => {
    const haystack = `${h.alias} ${h.hostName} ${h.user}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}
