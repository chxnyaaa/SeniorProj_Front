import React from "react"

export function Input({ className = "", ...props }) {
  return (
    <input
      autoComplete="off"
      className={`px-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-600 focus:ring-2 focus:ring-mint-light ${className}`}
      {...props}
    />
  )
}
