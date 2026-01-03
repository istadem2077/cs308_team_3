import { useState } from 'react';
import {
  MessageSquare,
  LogOut,
  Search,
  User,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
} from 'lucide-react';

interface ActiveChatsProps {
  onBack: () => void;
}

interface ChatUser {
  id: string;
  name: string;
  status: 'logged-in' | 'guest';
  message: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export function ActiveChats({ onBack }: ActiveChatsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const [activeChats] = useState<ChatUser[]>([
    {
      id: '1',
      name: 'John Doe',
      status: 'logged-in',
      message: 'I need help with my order',
      timestamp: '2024-12-16 14:30',
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: '2',
      name: 'Guest User',
      status: 'guest',
      message: 'Do you have Aspirin in stock?',
      timestamp: '2024-12-16 14:25',
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: '3',
      name: 'Jane Smith',
      status: 'logged-in',
      message: 'What are your delivery options?',
      timestamp: '2024-12-16 14:20',
      unreadCount: 1,
      isOnline: false,
    },
  ]);

  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({
    '1': [
      {
        id: '1',
        sender: 'user',
        text: 'I need help with my order',
        timestamp: '14:30',
      },
      {
        id: '2',
        sender: 'agent',
        text: 'Hello! I\'d be happy to help you with your order. Can you please provide your order number?',
        timestamp: '14:31',
      },
      {
        id: '3',
        sender: 'user',
        text: 'It\'s ORD-12345',
        timestamp: '14:32',
      },
    ],
    '2': [
      {
        id: '1',
        sender: 'user',
        text: 'Do you have Aspirin in stock?',
        timestamp: '14:25',
      },
    ],
    '3': [
      {
        id: '1',
        sender: 'user',
        text: 'What are your delivery options?',
        timestamp: '14:20',
      },
    ],
  });

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'agent',
      text: messageInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage],
    }));

    setMessageInput('');
  };

  const filteredChats = activeChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChatData = activeChats.find(chat => chat.id === selectedChat);
  const chatMessages = selectedChat ? messages[selectedChat] || [] : [];

  const totalUnread = activeChats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-lg">Support Agent</h2>
        </div>

        <nav className="flex-1 p-4">
          <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white mb-2 relative">
            <MessageSquare className="w-5 h-5" />
            <span>Active Chats</span>
            {totalUnread > 0 && (
              <span className="absolute right-3 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
                {totalUnread}
              </span>
            )}
          </div>
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

      {/* Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-gray-900 mb-4">Support Dashboard</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Status:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">Online</span>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <p className="text-xs text-gray-500 mb-2">Active Chats</p>
            {filteredChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-3 rounded-lg mb-2 text-left transition-colors ${
                  selectedChat === chat.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      {chat.name.charAt(0)}
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        chat.isOnline ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm text-gray-900 truncate">{chat.name}</h3>
                      {chat.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 ml-2">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 capitalize mb-1">{chat.status}</p>
                    <p className="text-xs text-gray-600 truncate">{chat.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {selectedChatData?.name.charAt(0)}
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      selectedChatData?.isOnline ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                </div>
                <div>
                  <h3 className="text-gray-900">{selectedChatData?.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{selectedChatData?.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="space-y-4">
                {chatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === 'agent'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === 'agent' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Customer Info Panel */}
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        {selectedChatData ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                {selectedChatData.name.charAt(0)}
              </div>
              <h3 className="text-gray-900 mb-1">{selectedChatData.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{selectedChatData.status}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-500 mb-2">Contact Information</h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">
                      {selectedChatData.status === 'guest' 
                        ? 'Not provided'
                        : `${selectedChatData.name.toLowerCase().replace(' ', '.')}@email.com`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">
                      {selectedChatData.status === 'guest' ? 'Not provided' : '+90 555 123 4567'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm text-gray-500 mb-2">Order History</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-900">
                    {selectedChatData.status === 'guest' ? 'No orders yet' : '3 orders'}
                  </p>
                  {selectedChatData.status !== 'guest' && (
                    <p className="text-xs text-gray-500 mt-1">Last order: 2024-12-15</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm text-gray-500 mb-2">Status</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedChatData.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <p className="text-sm text-gray-900">{selectedChatData.isOnline ? 'Online' : 'Offline'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">Select a chat to view customer info</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}