// src/pages/Orders.tsx
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import type {OrderResponseDto} from '../types';
import { Download } from 'lucide-react';

export default function Orders() {
    const { user } = useCart();
    const [orders, setOrders] = useState<OrderResponseDto[]>([]);

    useEffect(() => {
        if (user?.userId) {
            api.getUserOrders(user.userId).then(setOrders);
        }
    }, [user]);

    const handleDownload = async (orderId: number) => {
        try {
            await api.downloadInvoice(orderId);
        } catch (e) {
            alert("Could not download invoice. Is it generated yet?");
        }
    };

    if (!user) return <div className="p-10">Please login to view orders.</div>;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">My Order History</h1>
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.orderId} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
                            <div>
                                <p className="text-sm text-slate-500">Order #{order.orderId}</p>
                                <p className="text-xs text-slate-400">{new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {order.status}
                </span>

                                {/* Download Invoice Button */}
                                <button
                                    onClick={() => handleDownload(order.orderId)}
                                    className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded text-slate-700 transition"
                                >
                                    <Download size={14} /> Invoice
                                </button>
                            </div>
                        </div>
                        {/* ... rest of the table code remains the same ... */}
                        <div className="p-4">
                            <table className="w-full text-sm text-left">
                                <thead className="text-slate-400 font-normal">
                                <tr>
                                    <th className="pb-2">Product</th>
                                    <th className="pb-2">Price</th>
                                    <th className="pb-2">Qty</th>
                                    <th className="pb-2 text-right">Subtotal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {order.items.map((item, idx) => (
                                    <tr key={idx} className="border-b border-slate-100 last:border-0">
                                        <td className="py-2 font-medium text-slate-700">{item.productName}</td>
                                        <td className="py-2 text-slate-500">${item.unitPrice.toFixed(2)}</td>
                                        <td className="py-2 text-slate-500">x{item.quantity}</td>
                                        <td className="py-2 text-right font-medium text-slate-700">${item.subTotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}