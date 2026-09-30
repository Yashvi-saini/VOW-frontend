import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
export default function RouteWatcher() {
  const location = useLocation();
  const prevRef = useRef(null);

  useEffect(() => {
    if (prevRef.current) {
      try {
        sessionStorage.setItem("lastRoute", prevRef.current);
      } catch (e) {
      }
    }
    prevRef.current = location.pathname;
  }, [location.pathname]);

  return null;
}
