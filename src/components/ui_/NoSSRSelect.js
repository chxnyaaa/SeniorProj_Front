"use client"

import { useEffect, useState } from "react"
import Select from "react-select"

export default function NoSSRSelect(props) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null // ป้องกัน SSR render ก่อน client

  return <Select {...props} />
}
