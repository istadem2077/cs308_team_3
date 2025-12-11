import { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
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
  onAddReview,
  userName,
}: ProductReviewsProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onAddReview({
      productId: product.id,
      userName: userName || 'Guest User',
      rating,
      comment: comment.trim(),
    });

    setRating(5);
    setComment('');
  };

  const renderStars = (currentRating: number, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = interactive
        ? i <= (hoveredStar || rating)
        : i <= currentRating;
      stars.push(
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => setRating(i) : undefined}
          onMouseEnter={interactive ? () => setHoveredStar(i) : undefined}
          onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
          className={interactive ? 'cursor-pointer' : ''}
          disabled={!interactive}
        >
          <Star
            className={`w-5 h-5 ${
              isFilled
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
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
                  <p>No reviews yet. Be the first to leave a review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="pb-4 border-b last:border-b-0">
                      {/* Stars and Date */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-0.5">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.date)}
                        </span>
                      </div>
                      
                      {/* Comment */}
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Review Form */}
        <div className="p-6 border-t bg-gray-50">
          <form onSubmit={handleSubmit}>
            <h3 className="mb-3">Leave a Review</h3>
            
            {/* Rating Selection */}
            <div className="mb-4">
              <label className="block text-sm mb-2 text-gray-700">
                Your Rating
              </label>
              <div className="flex items-center gap-1">
                {renderStars(rating, true)}
              </div>
            </div>

            {/* Comment Input */}
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm mb-2 text-gray-700">
                Your Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </>
  );
}