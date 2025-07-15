// lib/api/episode.js

import { getBasicAuthHeader } from "@/lib/authHeader" // ✅ หากคุณย้ายออกไปแยกไฟล์

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// 🔎 Get all episodes in a book
export async function getEpisodeProduct(bookId) {
  const res = await fetch(`${BASE_URL}/episode/${bookId}`, {
    method: "GET",
    headers: {
      Authorization: getBasicAuthHeader(),
    },
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to fetch episodes")
  }

  const json = await res.json()
  return json.data || []
}

// 🔎 Get one episode by ID
export async function getEpisodeID(bookId, episodeId) {
  const res = await fetch(`${BASE_URL}/episode/${bookId}/${episodeId}`, {
    method: "GET",
    headers: {
      Authorization: getBasicAuthHeader(),
    },
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to fetch episode")
  }

  const json = await res.json()
  return json.data || []
}

// ➕ Create new episode
export async function CreateEpisode(bookId, data) {
  const formData = new FormData()
  formData.append("title", data.title)
  formData.append("content_text", data.content_text)
  formData.append("release_date", data.release_date)
  formData.append("price", data.price || 0)
  formData.append("status", data.status || "draft")
  formData.append("book_id", bookId)

  if (data.cover) formData.append("cover", data.cover)
  if (data.file) formData.append("file", data.file)
  if (data.audio) formData.append("audio", data.audio)

  const res = await fetch(`${BASE_URL}/episode/`, {
    method: "POST",
    headers: {
      Authorization: getBasicAuthHeader(),
    },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to create episode")
  }

  const json = await res.json()
  return json.data
}

// ✏️ Update existing episode
export async function UpdateEpisode(bookId, episodeId, data) {
  const formData = new FormData()
  formData.append("title", data.title)
  formData.append("content_text", data.content_text)
  formData.append("release_date", data.release_date)
  formData.append("price", data.price || 0)
  formData.append("status", data.status || "draft")
  formData.append("book_id", bookId)

  if (data.cover) formData.append("cover", data.cover)
  if (data.file) formData.append("file", data.file)
  if (data.audio) formData.append("audio", data.audio)

  const res = await fetch(`${BASE_URL}/episode/${episodeId}`, {
    method: "PUT",
    headers: {
      Authorization: getBasicAuthHeader(),
    },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to update episode")
  }

  const json = await res.json()
  return json.data
}
