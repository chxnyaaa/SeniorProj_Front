"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TextLink from "@/components/ui/TextLink"
import { useRouter } from "next/navigation"
import { register } from "@/lib/api/auth"
import { useAuth } from "@/contexts/AuthContext"
import CustomAlertModal from "@/components/ui/CustomAlertModal"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [modalInfo, setModalInfo] = useState({
    type: "info",
    title: "",
    message: "",
  })

  const { setUser } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setModalInfo({
        type: "error",
        title: "Password Mismatch",
        message: "Please make sure both password fields match.",
      })
      setShowModal(true)
      return
    }

    const signupData = {
      email,
      username,
      password,
      role: "Reader",
      pen_name: "",
    }

    try {
      setLoading(true)
      setError(null)

      const data = await register(signupData)
      console.log("Signup successful:", data)

      if (data.statusCode === 200 || data.statusCode === 201) {
        setModalInfo({
          type: "success",
          title: "Signup Successful",
          message: "Your account has been created successfully!",
        })
        setShowModal(true)
        return
      } else {
        setModalInfo({
          type: "error",
          title: "Signup Failed",
          message: data.message || "An error occurred during signup.",
        })
        setShowModal(true)
      }
    } catch (err) {
      setModalInfo({
        type: "error",
        title: "Something Went Wrong",
        message: err.message || "Unable to complete signup.",
      })
      setShowModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleModalConfirm = () => {
    setShowModal(false)
    if (modalInfo.type === "success") {
      router.replace("/login")
    }
  }

  return (
    <div className="min-h-screen flex login-page">
      {/* Modal Alert */}
      <CustomAlertModal
        show={showModal}
        type={modalInfo.type}
        title={modalInfo.title}
        message={modalInfo.message}
        confirmText="OK"
        oneButton={true}
        onConfirm={handleModalConfirm}
      />

      {/* Right Side - Welcome Message */}
      <div className="flex-1 bg-custom-bg flex items-center justify-center p-8 border-r border-white">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-mint-light mb-6">Welcome!</h2>
          <p className="text-gray-light text-lg leading-relaxed mb-8">
            We're excited to have you here. If you haven't already, create an account to access exclusive offers.
          </p>
          <div className="text-gray-light">
            <span>Already have an account? </span>
            <TextLink href="/login" className="text-mint-light hover:text-mint-dark transition-colors font-medium">
              Login
            </TextLink>
          </div>
        </div>
      </div>

      {/* Left Side - Signup Form */}
      <div className="flex-1 bg-custom-bg flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-mint-light mb-8">Sign Up</h1>
          </div>

          {error && (
            <div className="text-red-500 text-center mb-4">
              <p>{error}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 bg-beige border-none rounded-lg text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-mint-light"
              required
            />

            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 px-4 bg-beige border-none rounded-lg text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-mint-light"
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 bg-beige border-none rounded-lg text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-mint-light"
              required
            />

            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 px-4 bg-beige border-none rounded-lg text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-mint-light"
              required
            />
            <Button className="w-full h-12 mt-4" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
