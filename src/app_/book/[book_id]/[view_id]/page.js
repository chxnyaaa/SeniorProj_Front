"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useAuth } from "@/contexts/AuthContext"
import { getEpisodeId,addUserUpdateHistory } from "@/lib/api/book"
import { useRouter } from "next/navigation"

const url = process.env.NEXT_PUBLIC_API_URL

export default function ReaderPage() {
  const { user } = useAuth()
  const params = useParams()
  const bookId = params.book_id
  const episodeId = params.view_id
  const [episode, setEpisode] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const router = useRouter()
  const audioRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // ฟังก์ชันสำหรับ play/pause
  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  // อัพเดตเวลาปัจจุบัน
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }

    const setAudioDuration = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", setAudioDuration)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", setAudioDuration)
    }
  }, [episode])

  // เพลงจบแล้ว reset
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  // เลื่อนเวลาผ่าน Slider
const handleSeek = (value) => {
  if (audioRef.current) {
    audioRef.current.currentTime = value
    setCurrentTime(value)
  }
}

  useEffect(() => {
    if (user !== undefined) {
      setLoadingUser(false)
    }
  }, [user])

  useEffect(() => {
    if (!loadingUser && !user) {
      router.push("/login")
    }

    async function fetchEpisode() {
      try {
        const res = await getEpisodeId(bookId, episodeId)
        if (res.status_code === 200) {
          setEpisode(res.detail)
        }
      } catch (error) {
        console.error("Error fetching episode:", error)
      }
    }

    fetchEpisode()
  }, [user, loadingUser, router])

    useEffect(() => {
    const updateHistory = async () => {
      try {
        await addUserUpdateHistory(user.id, bookId, episodeId)
      } catch (err) {
        console.error("ไม่สามารถอัปเดต history ได้:", err)
      }
    }

    if (user?.id && bookId && episodeId) {
      updateHistory()
    }
  }, [user?.id, bookId, episodeId])

  if (loadingUser) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  }

  if (!user) {
    return null
  }

  // ฟังก์ชันแปลงเวลาวินาทีเป็น mm:ss
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00"
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`
  }

  return (
    <>
      {!loadingUser && episode && (
        <>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 flex flex-col items-center">
            {/* รูปปก */}
            {episode.cover ? (
              <img
                src={`${url}/uploads/cover/${episode.cover}`}
                alt={episode.title}
                className="w-64 h-64 rounded-lg object-cover mb-6 shadow-md"
              />
            ) : (
              <div className="w-64 h-64 bg-gray-300 rounded-lg flex items-center justify-center mb-6 text-gray-500">
                No Cover Image
              </div>
            )}

            {/* ชื่อเรื่อง */}
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">{episode.title}</h1>

            {/* รายละเอียด */}
            <p className="text-gray-600 text-center mb-6 whitespace-pre-wrap">
              {episode.content || "No description available."}
            </p>

            {/* <audio ref={audioRef} src={`${url}/uploads/audio/${episode.audio_id}`} preload="metadata" className="hidden" /> */}
            <audio ref={audioRef} src={`${episode.audio_url}`} preload="metadata" className="hidden" />

            {/* แสดงเวลาปัจจุบัน และ Slider */}
            <div className="w-full mb-4">
             <Slider
                min={0}
                max={duration}
                value={[currentTime]}             // ส่งเป็น array เดียว
                onValueChange={(val) => handleSeek(val[0])}  // รับ array แล้วดึง val[0]
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1 px-1 select-none">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* ปุ่มเล่น/หยุด */}
            <Button
              onClick={handlePlayPause}
              className="w-20 h-20 rounded-full bg-mint-light hover:bg-mint-dark text-gray-800 flex items-center justify-center"
            >
              {isPlaying ? <Pause className="w-16 h-16" /> : <Play className="w-16 h-16 ml-1" />}
            </Button>

            {/* ปุ่มย้อนกลับ */}
            <Button
              onClick={() => router.back()}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Back
            </Button>
          </div>
        </div>
        </>
      )}
    </>
  )
}
