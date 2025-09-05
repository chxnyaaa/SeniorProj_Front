"use client"

import React, { useState, useEffect } from "react"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import GenreFilter from "@/components/ui/GenreFilter"
import GenreSection from "@/components/ui/GenreSection"
import { getBooks, checkin } from "@/lib/api/book"
import { genreOptions } from "@/constants/selectOptions"
import CustomAlertModal from "@/components/ui/CustomAlertModal"

export default function LibraryPage() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const [booksByGenre, setBooksByGenre] = useState({})
  const [pagesByGenre, setPagesByGenre] = useState({})
  const [loadingByGenre, setLoadingByGenre] = useState({})
  const [selectedGenres, setSelectedGenres] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  const [userData, setUserData] = useState(null)
  const [hasCheckedIn, setHasCheckedIn] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [modalInfo, setModalInfo] = useState({
    type: "info",
    title: "",
    message: "",
  })

  // --------- Load user from sessionStorage ----------
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

  // --------- Check-in after login (run once) ----------
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

  // --------- Fetch books per genre ----------
  async function fetchBooksForGenre(genre, page = 1) {
    setLoadingByGenre((prev) => ({ ...prev, [genre]: true }))

    try {
      const response = await getBooks({
        category: genre,
        limit: 20,
        page,
        search: searchTerm,
      })

      console.log(`genre: ${genre}, page: ${page}, response:`, response)

      setBooksByGenre((prev) => ({ ...prev, [genre]: response.data }))
      setPagesByGenre((prev) => ({ ...prev, [genre]: page }))
    } catch (error) {
      console.error(`Failed to fetch books for genre ${genre}`, error)
    } finally {
      setLoadingByGenre((prev) => ({ ...prev, [genre]: false }))
    }
  }

  // --------- Fetch initial books + on search/genre change ----------
  useEffect(() => {
    async function fetchInitialBooks() {
      const genresToFetch =
        selectedGenres.length > 0
          ? selectedGenres
          : genreOptions.map((g) => g.value)

      for (const genre of genresToFetch) {
        await fetchBooksForGenre(genre, 1)
      }
    }

    fetchInitialBooks()
  }, [searchTerm, selectedGenres])

  // --------- UI Helpers ----------
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

          {searchTerm && (
            <div className="text-white mb-4">
              Search results: <strong>{searchTerm}</strong>
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
