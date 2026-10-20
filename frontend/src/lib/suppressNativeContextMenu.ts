// Hides WebKit's native right-click menu (Reload, Inspect Element, ...)
// everywhere. Wails' own `--default-contextmenu: hide` is ignored in debug
// builds, so we do it ourselves. The listener sits on window in the bubble
// phase, so it runs after React handlers: Radix context menus still open
// because they check `defaultPrevented` before we set it.
export function suppressNativeContextMenu(target: Window = window): () => void {
  const block = (event: Event) => event.preventDefault();
  target.addEventListener("contextmenu", block);
  return () => target.removeEventListener("contextmenu", block);
}
