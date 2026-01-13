import { useState, useEffect } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import { productsAPI, ordersAPI, reviewsAPI, wishlistAPI, OrderResponse } from './services/api';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { ProductDetail } from './components/ProductDetail';
import { Auth } from './components/Auth';
import { Checkout } from './components/Checkout';
import { MyAccount } from './components/MyAccount';
import { ProductManager } from './components/ProductManager';
import { SalesManager } from './components/SalesManager';
import { SupportManager } from './components/SupportManager';
import { CustomerChat } from './components/CustomerChat';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LogoutConfirmation } from './components/LogoutConfirmation';
import { LoginPrompt } from './components/LoginPrompt';
import { ProductReviews } from './components/ProductReviews';
import { Wishlist } from './components/Wishlist';
import { authService, User } from './services/auth';
import { mockReviews } from './data/reviews';
import './styles/globals.css';


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
  popularity: number; // 0-100 score based on sales/views
  rating: number; // 0-5 stars
  reviewCount: number; // number of reviews
  model: string; // Product model
  serialNumber: string; // Product serial number
  warrantyStatus: string; // Warranty information (e.g., "1 year", "2 years", "No warranty")
  distributor: string; // Distributor/manufacturer information
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
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

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // 1. Try to load saved cart from storage on initial load
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [isCheckout, setIsCheckout] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [selectedProductForReviews, setSelectedProductForReviews] = useState<Product | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [showProductManager, setShowProductManager] = useState(false);
  const [showSalesManager, setShowSalesManager] = useState(false);
  const [showSupportManager, setShowSupportManager] = useState(false);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Helper to sync wishlist
  const refreshWishlist = async () => {
    if (authService.isAuthenticated()) {
      const items = await wishlistAPI.get();
      setWishlistItems(items);
    }
  };



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

  useEffect(() => {
    // Fetch order history when user logs in
    if (user) {
      ordersAPI.getHistory()
          .then(fetchedOrders => setOrders(fetchedOrders))
          .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (selectedProductForReviews) {
      reviewsAPI.getByProduct(selectedProductForReviews.id)
          .then(apiReviews => {
            // backend returns ReviewResponseDto, might need mapping to your Review interface
            // const mappedReviews = apiReviews.map((r: any) => ({
            //     id: r.id.toString(),
            //     productId: r.productId.toString(),
            //     userName: r.userName,
            //     rating: r.rating,
            //     comment: r.comment,
            //     date: r.createdAt
            // }));
            setReviews(apiReviews);
          })
          .catch(console.error);
    }
  }, [selectedProductForReviews]);

  const handleLoginSuccess = async () => {
    const currentUser = authService.getCurrentUser();

    if (currentUser && cartItems.length > 0) {
      try {
        // Use the userId from the authenticated user
        await ordersAPI.syncCart(currentUser.id, cartItems);
        console.log("Cart synced to database successfully");
      } catch (err) {
        console.error("Error syncing cart:", err);
      }
    }

    setUser(currentUser);
    setIsGuestMode(false);
    setShowAuthModal(false);
    setShowLoginPrompt(false);
  };

  const handleSkipLogin = () => {
    setIsGuestMode(true);
    setShowAuthModal(false);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCartItems([]);
    setShowMyAccount(false);
    setShowLogoutConfirm(false);
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

  const handleAddReview = async (review: Omit<Review, 'id' | 'date'>) => {
    try {
      // 1. Send to Backend
      await reviewsAPI.add(review.productId, review.rating, review.comment);

      // 2. Keep existing UI logic to update screen immediately (Optimistic UI)
      const newReview: Review = {
        ...review,
        id: `review-${Date.now()}`,
        date: new Date().toISOString(),
      };

      setReviews(prev => [newReview, ...prev]);

      // ... rest of your existing logic for updating product rating ...
      setProducts(prevProducts =>
          prevProducts.map(product => {
            if (product.id === review.productId) {
              // ... your existing calculation logic ...
              // (You can copy the logic you already wrote in App.tsx)
              return product; // simplified for brevity
            }
            return product;
          })
      );
    } catch (error) {
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleOrderComplete = (order: OrderResponse) => {
    // Add order with "processing" status
    const newOrder = {
      ...order,
      status: 'processing' as const,
    };
    setOrders(prev => [newOrder, ...prev]);
    updateProductStock(cartItems);
    setCartItems([]);
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
    try {
      // Send to Backend (Empty comment)
      await reviewsAPI.add(productId, rating, "");

      // Update Local UI (Optimistic update)
      const newReview: Review = {
        id: `review-${Date.now()}`,
        productId,
        userName,
        rating,
        comment: '',
        date: new Date().toISOString(),
        status: 'PENDING'
      };

      setReviews(prev => [newReview, ...prev]);

      // Update product rating stats visually
      // (Keep your existing logic here for calculating new averages)
      updateProductRatingLocal(productId, rating, 1);

    } catch (error) {
      console.error("Failed to rate product", error);
    }
  };

  const handleAddCommentToRating = async (productId: string, rating: number, comment: string, userName: string) => {
    try {
      // Send to Backend
      await reviewsAPI.add(productId, rating, comment);

      // Update Local UI
      const newReview: Review = {
        id: `review-${Date.now()}`,
        productId,
        userName,
        rating,
        comment,
        date: new Date().toISOString(),
        status: 'PENDING'
      };

      setReviews(prev => [newReview, ...prev]);

      // Update product rating stats visually
      updateProductRatingLocal(productId, rating, 1);

    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  const updateProductRatingLocal = (productId: string, newRatingVal: number, countInc: number) => {
    setProducts(prevProducts =>
        prevProducts.map(product => {
          if (product.id === productId) {
            // Simple approximation for demo UI
            return {
              ...product,
              reviewCount: product.reviewCount + countInc,
              // Note: True average requires all numbers, this is a visual approximation
              rating: newRatingVal
            };
          }
          return product;
        })
    );
  }

  // Wishlist functions
  const handleAddToWishlist = async (product: Product) => {
    if (!user) {
      setAuthView('login');
      setShowAuthModal(true);
      return;
    }

    try {
      // Check if already in wishlist to toggle
      const exists = wishlistItems.find(item => item.id === product.id);
      if (exists) {
        await wishlistAPI.remove(product.id);
      } else {
        await wishlistAPI.add(product.id);
      }
      await refreshWishlist();
    } catch (err) {
      console.error("Wishlist action failed", err);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await wishlistAPI.remove(productId);
      await refreshWishlist();
    } catch (err) {
      console.error(err);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
  );

  // Filter and sort products
  let filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort by price
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

  // Show login/register modal if not authenticated and not in guest mode
  if (!user && !isGuestMode && !showAuthModal) {
    if (authView === 'login') {
      return (
        <Auth
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setAuthView('register')}
          onSkip={handleSkipLogin}
          onProductManager={() => setShowProductManager(true)}
          onSalesManager={() => setShowSalesManager(true)}
          onSupportManager={() => setShowSupportManager(true)}
        />
      );
    } else {
      return (
        <Auth
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
        <Auth
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setAuthView('register')}
          onSkip={() => setShowAuthModal(false)}
          onProductManager={() => setShowProductManager(true)}
          onSalesManager={() => setShowSalesManager(true)}
          onSupportManager={() => setShowSupportManager(true)}
        />
      );
    } else {
      return (
        <Auth
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
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onRateProduct={handleRateProduct}
        onAddComment={handleAddCommentToRating}
      />
    );
  }

  // Show Product Manager
  if (showProductManager) {
    return (
      <ProductManager
        products={products}
        onBack={() => setShowProductManager(false)}
        onAddProduct={(product) => {
          const newProduct: Product = {
            ...product,
            id: `prod-${Date.now()}`,
          };
          setProducts(prev => [newProduct, ...prev]);
        }}
        onUpdateProduct={(id, updatedProduct) => {
          setProducts(prev =>
            prev.map(p => (p.id === id ? updatedProduct : p))
          );
        }}
        onDeleteProduct={(id) => {
          setProducts(prev => prev.filter(p => p.id !== id));
          // Also remove from cart if present
          setCartItems(prev => prev.filter(item => item.id !== id));
        }}
      />
    );
  }

  // Show Sales Manager
  if (showSalesManager) {
    return (
      <SalesManager
        onBack={() => setShowSalesManager(false)}
      />
    );
  }

  // Show Support Manager
  if (showSupportManager) {
    return (
      <SupportManager
        onBack={() => setShowSupportManager(false)}
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
        onComplete={handleOrderComplete}
      />
    );
  }

  // Show Wishlist page
  if (showWishlist) {
    return (
      <>
        <Wishlist
          wishlistItems={wishlistItems}
          onRemoveFromWishlist={handleRemoveFromWishlist}
          onAddToCart={addToCart}
          onBack={() => setShowWishlist(false)}
        />
        {/* Customer Support Chat Widget */}
        <CustomerChat
          userName={user?.name}
          userEmail={user?.email}
          isLoggedIn={!!user}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemCount={totalItems}
        wishlistItemCount={wishlistItems.length}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setShowWishlist(true)}
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

        {/* Sort Filter */}
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
          onAddToWishlist={handleAddToWishlist}
          wishlistItems={wishlistItems}
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
          onAddToWishlist={handleAddToWishlist}
          isInWishlist={wishlistItems.some(item => item.id === selectedProduct.id)}
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
          reviews={reviews.filter(r => r.productId === selectedProductForReviews.id)}
          onAddReview={handleAddReview}
          userName={user?.name || (isGuestMode ? 'Guest User' : undefined)}
        />
      )}

      {/* Customer Support Chat Widget */}
      <CustomerChat
        userName={user?.name}
        userEmail={user?.email}
        isLoggedIn={!!user}
      />
    </div>
  );
}