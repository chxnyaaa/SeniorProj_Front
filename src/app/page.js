"use client"

import React, { useState, useEffect } from "react"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import GenreFilter from "@/components/ui/GenreFilter"
import GenreSection from "@/components/ui/GenreSection"
import { getBooks } from "@/lib/api/book"
import { genreOptions } from "@/constants/selectOptions"

export default function LibraryPage() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const [booksByGenre, setBooksByGenre] = useState({})
  const [pagesByGenre, setPagesByGenre] = useState({})
  const [loadingByGenre, setLoadingByGenre] = useState({})
  const [selectedGenres, setSelectedGenres] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  async function fetchBooksForGenre(genre, page = 1) {
    setLoadingByGenre((prev) => ({ ...prev, [genre]: true }))

    try {
      const response = await getBooks({ category: genre, limit: 20, page, search: searchTerm })
      setBooksByGenre((prev) => ({ ...prev, [genre]: response.data }))
      setPagesByGenre((prev) => ({ ...prev, [genre]: page }))
    } catch (error) {
      console.error(`Failed to fetch books for genre ${genre} page ${page}`, error)
    } finally {
      setLoadingByGenre((prev) => ({ ...prev, [genre]: false }))
    }
  }

  // โหลดข้อมูลตอนแรก หรือเวลาค้นหา หรือเลือกประเภทเปลี่ยน
  useEffect(() => {
    async function fetchInitialBooks() {
      for (const genre of genreOptions) {
        await fetchBooksForGenre(genre.value, 1)
      }
    }
    fetchInitialBooks()
  }, [searchTerm, selectedGenres])

  function toggleGenre(genre) {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  function shouldDisplayCategory(category) {
    return selectedGenres.length === 0 || selectedGenres.includes(category)
  }

  if (Object.values(loadingByGenre).some(Boolean)) {
    return <div className="text-white p-6">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-custom-bg flex">
      <Sidebar currentlyPlaying={currentlyPlaying} setCurrentlyPlaying={setCurrentlyPlaying} />

      <div className="flex-1 flex flex-col">
        <Header onSearch={setSearchTerm} />

        <main className="flex-1 p-6 overflow-y-auto">
          
          <GenreFilter
            genreOptions={genreOptions}
            selectedGenres={selectedGenres}
            toggleGenre={toggleGenre}
            clearSelection={() => setSelectedGenres([])}
          />

          {/* แสดง text ที่ได้ค้นหา */}
          {searchTerm && (
            <div className="text-white mb-4">
              ผลการค้นหา: <strong>{searchTerm}</strong>
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
