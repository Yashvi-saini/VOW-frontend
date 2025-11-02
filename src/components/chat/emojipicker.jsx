// src/components/chat/emojipicker.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import emoji from "../../assets/emoji.svg";

const EmojiSelector = ({ onSelect, icon = emoji, boundaryRef = null }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [dragging, setDragging] = useState(false);

  const pickerRef = useRef(null);
  const triggerRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  const posRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef(null);
  const startPointer = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const activePointerId = useRef(null);

  // Dimensions of the picker panel
  const pickerWidth = 350;
  const pickerHeight = 320; // includes drag bar + content
  const dragBarHeight = 28;

  // Resolve boundary element: boundaryRef -> nearest positioned ancestor -> document.body
  const getBoundaryEl = () => {
    if (boundaryRef && boundaryRef.current) return boundaryRef.current;
    if (pickerRef.current && pickerRef.current.offsetParent)
      return pickerRef.current.offsetParent;
    return document.body;
  };

  const clampToBounds = (x, y) => {
    const boundary = getBoundaryEl();
    const rect = boundary.getBoundingClientRect();
    const maxX = Math.max(0, rect.width - pickerWidth);
    const maxY = Math.max(0, rect.height - pickerHeight);
    return {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(0, y), maxY),
    };
  };

  // Keep latest onSelect without forcing re-render
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Helper: apply current transform imperatively
  const applyTransform = () => {
    if (pickerRef.current) {
      const { x, y } = posRef.current;
      pickerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  };

  // Place the picker near the trigger when opening
  useEffect(() => {
    if (!showPicker || !triggerRef.current) return;
    const boundary = getBoundaryEl();
    const boundaryRect = boundary.getBoundingClientRect();
    const triggerRect = triggerRef.current.getBoundingClientRect();

    // Try to open above the trigger; fallback below if not enough space
    let targetX = triggerRect.left - boundaryRect.left;
    let targetY = triggerRect.top - boundaryRect.top - pickerHeight - 8;

    const clamped = clampToBounds(targetX, targetY);
    posRef.current = clamped;
    // defer to next frame to ensure element is mounted
    requestAnimationFrame(applyTransform);
  }, [showPicker]);

  // Keep the picker inside bounds on resize
  useEffect(() => {
    const onResize = () => {
      posRef.current = clampToBounds(posRef.current.x, posRef.current.y);
      applyTransform();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
  if (!showPicker) return;

  const handleClickOutside = (e) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(e.target) &&
      triggerRef.current &&
      !triggerRef.current.contains(e.target)
    ) {
      setShowPicker(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [showPicker]);


  const onPointerDown = (e) => {
    // Only primary button
    if (e.button !== 0) return;
    setDragging(true);
    activePointerId.current = e.pointerId;
    startPointer.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...posRef.current };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    e.preventDefault();
    e.stopPropagation();
  };

  const onPointerMove = (e) => {
    if (!dragging || activePointerId.current !== e.pointerId) return;
    const dx = e.clientX - startPointer.current.x;
    const dy = e.clientY - startPointer.current.y;
    const next = clampToBounds(startPos.current.x + dx, startPos.current.y + dy);
    posRef.current = next;
    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        applyTransform();
      });
    }
  };

  const endDrag = (e) => {
    if (activePointerId.current !== null) {
      try {
        e?.currentTarget?.releasePointerCapture?.(activePointerId.current);
      } catch {}
    }
    activePointerId.current = null;
    setDragging(false);
  };

  return (
    <div className="select-none inline-flex items-center gap-2">
      {/* Emoji icon (trigger) */}
      <img
        ref={triggerRef}
        src={icon}
        alt="emoji"
        className="cursor-pointer"
        onClick={() => setShowPicker((prev) => !prev)}
      />

      {/* Picker panel */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute z-50 bg-white rounded-xl shadow-xl border border-gray-200 will-change-transform"
          style={{
            left: 0,
            top: 0,
            width: `${pickerWidth}px`,
            height: `${pickerHeight}px`,
            // transform is applied imperatively for smooth dragging
            transition: dragging ? "none" : "transform 120ms ease-out",
          }}
        >
          {/* Drag handle */}
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="w-full h-7 bg-gray-100 cursor-grab active:cursor-grabbing rounded-t-xl flex items-center justify-center text-xs text-gray-500 select-none"
          >
            Drag me
          </div>

          <EmojiPicker
            onEmojiClick={(emojiData) => {
              onSelectRef.current?.(emojiData.emoji);
            
            }}
            previewConfig={{ showPreview: false }}
            width="100%"
            height={`calc(100% - ${dragBarHeight}px)`}
            emojiStyle="native"
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(EmojiSelector, (prev, next) => {
  // Ignore onSelect identity; compare other props for shallow equality
  return prev.icon === next.icon && prev.boundaryRef === next.boundaryRef;
});
