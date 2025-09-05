// src/components/ui/Select.js

"use client"

import React from "react"

export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  className = "",
  placeholder = "Please select...",
}) {
  return (
    <div className="space-y-2">
      {/* {label && <label htmlFor={name} className="text-sm text-gray-700">{label}</label>} */}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full h-12 px-4 bg-white border-none rounded-lg text-gray-800 focus:ring-2 focus:ring-mint-light ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
