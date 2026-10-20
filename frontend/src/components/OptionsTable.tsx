import type { Option } from "@/lib/api";

export function OptionsTable({ options }: { options: Option[] }) {
  if (options.length === 0) return null;
  return (
    <section>
      <h3 className="mb-2 text-[11px] font-bold tracking-widest uppercase">Other options</h3>
      <table className="w-full border-2 border-ink bg-white font-mono text-sm">
        <tbody>
          {options.map((o, i) => (
            <tr key={`${o.key}-${i}`} className="border-b-2 border-ink last:border-b-0">
              <th className="w-1/3 border-r-2 border-ink bg-muted px-3 py-2 text-left font-bold">{o.key}</th>
              <td className="px-3 py-2 break-all">{o.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
