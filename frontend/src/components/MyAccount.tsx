import { useState } from 'react';
import {
  User as UserIcon,
  Package,
  MapPin,
  Heart,
  LogOut,
  Edit2,
  Truck,
  CheckCircle,
  Clock,
  ChevronLeft,
  ArrowLeft,
  Star,
  MessageSquare,
  X,
  Save,
  Mail,
  Phone,
} from 'lucide-react';
import type { User } from '../services/auth';
import { authService } from '../services/auth';
import { OrderResponse, Product } from '../services/api';
import { CustomerChat } from './CustomerChat';
import { Orders } from './Orders';
//import { TURKISH_CITIES } from '../data/cities';

interface MyAccountProps {
  user: User;
  onBack: () => void;
  onUserUpdate: (user: User) => void;
  onLogout: () => void;
  orders: OrderResponse[];
  onUpdateOrderStatus: (orderId: string, newStatus: 'processing' | 'in-transit' | 'delivered') => void;
  onRateProduct: (productId: string, rating: number, userName: string) => void;
  onAddComment: (productId: string, rating: number, comment: string, userName: string) => void;
}

type ActiveView = 'profile' | 'orders';

export function MyAccount({ 
  user, 
  onBack, 
  onUserUpdate, 
  onLogout,
  orders,
  onUpdateOrderStatus,
  onRateProduct,
  onAddComment
}: MyAccountProps) {
  const [activeView, setActiveView] = useState<ActiveView>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSave = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const updatedUser = await authService.updateProfile(user.id, editedUser);
      onUserUpdate(updatedUser);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
    setError(null);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Confirm Logout</h3>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-600 text-center">
                Are you sure you want to log out?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Floating Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-center text-gray-900">{user.name}</h3>
                <p className="text-center text-gray-500 text-sm">{user.email}</p>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveView('profile');
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeView === 'profile'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>My Account</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('orders');
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeView === 'orders'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Orders</span>
                </button>

                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4 border-t pt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeView === 'orders' ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Orders 
                  orders={orders}
                  onUpdateOrderStatus={onUpdateOrderStatus}
                  onRateProduct={onRateProduct}
                  onAddComment={onAddComment}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2>My Account</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
                      >
                        <Save className="w-4 h-4" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    {successMessage}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-gray-700">
                      <UserIcon className="w-5 h-5" />
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 text-sm mb-2">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedUser.name}
                            onChange={e =>
                              setEditedUser({ ...editedUser, name: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="px-4 py-2 bg-gray-50 rounded-lg">{user.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-600 text-sm mb-2">Age</label>
                        {isEditing ? (
                          <input
                            type="number"
                            min="18"
                            max="100"
                            value={editedUser.age}
                            onChange={e =>
                              setEditedUser({
                                ...editedUser,
                                age: parseInt(e.target.value),
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="px-4 py-2 bg-gray-50 rounded-lg">{user.age}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-600 text-sm mb-2">Gender</label>
                        {isEditing ? (
                          <select
                            value={editedUser.gender}
                            onChange={e =>
                              setEditedUser({
                                ...editedUser,
                                gender: e.target.value as 'male' | 'female' | 'other',
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        ) : (
                          <p className="px-4 py-2 bg-gray-50 rounded-lg capitalize">
                            {user.gender}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-gray-700">
                      <Mail className="w-5 h-5" />
                      Contact Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 text-sm mb-2">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editedUser.email}
                            onChange={e =>
                              setEditedUser({ ...editedUser, email: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="px-4 py-2 bg-gray-50 rounded-lg">{user.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-600 text-sm mb-2">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editedUser.phone}
                            onChange={e =>
                              setEditedUser({ ...editedUser, phone: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="px-4 py-2 bg-gray-50 rounded-lg">{user.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-gray-700">
                      <MapPin className="w-5 h-5" />
                      Delivery Address
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 text-sm mb-2">City</label>
                        {isEditing ? (
                          <select
                            value={editedUser.address.city}
                            onChange={e =>
                              setEditedUser({
                                ...editedUser,
                                address: { ...editedUser.address, city: e.target.value },
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select city</option>
                            {TURKISH_CITIES.map(city => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="px-4 py-2 bg-gray-50 rounded-lg">
                            {user.address.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-600 text-sm mb-2">
                          Province/District
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedUser.address.province}
                            onChange={e =>
                              setEditedUser({
                                ...editedUser,
                                address: {
                                  ...editedUser.address,
                                  province: e.target.value,
                                },
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="px-4 py-2 bg-gray-50 rounded-lg">
                            {user.address.province}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-600 text-sm mb-2">
                          Postcode
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedUser.address.postcode}
                            onChange={e =>
                              setEditedUser({
                                ...editedUser,
                                address: {
                                  ...editedUser.address,
                                  postcode: e.target.value,
                                },
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="px-4 py-2 bg-gray-50 rounded-lg">
                            {user.address.postcode}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-600 text-sm mb-2">
                          Address Line
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedUser.address.addressLine}
                            onChange={e =>
                              setEditedUser({
                                ...editedUser,
                                address: {
                                  ...editedUser.address,
                                  addressLine: e.target.value,
                                },
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="px-4 py-2 bg-gray-50 rounded-lg">
                            {user.address.addressLine}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Complete Address Preview */}
                  {!isEditing && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-blue-900 mb-2">Complete Delivery Address</h4>
                      <p className="text-blue-800">
                        {user.address.addressLine}
                        <br />
                        {user.address.province}, {user.address.city}
                        <br />
                        {user.address.postcode}, Turkey
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Support Chat Widget */}
      <CustomerChat
        userName={user.name}
        userEmail={user.email}
        isLoggedIn={true}
      />
    </div>
  );
}