"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Image from "next/image"
import { GoldDivider } from "@/components/gold-divider"
import { Monogram } from "@/components/monogram"
import { FallingPetals } from "@/components/falling-petals"
import {
  SCENES,
  type InviteDetails,
  type SceneId,
} from "@/lib/invite"
import { useSceneAutoplay } from "@/lib/use-scene-autoplay"

export function InviteScenes({
  details,
  scene,
  onSceneChange,
  playing,
  letters = "dh",
}: {
  details: InviteDetails
  scene: SceneId
  onSceneChange: (id: SceneId) => void
  playing: boolean
  letters?: "dh" | "hd"
}) {
  const [autoplay, setAutoplay] = useState(true)
  useSceneAutoplay({ playing, autoplay, onSceneChange })

  return (
    <div className="relative h-full w-full overflow-hidden" data-scene={scene}>
      {SCENES.map((item) => (
        <div
          key={item.id}
          className={`scene-layer ${item.id === scene ? "is-on" : "is-off"} ${
            item.id === "names" ? "scene-names" : ""
          } ${item.id === "ceremony" ? "scene-ceremony" : ""}`}
          aria-hidden
        >
          <Image
            src={item.background}
            alt=""
            fill
            sizes="420px"
            priority
            className="scene-art object-cover"
          />
        </div>
      ))}

      <div className="center-veil pointer-events-none absolute inset-0 z-[5]" />

      {scene === "ceremony" && (
        <div className="couple-cutout pointer-events-none">
          <Reveal delayMs={6400} variant="figure">
            <Image
              src="/scenes/couple.png"
              alt={`${details.personOneName} and ${details.personTwoName}`}
              width={828}
              height={720}
              unoptimized
              className="mx-auto h-full w-auto max-w-[82%] object-contain object-bottom"
            />
          </Reveal>
        </div>
      )}

      <div className={`emblem pointer-events-none ${scene === "opening" ? "is-hero" : ""}`}>
        <Monogram letters={letters} />
      </div>

      <div className="copy-band pointer-events-none">
        {scene === "blessing" && <BlessingCopy />}
        {scene === "names" && <NamesCopy details={details} />}
        {scene === "ceremony" && <CeremonyCopy details={details} />}
        {scene === "closing" && <ClosingCopy details={details} />}
      </div>

      <FallingPetals />

      <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1">
        {SCENES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show ${item.id} scene`}
            onClick={() => {
              setAutoplay(false)
              onSceneChange(item.id)
            }}
            className="flex h-8 w-8 items-center justify-center"
          >
            <span
              className={`block h-1.5 rounded-full transition-all ${
                item.id === scene ? "w-5 bg-[#6e1824]" : "w-1.5 bg-[#6e1824]/40"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function Reveal({
  delayMs,
  className = "",
  variant = "default",
  children,
}: {
  delayMs: number
  className?: string
  variant?: "default" | "slow" | "figure"
  children: ReactNode
}) {
  const kind =
    variant === "slow"
      ? "reveal-slow"
      : variant === "figure"
        ? "reveal-figure"
        : "reveal"

  return (
    <div
      className={`${kind} ${className}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}

function BlessingCopy() {
  return (
    <div className="flex flex-col items-center">
      <Reveal delayMs={700}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/scenes/ganesha.png"
          alt="Lord Ganesha"
          width={200}
          height={265}
          className="ganesha-mark"
        />
      </Reveal>
      <Reveal delayMs={1400}>
        <p className="invite-copy mt-[0.45em] max-w-[22em]">
          वक्रतुण्ड महाकाय सूर्यकोटि समप्रभः
        </p>
      </Reveal>
      <Reveal delayMs={2200}>
        <p className="invite-copy mt-[0.28em] max-w-[22em]">
          निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा
        </p>
      </Reveal>
    </div>
  )
}

function ThinRule({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block h-[0.09em] w-[8em] bg-linear-to-r from-transparent via-[#b08948] to-transparent ${className}`}
      aria-hidden
    />
  )
}

function NamesCopy({ details }: { details: InviteDetails }) {
  return (
    <div className="names-panel flex w-full flex-col items-center">
      <Reveal delayMs={700}>
        <p className="invite-kicker names-kicker">WE TAKE IMMENSE PLEASURE IN</p>
      </Reveal>
      <Reveal delayMs={1400}>
        <p className="invite-kicker names-kicker mt-[0.25em]">
          INVITING YOU TO THE ENGAGEMENT OF
        </p>
      </Reveal>
      <div className="names-side names-side-first">
        <Reveal delayMs={2500} className="w-full">
          <h2 className="invite-name">{details.personOneName}</h2>
        </Reveal>
        <Reveal delayMs={3400} className="w-full">
          <p className="invite-parents">{details.personOneParents}</p>
        </Reveal>
        <Reveal delayMs={4000} className="w-full">
          <p className="invite-grandparents">{details.personOneGrandparents}</p>
        </Reveal>
      </div>
      <Reveal delayMs={5000}>
        <p className="invite-kicker names-with">WITH</p>
      </Reveal>
      <div className="names-side">
        <Reveal delayMs={5900} className="w-full">
          <h2 className="invite-name">{details.personTwoName}</h2>
        </Reveal>
        <Reveal delayMs={6600} className="w-full">
          <p className="invite-parents">{details.personTwoParents}</p>
        </Reveal>
        <Reveal delayMs={7200} className="w-full">
          <p className="invite-grandparents">{details.personTwoGrandparents}</p>
        </Reveal>
      </div>
    </div>
  )
}

function CeremonyCopy({ details }: { details: InviteDetails }) {
  const comma = details.venue.indexOf(",")
  const venueName =
    comma === -1 ? details.venue : details.venue.slice(0, comma).trim()
  const venueAddress =
    comma === -1 ? "" : details.venue.slice(comma + 1).trim()

  return (
    <div className="flex w-full flex-col items-center">
      <Reveal delayMs={500} variant="slow">
        <h2 className="invite-title">{details.eventTitle}</h2>
      </Reveal>
      <Reveal delayMs={2000} variant="slow">
        <div className="mt-[0.45em] flex flex-col items-center">
          <ThinRule className="mb-[0.4em]" />
          <div className="flex items-end justify-center gap-[0.35em] text-[#2a1a10]">
            <span className="invite-kicker mb-[0.15em]">{details.month.toUpperCase()}</span>
            <span className="invite-day">{details.dayNumber}</span>
            <span className="invite-kicker mb-[0.15em]">{details.year}</span>
          </div>
          <p className="invite-kicker mt-[0.15em]">{details.weekday.toUpperCase()}</p>
        </div>
      </Reveal>
      <Reveal delayMs={3400} variant="slow">
        <div className="mt-[0.3em] flex flex-col items-center">
          <p className="invite-kicker">{details.time.toUpperCase()}</p>
          <ThinRule className="mt-[0.4em]" />
        </div>
      </Reveal>
      <Reveal delayMs={4800} variant="slow">
        <div className="venue-card mt-[0.45em] w-full max-w-[22em] px-[0.7em] py-[0.35em]">
          <p className="venue-name">{venueName.toUpperCase()}</p>
          {venueAddress ? (
            <p className="invite-meta mt-[0.12em]">{venueAddress.toUpperCase()}</p>
          ) : null}
          <p className="invite-kicker mt-[0.2em]">{details.city.toUpperCase()}</p>
        </div>
      </Reveal>
    </div>
  )
}

function ClosingCopy({ details }: { details: InviteDetails }) {
  return (
    <div className="flex w-full flex-col items-center">
      <Reveal delayMs={700}>
        <p className="invite-kicker names-kicker">WE WOULD LOVE YOUR PRESENCE</p>
      </Reveal>
      <Reveal delayMs={1400}>
        <p className="invite-kicker names-kicker mt-[0.2em]">AS THEY START THEIR</p>
      </Reveal>
      <Reveal delayMs={2500}>
        <p className="invite-name mt-[0.55em]">journey of forever..</p>
      </Reveal>
      <Reveal delayMs={3600}>
        <GoldDivider className="mt-[0.4em]" />
      </Reveal>
      <Reveal delayMs={4500}>
        <p className="invite-kicker mt-[0.35em]">{details.familySignoff.toUpperCase()}</p>
      </Reveal>
    </div>
  )
}
