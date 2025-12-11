import { useState } from 'react';
import { Package, Clock, CheckCircle, Truck, Calendar, Star } from 'lucide-react';
import { OrderResponse } from '../services/api';
import { authService } from '../services/auth';

interface OrdersProps {
  orders: OrderResponse[];
  onUpdateOrderStatus: (orderId: string, newStatus: 'processing' | 'in-transit' | 'delivered') => void;
  onRateProduct: (productId: string, rating: number, userName: string) => void;
  onAddComment: (productId: string, rating: number, comment: string, userName: string) => void;
}

export function Orders({ orders, onUpdateOrderStatus, onRateProduct, onAddComment }: OrdersProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'in-transit' | 'completed'>('all');
  const [ratingStates, setRatingStates] = useState<Record<string, { rating: number; showCommentBox: boolean; comment: string }>>({});
  const user = authService.getCurrentUser();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'in-transit':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'processing') return order.status === 'processing';
    if (activeTab === 'in-transit') return order.status === 'in-transit';
    if (activeTab === 'completed') return order.status === 'delivered';
    return true;
  });

  const handleRateProduct = (productId: string, rating: number) => {
    if (!user) return;
    
    const key = `${productId}`;
    setRatingStates(prev => ({
      ...prev,
      [key]: { rating, showCommentBox: false, comment: '' }
    }));
    
    onRateProduct(productId, rating, user.name);
  };

  const handleAddComment = (productId: string) => {
    if (!user) return;
    
    const key = `${productId}`;
    const state = ratingStates[key];
    
    if (state && state.comment.trim()) {
      onAddComment(productId, state.rating, state.comment.trim(), user.name);
      setRatingStates(prev => ({
        ...prev,
        [key]: { ...state, comment: '', showCommentBox: false }
      }));
    }
  };

  const renderStars = (productId: string, isCompleted: boolean) => {
    const key = `${productId}`;
    const currentRating = ratingStates[key]?.rating || 0;

    if (!isCompleted) {
      return null;
    }

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => handleRateProduct(productId, star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-5 h-5 ${
                star <= currentRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">My Orders</h2>
        <p className="text-gray-600">Track and view your pharmacy orders</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 whitespace-nowrap transition-colors ${
            activeTab === 'all'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setActiveTab('processing')}
          className={`px-4 py-2 whitespace-nowrap transition-colors ${
            activeTab === 'processing'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Processing
        </button>
        <button
          onClick={() => setActiveTab('in-transit')}
          className={`px-4 py-2 whitespace-nowrap transition-colors ${
            activeTab === 'in-transit'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          In Transit
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 whitespace-nowrap transition-colors ${
            activeTab === 'completed'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 mb-2">No orders found</h3>
          <p className="text-gray-500 text-sm">
            {activeTab === 'all' && "You haven't placed any orders yet"}
            {activeTab === 'processing' && 'No orders being processed at the moment'}
            {activeTab === 'in-transit' && 'No orders in transit'}
            {activeTab === 'completed' && 'No completed orders yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.orderId}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="text-gray-900">Order #{order.orderId}</h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.date).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status === 'in-transit' ? 'In Transit' : order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4 mb-4">
                <h4 className="text-gray-700 mb-3">Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1">
                        <p className="text-gray-900">{item.productName}</p>
                        <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="text-gray-900">₺{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      
                      {/* Rating for completed orders */}
                      {order.status === 'delivered' && (
                        <div className="flex flex-col items-end gap-2">
                          {renderStars(item.productId, true)}
                          {ratingStates[`${item.productId}`]?.rating > 0 && (
                            <button
                              onClick={() => {
                                const key = `${item.productId}`;
                                setRatingStates(prev => ({
                                  ...prev,
                                  [key]: { 
                                    ...prev[key], 
                                    showCommentBox: !prev[key]?.showCommentBox 
                                  }
                                }));
                              }}
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              {ratingStates[`${item.productId}`]?.showCommentBox 
                                ? 'Hide Comment' 
                                : 'Add Comment'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Comment boxes for items */}
                {order.status === 'delivered' && order.items.map((item, index) => {
                  const key = `${item.productId}`;
                  const state = ratingStates[key];
                  
                  if (!state?.showCommentBox) return null;

                  return (
                    <div key={`comment-${index}`} className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <label className="block text-gray-700 mb-2 text-sm">
                        Add a comment for {item.productName}
                      </label>
                      <textarea
                        value={state.comment}
                        onChange={(e) => {
                          setRatingStates(prev => ({
                            ...prev,
                            [key]: { ...prev[key], comment: e.target.value }
                          }));
                        }}
                        placeholder="Share your experience with this product..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => {
                            setRatingStates(prev => ({
                              ...prev,
                              [key]: { ...prev[key], showCommentBox: false, comment: '' }
                            }));
                          }}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddComment(item.productId)}
                          className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Submit Comment
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                  <p className="text-blue-600">₺{order.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Delivery Time</p>
                  <p className="text-gray-900">{order.estimatedDelivery}</p>
                </div>
                <div className="flex justify-end items-center">
                  {/* Manual status change buttons (for demo) */}
                  {order.status === 'processing' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.orderId, 'in-transit')}
                      className="text-blue-600 hover:text-blue-700 text-sm px-3 py-1 border border-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      Move to In Transit
                    </button>
                  )}
                  {order.status === 'in-transit' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.orderId, 'delivered')}
                      className="text-green-600 hover:text-green-700 text-sm px-3 py-1 border border-green-600 rounded-lg hover:bg-green-50"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Demo Notice */}
      {orders.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> Complete a purchase to see your orders here!
          </p>
        </div>
      )}
    </div>
  );
}
