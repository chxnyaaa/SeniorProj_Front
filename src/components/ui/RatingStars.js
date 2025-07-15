import React from "react"
import { Star, StarHalf } from "lucide-react"

export default function RatingStars({ rating = 0 }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const stars = []

  // เต็ม
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`full-${i}`}
        className="w-5 h-5 text-yellow-400 stroke-white"
        fill="currentColor"
        strokeWidth={1.5}
      />
    )
  }

  // ครึ่ง
  if (hasHalfStar) {
    stars.push(
      <StarHalf
        key="half"
        className="w-5 h-5 text-yellow-400 stroke-white"
        fill="currentColor"
        strokeWidth={1.5}
      />
    )
  }

  // ว่าง
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star
        key={`empty-${i}`}
        className="w-5 h-5 text-transparent stroke-white"
        fill="none"
        strokeWidth={1.5}
      />
    )
  }

  return <div className="flex items-center">{stars}</div>
}
