import { Product } from '../App';
import { ShoppingCart, Package, Star, MessageSquare } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onCommentsClick?: (product: Product) => void;
}

export function ProductGrid({
  products,
  onProductClick,
  onAddToCart,
  onCommentsClick,
}: ProductGridProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">No products found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
        >
          <div onClick={() => onProductClick(product)}>
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              {/* Rx Badge Removed */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-4 py-2 rounded">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="mb-1 text-lg font-medium truncate">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 capitalize">
                {product.category}
              </p>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <p className="text-blue-600 font-bold">₺{product.price.toFixed(2)}</p>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    product.stockCount <= 5
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>
                    {product.stockCount <= 5 && product.stockCount > 0
                      ? `Last ${product.stockCount} left`
                      : product.stockCount > 5
                      ? 'In Stock'
                      : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4 space-y-2">
            <button
              onClick={e => {
                e.stopPropagation();
                onAddToCart(product);
              }}
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
            {onCommentsClick && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onCommentsClick(product);
                }}
                className="w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <MessageSquare className="w-4 h-4" />
                Comments
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}