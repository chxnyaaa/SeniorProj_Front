// lib/auth.js
import axios from "axios"
import { getBasicAuthHeader } from "@/lib/authHeader"


export async function login({ email, password }) {
  const url = process.env.NEXT_PUBLIC_API_URL + "/api/auth/login"

  try {
    const response = await axios.post(
      url,
      {
        email, // ✅ ใช้ key "Account"
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getBasicAuthHeader(),
        },
      }
    )

    return response.data
  } catch (error) {
    const message = error.response?.data?.message || "Login failed"
    throw new Error(message)
  }
}



export async function register(signupData) {
  const url = process.env.NEXT_PUBLIC_API_URL + "/api/auth/register";
  try {
    const response = await axios.post(url, signupData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getBasicAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || "Register failed";
    return { success: false, error: message };
  }
}

export async function updatePenName(penName, authorId) {
  const url = process.env.NEXT_PUBLIC_API_URL + "/profile/pen-name/"

  try {
    const response = await axios.post(
      url,
      { pen_name: penName, userId: authorId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getBasicAuthHeader(),
        },
      }
    )

    return response.data
  } catch (error) {
    const message = error.response?.data?.message || "Update pen name failed"
    throw new Error(message)
  }
}
