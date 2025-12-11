import { useState } from 'react';
import { ArrowLeft, CreditCard, MapPin, Check, Loader2 } from 'lucide-react';
import { CartItem } from '../App';
import { ordersAPI, OrderResponse } from '../services/api';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
  onComplete: (order: OrderResponse) => void;
}

type CheckoutStep = 'shipping' | 'payment';

export function Checkout({ cartItems, totalPrice, onBack, onComplete }: CheckoutProps) {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [loading, setLoading] = useState(false);
  
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: ''
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    // Construct order data (for display/frontend usage mostly, 
    // backend creates order from server-side cart)
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice,
      deliveryAddress: {
        name: shippingDetails.fullName,
        phone: shippingDetails.phone,
        city: shippingDetails.city,
        province: '', // simplified
        postcode: shippingDetails.zipCode,
        addressLine: shippingDetails.address,
        notes: shippingDetails.notes
      }
    };

    try {
      const order = await ordersAPI.create(orderData);
      onComplete(order);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shopping
      </button>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Steps Indicator */}
          <div className="flex items-center justify-between mb-8">
            {['Shipping', 'Payment'].map((s, i) => {
                // Determine if this step is active or completed
                const currentIdx = step === 'shipping' ? 0 : 1;
                const isActive = i === currentIdx;
                const isCompleted = i < currentIdx;
                
                return (
                  <div key={s} className="flex flex-col items-center flex-1 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors ${
                      isActive ? 'bg-blue-600 text-white' : 
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-sm ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                      {s}
                    </span>
                    {i < 1 && (
                      <div className={`absolute top-4 left-[60%] w-[80%] h-0.5 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
            })}
          </div>

          {step === 'shipping' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Shipping Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text"
                    value={shippingDetails.fullName}
                    onChange={e => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    type="tel"
                    value={shippingDetails.phone}
                    onChange={e => setShippingDetails({...shippingDetails, phone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input 
                    type="text"
                    value={shippingDetails.address}
                    onChange={e => setShippingDetails({...shippingDetails, address: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    type="text"
                    value={shippingDetails.city}
                    onChange={e => setShippingDetails({...shippingDetails, city: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input 
                    type="text"
                    value={shippingDetails.zipCode}
                    onChange={e => setShippingDetails({...shippingDetails, zipCode: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Notes (Optional)</label>
                  <textarea 
                    value={shippingDetails.notes}
                    onChange={e => setShippingDetails({...shippingDetails, notes: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
              </div>
              <button
                onClick={() => setStep('payment')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Method
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input 
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={paymentDetails.cardNumber}
                    onChange={e => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input 
                      type="text"
                      placeholder="MM/YY"
                      value={paymentDetails.expiry}
                      onChange={e => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <input 
                      type="text"
                      placeholder="123"
                      value={paymentDetails.cvc}
                      onChange={e => setPaymentDetails({...paymentDetails, cvc: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input 
                    type="text"
                    value={paymentDetails.name}
                    onChange={e => setPaymentDetails({...paymentDetails, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep('shipping')}
                  className="w-1/3 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-2/3 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₺${totalPrice.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="h-fit bg-gray-50 p-6 rounded-lg border">
          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p>₺{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>₺{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span>Total</span>
              <span>₺{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}