import { useState, useEffect } from 'react';
import { api } from '../api/client';
import type {Product} from '../types';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("popularity");

    useEffect(() => {
        api.getProducts().then(setProducts);
    }, []);

    // Feature 7: Search & Sort Logic
    const filtered = products
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => sort === 'price' ? a.price - b.price : 0);

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select className="border p-2 rounded" value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="popularity">Most Popular</option>
                    <option value="price">Price: Low to High</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
        </div>
    );
}