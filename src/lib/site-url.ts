import { headers } from "next/headers"

function fromEnv() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (production) {
    return production.startsWith("http")
      ? production.replace(/\/$/, "")
      : `https://${production}`
  }
  const deployment = process.env.VERCEL_URL
  if (deployment) return `https://${deployment}`
  return "http://127.0.0.1:43217"
}

export async function siteUrl() {
  try {
    const h = await headers()
    const host = h.get("x-forwarded-host") ?? h.get("host")
    if (host) {
      const local = host.includes("localhost") || host.startsWith("127.")
      const proto = h.get("x-forwarded-proto") ?? (local ? "http" : "https")
      return `${proto}://${host}`
    }
  } catch {
    // headers() is unavailable during some prerender passes
  }
  return fromEnv()
}

export const SHARE_CARD = {
  bride: {
    path: "/og/deepshikha-harshit-12pm.jpg",
    alt: "Deepshikha & Harshit — Sagayi, Godh Bharayi & Ring Ceremony, 25 October 2026, 12 PM onwards, The Stellar Gymkhana, Greater Noida",
  },
  groom: {
    path: "/og/harshit-deepshikha-idot.jpg",
    alt: "Harshit & Deepshikha — Sagayi, Godh Bharayi & Ring Ceremony, 25 October 2026, 12 PM onwards, The Stellar Gymkhana, Greater Noida",
  },
} as const
