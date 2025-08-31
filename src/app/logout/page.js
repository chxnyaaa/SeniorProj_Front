"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TextLink from "@/components/ui/TextLink"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { login } from "@/lib/api/auth"
import CustomAlertModal from "@/components/ui/CustomAlertModal"

export default function LogOutPage() {
  const { logout } = useAuth()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Button onClick={handleLogout}>Log Out</Button>
      <CustomAlertModal
        show={showModal}
        title="Logged Out"
        message="You have been logged out successfully."
        confirmText="OK"
        onConfirm={() => setShowModal(false)}
      />
    </div>
  )
}