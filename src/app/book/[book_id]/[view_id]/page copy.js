"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useParams,useRouter  } from "next/navigation"
import { Play, Pause, SkipBack, SkipForward, Volume2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ReaderPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([75])
  const audioRef = useRef(null)
  const params = useParams()
  const bookId = params.book_id
  const episodeId = params.view_id

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const updateVolume = () => setVolume([audio.volume * 100])

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("volumechange", updateVolume)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("volumechange", updateVolume)
    }
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleProgressChange = (value) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value) => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = value[0] / 100
      setVolume(value)
    }
  }

  return (
    <div className="min-h-screen bg-custom-bg text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <Link href={`/book/${bookId}`} className="inline-flex items-center text-mint-light hover:text-mint-dark">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Book Details
        </Link>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">All The Devils</h1>
          <h2 className="text-xl text-gray-300">#1 The Whispering Flame</h2>
        </div>

        Content
        <div className="w-full max-w-4xl bg-gray-light rounded-lg p-8 mb-8 text-gray-800 leading-relaxed">
          <p className="mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
          <p className="mb-6">More paragraph content here...</p>
          <p>Last paragraph for sample.</p>
        </div>

        <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-300 mb-8" style={{ height: "600px" }}>
          <iframe
            src="/pdfs/sample.pdf"
            width="100%"
            height="100%"
            className="rounded-2xl"
            style={{ border: "none" }}
            title="Chapter PDF"
          />
        </div>


        {/* Audio Player */}
        <div className="w-full max-w-2xl">
          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <Button variant="ghost" size="sm" className="text-mint-light hover:text-mint-dark hover:bg-gray-700">
              <SkipBack className="w-6 h-6" />
            </Button>
            <Button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-mint-light hover:bg-mint-dark text-gray-800 flex items-center justify-center"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </Button>
            <Button variant="ghost" size="sm" className="text-mint-light hover:text-mint-dark hover:bg-gray-700">
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-gray-300 w-12">{formatTime(currentTime)}</span>
            <div className="flex-1">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleProgressChange}
              />
            </div>
            <span className="text-sm text-gray-300 w-12">{formatTime(duration)}</span>
          </div>

          {/* Volume */}
          {/* <div className="flex items-center justify-end gap-2">
            <Volume2 className="w-4 h-4 text-gray-300" />
            <div className="w-24">
              <Slider
                value={volume}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div> */}
        </div>
      </div>

      {/* Audio element */}
      <audio ref={audioRef} src="/audio/sample.mp3" className="hidden" preload="metadata" />
    </div>
  )
}
