"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import CustomAlertModal from "@/components/ui/CustomAlertModal"
import { useAuth } from "@/contexts/AuthContext"
import { getCoins } from "@/lib/api/book"
import { useRouter } from "next/navigation"
import Select from "@/components/ui/Select"
import { Input } from "@/components/ui/input"

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate()
}

export default function DailyCalendarPage() {
  const { user } = useAuth()
  const [coins, setCoins] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalInfo, setModalInfo] = useState({
    type: "info",
    title: "",
    message: "",
  })
  const [transactions, setTransactions] = useState([])
  const [loadingUser, setLoadingUser] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const router = useRouter()

  useEffect(() => {
    if (user !== undefined) {
      setLoadingUser(false)
    }
  }, [user])

  useEffect(() => {
    if (!loadingUser && !user) {
      router.push("/login")
    }
  }, [user, loadingUser])

  useEffect(() => {
    async function fetchCoins() {
      if (user?.id) {
        try {
          const res = await getCoins(user.id)
          setCoins(res.detail.totalCoins || 0)
          setTransactions(res.detail.transactions || [])
        } catch (err) {
          console.error("Error fetching coins:", err)
          setModalInfo({
            type: "error",
            title: "Error",
            message: "Unable to load your coins.",
          })
          setShowModal(true)
        }
      }
    }

    fetchCoins()
  }, [user])

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)
  const today = new Date()
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay()

  const isTransactionDay = (day) => {
    return transactions.some((t) => {
      const txDate = new Date(t.created_at)
      return (
        txDate.getUTCDate() === day &&
        txDate.getUTCMonth() === selectedMonth &&
        txDate.getUTCFullYear() === selectedYear &&
        t.type === "daily_checkin"
      )
    })
  }


  return (
    <>
      {!loadingUser && user && (
        <div className="min-h-screen bg-custom-bg flex">
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
              <h1 className="text-2xl font-bold mb-4">Daily Login Calendar</h1>
              <p className="mb-4">
                You have <strong>{coins}</strong> coins.
              </p>

              <div className="flex gap-4 items-center mb-6">
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  options={Array.from({ length: 12 }, (_, i) => ({
                    value: i,
                    label: new Date(0, i).toLocaleString("default", {
                      month: "long",
                    }),
                  }))}
                  className="w-48"
                />

                <Input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="text-black p-2 rounded w-24"
                />
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-white border bg-teal-600 rounded-lg p-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="font-semibold">
                      {day}
                    </div>
                  )
                )}

                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-4" />
                ))}

                {Array.from({ length: daysInMonth }, (_, day) => {
                  const isToday =
                    day + 1 === today.getDate() &&
                    selectedMonth === today.getMonth() &&
                    selectedYear === today.getFullYear()

                  return (
                    <div
                      key={day + 1}
                      className={`p-4 border rounded shadow-sm ${
                        isTransactionDay(day + 1)
                          ? "bg-red-500 text-white"
                          : isToday
                          ? "bg-green-400 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      {day + 1}
                    </div>
                  )
                })}
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  )
}
