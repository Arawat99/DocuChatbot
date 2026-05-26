import { useEffect, useRef } from 'react';
import type { Message } from '../hooks/useChat';

type Props = {
  messages: Message[];
  loading: boolean;
};

export function MessageList({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* AI avatar */}
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600/40 to-indigo-700/40 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mb-0.5">
                <span className="text-[9px] text-blue-300 font-medium">AI</span>
              </div>
            )}

            <div
              className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white/[0.05] border border-white/[0.07] text-white/75 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-end gap-2.5 justify-start">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600/40 to-indigo-700/40 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] text-blue-300 font-medium">AI</span>
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/[0.05] border border-white/[0.07] flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}