"use client"

import { useState, useEffect, useRef  } from "react"
import BookInfo from "@/components/ui/BookInfo"
import EpisodesList from "@/components/ui/EpisodesList"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import { getBookId, updateIsComplete, getIsFollowing, addUserUpdateHistory } from "@/lib/api/book"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function BookDetailPage() {
  const params = useParams()
  const id = params.book_id
  const [book, setBook] = useState(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [rating, setRating] = useState(0)
  const [isAuthor, setIsAuthor] = useState(false)
  const [episodes, setEpisodes] = useState([])
  const [isStatusWriterEnded, setIsStatusWriterEnded] = useState(false)
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  
  const hasUpdatedHistory = useRef(false);


  useEffect(() => {
    if (isLoading) return
    if (!id) return

    const fetchBook = async () => {
      try {
        const dataArr = await getBookId(id)
        const data = dataArr.detail || {}
        setRating(data.avg_rating || 0)

      
        if (user && user.id && data.user_id) {
          if (user.id == data.user_id) {
            setIsAuthor(true)
          } else {
            const dataFollowing = await getIsFollowing(user.id, data.id)
            setIsFollowing(dataFollowing.detail.isFollowing || false)
            setRating(dataFollowing.detail.ratings || 0)
            setIsAuthor(false)
          }
        }

        setIsStatusWriterEnded(data.is_complete || false)
        setBook(data)
        setEpisodes(data.episodes || [])
      } catch (err) {
        console.error("ไม่สามารถโหลดข้อมูลหนังสือได้:", err)
      }
    }

    fetchBook()
  }, [id, user, isLoading])

  
  useEffect(() => {
    const updateHistory = async () => {
      if (!user?.id || !id) return;
      if (hasUpdatedHistory.current) return; // ✅ ป้องกันซ้ำ

      try {
        await addUserUpdateHistory(user.id, id, null);
        hasUpdatedHistory.current = true;
        console.log("Update history added");
      } catch (err) {
        console.error("ไม่สามารถอัปเดต history ได้:", err);
      }
    }

    updateHistory();
  }, [user?.id, id]);



  // ฟังก์ชันปลดล็อก episode เฉพาะตัว
  const handleUnlockEpisode = (eid) => {
    setEpisodes((prev) =>
      prev.map((ep) => (ep.id === eid ? { ...ep, isLocked: false, price: null } : ep))
    )
  }

  // ปลดล็อกทุก episode
  const unlockAllEpisodes = () => {
    setEpisodes((prev) => prev.map((ep) => ({ ...ep, isLocked: false, price: null })))
  }

  // อัพเดตสถานะหนังสือ (จบหรือไม่)
  const handleSetIsStatusWriterEnded = async (value) => {
    setIsStatusWriterEnded(value)

    if (user?.id && id) {
      try {
        await updateIsComplete(id, value)
      } catch (err) {
        console.error("Failed to update book status:", err)
      }
    }
  }

  if (!book) {
    return <div className="text-white p-8">Loading book...</div>
  }

  // ช่วยให้แน่ใจว่า URL รูปภาพต่อกันถูกต้อง
  const coverUrl = book.cover_image
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/books/${book.cover_image}`
    : null

  const authorAvatar = book.avatar_image
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/avatars/${book.avatar_image}`
    : "https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/profile/user-1.jpg"

  return (
    <div className="min-h-screen bg-custom-bg flex">
      <Sidebar currentlyPlaying={currentlyPlaying} setCurrentlyPlaying={setCurrentlyPlaying} />
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="min-h-screen bg-custom-bg text-white p-8">
          <div className="flex gap-8 mb-8">
            <div className="flex-shrink-0">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="w-80 h-96 object-cover rounded-lg shadow-2xl"
                />
              ) : (
                <div className="w-80 h-96 bg-gray-800 rounded-lg shadow-2xl flex items-center justify-center">
                  <span className="text-gray-500">No Cover Image</span>
                </div>
              )}
            </div>

            <BookInfo
              rating={rating}
              setRating={setRating}
              isBookmarked={isBookmarked}
              setIsBookmarked={setIsBookmarked}
              isFollowing={isFollowing}
              setIsFollowing={setIsFollowing}
              title={book.title}
              author={book.pen_name || book.username || "Unknown"}
              description={book.description}
              authorAvatar={authorAvatar}
              isStatusWriterEnded={isStatusWriterEnded}
              isAuthor={isAuthor}
              bookId={id}
              category={book.categories || "Uncategorized"}
              followers={book.followers || 0}
              userId={user?.id || null}
            />
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">All episodes ({episodes.length})</h2>

              {isAuthor ? (
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold">Status: End</h2>
                  <label htmlFor="unlockToggle" className="relative cursor-pointer">
                    <input
                      type="checkbox"
                      id="unlockToggle"
                      className="sr-only peer"
                      checked={isStatusWriterEnded}
                      onChange={(e) => handleSetIsStatusWriterEnded(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-teal-500 transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  className="inline-flex items-center bg-mint-light hover:bg-mint-dark text-white font-semibold px-6 py-2 rounded cursor-pointer select-none"
                  onClick={unlockAllEpisodes}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      unlockAllEpisodes()
                    }
                  }}
                >
                  Unlock all episodes
                  <span className="ml-2 bg-gray-800 text-mint-light px-2 py-1 rounded text-sm">125 C</span>
                </div>
              )}
            </div>

            <EpisodesList episodes={episodes} onUnlock={handleUnlockEpisode} isAuthor={isAuthor} id={id} />
          </div>
        </div>
      </div>
    </div>
  )
}
