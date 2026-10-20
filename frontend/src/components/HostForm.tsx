import type { Option } from "@/lib/api";
import type { HostErrors } from "@/lib/validateHost";
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";
import { OptionsEditor } from "./OptionsEditor";

export type HostDraft = {
  alias: string;
  hostName: string;
  user: string;
  port: string;
  identityFile: string;
  options: Option[];
};

type Props = {
  draft: HostDraft;
  errors: HostErrors;
  keys: string[];
  onChange: (draft: HostDraft) => void;
};

export function HostForm({ draft, errors, keys, onChange }: Props) {
  const field = (name: keyof Omit<HostDraft, "options">) => ({
    id: `host-${name}`,
    value: draft[name],
    "aria-invalid": Boolean(errors[name]) || undefined,
    spellCheck: false,
    autoComplete: "off",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...draft, [name]: e.target.value }),
  });

  return (
    <div className="grid grid-cols-6 gap-4">
      <FormField id="host-alias" label="Alias" error={errors.alias} hint="used as: ssh <alias>" className="col-span-6">
        <Input {...field("alias")} placeholder="my-server" autoFocus />
      </FormField>
      <FormField id="host-hostName" label="Hostname" error={errors.hostName} className="col-span-4">
        <Input {...field("hostName")} placeholder="203.0.113.10" />
      </FormField>
      <FormField id="host-port" label="Port" error={errors.port} className="col-span-2">
        <Input {...field("port")} placeholder="22" inputMode="numeric" />
      </FormField>
      <FormField id="host-user" label="User" error={errors.user} className="col-span-6">
        <Input {...field("user")} placeholder="root" />
      </FormField>
      <FormField id="host-identityFile" label="Identity file" error={errors.identityFile} className="col-span-6">
        <Input {...field("identityFile")} placeholder="~/.ssh/id_ed25519" list="ssh-keys" />
        <datalist id="ssh-keys">
          {keys.map((k) => (
            <option key={k} value={k} />
          ))}
        </datalist>
      </FormField>
      <div className="col-span-6">
        <OptionsEditor
          options={draft.options}
          onChange={(options) => onChange({ ...draft, options })}
          error={errors.options}
        />
      </div>
    </div>
  );
}
