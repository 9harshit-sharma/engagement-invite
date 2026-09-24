"use client"

import Image from "next/image"
import { Monogram } from "@/components/monogram"
import { initialsOf, type InviteDetails } from "@/lib/invite"

export function Envelope({
  details,
  onOpen,
  letters = "dh",
}: {
  details: InviteDetails
  onOpen: () => void
  letters?: "dh" | "hd"
}) {
  const initials = initialsOf(details)

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
      <Image
        src="/scenes/opening.png"
        alt=""
        fill
        priority
        sizes="420px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#3a2a1c]/35" />
      <div className="absolute inset-0 bg-linear-to-b from-[#f6efe2]/20 via-transparent to-[#2a1c12]/55" />

      <div className="relative z-10 mx-[1.2em] flex max-w-[22em] flex-col items-center text-center">
        <Monogram size="seal" letters={letters} className="mb-[0.45em]" />
        <p className="envelope-kicker">YOU ARE INVITED</p>
        <h1 className="mt-[0.55em] flex w-full flex-col items-center font-[family-name:var(--font-great-vibes)] leading-[0.95] text-[#fff7ea] drop-shadow-sm">
          <span className="envelope-name w-full text-center">{details.personOneName}</span>
          <span className="envelope-amp my-[0.1em] text-[#e8c98a]">&</span>
          <span className="envelope-name w-full text-center">{details.personTwoName}</span>
        </h1>
        <p className="envelope-sub mt-[0.4em]">to celebrate our engagement</p>

        <button
          type="button"
          onClick={onOpen}
          className="group mt-[1.1em] flex flex-col items-center gap-[0.45em] outline-none"
        >
          <span className="seal relative grid size-[4.6em] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#b23a45,#6e1824_62%,#4a1018)] shadow-[0_10px_24px_rgba(80,16,20,0.45),inset_0_1px_0_rgba(255,220,180,0.25)] ring-2 ring-[#e8c98a]/80 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
            <span className="font-[family-name:var(--font-cinzel)] text-[1.05em] tracking-[0.18em] text-[#f8e7c0]">
              {initials}
            </span>
          </span>
          <span className="envelope-tap">TAP THE SEAL TO OPEN</span>
        </button>
      </div>
    </div>
  )
}
