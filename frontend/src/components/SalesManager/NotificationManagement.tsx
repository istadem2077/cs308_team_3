import { useState, useEffect } from 'react';
import {
  Search, User, LayoutDashboard, LogOut, TrendingUp, DollarSign, FileText, RotateCcw, Bell, Check, AlertCircle, Loader2
} from 'lucide-react';
import { productsAPI } from '../../services/api'; // For stock alerts
import { productManagerAPI } from '../../services/managerApi'; // For new orders/returns

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

export function NotificationManagement({ onBack, onNavigate }: NotificationManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateNotifications();
  }, []);

  const generateNotifications = async () => {
    try {
      setLoading(true);
      const [products, orders] = await Promise.all([
        productsAPI.getAll(),
        productManagerAPI.getDeliveries()
      ]);

      const alerts: Notification[] = [];

      // 1. Low Stock Alerts
      products.forEach(p => {
        if (p.stockCount < 10) {
          alerts.push({
            id: `stock-${p.id}`,
            type: 'warning',
            message: `Low stock alert: ${p.name} has only ${p.stockCount} units remaining.`,
            timestamp: 'Just now'
          });
        }
      });

      // 2. Pending Refund Alerts
      orders.forEach((o: any) => {
        if (o.status === 'RETURN_REQUESTED') {
          alerts.push({
            id: `return-${o.orderId}`,
            type: 'warning',
            message: `New Refund Request for Order #${o.orderId} from ${o.userName || 'Customer'}.`,
            timestamp: new Date(o.orderDate).toLocaleDateString()
          });
        }
      });

      // 3. Recent Large Orders (Success)
      orders.slice(0, 5).forEach((o: any) => {
        if (o.totalAmount > 100) {
          alerts.push({
            id: `order-${o.orderId}`,
            type: 'success',
            message: `New large order #${o.orderId} received. Value: $${o.totalAmount.toFixed(2)}`,
            timestamp: new Date(o.orderDate).toLocaleDateString()
          });
        }
      });

      setNotifications(alerts);
    } catch (error) {
      console.error("Failed to generate notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification =>
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Sidebar - Same as before */}
        <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
          {/* ... Sidebar Code ... */}
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
              <button onClick={() => onNavigate('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <LayoutDashboard className="w-5 h-5" /> <span>Dashboard</span>
              </button>
              <button onClick={() => onNavigate('pricing')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <DollarSign className="w-5 h-5" /> <span>Pricing & Discount</span>
              </button>
              <button onClick={() => onNavigate('invoices')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <FileText className="w-5 h-5" /> <span>Invoice Management</span>
              </button>
              <button onClick={() => onNavigate('revenue')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <TrendingUp className="w-5 h-5" /> <span>Revenue & Profit</span>
              </button>
              <button onClick={() => onNavigate('refunds')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <RotateCcw className="w-5 h-5" /> <span>Refund Management</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg">
                <Bell className="w-5 h-5" /> <span>Notifications</span>
              </button>
            </div>
          </nav>
          <div className="p-4 border-t border-gray-700">
            <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white">
              <LogOut className="w-5 h-5" /> <span>Exit Dashboard</span>
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div><h1 className="text-gray-900">Notifications</h1></div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl w-80 bg-gray-50" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-y-auto">
            <div className="space-y-4">
              {loading ? (
                  <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400"/></div>
              ) : filteredNotifications.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <p className="text-gray-500">No active notifications</p>
                  </div>
              ) : (
                  filteredNotifications.map(notification => {
                    const style = notification.type === 'success'
                        ? { border: 'border-l-green-500', bg: 'bg-green-50', text: 'text-green-600', icon: Check }
                        : notification.type === 'warning'
                            ? { border: 'border-l-orange-500', bg: 'bg-orange-50', text: 'text-orange-600', icon: AlertCircle }
                            : { border: 'border-l-blue-500', bg: 'bg-blue-50', text: 'text-blue-600', icon: Bell };

                    const IconComponent = style.icon;
                    return (
                        <div key={notification.id} className={`bg-white rounded-xl shadow-sm border-l-4 ${style.border} p-5`}>
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 ${style.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className={`w-5 h-5 ${style.text}`} />
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