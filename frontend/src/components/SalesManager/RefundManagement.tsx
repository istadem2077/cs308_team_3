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
  RotateCcw,
  Bell,
} from 'lucide-react';

interface RefundManagementProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

interface RefundRequest {
  id: string;
  customerName: string;
  productName: string;
  purchaseDate: string;
  requestDate: string;
  originalPrice: number;
  discount: number;
  refundAmount: number;
  status: 'requested' | 'product-received' | 'approved' | 'rejected';
}

export function RefundManagement({ onBack, onNavigate }: RefundManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const [refundRequests] = useState<RefundRequest[]>([
    {
      id: 'REF-001',
      customerName: 'John Doe',
      productName: 'Aspirin 500mg',
      purchaseDate: '2024-11-20',
      requestDate: '2024-12-10',
      originalPrice: 24.99,
      discount: 5.0,
      refundAmount: 19.99,
      status: 'requested',
    },
    {
      id: 'REF-002',
      customerName: 'Jane Smith',
      productName: 'Vitamin C 1000mg',
      purchaseDate: '2024-11-25',
      requestDate: '2024-12-12',
      originalPrice: 15.99,
      discount: 0.0,
      refundAmount: 15.99,
      status: 'product-received',
    },
    {
      id: 'REF-003',
      customerName: 'Bob Johnson',
      productName: 'Hand Sanitizer 500ml',
      purchaseDate: '2024-12-01',
      requestDate: '2024-12-14',
      originalPrice: 12.99,
      discount: 2.0,
      refundAmount: 10.99,
      status: 'approved',
    },
    {
      id: 'REF-004',
      customerName: 'Alice Brown',
      productName: 'Face Masks (50 pack)',
      purchaseDate: '2024-11-28',
      requestDate: '2024-12-11',
      originalPrice: 29.99,
      discount: 0.0,
      refundAmount: 29.99,
      status: 'rejected',
    },
  ]);

  const handleViewRefund = (refundId: string) => {
    alert(`Viewing refund request: ${refundId}`);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'product-received':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter refund requests by search query
  const filteredRequests = refundRequests.filter(
    request =>
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.productName.toLowerCase().includes(searchQuery.toLowerCase())
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg mb-2"
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
              <h1 className="text-gray-900">Refund Management</h1>
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
          {/* Refund Requests Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-gray-900">Refund Requests</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Request ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Customer Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Purchase Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Request Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Original Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Discount
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Refund Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                        No refund requests found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map(request => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {request.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {request.customerName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {request.productName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {request.purchaseDate}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {request.requestDate}
                        </td>
                        <td className="px-6 py-4 text-sm text-green-600">
                          ${request.originalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-red-600">
                          ${request.discount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-green-600">
                          ${request.refundAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusStyle(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewRefund(request.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
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