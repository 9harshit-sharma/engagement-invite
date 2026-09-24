"use client"

import { useEffect, useRef } from "react"
import { SCENES, type SceneId } from "@/lib/invite"

export function useSceneAutoplay({
  playing,
  autoplay,
  onSceneChange,
  onFinish,
}: {
  playing: boolean
  autoplay: boolean
  onSceneChange: (id: SceneId) => void
  onFinish?: () => void
}) {
  const onSceneChangeRef = useRef(onSceneChange)
  const onFinishRef = useRef(onFinish)

  useEffect(() => {
    onSceneChangeRef.current = onSceneChange
  }, [onSceneChange])

  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  useEffect(() => {
    if (!playing || !autoplay) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null

    const run = async () => {
      for (const item of SCENES) {
        if (cancelled) return
        onSceneChangeRef.current(item.id)
        await new Promise<void>((resolve) => {
          timer = setTimeout(resolve, item.durationMs)
        })
      }

      if (!cancelled) {
        onFinishRef.current?.()
      }
    }

    void run()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [autoplay, playing])
}