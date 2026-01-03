import { useState } from 'react';
import { MessageSquare, History, Users, LogOut } from 'lucide-react';
import { ActiveChats } from './SupportManager/ActiveChats';
import { ChatHistory } from './SupportManager/ChatHistory';
import { Customers } from './SupportManager/Customers';

interface SupportManagerProps {
  onBack: () => void;
}

type SupportPage = 'active-chats' | 'chat-history' | 'customers';

export function SupportManager({ onBack }: SupportManagerProps) {
  const [currentPage, setCurrentPage] = useState<SupportPage>('active-chats');

  // Mock unread count for Active Chats
  const unreadCount = 4;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-lg">Support Agent</h2>
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => setCurrentPage('active-chats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 relative transition-colors ${
              currentPage === 'active-chats'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Active Chats</span>
            {currentPage !== 'active-chats' && unreadCount > 0 && (
              <span className="absolute right-3 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentPage('chat-history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              currentPage === 'chat-history'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <History className="w-5 h-5" />
            <span>Chat History</span>
          </button>

          <button
            onClick={() => setCurrentPage('customers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              currentPage === 'customers'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Customers</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
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