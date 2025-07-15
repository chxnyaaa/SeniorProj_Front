"use client"

import { useState, useEffect } from "react"
import BookInfo from "@/components/ui/BookInfo"
import EpisodesList from "@/components/ui/EpisodesList"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import { getBookId,updateIsComplete} from "@/lib/api/book"
import { getEpisodeProduct } from "@/lib/api/episode"
import { useParams,useRouter  } from "next/navigation"
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
  const { user, logout } = useAuth()
  const router = useRouter()

  
  console.log("User:", user)

  useEffect(() => {
    if (!user) {
      router.push("/login") // ถ้าไม่ login ให้ redirect
      return
    }
    if (!id) return

    const fetchBook = async () => {
      try {
        const dataArr = await getBookId(id)
        const data = dataArr.product || {}
        
        if (user && user.user && user.user.id && data.author_id) {
          if (user.user.id === data.author_id) {
            if(data.author_id == user.user.id){
              console.log("User is the author of this book")
              setIsAuthor(true)
            }
          }
        }
        setIsStatusWriterEnded(data.is_complete || false)
        setBook(data)
        setEpisodes(dataArr.episodes || []) // ใช้ [] ถ้าไม่มี

      
      } catch (err) {
        console.error("ไม่สามารถโหลดข้อมูลหนังสือได้:", err)
      }
    }

    fetchBook()
  }, [id, user])

  const handleUnlockEpisode = (eid) => {
    setEpisodes((prev) =>
      prev.map((ep) => (ep.id === eid ? { ...ep, isLocked: false, price: null } : ep))
    )
  }

  const unlockAllEpisodes = () => {
    setEpisodes((prev) => prev.map((ep) => ({ ...ep, isLocked: false, price: null })))
  }


  const handleSetIsStatusWriterEnded = async (value) => {
    setIsStatusWriterEnded(value)

    if (user?.user?.id && id) {
      try {
        await updateIsComplete(id, value)
      } catch (err) {
        console.error("Failed to update book status:", err)
      }
    }
  }


  if (!book) {
    return <div className="text-white p-8">Loading books...</div>
  }

  return (
    <div className="min-h-screen bg-custom-bg flex">
      <Sidebar currentlyPlaying={currentlyPlaying} setCurrentlyPlaying={setCurrentlyPlaying} />
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="min-h-screen bg-custom-bg text-white p-8">
          <div className="flex gap-8 mb-8">
            <div className="flex-shrink-0">
              {book.cover_url ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${book.cover_url}`}
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
              authorAvatar={
                book.avatar_url
                  ? `${process.env.NEXT_PUBLIC_API_URL}${book.avatar_url}`
                  : "https://images.icon-icons.com/2429/PNG/512/google_logo_icon_147282.png"
              }
              isStatusWriterEnded={isStatusWriterEnded}
              isAuthor={isAuthor}
              id={id}
              category={book.category || "Uncategorized"}
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
