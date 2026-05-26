import { useState } from 'react';
import { LogOut, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

type Props = {
  onLogout: () => void;
};

export function Sidebar({ onLogout }: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={`relative flex flex-col h-full border-r border-white/[0.06] bg-white/[0.02] transition-all duration-300 ease-in-out flex-shrink-0 ${
        expanded ? 'w-52' : 'w-14'
      }`}
    >
      {/* Logo / Brand */}
      <div className={`flex items-center gap-3 px-3.5 py-4 border-b border-white/[0.06] ${expanded ? '' : 'justify-center'}`}>
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <MessageSquare size={14} color="white" strokeWidth={2} />
        </div>
        {expanded && (
          <span className="text-sm font-medium text-white/70 whitespace-nowrap overflow-hidden">
            Docu Chatbot
          </span>
        )}
      </div>

      {/* Nav items (future items go here) */}
      <div className="flex-1 py-3" />

      {/* Logout */}
      <div className={`p-2 border-t border-white/[0.06]`}>
        <button
          onClick={onLogout}
          title="Logout"
          className={`flex items-center gap-3 w-full px-2.5 py-2 rounded-lg text-white/35 hover:text-red-400 hover:bg-red-500/[0.07] transition-all duration-150 ${
            expanded ? '' : 'justify-center'
          }`}
        >
          <LogOut size={15} strokeWidth={1.8} className="flex-shrink-0" />
          {expanded && (
            <span className="text-xs whitespace-nowrap">Logout</span>
          )}
        </button>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        className="absolute -right-3 top-[52px] w-6 h-6 rounded-full bg-[#0d1424] border border-white/[0.1] flex items-center justify-center text-white/40 hover:text-white/80 hover:border-white/20 transition-all duration-150 z-20"
      >
        {expanded ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
  );
}