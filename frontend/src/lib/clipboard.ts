import { Clipboard } from "@wailsio/runtime";

export async function copyText(text: string): Promise<void> {
  try {
    await Clipboard.SetText(text);
  } catch {
    await navigator.clipboard.writeText(text);
  }
}
