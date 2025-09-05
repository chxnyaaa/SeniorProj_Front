"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import NoSSRSelect from "@/components/ui/NoSSRSelect"
import { useRouter } from "next/navigation"
import { updateBook, getBookId } from "@/lib/api/book"
import { useAuth } from "@/contexts/AuthContext"
import { genreOptions } from "@/constants/selectOptions"

export default function AddBooks({ isEdit = false, editId = null }) {
  const { user } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categories, setCategories] = useState([])
  const [booksFile, setBooksFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [releaseDate, setReleaseDate] = useState("")
  const [status, setStatus] = useState("draft")
  const [authorId, setAuthorId] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [saving, setSaving] = useState(false)
  const [existingCoverUrl, setExistingCoverUrl] = useState(null)

  useEffect(() => {
    if (user !== undefined) {
      setLoadingUser(false)
      setAuthorId(user?.id || null)
    }
  }, [user])

  useEffect(() => {
    if (!loadingUser && !user) {
      router.push("/login")
    }
  }, [user, loadingUser, router])

  useEffect(() => {
    const fetchBookData = async () => {
      if (!isEdit || !editId || !user) return
      try {
        const res = await getBookId(editId)
        const data = res.detail || {}

        if (data.user_id && data.user_id !== user.id) {
          alert("You are not the owner of this book.")
          router.push("/")
          return
        }

        const url = process.env.NEXT_PUBLIC_API_URL || ""

        setTitle(data.title || "")
        setDescription(data.description || "")
        setExistingCoverUrl(data.cover_image || null)

        if (Array.isArray(data.categories)) {
          setCategories(data.categories.map(cat => ({
            value: cat.name,
            label: cat.name,
          })))
        } else {
          setCategories([])
        }

       if (data.release_date) {
            setReleaseDate(new Date(data.release_date).toISOString().split("T")[0])
          }
          if (data.status) {
            setStatus(data.status)
          }

        if (data.cover_image) {
          setCoverPreview(`${url}/uploads/books/${data.cover_image}`)
        }
      } catch (err) {
        console.error("Error loading book:", err.message)
        alert("Unable to load book data: " + err.message)
      }
    }

    fetchBookData()
  }, [isEdit, editId, user])

  useEffect(() => {
    return () => {
      if (coverPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview)
      }
    }
  }, [coverPreview])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (coverPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview)
      }
      setBooksFile(file)
      setCoverPreview(URL.createObjectURL(file))
    } else {
      alert("Please upload .jpg or .png files only")
    }
  }

  const handleRemoveFile = () => {
    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview)
    }
    setBooksFile(null)
    setCoverPreview(null)
  }

  const handleSubmit = async () => {
    if (!authorId) {
      alert("You are not logged in")
      return
    }
    if (!title.trim()) {
      alert("Please enter the book title")
      return
    }

    setSaving(true)

    const payload = {
      bookId: editId || null,
      title,
      description,
      categories: categories.map(cat => cat.value || cat).join(","),
      booksFile,
      releaseDate,
      status,
      userId: authorId
    }

    // validate value in payload
    if (!title || !description || !categories.length  || !releaseDate || !status || (!booksFile && !existingCoverUrl)) {
      alert("Please fill in all fields.")
      setSaving(false)
      return
    }

    try {
      const result = await updateBook(payload)
      console.log("Save book result:", result)
      if (result && (result.status_code === 201 || result.status_code === 200)) {
        const bookId = result?.detail?.bookId || editId
        if (bookId) {
          // router.push(`/add-books/${bookId}`)
          router.push(`/book/${bookId}`)
        } else {
          throw new Error("Book ID not found after saving")
        }
      }
    } catch (err) {
      console.error(err)
      alert("Unable to save the book")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-teal-300 mb-6">
        {isEdit ? "Edit Book" : "Add New Book"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* COVER UPLOAD */}
        <div className="md:col-span-4">
          <label className="block text-sm mb-1 text-teal-300">Upload Cover</label>
          <div
            className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-teal-600 transition-colors"
            onClick={() => document.getElementById("coverInput").click()}
          >
            <input
              id="coverInput"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            {!coverPreview ? (
              <div className="text-teal-400 text-center select-none">
                <p className="mt-20 mb-1 text-lg font-semibold">
                  Click or drop file to upload
                </p>
                <p className="text-sm">Supported: .jpg, .jpeg, .png</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <img
                  src={coverPreview}
                  alt="Cover Preview"
                  className="w-full h-auto object-cover rounded-lg shadow-md mb-3"
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile()
                  }}
                >
                  Remove Cover Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="md:col-span-8 space-y-4">
          <div>
            <label className="block text-sm mb-1 text-teal-300">Book Title</label>
            <input
              className="w-full border p-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-teal-300">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-teal-300">Category</label>
            <NoSSRSelect
              options={genreOptions}
              value={categories}
              onChange={setCategories}
              isMulti
              className="basic-multi-select text-black"
              classNamePrefix="select"
              placeholder="Select categories"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-teal-300">Release Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-teal-300">Status</label>
            <NoSSRSelect
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
                { value: "archived", label: "Archived" }
              ]}
              value={{
                value: status,
                label: status.charAt(0).toUpperCase() + status.slice(1)
              }}
              onChange={(selected) => setStatus(selected.value)}
              className="text-black"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          disabled={saving}
          className={`bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleSubmit}
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Save Book"}
        </Button>
      </div>
    </div>
  )
}
