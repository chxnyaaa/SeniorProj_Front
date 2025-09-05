import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Heart } from "lucide-react"
import {updateFollow, updateRating } from "@/lib/api/book"

export default function BookInfo(
  { rating
    , setRating
    , isBookmarked
    , setIsBookmarked
    , isFollowing
    , setIsFollowing
    , title
    , author
    , description
    , authorAvatar
    , isStatusWriterEnded
    , isAuthor
    , bookId 
    , category
    , followers
    , userId
}) {


  const renderStars = (currentRating) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starIndex = i + 1
      return (
        <span
          key={i}
          className={`text-xl cursor-pointer ${starIndex <= currentRating ? "text-mint-light" : "text-gray-600"}`}
          onClick={() => handleRating(starIndex)}
          role="button"
          tabIndex={0}
          aria-label={`Set rating to ${starIndex}`}
        >
          ★
        </span>
      )
    })
  }

  
const handleRating = async (newRating) => {
    setRating(newRating)
    
      const res = await updateRating(userId, bookId, newRating, "")
      if (res.status_code === 200) {
        console.log("Rating updated successfully")
      } else {
        console.error("Failed to update rating:", res.message)
      }
}
  const handleFollow = async () => {
    try {
      const res = await updateFollow(userId, bookId)
      console.log("Follow status updated:", res)
      if (res.status_code == 200) {
        console.log("Follow status updated successfully")
        setIsFollowing(!isFollowing)
      } else {
        console.error("Failed to update follow status:", res.message)
      }
    } catch (err) {
      console.error("Error updating follow status:", err)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        {isStatusWriterEnded ? (
          <Badge
            className="bg-teal-300 text-black border border-teal-600 font-semibold text-sm px-3 py-1 rounded-md hover:bg-teal-600 transition-colors"
        >
            END
        </Badge>
        ) : (
          <></>
        )}

        <h1 className="flex-1 text-4xl font-bold truncate">
            {title}
        </h1>

          {isAuthor ? (
        <a
          href={`/add-books/${bookId}`} // แก้ id เป็นตัวแปรจริงจาก props/state
          className="cursor-pointer p-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center"
          aria-label="Edit book"
        >
         <button className="w-6 h-6 text-teal-400 hover:text-mint-light transition-colors">
            Edit
         </button>
        </a>

      ) : (
        <></>
      )}

        {/* <span
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="cursor-pointer p-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center"
            role="button"
            tabIndex={0}
            aria-pressed={isBookmarked}
            aria-label={isBookmarked ? "Unbookmark" : "Bookmark"}
          >
          <Bookmark
            className={`w-6 h-6 transition-colors duration-200 ${
              isBookmarked ? "text-mint-light" : "text-gray-400"
            }`}
            fill={isBookmarked ? "currentColor" : "none"}
          />
        </span> */}


        </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
                src={authorAvatar} // URL รูปภาพ
                alt="Author Avatar"
                className="w-full h-full object-cover"
            />
        </div>

        
        <span className="text-xl text-gray-300">{author}</span>
         {!isAuthor ? (
          <Button
          variant="outline"
          size="sm"
          onClick={() => handleFollow(!isFollowing)}
          className="text-white border border-teal-300 bg-transparent hover:bg-teal-300 hover:text-gray-800 rounded-[60px] px-3 py-1 text-xs"
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
        ) : (
          <>
          {/* <span className="text-xl text-gray-300">
            Followers: {followers}
          </span> */}
          </>
        )}
      </div>

      <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-3xl">
        {description}
      </p>

      <div className="flex items-center mb-6 cursor-pointer" aria-label="Book rating">
        {renderStars(rating)}
        <span className="ml-3 text-gray-400">{rating} / 5</span>
      </div>

      <div className="flex items-center gap-3">
      {/* <Heart className="w-5 h-5 text-mint-light" /> */}
      <div className="flex gap-2">
        {category && category.length > 0 ? (
          category.map((cat) => (
            <Badge
              key={cat.id}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:border-mint-light cursor-default"
            >
              {cat.name}
            </Badge>
          ))
        ) : (
          <span className="text-gray-500 italic">No category</span>
        )}
      </div>
    </div>


     

    </div>
  )
}
