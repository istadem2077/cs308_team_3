import { X, Star } from 'lucide-react';
import { Product, Review } from '../App';

interface ProductReviewsProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
  userName?: string;
}

export function ProductReviews({
  isOpen,
  onClose,
  product,
  reviews,
}: ProductReviewsProps) {
  if (!isOpen) return null;

  const checkStatus = (review: Review) => {
      if (review.status === "APPROVED") {
          return (<p className="text-gray-700">{review.comment}</p>)
      }
  }

  const renderStars = (currentRating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= currentRating;
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${
            isFilled
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl bg-white rounded-lg shadow-xl z-50 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2>Reviews & Comments</h2>
              <p className="text-gray-600 mt-1">{product.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content: Rating Box + Reviews Side by Side */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex gap-6">
            {/* Rating Box - Left Side */}
            <div className="flex-shrink-0">
              <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="text-5xl mb-2 text-center">{product.rating.toFixed(1)}</div>
                <div className="flex items-center gap-1 mb-2 justify-center">
                  {renderStars(product.rating)}
                </div>
                <p className="text-sm text-gray-600 text-center">
                  {product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Reviews List - Right Side */}
            <div className="flex-1 min-w-0">
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No reviews yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="pb-4 border-b last:border-b-0">
                      {/* User Name */}
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-900">{review.userName}</p>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.date)}
                        </span>
                      </div>
                      
                      {/* Stars */}
                      <div className="flex items-center gap-0.5 mb-2">
                        {renderStars(review.rating)}
                      </div>
                      
                      {/* Comment */}
                      {/*<p className="text-gray-700">{review.comment ? review.status === "APPROVED" : ""}</p>*/}
                      {checkStatus(review)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
