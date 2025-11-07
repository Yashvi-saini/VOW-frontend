// MapContainer.jsx
const MapContainer = ({ children, viewportRef, containerRef, cursorBlocked, handleMapClick, handlePointerMove, handlePointerLeave }) => (
  <div
    ref={viewportRef}
    className="w-full h-screen overflow-auto bg-white hide-scrollbar"
    style={{
      touchAction: "pan-x pan-y",
      WebkitOverflowScrolling: "touch",
      width: "83vw"
    }}
  >
    <div
      id="corridor"
      data-room-id="room-corridor"
      ref={containerRef}
      onClick={handleMapClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-screen bg-white overflow-hidden shadow-md border border-gray-200"
      style={{
        width: 3100,
        height: 2380,
        cursor: cursorBlocked ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </div>
  </div>
);

export default MapContainer;