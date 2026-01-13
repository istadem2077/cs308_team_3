import { useState, useEffect } from 'react';
import {
  Search, User, LayoutDashboard, LogOut, TrendingUp, DollarSign, FileText,
  Eye, RotateCcw, Bell, CheckCircle, XCircle, Clock, Package, AlertCircle, X, Loader2
} from 'lucide-react';
import { productManagerAPI } from '../../services/managerApi'; // Using this to fetch orders
import { OrderResponse } from '../../services/api';

interface RefundManagementProps {
  onBack: () => void;
  onNavigate: (tab: string) => void;

}

// Extended interface to match backend OrderResponseDto
interface RefundRequest {
  id: string; // Order ID
  customerName: string;
  customerEmail: string; // May not be in OrderResponse, placeholder or needs fetch
  productName: string; // Summary of products
  quantity: number; // Total items
  purchaseDate: string;
  requestDate: string; // Using UpdatedAt or similar if avail, else OrderDate
  originalPrice: number;
  refundAmount: number;
  reason: string;
  status: 'RETURN_REQUESTED' | 'REFUNDED' | 'RETURN_REJECTED';
}

export function RefundManagement({ onBack, onNavigate }: RefundManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRefundRequests();
  }, []);

  const fetchRefundRequests = async () => {
    try {
      setLoading(true);
      const orders = await productManagerAPI.getDeliveries(); // Fetches all orders

      // Filter for return-related statuses
      const returns = orders
          .filter((order: any) => ['RETURN_REQUESTED', 'REFUNDED', 'RETURN_REJECTED'].includes(order.status))
          .map((order: any) => ({
            id: order.orderId.toString(),
            customerName: order.userName || 'Unknown Customer',
            customerEmail: 'Contact Support', // Backend DTO update needed for email
            productName: order.items.map((i: any) => i.productName).join(', '),
            quantity: order.items.reduce((sum: number, i: any) => sum + i.quantity, 0),
            purchaseDate: new Date(order.orderDate).toLocaleDateString(),
            requestDate: new Date(order.orderDate).toLocaleDateString(), // Ideally fetch update time
            originalPrice: order.totalAmount,
            refundAmount: order.totalAmount,
            reason: 'Customer requested return via portal',
            status: order.status
          }));

      setRefundRequests(returns);
    } catch (error) {
      console.error("Failed to fetch refund requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      // Use correct endpoint (Assuming productManagerAPI has generic update or we add one)
      // We'll use the one mapped in managerApi, but note the endpoint in backend is /api/orders/{id}/status
      await productManagerAPI.updateOrderStatus(orderId, status);

      // Refresh list
      fetchRefundRequests();
      setShowDetailsModal(false);
      setSelectedRequest(null);
    } catch (error) {
      alert("Failed to update refund status.");
    }
  };

  const handleViewDetails = (request: RefundRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'RETURN_REQUESTED': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'REFUNDED': return 'bg-green-100 text-green-800 border border-green-200';
      case 'RETURN_REJECTED': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RETURN_REQUESTED': return <Clock className="w-4 h-4" />;
      case 'REFUNDED': return <CheckCircle className="w-4 h-4" />;
      case 'RETURN_REJECTED': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredRequests = refundRequests.filter(request => {
    const matchesSearch = request.id.includes(searchQuery) || request.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'pending') return matchesSearch && request.status === 'RETURN_REQUESTED';
    if (statusFilter === 'approved') return matchesSearch && request.status === 'REFUNDED';
    if (statusFilter === 'rejected') return matchesSearch && request.status === 'RETURN_REJECTED';
    return matchesSearch;
  });

  const pendingCount = refundRequests.filter(r => r.status === 'RETURN_REQUESTED').length;
  const approvedCount = refundRequests.filter(r => r.status === 'REFUNDED').length;
  const rejectedCount = refundRequests.filter(r => r.status === 'RETURN_REJECTED').length;

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
            {/* Navigation buttons */}
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
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg mb-2">
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
            {/* ... Header Content ... */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 mb-1">Refund Management</h1>
                <p className="text-sm text-gray-500">Review and authorize refund requests</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search refunds..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl w-80 bg-gray-50" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-y-auto">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-3xl text-gray-900 mb-1">{loading ? "..." : refundRequests.length}</p>
              </div>
              {/* ... Other stats cards using counts ... */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl text-yellow-600 mb-1">{loading ? "..." : pendingCount}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl text-green-600 mb-1">{loading ? "..." : approvedCount}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-3xl text-red-600 mb-1">{loading ? "..." : rejectedCount}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6 flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map(status => (
                  <button
                      key={status}
                      onClick={() => setStatusFilter(status as any)}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm capitalize ${statusFilter === status ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {status}
                  </button>
              ))}
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div> : (
                  <div className="divide-y divide-gray-100">
                    {filteredRequests.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500">No requests found</div>
                    ) : (
                        filteredRequests.map(request => (
                            <div key={request.id} className="px-6 py-5 hover:bg-gray-50">
                              <div className="flex items-start justify-between gap-6">
                                {/* Request Summary */}
                                <div className="flex-1 grid grid-cols-4 gap-4">
                                  <div><p className="text-xs text-gray-500">Order ID</p><p className="text-sm font-medium">#{request.id}</p></div>
                                  <div><p className="text-xs text-gray-500">Customer</p><p className="text-sm">{request.customerName}</p></div>
                                  <div><p className="text-xs text-gray-500">Amount</p><p className="text-sm text-green-600">${request.refundAmount.toFixed(2)}</p></div>
                                  <div><p className="text-xs text-gray-500">Status</p>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${getStatusStyle(request.status)}`}>
                                    {getStatusIcon(request.status)} {request.status.replace('RETURN_', '')}
                                </span>
                                  </div>
                                </div>
                                {/* Actions */}
                                <div className="flex gap-2">
                                  <button onClick={() => handleViewDetails(request)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"><Eye className="w-4 h-4"/></button>
                                  {request.status === 'RETURN_REQUESTED' && (
                                      <>
                                        <button onClick={() => handleUpdateStatus(request.id, 'REFUNDED')} className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100"><CheckCircle className="w-4 h-4"/></button>
                                        <button onClick={() => handleUpdateStatus(request.id, 'RETURN_REJECTED')} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><XCircle className="w-4 h-4"/></button>
                                      </>
                                  )}
                                </div>
                              </div>
                            </div>
                        ))
                    )}
                  </div>
              )}
            </div>
          </main>
        </div>

        {/* Detail Modal (Simpler version) */}
        {showDetailsModal && selectedRequest && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-lg w-full">
                <h3 className="text-lg font-bold mb-4">Refund Details #{selectedRequest.id}</h3>
                <div className="space-y-2 mb-6">
                  <p><span className="font-medium">Customer:</span> {selectedRequest.customerName}</p>
                  <p><span className="font-medium">Products:</span> {selectedRequest.productName}</p>
                  <p><span className="font-medium">Reason:</span> {selectedRequest.reason}</p>
                  <p><span className="font-medium">Amount:</span> ${selectedRequest.refundAmount}</p>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Close</button>
                  {selectedRequest.status === 'RETURN_REQUESTED' && (
                      <>
                        <button onClick={() => handleUpdateStatus(selectedRequest.id, 'RETURN_REJECTED')} className="px-4 py-2 bg-red-600 text-white rounded-lg">Reject</button>
                        <button onClick={() => handleUpdateStatus(selectedRequest.id, 'REFUNDED')} className="px-4 py-2 bg-green-600 text-white rounded-lg">Approve</button>
                      </>
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
  );
}