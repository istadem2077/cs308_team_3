import { useState } from 'react';
import {
  Search,
  User,
  Mail,
  Phone,
  ShoppingBag,
  MessageSquare,
  Calendar,
  MapPin,
  CheckCircle2,
  Circle,
  Filter,
  Download,
  MoreVertical,
  Clock,
  Package,
} from 'lucide-react';

interface CustomersProps {
  onBack: () => void;
}

interface Customer {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  type: 'registered' | 'guest';
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  registeredDate: string;
  location: string;
  supportTickets: number;
  isOnline: boolean;
}

export function Customers({ onBack }: CustomersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'registered' | 'guest'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [customers] = useState<Customer[]>([
    {
      id: '1',
      customerId: 'CUST-234',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+90 555 123 4567',
      status: 'active',
      type: 'registered',
      totalOrders: 12,
      totalSpent: 1450.00,
      lastOrder: '2024-12-15',
      registeredDate: '2023-06-15',
      location: 'Istanbul, Turkey',
      supportTickets: 3,
      isOnline: true,
    },
    {
      id: '2',
      customerId: 'CUST-189',
      name: 'Sarah Williams',
      email: 'sarah.w@email.com',
      phone: '+90 555 234 5678',
      status: 'active',
      type: 'registered',
      totalOrders: 8,
      totalSpent: 890.00,
      lastOrder: '2024-12-14',
      registeredDate: '2023-09-22',
      location: 'Ankara, Turkey',
      supportTickets: 2,
      isOnline: false,
    },
    {
      id: '3',
      customerId: 'CUST-156',
      name: 'David Chen',
      email: 'david.chen@email.com',
      phone: '+90 555 345 6789',
      status: 'active',
      type: 'registered',
      totalOrders: 15,
      totalSpent: 2100.00,
      lastOrder: '2024-12-13',
      registeredDate: '2023-03-10',
      location: 'Izmir, Turkey',
      supportTickets: 5,
      isOnline: true,
    },
    {
      id: '4',
      customerId: 'CUST-098',
      name: 'Emma Johnson',
      email: 'emma.j@email.com',
      phone: '+90 555 456 7890',
      status: 'inactive',
      type: 'registered',
      totalOrders: 3,
      totalSpent: 320.00,
      lastOrder: '2024-11-20',
      registeredDate: '2024-01-15',
      location: 'Bursa, Turkey',
      supportTickets: 1,
      isOnline: false,
    },
    {
      id: '5',
      customerId: 'CUST-1',
      name: 'Guest User',
      email: 'N/A',
      phone: 'N/A',
      status: 'active',
      type: 'guest',
      totalOrders: 1,
      totalSpent: 45.00,
      lastOrder: '2024-12-15',
      registeredDate: '2024-12-15',
      location: 'N/A',
      supportTickets: 1,
      isOnline: false,
    },
    {
      id: '6',
      customerId: 'CUST-2',
      name: 'Guest User',
      email: 'N/A',
      phone: 'N/A',
      status: 'active',
      type: 'guest',
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: 'N/A',
      registeredDate: '2024-12-14',
      location: 'N/A',
      supportTickets: 1,
      isOnline: false,
    },
    {
      id: '7',
      customerId: 'CUST-145',
      name: 'Mike Johnson',
      email: 'mike.j@email.com',
      phone: '+90 555 567 8901',
      status: 'active',
      type: 'registered',
      totalOrders: 6,
      totalSpent: 670.00,
      lastOrder: '2024-12-12',
      registeredDate: '2023-11-05',
      location: 'Antalya, Turkey',
      supportTickets: 2,
      isOnline: false,
    },
    {
      id: '8',
      customerId: 'CUST-201',
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      phone: '+90 555 678 9012',
      status: 'active',
      type: 'registered',
      totalOrders: 10,
      totalSpent: 1200.00,
      lastOrder: '2024-12-11',
      registeredDate: '2023-07-18',
      location: 'Istanbul, Turkey',
      supportTickets: 4,
      isOnline: true,
    },
  ]);

  const [orderHistory] = useState<{ [key: string]: any[] }>({
    '1': [
      { id: 'ORD-1234', date: '2024-12-15', total: 120.50, status: 'Delivered' },
      { id: 'ORD-1198', date: '2024-12-10', total: 85.00, status: 'Delivered' },
      { id: 'ORD-1145', date: '2024-12-05', total: 150.00, status: 'Delivered' },
    ],
    '2': [
      { id: 'ORD-1220', date: '2024-12-14', total: 95.00, status: 'Delivered' },
      { id: 'ORD-1180', date: '2024-12-08', total: 110.00, status: 'Delivered' },
    ],
    '3': [
      { id: 'ORD-1210', date: '2024-12-13', total: 200.00, status: 'Delivered' },
      { id: 'ORD-1175', date: '2024-12-07', total: 175.00, status: 'Delivered' },
      { id: 'ORD-1150', date: '2024-12-02', total: 165.00, status: 'Delivered' },
    ],
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || customer.type === filterType;
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const selectedCustomerData = customers.find(customer => customer.id === selectedCustomer);
  const customerOrders = selectedCustomer ? orderHistory[selectedCustomer] || [] : [];

  const totalCustomers = customers.length;
  const registeredCustomers = customers.filter(c => c.type === 'registered').length;
  const guestCustomers = customers.filter(c => c.type === 'guest').length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Customer List */}
      <div className="w-96 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-slate-900 mb-1">Customers</h1>
              <p className="text-sm text-slate-500">{filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}</p>
            </div>
            <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 hover:text-slate-900">
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white text-sm transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="registered">Registered</option>
              <option value="guest">Guest</option>
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-2">
              <p className="text-xs text-blue-600 mb-0.5">Registered</p>
              <p className="text-lg text-blue-700">{registeredCustomers}</p>
            </div>
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-2">
              <p className="text-xs text-slate-600 mb-0.5">Guest</p>
              <p className="text-lg text-slate-700">{guestCustomers}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {filteredCustomers.map(customer => (
            <button
              key={customer.id}
              onClick={() => setSelectedCustomer(customer.id)}
              className={`w-full p-4 rounded-xl mb-2 text-left transition-all duration-200 ${
                selectedCustomer === customer.id
                  ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 border-2 border-blue-200 shadow-sm'
                  : 'hover:bg-slate-50 border-2 border-transparent hover:border-slate-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 ${customer.type === 'registered' ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-slate-500 to-slate-600'} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                    <span className="text-lg">{customer.name.charAt(0)}</span>
                  </div>
                  {customer.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-sm text-slate-900 truncate">{customer.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${
                        customer.type === 'registered'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {customer.type === 'registered' ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      {customer.customerId}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${
                        customer.status === 'active'
                          ? 'bg-green-50 text-green-700 border border-green-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {customer.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate">{customer.email}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" />
                      {customer.totalOrders} orders
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {customer.supportTickets} tickets
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Customer Details */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {selectedCustomer ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-16 h-16 ${selectedCustomerData?.type === 'registered' ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-slate-500 to-slate-600'} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                      <span className="text-2xl">{selectedCustomerData?.name.charAt(0)}</span>
                    </div>
                    {selectedCustomerData?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl text-slate-900">{selectedCustomerData?.name}</h3>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs ${
                          selectedCustomerData?.status === 'active'
                            ? 'bg-green-50 text-green-700 border border-green-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {selectedCustomerData?.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-600 border border-slate-200">
                        {selectedCustomerData?.customerId}
                      </span>
                      <span>•</span>
                      <span className={selectedCustomerData?.type === 'registered' ? 'text-blue-600' : 'text-slate-600'}>
                        {selectedCustomerData?.type === 'registered' ? 'Registered User' : 'Guest User'}
                      </span>
                      {selectedCustomerData?.isOnline && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1.5 text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Online</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 hover:text-slate-900">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-6xl mx-auto">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-xs text-slate-500">Total Orders</p>
                    </div>
                    <p className="text-2xl text-slate-900">{selectedCustomerData?.totalOrders}</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-xs text-slate-500">Total Spent</p>
                    </div>
                    <p className="text-2xl text-slate-900">₺{selectedCustomerData?.totalSpent.toFixed(2)}</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-xs text-slate-500">Support Tickets</p>
                    </div>
                    <p className="text-2xl text-slate-900">{selectedCustomerData?.supportTickets}</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <p className="text-xs text-slate-500">Avg. Order Value</p>
                    </div>
                    <p className="text-2xl text-slate-900">
                      ₺{selectedCustomerData?.totalOrders ? (selectedCustomerData.totalSpent / selectedCustomerData.totalOrders).toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                      <User className="w-5 h-5 text-slate-500" />
                      <h3 className="text-slate-900">Contact Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email Address</span>
                        </div>
                        <p className="text-sm text-slate-900 pl-5">{selectedCustomerData?.email}</p>
                      </div>
                      <div className="border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                          <Phone className="w-3.5 h-3.5" />
                          <span>Phone Number</span>
                        </div>
                        <p className="text-sm text-slate-900 pl-5">{selectedCustomerData?.phone}</p>
                      </div>
                      <div className="border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Location</span>
                        </div>
                        <p className="text-sm text-slate-900 pl-5">{selectedCustomerData?.location}</p>
                      </div>
                      <div className="border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Registration Date</span>
                        </div>
                        <p className="text-sm text-slate-900 pl-5">{selectedCustomerData?.registeredDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order History */}
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-slate-500" />
                        <h3 className="text-slate-900">Recent Orders</h3>
                      </div>
                      <span className="text-xs text-slate-500">{customerOrders.length} orders</span>
                    </div>
                    <div className="space-y-3">
                      {customerOrders.length > 0 ? (
                        customerOrders.map(order => (
                          <div key={order.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-900">{order.id}</span>
                              <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-100 rounded-md text-xs">
                                {order.status}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span>{order.date}</span>
                              <span className="text-slate-900">₺{order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-400">
                          <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No orders yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-slate-900 mb-2">No customer selected</h3>
              <p className="text-sm text-slate-500">Choose a customer from the list to view details</p>
            </div>
          </div>
        )}
      </div>

      {/* Activity Panel */}
      <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto shadow-sm">
        {selectedCustomerData ? (
          <div className="p-6">
            <h3 className="text-slate-900 mb-5">Recent Activity</h3>
            
            <div className="space-y-4">
              <div className="relative pl-6 pb-4 border-l-2 border-slate-200">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                <p className="text-xs text-slate-500 mb-1">2 hours ago</p>
                <p className="text-sm text-slate-900">Placed order ORD-1234</p>
                <p className="text-xs text-slate-600 mt-1">Order total: ₺120.50</p>
              </div>
              
              <div className="relative pl-6 pb-4 border-l-2 border-slate-200">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
                <p className="text-xs text-slate-500 mb-1">1 day ago</p>
                <p className="text-sm text-slate-900">Contacted support</p>
                <p className="text-xs text-slate-600 mt-1">Issue resolved successfully</p>
              </div>
              
              <div className="relative pl-6 pb-4 border-l-2 border-slate-200">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                <p className="text-xs text-slate-500 mb-1">5 days ago</p>
                <p className="text-sm text-slate-900">Order delivered</p>
                <p className="text-xs text-slate-600 mt-1">ORD-1198 delivered successfully</p>
              </div>
              
              <div className="relative pl-6 pb-4 border-l-2 border-slate-200">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                <p className="text-xs text-slate-500 mb-1">10 days ago</p>
                <p className="text-sm text-slate-900">Placed order ORD-1198</p>
                <p className="text-xs text-slate-600 mt-1">Order total: ₺85.00</p>
              </div>
              
              <div className="relative pl-6">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-slate-300 rounded-full border-2 border-white"></div>
                <p className="text-xs text-slate-500 mb-1">15 days ago</p>
                <p className="text-sm text-slate-900">Updated profile</p>
                <p className="text-xs text-slate-600 mt-1">Changed phone number</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">Select a customer to view activity</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
