"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // โหลด user จาก localStorage ตอนแอปเริ่ม
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [])

  // เวลาตั้ง user ใหม่ ให้เก็บใน localStorage ด้วย
  const saveUser = (newUser) => {
    setUser(newUser)
    if (typeof window !== "undefined") {
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser))
      } else {
        localStorage.removeItem("user")
      }
    }
  }

  // logout แค่เรียก saveUser(null) ก็จะล้าง localStorage ด้วย
  const logout = () => {
    saveUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser: saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
