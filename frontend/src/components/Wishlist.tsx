import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Product } from '../services/api';

interface WishlistProps {
  wishlistItems: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
}

export function Wishlist({
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart,
  onBack,
}: WishlistProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-600" />
            My Wishlist
          </h2>
          <p className="text-gray-600">
            {wishlistItems.length === 0
              ? 'No items in your wishlist yet'
              : `${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 text-sm mb-4">
              Save items you love to your wishlist
            </p>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => onRemoveFromWishlist(product.id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 capitalize">
                    {product.category}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-blue-600">₺{product.price.toFixed(2)}</p>
                    {product.inStock ? (
                      <span className="text-green-600 text-sm">In Stock</span>
                    ) : (
                      <span className="text-red-600 text-sm">Out of Stock</span>
                    )}
                  </div>

                  <button
                    onClick={() => onAddToCart(product)}
                    disabled={!product.inStock || product.stockCount === 0}
                    className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      product.inStock && product.stockCount > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stockCount === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
