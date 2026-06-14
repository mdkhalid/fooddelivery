import { Star, MessageCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/format'
import Avatar from '@/components/ui/Avatar'
import type { Rating } from '@/types/rating.types'

interface ReviewCardProps {
  review: Rating
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <Avatar name={review.isAnonymous ? 'Anonymous' : `User ${review.userId.slice(-4)}`} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {review.isAnonymous ? 'Anonymous' : `Customer ${review.userId.slice(-4)}`}
              </p>
              <div className="flex items-center gap-0.5 mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-3.5 h-3.5',
                      i < review.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200'
                    )}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
          </div>

          {review.review && (
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{review.review}</p>
          )}

          {review.response && (
            <div className="mt-4 pl-4 border-l-2 border-orange-200 bg-orange-50/50 rounded-r-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="w-3.5 h-3.5 text-orange-600" />
                <p className="text-xs font-medium text-orange-700">{review.response.responderName}</p>
              </div>
              <p className="text-sm text-gray-600">{review.response.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
