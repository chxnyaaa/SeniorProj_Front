"use client"

"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TextLink from "@/components/ui/TextLink"
import { useRouter } from "next/navigation"
import { register } from "@/lib/api/auth" // ✅ สมมุติคุณมีฟังก์ชันนี้
import { useAuth } from "@/contexts/AuthContext" // ✅ สมมุติคุณใช้ context

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [penName, setPenName] = useState("")
  const [loading, setLoading] = useState(false) // ✅ ต้องอยู่ข้างใน
  const [error, setError] = useState(null)
  
    const { setUser } = useAuth()
    const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    const signupData = {
      email,
      username,
      password,
      role: "Writer",
      pen_name: penName,
    }
    
      try {
          setLoading(true)
          setError(null)

          const data = await register(signupData)
          console.log("Signup success:", data)

          if (data.statusCode === 200 || data.statusCode === 201) {
            router.replace("/login")
          } else {
            setError(data.message || "Signup failed")
          }
        } catch (err) {
          setError(err.message || "Signup failed")
        } finally {
          setLoading(false)
        }
  }

  return (
    <div className="min-h-screen flex login-page">
      {/* Right Side - Welcome Message */}
      <div className="flex-1 bg-custom-bg flex items-center justify-center p-8 border-r border-white">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-mint-light mb-6">Come join us!</h2>
          <p className="text-gray-light text-lg leading-relaxed mb-8">
            We are so excited to have you here. If you haven't already, create an account to get access to exclusive offers.
          </p>
          <div className="text-gray-light">
            <span>Already have an account? </span>
            <TextLink href="/login" className="text-mint-light hover:text-mint-dark transition-colors font-medium">
              Login
            </TextLink>
          </div>
        </div>
      </div>

      {/* Left Side - Sign Up Form */}
      <div className="flex-1 bg-custom-bg flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-mint-light mb-8">Sign Up</h1>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center space-x-4 mb-6">
            <button className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center transition-transform hover:scale-105 group">
              <img
                src="https://images.icon-icons.com/2429/PNG/512/google_logo_icon_147282.png"
                alt="Google Logo"
                className="scale-100"
              />
            </button>
            <button className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center hover:scale-105 transition-transform">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                alt="Facebook Logo"
              />
            </button>
          </div>

          {/* Divider */}
          <div className="text-center text-gray-400 mb-6">
            <span>or</span>
          </div>

          {/* Sign Up Form */}
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
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 px-4 bg-beige border-none rounded-lg text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-mint-light"
              required
            />
            <Input
              type="text"
              placeholder="Pen Name"
              value={penName}
              onChange={(e) => setPenName(e.target.value)}
              className="w-full h-12 px-4 bg-beige border-none rounded-lg text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-mint-light"
              required
            />


            <div className="text-center">
              <TextLink href="/signup" className="text-mint-dark hover:text-mint-light transition-colors text-sm">
                Sign up as Reader?
              </TextLink>
            </div>

            <Button className="w-full h-12">Sign Up</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
