import { useState } from 'react';
import {
  Search,
  User,
  LayoutDashboard,
  Package,
  LogOut,
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  TrendingUp,
  Layers,
  ShoppingBag,
  Warehouse,
} from 'lucide-react';
import { Product } from '../../services/api';

interface PcategoriesProps {
  products: Product[];
  onBack: () => void;
  onNavigate: (tab: string) => void;
}

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  totalValue: number;
  createdDate: string;
}

export function Pcategories({ products, onBack, onNavigate }: PcategoriesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  // Calculate categories from products
  const categoryMap = new Map<string, { count: number; value: number }>();
  products.forEach(product => {
    const existing = categoryMap.get(product.category) || { count: 0, value: 0 };
    categoryMap.set(product.category, {
      count: existing.count + 1,
      value: existing.value + product.price * product.stockCount,
    });
  });

  const categories: Category[] = Array.from(categoryMap.entries()).map(([name, data], index) => ({
    id: `cat-${index}`,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    description: `All ${name} products`,
    productCount: data.count,
    totalValue: data.value,
    createdDate: '2024-01-15',
  }));

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = () => {
    // In real app, this would add to backend
    setShowAddModal(false);
    setNewCategory({ name: '', description: '' });
  };

  const handleEditCategory = () => {
    // In real app, this would update backend
    setShowEditModal(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = () => {
    // In real app, this would delete from backend
    setShowDeleteModal(false);
    setSelectedCategory(null);
  };

  const totalCategories = categories.length;
  const totalProducts = products.length;
  const avgProductsPerCategory = totalProducts / totalCategories || 0;

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
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg mb-2">
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white"
            >
              <Warehouse className="w-5 h-5" />
              <span>Stock Management</span>
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
              <h1 className="text-gray-900 mb-1">Category Management</h1>
              <p className="text-gray-500 text-sm">Organize and manage product categories</p>
            </div>

            <div className="flex items-center gap-4">
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

              <button className="w-11 h-11 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
                <User className="w-5 h-5 text-blue-700" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FolderTree className="w-5 h-5" />
                </div>
                <p className="text-sm text-blue-100">Total Categories</p>
              </div>
              <p className="text-3xl mb-1">{totalCategories}</p>
              <p className="text-xs text-blue-200">Active product categories</p>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <p className="text-sm text-purple-100">Total Products</p>
              </div>
              <p className="text-3xl mb-1">{totalProducts}</p>
              <p className="text-xs text-purple-200">Across all categories</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-2xl shadow-lg text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <p className="text-sm text-green-100">Avg. Per Category</p>
              </div>
              <p className="text-3xl mb-1">{avgProductsPerCategory.toFixed(1)}</p>
              <p className="text-xs text-green-200">Products per category</p>
            </div>
          </div>

          {/* Categories Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Layers className="w-4 h-4 text-blue-600" />
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
            </div>

            {/* Categories List */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map(category => (
                  <div
                    key={category.id}
                    className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <FolderTree className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowEditModal(true);
                          }}
                          className="w-8 h-8 bg-gray-100 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors duration-200"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowDeleteModal(true);
                          }}
                          className="w-8 h-8 bg-gray-100 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-gray-900 mb-2">{category.name}</h4>
                    <p className="text-sm text-gray-500 mb-4">{category.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Products</span>
                        <span className="text-sm text-gray-900">{category.productCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <FolderTree className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No categories found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                </div>
              )}
            </div>
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

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g., Pain Relief"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Brief description of the category"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
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
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">Edit Category</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCategory(null);
                  }}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  defaultValue={selectedCategory.name}
                  placeholder="Category name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Description</label>
                <textarea
                  defaultValue={selectedCategory.description}
                  placeholder="Brief description"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCategory(null);
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCategory}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-gray-900">Delete Category</h3>
            </div>

            <div className="p-6">
              <p className="text-gray-600">
                Are you sure you want to delete the category <span className="text-gray-900">&quot;{selectedCategory.name}&quot;</span>? This action cannot be undone.
              </p>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This category contains {selectedCategory.productCount} product(s). They will need to be reassigned.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCategory(null);
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}