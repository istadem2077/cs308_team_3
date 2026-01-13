import { useState, useEffect } from 'react';
import {
  Search,
  User,
  LayoutDashboard,
  LogOut,
  TrendingUp,
  DollarSign,
  FileText,
  TrendingDown,
  RotateCcw,
  Bell,
  Calendar,
  Loader2
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
import { salesManagerAPI } from '../../services/managerApi';

interface RevenueProfitProps {
  onBack: () => void;
  onLogout: () => void; // Added prop
  onNavigate: (tab: string) => void;
}

interface ChartDataPoint {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export function RevenueProfit({ onBack, onNavigate , onLogout}: RevenueProfitProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Stats Date Range (Defaults to current month)
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  // Chart Year Selection
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [stats, setStats] = useState({
    revenue: 0,
    profit: 0,
    orderCount: 0,
    cost: 0
  });

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);

  // Fetch Totals when date range changes
  useEffect(() => {
    fetchStats();
  }, [startDate, endDate]);

  // Fetch Trend Charts when year changes
  useEffect(() => {
    fetchMonthlyTrend(selectedYear);
  }, [selectedYear]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      // Backend expects ISO DateTime (e.g., 2023-01-01T00:00:00)
      // Append time to ensure full coverage of the selected days
      const startISO = new Date(`${startDate}T00:00:00`).toISOString();
      const endISO = new Date(`${endDate}T23:59:59`).toISOString();

      const data = await salesManagerAPI.getFinancialReport(startISO, endISO);

      setStats({
        revenue: data.revenue || 0,
        profit: data.profit || 0,
        orderCount: data.orderCount || 0,
        cost: (data.revenue || 0) - (data.profit || 0)
      });
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchMonthlyTrend = async (year: number) => {
    try {
      setLoadingCharts(true);
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      // Create an array of promises to fetch data for each month in parallel
      const promises = months.map(async (monthName, index) => {
        // Construct start/end for specific month
        const startOfMonth = new Date(year, index, 1);
        const endOfMonth = new Date(year, index + 1, 0, 23, 59, 59); // Last day of month

        const startISO = startOfMonth.toISOString();
        const endISO = endOfMonth.toISOString();

        try {
          const result = await salesManagerAPI.getFinancialReport(startISO, endISO);
          return {
            month: monthName,
            revenue: result.revenue || 0,
            profit: result.profit || 0,
            cost: (result.revenue || 0) - (result.profit || 0)
          };
        } catch (err) {
          console.error(`Error fetching data for ${monthName}`, err);
          return { month: monthName, revenue: 0, profit: 0, cost: 0 };
        }
      });

      const results = await Promise.all(promises);
      setChartData(results);

    } catch (error) {
      console.error("Failed to fetch chart trend", error);
    } finally {
      setLoadingCharts(false);
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
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

                {/* Update User Button */}
                <button
                    onClick={onLogout}
                    className="w-11 h-11 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center hover:from-blue-100 hover:to-blue-200 transition-all duration-200"
                    title="Logout"
                >
                  <User className="w-5 h-5 text-blue-700" />
                </button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-8 overflow-y-auto">
            {/* Analysis Period for Totals */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                Analysis Period (For Totals)
              </h3>

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
                    <p className="text-3xl text-blue-600">
                      {loadingStats ? <Loader2 className="w-6 h-6 animate-spin"/> : `$${stats.revenue.toLocaleString()}`}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500">Selected period aggregate</p>
              </div>

              {/* Total Cost */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Cost (Calculated)</p>
                    <p className="text-3xl text-orange-600">
                      {loadingStats ? <Loader2 className="w-6 h-6 animate-spin"/> : `$${stats.cost.toLocaleString()}`}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500">Revenue - Profit</p>
              </div>

              {/* Total Profit */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Profit</p>
                    <p className="text-3xl text-green-600">
                      {loadingStats ? <Loader2 className="w-6 h-6 animate-spin"/> : `$${stats.profit.toLocaleString()}`}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500">Net earnings</p>
              </div>
            </div>

            {/* Charts Section with Year Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900">Revenue & Profit Trend</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Select Year:</span>
                  <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loadingCharts ? (
                  <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-2" />
                      <p className="text-gray-500">Loading monthly data...</p>
                    </div>
                  </div>
              ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
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
              )}
            </div>

            {/* Line Chart Analysis */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="text-gray-900 mb-6">Trend Analysis</h3>
              {loadingCharts ? (
                  <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-xl">
                    <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  </div>
              ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
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
                          dataKey="profit"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ fill: '#10b981', r: 4 }}
                          name="Profit"
                      />
                    </LineChart>
                  </ResponsiveContainer>
              )}
            </div>
          </main>
        </div>
      </div>
  );
}