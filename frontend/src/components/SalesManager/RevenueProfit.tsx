import { useState } from 'react';
import {
  Search,
  User,
  LayoutDashboard,
  LogOut,
  TrendingUp,
  DollarSign,
  FileText,
  TrendingDown,
  AlertCircle,
  RotateCcw,
  Bell,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface RevenueProfitProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

export function RevenueProfit({ onBack, onNavigate }: RevenueProfitProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');

  // Monthly data for charts
  const monthlyData = [
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

  // Calculate totals
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCost = monthlyData.reduce((sum, item) => sum + item.cost, 0);
  const totalProfit = totalRevenue - totalCost;

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
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg mb-2">
              <TrendingUp className="w-5 h-5" />
              <span>Revenue & Profit</span>
            </button>
            <button
              onClick={() => onNavigate('refunds')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Refund Management</span>
            </button>
            <button
              onClick={() => onNavigate('notifications')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white"
            >
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
              <h1 className="text-gray-900">Revenue & Profit Analysis</h1>
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
          {/* Analysis Period */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-gray-900 mb-4">Analysis Period</h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl text-blue-600">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500">All sales combined</p>
            </div>

            {/* Estimated Cost */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                  <p className="text-3xl text-orange-600">${totalCost.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500">Default: 50% of sale price</p>
            </div>

            {/* Net Profit */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Net Profit</p>
                  <p className="text-3xl text-green-600">${totalProfit.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500">Revenue - Cost</p>
            </div>
          </div>

          {/* Bar Chart - Revenue, Cost & Profit Trend */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-gray-900 mb-6">Revenue, Cost & Profit Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                <Bar dataKey="cost" fill="#f97316" name="Cost" />
                <Bar dataKey="profit" fill="#10b981" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart Analysis */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-gray-900 mb-6">Line Chart Analysis</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ fill: '#f97316', r: 4 }}
                  name="Cost"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Calculation Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-900">
                <span className="font-medium">Cost Calculation Note:</span>
              </p>
              <p className="text-sm text-amber-800 mt-1">
                By default, product cost is calculated as 50% of the sale price. If the Product Manager has specified a custom cost for any product, that custom value will be used instead and indicated in the product details.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}