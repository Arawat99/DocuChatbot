type Props = {
  username: string;
  onSuggestion: (text: string) => void;
};

const SUGGESTIONS = [
  { emoji: '📋', label: 'Summarize a document' },
  { emoji: '✅', label: 'Extract action items' },
  { emoji: '🔍', label: 'Find key information' },
  { emoji: '❓', label: 'Answer a question' },
];

export function WelcomeScreen({ username, onSuggestion }: Props) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 px-6 select-none">
      {/* Greeting */}
      <div className="text-center">
        <h1 className="text-4xl font-light tracking-tight text-white mb-3">
          Welcome to Docu Chatbot,{' '}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent font-normal">
            {username}
          </span>
        </h1>
        <p className="text-sm text-white/35 font-light leading-relaxed">
          Ask anything — I'm here to help you work through it.
        </p>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 justify-center max-w-sm">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => onSuggestion(s.label)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs text-white/45 bg-white/[0.04] border border-white/[0.08] hover:text-blue-300 hover:border-blue-500/30 hover:bg-blue-500/[0.06] transition-all duration-150 cursor-pointer"
          >
            <span>{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}