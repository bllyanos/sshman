import { useEffect, useRef } from "react";

type Handlers = {
  onFocusSearch: () => void;
  onNew: () => void;
};

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

/** "/" focuses search, Ctrl/Cmd+N opens the new host form. */
export function useHotkeys(handlers: Handlers) {
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector("[role=dialog], [role=alertdialog]")) return;
      if (e.key === "/" && !isTyping(e.target)) {
        e.preventDefault();
        ref.current.onFocusSearch();
      } else if (e.key.toLowerCase() === "n" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        ref.current.onNew();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
