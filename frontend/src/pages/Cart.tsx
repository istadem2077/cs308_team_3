import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

export default function Cart() {
    const { cart, addToCart, removeFromCart } = useCart(); // Get these functions
    const navigate = useNavigate();

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return (
        <div className="container mx-auto p-6 max-w-4xl min-h-[60vh]">
            <h1 className="text-3xl font-bold mb-8 text-slate-800 flex items-center gap-3">
                <ShoppingCart className="text-teal-600" /> Shopping Cart
            </h1>

            {cart.length === 0 ? (
                <div className="card p-16 text-center border-dashed border-2 border-slate-200 shadow-none">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <ShoppingCart size={40} />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-700 mb-2">Your cart is empty</h2>
                    <p className="text-slate-500 mb-6">Looks like you haven't added any medicines yet.</p>
                    <button onClick={() => navigate('/')} className="btn-primary mx-auto">
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">

                    {/* Cart Items List */}
                    <div className="flex-1 space-y-4">
                        {cart.map((item) => (
                            <div key={item.product.id} className="card p-4 flex flex-col sm:flex-row items-center gap-6 group hover:border-teal-200 transition-colors">

                                {/* Product Image */}
                                <div className="w-24 h-24 bg-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2">
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="w-full h-full object-contain mix-blend-multiply"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold text-slate-800 text-lg">{item.product.name}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-1">{item.product.description}</p>
                                    <p className="font-bold text-teal-700 mt-1">${item.product.price.toFixed(2)}</p>
                                </div>

                                {/* QUANTITY CONTROLS */}
                                <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                                    <button
                                        onClick={() => removeFromCart(item.product.id, 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded bg-white text-slate-600 shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>

                                    <span className="w-8 text-center font-bold text-slate-800">{item.quantity}</span>

                                    <button
                                        onClick={() => addToCart(item.product, 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded bg-white text-slate-600 shadow-sm hover:bg-teal-50 hover:text-teal-600 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {/* Delete Button (Remove All) */}
                                <button
                                    onClick={() => removeFromCart(item.product.id, item.quantity)}
                                    className="text-slate-400 hover:text-red-500 transition-colors sm:ml-2"
                                    title="Remove Item"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary Panel */}
                    <div className="lg:w-80 h-fit card p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>

                        <div className="space-y-3 mb-6 text-slate-600 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal ({cart.length} items)</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Estimated Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4 mb-6">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-800 font-bold">Total</span>
                                <span className="text-3xl font-bold text-teal-700">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="btn-primary w-full py-3 text-lg shadow-lg shadow-teal-100 hover:shadow-teal-200 hover:-translate-y-0.5 transition-all"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}