<<<<<<< HEAD
import { X, ShoppingCart, FileText, CheckCircle, Package, Shield, Truck } from 'lucide-react';
=======
<<<<<<< HEAD
import { X, ShoppingCart, FileText, CheckCircle, Package, Shield, Truck, Heart } from 'lucide-react';
import { Product } from '../services/api';
=======
import { X, ShoppingCart, Package, Star, ShieldCheck, Truck } from 'lucide-react';
>>>>>>> nazim
import { Product } from '../App';
>>>>>>> master

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> nazim
export function ProductDetail({
  product,
  onClose,
  onAddToCart,
<<<<<<< HEAD
}: ProductDetailProps) {
=======
  onAddToWishlist,
  isInWishlist,
}: ProductDetailProps) {
=======
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

>>>>>>> master
>>>>>>> nazim
  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <h2>Product Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

<<<<<<< HEAD
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full rounded-lg"
                  />
                  {product.requiresPrescription && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-2 rounded-lg flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Prescription Required
                    </div>
                  )}
=======
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
<<<<<<< HEAD

                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  disabled={!product.inStock || product.stockCount === 0}
                  className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    product.inStock && product.stockCount > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stockCount === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                {onAddToWishlist && (
                  <button
                    onClick={() => onAddToWishlist(product)}
                    className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      isInWishlist ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-500 hover:bg-gray-400'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                    {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                )}
=======
>>>>>>> master
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
>>>>>>> nazim
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="mb-2">{product.name}</h2>
                  <p className="text-gray-600 capitalize">{product.category}</p>
                </div>

                <div className="flex items-center gap-2">
                  {product.inStock ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-600">In Stock</span>
                    </>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>

                <div className="border-t border-b py-4">
                  <p className="text-blue-600">₺{product.price.toFixed(2)}</p>
                </div>

                <div>
                  <h3 className="mb-2">Description</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                {/* Product Specifications */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h3 className="mb-2">Product Information</h3>

                    <div className="flex items-start gap-2">
                        <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-600">ID</p>
                            <p className="text-gray-900">{product.id}</p>
                        </div>
                    </div>
                  
                  <div className="flex items-start gap-2">
                    <Package className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Model</p>
                      <p className="text-gray-900">{product.model}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Serial Number</p>
                      <p className="text-gray-900">{product.serialNumber+34985}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Warranty</p>
                      <p className="text-gray-900">{product.warrantyStatus}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Truck className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Distributor</p>
                      <p className="text-gray-900">{product.distributor}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Package className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Stock Quantity</p>
                      <p className={`${
                        product.stockCount <= 5
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}>
                        {product.stockCount <= 5 && product.stockCount > 0
                          ? `Last ${product.stockCount} item${product.stockCount !== 1 ? 's' : ''}`
                          : product.stockCount > 5
                          ? 'High number in stock'
                          : 'Out of stock'}
                      </p>
                    </div>
                  </div>
                </div>

                {product.requiresPrescription && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="text-orange-800 mb-1">Prescription Required</h4>
                    <p className="text-orange-700 text-sm">
                      This medication requires a valid prescription. Please upload
                      your prescription during checkout.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  disabled={!product.inStock || product.stockCount === 0}
                  className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    product.inStock && product.stockCount > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stockCount === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}