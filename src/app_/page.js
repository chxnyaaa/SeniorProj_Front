"use client"

import React, { useState, useEffect, useCallback } from "react"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import GenreFilter from "@/components/ui/GenreFilter"
import GenreSection from "@/components/ui/GenreSection"
import { getBooks, checkin } from "@/lib/api/book"
import { genreOptions } from "@/constants/selectOptions"
import CustomAlertModal from "@/components/ui/CustomAlertModal"

// ฟังก์ชัน debounce ช่วยหน่วงเวลา เพื่อไม่ให้เรียก API ถี่เกินไป
function debounce(func, wait) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export default function LibraryPage() {
  // State ต่าง ๆ
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const [booksByGenre, setBooksByGenre] = useState({}) // เก็บหนังสือตาม genre
  const [pagesByGenre, setPagesByGenre] = useState({}) // เก็บหน้าปัจจุบันแต่ละ genre
  const [loadingByGenre, setLoadingByGenre] = useState({}) // สถานะ loading แยกตาม genre
  const [selectedGenres, setSelectedGenres] = useState([]) // genre ที่เลือก
  const [searchTerm, setSearchTerm] = useState("") // ข้อความ search input
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("") // searchTerm ที่ debounce แล้ว

  const [userData, setUserData] = useState(null) // ข้อมูล user จาก sessionStorage
  const [hasCheckedIn, setHasCheckedIn] = useState(false) // เช็คว่า check-in แล้วหรือยัง

  const [showModal, setShowModal] = useState(false)
  const [modalInfo, setModalInfo] = useState({
    type: "info",
    title: "",
    message: "",
  })

  // โหลด user จาก sessionStorage ครั้งเดียวตอน mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user")
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser))
      } catch (err) {
        console.error("Error parsing user from sessionStorage:", err)
      }
    }
  }, [])

  // เช็คอิน user ครั้งแรกหลังโหลด userData
  useEffect(() => {
    async function checkInUser() {

      if (!userData || hasCheckedIn) return
      try {
        const res = await checkin(userData.id)
        if (res.status_code === 200) {
          setHasCheckedIn(true)
          setModalInfo({
            type: "success",
            title: "Check-in Successful",
            message: res.detail || "You have successfully checked in.",
          })
          setShowModal(true)
        }
      } catch (error) {
        console.error("Check-in error:", error)
      }
    }
    checkInUser()
  }, [userData, hasCheckedIn])

  // debounce การเปลี่ยนแปลง searchTerm ก่อนอัพเดต debouncedSearchTerm
  const debouncedSetSearchTerm = useCallback(
    debounce((val) => {
      setDebouncedSearchTerm(val)
    }, 500),
    []
  )

  useEffect(() => {
    debouncedSetSearchTerm(searchTerm)
  }, [searchTerm, debouncedSetSearchTerm])

  // ฟังก์ชันโหลดหนังสือตาม genre และหน้า
  async function fetchBooksForGenre(genre, page = 1) {
    setLoadingByGenre((prev) => ({ ...prev, [genre]: true }))

    try {
      const response = await getBooks({
        category: genre,
        limit: 20,
        page,
        search: debouncedSearchTerm,
      })


      // อัพเดตข้อมูลหนังสือและหน้าปัจจุบันสำหรับ genre นั้น ๆ
      setBooksByGenre((prev) => ({ ...prev, [genre]: response.data || [] }))
      setPagesByGenre((prev) => ({ ...prev, [genre]: page }))
    } catch (error) {
      console.error(`Failed to fetch books for genre ${genre}`, error)
    } finally {
      setLoadingByGenre((prev) => ({ ...prev, [genre]: false }))
    }
  }

  // โหลดหนังสือเมื่อ selectedGenres หรือ debouncedSearchTerm เปลี่ยนแปลง
  useEffect(() => {
    async function fetchInitialBooks() {
      const genresToFetch =
        selectedGenres.length > 0
          ? selectedGenres
          : genreOptions.map((g) => g.value)

      // โหลดหนังสือพร้อมกันทุก genre ด้วย Promise.all
      await Promise.all(genresToFetch.map((genre) => fetchBooksForGenre(genre, 1)))
    }
    fetchInitialBooks()
  }, [debouncedSearchTerm, selectedGenres])

  // UI helper สำหรับ toggle genre
  function toggleGenre(genre) {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    )
  }

  function clearGenres() {
    setSelectedGenres([])
  }

  function shouldDisplayCategory(category) {
    return selectedGenres.length === 0 || selectedGenres.includes(category)
  }

  function handleModalConfirm() {
    setShowModal(false)
  }

  // แสดง loading ถ้ามี genre ไหนกำลังโหลด
  if (Object.values(loadingByGenre).some(Boolean)) {
    return <div className="text-white p-6">Loading...</div>
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
