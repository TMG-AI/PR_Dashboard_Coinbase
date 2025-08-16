import React, { useState } from 'react';

interface MobileNavigationProps {
  children?: React.ReactNode;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-[#10182b] shadow text-white focus:outline-none"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-[#10182b] h-full shadow-2xl p-6 animate-slide-in flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
            <button className="self-end mb-6 text-gray-400 hover:text-white" onClick={() => setOpen(false)} aria-label="Close navigation">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <nav className="flex flex-col gap-4">
              <a href="#" className="text-white font-semibold text-lg hover:text-[#0052FF] transition">Dashboard</a>
              <a href="#" className="text-gray-300 hover:text-[#0052FF] transition">Media Coverage</a>
              <a href="#" className="text-gray-300 hover:text-[#0052FF] transition">Alerts</a>
              <a href="#" className="text-gray-300 hover:text-[#0052FF] transition">Export</a>
            </nav>
            <div className="mt-8">{children}</div>
          </div>
          <div className="flex-1 bg-black bg-opacity-40" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
};
