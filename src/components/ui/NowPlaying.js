"use client"

import React, { useRef, useState, useEffect } from "react"
import { Play, Pause } from "lucide-react"
import { getAudio } from "@/lib/api/book"
import { useAuth } from "@/contexts/AuthContext"


export default function NowPlaying() {
  const audioRef = useRef(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audioSrc, setAudioSrc] = useState("/audio/sample.mp3")
  const [imagesSrc, setImagesSrc] = useState("https://m.media-amazon.com/images/I/511P7eN21YL._AC_UY399_FMwebp_.jpg")

  const { user, logout, isLoading } = useAuth()

  // แปลงเวลาเป็น mm:ss มี 0 นำหน้าเสมอ
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    async function fetchAudio() {
      try {

        if(!user) return
        const res = await getAudio(user.id)
        if(res.status_code === 200) {
          // setAudioSrc(res.detail[0].audio_url)
          setAudioSrc(res.detail[0]?.audio_url || "/audio/sample.mp3")
          if(res.detail[0]?.cover){
            let seturl = `${process.env.NEXT_PUBLIC_API_URL || url}/uploads/cover/${res.detail[0].cover}`
            setImagesSrc(seturl)
          }
        } else {
          console.error("Failed to fetch audio, status code:", res.status_code)
        }
      } catch (err) {
        console.error("Error fetching audio:", err)
      }
    }
    fetchAudio()
  }, [user])
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoadedMetadata = () => {
      setDuration(audio.duration)
      console.log("Loaded metadata, duration:", audio.duration)
    }

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      // console.log("Current time:", audio.currentTime)
    }

    const onEnded = () => {
      setCurrentlyPlaying(false)
      setCurrentTime(0)
      console.log("Audio ended")
    }

    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("ended", onEnded)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (currentlyPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setCurrentlyPlaying(!currentlyPlaying)
  }

  return (
    <div className="p-4 border-t border-gray-700 text-center">
      <div className="rounded-lg overflow-hidden w-36 h-48 mx-auto mb-4 shadow-lg">
        <img
          src={imagesSrc}
          alt="Book Cover"
          className="object-cover w-full h-full"
        />
      </div>

      <p className="text-white text-sm mb-2">
        {formatTime(currentTime)} / {formatTime(duration)}
      </p>

      <button
        type="button"
        onClick={togglePlay}
        className="mx-auto mb-2 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-200 transition"
        aria-label={currentlyPlaying ? "Pause" : "Play"}
      >
        {currentlyPlaying ? (
          <Pause className="w-6 h-6 text-gray-800" />
        ) : (
          <Play className="w-6 h-6 text-gray-800" />
        )}
      </button>

      <audio ref={audioRef} src={audioSrc} />
    </div>
  )
}
