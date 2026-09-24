"use client"

import { Volume2, VolumeX } from "lucide-react"

export function MusicToggle({
  muted,
  playing,
  onToggle,
}: {
  muted: boolean
  playing: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      className="music-toggle"
      data-playing={playing && !muted ? "true" : "false"}
      aria-pressed={!muted}
      aria-label={muted ? "Unmute invitation music" : "Mute invitation music"}
      onClick={onToggle}
    >
      {muted ? <VolumeX strokeWidth={1.75} /> : <Volume2 strokeWidth={1.75} />}
    </button>
  )
}
