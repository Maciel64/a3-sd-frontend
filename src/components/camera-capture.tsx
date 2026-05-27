"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, ImageIcon } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (file: File) => void
  onCancel: () => void
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setError(null)
    } catch {
      setError("Permissão de câmera negada ou câmera indisponível")
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  function handleCapture() {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
      onCapture(file)
    }, "image/jpeg", 0.9)
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-900">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-4">
            <Camera className="mb-2 h-10 w-10 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCapture}
          disabled={!!error}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50"
        >
          <Camera className="h-5 w-5" />
          Capturar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-700 px-4 py-3 font-medium text-slate-300 transition-all hover:bg-slate-600 active:scale-[0.98]"
        >
          <ImageIcon className="h-5 w-5" />
          Upload
        </button>
      </div>
    </div>
  )
}
