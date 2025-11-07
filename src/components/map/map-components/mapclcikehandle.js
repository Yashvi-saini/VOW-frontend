// src/utils/mapClickHandler.js

export function createMapClickHandler({
  containerRef,
  moveToTargetRef,
  followCameraRef,
  setClickMarker,
  isColliding,
  findNearestFreePoint,
}) {
  return function handleMapClick(e) {
    if (e.target && typeof e.target.closest === "function") {
      const uiEl = e.target.closest("[data-map-no-move]");
      if (uiEl) return;
    }
    if (e.button && e.button !== 0) return;

    const world = containerRef.current;
    if (!world) return;

    const rect = world.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const px = Math.max(0, Math.min(clickX / rect.width, 1));
    const py = Math.max(0, Math.min(clickY / rect.height, 1));
    const tx = px * 100;
    const ty = py * 100;

    const blocked = isColliding(tx, ty);
    let target = { x: tx, y: ty };

    if (blocked) {
      const nearest = findNearestFreePoint(tx, ty);
      setClickMarker({ x: tx, y: ty, valid: false });
      if (!nearest) {
        moveToTargetRef.current = null;
        return;
      }
      target = nearest;
    } else {
      setClickMarker({ x: tx, y: ty, valid: true });
    }

    moveToTargetRef.current = target;
    followCameraRef.current = true;
  };
}