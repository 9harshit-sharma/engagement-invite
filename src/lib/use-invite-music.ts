"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export const INVITE_MUSIC_SRC = "/audio/garden-evening.mp3"
export const MUSIC_MUTE_KEY = "palace-invite-music-muted"
const TARGET_VOLUME = 0.46
const FADE_IN_MS = 1600
const FADE_OUT_MS = 420

function fadeVolume(audio: HTMLAudioElement, to: number, ms: number) {
  const from = audio.volume
  const started = performance.now()
  const tick = (now: number) => {
    const t = Math.min(1, (now - started) / ms)
    audio.volume = from + (to - from) * t
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

export function useInviteMusic() {
  const ref = useRef<HTMLAudioElement>(null)
  const startedRef = useRef(false)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    try {
      setMuted(window.localStorage.getItem(MUSIC_MUTE_KEY) === "1")
    } catch {
      // private mode
    }
  }, [])

  const persistMuted = useCallback((next: boolean) => {
    setMuted(next)
    try {
      window.localStorage.setItem(MUSIC_MUTE_KEY, next ? "1" : "0")
    } catch {
      // private mode
    }
  }, [])

  const begin = useCallback(() => {
    const audio = ref.current
    if (!audio || muted) return
    startedRef.current = true
    audio.volume = 0
    const play = audio.play()
    if (play) {
      play
        .then(() => {
          setPlaying(true)
          fadeVolume(audio, TARGET_VOLUME, FADE_IN_MS)
        })
        .catch(() => {
          setPlaying(false)
        })
    }
  }, [muted])

  const toggle = useCallback(() => {
    const audio = ref.current
    if (!audio) return
    if (!muted) {
      persistMuted(true)
      fadeVolume(audio, 0, FADE_OUT_MS)
      window.setTimeout(() => {
        audio.pause()
        setPlaying(false)
      }, FADE_OUT_MS)
      return
    }
    persistMuted(false)
    startedRef.current = true
    audio.volume = 0
    const play = audio.play()
    if (play) {
      play
        .then(() => {
          setPlaying(true)
          fadeVolume(audio, TARGET_VOLUME, FADE_IN_MS)
        })
        .catch(() => setPlaying(false))
    }
  }, [muted, persistMuted])

  const restart = useCallback(() => {
    const audio = ref.current
    if (!audio || muted) return
    startedRef.current = true
    audio.currentTime = 0
    audio.volume = TARGET_VOLUME
    const play = audio.play()
    if (play) {
      play.then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }, [muted])

  useEffect(() => {
    const audio = ref.current
    if (!audio) return

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)

    const onVis = () => {
      if (muted || !startedRef.current) return
      if (document.hidden) {
        audio.pause()
      } else {
        audio.play().catch(() => setPlaying(false))
      }
    }
    document.addEventListener("visibilitychange", onVis)

    return () => {
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [muted])

  return { ref, muted, playing, begin, toggle, restart }
}
