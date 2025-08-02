// lib/api/book.js
import axios from "axios"
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

  try {
    const res = await axios.post(`${BASE_URL}/product`, formData, {
      headers: {
        Authorization: getBasicAuthHeader(),
        // ไม่ต้องระบุ Content-Type: multipart/form-data — axios จัดการให้เองเมื่อใช้ FormData
      },
    })

    return res.data

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to create book")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
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

  try {
    const res = await axios.put(`${BASE_URL}/product/${id}`, formData, {
      headers: {
        Authorization: getBasicAuthHeader(),
        // ไม่ต้องใส่ Content-Type เอง เพราะ axios จะจัดการให้
      },
    })

    return res.data.data

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update book")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}

// 📗 Get book by ID
export async function getBookId(id) {
  try {
    const res = await axios.get(`${BASE_URL}/product/${id}`, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
    })

    return res.data.data

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch book")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}

// ✅ Update book "complete" status
export async function updateIsComplete(id, isComplete) {
  try {
    const res = await axios.put(
      `${BASE_URL}/product/${id}/status`,
      { is_complete: isComplete },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getBasicAuthHeader(),
        },
      }
    )

    return res.data.data

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update book status")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}

export async function getBooks({ category, page = 1, limit = 10, search = "" } = {}) {
  try {
    const res = await axios.get(`${BASE_URL}/product/`, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
      params: {
        ...(category && { category }),
        page,
        limit,
        ...(search && { search }),
      },
    })

    return {
      data: res.data.data || [],
      pagination: res.data.pagination || {},
    }

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch books")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}

export async function updateFollow(userId, bookId) {
  try {
    const res = await axios.post(
      `${BASE_URL}/product/follow`,
      {
        user_id: userId,
        book_id: bookId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getBasicAuthHeader(),
        },
      }
    )
    return res.data 

  } catch (error) {
    // ถ้า server ตอบกลับด้วย status code != 2xx
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update follow status")
    } else {
      // ปัญหาเช่น network error
      throw new Error(error.message || "Network Error")
    }
  }
}

export async function getEpisodeId(bookId, episodeId) {
  try {
    const res = await axios.get(`${BASE_URL}/episode/${bookId}/${episodeId}`, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
    })

    return res.data

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch episode")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}
