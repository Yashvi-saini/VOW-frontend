import React from 'react';

// Responsive layout shell for chat views with a collapsible sidebar on mobile
export default function ChatLayout({ sidebar, children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex h-screen w-screen bg-[#F3F3F6] text-[#0E1219]">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-200 md:static md:translate-x-0 md:w-72 md:h-full bg-white/0 ${open ? 'translate-x-0' : '-translate-x-full'} md:bg-transparent`}>
        <div className="h-full shadow-none md:shadow-none">
          {sidebar}
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col relative min-h-0 min-w-0">
        {/* Mobile topbar toggle */}
        <div className="md:hidden absolute top-2 left-2 z-10">
          <button
            onClick={() => setOpen(o => !o)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-white/90 shadow"
            aria-label="Toggle sidebar"
          >
            {/* Hamburger */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
