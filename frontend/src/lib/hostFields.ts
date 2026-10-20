/** The subset of a Host that the UI reads; keeps helpers free of bindings. */
export interface HostFields {
  alias: string;
  hostName: string;
  user: string;
  port: string;
  identityFile: string;
  options: { key: string; value: string }[];
  readOnly: boolean;
}
