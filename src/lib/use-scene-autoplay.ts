"use client"

import { useEffect, useRef } from "react"
import { SCENES, type SceneId } from "@/lib/invite"

export function useSceneAutoplay({
  playing,
  autoplay,
  onSceneChange,
}: {
  playing: boolean
  autoplay: boolean
  onSceneChange: (id: SceneId) => void
}) {
  const onSceneChangeRef = useRef(onSceneChange)

  useEffect(() => {
    onSceneChangeRef.current = onSceneChange
  }, [onSceneChange])

  useEffect(() => {
    if (!playing || !autoplay) return

    let cancelled = false
    let timer = 0

    const run = async () => {
      for (const item of SCENES) {
        if (cancelled) return
        onSceneChangeRef.current(item.id)
        await new Promise<void>((resolve) => {
          timer = window.setTimeout(resolve, item.durationMs)
        })
      }
    }

    void run()

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [autoplay, playing])
}
