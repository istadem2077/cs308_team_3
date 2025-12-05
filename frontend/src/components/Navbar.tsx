import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { user, cart, logout } = useCart();
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="bg-teal-700 text-white p-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">SabanciRx</Link>
                <div className="flex gap-6 items-center">
                    <Link to="/cart" className="relative">
                        <ShoppingCart />
                        {count > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">{count}</span>}
                    </Link>
                    {user ? (
                        <Link to="/profile" className="flex items-center gap-2 hover:text-teal-200">
                            <User size={18} />
                            <span className="font-semibold">{user.name}</span>
                            <button onClick={logout} className="bg-teal-800 px-3 py-1 rounded text-sm">Logout</button>
                        </Link>
                    ) : (
                        <Link to="/login" className="flex items-center gap-1"><User size={18}/> Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}