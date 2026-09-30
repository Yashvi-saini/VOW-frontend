import { useEffect } from "react";
export default function useAutoResize(ref, value, maxPx = 160) {
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, maxPx);
    el.style.height = `${next}px`;
  }, [ref, value, maxPx]);
}
