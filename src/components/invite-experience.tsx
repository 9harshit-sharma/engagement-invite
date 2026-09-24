"use client"

import { useEffect, useState } from "react"
import { RotateCcw } from "lucide-react"
import { EditInvite } from "@/components/edit-invite"
import { Envelope } from "@/components/envelope"
import { InviteScenes } from "@/components/invite-scenes"
import { MusicToggle } from "@/components/music-toggle"
import { Button } from "@/components/ui/button"
import { INVITE_MUSIC_SRC, useInviteMusic } from "@/lib/use-invite-music"
import { useInviteDetails } from "@/lib/use-invite-details"
import {
  DEFAULT_INVITE,
  GROOM_FIRST_INVITE,
  GROOM_STORAGE_KEY,
  HOST_EDIT_QUERY,
  STORAGE_KEY,
  type InviteDetails,
  type SceneId,
} from "@/lib/invite"

const PRELOAD = [
  "/scenes/opening.png",
  "/scenes/blessing.png",
  "/scenes/names.png",
  "/scenes/ceremony.jpg",
  "/scenes/closing.png",
  "/scenes/ganesha.png",
  "/scenes/couple.png",
  "/scenes/logo-dh.png",
  "/scenes/logo-dh-seal.png",
  "/scenes/logo-hd.png",
  "/scenes/logo-hd-seal.png",
  "/scenes/logo-hd-groom.png",
  "/scenes/logo-hd-groom-seal.png",
]

export function InviteExperience({
  variant = "bride",
}: {
  variant?: "bride" | "groom"
}) {
  const base: InviteDetails =
    variant === "groom" ? GROOM_FIRST_INVITE : DEFAULT_INVITE
  const storageKey = variant === "groom" ? GROOM_STORAGE_KEY : STORAGE_KEY
  const [hostEdit, setHostEdit] = useState(false)
  const { details, setDetails } = useInviteDetails(hostEdit, base, storageKey)
  const [opened, setOpened] = useState(false)
  const [scene, setScene] = useState<SceneId>("opening")
  const [playKey, setPlayKey] = useState(0)
  const music = useInviteMusic()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setHostEdit(params.get("edit") === HOST_EDIT_QUERY)
  }, [])
  const letters = variant === "groom" ? "hd" : "dh"

  const replay = () => {
    setOpened(true)
    setScene("opening")
    setPlayKey((key) => key + 1)
    music.restart()
  }

  return (
    <main className="invite-shell relative flex min-h-dvh flex-col items-center justify-center px-4 py-4">
      <div className="invite-frame relative aspect-[9/16] h-auto w-[min(100%,26.5rem,calc((100svh-1.5rem)*9/16))] overflow-hidden shadow-[0_30px_80px_rgba(20,10,6,0.55)]">
        {!opened ? (
          <Envelope
            details={details}
            letters={letters}
            onOpen={() => {
              music.begin()
              setOpened(true)
            }}
          />
        ) : (
          <InviteScenes
            key={playKey}
            details={details}
            scene={scene}
            onSceneChange={setScene}
            playing
            letters={letters}
          />
        )}

        <MusicToggle
          muted={music.muted}
          playing={music.playing}
          onToggle={music.toggle}
        />
        <audio
          ref={music.ref}
          className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
          src={INVITE_MUSIC_SRC}
          loop
          preload="auto"
          playsInline
        />

        <div className="absolute top-3 right-3 z-20 flex gap-2">
          {opened && (
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full bg-[#f6efe2]/85 text-[#5c3b28] shadow-sm backdrop-blur-sm hover:bg-[#f6efe2]"
              aria-label="Replay invitation"
              onClick={replay}
            >
              <RotateCcw className="size-4" />
            </Button>
          )}
          {hostEdit && <EditInvite details={details} onChange={setDetails} />}
        </div>
      </div>

      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden" aria-hidden>
        {PRELOAD.map((src) => (
          // Decorative preload; next/image is used for visible scenes.
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" />
        ))}
      </div>
    </main>
  )
}
