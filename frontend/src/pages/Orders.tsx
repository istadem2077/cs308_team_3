import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import type {OrderResponseDto} from '../types';
import { Download, Package, Clock, CheckCircle } from 'lucide-react';

export default function Orders() {
    const { user } = useCart();
    const [orders, setOrders] = useState<OrderResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.userId) {
            api.getUserOrders(user.userId)
                .then(setOrders)
                .finally(() => setLoading(false));
        }
    }, [user]);

    const handleDownload = async (orderId: number) => {
        try {
            await api.downloadInvoice(orderId);
        } catch (e) {
            alert("Invoice not ready.");
        }
    };

    if (!user) return <div className="p-10 text-center text-slate-500">Please log in to view orders.</div>;
    if (loading) return <div className="p-10 text-center">Loading your history...</div>;

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
                <Package className="text-teal-600" size={32} />
                <h1 className="text-3xl font-bold text-slate-800">Order History</h1>
            </div>

            <div className="space-y-6">
                {orders.length === 0 ? (
                    <div className="card p-12 text-center text-slate-500">
                        You haven't placed any orders yet.
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.orderId} className="card overflow-hidden">
                            {/* Card Header */}
                            <div className="bg-slate-50 p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Placed</p>
                                        <p className="text-slate-700 font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</p>
                                        <p className="text-slate-700 font-medium">${order.totalAmount.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order #</p>
                                        <p className="text-slate-700 font-medium">{order.orderId}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                                        order.status === 'DELIVERED'
                                            ? 'bg-green-50 border-green-200 text-green-700'
                                            : 'bg-blue-50 border-blue-200 text-blue-700'
                                    }`}>
                                        {order.status === 'DELIVERED' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                        {order.status}
                                    </div>

                                    <button
                                        onClick={() => handleDownload(order.orderId)}
                                        className="btn-secondary text-sm py-1.5 px-3 h-auto"
                                    >
                                        <Download size={16} /> Invoice
                                    </button>
                                </div>
                            </div>

                            {/* Card Body: Items List */}
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                        <tr className="text-left text-slate-400 border-b border-slate-100">
                                            <th className="pb-3 font-medium w-1/2">Product</th>
                                            <th className="pb-3 font-medium">Price</th>
                                            <th className="pb-3 font-medium">Qty</th>
                                            <th className="pb-3 font-medium text-right">Subtotal</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                        {order.items.map((item, idx) => (
                                            <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                                                <td className="py-4 pr-4">
                                                    <div className="font-semibold text-slate-700">{item.productName}</div>
                                                </td>
                                                <td className="py-4 text-slate-500">${item.unitPrice.toFixed(2)}</td>
                                                <td className="py-4 text-slate-500">x{item.quantity}</td>
                                                <td className="py-4 text-right font-medium text-teal-700">${item.subTotal.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}