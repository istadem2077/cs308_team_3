import { X, ShoppingCart, Package, Star, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../App';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductDetail({ product, onClose, onAddToCart }: ProductDetailProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-20"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <ShieldCheck className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-blue-900">100% Authentic</span>
                <span className="text-xs text-blue-700">Direct from Manufacturer</span>
              </div>
              <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <Truck className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-green-900">Fast Delivery</span>
                <span className="text-xs text-green-700">Available on Campus</span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium capitalize">
                  {product.category}
                </span>
                {product.stockCount <= 5 && product.stockCount > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    Low Stock
                  </span>
                )}
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {product.reviewCount} reviews
                </span>
              </div>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  ₺{product.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="prose prose-sm text-gray-600 max-w-none">
              <p>{product.description}</p>
            </div>

            <div className="border-t border-b py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Model</span>
                <span className="font-medium text-gray-900">{product.model}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Serial Number</span>
                <span className="font-medium text-gray-900">{product.serialNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Distributor</span>
                <span className="font-medium text-gray-900">{product.distributor}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Warranty</span>
                <span className="font-medium text-gray-900">{product.warrantyStatus}</span>
              </div>
            </div>

            <div className="space-y-4">
               {/* Simplified Add to Cart Action - No Prescription Logic */}
              <button
                onClick={() => {
                   onAddToCart(product);
                   onClose();
                }}
                disabled={!product.inStock}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-lg transition-all transform active:scale-[0.98] ${
                  product.inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Package className="w-4 h-4" />
                {product.inStock 
                   ? `In Stock (${product.stockCount} available)` 
                   : 'Currently unavailable'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}