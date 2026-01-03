import { useState } from 'react';
import {
  MessageSquare,
  Search,
  Clock,
  User,
  CheckCircle2,
  Circle,
  Send,
  Paperclip,
  AlertCircle,
} from 'lucide-react';

interface ChatHistoryProps {
  onBack: () => void;
}

interface HistoricalChat {
  id: string;
  name: string;
  customerId: string;
  status: 'logged-in' | 'guest';
  lastMessage: string;
  timestamp: string;
  date: string;
  resolvedAt: string;
  isOnline: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export function ChatHistory({ onBack }: ChatHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const [historicalChats] = useState<HistoricalChat[]>([
    {
      id: '1',
      name: 'Mike Johnson',
      customerId: 'CUST-234',
      status: 'logged-in',
      lastMessage: 'Thanks for your help!',
      timestamp: '16:45',
      date: '2024-12-15',
      resolvedAt: '2024-12-15 16:45',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Guest User',
      customerId: 'CUST-1',
      status: 'guest',
      lastMessage: 'Problem solved, thank you',
      timestamp: '15:30',
      date: '2024-12-15',
      resolvedAt: '2024-12-15 15:30',
      isOnline: false,
    },
    {
      id: '3',
      name: 'Sarah Williams',
      customerId: 'CUST-189',
      status: 'logged-in',
      lastMessage: 'Great service, appreciate it',
      timestamp: '14:20',
      date: '2024-12-14',
      resolvedAt: '2024-12-14 14:20',
      isOnline: false,
    },
    {
      id: '4',
      name: 'Guest User',
      customerId: 'CUST-2',
      status: 'guest',
      lastMessage: 'Got what I needed, thanks',
      timestamp: '11:15',
      date: '2024-12-14',
      resolvedAt: '2024-12-14 11:15',
      isOnline: false,
    },
    {
      id: '5',
      name: 'David Chen',
      customerId: 'CUST-156',
      status: 'logged-in',
      lastMessage: 'Issue resolved successfully',
      timestamp: '10:30',
      date: '2024-12-13',
      resolvedAt: '2024-12-13 10:30',
      isOnline: false,
    },
  ]);

  const [messages] = useState<{ [key: string]: Message[] }>({
    '1': [
      {
        id: '1',
        sender: 'user',
        text: 'Hi, I have a question about my prescription',
        timestamp: '16:30',
      },
      {
        id: '2',
        sender: 'agent',
        text: 'Hello Mike! I\'d be happy to help you with your prescription. What would you like to know?',
        timestamp: '16:31',
      },
      {
        id: '3',
        sender: 'user',
        text: 'Can I get a refill on my current prescription?',
        timestamp: '16:32',
      },
      {
        id: '4',
        sender: 'agent',
        text: 'Yes, you can request a refill through your account. I can help you with that process right now.',
        timestamp: '16:33',
      },
      {
        id: '5',
        sender: 'user',
        text: 'Thanks for your help!',
        timestamp: '16:45',
      },
    ],
    '2': [
      {
        id: '1',
        sender: 'user',
        text: 'I can\'t find a specific product',
        timestamp: '15:20',
      },
      {
        id: '2',
        sender: 'agent',
        text: 'I can help you locate the product. What are you looking for?',
        timestamp: '15:21',
      },
      {
        id: '3',
        sender: 'user',
        text: 'Aspirin 500mg',
        timestamp: '15:22',
      },
      {
        id: '4',
        sender: 'agent',
        text: 'We have that in stock. You can find it in the Pain Relief category.',
        timestamp: '15:23',
      },
      {
        id: '5',
        sender: 'user',
        text: 'Problem solved, thank you',
        timestamp: '15:30',
      },
    ],
  });

  const handleResolveChat = () => {
    alert('Chat marked as resolved!');
  };

  const filteredChats = historicalChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.customerId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChatData = historicalChats.find(chat => chat.id === selectedChat);
  const chatMessages = selectedChat ? messages[selectedChat] || [] : [];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Chat List */}
      <div className="w-96 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-slate-900 mb-1">Chat History</h1>
              <p className="text-sm text-slate-500">{filteredChats.length} resolved chat{filteredChats.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-sm transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {filteredChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`w-full p-4 rounded-xl mb-2 text-left transition-all duration-200 ${
                selectedChat === chat.id
                  ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 border-2 border-blue-200 shadow-sm'
                  : 'hover:bg-slate-50 border-2 border-transparent hover:border-slate-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                    <span className="text-lg">{chat.name.charAt(0)}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-slate-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-sm text-slate-900 truncate">{chat.name}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-xs text-slate-500">{chat.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${
                        chat.status === 'logged-in'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {chat.status === 'logged-in' ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      {chat.customerId}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-md text-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      Resolved
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{chat.lastMessage}</p>
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{chat.resolvedAt}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                      <span className="text-lg">{selectedChatData?.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-slate-900">{selectedChatData?.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-600 border border-slate-200">
                        {selectedChatData?.customerId}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500">Status:</span>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${selectedChatData?.isOnline ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                          <span className="text-xs text-slate-700">{selectedChatData?.isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleResolveChat}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Resolve Chat
                </button>
              </div>
            </div>

            {/* Guest User Warning */}
            {selectedChatData?.status === 'guest' && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mx-8 mt-6 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800">
                      This is a guest user. Customer information is not available for guest chats.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto space-y-6">
                {chatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-lg ${
                        message.sender === 'agent'
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md'
                          : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                      } px-5 py-3.5 rounded-2xl`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className={`w-3 h-3 ${message.sender === 'agent' ? 'text-blue-100' : 'text-slate-400'}`} />
                        <p
                          className={`text-xs ${
                            message.sender === 'agent' ? 'text-blue-100' : 'text-slate-500'
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-slate-200 p-6 shadow-lg">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end gap-3">
                  <button className="p-3 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 hover:text-slate-900 mb-1">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                      className="w-full px-5 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 focus:bg-white text-sm transition-all"
                    />
                  </div>
                  <button
                    disabled={!messageInput.trim()}
                    className="px-5 py-3 bg-slate-300 text-slate-500 rounded-xl cursor-not-allowed text-sm mb-1"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-slate-900 mb-2">No chat selected</h3>
              <p className="text-sm text-slate-500">Choose a chat from the history to view conversation</p>
            </div>
          </div>
        )}
      </div>

      {/* Customer Info Panel */}
      <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto shadow-sm">
        {selectedChatData ? (
          <div className="p-6">
            <div className="text-center pb-6 border-b border-slate-200">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-md">
                {selectedChatData.name.charAt(0)}
              </div>
              <h3 className="text-slate-900 mb-1">{selectedChatData.name}</h3>
              <p className="text-sm text-slate-500 capitalize mb-3">{selectedChatData.customerId}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-xs">Chat Resolved</span>
              </div>
            </div>

            <div className="space-y-5 mt-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-slate-500" />
                  <h4 className="text-sm text-slate-700">Customer Type</h4>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-sm text-slate-900">
                    {selectedChatData.status === 'guest' ? 'Guest User' : 'Registered User'}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <h4 className="text-sm text-slate-700">Chat Timeline</h4>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Resolved At</p>
                    <p className="text-sm text-slate-900">{selectedChatData.resolvedAt}</p>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <p className="text-xs text-slate-500 mb-1">Chat Duration</p>
                    <p className="text-sm text-slate-900">15 minutes</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <h4 className="text-sm text-slate-700">Chat Statistics</h4>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-slate-500">Total Messages</p>
                    <span className="text-sm text-slate-900">
                      {chatMessages.length}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <p className="text-xs text-slate-500 mb-1">Resolution Status</p>
                    <p className="text-sm text-green-700">Successfully Resolved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">Select a chat to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
