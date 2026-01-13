import { useState , useEffect} from 'react';
import {
  Search,
  User,
  LayoutDashboard,
  Package,
  LogOut,
  FolderTree,
  ShoppingBag,
  Warehouse,
  Truck,
  MessageSquare,
  Star,
  Check,
  X,
} from 'lucide-react';

export interface ProductReview {
  id: string;
  userName: string;
  productName: string;
  productId: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'disapproved';
}

interface PreviewsProps {
  reviews: Promise<ProductReview[]>; // Changed to match parent
  onBack: () => void;
  onNavigate: (tab: string) => void;
  onUpdateReviewStatus: (id: string, status: 'approved' | 'pending' | 'disapproved') => void;
}

export function Previews({ reviews, onBack, onNavigate, onUpdateReviewStatus }: PreviewsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewList, setReviewList] = useState<ProductReview[]>([]);

  useEffect(() => {
    reviews.then(data => setReviewList(data));
  }, [reviews]);

  const filteredReviews = reviewList.filter(
    review =>
        (review.userName || "anonymous").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (review.productName || "unknown").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.comment || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg">Product Manager</h2>
              <p className="text-xs text-gray-400">Sabanci University</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="mb-2">
            <p className="text-xs text-gray-400 px-3 mb-2">NAVIGATION</p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onNavigate('categories')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <FolderTree className="w-5 h-5" />
              <span>Categories</span>
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Products</span>
            </button>
            <button
              onClick={() => onNavigate('stock')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <Warehouse className="w-5 h-5" />
              <span>Stock Management</span>
            </button>
            <button
              onClick={() => onNavigate('orders')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white mb-2"
            >
              <Truck className="w-5 h-5" />
              <span>Deliveries & Orders</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
              <MessageSquare className="w-5 h-5" />
              <span>Comments & Reviews</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 transition-all duration-200 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span>Exit Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-1">Comments & Reviews</h1>
              <p className="text-gray-500 text-sm">Manage customer reviews and feedback</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-gray-50"
                />
              </div>

              <button className="w-11 h-11 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
                <User className="w-5 h-5 text-blue-700" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-gray-900">Comments & Reviews</h3>
              </div>
            </div>

            {/* Reviews List */}
            <div className="divide-y divide-gray-100">
              {filteredReviews.map(review => (
                <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-gray-900">{review.userName}</p>
                        {renderStars(review.rating)}
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{review.productName}</p>

                      <p className="text-gray-700 mb-2">{review.comment}</p>

                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {review.status === 'approved' ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Approved</span>
                        </div>
                      ) : review.status === 'disapproved' ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
                          <X className="w-4 h-4" />
                          <span className="text-sm">Disapproved</span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => onUpdateReviewStatus(review.id, 'approved')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                          >
                            <Check className="w-4 h-4" />
                            <span className="text-sm">Approve</span>
                          </button>
                          <button
                            onClick={() => onUpdateReviewStatus(review.id, 'disapproved')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                          >
                            <X className="w-4 h-4" />
                            <span className="text-sm">Disapprove</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredReviews.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No reviews found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
