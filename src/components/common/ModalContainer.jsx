import React from "react";

export default function ModalContainer({ children, onClose, widthClass = "w-[640px] max-w-[92vw]" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative ${widthClass} rounded-2xl bg-white shadow-2xl border border-[#E5E7EB] max-h-[90vh] overflow-y-auto`}>
        {children}
      </div>
    </div>
  );
}
