"use client"

import React, { useState, useRef, useEffect } from "react"
import { Bell, BookOpen, MessageCircle, Info } from "lucide-react"
import TextLink from "@/components/ui/TextLink"

export default function NotificationCard() {
  const [open, setOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true) // กำหนดให้มีการแจ้งเตือนที่ยังไม่ได้อ่าน
  const cardRef = useRef(null)

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
    setHasUnread(false) // เมื่อเปิดเมนูแล้ว ให้ลบสถานะ unread
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
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
        )}
        {hasUnread && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {/* การ์ดแจ้งเตือน */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-4">
            <h3 className="text-gray-800 font-semibold text-base mb-3 border-b pb-2">Notifications</h3>

            <ul className="space-y-3 text-sm text-gray-700 cursor-pointer">
              <li className="flex items-start gap-2 hover:bg-gray-100 p-2 rounded-lg transition">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <span>There is a new system update. Check it out!</span>
              </li>
              <li className="flex items-start gap-2 hover:bg-gray-100 p-2 rounded-lg transition">
                <BookOpen className="w-5 h-5 text-green-500 mt-0.5" />
                <span>New books have been added to your library.</span>
              </li>
              <li className="flex items-start gap-2 hover:bg-gray-100 p-2 rounded-lg transition">
                <MessageCircle className="w-5 h-5 text-purple-500 mt-0.5" />
                <span>Someone commented on your post.</span>
              </li>
            </ul>

            <div className="mt-4 text-right border-t pt-3">
              <TextLink
                href="/notifications"
                className="text-sm font-medium text-mint-light hover:text-mint-dark transition"
              >
                See all →
              </TextLink>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
