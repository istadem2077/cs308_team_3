<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, Calendar, Star } from 'lucide-react';
import { OrderResponse, reviewsAPI } from '../services/api';
=======
import { useState } from 'react';
import { Package, Clock, CheckCircle, Truck, Calendar, Star, XCircle, RotateCcw, AlertCircle, Mail, Info } from 'lucide-react';
import { OrderResponse } from '../services/api';
>>>>>>> nazim
import { authService } from '../services/auth';

interface OrdersProps {
  orders: OrderResponse[];
  onUpdateOrderStatus: (orderId: string, newStatus: 'processing' | 'in-transit' | 'delivered' | 'cancelled' | 'refunded') => void;
  onRateProduct: (productId: string, rating: number, userName: string) => void;
  onAddComment: (productId: string, rating: number, comment: string, userName: string) => void;
}

interface RefundRequest {
  orderId: string;
  selectedItems: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    originalPrice: number;
    discount: number;
  }>;
  reason: string;
}

interface ItemRefundStatus {
  orderId: string;
  productId: string;
  status: 'requested' | 'approved' | 'rejected';
  refundAmount: number;
  requestDate: string;
  resolvedDate?: string;
  rejectionReason?: string;
}

export function Orders({ orders, onUpdateOrderStatus, onRateProduct, onAddComment }: OrdersProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'in-transit' | 'completed'>('all');
  const [ratingStates, setRatingStates] = useState<Record<string, { rating: number; showCommentBox: boolean; comment: string }>>({});
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [currentRefundOrder, setCurrentRefundOrder] = useState<OrderResponse | null>(null);
  const [selectedRefundItems, setSelectedRefundItems] = useState<Set<string>>(new Set());
  const [refundReason, setRefundReason] = useState('');
  const [showRefundConfirmation, setShowRefundConfirmation] = useState(false);
  const [refundStatuses, setRefundStatuses] = useState<ItemRefundStatus[]>([]);
  const [lastRefundAmount, setLastRefundAmount] = useState(0);
  const user = authService.getCurrentUser();

    useEffect(() => {
        const fetchUserReviews = async () => {
            if (!user) return;
            try {
                // Fetch reviews specifically for this user
                const userReviews = await reviewsAPI.getByUser(user.id);

                const newStates: Record<string, { rating: number; showCommentBox: boolean; comment: string }> = {};

                userReviews.forEach(review => {
                    newStates[review.productId] = {
                        rating: review.rating,
                        comment: review.comment || '',
                        // If there is a comment, we can choose to open the box automatically,
                        // or keep it closed until requested. keeping it false is cleaner UI.
                        showCommentBox: false
                    };
                });

                // Merge with existing state to avoid overwriting ongoing interactions
                setRatingStates(prev => ({ ...prev, ...newStates }));
            } catch (error) {
                console.error("Failed to load user reviews:", error);
            }
        };

        fetchUserReviews();
    }, [user?.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'in-transit':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'refunded':
        return <RotateCcw className="w-5 h-5 text-gray-500" />;
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
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRefundStatusColor = (status: 'requested' | 'approved' | 'rejected') => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
    }
  };

  const isWithin30Days = (orderDate: string): boolean => {
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const daysDiff = (currentTime - orderTime) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  };

  const getDaysRemaining = (orderDate: string): number => {
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const daysDiff = (currentTime - orderTime) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(30 - daysDiff));
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

  const handleRefundRequest = (order: OrderResponse) => {
    setCurrentRefundOrder(order);
    setSelectedRefundItems(new Set());
    setRefundReason('');
    setShowRefundModal(true);
  };

  const toggleItemSelection = (productId: string) => {
    const newSet = new Set(selectedRefundItems);
    if (newSet.has(productId)) {
      newSet.delete(productId);
    } else {
      newSet.add(productId);
    }
    setSelectedRefundItems(newSet);
  };

  const calculateRefundAmount = () => {
    if (!currentRefundOrder) return 0;
    
    let total = 0;
    selectedRefundItems.forEach(productId => {
      const item = currentRefundOrder.items.find(i => i.productId === productId);
      if (item) {
        total += item.price * item.quantity;
      }
    });
    
    return total;
  };

  const getItemRefundStatus = (orderId: string, productId: string): ItemRefundStatus | undefined => {
    return refundStatuses.find(status => status.orderId === orderId && status.productId === productId);
  };

  const handleSubmitRefund = () => {
    if (!currentRefundOrder || selectedRefundItems.size === 0 || !refundReason.trim()) {
      return;
    }
    
    const refundAmount = calculateRefundAmount();
    
    // Create refund status for each selected item
    const newRefundStatuses: ItemRefundStatus[] = Array.from(selectedRefundItems).map(productId => {
      const item = currentRefundOrder.items.find(i => i.productId === productId);
      return {
        orderId: currentRefundOrder.orderId,
        productId: productId,
        status: 'requested' as const,
        refundAmount: item ? item.price * item.quantity : 0,
        requestDate: new Date().toISOString(),
      };
    });
    
    setRefundStatuses(prev => [...prev, ...newRefundStatuses]);
    setLastRefundAmount(refundAmount);
    setShowRefundModal(false);
    setShowRefundConfirmation(true);
  };

  const canRequestRefund = (order: OrderResponse): boolean => {
    return order.status === 'delivered' && isWithin30Days(order.date);
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
                    {/* 30-day eligibility indicator */}
                    {order.status === 'delivered' && (
                      <div className="mt-1">
                        {isWithin30Days(order.date) ? (
                          <p className="text-green-600 text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Eligible for return ({getDaysRemaining(order.date)} days remaining)
                          </p>
                        ) : (
                          <p className="text-gray-500 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Return window closed (30 days passed)
                          </p>
                        )}
                      </div>
                    )}
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
                  {order.items.map((item, index) => {
                    const itemRefundStatus = getItemRefundStatus(order.orderId, item.productId);
                    
                    return (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-gray-900">{item.productName}</p>
                            <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <p className="text-xs text-gray-500">
                                <span className="line-through">₺{(item.originalPrice * item.quantity).toFixed(2)}</span>
                                <span className="text-green-600 ml-2">
                                  -{(((item.originalPrice - item.price) / item.originalPrice) * 100).toFixed(0)}% discount applied
                                </span>
                              </p>
                            )}
                          </div>
                          <div className="text-right mr-4">
                            <p className="text-gray-900">₺{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          
                          {/* Rating for completed orders */}
                          {order.status === 'delivered' && !itemRefundStatus && (
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
                        
                        {/* Refund status badge */}
                        {itemRefundStatus && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className={`px-3 py-1 rounded-full text-xs ${getRefundStatusColor(itemRefundStatus.status)}`}>
                                  Refund {itemRefundStatus.status.charAt(0).toUpperCase() + itemRefundStatus.status.slice(1)}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">
                                  Requested: {new Date(itemRefundStatus.requestDate).toLocaleDateString('en-GB')}
                                </p>
                                {itemRefundStatus.status === 'approved' && (
                                  <p className="text-xs text-green-600 mt-1">
                                    Refund amount: ₺{itemRefundStatus.refundAmount.toFixed(2)}
                                  </p>
                                )}
                                {itemRefundStatus.status === 'rejected' && itemRefundStatus.rejectionReason && (
                                  <p className="text-xs text-red-600 mt-1">
                                    Reason: {itemRefundStatus.rejectionReason}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                <div className="flex justify-end items-center gap-2">
                  {/* Cancel button - only for processing orders */}
                  {order.status === 'processing' && (
                    <>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this order?')) {
                            onUpdateOrderStatus(order.orderId, 'cancelled');
                          }
                        }}
                        className="text-red-600 hover:text-red-700 text-sm px-3 py-1 border border-red-600 rounded-lg hover:bg-red-50 flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel Order
                      </button>
                      <button
                        onClick={() => onUpdateOrderStatus(order.orderId, 'in-transit')}
                        className="text-blue-600 hover:text-blue-700 text-sm px-3 py-1 border border-blue-600 rounded-lg hover:bg-blue-50"
                      >
                        Move to In Transit
                      </button>
                    </>
                  )}
                  
                  {/* Return/Refund button - only for delivered orders within 30 days */}
                  {canRequestRefund(order) && (
                    <button
                      onClick={() => handleRefundRequest(order)}
                      className="text-gray-600 hover:text-gray-700 text-sm px-3 py-1 border border-gray-600 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Request Refund
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

      {/* Refund Request Modal */}
      {showRefundModal && currentRefundOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl mb-2">Request Refund</h3>
              <p className="text-gray-600 text-sm mb-4">Order #{currentRefundOrder.orderId}</p>
              
              {/* 30-Day Policy Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900">
                    <strong>Refund Policy:</strong> Returns are accepted within 30 days of delivery. 
                    You have <strong>{getDaysRemaining(currentRefundOrder.date)} days remaining</strong> to request a refund.
                  </p>
                </div>
              </div>

              {/* Product Selection */}
              <div className="mb-6">
                <h4 className="text-gray-900 mb-3">Select Products to Return</h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  {currentRefundOrder.items.map(item => {
                    const isSelected = selectedRefundItems.has(item.productId);
                    const originalPrice = item.originalPrice || item.price;
                    const discount = item.discount || 0;
                    const hasDiscount = originalPrice > item.price;

                    return (
                      <div
                        key={item.productId}
                        className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                        onClick={() => toggleItemSelection(item.productId)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleItemSelection(item.productId)}
                            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1">
                            <p className="text-gray-900">{item.productName}</p>
                            <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                            
                            {/* Price breakdown */}
                            <div className="mt-2 space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Original Price:</span>
                                <span className="text-gray-900">₺{(originalPrice * item.quantity).toFixed(2)}</span>
                              </div>
                              {hasDiscount && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Discount Applied:</span>
                                  <span className="text-green-600">
                                    -₺{((originalPrice - item.price) * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between pt-1 border-t border-gray-200">
                                <span className="text-gray-900">Refund Amount:</span>
                                <span className="text-blue-600">₺{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Refund Summary */}
              {selectedRefundItems.size > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-gray-900 mb-2">Refund Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Selected Items:</span>
                      <span className="text-gray-900">{selectedRefundItems.size}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-blue-300">
                      <span className="text-gray-900">Total Refund Amount:</span>
                      <span className="text-blue-600">₺{calculateRefundAmount().toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    * Refund amount equals the purchase-time price (including any discounts that were applied)
                  </p>
                </div>
              )}

              {/* Refund Reason */}
              <div className="mb-6">
                <label className="block text-gray-900 mb-2">
                  Reason for Refund <span className="text-red-500">*</span>
                </label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                >
                  <option value="">Select a reason</option>
                  <option value="damaged">Product arrived damaged</option>
                  <option value="wrong-item">Received wrong item</option>
                  <option value="not-as-described">Not as described</option>
                  <option value="expired">Product expired or near expiry</option>
                  <option value="quality">Quality issues</option>
                  <option value="no-longer-needed">No longer needed</option>
                  <option value="other">Other</option>
                </select>
                
                {refundReason === 'other' && (
                  <textarea
                    placeholder="Please provide additional details..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                )}
              </div>

              {/* Email Notification Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <Mail className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-900">
                    <strong>Email Notification:</strong> You will receive an email confirmation once your 
                    refund request is submitted. We'll notify you again when your request is reviewed 
                    (typically within 2-3 business days).
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRefundModal(false);
                    setSelectedRefundItems(new Set());
                    setRefundReason('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRefund}
                  disabled={selectedRefundItems.size === 0 || !refundReason}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Submit Refund Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal */}
      {showRefundConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl mb-2">Refund Request Submitted!</h3>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 text-sm mb-3">
                Your refund request has been successfully submitted and is now under review.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Request Status:</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Requested</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Refund Amount:</span>
                  <span className="text-blue-600">₺{lastRefundAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                <strong>You will be notified by email</strong> when your refund request is reviewed. 
                Approved refunds will be processed to your original payment method within 5-7 business days.
              </p>
            </div>

            <button
              onClick={() => setShowRefundConfirmation(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
