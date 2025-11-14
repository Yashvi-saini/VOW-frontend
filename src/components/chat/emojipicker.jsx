import React, { useEffect, useRef, useState } from "react";
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
  const pickerHeight = 320;
  const dragBarHeight = 28;

  // Smooth clamping function with viewport boundaries
  const clampToViewport = (x, y) => {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
    const maxX = Math.max(0, vw - pickerWidth - 16);
    const maxY = Math.max(0, vh - pickerHeight - 16);
    
    return {
      x: Math.min(Math.max(16, x), maxX),
      y: Math.min(Math.max(16, y), maxY)
    };
  };

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const applyTransform = () => {
    if (pickerRef.current) {
      const { x, y } = posRef.current;
      pickerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  };

  // Position picker relative to trigger with smart placement
  useEffect(() => {
    if (!showPicker || !triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    
    // Calculate initial position - try to place above trigger first
    let targetX = triggerRect.left + (triggerRect.width / 2) - (pickerWidth / 2);
    let targetY = triggerRect.top - pickerHeight - 8;

    // If not enough space above, place below
    if (targetY < 16) {
      targetY = triggerRect.bottom + 8;
    }

    // If not enough space on left/right, adjust
    if (targetX < 16) {
      targetX = 16;
    }

    const clamped = clampToViewport(targetX, targetY);
    posRef.current = clamped;
    
    requestAnimationFrame(() => {
      applyTransform();
    });

    // Reposition on window resize
    const handleResize = () => {
      posRef.current = clampToViewport(posRef.current.x, posRef.current.y);
      applyTransform();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showPicker]);

  // Close picker when clicking outside
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

    // Use a slight delay to avoid immediate closure
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showPicker]);

  // Drag handlers with improved performance
  const onPointerDown = (e) => {
    // Only primary button for mouse
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    setDragging(true);
    activePointerId.current = e.pointerId;
    startPointer.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...posRef.current };
    
    e.preventDefault();
    e.stopPropagation();
    
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      // Silent fail
    }
  };

  const onPointerMove = (e) => {
    if (!dragging || activePointerId.current !== e.pointerId) return;
    
    e.preventDefault();
    
    const dx = e.clientX - startPointer.current.x;
    const dy = e.clientY - startPointer.current.y;
    
    const newX = startPos.current.x + dx;
    const newY = startPos.current.y + dy;
    
    const clamped = clampToViewport(newX, newY);
    posRef.current = clamped;
    
    // Use RAF for smooth dragging
    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        applyTransform();
      });
    }
  };

  const endDrag = (e) => {
    if (!dragging) return;
    
    if (activePointerId.current !== null) {
      try {
        e.currentTarget?.releasePointerCapture?.(activePointerId.current);
      } catch (err) {
        // Silent fail
      }
    }
    
    activePointerId.current = null;
    setDragging(false);
    
    // Cancel any pending RAF
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emojiData) => {
    onSelectRef.current?.(emojiData.emoji);
    setShowPicker(false);
  };

  // Handle trigger click with better event handling
  const handleTriggerClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowPicker(prev => !prev);
  };

  return (
    <div className="select-none inline-flex items-center gap-2 relative">
      <img
        ref={triggerRef}
        src={icon}
        alt="emoji"
        className="cursor-pointer hover:scale-110 transition-transform duration-150"
        onClick={handleTriggerClick}
        onTouchEnd={handleTriggerClick}
      />
      
      {showPicker && (
        <div
          ref={pickerRef}
          className="fixed z-[9999] bg-white rounded-xl shadow-2xl border border-gray-300 will-change-transform"
          style={{
            width: `${pickerWidth}px`,
            height: `${pickerHeight}px`,
            // Smooth transitions only when not dragging
            transition: dragging ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease-out',
            // Better mobile handling
            touchAction: 'none',
            // Initial position off-screen to avoid flash
            left: '0px',
            top: '0px',
            // Subtle scale animation when opening
            transform: `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) scale(${dragging ? 1 : 1})`,
            opacity: showPicker ? 1 : 0,
          }}
        >
          {/* Drag handle with better visual feedback */}
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onTouchStart={(e) => e.preventDefault()}
            className={`w-full h-7 cursor-grab rounded-t-xl flex items-center justify-center text-xs select-none transition-colors ${
              dragging 
                ? 'bg-gray-300 cursor-grabbing shadow-inner' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            style={{
              touchAction: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            <span className="text-gray-600 font-medium">Drag me</span>
          </div>

          {/* Emoji Picker */}
          <div className="emoji-picker-container">
            <EmojiPicker
              onEmojiClick={handleEmojiSelect}
              previewConfig={{ showPreview: false }}
              width="100%"
              height={`${pickerHeight - dragBarHeight}px`}
              emojiStyle="native"
              lazyLoadEmojis={true}
              skinTonesDisabled={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(EmojiSelector, (prev, next) => {
  return prev.icon === next.icon && prev.boundaryRef === next.boundaryRef;
});