const API = "http://localhost:5000"

// Crear usuario
export const createUser = async (data) => {
  const res = await fetch(`${API}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return res.json()
}

// Obtener personas
export const getUsers = async (eventId, userId) => {
  const res = await fetch(`${API}/users/${eventId}/${userId}`)
  return res.json()
}

// Dar like
export const sendLike = async (fromUserId, toUserId) => {
  const res = await fetch(`${API}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fromUserId, toUserId }),
  })

  return res.json()
}

export const uploadPhoto = async (file) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "x8zm2vfe")

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dxnxdapb3/image/upload",
    {
      method: "POST",
      body: formData,
    }
  )

  const data = await res.json()
  return data.secure_url
}