import EpisodeItem from "@/components/ui/EpisodeItem"
import TextLink from "@/components/ui/TextLink"
import { getCoins, getHistoryPurchase, BayPurchase } from "@/lib/api/book"
export default function EpisodesList({ episodes, onUnlock, isAuthor,id }) {


  // console.log("EpisodesList episodes:", episodes)
  return (
   <>
    <div className="space-y-4">
      {episodes.map((ep) => (
        <EpisodeItem key={ep.id} episode={ep} onUnlock={onUnlock} isAuthor={isAuthor} id={id} />
      ))}
    </div>

    
    {isAuthor && (
      <div className="text-center mt-4">
        <TextLink href={`/add-books/${id}/episode`}>
          Add New Episode
        </TextLink>
      </div>
    )}



   </>
  )
}
