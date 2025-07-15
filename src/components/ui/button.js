import React from "react"

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-6 py-3 rounded-xl bg-[#4ecdc4] text-black text-xl font-semibold shadow-md transition-all cursor-pointer duration-300 ease-in-out
                  hover:bg-[#3ab6b0] hover:shadow-xl hover:scale-105
                  active:scale-100 active:shadow-md
                  ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

