import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { api } from '../api/client';
import OrderList from '../components/OrderList';
import { User, MapPin, Lock, Package, LogOut, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user, logout } = useCart();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'details' | 'orders'>('details');

    // Form States
    const [address, setAddress] = useState(user?.address || "");
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    if (!user) {
        navigate('/login');
        return null;
    }

    // --- Handlers ---
    const handleAddressUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        try {
            await api.updateAddress(user.userId, address);
            setStatus({ type: 'success', msg: 'Address updated successfully.' });
            setAddress(""); // Clear field on success
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to update address.' });
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        if (passwords.new !== passwords.confirm) {
            return setStatus({ type: 'error', msg: 'New passwords do not match.' });
        }
        try {
            await api.updatePassword(user.userId, passwords.old, passwords.new, passwords.confirm);
            setStatus({ type: 'success', msg: 'Password updated successfully.' });
            setPasswords({ old: '', new: '', confirm: '' });
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to update password. Check old password.' });
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl min-h-screen">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* --- FLOATING SIDEBAR --- */}
                <aside className="lg:w-64 flex-shrink-0">
                    <div className="sticky top-24 card p-4">
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">
                                <User size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-slate-800 truncate">{user.name}</p>
                                <p className="text-xs text-slate-500 truncate">User ID: {user.userId}</p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === 'details' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <ShieldCheck size={18} /> Account Details
                            </button>

                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === 'orders' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <Package size={18} /> My Orders
                            </button>
                        </nav>

                        <div className="border-t border-slate-100 mt-6 pt-4">
                            <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>
                    </div>
                </aside>

                {/* --- MAIN CONTENT AREA --- */}
                <main className="flex-1">
                    {status && (
                        <div className={`mb-6 p-4 rounded-lg border ${status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            {status.msg}
                        </div>
                    )}

                    {activeTab === 'details' ? (
                        <div className="space-y-8 animate-in fade-in duration-300">

                            {/* Read Only Info */}
                            <section className="card p-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Profile Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                                        <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-500">
                                            {user.name}
                                        </div>
                                    </div>
                                    <div>
                                        {/* SHOW CURRENT ADDRESS HERE */}
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Current Address</label>
                                        <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-500">
                                            {user.address || "No address on file"}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Update Address Form */}
                            <section className="card p-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <MapPin size={20} className="text-teal-600"/> Update Address
                                </h2>
                                <form onSubmit={handleAddressUpdate} className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">New Delivery Address</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. 123 Campus Rd, Istanbul"
                                            className="input-field"
                                            value={address} // Controlled input
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                    <button className="btn-primary h-[42px]">Save</button>
                                </form>
                            </section>

                            {/* Update Password */}
                            <section className="card p-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <Lock size={20} className="text-teal-600"/> Change Password
                                </h2>
                                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                                        <input
                                            required type="password" className="input-field"
                                            value={passwords.old}
                                            onChange={e => setPasswords({...passwords, old: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                        <input
                                            required type="password" className="input-field"
                                            value={passwords.new}
                                            onChange={e => setPasswords({...passwords, new: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                        <input
                                            required type="password" className="input-field"
                                            value={passwords.confirm}
                                            onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                                        />
                                    </div>
                                    <button className="btn-secondary w-full">Update Password</button>
                                </form>
                            </section>

                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-300">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Order History</h2>
                            <OrderList />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}