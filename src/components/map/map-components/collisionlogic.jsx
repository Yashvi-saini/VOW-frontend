// utils/collision.js

export function createCollisionChecker({
  containerRef,
  obstaclesRef,
  avatarSize,
  COLLISION_EPS = 0.5
}) {
  return function isColliding(newX, newY, eps = COLLISION_EPS) {
    if (!containerRef.current) return false;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const avatarWidthPercent = (avatarSize / containerWidth) * 100;
    const avatarHeightPercent = (avatarSize / containerHeight) * 100;

    return obstaclesRef.current.some((obs) => {
      if (
        !Number.isFinite(obs.x) ||
        !Number.isFinite(obs.y) ||
        !Number.isFinite(obs.width) ||
        !Number.isFinite(obs.height) ||
        obs.width <= 0 ||
        obs.height <= 0
      ) return false;

      const avatarLeft = newX - avatarWidthPercent / 2;
      const avatarRight = newX + avatarWidthPercent / 2;
      const avatarTop = newY - avatarHeightPercent / 2;
      const avatarBottom = newY + avatarHeightPercent / 2;

      const obsLeft = obs.x - obs.width / 2 - eps;
      const obsRight = obs.x + obs.width / 2 + eps;
      const obsTop = obs.y - obs.height / 2 - eps;
      const obsBottom = obs.y + obs.height / 2 + eps;

      return (
        avatarRight > obsLeft &&
        avatarLeft < obsRight &&
        avatarBottom > obsTop &&
        avatarTop < obsBottom
      );
    });
  };
}