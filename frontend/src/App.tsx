import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout'; // Import new page
import Profile from './pages/Profile';

export default function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <div className="min-h-screen flex flex-col bg-slate-50">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </main>

                    {/* Simple Footer */}
                    <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
                        <p>&copy; 2025 Sabanci Pharmacy Project. Team 3.</p>
                    </footer>
                </div>
            </BrowserRouter>
        </CartProvider>
    );
}