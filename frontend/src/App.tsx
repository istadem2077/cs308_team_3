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
import { ProductReviews } from './components/ProductReviews';
import { productsAPI, cartAPI, reviewsAPI, ordersAPI, OrderResponse } from './services/api';
import { authService, User } from './services/auth';
import { Loader2, ChevronDown } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  stockCount: number;
  popularity: number;
  rating: number;
  reviewCount: number;
  model: string;
  serialNumber: string;
  warrantyStatus: string;
  distributor: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
}

type SortOption = 'none' | 'price-asc' | 'price-desc' | 'popularity';

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
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedProductForReviews, setSelectedProductForReviews] = useState<Product | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  // 1. Initial Auth Check
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsGuestMode(false);
    }
  }, []);

  // 2. Fetch Products
  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch products error:", err);
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user || isGuestMode) {
      fetchProducts();
    }
  }, [user, isGuestMode]);

  // 3. Sync Cart & Orders with Backend when User changes
  useEffect(() => {
    const syncUserData = async () => {
      if (user) {
        try {
          // Load Server Cart
          const serverCart = await cartAPI.load();
          setCartItems(serverCart);

          // Load Order History
          const history = await ordersAPI.getHistory();
          setOrders(history);
        } catch (err) {
          console.error("Failed to sync user data", err);
        }
      } 
    };
    syncUserData();
  }, [user]);

  // 4. Fetch Reviews when a product is selected
  useEffect(() => {
    const fetchReviews = async () => {
      if (selectedProductForReviews) {
        try {
          const productReviews = await reviewsAPI.getByProduct(selectedProductForReviews.id);
          setReviews(productReviews); 
        } catch (err) {
          console.error("Failed to fetch reviews", err);
          setReviews([]); 
        }
      }
    };
    fetchReviews();
  }, [selectedProductForReviews]);

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
    setOrders([]);
    setShowMyAccount(false);
    setShowLogoutConfirm(false);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleCheckoutClick = () => {
    if (!user) {
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

  // --- Cart Actions ---

  const addToCart = async (product: Product) => {
    // 1. Optimistic Update for UI responsiveness
    const prevItems = [...cartItems];
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      const currentQuantity = existing ? existing.quantity : 0;
      
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

    // 2. Server Sync
    if (user) {
      try {
        await cartAPI.addToCart(product.id, 1);
        // Reload to ensure consistency with server calculation
        const updatedCart = await cartAPI.load();
        setCartItems(updatedCart);
      } catch (err) {
        console.error("Add to cart failed", err);
        setCartItems(prevItems); // Revert on error
        alert("Failed to add item to server cart.");
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    const oldQty = item.quantity;
    const diff = quantity - oldQty;

    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item => (item.id === id ? { ...item, quantity } : item))
      );
    }

    if (user && diff !== 0) {
      try {
        if (diff > 0) {
           await cartAPI.addToCart(id, diff);
        } else {
           // For removal, we might loop or backend needs a 'reduce quantity' endpoint
           // Since backend 'remove' usually removes the item entirely or reduces by 1,
           // we assume standard behavior here or loop for 'diff' times if API requires
           // Assuming addToCart with negative might not work, so we use logic:
           // If backend remove API only removes 1 at a time:
           for(let k=0; k < Math.abs(diff); k++) {
                await cartAPI.removeFromCart(id); 
           }
        }
        const updatedCart = await cartAPI.load();
        setCartItems(updatedCart);
      } catch (err) {
        console.error("Update quantity failed", err);
        const updatedCart = await cartAPI.load();
        setCartItems(updatedCart); 
      }
    }
  };

  const removeFromCart = async (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));

    if (user) {
      try {
        // We might need to call remove multiple times or clear logic 
        // if backend /cart/remove only decrements. 
        // Assuming here we want to fully remove line item:
        // Ideally backend should have 'delete item' endpoint. 
        // If not, we iterate or rely on cartAPI implementation.
        // For now, let's call remove once (or check backend implementation).
        await cartAPI.removeFromCart(id); 
        const updatedCart = await cartAPI.load();
        setCartItems(updatedCart);
      } catch (err) {
        console.error("Remove failed", err);
      }
    }
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

  // --- Reviews ---

  const handleAddReview = async (review: Omit<Review, 'id' | 'date'>) => {
    if (user) {
      try {
        await reviewsAPI.addReview({
          productId: parseInt(review.productId),
          rating: review.rating,
          comment: review.comment
        });
        
        const updatedReviews = await reviewsAPI.getByProduct(review.productId);
        setReviews(updatedReviews);
        fetchProducts();
      } catch (err) {
        alert("Failed to post review");
      }
    } else {
      const newReview: Review = {
        ...review,
        id: `review-${Date.now()}`,
        date: new Date().toISOString(),
      };
      setReviews(prev => [newReview, ...prev]);
    }
  };

  // --- Orders ---

  const handleOrderComplete = async () => { // Removed OrderResponse arg as create returns it or we fetch history
    if (user) {
      try {
        // Call checkout API
        const userId = authService.getUserId();
        if(userId) {
            await ordersAPI.create(userId);
            const history = await ordersAPI.getHistory();
            setOrders(history);
            setCartItems([]);
            // Ideally re-fetch products to get updated stock
            fetchProducts();
        }
      } catch (err) {
        console.error("Checkout failed", err);
        alert("Checkout failed. Please try again.");
      }
    }
    setIsCheckout(false);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'processing' | 'in-transit' | 'delivered') => {
    setOrders(prev =>
      prev.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleRateProduct = async (productId: string, rating: number, userName: string) => {
    await handleAddReview({
        productId,
        rating,
        comment: '',
        userName
    });
  };

  const handleAddCommentToRating = async (productId: string, rating: number, comment: string, userName: string) => {
     await handleAddReview({
        productId,
        rating,
        comment,
        userName
    });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'popularity') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.popularity - a.popularity);
  }

  const categories = [
    'all',
    ...Array.from(new Set(products.map(p => p.category))),
  ];

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

  if (showMyAccount && user) {
    return (
      <MyAccount
        user={user}
        onBack={() => setShowMyAccount(false)}
        onUserUpdate={handleUserUpdate}
        onLogout={handleLogout}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onRateProduct={handleRateProduct}
        onAddComment={handleAddCommentToRating}
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

  if (isCheckout && (user || isGuestMode)) {
    return (
      <Checkout
        cartItems={cartItems}
        totalPrice={totalPrice}
        onBack={() => setIsCheckout(false)}
        onComplete={handleOrderComplete}
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

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label htmlFor="sort-select" className="text-gray-700">
              Sort by:
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="none">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popularity">Popularity</option>
              </select>
              <ChevronDown className="w-5 h-5 text-gray-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
          onCommentsClick={setSelectedProductForReviews}
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

      {selectedProductForReviews && (
        <ProductReviews
          isOpen={true}
          onClose={() => setSelectedProductForReviews(null)}
          product={selectedProductForReviews}
          reviews={reviews}
          onAddReview={handleAddReview}
          userName={user?.name || (isGuestMode ? 'Guest User' : undefined)}
        />
      )}
    </div>
  );
}