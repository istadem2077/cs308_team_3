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
  CheckCircle,
  XCircle,
  Clock,
  Package,
  AlertCircle,
  X,
} from 'lucide-react';

interface RefundManagementProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

interface RefundRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  productImage?: string;
  quantity: number;
  purchaseDate: string;
  requestDate: string;
  originalPrice: number;
  discount: number;
  refundAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  orderId: string;
}

export function RefundManagement({ onBack, onNavigate }: RefundManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([
    {
      id: 'REF-001',
      orderId: 'ORD-12345',
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      productName: 'Aspirin 500mg - Pain Relief',
      quantity: 2,
      purchaseDate: '2024-11-20',
      requestDate: '2024-12-10',
      originalPrice: 24.99,
      discount: 5.0,
      refundAmount: 39.98,
      reason: 'Product arrived damaged',
      status: 'pending',
    },
    {
      id: 'REF-002',
      orderId: 'ORD-12346',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@email.com',
      productName: 'Vitamin C 1000mg - 60 Tablets',
      quantity: 1,
      purchaseDate: '2024-11-25',
      requestDate: '2024-12-12',
      originalPrice: 15.99,
      discount: 0.0,
      refundAmount: 15.99,
      reason: 'Wrong product received',
      status: 'pending',
    },
    {
      id: 'REF-003',
      orderId: 'ORD-12347',
      customerName: 'Bob Johnson',
      customerEmail: 'bob.johnson@email.com',
      productName: 'Hand Sanitizer 500ml',
      quantity: 3,
      purchaseDate: '2024-12-01',
      requestDate: '2024-12-14',
      originalPrice: 12.99,
      discount: 2.0,
      refundAmount: 34.97,
      reason: 'No longer needed',
      status: 'approved',
    },
    {
      id: 'REF-004',
      orderId: 'ORD-12348',
      customerName: 'Alice Brown',
      customerEmail: 'alice.brown@email.com',
      productName: 'Face Masks (50 pack)',
      quantity: 1,
      purchaseDate: '2024-11-28',
      requestDate: '2024-12-11',
      originalPrice: 29.99,
      discount: 0.0,
      refundAmount: 29.99,
      reason: 'Product quality issue',
      status: 'rejected',
    },
    {
      id: 'REF-005',
      orderId: 'ORD-12349',
      customerName: 'Michael Chen',
      customerEmail: 'michael.chen@email.com',
      productName: 'Blood Pressure Monitor',
      quantity: 1,
      purchaseDate: '2024-12-05',
      requestDate: '2024-12-15',
      originalPrice: 89.99,
      discount: 10.0,
      refundAmount: 79.99,
      reason: 'Not as described',
      status: 'pending',
    },
    {
      id: 'REF-006',
      orderId: 'ORD-12350',
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah.wilson@email.com',
      productName: 'Multivitamin Gummies - 90 Count',
      quantity: 2,
      purchaseDate: '2024-12-03',
      requestDate: '2024-12-16',
      originalPrice: 19.99,
      discount: 0.0,
      refundAmount: 39.98,
      reason: 'Changed mind',
      status: 'approved',
    },
  ]);

  const handleApproveRefund = (refundId: string) => {
    setRefundRequests(prev =>
      prev.map(request =>
        request.id === refundId ? { ...request, status: 'approved' as const } : request
      )
    );
    setShowDetailsModal(false);
    setSelectedRequest(null);
  };

  const handleRejectRefund = (refundId: string) => {
    setRefundRequests(prev =>
      prev.map(request =>
        request.id === refundId ? { ...request, status: 'rejected' as const } : request
      )
    );
    setShowDetailsModal(false);
    setSelectedRequest(null);
  };

  const handleViewDetails = (request: RefundRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Filter refund requests
  const filteredRequests = refundRequests.filter(request => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.orderId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = refundRequests.filter(r => r.status === 'pending').length;
  const approvedCount = refundRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = refundRequests.filter(r => r.status === 'rejected').length;

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
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg mb-2">
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
              <h1 className="text-gray-900 mb-1">Refund Management</h1>
              <p className="text-sm text-gray-500">Review and authorize refund requests</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search refunds..."
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
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Total Requests</p>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl text-gray-900 mb-1">{refundRequests.length}</p>
              <p className="text-xs text-gray-500">All time</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Pending</p>
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <p className="text-3xl text-yellow-600 mb-1">{pendingCount}</p>
              <p className="text-xs text-gray-500">Awaiting review</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Approved</p>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl text-green-600 mb-1">{approvedCount}</p>
              <p className="text-xs text-gray-500">Authorized</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Rejected</p>
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <p className="text-3xl text-red-600 mb-1">{rejectedCount}</p>
              <p className="text-xs text-gray-500">Declined</p>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6 flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                statusFilter === 'all'
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Requests ({refundRequests.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                statusFilter === 'pending'
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                statusFilter === 'approved'
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                statusFilter === 'rejected'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Refund Requests List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
              <h3 className="text-gray-900">Refund Requests</h3>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredRequests.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No refund requests found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredRequests.map(request => (
                  <div
                    key={request.id}
                    className="px-6 py-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 grid grid-cols-5 gap-4">
                        {/* Request Info */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Request ID</p>
                          <p className="text-sm text-gray-900 mb-1">{request.id}</p>
                          <p className="text-xs text-gray-500">Order: {request.orderId}</p>
                        </div>

                        {/* Customer Info */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Customer</p>
                          <p className="text-sm text-gray-900 mb-1">{request.customerName}</p>
                          <p className="text-xs text-gray-500">{request.customerEmail}</p>
                        </div>

                        {/* Product Info */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Product</p>
                          <p className="text-sm text-gray-900 mb-1">{request.productName}</p>
                          <p className="text-xs text-gray-500">Qty: {request.quantity}</p>
                        </div>

                        {/* Dates */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Dates</p>
                          <p className="text-sm text-gray-900 mb-1">Purchased: {request.purchaseDate}</p>
                          <p className="text-xs text-gray-500">Requested: {request.requestDate}</p>
                        </div>

                        {/* Amount */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Refund Amount</p>
                          <p className="text-lg text-green-600 mb-1">₺{request.refundAmount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Original: ₺{request.originalPrice.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${getStatusStyle(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="capitalize">{request.status}</span>
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>

                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveRefund(request.id)}
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs flex items-center gap-1"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRefund(request.id)}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Reason for Refund:</p>
                      <p className="text-sm text-gray-700">{request.reason}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 mb-1">Refund Request Details</h3>
                  <p className="text-sm text-gray-500">{selectedRequest.id}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedRequest(null);
                  }}
                  className="w-8 h-8 bg-white hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div>
                <h4 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm text-gray-900">{selectedRequest.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm text-gray-900">{selectedRequest.customerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div>
                <h4 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Product Information
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Product:</span>
                    <span className="text-sm text-gray-900">{selectedRequest.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <span className="text-sm text-gray-900">{selectedRequest.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Order ID:</span>
                    <span className="text-sm text-gray-900">{selectedRequest.orderId}</span>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <h4 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Financial Details
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Original Price:</span>
                    <span className="text-sm text-gray-900">₺{selectedRequest.originalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Discount Applied:</span>
                    <span className="text-sm text-red-600">-₺{selectedRequest.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-900">Refund Amount:</span>
                    <span className="text-lg text-green-600">₺{selectedRequest.refundAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h4 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timeline
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Purchase Date:</span>
                    <span className="text-sm text-gray-900">{selectedRequest.purchaseDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Request Date:</span>
                    <span className="text-sm text-gray-900">{selectedRequest.requestDate}</span>
                  </div>
                </div>
              </div>

              {/* Refund Reason */}
              <div>
                <h4 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Refund Reason
                </h4>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-gray-900">{selectedRequest.reason}</p>
                </div>
              </div>

              {/* Current Status */}
              <div>
                <h4 className="text-sm text-gray-700 mb-3">Current Status</h4>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${getStatusStyle(selectedRequest.status)}`}>
                  {getStatusIcon(selectedRequest.status)}
                  <span className="capitalize">{selectedRequest.status}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedRequest.status === 'pending' && (
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedRequest(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectRefund(selectedRequest.id)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Refund
                </button>
                <button
                  onClick={() => handleApproveRefund(selectedRequest.id)}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Refund
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
