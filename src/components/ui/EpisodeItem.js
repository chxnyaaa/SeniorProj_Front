"use client"

import React, { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Lock, Edit } from "lucide-react"
import Link from "next/link"
import AlertModalBuyEpisode from "@/components/ui/AlertModalBuyEpisode"
import { getCoins, getHistoryPurchase, BayPurchase } from "@/lib/api/book"
import { useRouter } from "next/navigation"

export default function EpisodeItem({ episode, onUnlock, isAuthor, id }) {

  const [modalShow, setModalShow] = useState(false)
  const [userId, setUserId] = useState(null)
  const [coins, setCoins] = useState(0)
  const [isLocked, setIsLocked] = useState(episode.isLocked || true)

  // ดึง userId จาก sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.id) setUserId(parsedUser.id)
      } catch (error) {
        console.error("Error parsing user from sessionStorage:", error)
      }
    }
  }, [])

  // เช็คประวัติการซื้อและดึงเหรียญ
  useEffect(() => {
    if (!userId) return
    const bookId = id || episode.book_id
    const episodeId = episode.id

   
    async function fetchData() {
      try {
        const historyRes = await getHistoryPurchase(userId, bookId)
        if (historyRes?.status_code === 200 && Array.isArray(historyRes.detail) && historyRes.detail[0].episode_id === episodeId) {
          // ถ้าซื้อแล้วให้ unlock
          if (historyRes.detail.length > 0) {
            setIsLocked(false)
          }
        }

        const coinsRes = await getCoins(userId)
        setCoins(coinsRes.detail?.totalCoins || 0)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [userId, id, episode.id])

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

  // แปลง episode.price เป็น number เพื่อเช็คง่ายขึ้น
  const episodePriceNum = Number(episode.price)

  // เปิด modal ซื้อ episode
  const handleBuyEpisode = () => {
    setModalShow(true)
  }

  // กดยืนยันซื้อ episode
  const handleConfirmBuy = () => {
    BayPurchase(userId, id, episode.id, episodePriceNum)
      .then(() => {
        setModalShow(false)
        setIsLocked(false) // อัพเดตสถานะ unlock ทันที
        if (typeof onUnlock === "function") onUnlock(episode.id)
      })
      .catch((error) => {
        console.error("Error purchasing episode:", error)
      })
  }

  // กดยกเลิก modal
  const handleCancelBuy = () => {
    setModalShow(false)
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
          {isAuthor && (
            <Link
              href={`/add-books/${id}/episode/${episode.id}`}
              className="text-teal-400 hover:text-mint-light transition-colors"
            >
              <Edit />
            </Link>
          )}
          <span className="text-xl font-bold drop-shadow-md">#{episode.priority}</span>

          {/* แสดงชื่อ episode */}
          {!isAuthor && isLocked && episodePriceNum > 0 ? (
            <h3 className="text-lg font-semibold drop-shadow-md cursor-pointer" onClick={handleBuyEpisode}>
              {episode.title}
            </h3>
          ) : (
            <h3
              className="text-lg font-semibold drop-shadow-md cursor-pointer"
              onClick={() => window.location.href = `/book/${id}/${episode.id}`}
            >
              {episode.title}
            </h3>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right text-gray-400">
            <div className="flex items-center justify-end gap-2">
              {!isAuthor && isLocked && episodePriceNum > 0 && (
                <Lock
                  className="w-6 h-6 text-teal-600 cursor-pointer hover:text-mint-dark transition-colors"
                  title="Unlock episode"
                  // onClick={() => onUnlock(episode.id)}
                />
              )}

              {/* Badge แสดงราคา หรือ Free เฉพาะตอนที่ยัง locked */}
              {isLocked && (
                <Badge className={episodePriceNum > 0 ? "bg-teal-300 text-black" : "bg-gray-600 text-white"}>
                  {episodePriceNum > 0 ? `${episodePriceNum} C` : "Free"}
                </Badge>
              )}
            </div>
            <div className="text-sm">{dateStr}</div>
            <div className="text-sm">{timeStr}</div>
          </div>
        </div>
      </div>

      {/* Modal confirm ซื้อ episode */}
      <AlertModalBuyEpisode
        show={modalShow}
        type="info"
        title="Buy Episode"
        message={`Are you sure you want to buy "${episode.title}" for ${episodePriceNum} C?`}
        coinCost={episodePriceNum}
        userCoinBalance={coins}
        onConfirm={handleConfirmBuy}
        onCancel={handleCancelBuy}
      />
    </>
  )
}
