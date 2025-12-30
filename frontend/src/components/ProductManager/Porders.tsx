import { useState } from 'react';
import {
  Search,
  User,
  LayoutDashboard,
  Package,
  LogOut,
  FolderTree,
  ShoppingBag,
  Warehouse,
  Truck,
  Eye,
  X,
} from 'lucide-react';

export interface Order {
  id: string;
  customerId: string;
  productName: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: 'completed' | 'pending' | 'cancelled';
  deliveryAddress?: string;
  orderDate?: string;
}

interface PordersProps {
  orders: Order[];
  onBack: () => void;
  onNavigate: (tab: string) => void;
  onUpdateOrderStatus: (id: string, status: 'completed' | 'pending' | 'cancelled') => void;
}

export function Porders({ orders, onBack, onNavigate, onUpdateOrderStatus }: PordersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(
    order =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return (
        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
          Completed
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
          Pending
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
          Cancelled
        </span>
      );
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg">Product Manager</h2>
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
              onClick={() => onNavigate('categories')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <FolderTree className="w-5 h-5" />
              <span>Categories</span>
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Products</span>
            </button>
            <button
              onClick={() => onNavigate('stock')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <Warehouse className="w-5 h-5" />
              <span>Stock Management</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
              <Truck className="w-5 h-5" />
              <span>Deliveries & Orders</span>
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
              <h1 className="text-gray-900 mb-1">Deliveries & Orders</h1>
              <p className="text-gray-500 text-sm">Manage customer orders and deliveries</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-gray-50"
                />
              </div>

              <button className="w-11 h-11 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
                <User className="w-5 h-5 text-blue-700" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-gray-900">Deliveries & Orders</h3>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Delivery ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Customer ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Product ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <span className="text-gray-900">{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-blue-600">{order.customerId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">{order.productName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">{order.productId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">{order.quantity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">₺{order.totalPrice.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {order.status === 'pending' ? (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 text-xs"
                            >
                              Mark Complete
                            </button>
                          ) : order.status === 'completed' ? (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'pending')}
                              className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200 text-xs"
                            >
                              Mark Pending
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">Order Details</h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedOrder(null);
                  }}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Delivery ID</label>
                  <p className="text-gray-900">{selectedOrder.id}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">Customer ID</label>
                  <p className="text-blue-600">{selectedOrder.customerId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Product</label>
                  <p className="text-gray-900">{selectedOrder.productName}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">Product ID</label>
                  <p className="text-gray-900">{selectedOrder.productId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Quantity</label>
                  <p className="text-gray-900">{selectedOrder.quantity}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">Total Price</label>
                  <p className="text-gray-900">₺{selectedOrder.totalPrice.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Status</label>
                {getStatusBadge(selectedOrder.status)}
              </div>

              {selectedOrder.deliveryAddress && (
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Delivery Address</label>
                  <p className="text-gray-900">{selectedOrder.deliveryAddress}</p>
                </div>
              )}

              {selectedOrder.orderDate && (
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Order Date</label>
                  <p className="text-gray-900">{selectedOrder.orderDate}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
