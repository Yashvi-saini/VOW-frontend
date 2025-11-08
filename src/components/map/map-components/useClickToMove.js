// Hook factory for click-to-move behavior
export function useClickToMove({
  containerRef,
  isColliding,
  findNearestFreePoint,
  setClickMarker,
  moveToTargetRef,
  followCameraRef,
}) {
  const handleMapClick = (e) => {
    if (e.target && typeof e.target.closest === "function") {
      const uiEl = e.target.closest("[data-map-no-move]");
      if (uiEl) return;
    }
    if (e.button && e.button !== 0) return; // only left click
    const world = containerRef.current; if (!world) return;
    const rect = world.getBoundingClientRect();
    const px = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
    const py = Math.max(0, Math.min((e.clientY - rect.top) / rect.height, 1));
    const tx = px * 100; const ty = py * 100;
    const blocked = isColliding(tx, ty); let target = { x: tx, y: ty };
    if (blocked) {
      const nearest = findNearestFreePoint(tx, ty);
      setClickMarker({ x: tx, y: ty, valid: false });
      if (!nearest) { moveToTargetRef.current = null; return; }
      target = nearest;
    } else {
      setClickMarker({ x: tx, y: ty, valid: true });
    }
    moveToTargetRef.current = target; followCameraRef.current = true;
  };
  return handleMapClick;
}
