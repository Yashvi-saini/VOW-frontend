const ClickMarker = ({ clickMarker }) => {
  if (!clickMarker) return null;

  const valid = clickMarker.valid !== false;
  const ringClass = valid ? "bg-blue-400 opacity-50" : "bg-red-500 opacity-60";
  const coreClass = valid ? "bg-blue-600" : "bg-red-600";

  return (
    <div
      style={{
        position: "absolute",
        top: `${clickMarker.y}%`,
        left: `${clickMarker.x}%`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    >
      <span className={`absolute inline-flex h-8 w-8 rounded-full ${ringClass} animate-ping`} />
      <span className={`relative inline-flex rounded-full h-3 w-3 ${coreClass} shadow`} />
      {!valid && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-red-800">X</span>
      )}
    </div>
  );
};

export default ClickMarker;