import { useState } from 'react';
import {
  Search,
  User,
  LayoutDashboard,
  Package,
  Warehouse,
  Truck,
  LogOut,
} from 'lucide-react';
import { Product } from '../services/api';

interface ProductManagerProps {
  products: Product[];
  onBack: () => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, product: Product) => void;
  onDeleteProduct: (id: string) => void;
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

export function ProductManager({ products, onBack }: ProductManagerProps) {
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl">Product Manager</h2>
        </div>

        <nav className="flex-1 p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 bg-blue-600 text-white">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Exit Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">Product Manager Dashboard</h1>
              <p className="text-gray-600 text-sm">Manage your pharmacy inventory and orders</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>

              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <User className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div>
            <h2 className="text-gray-900 mb-6">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-gray-900">{products.length}</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Low Stock Items</p>
                  <Warehouse className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-gray-900">{lowStockProducts.length}</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Out of Stock</p>
                  <Warehouse className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-gray-900">{outOfStockProducts.length}</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Pending Deliveries</p>
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-gray-900">
                  {deliveries.filter(d => d.status === 'pending').length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-gray-900 mb-4">Low Stock Alert</h3>
                <div className="space-y-3">
                  {lowStockProducts.slice(0, 5).map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="text-gray-900 text-sm">{product.name}</p>
                        <p className="text-gray-500 text-xs">{product.category}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        {product.stockCount} left
                      </span>
                    </div>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">No low stock items</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-gray-900 mb-4">Recent Comments</h3>
                <div className="space-y-3">
                  {comments.slice(0, 5).map(comment => (
                    <div key={comment.id} className="py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-gray-900 text-sm">{comment.customerName}</p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            comment.approved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {comment.approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">{comment.productName}</p>
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
