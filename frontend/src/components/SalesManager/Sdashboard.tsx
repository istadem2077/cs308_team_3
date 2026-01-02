import { useState } from 'react';
import {
  Search,
  User,
  LayoutDashboard,
  LogOut,
  TrendingUp,
  TrendingDown,
  FileText,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Bell,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SdashboardProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

export function Sdashboard({ onBack, onNavigate }: SdashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Revenue data for the chart
  const revenueData = [
    { month: 'Jan', revenue: 13000, cost: 6500, profit: 6500 },
    { month: 'Feb', revenue: 15000, cost: 7500, profit: 7500 },
    { month: 'Mar', revenue: 14000, cost: 7000, profit: 7000 },
    { month: 'Apr', revenue: 18000, cost: 9000, profit: 9000 },
    { month: 'May', revenue: 16000, cost: 8000, profit: 8000 },
    { month: 'Jun', revenue: 19000, cost: 9500, profit: 9500 },
    { month: 'Jul', revenue: 22000, cost: 11000, profit: 11000 },
    { month: 'Aug', revenue: 21000, cost: 10500, profit: 10500 },
    { month: 'Sep', revenue: 23000, cost: 11500, profit: 11500 },
    { month: 'Oct', revenue: 25000, cost: 12500, profit: 12500 },
    { month: 'Nov', revenue: 27000, cost: 13500, profit: 13500 },
    { month: 'Dec', revenue: 30000, cost: 15000, profit: 15000 },
  ];

  // Recent invoices data
  const recentInvoices = [
    { id: 'INV-001', description: 'Aspirin 500mg, Vitamin C', amount: 45.99 },
    { id: 'INV-002', description: 'Hand Sanitizer', amount: 19.98 },
    { id: 'INV-003', description: 'Face Masks, Thermometer', amount: 85.5 },
  ];

  // Recent notifications data
  const recentNotifications = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle,
      message: 'Discount of 15% applied to 5 products. Users notified via email.',
      timestamp: '2024-12-16 10:30 AM',
    },
    {
      id: 2,
      type: 'warning',
      icon: AlertCircle,
      message: 'Low stock alert: Aspirin 500mg has only 10 units remaining.',
      timestamp: '2024-12-15 03:45 PM',
    },
    {
      id: 3,
      type: 'info',
      icon: Bell,
      message: 'New invoice INV-004 generated for CUST-234.',
      timestamp: '2024-12-15 11:20 AM',
    },
  ];

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
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white"
            >
              <DollarSign className="w-5 h-5" />
              <span>Pricing & Discount</span>
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
              <h1 className="text-gray-900 mb-1">Dashboard Overview</h1>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <p className="text-gray-900 mb-2">$240,100</p>
              <p className="text-sm text-green-600">+12.5% from last year</p>
            </div>

            {/* Total Cost */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">Total Cost</p>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <p className="text-gray-900 mb-2">$120,050</p>
              <p className="text-sm text-gray-500">Est. at 50% of revenue</p>
            </div>

            {/* Total Profit */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">Total Profit</p>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <p className="text-green-600 mb-2">$120,050</p>
              <p className="text-sm text-green-600">+15.2% from last year</p>
            </div>

            {/* Total Invoices */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">Total Invoices</p>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-900 mb-2">4</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
          </div>

          {/* Revenue Overview Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="text-gray-900">Revenue Overview</h3>
            </div>

            <div className="w-full" style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: '#f97316', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Cost"
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Invoices and Notifications */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            {/* Recent Invoices */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="mb-6">
                <h3 className="text-gray-900">Recent Invoices</h3>
              </div>

              <div className="space-y-4">
                {recentInvoices.map(invoice => (
                  <div
                    key={invoice.id}
                    className="flex items-start justify-between pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-gray-900 mb-1">{invoice.id}</p>
                      <p className="text-sm text-gray-500">{invoice.description}</p>
                    </div>
                    <p className="text-green-600">${invoice.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="mb-6">
                <h3 className="text-gray-900">Recent Notifications</h3>
              </div>

              <div className="space-y-4">
                {recentNotifications.map(notification => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                    >
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          notification.type === 'success'
                            ? 'text-green-500'
                            : notification.type === 'warning'
                            ? 'text-orange-500'
                            : 'text-blue-500'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 mb-1">{notification.message}</p>
                        <p className="text-xs text-gray-400">{notification.timestamp}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}