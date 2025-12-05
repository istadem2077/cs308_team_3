// src/components/OrderList.tsx
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import type {OrderResponseDto} from '../types';
import { Download, Package, Clock, CheckCircle } from 'lucide-react';

export default function OrderList() {
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
            alert("Invoice not ready yet.");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading orders...</div>;

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <Package className="mx-auto text-slate-300 mb-3" size={48} />
                <p className="text-slate-500">No orders found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <div key={order.orderId} className="card overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex gap-6 text-sm">
                            <div>
                                <span className="block font-bold text-slate-400 text-xs uppercase">Placed</span>
                                <span className="text-slate-700">{new Date(order.orderDate).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="block font-bold text-slate-400 text-xs uppercase">Total</span>
                                <span className="text-slate-700 font-medium">${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div>
                                <span className="block font-bold text-slate-400 text-xs uppercase">Order #</span>
                                <span className="text-slate-700">#{order.orderId}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${
                  order.status === 'DELIVERED'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {order.status === 'DELIVERED' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                  {order.status}
              </span>
                            <button onClick={() => handleDownload(order.orderId)} className="btn-secondary text-xs px-3 py-1 h-8">
                                <Download size={14} /> Invoice
                            </button>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="p-4">
                        <table className="w-full text-sm">
                            <tbody>
                            {order.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition">
                                    <td className="py-3 font-medium text-slate-700">{item.productName}</td>
                                    <td className="py-3 text-slate-500 text-right">x{item.quantity}</td>
                                    <td className="py-3 font-medium text-teal-700 text-right">${item.subTotal.toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}