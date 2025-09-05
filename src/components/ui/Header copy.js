import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import TextLink from "@/components/ui/TextLink"
import { Home, Search } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import UserProfileMenu from "./UserProfileMenu"
import NotificationCard from "@/components/ui/NotificationCard"

export default function Header({ onSearch }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [searchText, setSearchText] = useState("")

  const handleLogout = (e) => {
    e.preventDefault()
    logout()
    router.push("/login")
  }

  // ✅ ค้นหาเมื่อกด Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onSearch(searchText)
    }
  }

  return (
    <>
    <div className="">
    <header className="bg-custom-bg border-b border-white p-4 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <TextLink href="/" className="text-mint-light hover:text-mint-dark transition-colors font-bold text-lg">
            <Home className="w-8 h-8" />
          </TextLink>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search books..."
              className="pl-10 bg-white border-none rounded-full h-10"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown} // 👈 เพิ่มตรงนี้
            />
          </div>

          {/* ปุ่ม Clear */}
          <button
            onClick={() => {
              setSearchText("")
              onSearch("")
            }}
            className="text-teal-500 hover:text-teal-700"
          >
            Clear
          </button>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <NotificationCard />
              <UserProfileMenu user={user} logout={handleLogout} />
            </>
          ) : (
            <TextLink href="/login" className="text-mint-light hover:text-mint-dark transition-colors font-medium">
              Login / Signup
            </TextLink>
          )}
        </div>
      </div>
    </header>
    </div>
    </>
  )
}
