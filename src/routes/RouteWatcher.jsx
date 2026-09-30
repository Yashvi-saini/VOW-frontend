import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Stores the previous path in sessionStorage as 'lastRoute'.
// Example: when navigating from '/dashboard' -> '/map', lastRoute will be '/dashboard'.
export default function RouteWatcher() {
  const location = useLocation();
  const prevRef = useRef(null);

  useEffect(() => {
    // store previous pathname (if any)
    if (prevRef.current) {
      try {
        sessionStorage.setItem("lastRoute", prevRef.current);
      } catch (e) {
        // ignore storage exceptions
      }
    }
    prevRef.current = location.pathname;
  }, [location.pathname]);

  return null;
}
