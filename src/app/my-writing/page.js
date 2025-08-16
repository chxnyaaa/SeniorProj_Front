"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import Select from "@/components/ui/Select"
import CustomAlertModal from "@/components/ui/CustomAlertModal"
import { useAuth } from "@/contexts/AuthContext"
import { getBookMy } from "@/lib/api/book"
import { useRouter } from "next/navigation"

export default function MyWritingPage() {
  const { user } = useAuth()
  const [showAlert, setShowAlert] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalInfo, setModalInfo] = useState({
    type: "info",
    title: "",
    message: "",
  })
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [books, setBooks] = useState([]) // ต้องมีตัวแปรเก็บหนังสือด้วย
  const [loadingUser, setLoadingUser] = useState(true)
  const router = useRouter()

  // เช็คว่า user มีข้อมูลหรือไม่ ถ้าไม่มีให้ไปที่หน้า login
  useEffect(() => {
    if (user !== undefined) {
      setLoadingUser(false)
    }
  }, [user])

  useEffect(() => {
    if (!loadingUser && !user) {
      router.push("/login")
    }
  }, [user, loadingUser, router])

  useEffect(() => {
    async function fetchBooks() {
      if (user?.id) {
        try {
          const res = await getBookMy(user.id)
          setBooks(res.detail || [])
        } catch (err) {
          console.error("Error fetching books:", err)
          setModalInfo({
            type: "error",
            title: "Error",
            message: "Unable to load your books.",
          })
          setShowModal(true)
        }
      }
    }

    if (!loadingUser && user) {
      fetchBooks()
    }
  }, [user, loadingUser])

  const handleModalConfirm = () => {
    setShowModal(false)
  }

  // กรณีรอโหลด user หรือรีไดเร็ก กำหนดให้แสดง Loading หรือข้อความอะไรได้ตามต้องการ
  if (loadingUser) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  }

  // กรณี user ไม่มี (โดนรีไดเร็กไป login แล้ว) อาจ return null หรือข้อความอื่น
  if (!user) {
    return null
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

        <main className="flex-1 p-6 overflow-y-auto text-white">
          {/* แสดงรายการหนังสือของ user ที่นี่ */}

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">My Writing</h1>
            <a
              href="/add-books"
              className="bg-mint-light text-white px-4 py-2 rounded hover:bg-mint-dark transition-colors"
            >
              Create New Book
            </a>
          </div>


          <table className="min-w-full mt-6">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">sum episodes</th>
                <th className="px-4 py-2 text-left">sum favorites</th>
                <th className="px-4 py-2 text-left">sum coins</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
             {Array.isArray(books) && books.length > 0 ? (
                books.map((book) => (
                  <tr key={book.id}>
                    <td className="px-4 py-2">{book.title}</td>
                    <td className="px-4 py-2">{book.episodes_count ?? 0}</td>
                    <td className="px-4 py-2">{book.favorites_count ?? 0}</td>
                    <td className="px-4 py-2">{book.purchases_count ?? 0}</td>
                    <td className="px-4 py-2">
                      <Button className="ml-2" onClick={() => router.push(`/book/${book.id}`)}>
                        Episode
                      </Button>
                      <Button className="ml-2" onClick={() => router.push(`/add-books/${book.id}`)}>
                        Edit
                      </Button>
                      {/* <Button className="ml-2" onClick={() => {}}>Delete</Button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-center">
                    No books found.
                  </td>
                </tr>
              )}


            </tbody>
          </table>

          {/* ถ้าต้องการเพิ่ม UI อื่น ๆ ก็ใส่ตรงนี้ */}
        </main>
      </div>
    </div>
  )
}
