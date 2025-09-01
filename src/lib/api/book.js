// lib/api/book.js
import axios from "axios"
import { getBasicAuthHeader } from "@/lib/authHeader"


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function getBooks({ category, page = 1, limit = 10, search = "" } = {}) {
  try {
    const res = await axios.get(`${BASE_URL}/api/books`, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
      params: {
        ...(category && { category: Array.isArray(category) ? category.join(",") : category }),
        page,
        limit,
        ...(search && { search }),
      },
    })
    const books = res.data.detail?.data || []
    const pagination = res.data.detail?.pagination || {}

    return {
      data: books,
      pagination,
    }
  } catch (error) {
    console.error("Fetch books error:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch books")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}


export async function checkin(userId) {
  try {
    const res = await axios.post(`${BASE_URL}/api/coins/checkin`, { userId }, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
    })
    return res.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to check in")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}

export async function getCoins(userId) {
  try {
    const res = await axios.get(`${BASE_URL}/api/coins/${userId}`, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
    })
    return res.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch coins")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}

export async function updateCoins(payload) {
  console.log("Updating coins for user:", payload)
  const res = await axios.post(`${BASE_URL}/api/coins/`, payload, {
    headers: {
      Authorization: getBasicAuthHeader(),
    },
  })
  return res.data
}

export async function getBookMy(userId) {
  try {
    const res = await axios.post(`${BASE_URL}/api/books/book-My`, { userId }, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
    })
    return res.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch my books")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}


export async function getProfile(userId) {
  try {
    const res = await axios.get(`${BASE_URL}/api/profile/${userId}`, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
    })
    return res.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch profile")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}


export async function updateProfile(formData) {
  try {
    const res = await axios.post(`${BASE_URL}/api/profile`, formData, {
      headers: {
        Authorization: getBasicAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    })
    return res.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update profile")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}





// ✏️ Update existing book
export async function updateBook(data) {
  const formData = new FormData();

  if (data.bookId) {
    formData.append("bookId", data.bookId);
  }

  formData.append("title", data.title || "");
  formData.append("userId", data.userId || "");
  formData.append("description", data.description || "");
  formData.append("category", data.categories || "");
  formData.append("release_date", data.releaseDate || "");
  formData.append("status", data.status || "draft");
  
  if (data.booksFile) {
    formData.append("books", data.booksFile);
  }

  try {
    const res = await axios.post(`${BASE_URL}/api/books/`, formData, {
      headers: {
        Authorization: getBasicAuthHeader(), // หรือใส่ header ตรงนี้เป็น string
      },
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to save book");
    } else {
      throw new Error(error.message || "Network Error");
    }
  }
}


// 📗 Get book by ID
export async function getBookId(id) {
  try {
    const res = await axios.get(`${BASE_URL}/api/books/${id}`, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
    })

    return res.data

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch book")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
};

export async function getIsFollowing(userId, bookId) {
  try {
    const res = await axios.get(`${BASE_URL}/api/books/following/${userId}/${bookId}`, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
    })

    return res.data

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch following status")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}
 

export async function updateFollow(userId, bookId) {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/user/favorites`,
      {
        userId: userId,
        bookId: bookId,
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

export async function updateRating(userId, bookId, rating, comment = "") {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/books/rate`,
      {
        bookId: bookId,
        userId: userId,
        rating: rating,
        comment: comment,
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
      throw new Error(error.response.data.message || "Failed to update rating")
    } else {
      // ปัญหาเช่น network error
      throw new Error(error.message || "Network Error")
    }
  }
}



export async function getBookmark({ category, page = 1, limit = 10, search = "", userId = null } = {}) {
  try {
    const res = await axios.get(`${BASE_URL}/api/user`, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
      params: {
        ...(category && { category: Array.isArray(category) ? category.join(",") : category }),
        page,
        limit,
        ...(search && { search }),
        ...(userId && { userId }), // เพิ่ม userId ถ้ามี
      },
    })
    const books = res.data.detail?.data || []
    const pagination = res.data.detail?.pagination || {}

    return {
      data: books,
      pagination,
    }
  } catch (error) {
    console.error("Fetch books error:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch books")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}





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




// ✅ Update book "complete" status
export async function updateIsComplete(id, isComplete) {
  try {
    console.log("Updating book status:", { bookId: id, isComplete })
    const res = await axios.post(`${BASE_URL}/api/books/is_complete`, {
      bookId: id,
      isComplete: isComplete,
    }, {
      headers: {
        Authorization: getBasicAuthHeader(),
        "Content-Type": "application/json",
      },
    })

    console.log("Update book status response:", res.data)

    return res.data

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update book status")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}

export async function getEpisodeId(bookId, episodeId) {
  try {
    
    const res = await axios.get(`${BASE_URL}/api/episodes/${bookId}/${episodeId}`, {
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


export async function getHistoryPurchase(userId,bookId) {
  try {
    const res = await axios.post(`${BASE_URL}/api/user/episode-history`, {
      userId: userId,
      bookId: bookId,
    }, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
    })
    return res.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch purchase history")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}

export async function BayPurchase(userId, bookId, episodeId, amount) {
  try {
    const res = await axios.post(`${BASE_URL}/api/purchases`, {
      userId: userId,
      bookId: bookId,
      episodeId: episodeId,
      amount: amount,
    }, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
    })
    return res.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to purchase episode")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}


export async function getHistory(userId) {
  try {
    const res = await axios.post(`${BASE_URL}/api/user/history`, {
      userId: userId,
    }, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
    })
    return res.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch history")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
} 

export async function addUserUpdateHistory(userId, bookId, episodeId) {
  try {
    const res = await axios.post(`${BASE_URL}/api/user/update-history`, {
      userId: userId,
      bookId: bookId,
      episodeId: episodeId,
      device: "", // Add device information if available
      ipAddress: ""
    }, {
      headers: {
        Authorization: getBasicAuthHeader(),
      },
    })
    return res.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to add user update history")
    } else {
      throw new Error(error.message || "Network Error")
    }
  }
}