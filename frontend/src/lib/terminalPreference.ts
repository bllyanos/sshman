const KEY = "sshman.terminal";

/** Preferred emulator name; "" means let the backend choose. */
export function loadTerminalPreference(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveTerminalPreference(name: string): void {
  try {
    localStorage.setItem(KEY, name);
  } catch {
    // storage unavailable: the choice just won't persist
  }
}
