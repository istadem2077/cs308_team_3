import { useState, useEffect } from 'react';
import {
  Search, User, LayoutDashboard, LogOut, TrendingUp, TrendingDown, FileText, DollarSign, CheckCircle, AlertCircle, Bell, RotateCcw, Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { salesManagerAPI, productManagerAPI } from '../../services/managerApi';
import { productsAPI } from '../../services/api';

interface SdashboardProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

export function Sdashboard({ onBack, onNavigate }: SdashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ revenue: 0, profit: 0, cost: 0, invoiceCount: 0 });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1).toISOString();
      const nowISO = today.toISOString();

      // 1. Fetch Financial Report for this year
      const report = await salesManagerAPI.getFinancialReport(firstDayOfYear, nowISO);

      // 2. Fetch recent orders (These are flat DeliveryItemDto objects)
      const deliveryItems = await productManagerAPI.getDeliveries();

      setStats({
        revenue: report.revenue || 0,
        profit: report.profit || 0,
        cost: (report.revenue || 0) - (report.profit || 0),
        invoiceCount: deliveryItems.length
      });

      // FIX: Map flat DTO objects instead of nested Order objects
      setRecentInvoices(deliveryItems.slice(0, 4).map((item: any) => ({
        id: `ORD-${item.deliveryId}`, // Use deliveryId from DTO
        description: item.productName, // Use productName directly from DTO
        amount: item.totalPrice        // Use totalPrice from DTO
      })));

      // 3. Mock Chart data for now (to replace static data)
      const monthlyAvg = (report.revenue || 0) / (today.getMonth() + 1);
      const mockChart = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(0, i).toLocaleString('default', { month: 'short' }),
        revenue: i <= today.getMonth() ? monthlyAvg * (0.8 + Math.random() * 0.4) : 0,
        profit: i <= today.getMonth() ? (monthlyAvg * 0.4) : 0
      }));
      setRevenueData(mockChart);

    } catch (error) {
      console.error("Dashboard load failed", error);
    } finally {
      setLoading(false);
    }
  };

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
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg mb-2">
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
              <button onClick={() => onNavigate('notifications')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white">
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
              <div><h1 className="text-gray-900 mb-1">Dashboard Overview</h1></div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl w-80 bg-gray-50" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-y-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-sm text-gray-600">Total Revenue (YTD)</p>
                <p className="text-gray-900 mb-2 text-2xl">{loading ? '...' : `$${stats.revenue.toLocaleString()}`}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-sm text-gray-600">Total Profit (YTD)</p>
                <p className="text-green-600 mb-2 text-2xl">{loading ? '...' : `$${stats.profit.toLocaleString()}`}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-sm text-gray-600">Total Cost (YTD)</p>
                <p className="text-orange-600 mb-2 text-2xl">{loading ? '...' : `$${stats.cost.toLocaleString()}`}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-blue-600 mb-2 text-2xl">{loading ? '...' : stats.invoiceCount}</p>
              </div>
            </div>

            {/* Revenue Overview Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-gray-900 mb-6">Revenue Trend (Projected)</h3>
              <div className="w-full" style={{ height: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="grid grid-cols-1 gap-6 mt-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-gray-900 mb-6">Recent Invoices</h3>
                <div className="space-y-4">
                  {recentInvoices.map(invoice => (
                      <div key={invoice.id} className="flex items-start justify-between pb-4 border-b border-gray-100">
                        <div>
                          <p className="text-gray-900 mb-1">{invoice.id}</p>
                          <p className="text-sm text-gray-500">{invoice.description}</p>
                        </div>
                        <p className="text-green-600">${invoice.amount.toFixed(2)}</p>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
  );
}