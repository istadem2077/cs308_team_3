import { Product } from '../App';
import { ShoppingCart, FileText } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({
  products,
  onProductClick,
  onAddToCart,
}: ProductGridProps) {
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
              {product.requiresPrescription && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Rx
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-4 py-2 rounded">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="mb-1">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 capitalize">
                {product.category}
              </p>
              <p className="text-blue-600 mb-3">₺{product.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="px-4 pb-4">
            <button
              onClick={e => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              disabled={!product.inStock}
              className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                product.inStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
