// lib/authHeader.js

export function getBasicAuthHeader() {
  const user = process.env.NEXT_PUBLIC_AUTH_USER || ""
  const pass = process.env.NEXT_PUBLIC_AUTH_PASS || ""
  const token = typeof window !== "undefined"
    ? btoa(`${user}:${pass}`)
    : Buffer.from(`${user}:${pass}`).toString("base64")
  return `Basic ${token}`
}
