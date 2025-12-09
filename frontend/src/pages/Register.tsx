import React, { useState } from 'react';
import { api } from '../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, MapPin, Mail, Lock, User } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match!");
        }

        setLoading(true);
        try {
            await api.register(formData);
            alert("Registration Successful! Please Login.");
            navigate('/login');
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="card max-w-md w-full p-8 shadow-xl shadow-slate-200">
                <div className="text-center mb-8">
                    <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
                    <p className="text-slate-500 text-sm mt-1">Join Sabanci Pharmacy today</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            name="name"
                            placeholder="Full Name"
                            className="input-field pl-10"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            className="input-field pl-10"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            name="address"
                            placeholder="Delivery Address"
                            className="input-field pl-10"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="input-field pl-10"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            className="input-field pl-10"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button disabled={loading} className="btn-primary w-full py-3 mt-4">
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-teal-600 font-semibold hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}