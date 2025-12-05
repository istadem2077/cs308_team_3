import { ShoppingCart, AlertCircle } from 'lucide-react';
import type {Product} from '../types';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const stock = product.quantity || 0;
    const isOutOfStock = stock === 0; // [cite: 9]

    return (
        <div className={`bg-white border rounded-xl p-4 flex flex-col transition hover:shadow-lg ${isOutOfStock ? 'opacity-60' : ''}`}>
            <div className="relative h-40 flex justify-center items-center bg-slate-50 rounded mb-4">
                <img src={product.imageUrl} alt={product.name} className="h-32 object-contain mix-blend-multiply" />
                {/* Feature 3: Stock Status */}
                <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
          {isOutOfStock ? 'Out of Stock' : `${stock} Left`}
        </span>
            </div>

            <h3 className="font-bold text-slate-800">{product.name}</h3>
            {/* Feature 9: Required Description */}
            <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>

            {/* Feature 9: Extra Technical Fields */}
            <div className="mt-2 text-xs text-slate-400">
                <p>Distributor: {product.distributorInfo || "Sabanci Pharma"}</p>
                <p>Warranty: {product.warrantyStatus || "Standard"}</p>
            </div>

            <div className="mt-auto pt-4 flex justify-between items-center border-t border-slate-100">
                <span className="text-lg font-bold text-teal-700">${product.price}</span>
                <button
                    onClick={() => addToCart(product)}
                    disabled={isOutOfStock} // [cite: 27]
                    className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium ${isOutOfStock ? 'bg-gray-200 text-gray-400' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                >
                    {isOutOfStock ? <AlertCircle size={16}/> : <ShoppingCart size={16}/>}
                    {isOutOfStock ? 'Empty' : 'Add'}
                </button>
            </div>
        </div>
    );
}