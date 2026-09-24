import type { Metadata } from "next"
import { SHARE_CARD, siteUrl } from "@/lib/site-url"

const DESCRIPTION = {
  bride:
    "Deepshikha and Harshit invite you to their Sagayi, Godh Bharayi and Ring Ceremony on 25 October 2026, 12 PM onwards, at The Stellar Gymkhana, Greater Noida.",
  groom:
    "Harshit and Deepshikha invite you to their Sagayi, Godh Bharayi and Ring Ceremony on 25 October 2026, 12 PM onwards, at The Stellar Gymkhana, Greater Noida.",
} as const

const TITLE = {
  bride: "Deepshikha & Harshit — Sagayi Invitation",
  groom: "Harshit & Deepshikha — Sagayi Invitation",
} as const

const OG_DESCRIPTION = {
  bride:
    "You are invited to our Sagayi, Godh Bharayi & Ring Ceremony on 25 October 2026, 12 PM onwards, at The Stellar Gymkhana, Greater Noida.",
  groom:
    "You are invited to our Sagayi, Godh Bharayi & Ring Ceremony on 25 October 2026, 12 PM onwards, at The Stellar Gymkhana, Greater Noida.",
} as const

export async function inviteMetadata(
  variant: "bride" | "groom",
): Promise<Metadata> {
  const base = await siteUrl()
  const card = SHARE_CARD[variant]
  const imageUrl = new URL(card.path, `${base}/`).toString()

  return {
    metadataBase: new URL(base),
    title: TITLE[variant],
    description: DESCRIPTION[variant],
    openGraph: {
      type: "website",
      url: variant === "groom" ? `${base}/v2` : base,
      title: TITLE[variant],
      description: OG_DESCRIPTION[variant],
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          width: 1200,
          height: 630,
          alt: card.alt,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE[variant],
      description: OG_DESCRIPTION[variant],
      images: [imageUrl],
    },
  }
}
