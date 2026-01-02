import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Paperclip,
  Minimize2,
  User,
  Image as ImageIcon,
  FileText,
  Video,
} from 'lucide-react';

interface CustomerChatProps {
  userName?: string;
  userEmail?: string;
  isLoggedIn: boolean;
}

interface Message {
  id: string;
  sender: 'customer' | 'agent';
  text: string;
  timestamp: string;
  attachment?: {
    type: 'image' | 'pdf' | 'video';
    name: string;
  };
}

export function CustomerChat({ userName, userEmail, isLoggedIn }: CustomerChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: 'Hello! Welcome to Sabanci University Pharmacy Support. How can we help you today?',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simulate agent responses after customer messages
    if (messages.length > 1 && messages[messages.length - 1].sender === 'customer') {
      const timer = setTimeout(() => {
        // Only add auto-response if chat is active
        if (messages.length <= 3) {
          addAgentMessage('Thank you for your message. A support agent will be with you shortly.');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  useEffect(() => {
    // Update unread count when minimized
    if (isMinimized && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'agent') {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isMinimized]);

  const addAgentMessage = (text: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleStartChat = () => {
    if (!isLoggedIn) {
      if (!guestName.trim()) {
        alert('Please enter your name');
        return;
      }
      if (!guestEmail.trim() || !guestEmail.includes('@')) {
        alert('Please enter a valid email');
        return;
      }
    }
    setHasStartedChat(true);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      text: messageInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      let fileType: 'image' | 'pdf' | 'video' = 'image';
      
      if (file.type.startsWith('image/')) {
        fileType = 'image';
      } else if (file.type === 'application/pdf') {
        fileType = 'pdf';
      } else if (file.type.startsWith('video/')) {
        fileType = 'video';
      }

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: 'customer',
        text: '',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        attachment: {
          type: fileType,
          name: file.name,
        },
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
      setUnreadCount(0);
    } else {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setUnreadCount(0);
      }
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Floating chat button
  if (!isOpen && !isMinimized) {
    return (
      <button
        onClick={handleToggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all hover:scale-110 z-50 group"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
            {unreadCount}
          </span>
        )}
        <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Need help? Chat with us!
        </span>
      </button>
    );
  }

  // Minimized chat indicator
  if (isMinimized) {
    return (
      <button
        onClick={handleToggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all z-50"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  // Chat window
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium">Support Chat</h3>
            <div className="flex items-center gap-2 text-xs text-blue-100">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Online
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleMinimize}
            className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            aria-label="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!hasStartedChat ? (
        // Welcome form
        <div className="flex-1 p-6 flex flex-col justify-center">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl mb-2">Welcome to Support</h3>
            <p className="text-gray-600 text-sm">
              We're here to help! Start a conversation with our support team.
            </p>
          </div>

          {isLoggedIn ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">{userName}</span>
                </div>
                <p className="text-sm text-gray-600">{userEmail}</p>
              </div>
              <button
                onClick={handleStartChat}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Chat
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Your Email</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleStartChat}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Chat as Guest
              </button>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center mt-4">
            By starting a chat, you agree to our support terms
          </p>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex gap-2 max-w-[80%]">
                  {message.sender === 'agent' && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0 text-sm">
                      S
                    </div>
                  )}
                  <div>
                    <div
                      className={`rounded-2xl px-4 py-2.5 ${
                        message.sender === 'customer'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                      }`}
                    >
                      {message.text && <p className="text-sm leading-relaxed">{message.text}</p>}
                      {message.attachment && (
                        <div className={`flex items-center gap-2 p-2 rounded-lg ${
                          message.sender === 'customer' ? 'bg-blue-700' : 'bg-gray-50'
                        } ${message.text ? 'mt-2' : ''}`}>
                          {message.attachment.type === 'image' && <ImageIcon className="w-4 h-4" />}
                          {message.attachment.type === 'pdf' && <FileText className="w-4 h-4" />}
                          {message.attachment.type === 'video' && <Video className="w-4 h-4" />}
                          <span className="text-xs font-medium">{message.attachment.name}</span>
                        </div>
                      )}
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${
                      message.sender === 'customer' ? 'text-right' : 'text-left'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                  {message.sender === 'customer' && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white flex-shrink-0 text-sm">
                      {isLoggedIn ? userName?.charAt(0).toUpperCase() : guestName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <div className="flex gap-2 items-end">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,.pdf,video/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                title="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </>
      )}
    </div>
  );
}
