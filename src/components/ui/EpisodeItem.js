import { Badge } from "@/components/ui/badge"
import { Lock, Edit } from "lucide-react"
import Link from "next/link"

export default function EpisodeItem({ episode, onUnlock, isAuthor, id }) {

  // แปลง release_date เป็น Date object
  const releaseDate = episode.release_date ? new Date(episode.release_date) : null

  // แปลงเป็นวันที่แบบอังกฤษ เช่น July 12, 2025
  const dateStr = releaseDate
    ? releaseDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-"

  // แปลงเป็นเวลา เช่น 07:00 AM
  const timeStr = releaseDate
    ? releaseDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "-"

  return (
    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
      <div className="flex items-center gap-4" >
        {isAuthor && (
          <Link href={`/add-books/${id}/episode/${episode.id}`} className="text-teal-400 hover:text-mint-light transition-colors">
            <Edit />
          </Link>
        )}
        <span className="text-xl font-bold drop-shadow-md">#{episode.id}</span>
        <h3 className="text-lg font-semibold drop-shadow-md" onClick={() => window.location.href = `/book/${id}/${episode.id}`}>{episode.title}</h3>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right text-gray-400">
           <div className="flex items-center justify-end gap-2">
               {!isAuthor && !episode.isLocked && (
                <Lock
                  className="w-6 h-6 text-teal-600 cursor-pointer hover:text-mint-dark transition-colors"
                  title="Unlock episode"
                  onClick={() => onUnlock(episode.id)}
                />
              )}
              {episode.price && (
                <Badge className="bg-teal-300 text-black">
                  {episode.price} C
                </Badge>
              )}
            </div>
          <div className="text-sm">{dateStr}</div>
          <div className="text-sm">{timeStr}</div>
        </div>
      </div>
    </div>
  )
}
