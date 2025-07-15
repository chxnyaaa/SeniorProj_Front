// lib/api/book.js

import { getBasicAuthHeader } from "@/lib/authHeader"


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// 📘 Create a new book
export async function createBook(data) {
  const formData = new FormData()
  formData.append("title", data.name || data.title)
  formData.append("description", data.description)
  formData.append("release_date", data.releaseDate || data.release_date)
  formData.append("status", data.status)
  formData.append("price_per_chapter", data.pricePerChapter || 0)
  formData.append("author_id", data.authorId)

  if (data.categories?.length > 0) {
    const categoriesString = data.categories.map(cat => cat.value || cat).join(",")
    formData.append("category", categoriesString)
  }

  if (data.coverFile) {
    formData.append("cover", data.coverFile)
  }

  const res = await fetch(`${BASE_URL}/product`, {
    method: "POST",
    headers: {
      Authorization: getBasicAuthHeader(),
    },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to create book")
  }

  const json = await res.json()
  return json.data
}

// ✏️ Update existing book
export async function updateBook(id, data) {
  const formData = new FormData()
  formData.append("title", data.name || data.title)
  formData.append("description", data.description)
  formData.append("release_date", data.releaseDate || data.release_date)
  formData.append("status", data.status)
  formData.append("price_per_chapter", data.pricePerChapter || 0)
  formData.append("author_id", data.authorId)

  if (data.categories?.length > 0) {
    const categoriesString = data.categories.map(cat => cat.value || cat).join(",")
    formData.append("category", categoriesString)
  }

  if (data.coverFile) {
    formData.append("cover", data.coverFile)
  }

  const res = await fetch(`${BASE_URL}/product/${id}`, {
    method: "PUT",
    headers: {
      Authorization: getBasicAuthHeader(),
    },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to update book")
  }

  const json = await res.json()
  return json.data
}

// 📗 Get book by ID
export async function getBookId(id) {
  const res = await fetch(`${BASE_URL}/product/${id}`, {
    headers: {
      Authorization: getBasicAuthHeader(),
    },
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to fetch book")
  }

  const json = await res.json()
  return json.data
}

// ✅ Update book "complete" status
export async function updateIsComplete(id, isComplete) {
  const res = await fetch(`${BASE_URL}/product/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: getBasicAuthHeader(),
    },
    body: JSON.stringify({ is_complete: isComplete }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to update book status")
  }

  const json = await res.json()
  return json.data
}

// 📚 Get all books
// export async function getBooks() {
//   const res = await fetch(`${BASE_URL}/product`, {
//     headers: {
//       Authorization: getBasicAuthHeader(),
//     },
//   })

//   if (!res.ok) {
//     const err = await res.json()
//     throw new Error(err.message || "Failed to fetch books")
//   }

//   const json = await res.json()
//   return json.data
// }


export async function getBooks({ category, page = 1, limit = 10, search = "" } = {}) {
  const params = new URLSearchParams()
  if (category) params.append("category", category)
  if (page) params.append("page", page)
  if (limit) params.append("limit", limit)
  if (search) params.append("search", search)

  const res = await fetch(`${BASE_URL}/product/?${params.toString()}`, {
    headers: {
      Authorization: getBasicAuthHeader(),
    },
  })

  if (!res.ok) throw new Error("Failed to fetch books")

  const json = await res.json()
  return {
    data: json.data || [],
    pagination: json.pagination || {}
  }
}
