import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { ProductDetail } from './components/ProductDetail';
import { Checkout } from './components/Checkout';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { MyAccount } from './components/MyAccount';
import { LogoutConfirmation } from './components/LogoutConfirmation';
import { LoginPrompt } from './components/LoginPrompt';
import { productsAPI } from './services/api';
import { authService, User } from './services/auth';
import { Loader2, ArrowUpDown } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  requiresPrescription: boolean;
  stockCount: number;
}

export interface CartItem extends Product {
  quantity: number;
}

type SortOption = 'none' | 'price-asc' | 'price-desc';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [showMyAccount, setShowMyAccount] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [isCheckout, setIsCheckout] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsGuestMode(false);
    }
  }, []);

  useEffect(() => {
    // Load products (works for both guest and logged-in users)
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getAll();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    if (user || isGuestMode) {
      fetchProducts();
    }
  }, [user, isGuestMode]);

  const handleLoginSuccess = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsGuestMode(false);
    setShowAuthModal(false);
    setShowLoginPrompt(false);
  };

  const handleSkipLogin = () => {
    setIsGuestMode(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCartItems([]);
    setShowMyAccount(false);
    setShowLogoutConfirm(false);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleCheckoutClick = () => {
    if (!user) {
      // Show login prompt if guest tries to checkout
      setShowLoginPrompt(true);
    } else {
      setIsCartOpen(false);
      setIsCheckout(true);
    }
  };

  const handleLoginPromptLogin = () => {
    setShowLoginPrompt(false);
    setAuthView('login');
    setShowAuthModal(true);
  };

  const handleLoginPromptRegister = () => {
    setShowLoginPrompt(false);
    setAuthView('register');
    setShowAuthModal(true);
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      const currentQuantity = existing ? existing.quantity : 0;
      
      // Check if adding one more would exceed stock
      if (currentQuantity >= product.stockCount) {
        alert(`Sorry, only ${product.stockCount} items available in stock for ${product.name}`);
        return prev;
      }
      
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateProductStock = (purchasedItems: CartItem[]) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        const purchasedItem = purchasedItems.find(item => item.id === product.id);
        if (purchasedItem) {
          const newStock = product.stockCount - purchasedItem.quantity;
          return {
            ...product,
            stockCount: Math.max(0, newStock),
            inStock: newStock > 0,
          };
        }
        return product;
      })
    );
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Filter and sort products
  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort by price
  if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  const categories = [
    'all',
    ...Array.from(new Set(products.map(p => p.category))),
  ];

  // Show login/register modal if not authenticated and not in guest mode
  if (!user && !isGuestMode && !showAuthModal) {
    if (authView === 'login') {
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setAuthView('register')}
          onSkip={handleSkipLogin}
        />
      );
    } else {
      return (
        <Register
          onRegisterSuccess={handleLoginSuccess}
          onSwitchToLogin={() => setAuthView('login')}
          onSkip={handleSkipLogin}
        />
      );
    }
  }

  // Show auth modal if triggered from guest mode
  if (showAuthModal) {
    if (authView === 'login') {
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setAuthView('register')}
          onSkip={() => setShowAuthModal(false)}
        />
      );
    } else {
      return (
        <Register
          onRegisterSuccess={handleLoginSuccess}
          onSwitchToLogin={() => setAuthView('login')}
          onSkip={() => setShowAuthModal(false)}
        />
      );
    }
  }

  // Show My Account page (only for logged-in users)
  if (showMyAccount && user) {
    return (
      <MyAccount
        user={user}
        onBack={() => setShowMyAccount(false)}
        onUserUpdate={handleUserUpdate}
        onLogout={handleLogout}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isCheckout && user) {
    return (
      <Checkout
        cartItems={cartItems}
        totalPrice={totalPrice}
        onBack={() => setIsCheckout(false)}
        onComplete={() => {
          updateProductStock(cartItems);
          setCartItems([]);
          setIsCheckout(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemCount={totalItems}
        onCartClick={() => setIsCartOpen(true)}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        userName={user?.name}
        onMyAccountClick={user ? () => setShowMyAccount(true) : undefined}
        onLogoutClick={user ? () => setShowLogoutConfirm(true) : undefined}
      />

      <Hero />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Guest Mode Notice */}
        {isGuestMode && !user && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-blue-900">
                You&apos;re browsing as a guest.{' '}
                <button
                  onClick={() => {
                    setAuthView('login');
                    setShowAuthModal(true);
                  }}
                  className="underline hover:text-blue-700"
                >
                  Log in
                </button>{' '}
                or{' '}
                <button
                  onClick={() => {
                    setAuthView('register');
                    setShowAuthModal(true);
                  }}
                  className="underline hover:text-blue-700"
                >
                  create an account
                </button>{' '}
                to complete purchases.
              </p>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Price Sort Filter */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Sort by Price:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('none')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'none'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Default
              </button>
              <button
                onClick={() => setSortBy('price-asc')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'price-asc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cheapest First
              </button>
              <button
                onClick={() => setSortBy('price-desc')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'price-desc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Most Expensive First
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <ProductGrid
          products={filteredProducts}
          onProductClick={setSelectedProduct}
          onAddToCart={addToCart}
        />
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        totalPrice={totalPrice}
        onCheckout={handleCheckoutClick}
      />

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {user && (
        <LogoutConfirmation
          isOpen={showLogoutConfirm}
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
        />
      )}

      <LoginPrompt
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={handleLoginPromptLogin}
        onRegister={handleLoginPromptRegister}
      />
    </div>
  );
}