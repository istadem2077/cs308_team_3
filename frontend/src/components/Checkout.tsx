import { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { CartItem } from '../App';
import { ordersAPI, OrderData } from '../services/api';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dormitory: '',
    roomNumber: '',
    notes: '',
  });
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [orderId, setOrderId] = useState<string>('');

  const hasPrescriptionItems = cartItems.some(
    item => item.requiresPrescription
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && hasPrescriptionItems) {
      setStep(3);
    } else {
      setStep(4);
      // Submit order to API
      setIsSubmitting(true);
      try {
        const orderData: OrderData = {
          ...formData,
          items: cartItems,
          totalPrice,
          prescriptionFile: prescriptionFile || undefined,
        };
        
        const response = await ordersAPI.create(orderData);
        setOrderId(response.orderId);
        setStep(4);
      } catch (error) {
        console.error('Order submission failed:', error);
        alert('Failed to place order. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your order will be delivered to your dormitory within 2-4 hours.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-600 text-sm mb-1">Order Total</p>
            <p className="text-blue-600">₺{totalPrice.toFixed(2)}</p>
          </div>
          <button
            onClick={onComplete}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-sm ${
                step >= 1 ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              Delivery Info
            </span>
            <span
              className={`text-sm ${
                step >= 2 ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              Review Order
            </span>
            {hasPrescriptionItems && (
              <span
                className={`text-sm ${
                  step >= 3 ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                Upload Prescription
              </span>
            )}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${
                  (step / (hasPrescriptionItems ? 3 : 2)) * 100
                }%`,
              }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {step === 1 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="mb-4">Delivery Information</h2>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Dormitory
                      </label>
                      <select
                        required
                        value={formData.dormitory}
                        onChange={e =>
                          setFormData({ ...formData, dormitory: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select dormitory</option>
                        <option value="A Block">A Block</option>
                        <option value="B Block">B Block</option>
                        <option value="C Block">C Block</option>
                        <option value="D Block">D Block</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Room Number
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.roomNumber}
                        onChange={e =>
                          setFormData({ ...formData, roomNumber: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Delivery Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={e =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue to Review
                  </button>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="mb-4">Review Your Order</h2>

                  <div className="space-y-3">
                    {cartItems.map(item => (
                      <div
                        key={item.id}
                        className="flex gap-4 border-b pb-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3>{item.name}</h3>
                          <p className="text-gray-600 text-sm">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="text-blue-600">
                          ₺{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <h3 className="mb-2">Delivery Address</h3>
                    <p className="text-gray-600 text-sm">{formData.name}</p>
                    <p className="text-gray-600 text-sm">
                      {formData.dormitory}, Room {formData.roomNumber}
                    </p>
                    <p className="text-gray-600 text-sm">{formData.phone}</p>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {hasPrescriptionItems
                      ? 'Continue to Upload Prescription'
                      : 'Place Order'}
                  </button>
                </div>
              )}

              {step === 3 && hasPrescriptionItems && (
                <div className="space-y-4">
                  <h2 className="mb-4">Upload Prescription</h2>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <p className="text-orange-800">
                      Your order contains items that require a prescription.
                      Please upload a valid prescription to continue.
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-gray-500 text-sm">
                      PDF, JPG, PNG up to 10MB
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="prescription-upload"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPrescriptionFile(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="prescription-upload"
                      className="inline-block mt-4 px-6 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      Select File
                    </label>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₺{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span>Total</span>
                  <span className="text-blue-600">₺{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Same-day campus delivery
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Secure payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}