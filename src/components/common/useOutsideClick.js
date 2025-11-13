import { useEffect } from "react";

export default function useOutsideClick(ref, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        handler(e);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [ref, handler, enabled]);
}
