import React, { useEffect, useRef, useState } from "react";
import { WORLD_W, WORLD_H, ZONES } from "../mapLayout";

const MM_W = 220;
const MM_H = Math.round((MM_W * WORLD_H) / WORLD_W);

// Small overview of the whole office: zones, obstacles, other people, you and
// the area currently visible on screen. Click it to walk somewhere.
const MiniMap = ({
  positionRef,
  avatarsRef,
  obstaclesRef,
  viewportRef,
  containerRef,
  onNavigate,
}) => {
  const canvasRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (collapsed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = MM_W * dpr;
    canvas.height = MM_H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const px = (x) => (x / 100) * MM_W;
    const py = (y) => (y / 100) * MM_H;

    const draw = () => {
      ctx.clearRect(0, 0, MM_W, MM_H);
      ctx.fillStyle = "#F8F5FC";
      ctx.fillRect(0, 0, MM_W, MM_H);

      ZONES.forEach((z) => {
        ctx.fillStyle = z.color + "33";
        ctx.strokeStyle = z.color;
        ctx.lineWidth = 1;
        ctx.fillRect(px(z.rect.x), py(z.rect.y), px(z.rect.w), py(z.rect.h));
        ctx.strokeRect(px(z.rect.x), py(z.rect.y), px(z.rect.w), py(z.rect.h));
      });

      ctx.fillStyle = "#9CA3AF";
      (obstaclesRef.current || []).forEach((o) => {
        if (![o.x, o.y, o.width, o.height].every(Number.isFinite)) return;
        ctx.fillRect(px(o.x - o.width / 2), py(o.y - o.height / 2), px(o.width), py(o.height));
      });

      // Area currently on screen
      const vp = viewportRef.current;
      const world = containerRef.current;
      if (vp && world && world.clientWidth) {
        const sx = MM_W / world.clientWidth;
        const sy = MM_H / world.clientHeight;
        ctx.strokeStyle = "#5C0EA4";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(vp.scrollLeft * sx, vp.scrollTop * sy, vp.clientWidth * sx, vp.clientHeight * sy);
      }

      // Other people
      Object.values(avatarsRef.current || {}).forEach((a) => {
        const x = a.targetX ?? a.x;
        const y = a.targetY ?? a.y;
        if (!Number.isFinite(x) || !Number.isFinite(y)) return;
        ctx.beginPath();
        ctx.fillStyle = "#22C55E";
        ctx.arc(px(x), py(y), 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // You
      const me = positionRef.current;
      if (me) {
        ctx.beginPath();
        ctx.fillStyle = "#5E9BFF";
        ctx.arc(px(me.x), py(me.y), 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#1E3A8A";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    draw();
    const id = setInterval(draw, 100);
    return () => clearInterval(id);
  }, [collapsed, positionRef, avatarsRef, obstaclesRef, viewportRef, containerRef]);

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onNavigate?.(x, y);
  };

  return (
    <div
      className="absolute bottom-4 left-4 z-40 rounded-xl bg-white/95 shadow-lg border border-[#CCB4E3] p-2 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-xs font-semibold text-[#450B7B]">Office map</span>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="text-xs text-[#450B7B] hover:underline"
        >
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>
      {!collapsed && (
        <>
          <canvas
            ref={canvasRef}
            onClick={handleClick}
            style={{ width: MM_W, height: MM_H, cursor: "pointer" }}
            className="rounded border border-[#E5DCF0]"
          />
          <div className="flex gap-3 mt-1 px-1 text-[10px] text-gray-600">
            <span className="flex items-center gap-1">
              <i className="inline-block w-2 h-2 rounded-full bg-[#5E9BFF]" /> You
            </span>
            <span className="flex items-center gap-1">
              <i className="inline-block w-2 h-2 rounded-full bg-[#22C55E]" /> Others
            </span>
            <span className="flex items-center gap-1">
              <i className="inline-block w-2.5 h-2 border border-[#5C0EA4]" /> View
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default MiniMap;
