// src/hooks/useMovementKeys.js
import { useEffect } from "react";

export function useMovementKeys({ keysPressedRef, followCameraRef }) {
  useEffect(() => {
    const isMoveKey = (k) =>
      [
        "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
        "w", "a", "s", "d", "W", "A", "S", "D",
      ].includes(k);

    const down = (e) => {
      if (isMoveKey(e.key)) {
        e.preventDefault();
        followCameraRef.current = true;
      }
      keysPressedRef.current[e.key] = true;
    };

    const up = (e) => {
      if (isMoveKey(e.key)) e.preventDefault();
      keysPressedRef.current[e.key] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
}