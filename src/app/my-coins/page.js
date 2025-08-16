"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import Select from "@/components/ui/Select"
import CustomAlertModal from "@/components/ui/CustomAlertModal"
import { useAuth } from "@/contexts/AuthContext"
import { getCoins, updateCoins } from "@/lib/api/book"
import { useRouter } from "next/navigation"

export default function MyCoinsPage() {
  const { user } = useAuth()
  const [coins, setCoins] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalInfo, setModalInfo] = useState({
    type: "info",
    title: "",
    message: "",
  })
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [amount, setAmount] = useState(0)
  const [type, setType] = useState("earn") // หรือ "spend"
  const [transactions, setTransactions] = useState([])
  
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

  const handleUpdateCoins = async () => {
    if (!user?.id || !amount) return

    try {
      const payload = {
        userId: user.id,
        amount: Number(amount),
        type, // earn หรือ spend
      }

      const res = await updateCoins(payload)
      if (res?.status_code === 200) {
        // อัปเดตเหรียญใหม่
        const updated = await getCoins(user.id)
        setCoins(updated.detail.totalCoins || 0)

        setModalInfo({
          type: "success",
          title: "Success",
          message: `Your coins have been ${type === "earn" ? "added" : "deducted"} successfully.`,
        })
        setShowModal(true)
        setAmount(0)
      }
    } catch (err) {
      console.error("Coin update failed:", err)
      setModalInfo({
        type: "error",
        title: "Failed",
        message: "Could not update your coins. Try again later.",
      })
      setShowModal(true)
    }
  }

  const handleModalConfirm = () => {
    setShowModal(false)
  }


  return (
   <>
    { !loadingUser && user ? (
      <>
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
            <h1 className="text-2xl font-bold mb-4">My Coins</h1>
            <p className="mb-4">
              You have <strong>{coins}</strong> coins.
            </p>

            <div className="mb-6">
            <label className="block mb-1">Amount</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value
                  // กรองเฉพาะตัวเลข 0-9 เท่านั้น
                  if (/^\d*$/.test(val)) {
                    setAmount(val)
                  }
                }}
                className="text-black w-1/2"
                placeholder="Enter coin amount"
              />

              <Button onClick={handleUpdateCoins} >
                Update Coins
              </Button>
            </div>
          </div>
            {showAlert && (
              <CustomAlertModal
                show={showAlert}
                type="success"
                title="Coin Added"
                message={`You now have ${coins} coins.`}
                confirmText="OK"
                oneButton={true}
                onConfirm={() => setShowAlert(false)}
              />
            )}

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Transaction History</h2>
              <table className="min-w-full bg-white text-gray-800">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Type</th>
                    <th className="px-4 py-2 border-b">Amount</th>
                    <th className="px-4 py-2 border-b">Description</th>
                    <th className="px-4 py-2 border-b">Date</th>
                  </tr>
                </thead>
                <tbody>
                  
                  {transactions.length === 0 ? (
                  <tr>
                    <td className="px-4 py-2 border-b text-center" colSpan="4">
                      No transactions found.
                    </td>
                  </tr>
                  ) : (
                    transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border-b text-center">
                          {transaction.type}
                        </td>
                        <td className="px-4 py-2 border-b text-center">
                          {transaction.amount}
                        </td>
                        <td className="px-4 py-2 border-b text-center">
                          {transaction.description || "-"}
                        </td>
                     <td className="px-4 py-2 border-b text-center">
                      {new Date(transaction.created_at).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        timeZone: "UTC"   // date from UTC (keeps day 7/8 as in API)
                      })}{" "}
                      {" "}
                      {new Date(transaction.created_at).toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                        timeZone: "Asia/Bangkok" // time shifted to Thai local time
                      })}
                    </td>



                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </main>
        </div>
      </div>
      </>
    ) : (
      <></>
    )}
   </>
  )
}
