import React, { useState, useEffect, useRef } from "react"
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
  const debounceTimeout = useRef(null)

  const handleLogout = (e) => {
    e.preventDefault()
    logout()
    router.push("/login")
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchText(value)

    // clear timeout เดิมก่อน
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // ตั้ง timeout ใหม่ 500ms ก่อนจะเรียก onSearch
    debounceTimeout.current = setTimeout(() => {
      onSearch(value)
    }, 500)
  }

  // เคลียร์ timeout ถ้า component ถูกทำลาย
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])


  return (
    <header className="bg-custom-bg border-b border-white p-4">
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
              onChange={handleInputChange}
            />
          </div>
          {/* Add button to clear search */}
          <button
            onClick={() => {
              setSearchText("")
              onSearch("")
            }}
            className="text-gray-400 hover:text-gray-600"
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
            <>
            <TextLink href="/login" className="text-mint-light hover:text-mint-dark transition-colors font-medium">
              Login / Signup
            </TextLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
