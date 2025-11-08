// src/utils/updateCursorBlocked.js

export function updateCursorBlocked({
  clientX,
  clientY,
  containerRef,
  isColliding,
  setCursorBlocked,
}) {
  const world = containerRef.current;
  if (!world || typeof clientX !== "number" || typeof clientY !== "number") return;

  const rect = world.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  const px = Math.max(0, Math.min((clientX - rect.left) / rect.width, 1));
  const py = Math.max(0, Math.min((clientY - rect.top) / rect.height, 1));
  const tx = px * 100;
  const ty = py * 100;

  const blocked = isColliding(tx, ty);
  setCursorBlocked((prev) => (prev === blocked ? prev : blocked));
}