"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import CustomAlertModal from "@/components/ui/CustomAlertModal"
import { updatePenName } from "@/lib/api/auth"

export default function AddBRolePage() {
  const { user, setUser } = useAuth()
  const router = useRouter()

  const [penName, setPenName] = useState("")
  const [loading, setLoading] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [modalInfo, setModalInfo] = useState({
    type: "info",
    title: "",
    message: "",
  })

  const handleModalConfirm = () => {
    setShowModal(false)
    if (modalInfo.type === "success") {
      router.push("/")
    }
  }

  const handleSubmit = async () => {
    if (!penName.trim()) {
      setModalInfo({
        type: "error",
        title: "Pen Name Required",
        message: "Please enter your pen name before submitting.",
      })
      setShowModal(true)
      return
    }

    if (!user || !user.user || !user.user.id) {
      setModalInfo({
        type: "error",
        title: "User Not Found",
        message: "User info not available. Please log in again.",
      })
      setShowModal(true)
      return
    }

    setLoading(true)
    try {
      const data = await updatePenName(penName, user.user.id)
      if (data.statusCode === 200 || data.statusCode === 201) {
         const updatedUser = {
            ...user,
            user: {
              ...user.user,
              role: "author", // หรือ "2", แล้วแต่ระบบคุณใช้ string หรือ number
            },
          }
          setUser(updatedUser)
        // console.log("Updated User:", set_role)
        setModalInfo({
          type: "success",
          title: "Role Updated",
          message: "Your pen name has been updated successfully.",
        })
        setShowModal(true)
      } else {
        setModalInfo({
          type: "error",
          title: "Update Failed",
          message: data.message || "An error occurred while updating your pen name.",
        })
        setShowModal(true)
      }
    } catch (error) {
      setModalInfo({
        type: "error",
        title: "Submission Failed",
        message: "Failed to submit role. Please try again.",
      })
      setShowModal(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-custom-bg flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-8">
        <Header />

        <CustomAlertModal
          show={showModal}
          type={modalInfo.type}
          title={modalInfo.title}
          message={modalInfo.message}
          confirmText="OK"
          oneButton={true}
          onConfirm={handleModalConfirm}
        />

        <h1 className="text-3xl font-bold text-white mb-4 mt-8">Register as Author</h1>
        <p className="text-gray-400 mb-6">Please select your role to continue.</p>

        {user && user.user && user.user.role && (
          <p className="text-green-400 mb-4">
            You are already registered as{" "}
            {user.user.role === "1" ? "Reader" : "Author"}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm mb-1 text-teal-300">Pen Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={penName}
            onChange={(e) => setPenName(e.target.value)}
            placeholder="Enter your pen name"
            disabled={loading}
          />
        </div>

        <div>
          <Button
            className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Role"}
          </Button>
        </div>
      </div>
    </div>
  )
}
