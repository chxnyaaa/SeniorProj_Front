"use client"

import { useState } from "react"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import BookGrid from "@/components/ui/BookGrid"

export default function LibraryPage() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)

  const horrorBooks = [
    { title: "All The Devils", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Chowders", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "A Treachery of Swans", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Asylum", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Diavola", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Metamorphosis", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Dracula", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Sour Car", rating: 4, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
  ]

  const fantasyBooks = [
    { title: "Unwritten", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Recruitment", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Voice of Ancestors", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Aetherra", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Never a Hero", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "The Darkening", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Dames and Demons", rating: 4, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Dragon's Whisper", rating: 4, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
  ]

  const romanceBooks = [
    { title: "Love Story 1", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Romance Novel", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Heart Tales", rating: 4, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Sweet Dreams", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Love Letters", rating: 4, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Romantic Story", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "True Love", rating: 5, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
    { title: "Forever Yours", rating: 4, cover: "https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg?aicid=books-design-system-web?height=200&width=150" },
  ]

  return (
    <div className="min-h-screen bg-custom-bg flex">
      <Sidebar currentlyPlaying={currentlyPlaying} setCurrentlyPlaying={setCurrentlyPlaying} />

      <div className="flex-1 flex flex-col">
        <Header/>
        <main className="flex-1 p-6 overflow-y-auto">
          <section className="mb-8">
            <h2 className="text-white text-2xl font-bold mb-6">
              Recommend: <span className="text-mint-light text-teal-300">Horror</span>
            </h2>
            <BookGrid books={horrorBooks} />
          </section>

          <section className="mb-8">
            <h2 className="text-white text-2xl font-bold mb-6">
              Recommend: <span className="text-mint-light text-teal-300">Fantasy</span>
            </h2>
            <BookGrid books={fantasyBooks} />
          </section>

          <section className="mb-8">
            <h2 className="text-white text-2xl font-bold mb-6">
              Recommend: <span className="text-mint-light text-teal-300">Romance</span>
            </h2>
            <BookGrid books={romanceBooks} />
          </section>
        </main>
      </div>
    </div>
  )
}
