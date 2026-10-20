import type { HostFields } from "./hostFields";

export type HostErrors = Partial<Record<"alias" | "hostName" | "user" | "port" | "identityFile" | "options", string>>;

const MODELED = ["hostname", "user", "port", "identityfile", "host", "match"];
const hasSpace = (s: string) => /\s/.test(s);

/** Mirrors sshconfig.Host.Validate in Go so errors show before saving. */
export function validateHost(h: Omit<HostFields, "readOnly">): HostErrors {
  const errors: HostErrors = {};
  if (!h.alias) errors.alias = "Alias is required";
  else if (hasSpace(h.alias) || /[*?!,]/.test(h.alias)) errors.alias = "No spaces or wildcards";

  if (hasSpace(h.hostName)) errors.hostName = "No spaces";
  if (hasSpace(h.user)) errors.user = "No spaces";
  if (h.port) {
    const p = Number(h.port);
    if (!/^\d+$/.test(h.port) || p < 1 || p > 65535) errors.port = "1 – 65535";
  }
  if (/["\r\n]/.test(h.identityFile)) errors.identityFile = "Invalid path";

  for (const o of h.options) {
    if (!o.key || hasSpace(o.key) || o.key.includes("=")) {
      errors.options = `Invalid option key "${o.key}"`;
    } else if (MODELED.includes(o.key.toLowerCase())) {
      errors.options = `Use the ${o.key} field instead`;
    } else if (/[\r\n]/.test(o.value)) {
      errors.options = `${o.key} must be one line`;
    }
    if (errors.options) break;
  }
  return errors;
}

export const isValid = (e: HostErrors) => Object.keys(e).length === 0;
