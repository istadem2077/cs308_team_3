import { useState } from 'react';
import {
  Search,
  User,
  LayoutDashboard,
  Package,
  Warehouse,
  Truck,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Star,
  TrendingUp,
  Calendar,
  MessageSquare,
  FolderTree,
  ShoppingBag,
} from 'lucide-react';
import { Product } from '../../services/api';

interface PdashboardProps {
  products: Product[];
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

interface Delivery {
  id: string;
  customerId: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  address: string;
  status: 'completed' | 'pending';
  date: string;
}

interface Comment {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  comment: string;
  rating: number;
  date: string;
  approved: boolean;
}

export function Pdashboard({ products, onBack, onNavigate }: PdashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock deliveries data
  const deliveries: Delivery[] = [
    {
      id: 'DEL-001',
      customerId: 'CUST-123',
      productId: '1',
      productName: 'Aspirin 500mg',
      quantity: 2,
      totalPrice: 39.98,
      address: 'Sabanci University, Orta Mahalle, Tuzla, Istanbul, Turkey',
      status: 'completed',
      date: '2024-12-15',
    },
    {
      id: 'DEL-002',
      customerId: 'CUST-456',
      productId: '2',
      productName: 'Vitamin C 1000mg',
      quantity: 1,
      totalPrice: 24.99,
      address: 'Sabanci University, Student Dorms, Tuzla, Istanbul, Turkey',
      status: 'pending',
      date: '2024-12-16',
    },
    {
      id: 'DEL-003',
      customerId: 'CUST-789',
      productId: '3',
      productName: 'Bandages Pack',
      quantity: 3,
      totalPrice: 44.97,
      address: 'Sabanci University, Faculty Building, Tuzla, Istanbul, Turkey',
      status: 'pending',
      date: '2024-12-16',
    },
  ];

  // Mock comments data
  const comments: Comment[] = [
    {
      id: 'CMT-001',
      productId: '1',
      productName: 'Aspirin 500mg',
      customerName: 'Ahmet Yilmaz',
      comment: 'Very effective for headaches. Quick delivery!',
      rating: 5,
      date: '2024-12-14',
      approved: true,
    },
    {
      id: 'CMT-002',
      productId: '2',
      productName: 'Vitamin C 1000mg',
      customerName: 'Elif Demir',
      comment: 'Great quality vitamins. Been using for a month now.',
      rating: 4,
      date: '2024-12-15',
      approved: false,
    },
    {
      id: 'CMT-003',
      productId: '3',
      productName: 'Bandages Pack',
      customerName: 'Mehmet Kaya',
      comment: 'Good value for money. Essential for first aid kit.',
      rating: 5,
      date: '2024-12-15',
      approved: false,
    },
  ];

  const lowStockProducts = products.filter(p => p.stockCount > 0 && p.stockCount <= 10);
  const outOfStockProducts = products.filter(p => p.stockCount === 0);
  const inStockProducts = products.filter(p => p.stockCount > 10);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockCount), 0);
  const avgRating = products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length;
  const pendingComments = comments.filter(c => !c.approved).length;

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
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg mb-2">
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Products</span>
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
              <p className="text-gray-500 text-sm">Monitor your pharmacy inventory and performance</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products..."
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
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Products Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Active
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-1">Total Products</p>
              <p className="text-3xl text-gray-900 mb-1">{products.length}</p>
              <p className="text-xs text-gray-400">{inStockProducts.length} in stock</p>
            </div>

            {/* Low Stock Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                {lowStockProducts.length > 0 && (
                  <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                    Attention
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mb-1">Low Stock Items</p>
              <p className="text-3xl text-gray-900 mb-1">{lowStockProducts.length}</p>
              <p className="text-xs text-gray-400">Requires restocking</p>
            </div>

            {/* Out of Stock Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Warehouse className="w-6 h-6 text-red-600" />
                </div>
                {outOfStockProducts.length > 0 && (
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    Critical
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mb-1">Out of Stock</p>
              <p className="text-3xl text-gray-900 mb-1">{outOfStockProducts.length}</p>
              <p className="text-xs text-gray-400">Immediate action needed</p>
            </div>

            {/* Pending Deliveries Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  In Transit
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-1">Pending Deliveries</p>
              <p className="text-3xl text-gray-900 mb-1">
                {deliveries.filter(d => d.status === 'pending').length}
              </p>
              <p className="text-xs text-gray-400">{deliveries.filter(d => d.status === 'completed').length} completed</p>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <p className="text-sm text-blue-100">Total Inventory Value</p>
              </div>
              <p className="text-3xl mb-1">₺{totalValue.toFixed(2)}</p>
              <p className="text-xs text-blue-200">Current stock valuation</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5" />
                </div>
                <p className="text-sm text-green-100">Average Rating</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl mb-1">{avgRating.toFixed(1)}</p>
                <p className="text-sm text-green-200">/ 5.0</p>
              </div>
              <p className="text-xs text-green-200">Customer satisfaction</p>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <p className="text-sm text-orange-100">Pending Reviews</p>
              </div>
              <p className="text-3xl mb-1">{pendingComments}</p>
              <p className="text-xs text-orange-200">{comments.length} total reviews</p>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock Alert */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-orange-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    </div>
                    <h3 className="text-gray-900">Low Stock Alert</h3>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                    {lowStockProducts.length} items
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {lowStockProducts.slice(0, 5).map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex-1">
                        <p className="text-gray-900 mb-1">{product.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{product.category}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">₺{product.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          <Warehouse className="w-3.5 h-3.5" />
                          {product.stockCount} left
                        </span>
                      </div>
                    </div>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">All products are well stocked!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Comments */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-gray-900">Recent Reviews</h3>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {comments.length} total
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {comments.slice(0, 5).map(comment => (
                    <div key={comment.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-gray-900">{comment.customerName}</p>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < comment.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{comment.productName}</p>
                          {comment.comment && (
                            <p className="text-sm text-gray-600 line-clamp-2">{comment.comment}</p>
                          )}
                        </div>
                        <span
                          className={`ml-3 px-2.5 py-1 rounded-full text-xs whitespace-nowrap ${
                            comment.approved
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {comment.approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(comment.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}