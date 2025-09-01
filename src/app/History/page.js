"use client"

import React, { useState, useEffect } from "react"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import CustomAlertModal from "@/components/ui/CustomAlertModal"
import { useAuth } from "@/contexts/AuthContext"
import { getHistory } from "@/lib/api/book"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

export default function HistoryPage() {
  const { user } = useAuth()
  const router = useRouter()

  // ✅ state
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [history, setHistory] = useState([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalInfo, setModalInfo] = useState({
    type: "info",
    title: "",
    message: "",
  })

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
    async function fetchHistory() {
      if (user?.id) {
        try {
          setLoadingHistory(true)
          const res = await getHistory(user.id)
          console.log("History data:", res)
          if(res?.status_code == 200) {
            setHistory(res.detail || [])
          }
        } catch (err) {
          console.error("Error fetching history:", err)
          setModalInfo({
            type: "error",
            title: "Error",
            message: "Unable to load your history.",
          })
          setShowModal(true)
        } finally {
          setLoadingHistory(false)
        }
      }
    }

    fetchHistory()
  }, [user])

  // ✅ filter ตาม search
  // const filteredHistory = history.filter((item) =>
  //   item.title?.toLowerCase().includes(search.toLowerCase())
  // )
  

  // ✅ format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown"
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <>
      {!loadingUser && user && (
        <div className="min-h-screen bg-custom-bg flex">
          {/* Modal */}
          <CustomAlertModal
            show={showModal}
            type={modalInfo.type}
            title={modalInfo.title}
            message={modalInfo.message}
            confirmText="OK"
            oneButton={true}
            onConfirm={() => setShowModal(false)}
          />

          <Sidebar />

          <div className="flex-1 flex flex-col">
            <Header />

            <main className="flex-1 p-6 overflow-y-auto text-white">
              <h1 className="text-2xl font-bold mb-4">History</h1>
              <p className="mb-4">Your book view statistics</p>

              {/* ✅ Loading */}
              {loadingHistory && (
                <p className="text-gray-400">Loading history...</p>
              )}

              {/* ✅ แสดงผลลัพธ์ history */}
              {/* ✅ แสดงผลลัพธ์ history */}
                {!loadingHistory && history.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-700 text-left">
                      <thead className="bg-gray-900 text-gray-300">
                        <tr>
                          <th className="px-4 py-2 border-b border-gray-700">#</th>
                          <th className="px-4 py-2 border-b border-gray-700">Book Title</th>
                          <th className="px-4 py-2 border-b border-gray-700">Episode Title</th>
                          <th className="px-4 py-2 border-b border-gray-700">Device</th>
                          <th className="px-4 py-2 border-b border-gray-700">IP Address</th>
                          <th className="px-4 py-2 border-b border-gray-700">Viewed At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((item, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-gray-800 transition-colors"
                          >
                            <td className="px-4 py-2 border-b border-gray-700">{idx + 1}</td>
                            <td className="px-4 py-2 border-b border-gray-700">
                              {item.book_title || "-"}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-700">
                              {item.episode_title || "-"}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-700">
                              {item.device || "-"}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-700">
                              {item.ip_address || "-"}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-700">
                              {formatDate(item.viewed_at)}{" "}
                              <span className="text-gray-500">
                                {new Date(item.viewed_at).toLocaleTimeString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  !loadingHistory && (
                    <p className="text-gray-400">No history found.</p>
                  )
                )}

            </main>
          </div>
        </div>
      )}
    </>
  )
}
