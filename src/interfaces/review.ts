export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  orderId: string
  rating: number
  comment: string
  images?: string[]
  verifiedPurchase: boolean
  helpfulCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateReviewRequest {
  orderId: string
  rating: number
  comment: string
  images?: string[]
}

export interface UpdateReviewRequest {
  rating?: number
  comment?: string
}

export interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}
