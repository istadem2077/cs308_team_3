import { useState, useEffect } from 'react';
import {
  Search, User, LayoutDashboard, LogOut, TrendingUp, DollarSign, FileText,
  Eye, Printer, Download, RotateCcw, Bell
} from 'lucide-react';
import { productManagerAPI } from '../../services/managerApi'; // Using productManagerAPI.getDeliveries as generic order fetcher

interface InvoiceManagementProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

export function InvoiceManagement({ onBack, onNavigate }: InvoiceManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      // Fetch all orders (using the existing endpoint in OrderController which is mapped in managerApi)
      // Note: Reusing getDeliveries as it hits /api/orders/all
      const data = await productManagerAPI.getAllOrders();
      setInvoices(data);
    } catch (error) {
      console.error("Failed to load invoices", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    // FIX: Use 'deliveryId' instead of 'id' and 'customerId' instead of 'userName'
    // Also added safe checks (|| "") to prevent crashes if fields are null
    const idMatch = (invoice.deliveryId?.toString() || "").includes(searchQuery);
    const userMatch = (invoice.productName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (invoice.customerId?.toString() || "").includes(searchQuery);
    return idMatch || userMatch;
  });

  return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Sidebar ... (Keep sidebar same as above) */}
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
            {/* Navigation buttons */}
            <div className="mb-2">
              <p className="text-xs text-gray-400 px-3 mb-2">NAVIGATION</p>
              <button onClick={() => onNavigate('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <LayoutDashboard className="w-5 h-5" /> <span>Dashboard</span>
              </button>
              <button onClick={() => onNavigate('pricing')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <DollarSign className="w-5 h-5" /> <span>Pricing & Discount</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg mb-2">
                <FileText className="w-5 h-5" /> <span>Invoice Management</span>
              </button>
              {/* ... other nav items ... */}
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
              <h1 className="text-gray-900">Invoice Management</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                      type="text"
                      placeholder="Search by ID or Name..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl w-80 bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm text-gray-700">Invoice ID</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">Customer</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">Total Price</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">Actions</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                  {loading ? (
                      <tr><td colSpan={5} className="p-4 text-center">Loading Invoices...</td></tr>
                  ) : filteredInvoices.map(invoice => (
                      <tr key={invoice.orderId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{invoice.orderId}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{invoice.userName}</td>
                        <td className="px-6 py-4 text-sm text-green-600 font-medium">
                          ${invoice.totalAmount?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(invoice.orderDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View"><Eye className="w-4 h-4" /></button>
                            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Print"><Printer className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
  );
}