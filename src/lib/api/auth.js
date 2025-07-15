// lib/auth.js

import { getBasicAuthHeader } from "@/lib/authHeader"


export async function login({ email, password }) {
  const url = process.env.NEXT_PUBLIC_API_URL + "/login/"

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": getBasicAuthHeader(),
      },
      body: JSON.stringify({ Account: email, password }), // ใช้ key "Account"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    return await response.json()
  } catch (err) {
    throw err
  }
}

export async function register(signupData) {
  const url = process.env.NEXT_PUBLIC_API_URL + "/signup/"

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getBasicAuthHeader(),
    },
    body: JSON.stringify(signupData),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Register failed")
  }

  const json = await res.json()
  return {
    statusCode: res.status,
    ...json,
  }
}

export async function updatePenName(penName, authorId) {
  const url = process.env.NEXT_PUBLIC_API_URL + "/profile/pen-name/"

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getBasicAuthHeader(),
    },
    body: JSON.stringify({ pen_name: penName, userId: authorId }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Update pen name failed")
  }

  return await res.json()
}


   


