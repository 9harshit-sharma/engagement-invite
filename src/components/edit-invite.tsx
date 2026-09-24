"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { type InviteDetails } from "@/lib/invite"

const FIELDS: { key: keyof InviteDetails; label: string }[] = [
  { key: "personOneName", label: "First name" },
  { key: "personOneParents", label: "First person's parents" },
  { key: "personOneGrandparents", label: "First person's grandparents" },
  { key: "personTwoName", label: "Second name" },
  { key: "personTwoParents", label: "Second person's parents" },
  { key: "personTwoGrandparents", label: "Second person's grandparents" },
  { key: "eventTitle", label: "Event title" },
  { key: "month", label: "Month" },
  { key: "dayNumber", label: "Date" },
  { key: "year", label: "Year" },
  { key: "weekday", label: "Weekday" },
  { key: "time", label: "Time" },
  { key: "venue", label: "Venue" },
  { key: "city", label: "City" },
  { key: "familySignoff", label: "Family sign-off" },
]

export function EditInvite({
  details,
  onChange,
}: {
  details: InviteDetails
  onChange: (next: InviteDetails) => void
}) {
  const [draft, setDraft] = useState(details)
  const [open, setOpen] = useState(false)

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setDraft(details)
      }}
    >
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full bg-[#f6efe2]/85 text-[#5c3b28] shadow-sm backdrop-blur-sm hover:bg-[#f6efe2]"
            aria-label="Edit invitation details"
          />
        }
      >
        <Pencil className="size-4" />
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="max-h-[88vh] overflow-y-auto rounded-t-2xl border-[#e4d3b8] bg-[#fbf6ec]"
      >
        <SheetHeader>
          <SheetTitle className="font-[family-name:var(--font-cormorant)] text-2xl text-[#4a3426]">
            Personalize this invite
          </SheetTitle>
          <SheetDescription className="font-[family-name:var(--font-cormorant)] text-base text-[#6e5848]">
            Names, date, and venue update instantly. Sample details are filled in so you can see the full card.
          </SheetDescription>
        </SheetHeader>
        <form
          className="grid gap-3 px-4 pb-2 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            onChange(draft)
            setOpen(false)
          }}
        >
          {FIELDS.map((field) => (
            <div key={field.key} className="grid gap-1.5">
              <Label htmlFor={field.key} className="text-[#5c3b28]">
                {field.label}
              </Label>
              <Input
                id={field.key}
                value={draft[field.key]}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
                className="h-9 border-[#e4d3b8] bg-white text-[#3f2c20]"
              />
            </div>
          ))}
          <SheetFooter className="col-span-full px-0">
            <Button
              type="submit"
              className="h-10 bg-[#6e1824] text-[#f8e7c0] hover:bg-[#58141d]"
            >
              Save details
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
