// lib/api/episode.js

import axios from "axios"
import { getBasicAuthHeader } from "@/lib/authHeader" // ✅ หากคุณย้ายออกไปแยกไฟล์

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"


// 📖 Get all episodes for a specific book
export async function getEpisodeProduct(bookId) {
  try {
    const res = await axios.get(`${BASE_URL}/episode/${bookId}`, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
    })

    return res.data.data || []
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch episodes"
    throw new Error(message)
  }
}

// 🔍 Get a specific episode by bookId and episodeId
export async function getEpisodeID(bookId, episodeId) {
  try {
    const res = await axios.get(`${BASE_URL}/api/episodes/${bookId}/${episodeId}`, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
    })

    return res.data || []
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch episode"
    throw new Error(message)
  }
}


// ➕ Create new episode
export async function CreateEpisode(bookId, data) {
  const formData = new FormData()
  formData.append("book_id", bookId)
  formData.append("user_id", data.user_id)
  formData.append("title", data.title)
  formData.append("content", data.content)
  formData.append("is_free", data.is_free || false)
  formData.append("price", data.price || 0)
  formData.append("release_date", data.release_date)
  formData.append("status", data.status || "draft")
  formData.append("priority", data.priority || "")

  if (data.cover) formData.append("cover", data.cover)

  try {
    const res = await axios.post(`${BASE_URL}/api/episodes/`, formData, {
      headers: {
        Authorization: getBasicAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    })
    return res.data
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create episode"
    throw new Error(message)
  }
}

// ✏️ Update existing episode
export async function UpdateEpisode(bookId, episodeId, data) {
  const formData = new FormData()
  formData.append("book_id", bookId)
  formData.append("user_id", data.user_id)
  formData.append("title", data.title)
  formData.append("content", data.content)
  formData.append("is_free", data.is_free || false)
  formData.append("price", data.price || 0)
  formData.append("release_date", data.release_date)
  formData.append("status", data.status || "draft")
  formData.append("priority", data.priority || "")

  if (data.cover) formData.append("cover", data.cover)

  try {
    const res = await axios.put(`${BASE_URL}/api/episodes/${episodeId}`, formData, {
      headers: {
        Authorization: getBasicAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    })
    return res.data
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update episode"
    throw new Error(message)
  }
}
