import { useState, useEffect, useRef } from 'react';
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
  UserPlus,
  UserCheck,
} from 'lucide-react';
import { supportManagerAPI } from '../../services/managerApi';
import { socketService } from '../../services/socketService';

interface ChatSession {
  id: string;
  status: 'WAITING' | 'ACTIVE' | 'CLOSED';
  guestId?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  messages: Message[];
  assignedAgent?: {
    name: string;
    email: string;
  };
  updatedAt: string;
}

interface Message {
  id?: string;
  senderRole: 'CUSTOMER' | 'AGENT' | 'SYSTEM';
  content: string;
  timestamp?: string;
  createdAt?: string;
}

interface CustomerContext {
  customerName: string;
  email: string;
  openOrdersCount: number;
  lastOrderStatus: string;
  cartItemCount: number;
}

export function ActiveChats() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatFilter, setChatFilter] = useState<'unclaimed' | 'claimed'>('unclaimed');

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [customerContext, setCustomerContext] = useState<CustomerContext | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initial Fetch & Socket Connection
  useEffect(() => {
    fetchSessions();

    // Connect to WebSocket
    socketService.connect(() => {
      // Subscribe to Queue for new unclaimed chats
      socketService.subscribeToQueue((newSession) => {
        setSessions(prev => {
          if (prev.find(s => s.id === newSession.id)) return prev;
          return [...prev, newSession];
        });
      });
    });

    return () => {
      socketService.disconnect();
    };
  }, [chatFilter]);

  // Subscribe to specific chat when selected
  useEffect(() => {
    if (!selectedChatId) return;

    const session = sessions.find(s => s.id === selectedChatId);

    // Subscribe to real-time messages for this session
    // Note: Ensure socketService subscribes to "/topic/session/{id}" to match backend
    const sub = socketService.subscribeToChat(selectedChatId, (incomingMsg: any) => {
      setSessions(prev => prev.map(s => {
        if (s.id === selectedChatId) {
          // Avoid duplicates if using generated IDs
          return { ...s, messages: [...s.messages, incomingMsg] };
        }
        return s;
      }));
    });

    // Fetch Context if Registered User
    if (session?.user?.email) {
      supportManagerAPI.getCustomerContext(session.user.email)
          .then(setCustomerContext)
          .catch(console.error);
    } else {
      setCustomerContext(null);
    }

    return () => {
      // Unsubscribe logic if available in socketService
    };
  }, [selectedChatId]);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      let data;
      if (chatFilter === 'unclaimed') {
        data = await supportManagerAPI.getQueue();
      } else {
        // Fallback for now if endpoint doesn't exist yet
        try {
          data = await supportManagerAPI.getMySessions();
        } catch (e) {
          console.warn("My Sessions endpoint not implemented, showing empty");
          data = [];
        }
      }
      setSessions(data || []);
    } catch (error) {
      console.error("Failed to fetch chats", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChatId) return;

    const msgPayload = {
      senderRole: 'AGENT',
      content: messageInput,
      sessionId: selectedChatId
    };

    // Send via WebSocket
    socketService.sendMessage(selectedChatId, msgPayload);
    setMessageInput('');
  };

  const handleClaimChat = async (chatId: string) => {
    try {
      await supportManagerAPI.claimSession(chatId);
      // Move to 'claimed' list locally or refetch
      setChatFilter('claimed');
      setSelectedChatId(chatId);
      fetchSessions();
    } catch (error) {
      alert("Failed to claim chat");
    }
  };

  const filteredSessions = sessions.filter(session => {
    const name = session.user?.name || session.guestId || 'Guest';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const selectedSession = sessions.find(s => s.id === selectedChatId);

  return (
      <div className="flex h-screen bg-slate-50">
        {/* Chat List */}
        <div className="w-96 bg-white border-r border-slate-200 flex flex-col shadow-sm">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-slate-900 mb-1">Conversations</h1>
                <p className="text-sm text-slate-500">
                  {filteredSessions.length} {chatFilter} chat{filteredSessions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-700">Online</span>
              </div>
            </div>

            {/* Unclaimed / Claimed Tabs */}
            <div className="flex gap-2 mb-4 p-1 bg-slate-100 rounded-xl">
              <button
                  onClick={() => { setChatFilter('unclaimed'); setSelectedChatId(null); }}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      chatFilter === 'unclaimed'
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Unclaimed</span>
              </button>
              <button
                  onClick={() => { setChatFilter('claimed'); setSelectedChatId(null); }}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      chatFilter === 'claimed'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>My Chats</span>
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {isLoading ? (
                <div className="text-center py-10 text-slate-400">Loading...</div>
            ) : filteredSessions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500">No {chatFilter} chats</p>
                </div>
            ) : (
                filteredSessions.map(session => {
                  const displayName = session.user?.name || session.guestId || 'Guest';
                  const lastMsg = session.messages[session.messages.length - 1]?.content || 'No messages yet';

                  return (
                      <button
                          key={session.id}
                          onClick={() => setSelectedChatId(session.id)}
                          className={`w-full p-4 rounded-xl mb-2 text-left transition-all duration-200 ${
                              selectedChatId === session.id
                                  ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 border-2 border-blue-200 shadow-sm'
                                  : 'hover:bg-slate-50 border-2 border-transparent hover:border-slate-100'
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-sm">
                              <span className="text-lg">{displayName.charAt(0).toUpperCase()}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <h3 className="text-sm text-slate-900 truncate">{displayName}</h3>
                              <span className="text-xs text-slate-500">
                           {session.updatedAt ? new Date(session.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                        </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${
                            session.user ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {session.user ? 'Registered' : 'Guest'}
                        </span>
                            </div>
                            <p className="text-sm text-slate-600 truncate">{lastMsg}</p>
                          </div>
                        </div>
                      </button>
                  );
                })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {selectedSession ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-sm">
                      <span className="text-lg">
                        {(selectedSession.user?.name || selectedSession.guestId || 'G').charAt(0)}
                      </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-slate-900">{selectedSession.user?.name || 'Guest User'}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${
                          selectedSession.user ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {selectedSession.user ? 'Registered User' : 'Guest User'}
                      </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {chatFilter === 'unclaimed' && (
                          <button
                              onClick={() => handleClaimChat(selectedSession.id)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-sm text-sm flex items-center gap-2"
                          >
                            <UserPlus className="w-4 h-4" />
                            Claim Chat
                          </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="max-w-4xl mx-auto space-y-6">
                    {selectedSession.messages.map((message, idx) => (
                        <div
                            key={idx}
                            className={`flex ${message.senderRole === 'AGENT' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                              className={`max-w-lg ${
                                  message.senderRole === 'AGENT'
                                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md'
                                      : message.senderRole === 'SYSTEM'
                                          ? 'bg-gray-200 text-gray-600 text-center w-full'
                                          : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                              } px-5 py-3.5 rounded-2xl`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-slate-200 p-6 shadow-lg">
                  <div className="max-w-4xl mx-auto">
                    {chatFilter === 'unclaimed' ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                          <p className="text-sm text-yellow-800 mb-3">
                            You need to claim this chat before you can send messages.
                          </p>
                          <button
                              onClick={() => handleClaimChat(selectedSession.id)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-sm text-sm inline-flex items-center gap-2"
                          >
                            <UserPlus className="w-4 h-4" />
                            Claim Chat to Reply
                          </button>
                        </div>
                    ) : (
                        <div className="flex items-end gap-3">
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
                          className="w-full px-5 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-slate-50"
                      />
                          </div>
                          <button
                              onClick={handleSendMessage}
                              disabled={!messageInput.trim()}
                              className="p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg disabled:opacity-50"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                    )}
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
                </div>
              </div>
          )}
        </div>

        {/* Customer Info Panel */}
        <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto shadow-sm">
          {selectedSession && customerContext ? (
              <div className="p-6">
                <div className="text-center pb-6 border-b border-slate-200">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-md">
                    {customerContext.customerName.charAt(0)}
                  </div>
                  <h3 className="text-slate-900 mb-1">{customerContext.customerName}</h3>
                  <p className="text-sm text-slate-500">{customerContext.email}</p>
                </div>

                <div className="space-y-5 mt-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ShoppingBag className="w-4 h-4 text-slate-500" />
                      <h4 className="text-sm text-slate-700">Context</h4>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Open Orders</span>
                        <span className="text-sm font-medium">{customerContext.openOrdersCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Cart Items</span>
                        <span className="text-sm font-medium">{customerContext.cartItemCount}</span>
                      </div>
                      <div className="border-t pt-2">
                        <span className="text-xs text-slate-500">Last Order Status</span>
                        <p className="text-sm font-medium text-slate-900">{customerContext.lastOrderStatus}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          ) : selectedSession ? (
              <div className="p-6 text-center text-slate-500">
                <User className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>Guest User or No Context Available</p>
              </div>
          ) : null}
        </div>
      </div>
  );
}