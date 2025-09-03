import React from "react"
import { useRouter } from "next/navigation"
import RatingStars from "./RatingStars"
import { addUserUpdateHistory } from "@/lib/api/book"
import { useAuth } from "@/contexts/AuthContext"

export default function BookGrid({ books }) {
  const { user } = useAuth()
  const router = useRouter()

  const handleBookClick = async (book) => {
    if (!user?.id || !book?.id) return

    try {
      await addUserUpdateHistory(user.id, book.id, null)
    } catch (err) {
      console.error("ไม่สามารถอัปเดต history ได้:", err)
    }

    // ไปหน้าหนังสือ
    router.push(`/book/${book.id}`)
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-8">
      {books.map((book, index) => {
        const coverSrc = book.cover_image?.startsWith("http")
          ? book.cover_image
          : `${process.env.NEXT_PUBLIC_API_URL}/uploads/books/${book.cover_image || "placeholder.svg"}`

        return (
          <div
            key={book.id || index}
            className="flex flex-col items-center group cursor-pointer"
            onClick={() => handleBookClick(book)}
          >
            <div className="relative mb-2 transition-transform group-hover:scale-105">
              <img
                src={coverSrc}
                alt={book.title}
                className="w-full h-32 object-cover rounded-lg shadow-lg"
              />
            </div>

            <h3 className="text-white text-sm text-center mb-1 line-clamp-2">
              {book.title}
            </h3>
            <RatingStars rating={book.avg_rating || 0} />
          </div>
        )
      })}
    </div>
  )
}
