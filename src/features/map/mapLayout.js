export const WORLD_W = 3100;
export const WORLD_H = 2380;

const pct = (px, total) => (px / total) * 100;
const rectZone = (id, label, color, x, y, w, h) => ({
  id,
  label,
  color,
  rect: {
    x: pct(x, WORLD_W),
    y: pct(y, WORLD_H),
    w: pct(w, WORLD_W),
    h: pct(h, WORLD_H),
  },
  center: { x: pct(x + w / 2, WORLD_W), y: pct(y + h / 2, WORLD_H) },
});

export const ZONES = [
  rectZone("manager", "Manager Cabin", "#8B5CF6", 2620, 212, 323, 240),
  rectZone("supervisor", "Supervisor Cabin", "#EC4899", 2639, 1620, 323, 240),
  rectZone("gaming", "Gaming Room", "#F59E0B", 2639, 1890, 323, 240),
  rectZone("private", "Private Room", "#10B981", 920, 1895, 1040, 240),
  rectZone("welcome", "Welcome Zone", "#3B82F6", 920, 1550, 1040, 240),
  rectZone("cabin", "Main Cabin", "#6366F1", 0.482 * WORLD_W - 644, 0.33 * WORLD_H - 575, 1288, 1150),
  rectZone("tableA", "Meeting Table A", "#14B8A6", 0.125 * WORLD_W - 225, 0.215 * WORLD_H - 150, 450, 300),
  rectZone("tableB", "Meeting Table B", "#14B8A6", 0.85 * WORLD_W - 225, 0.5 * WORLD_H - 150, 450, 300),
  rectZone("bigtable", "Big Table", "#0EA5E9", 0.105 * WORLD_W - 150, 0.76 * WORLD_H - 215, 300, 430),
];

export const TELEPORT_PADS = [
  { x: 2300, y: 290 },
  { x: 2100, y: 1650 },
  { x: 350, y: 1090 },
];

export const zoneAt = (x, y) => {
  let best = null;
  let bestArea = Infinity;
  for (const z of ZONES) {
    const { x: rx, y: ry, w, h } = z.rect;
    if (x >= rx && x <= rx + w && y >= ry && y <= ry + h && w * h < bestArea) {
      best = z;
      bestArea = w * h;
    }
  }
  return best;
};
