"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import NoSSRSelect from "@/components/ui/NoSSRSelect"
import { useRouter } from "next/navigation"
import { createBook, updateBook, getBookId } from "@/lib/api/book"
import { useAuth } from "@/contexts/AuthContext"
import { genreOptions, statusOptions } from "@/constants/selectOptions"

export default function AddBooks({ isEdit = false, editId = null }) {
  const { user } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categories, setCategories] = useState([])
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [releaseDate, setReleaseDate] = useState("")
  const [status, setStatus] = useState("draft")
  const authorId = user?.user?.id || null

  useEffect(() => {
    const fetchBookData = async () => {
      if (!isEdit || !editId || !user) return
      try {
        const dataArr = await getBookId(editId)
        const data = dataArr.product || {}

        if (data) {
          const url = process.env.NEXT_PUBLIC_API_URL || ""

          setTitle(data.title || "")
          setDescription(data.description || "")
          setReleaseDate(data.release_date ? data.release_date.slice(0, 10) : "")
          setStatus(data.status || "draft")

          if (data.category) {
            const categoryArr = data.category
              .split(",")
              .map((c) => ({ value: c.trim(), label: c.trim() }))
            setCategories(categoryArr)
          } else {
            setCategories([])
          }

          if (data.cover_url) setCoverPreview(`${url}${data.cover_url}`)
          else setCoverPreview(null)
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
      if (
        coverPreview &&
        typeof coverPreview === "string" &&
        coverPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(coverPreview)
      }
    }
  }, [coverPreview])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (coverPreview && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview)
      }
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    } else {
      alert("Please upload .jpg or .png files only")
    }
  }

  const handleRemoveFile = () => {
    if (coverPreview && coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview)
    }
    setCoverFile(null)
    setCoverPreview(null)
  }

  const handleSubmit = async () => {
    if (!authorId) {
      alert("You are not logged in")
      return
    }

    const payload = {
      title,
      description,
      releaseDate,
      status,
      categories,
      coverFile,
      authorId,
    }

    try {
      const result = isEdit
        ? await updateBook(editId, payload)
        : await createBook(payload)
      const bookId = result?.id
      if (bookId) {
        router.push(`/book/${bookId}`)
      } else {
        throw new Error("Book ID not found after saving")
      }
    } catch (err) {
      console.error(err)
      alert("Unable to save the book")
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
              <div className="text-teal-400 text-center select-none h-100">
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
                  className="w-100 h-90 object-cover rounded-lg shadow-md mb-3"
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
              options={statusOptions}
              value={statusOptions.find((opt) => opt.value === status)}
              onChange={(selected) => setStatus(selected.value)}
              className="text-black"
              classNamePrefix="select"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600"
          onClick={handleSubmit}
        >
          {isEdit ? "Save Changes" : "Save Book"}
        </Button>
      </div>
    </div>
  )
}
