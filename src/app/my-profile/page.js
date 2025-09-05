"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import CustomAlertModal from "@/components/ui/CustomAlertModal"
import { useAuth } from "@/contexts/AuthContext"
import { getProfile, updateProfile, getBookMy } from "@/lib/api/book"
import { useRouter } from "next/navigation"
import Select from "@/components/ui/Select"
const url = process.env.NEXT_PUBLIC_API_URL
export default function MyProfilePage() {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [modalInfo, setModalInfo] = useState({
    type: "info",
    title: "",
    message: "",
  })
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [books, setBooks] = useState([])
  const [loadingUser, setLoadingUser] = useState(true)
  const router = useRouter()

  // ข้อมูลฟอร์มโปรไฟล์
  const [profile, setProfile] = useState({
    username: "",
    pen_name: "",
    role: "",
    avatar: null, // ไฟล์ avatar (File object)
    avatarPreview: "", // URL แสดงภาพ preview
  })

  // เช็ค user loaded
  useEffect(() => {
    if (user !== undefined) setLoadingUser(false)
  }, [user])

  // รีไดเร็กถ้าไม่ login
  useEffect(() => {
    if (!loadingUser && !user) router.push("/login")
  }, [user, loadingUser, router])

  // โหลด profile และหนังสือเมื่อ user พร้อม
  useEffect(() => {
    async function fetchData() {
      if (user?.id) {
        try {
          // โหลด profile
          const profileRes = await getProfile(user.id)
          const detail = profileRes.detail || {}
          const avatarPreview = detail.avatar ? url +'/uploads/avatar/'+ detail.avatar : ""
          setProfile((prev) => ({
            ...prev,
            username: detail.username || "",
            pen_name: detail.pen_name || "",
            role: detail.role || "",
            avatarPreview: avatarPreview,
          }))

          // โหลดหนังสือ
          const booksRes = await getBookMy(user.id)
          setBooks(booksRes.detail.books || [])
        } catch (err) {
          console.error("Error fetching data:", err)
          setModalInfo({
            type: "error",
            title: "Error",
            message: "Unable to load your profile or books.",
          })
          setShowModal(true)
        }
      }
    }
    if (!loadingUser && user) fetchData()
  }, [user, loadingUser])

  // handle input change (text)
  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  // handle avatar file change + preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfile((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file),
      }))
    }
  }

  // update profile submit
  const handleSubmit = async () => {
  if (!user?.id) return
  try {

    // Only JPG, PNG, MP3, and PDF files are allowed
    if (profile.avatar){
      const allowedTypes = ["image/jpeg", "image/png"]
      if (!allowedTypes.includes(profile.avatar.type)) {
        setModalInfo({
          type: "error",
          title: "Invalid File Type",
          message: "Only JPG and PNG files are allowed for avatar.",
        })
        setShowModal(true)
        return
      }
    }

    const formData = new FormData()

    
    formData.append("userId", user.id)

    if (profile.username) formData.append("username", profile.username)
    if (profile.pen_name) formData.append("pen_name", profile.pen_name)
    if (profile.role) formData.append("role", profile.role)
    if (profile.avatar) formData.append("avatar", profile.avatar)

    // เรียก API
    const res = await updateProfile(formData)
    if (res.status_code === 200) {
      setModalInfo({
        type: "success",
        title: "Profile Updated",
        message: "Your profile has been updated successfully.",
      })
      window.location.reload();
    } else {
      setModalInfo({
        type: "error",
        title: "Update Failed",
        message: res.detail || "Could not update profile. Try again later.",
      })
    }
    setShowModal(true)
  } catch (err) {
    console.error("Update profile failed:", err)
    setModalInfo({
      type: "error",
      title: "Failed",
      message: "Could not update profile. Try again later.",
    })
    setShowModal(true)
  }
}


  const handleModalConfirm = () => setShowModal(false)

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-custom-bg flex">
      <CustomAlertModal
        show={showModal}
        type={modalInfo.type}
        title={modalInfo.title}
        message={modalInfo.message}
        confirmText="OK"
        oneButton
        onConfirm={handleModalConfirm}
      />

      <Sidebar currentlyPlaying={currentlyPlaying} setCurrentlyPlaying={setCurrentlyPlaying} />

      <div className="flex-1 flex flex-col">
        <Header onSearch={setSearchTerm} />

        <main className="flex-1 flex items-center justify-center p-6 overflow-y-auto text-white">
            <div className="bg-gray-900 bg-opacity-90 rounded-lg shadow-lg p-8 w-full max-w-md">
              <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1>
            
             <div className="mb-6 text-center">
              <label htmlFor="avatarInput" className="cursor-pointer inline-block">
                <img
                  src={
                    profile.avatarPreview
                      ? profile.avatarPreview
                      : "https://bootstrapdemos.adminmart.com/modernize/dist/assets/images/profile/user-1.jpg"
                  }
                  alt="Avatar Preview"
                  className="mb-2 w-24 h-24 rounded-full object-cover mx-auto"
                />
              </label>

              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>




              <div className="mb-6">
                <label className="block mb-1">Username</label>
                <Input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  className="text-black w-full"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1">Pen Name</label>
                <Input
                  type="text"
                  name="pen_name"
                  value={profile.pen_name}
                  onChange={handleChange}
                  className="text-black w-full"
                />
              </div>

              <div className="mb-6" style={{ display: "none" }}>
                <label className="block mb-1">Role</label>
                <Select
                  name="role"
                  value={profile.role}
                  onChange={handleChange}
                  options={[
                    { value: "1", label: "Author" },
                    { value: "2", label: "Reader" },
                    { value: "3", label: "Admin" },
                  ]}
                />
              </div>

            

              <Button onClick={handleSubmit} className="w-full">
                Save Profile
              </Button>
            </div>
          </main>

      </div>
    </div>
  )
}
