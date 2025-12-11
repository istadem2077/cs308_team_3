import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, CheckCircle, MapPin, Lock, CreditCard, Calendar, User as UserIcon, Shield, FileText } from 'lucide-react';
import { CartItem } from '../App';
import { ordersAPI, OrderData } from '../services/api';
import { authService, User } from '../services/auth';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
  onComplete: () => void;
}

export function Checkout({
  cartItems,
  totalPrice,
  onBack,
  onComplete,
}: CheckoutProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [orderDate, setOrderDate] = useState<string>('');
  
  // Payment information
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Load user data on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const hasPrescriptionItems = cartItems.some(
    item => item.requiresPrescription
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrescriptionFile(file);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleSubmitPayment = async () => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const orderData: OrderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice,
        deliveryAddress: {
          name: user.name,
          phone: user.phone,
          city: user.address.city,
          province: user.address.province,
          postcode: user.address.postcode,
          addressLine: user.address.addressLine,
          notes,
        },
        prescriptionRequired: hasPrescriptionItems,
      };

      const order = await ordersAPI.create(orderData);
      setOrderId(order.orderId);
      setOrderDate(new Date().toLocaleDateString('en-GB'));
      setStep(4);
    } catch (error) {
      console.error('Order submission failed:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4">Delivery Information</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start gap-2">
          <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-900 text-sm">
              <strong>Delivery address is locked</strong>
            </p>
            <p className="text-blue-700 text-sm">
              To change your delivery address, please update it in{' '}
              <strong>My Account</strong> page.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-2">Full Name</label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
              {user?.name}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm mb-2">Email</label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">Phone</label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                {user?.phone}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Delivery Address
            </label>
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">City</label>
                  <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                    {user?.address.city}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 text-xs mb-1">
                    Province/District
                  </label>
                  <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                    {user?.address.province}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 text-xs mb-1">Postcode</label>
                  <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                    {user?.address.postcode}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 text-xs mb-1">Address Line</label>
                <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {user?.address.addressLine}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-900 text-sm">
                  <strong>Complete Delivery Address:</strong>
                </p>
                <p className="text-blue-800 text-sm mt-1">
                  {user?.address.addressLine}
                  <br />
                  {user?.address.province}, {user?.address.city}
                  <br />
                  {user?.address.postcode}, Turkey
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-2">
              Delivery Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Special delivery instructions..."
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Continue to Review
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4">Order Review</h3>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="mb-3 text-gray-900">Order Summary</h4>
          <div className="space-y-2">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-gray-900">
                  ₺{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t flex justify-between">
              <span>Total</span>
              <span>₺{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="mb-3 text-gray-900">Delivery Information</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phone}
            </p>
            <p>
              <strong>Address:</strong> {user?.address.addressLine},{' '}
              {user?.address.province}, {user?.address.city} {user?.address.postcode}
            </p>
            {notes && (
              <p>
                <strong>Notes:</strong> {notes}
              </p>
            )}
          </div>
        </div>

        {hasPrescriptionItems && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-orange-900 mb-2">Prescription Required</h4>
            <p className="text-orange-700 text-sm mb-3">
              Your order contains items that require a prescription. Please upload
              your prescription to proceed.
            </p>

            <div className="space-y-2">
              <label className="flex items-center gap-2 px-4 py-3 bg-white border border-orange-300 rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                <Upload className="w-5 h-5 text-orange-600" />
                <span className="text-orange-900 text-sm">
                  {prescriptionFile
                    ? prescriptionFile.name
                    : 'Upload Prescription'}
                </span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep(1)}
          className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={hasPrescriptionItems && !prescriptionFile}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4">Payment Information</h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-900 text-sm">
            <strong>Secure Payment</strong> - Your payment information is encrypted and secure.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={e => {
                const cleaned = e.target.value.replace(/\s/g, '');
                if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
                  setCardNumber(formatCardNumber(cleaned));
                }
              }}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-2 flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              Name on Card
            </label>
            <input
              type="text"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Expiration Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={e => {
                  const cleaned = e.target.value.replace(/\D/g, '');
                  if (cleaned.length <= 4) {
                    setExpiryDate(formatExpiryDate(cleaned));
                  }
                }}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 3) {
                    setCvv(value);
                  }
                }}
                placeholder="123"
                maxLength={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <h4 className="mb-2 text-gray-900">Order Total</h4>
          <p className="text-blue-600">₺{totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep(2)}
          className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmitPayment}
          disabled={
            isSubmitting ||
            !cardNumber ||
            !cardName ||
            !expiryDate ||
            !cvv ||
            cardNumber.replace(/\s/g, '').length !== 16 ||
            cvv.length !== 3
          }
          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing Payment...' : 'Complete Purchase'}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="mb-2 text-green-900">Payment Successful!</h3>
        <p className="text-gray-600">Your order has been placed successfully</p>
      </div>

      {/* Invoice */}
      <div className="border-2 border-gray-300 rounded-lg p-6">
        <div className="text-center border-b pb-4 mb-4">
          <h3 className="text-blue-600 mb-1">Sabanci University Pharmacy</h3>
          <p className="text-gray-600 text-sm">Order Invoice</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600 text-sm">Order ID</p>
            <p className="text-gray-900">{orderId}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Date</p>
            <p className="text-gray-900">{orderDate}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Customer Name</p>
            <p className="text-gray-900">{user?.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-gray-900">{user?.email}</p>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="mb-6">
          <h4 className="mb-3 text-gray-900">Order Items</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 px-2 text-sm text-gray-700">Product</th>
                  <th className="text-center py-2 px-2 text-sm text-gray-700">Quantity</th>
                  <th className="text-right py-2 px-2 text-sm text-gray-700">Unit Price</th>
                  <th className="text-right py-2 px-2 text-sm text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-3 px-2 text-sm text-gray-900">{item.name}</td>
                    <td className="py-3 px-2 text-sm text-gray-900 text-center">{item.quantity}</td>
                    <td className="py-3 px-2 text-sm text-gray-900 text-right">₺{item.price.toFixed(2)}</td>
                    <td className="py-3 px-2 text-sm text-gray-900 text-right">
                      ₺{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grand Total */}
        <div className="border-t-2 border-gray-300 pt-4">
          <div className="flex justify-between items-center">
            <h4 className="text-gray-900">Grand Total</h4>
            <p className="text-blue-600">₺{totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h4 className="text-blue-900 mb-2">What&apos;s Next?</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• A confirmation email has been sent to {user?.email}</li>
            <li>• Your order will be prepared within 24 hours</li>
            <li>• Estimated delivery: 2-3 business days</li>
            <li>• Track your order in the &quot;My Account - Orders&quot; section</li>
          </ul>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <h2 className="mb-4">Checkout</h2>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      step >= s
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {s}
                  </div>
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    {s === 1 && 'Delivery'}
                    {s === 2 && 'Review'}
                    {s === 3 && 'Payment'}
                    {s === 4 && 'Complete'}
                  </span>
                  {s < 4 && (
                    <div
                      className={`flex-1 h-1 rounded ${
                        step > s ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
}
