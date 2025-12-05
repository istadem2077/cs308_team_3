import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, CreditCard, CheckCircle, Edit2 } from 'lucide-react';

export default function Checkout() {
    const { cart, user, checkout } = useCart();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    // Calculate totals
    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const shipping = 5.99;
    const total = subtotal + shipping;

    useEffect(() => {
        if (!user) navigate('/login');
        if (cart.length === 0 && !success) navigate('/');
    }, [user, cart, navigate, success]);

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        try {
            await checkout();
            setSuccess(true);
            setTimeout(() => navigate('/orders'), 3000);
        } catch (err) {
            alert("Payment failed.");
            setIsProcessing(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Order Confirmed!</h1>
                <p className="text-slate-500 max-w-md">Thank you. Redirecting to your orders...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8 text-slate-800">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">

                    {/* --- ADDRESS SECTION UPDATED --- */}
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <MapPin className="text-teal-600" />
                                <h2 className="text-xl font-bold">Delivery Address</h2>
                            </div>
                            <button
                                onClick={() => navigate('/profile')}
                                className="text-sm text-teal-600 font-bold hover:underline flex items-center gap-1"
                            >
                                <Edit2 size={14} /> Change
                            </button>
                        </div>

                        <div className="ml-9 text-slate-600">
                            <p className="font-bold text-slate-900 text-lg">{user?.name}</p>
                            {/* DISPLAY DYNAMIC ADDRESS HERE */}
                            <p className="mt-1">
                                {user?.address || <span className="text-red-500">No address set. Please add one.</span>}
                            </p>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="card p-6">
                        <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
                            <CreditCard className="text-teal-600" />
                            <h2 className="text-xl font-bold">Payment Method</h2>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 ml-9">
                            <p className="text-sm text-slate-500 mb-2">Mock Credit Card</p>
                            <div className="flex items-center gap-4 text-slate-700 font-mono">
                                <span>****</span><span>****</span><span>****</span><span>4242</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 ml-9">
                            <ShieldCheck size={16} />
                            <span>Payments are secure and encrypted.</span>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                            {cart.map((item) => (
                                <div key={item.product.id} className="flex justify-between items-start text-sm">
                                    <div>
                                        <span className="font-medium text-slate-700">{item.product.name}</span>
                                        <div className="text-slate-400 text-xs">Qty: {item.quantity}</div>
                                    </div>
                                    <span className="text-slate-600">${(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-100 pt-4 space-y-2 text-slate-600">
                            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                            <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-100 mt-2">
                                <span>Total</span><span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing || !user?.address} // Disable if no address
                            className="btn-primary w-full mt-6 py-3 text-lg shadow-lg shadow-teal-200"
                        >
                            {isProcessing ? 'Processing...' : 'Confirm & Pay'}
                        </button>
                        {!user?.address && <p className="text-xs text-red-500 text-center mt-2">Address required to continue</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}