import { X, ShoppingCart, FileText, CheckCircle } from 'lucide-react';
import { Product } from '../App';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductDetail({
  product,
  onClose,
  onAddToCart,
}: ProductDetailProps) {
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
                  disabled={!product.inStock}
                  className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    product.inStock
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
