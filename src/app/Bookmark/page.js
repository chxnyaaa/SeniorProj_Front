"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import GenreFilter from "@/components/ui/GenreFilter"
import GenreSection from "@/components/ui/GenreSection"
import { getBookmark } from "@/lib/api/book"
import { genreOptions } from "@/constants/selectOptions"
import CustomAlertModal from "@/components/ui/CustomAlertModal"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

// debounce function ป้องกันเรียก API ถี่เกินไป
function debounce(func, wait) {
  let timeout
  return (...args) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export default function LibraryPage() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const [booksByGenre, setBooksByGenre] = useState({})
  const [pagesByGenre, setPagesByGenre] = useState({})
  const [loadingByGenre, setLoadingByGenre] = useState({})
  const [selectedGenres, setSelectedGenres] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalInfo, setModalInfo] = useState({
    type: "info",
    title: "",
    message: "",
  })

  const { user } = useAuth()
  const router = useRouter()
  const [loadingUser, setLoadingUser] = useState(true)

    // เช็ค user loaded
    useEffect(() => {
      if (user !== undefined) setLoadingUser(false)
    }, [user])
  
    // รีไดเร็กถ้าไม่ login
    useEffect(() => {
      if (!loadingUser && !user) router.push("/login")
    }, [user, loadingUser, router])

  // debounce ฟังก์ชันอัพเดต searchTerm
  // useRef เก็บ debounce function เพื่อไม่สร้างซ้ำทุก render
  const debouncedSetSearchTermRef = useRef()
  if (!debouncedSetSearchTermRef.current) {
    debouncedSetSearchTermRef.current = debounce((val) => {
      setDebouncedSearchTerm(val)
    }, 500)
  }

  useEffect(() => {
    debouncedSetSearchTermRef.current(searchTerm)
  }, [searchTerm])

  // ฟังก์ชันโหลดหนังสือตาม genre และ page
  async function fetchBooksForGenre(genre, page = 1) {
    if (!user) return // ถ้า user ยังไม่มี ไม่ต้องโหลด

    setLoadingByGenre((prev) => ({ ...prev, [genre]: true }))
    try {
      const response = await getBookmark({
        category: genre,
        limit: 20,
        page,
        search: debouncedSearchTerm,
        userId: user.id,
      })

      setBooksByGenre((prev) => ({
        ...prev,
        [genre]: response.data || [],
      }))
      setPagesByGenre((prev) => ({ ...prev, [genre]: page }))
    } catch (error) {
      console.error(`Failed to fetch books for genre ${genre}`, error)
      setModalInfo({
        type: "error",
        title: "Error fetching books",
        message: `Cannot load books for genre "${genre}".`,
      })
      setShowModal(true)
    } finally {
      setLoadingByGenre((prev) => ({ ...prev, [genre]: false }))
    }
  }

  // โหลดหนังสือใหม่เมื่อ searchTerm, selectedGenres หรือ user เปลี่ยน
  useEffect(() => {
    if (!user) return // รอ user พร้อมก่อนโหลด

    async function fetchInitialBooks() {
      const genresToFetch =
        selectedGenres.length > 0
          ? selectedGenres
          : genreOptions.map((g) => g.value)

      await Promise.all(genresToFetch.map((genre) => fetchBooksForGenre(genre, 1)))
    }

    fetchInitialBooks()
  }, [debouncedSearchTerm, selectedGenres, user])

  // toggle เลือก / ยกเลิกเลือก genre
  function toggleGenre(genre) {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    )
  }

  // เคลียร์การเลือก genre ทั้งหมด
  function clearGenres() {
    setSelectedGenres([])
  }

  // เช็คว่า category นั้นควรแสดงหรือไม่
  function shouldDisplayCategory(category) {
    return selectedGenres.length === 0 || selectedGenres.includes(category)
  }

  // ปิด modal alert
  function handleModalConfirm() {
    setShowModal(false)
  }

  // แสดง loading ถ้ากำลังโหลดข้อมูล genre ไหนอยู่
  if (Object.values(loadingByGenre).some(Boolean)) {
    return <div className="text-white p-6">Loading...</div>
  }

  // รอโหลด user
    if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  // ถ้าไม่มี user ให้แสดงข้อความก่อน redirect (หรือจะ return null ก็ได้)
  if (!user) {
    return <div className="text-white p-6">Redirecting to login...</div>
  }

  return (
    <div className="min-h-screen bg-custom-bg flex">
      <CustomAlertModal
        show={showModal}
        type={modalInfo.type}
        title={modalInfo.title}
        message={modalInfo.message}
        confirmText="OK"
        oneButton={true}
        onConfirm={handleModalConfirm}
      />

      <Sidebar
        currentlyPlaying={currentlyPlaying}
        setCurrentlyPlaying={setCurrentlyPlaying}
      />

      <div className="flex-1 flex flex-col">
        <Header onSearch={setSearchTerm} />

        <main className="flex-1 p-6 overflow-y-auto">
          <GenreFilter
            genreOptions={genreOptions}
            selectedGenres={selectedGenres}
            toggleGenre={toggleGenre}
            clearSelection={clearGenres}
          />

          {debouncedSearchTerm && (
            <div className="text-white mb-4">
              ผลการค้นหา: <strong>{debouncedSearchTerm}</strong>
            </div>
          )}

          {genreOptions.map(({ value, label }) => {
            if (!shouldDisplayCategory(value)) return null

            return (
              <GenreSection
                key={value}
                genre={value}
                label={label}
                books={booksByGenre[value] || []}
                loading={loadingByGenre[value] || false}
                currentPage={pagesByGenre[value] || 1}
                fetchBooksForGenre={fetchBooksForGenre}
              />
            )
          })}
        </main>
      </div>
    </div>
  )
}
