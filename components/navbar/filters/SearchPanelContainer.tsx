import { ReactNode } from 'react';

interface SearchPanelContainerProps {
  children: ReactNode;
}

export default function SearchPanelContainer({ children }: SearchPanelContainerProps) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.16)] border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 ease-out">
      <div className="p-7">
        {children}
      </div>
    </div>
  );
}
