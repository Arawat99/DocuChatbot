import { useState } from 'react';
import { SendHorizonal } from 'lucide-react';

type Props = {
  onSend: (text: string) => void;
  loading: boolean;
  placeholder?: string;
};

export function ChatInput({ onSend, loading, placeholder }: Props) {
  const [value, setValue] = useState('');

  const submit = () => {
    if (!value.trim() || loading) return;
    onSend(value);
    setValue('');
  };

  return (
    <div className="px-4 pb-5 pt-2">
      <div className="max-w-2xl mx-auto">
        <div
          className={`flex items-center gap-2 bg-white/[0.04] border rounded-2xl px-4 py-2.5 transition-all duration-200 ${
            loading ? 'border-white/[0.06]' : 'border-white/[0.09] focus-within:border-blue-500/40 focus-within:bg-blue-500/[0.03]'
          }`}
        >
          <input
            type="text"
            value={value}
            disabled={loading}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder={placeholder ?? (loading ? 'Waiting…' : 'Type a message…')}
            className="flex-1 bg-transparent outline-none text-sm text-white/80 placeholder:text-white/20 disabled:opacity-50 disabled:cursor-not-allowed font-light"
          />
          <button
            onClick={submit}
            disabled={!value.trim() || loading}
            aria-label="Send"
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 transition-all duration-150 hover:opacity-85 hover:scale-95 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <SendHorizonal size={13} color="white" strokeWidth={2.2} />
          </button>
        </div>
        <p className="text-center text-[10px] text-white/12 mt-2 tracking-wide">
          Press Enter to send
        </p>
      </div>
    </div>
  );
}