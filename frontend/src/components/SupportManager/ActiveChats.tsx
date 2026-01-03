import { useState } from 'react';
import {
  MessageSquare,
  Search,
  User,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Clock,
  ShoppingBag,
  CheckCircle2,
  Circle,
} from 'lucide-react';

interface ChatUser {
  id: string;
  name: string;
  status: 'logged-in' | 'guest';
  message: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  priority: 'high' | 'normal' | 'low';
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export function ActiveChats() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const [activeChats] = useState<ChatUser[]>([
    {
      id: '1',
      name: 'John Doe',
      status: 'logged-in',
      message: 'I need help with my order',
      timestamp: '14:30',
      unreadCount: 2,
      isOnline: true,
      priority: 'high',
    },
    {
      id: '2',
      name: 'Guest User',
      status: 'guest',
      message: 'Do you have Aspirin in stock?',
      timestamp: '14:25',
      unreadCount: 1,
      isOnline: true,
      priority: 'normal',
    },
    {
      id: '3',
      name: 'Jane Smith',
      status: 'logged-in',
      message: 'What are your delivery options?',
      timestamp: '14:20',
      unreadCount: 1,
      isOnline: false,
      priority: 'low',
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
    <div className="flex h-screen bg-slate-50">
      {/* Chat List */}
      <div className="w-96 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-slate-900 mb-1">Conversations</h1>
              <p className="text-sm text-slate-500">{filteredChats.length} active chat{filteredChats.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700">Online</span>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
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
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-sm">
                    <span className="text-lg">{chat.name.charAt(0)}</span>
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                      chat.isOnline ? 'bg-green-500' : 'bg-slate-400'
                    }`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-sm text-slate-900 truncate">{chat.name}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-xs text-slate-500">{chat.timestamp}</span>
                      {chat.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs shadow-sm">
                          {chat.unreadCount}
                        </span>
                      )}
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
                      {chat.status === 'logged-in' ? 'Registered' : 'Guest'}
                    </span>
                    {chat.priority === 'high' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded-md text-xs">
                        High Priority
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 truncate">{chat.message}</p>
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
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-sm">
                      <span className="text-lg">{selectedChatData?.name.charAt(0)}</span>
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                        selectedChatData?.isOnline ? 'bg-green-500' : 'bg-slate-400'
                      }`}
                    ></div>
                  </div>
                  <div>
                    <h3 className="text-slate-900">{selectedChatData?.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${
                          selectedChatData?.status === 'logged-in'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {selectedChatData?.status === 'logged-in' ? 'Registered User' : 'Guest User'}
                      </span>
                      <span className={`text-xs ${selectedChatData?.isOnline ? 'text-green-600' : 'text-slate-500'}`}>
                        {selectedChatData?.isOnline ? 'Active now' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 hover:text-slate-900">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 hover:text-slate-900">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 hover:text-slate-900">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

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
                    <textarea
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={e => setMessageInput(e.target.value)}
                      onKeyPress={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      rows={1}
                      className="w-full px-5 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-slate-50 focus:bg-white text-sm transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-1"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 ml-14">Press Enter to send, Shift + Enter for new line</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-slate-900 mb-2">No conversation selected</h3>
              <p className="text-sm text-slate-500">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Customer Info Panel */}
      <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto shadow-sm">
        {selectedChatData ? (
          <div className="p-6">
            <div className="text-center pb-6 border-b border-slate-200">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-md">
                {selectedChatData.name.charAt(0)}
              </div>
              <h3 className="text-slate-900 mb-1">{selectedChatData.name}</h3>
              <p className="text-sm text-slate-500 capitalize mb-3">{selectedChatData.status}</p>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
                selectedChatData.isOnline 
                  ? 'bg-green-50 text-green-700 border border-green-100' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${selectedChatData.isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                <span className="text-xs">{selectedChatData.isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>

            <div className="space-y-5 mt-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-slate-500" />
                  <h4 className="text-sm text-slate-700">Contact Information</h4>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email Address</p>
                    <p className="text-sm text-slate-900">
                      {selectedChatData.status === 'guest' 
                        ? 'Not provided'
                        : `${selectedChatData.name.toLowerCase().replace(' ', '.')}@email.com`}
                    </p>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                    <p className="text-sm text-slate-900">
                      {selectedChatData.status === 'guest' ? 'Not provided' : '+90 555 123 4567'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag className="w-4 h-4 text-slate-500" />
                  <h4 className="text-sm text-slate-700">Order History</h4>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-900">
                      {selectedChatData.status === 'guest' ? 'No orders yet' : 'Total Orders'}
                    </p>
                    {selectedChatData.status !== 'guest' && (
                      <span className="text-lg text-blue-600">3</span>
                    )}
                  </div>
                  {selectedChatData.status !== 'guest' && (
                    <>
                      <div className="border-t border-slate-200 pt-3 mt-3">
                        <p className="text-xs text-slate-500 mb-1">Last Order</p>
                        <p className="text-sm text-slate-900">December 15, 2024</p>
                      </div>
                      <div className="border-t border-slate-200 pt-3 mt-3">
                        <p className="text-xs text-slate-500 mb-1">Total Spent</p>
                        <p className="text-sm text-slate-900">₺450.00</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <h4 className="text-sm text-slate-700">Chat Statistics</h4>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-slate-500">Previous Chats</p>
                    <span className="text-sm text-slate-900">
                      {selectedChatData.status === 'guest' ? '0' : '5'}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <p className="text-xs text-slate-500 mb-1">Average Response Time</p>
                    <p className="text-sm text-slate-900">
                      {selectedChatData.status === 'guest' ? 'N/A' : '2 minutes'}
                    </p>
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
              <p className="text-sm text-slate-500">Select a chat to view customer information</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}