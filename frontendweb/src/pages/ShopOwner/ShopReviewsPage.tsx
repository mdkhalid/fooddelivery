import { useState } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import { cn } from '@/utils/cn'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import Pagination from '@/components/ui/Pagination'
import EmptyState from '@/components/ui/EmptyState'
import ReviewCard from './components/ReviewCard'
import type { Rating, RatingDistribution } from '@/types/rating.types'

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'lowest', label: 'Lowest Rated' },
]

const mockDistribution: RatingDistribution = { '1': 3, '2': 5, '3': 12, '4': 38, '5': 62 }

const mockReviews: Rating[] = [
  { id: '1', orderId: 'o1', userId: 'u1', restaurantId: 'r1', rating: 5, review: 'Amazing food! The grilled chicken was perfectly cooked and the delivery was super fast.', tags: [], images: [], isAnonymous: false, createdAt: '2026-06-15T10:00:00Z', updatedAt: '2026-06-15T10:00:00Z' },
  { id: '2', orderId: 'o2', userId: 'u2', restaurantId: 'r1', rating: 4, review: 'Good pasta but delivery took a bit long. Will order again.', tags: [], images: [], isAnonymous: false, createdAt: '2026-06-14T15:00:00Z', updatedAt: '2026-06-14T15:00:00Z' },
  { id: '3', orderId: 'o3', userId: 'u3', restaurantId: 'r1', rating: 5, review: 'Best spring rolls in town! Always fresh and crispy.', tags: [], images: [], isAnonymous: false, createdAt: '2026-06-13T12:00:00Z', updatedAt: '2026-06-13T12:00:00Z',
    response: { id: 'r1', responderId: 'owner1', responderName: 'Tasty Bites', responderRole: 'restaurant', content: 'Thank you so much! We look forward to serving you again.', createdAt: '2026-06-13T14:00:00Z' },
  },
  { id: '4', orderId: 'o4', userId: 'u4', restaurantId: 'r1', rating: 3, review: 'Food was okay, nothing special. The garlic bread was stale.', tags: [], images: [], isAnonymous: false, createdAt: '2026-06-12T18:00:00Z', updatedAt: '2026-06-12T18:00:00Z' },
  { id: '5', orderId: 'o5', userId: 'u5', restaurantId: 'r1', rating: 5, review: 'The chocolate cake is to die for! Highly recommend.', tags: [], images: [], isAnonymous: true, createdAt: '2026-06-11T20:00:00Z', updatedAt: '2026-06-11T20:00:00Z' },
]

const totalReviews = Object.values(mockDistribution).reduce((a, b) => a + b, 0)
const averageRating = Object.entries(mockDistribution).reduce((sum, [stars, count]) => sum + Number(stars) * count, 0) / totalReviews

export default function ShopReviewsPage() {
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)

  const sorted = [...mockReviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating
    if (sortBy === 'lowest') return a.rating - b.rating
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
          <p className="text-sm text-gray-500 mt-1">{totalReviews} total reviews</p>
        </div>
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-44"
        />
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
              <div className="flex items-center gap-0.5 mt-1 justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-5 h-5',
                      i < Math.round(averageRating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200'
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">{totalReviews} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3">{stars}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full"
                      style={{ width: `${(mockDistribution[String(stars) as keyof RatingDistribution] / totalReviews) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-6 text-right">
                    {mockDistribution[String(stars) as keyof RatingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Review Highlights</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
              <span className="text-sm text-green-700">Great food</span>
              <span className="text-sm font-medium text-green-800">45%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
              <span className="text-sm text-blue-700">Fast delivery</span>
              <span className="text-sm font-medium text-blue-800">32%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50">
              <span className="text-sm text-purple-700">Good packaging</span>
              <span className="text-sm font-medium text-purple-800">28%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sorted.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Star className="h-12 w-12" />}
              title="No reviews yet"
              description="Customer reviews will appear here once they start rating their orders."
            />
          </Card>
        ) : (
          sorted.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>

      <Pagination currentPage={page} totalPages={2} onPageChange={setPage} />
    </div>
  )
}
