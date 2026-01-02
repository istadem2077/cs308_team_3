import { useState } from 'react';
import {
  Search,
  User,
  LayoutDashboard,
  LogOut,
  TrendingUp,
  DollarSign,
  FileText,
  RotateCcw,
  Bell,
  Check,
  AlertCircle,
} from 'lucide-react';

interface NotificationManagementProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

export function NotificationManagement({
  onBack,
  onNavigate,
}: NotificationManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      message: 'Discount of 15% applied to 5 products. Users notified via email.',
      timestamp: '2024-12-16 10:30 AM',
    },
    {
      id: '2',
      type: 'warning',
      message: 'Low stock alert: Aspirin 500mg has only 10 units remaining.',
      timestamp: '2024-12-15 03:45 PM',
    },
    {
      id: '3',
      type: 'info',
      message: 'New invoice INV-004 generated for CUST-234.',
      timestamp: '2024-12-15 11:20 AM',
    },
    {
      id: '4',
      type: 'info',
      message: 'Monthly revenue report is ready for download.',
      timestamp: '2024-12-14 09:00 AM',
    },
  ]);

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return {
          borderColor: 'border-l-green-500',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600',
          icon: Check,
        };
      case 'warning':
        return {
          borderColor: 'border-l-orange-500',
          bgColor: 'bg-orange-50',
          iconColor: 'text-orange-600',
          icon: AlertCircle,
        };
      case 'info':
        return {
          borderColor: 'border-l-blue-500',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600',
          icon: Bell,
        };
      default:
        return {
          borderColor: 'border-l-gray-500',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-600',
          icon: Bell,
        };
    }
  };

  // Filter notifications by search query
  const filteredNotifications = notifications.filter(notification =>
    notification.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg">Sales Manager</h2>
              <p className="text-xs text-gray-400">Sabanci University</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="mb-2">
            <p className="text-xs text-gray-400 px-3 mb-2">NAVIGATION</p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <DollarSign className="w-5 h-5" />
              <span>Pricing & Discount</span>
            </button>
            <button
              onClick={() => onNavigate('invoices')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <FileText className="w-5 h-5" />
              <span>Invoice Management</span>
            </button>
            <button
              onClick={() => onNavigate('revenue')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Revenue & Profit</span>
            </button>
            <button
              onClick={() => onNavigate('refunds')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Refund Management</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span>Exit Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">Notifications</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-80 bg-gray-50"
                />
              </div>

              <button className="w-11 h-11 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center hover:from-green-100 hover:to-green-200 transition-all duration-200">
                <User className="w-5 h-5 text-green-700" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500">No notifications found matching your search</p>
              </div>
            ) : (
              filteredNotifications.map(notification => {
                const style = getNotificationStyle(notification.type);
                const IconComponent = style.icon;

                return (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-xl shadow-sm border-l-4 ${style.borderColor} p-5 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 ${style.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
                      >
                        <IconComponent className={`w-5 h-5 ${style.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 mb-2">{notification.message}</p>
                        <p className="text-sm text-gray-500">{notification.timestamp}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
