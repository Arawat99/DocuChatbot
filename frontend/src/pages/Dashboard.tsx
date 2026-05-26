import { useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { WelcomeScreen } from '../dashboard/Welcomescreen';
import { MessageList } from '../dashboard/Messagelist';
import { ChatInput } from '../dashboard/Chatinput';
import { Sidebar } from './sideBar';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username || 'User';

  const { messages, loading, sendMessage } = useChat();
  const hasMessages = messages.length > 0;

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#050a14] text-white overflow-hidden">

      {/* Ambient top glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-blue-600/[0.08] blur-[80px] z-0" />
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[180px] h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent z-0" />

      {/* Sidebar */}
      <div className="relative z-10 h-full">
        <Sidebar onLogout={logout} />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col flex-1 z-10 overflow-hidden">
        {hasMessages ? (
          <MessageList messages={messages} loading={loading} />
        ) : (
          <WelcomeScreen
            username={username}
            onSuggestion={(text) => sendMessage(text)}
          />
        )}

        <div className="border-t border-white/[0.05] bg-[#050a14]/80 backdrop-blur-md">
          <ChatInput onSend={sendMessage} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;