import React from "react"
import Link from "next/link"

export default function TextLink({ href, children, className = "" }) {
  return (
    <Link
      href={href}
      className={`text-[#4ecdc4] hover:text-[#61a79e] transition-colors ${className}`}
    >
      {children}
    </Link>
  )
}
