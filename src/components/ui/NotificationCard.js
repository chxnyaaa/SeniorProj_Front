"use client"

import React, { useState, useRef, useEffect } from "react"
import { Bell, BookOpen, Calendar } from "lucide-react"
import TextLink from "@/components/ui/TextLink"
import { getNotification, activeNotification } from "@/lib/api/book"

export default function NotificationCard() {
  const [open, setOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const [notifications, setNotifications] = useState([])
  const cardRef = useRef(null)
  const [userId, setUserId] = useState(null)


  // อ่าน userId จาก sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user")
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setUserId(parsed.id)
      } catch (err) {
        console.error("Error parsing user from sessionStorage:", err)
      }
    }
  }, [])

  
  

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!userId) return
        const res = await getNotification(userId)
        if (res?.status_code === 200 && Array.isArray(res.detail)) {
          setNotifications(res.detail)

          // ถ้ามีแจ้งเตือนที่ยังไม่อ่าน ให้โชว์ dot
          const unread = res.detail.some((n) => !n.read_at)
          setHasUnread(unread)
        }
      } catch (err) {
        console.error("Error fetching notifications:", err)
      }
    }

    fetchNotifications()
  }, [userId])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleOpen = () => {
    setOpen(!open)
    if (!open) {
      setHasUnread(false) // เมื่อเปิดเมนูแล้ว ลบสถานะ unread
    }
  }

  return (
    <div className="relative" ref={cardRef}>
      {/* ปุ่ม Bell */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-10 h-10 flex items-center justify-center text-teal-300 hover:text-mint-dark transition relative cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {hasUnread && (
          <>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </>
        )}
      </button>

      {/* การ์ดแจ้งเตือน */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-4">
            <h3 className="text-gray-800 font-semibold text-base mb-3 border-b pb-2">
              Notifications
            </h3>

            {notifications.length > 0 ? (
              <ul className="space-y-3 text-sm text-gray-700 cursor-pointer max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <li
                    key={n.notify_id}
                    className={`flex items-start gap-2 p-2 rounded-lg transition ${
                      !n.read_at ? "bg-gray-50" : "hover:bg-gray-100"
                    }`}
                    onClick={async () => {
                      if (!n.read_at) {
                        await activeNotification(userId, n.episode_id)
                        setNotifications((prev) =>
                          prev.map((item) =>
                            item.notify_id === n.notify_id
                              ? { ...item, read_at: n.created_at.replace("T", " ").replace(".000Z", "") }
                              : item
                          )
                        ) 
                      }
                    }}
                  >
                    {n.notify_type === "AVAILABLE" ? (
                      <BookOpen className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <Calendar className="w-5 h-5 text-orange-500 mt-0.5" />
                    )}
                    <div>
                      <span className="block">{n.notification_message}</span>
                      <span className="block text-xs text-gray-400 mt-1">
                        {n.created_at ? n.created_at.replace("T", " ").replace(".000Z", "") : "-"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm text-center py-6">
                No notifications
              </p>
            )}

            <div className="mt-4 text-right border-t pt-3">
              {/* <TextLink
                href="/notifications"
                className="text-sm font-medium text-mint-light hover:text-mint-dark transition"
              >
                See all →
              </TextLink> */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
