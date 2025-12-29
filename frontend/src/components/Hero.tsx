import { Heart, Shield, Truck } from 'lucide-react';

export function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="mb-2">Welcome to SU Pharmacy</h2>
          <p className="text-blue-100">
            Quality healthcare products delivered to your campus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="mb-1">Fast Delivery</h3>
                <p className="text-blue-100 text-sm">
                  Same-day delivery on campus
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="mb-1">Verified Products</h3>
                <p className="text-blue-100 text-sm">
                  100% authentic medicines
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="mb-1">Expert Care</h3>
                <p className="text-blue-100 text-sm">
                  Professional pharmacist support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
