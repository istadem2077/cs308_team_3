import { useState, useEffect } from 'react';
import { Search, Download, User } from 'lucide-react';
import { supportManagerAPI } from '../../services/managerApi';

interface CustomersProps {
  onBack: () => void;
}

export function Customers({ onBack }: CustomersProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    supportManagerAPI.getCustomers()
        .then(setCustomers)
        .catch(console.error)
        .finally(() => setIsLoading(false));
  }, []);

  return (
      <div className="flex h-screen bg-slate-50">
        <div className="w-full p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Customer Directory</h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>

          {isLoading ? <p>Loading...</p> : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-4 font-medium text-slate-600">Name</th>
                    <th className="p-4 font-medium text-slate-600">Email</th>
                    <th className="p-4 font-medium text-slate-600">Role</th>
                    <th className="p-4 font-medium text-slate-600">Status</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                  {customers.map((c: any) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="p-4 font-medium">{c.name}</td>
                        <td className="p-4 text-slate-500">{c.email}</td>
                        <td className="p-4 text-slate-500">{c.role}</td>
                        <td className="p-4"><span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">Active</span></td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>
      </div>
  );
}