import type { ReactNode } from "react"
import { inviteMetadata } from "@/lib/share-metadata"

export const generateMetadata = () => inviteMetadata("groom")

export default function GroomFirstLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
