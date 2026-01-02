import { useState } from 'react';
import {
  Search,
  User,
  LayoutDashboard,
  LogOut,
  TrendingUp,
  DollarSign,
  FileText,
  Eye,
  Printer,
  Download,
  RotateCcw,
  Bell,
} from 'lucide-react';

interface InvoiceManagementProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

interface Invoice {
  id: string;
  customerId: string;
  products: string;
  quantity: number;
  totalPrice: number;
  date: string;
}

export function InvoiceManagement({ onBack, onNavigate }: InvoiceManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');

  const [invoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      customerId: 'CUST-123',
      products: 'Aspirin 500mg, Vitamin C',
      quantity: 3,
      totalPrice: 45.99,
      date: '2024-12-10',
    },
    {
      id: 'INV-002',
      customerId: 'CUST-456',
      products: 'Hand Sanitizer',
      quantity: 2,
      totalPrice: 19.98,
      date: '2024-12-12',
    },
    {
      id: 'INV-003',
      customerId: 'CUST-789',
      products: 'Face Masks, Thermometer',
      quantity: 15,
      totalPrice: 85.5,
      date: '2024-12-14',
    },
    {
      id: 'INV-004',
      customerId: 'CUST-234',
      products: 'Ibuprofen 400mg',
      quantity: 1,
      totalPrice: 12.99,
      date: '2024-12-15',
    },
    {
      id: 'INV-005',
      customerId: 'CUST-567',
      products: 'Multivitamin Complex, Vitamin D3',
      quantity: 4,
      totalPrice: 120.0,
      date: '2024-12-16',
    },
    {
      id: 'INV-006',
      customerId: 'CUST-890',
      products: 'Paracetamol 500mg',
      quantity: 2,
      totalPrice: 90.0,
      date: '2024-12-18',
    },
  ]);

  const handleViewInvoice = (invoiceId: string) => {
    alert(`Viewing invoice: ${invoiceId}`);
  };

  const handlePrintInvoice = (invoiceId: string) => {
    alert(`Printing invoice: ${invoiceId}`);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    alert(`Downloading invoice: ${invoiceId}`);
  };

  // Filter invoices by search query and date range
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.products.toLowerCase().includes(searchQuery.toLowerCase());

    const invoiceDate = new Date(invoice.date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    const matchesDateRange = invoiceDate >= start && invoiceDate <= end;

    return matchesSearch && matchesDateRange;
  });

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
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg mb-2">
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
              <h1 className="text-gray-900">Invoice Management</h1>
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
          {/* Date Range Filter */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-gray-900 mb-4">Date Range Filter</h3>

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

          {/* Invoices Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Invoice ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Customer ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Product(s)
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Total Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        No invoices found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map(invoice => (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {invoice.customerId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {invoice.products}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {invoice.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-green-600">
                          ${invoice.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {invoice.date}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewInvoice(invoice.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePrintInvoice(invoice.id)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Print"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(invoice.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}