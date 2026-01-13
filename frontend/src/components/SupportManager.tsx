import { useState, useEffect } from 'react';
import { MessageSquare, History, Users, LogOut, Headphones } from 'lucide-react';
import { ActiveChats } from './SupportManager/ActiveChats';
import { ChatHistory } from './SupportManager/ChatHistory';
import { Customers } from './SupportManager/Customers';
import { supportManagerAPI } from '../services/managerApi';

interface SupportManagerProps {
  onBack: () => void;
}

type SupportPage = 'active-chats' | 'chat-history' | 'customers';

export function SupportManager({ onBack }: SupportManagerProps) {
  const [currentPage, setCurrentPage] = useState<SupportPage>('active-chats');
  const [waitingCount, setWaitingCount] = useState(0);

  // Fetch the real queue count to show on the badge
  useEffect(() => {
    const fetchQueueCount = async () => {
      try {
        const queue = await supportManagerAPI.getQueue();
        setWaitingCount(queue.length);
      } catch (error) {
        console.error("Failed to fetch queue count:", error);
      }
    };

    fetchQueueCount();

    // Poll every 10 seconds to keep the badge updated
    // (Ideally, you would use the socketService here, but polling is simpler for this parent component)
    const interval = setInterval(fetchQueueCount, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar */}
        <aside className="w-80 bg-slate-900 text-white flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Headphones className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl text-white">Support Manager</h2>
                <p className="text-sm text-slate-400">Sabanci University</p>
              </div>
            </div>
          </div>

          {/* Navigation Label */}
          <div className="px-6 pt-6 pb-3">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Navigation</p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4">
            <button
                onClick={() => setCurrentPage('active-chats')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-2 relative transition-all duration-200 ${
                    currentPage === 'active-chats'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'text-slate-300 hover:bg-slate-800/50'
                }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Active Chats</span>
              {/* Show Badge only if there are waiting chats */}
              {currentPage !== 'active-chats' && waitingCount > 0 && (
                  <span className="absolute right-4 px-2 py-0.5 bg-red-500 rounded-full flex items-center justify-center text-xs min-w-[20px]">
                {waitingCount}
              </span>
              )}
            </button>

            <button
                onClick={() => setCurrentPage('chat-history')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-2 transition-all duration-200 ${
                    currentPage === 'chat-history'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'text-slate-300 hover:bg-slate-800/50'
                }`}
            >
              <History className="w-5 h-5" />
              <span>Chat History</span>
            </button>

            <button
                onClick={() => setCurrentPage('customers')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-2 transition-all duration-200 ${
                    currentPage === 'customers'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'text-slate-300 hover:bg-slate-800/50'
                }`}
            >
              <Users className="w-5 h-5" />
              <span>Customers</span>
            </button>
          </nav>

          {/* Exit Button */}
          <div className="p-4 border-t border-slate-700/50">
            <button
                onClick={onBack}
                className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-slate-300 hover:bg-slate-800/50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Exit Dashboard</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {currentPage === 'active-chats' && <ActiveChats />}
          {currentPage === 'chat-history' && <ChatHistory onBack={onBack} />}
          {currentPage === 'customers' && <Customers onBack={onBack} />}
        </div>
      </div>
  );
}