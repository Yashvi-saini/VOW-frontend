// src/utils/findNearestFreePoint.js

export function findNearestFreePointFactory(isColliding) {
  return function findNearestFreePoint(x, y) {
    if (!isColliding(x, y)) return { x, y };

    const clamp01 = (v) => Math.max(0, Math.min(100, v));
    const maxRadius = 12; // percent
    const step = 0.6;     // radial step in percent
    const samples = 24;   // angular samples per ring

    let best = null;
    let bestDist2 = Infinity;

    for (let r = step; r <= maxRadius; r += step) {
      for (let i = 0; i < samples; i++) {
        const theta = (i / samples) * Math.PI * 2;
        const cx = clamp01(x + r * Math.cos(theta));
        const cy = clamp01(y + r * Math.sin(theta));

        if (!isColliding(cx, cy)) {
          const dx = cx - x;
          const dy = cy - y;
          const d2 = dx * dx + dy * dy;

          if (d2 < bestDist2) {
            bestDist2 = d2;
            best = { x: cx, y: cy };
          }
        }
      }
      if (best) break; // earliest ring win = nearest
    }

    return best;
  };
}