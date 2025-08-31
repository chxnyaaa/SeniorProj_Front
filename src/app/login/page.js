"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TextLink from "@/components/ui/TextLink"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { login } from "@/lib/api/auth"
import CustomAlertModal from "@/components/ui/CustomAlertModal"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [modalInfo, setModalInfo] = useState({
    type: "info",
    title: "",
    message: "",
  })

  const { setUser } = useAuth()
  const router = useRouter()

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const result = await login({ email, password });
      console.log("Login result:", result);

      if (result.status_code === 200 || result.status_code === 201) {
        setModalInfo({
          type: "success",
          title: "Login Successful",
          message: result.status_message || "You have successfully logged in.",
        });
        setShowModal(true);

        // ✅ เก็บข้อมูล user และ token อย่างถูกต้อง
        if (result.detail?.payload) {
          const userData = result.detail.payload;
          const token = result.detail.token;

          setUser(userData);
          sessionStorage.setItem("user", JSON.stringify(userData));
          sessionStorage.setItem("token", token);

          setEmail("");
          setPassword("");
        }
      } else {
        setModalInfo({
          type: "error",
          title: "Login Failed",
          message: result.detail || "An error occurred during login.",
        });
        setShowModal(true);
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  const handleModalConfirm = () => {
    setShowModal(false)
    if (modalInfo.type === "success") {
      router.replace("/") // หรือเปลี่ยนเป็น path หลักของระบบ เช่น "/dashboard"
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

      {/* Left Side - Login Form */}
      <div className="flex-1 bg-custom-bg flex items-center justify-center p-8 border-r border-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-mint-light mb-8">Log In</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 bg-beige border-none rounded-lg text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-mint-light"
              required
              autoComplete="off"
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 bg-beige border-none rounded-lg text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-mint-light"
              required
              autoComplete="off"
            />

            {error && (
              <div className="text-red-500 text-center font-semibold">{error}</div>
            )}

            <Button className="w-full h-12 mt-4" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side - Welcome Message */}
      <div className="flex-1 bg-custom-bg flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-mint-light mb-6">Welcome back!</h2>
          <p className="text-gray-light text-lg leading-relaxed mb-8">
            We're happy to see you again. Log in to access your dashboard and continue where you left off.
          </p>
          <div className="text-gray-light">
            <span>No account yet? </span>
            <TextLink
              href="/signup"
              className="text-mint-light hover:text-mint-dark transition-colors font-medium"
            >
              Sign up
            </TextLink>
          </div>
        </div>
      </div>
    </div>
  )
}
