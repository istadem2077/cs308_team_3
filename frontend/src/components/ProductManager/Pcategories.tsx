import { useState, useEffect } from 'react'; // Import useEffect
import {
  Search,
  LayoutDashboard,
  Package,
  LogOut,
  FolderTree,
  Plus,
  Trash2,
  X,
  Save,
  ShoppingBag,
  Warehouse,
  Truck,
  MessageSquare,
  Loader2 // Import Loader
} from 'lucide-react';
import { Product } from '../../App';
import { productManagerAPI } from '../../services/managerApi'; // Import API

interface PcategoriesProps {
  products: Product[]; // We still keep this to count products per category
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

interface Category {
  id: number;
  name: string;
}

export function Pcategories({ products, onBack, onNavigate }: PcategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: Fetch categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await productManagerAPI.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    try {
      await productManagerAPI.addCategory(newCategoryName);
      await loadCategories(); // Refresh list after add
      setShowAddModal(false);
      setNewCategoryName('');
    } catch (error) {
      alert("Failed to add category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await productManagerAPI.deleteCategory(id.toString());
      await loadCategories(); // Refresh list after delete
    } catch (error) {
      alert("Failed to delete category");
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to count products in a category
  const getProductCount = (categoryName: string) => {
    return products.filter(p => p.category === categoryName).length;
  };

  return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Sidebar (Same as before) */}
        <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
          {/* ... Sidebar code ... */}
          {/* (Keep your existing sidebar navigation code here) */}
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
              <button onClick={() => onNavigate('dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <LayoutDashboard className="w-5 h-5" /> <span>Dashboard</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg mb-2">
                <FolderTree className="w-5 h-5" /> <span>Categories</span>
              </button>
              <button onClick={() => onNavigate('products')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <ShoppingBag className="w-5 h-5" /> <span>Products</span>
              </button>
              <button onClick={() => onNavigate('stock')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <Warehouse className="w-5 h-5" /> <span>Stock Management</span>
              </button>
              <button onClick={() => onNavigate('orders')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2">
                <Truck className="w-5 h-5" /> <span>Deliveries & Orders</span>
              </button>
              <button onClick={() => onNavigate('reviews')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white">
                <MessageSquare className="w-5 h-5" /> <span>Comments & Reviews</span>
              </button>
            </div>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white">
              <LogOut className="w-5 h-5" /> <span>Exit Dashboard</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 mb-1">Categories</h1>
                <p className="text-gray-500 text-sm">Manage product categories</p>
              </div>
              <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                      type="text"
                      placeholder="Search categories..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FolderTree className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-gray-900">All Categories</h3>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>

              {/* Categories Table */}
              {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
              ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Category Name</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Products Count</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                      {filteredCategories.map(category => {
                        const count = getProductCount(category.name);
                        return (
                            <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-6 py-4">
                                <span className="text-gray-900 font-medium">{category.name}</span>
                              </td>
                              <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                                {count} products
                            </span>
                              </td>
                              <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${
                                count > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {count > 0 ? 'Active' : 'Empty'}
                            </span>
                              </td>
                              <td className="px-6 py-4">
                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                    title="Delete Category"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                        );
                      })}
                      </tbody>
                    </table>
                    {filteredCategories.length === 0 && (
                        <div className="text-center py-12">
                          <FolderTree className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No categories found</p>
                        </div>
                    )}
                  </div>
              )}
            </div>
          </main>
        </div>

        {/* Add Category Modal */}
        {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-900">Add New Category</h3>
                    <button
                        onClick={() => setShowAddModal(false)}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <label className="block text-sm text-gray-700 mb-2">Category Name</label>
                  <input
                      type="text"
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                      placeholder="e.g., Antibiotics"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-6 border-t border-gray-100 flex gap-3">
                  <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleAddCategory}
                      disabled={isSubmitting || !newCategoryName.trim()}
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
                  >
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Save Category
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}