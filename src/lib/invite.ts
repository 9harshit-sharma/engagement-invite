export type InviteDetails = {
  personOneName: string
  personOneParents: string
  personOneGrandparents: string
  personTwoName: string
  personTwoParents: string
  personTwoGrandparents: string
  eventTitle: string
  month: string
  dayNumber: string
  year: string
  weekday: string
  time: string
  venue: string
  city: string
  familySignoff: string
}

export const DEFAULT_INVITE: InviteDetails = {
  personOneName: "Deepshikha",
  personOneParents: "Daughter of Mrs. Rekha & Mr. Yogesh Chandra Sharma",
  personOneGrandparents: "Granddaughter of Mrs. Pushpa & Late Mr. Bhoo Deo Sharma",
  personTwoName: "Harshit",
  personTwoParents: "Son of Mrs. Anju & Mr. Pankaj Sharma",
  personTwoGrandparents: "Grandson of Mrs. Rashmi & Mr. Mahaveer Prasad Sharma",
  eventTitle: "Sagayi, Godh Bharayi & Ring Ceremony",
  month: "October",
  dayNumber: "25",
  year: "2026",
  weekday: "Sunday",
  time: "12:00 PM onwards",
  venue: "The Stellar Gymkhana, R-1, Knowledge Park II",
  city: "Greater Noida",
  familySignoff: "Sharma Family",
}

export const GROOM_FIRST_INVITE: InviteDetails = {
  ...DEFAULT_INVITE,
  personOneName: DEFAULT_INVITE.personTwoName,
  personOneParents: DEFAULT_INVITE.personTwoParents,
  personOneGrandparents: DEFAULT_INVITE.personTwoGrandparents,
  personTwoName: DEFAULT_INVITE.personOneName,
  personTwoParents: DEFAULT_INVITE.personOneParents,
  personTwoGrandparents: DEFAULT_INVITE.personOneGrandparents,
}

export const STORAGE_KEY = "palace-invite-details"
export const GROOM_STORAGE_KEY = "palace-invite-details-v2"
export const HOST_EDIT_QUERY = "host"

export function initialsOf(details: InviteDetails) {
  const a = details.personOneName.trim().charAt(0).toUpperCase() || "D"
  const b = details.personTwoName.trim().charAt(0).toUpperCase() || "H"
  return `${a}${b}`
}

function staleFamilyLine(value: string | undefined) {
  if (!value) return true
  return /D\/O|S\/O/.test(value) || /\bYogesh Sharma\b/.test(value)
}

export function parseInvite(
  raw: string | null,
  base: InviteDetails = DEFAULT_INVITE,
): InviteDetails {
  if (!raw) return base
  try {
    const stored = JSON.parse(raw) as Partial<InviteDetails> & { date?: string }
    const { date: storedDate, ...rest } = stored
    const parsed = { ...base, ...rest }
    if (storedDate && (!rest.dayNumber || rest.dayNumber === "12")) {
      parsed.dayNumber = storedDate
    }
    if (parsed.personOneName.trim() === "Aarya") {
      parsed.personOneName = base.personOneName
    }
    if (
      staleFamilyLine(rest.personOneParents) ||
      staleFamilyLine(rest.personTwoParents) ||
      !rest.personOneGrandparents ||
      !rest.personTwoGrandparents
    ) {
      parsed.personOneParents = base.personOneParents
      parsed.personOneGrandparents = base.personOneGrandparents
      parsed.personTwoParents = base.personTwoParents
      parsed.personTwoGrandparents = base.personTwoGrandparents
    }
    return parsed
  } catch {
    return base
  }
}

export const SCENES = [
  { id: "opening", durationMs: 4000, background: "/scenes/opening.png" },
  { id: "blessing", durationMs: 6000, background: "/scenes/blessing.png" },
  { id: "names", durationMs: 16000, background: "/scenes/names.png" },
  { id: "ceremony", durationMs: 16000, background: "/scenes/ceremony.jpg" },
  { id: "closing", durationMs: 7000, background: "/scenes/closing.png" },
] as const

export type SceneId = (typeof SCENES)[number]["id"]
