"use client"

import React, { useState, useRef, useEffect } from "react"
import TextLink from "@/components/ui/TextLink"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function UserProfileMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = (e) => {
    e.preventDefault()
    logout()
    router.push("/login")
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!user) {
    return null // หรือ loader ถ้า user ยังไม่โหลด
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* ปุ่มโปรไฟล์ */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
          <img
            src={user.user.profilePicture || "https://images.icon-icons.com/2429/PNG/512/google_logo_icon_147282.png"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* เมนูแบบการ์ด */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-300 z-50">
          <div className="p-4 flex flex-col gap-3">
            {/* แถวบน: รูป + ชื่อ */}
            <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  src={user.user.profilePicture || "https://images.icon-icons.com/2429/PNG/512/google_logo_icon_147282.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-gray-800 font-semibold text-lg truncate">{user.user.username}</span>
            </div>

            {/* แถว 2: Coin */}
            <div className="text-gray-600 font-medium">
              Coin: <span className="text-yellow-500">100 C</span>
            </div>

            {user.user.role !== "reader" && (
              <TextLink href="/my-writing" className="text-left text-gray-700 hover:text-mint-light font-medium">
                My Writing
              </TextLink>
            )}

            {/* แถว 4: My Profile */}
            <TextLink href="/profile" className="text-left text-gray-700 hover:text-mint-light font-medium">
              My Profile
            </TextLink>

            {/* ปุ่ม Logout */}
            <button
              onClick={handleLogout}
              className="text-left text-red-600 hover:text-red-800 font-medium mt-2 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
