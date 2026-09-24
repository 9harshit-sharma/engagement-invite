export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-hidden>
      <span className="h-px w-10 bg-linear-to-r from-transparent to-[#c4a265]" />
      <svg viewBox="0 0 20 12" className="h-3 w-5 text-[#c4a265]">
        <path
          d="M10 1 C8 4 4 5 1 6 C4 7 8 8 10 11 C12 8 16 7 19 6 C16 5 12 4 10 1Z"
          fill="currentColor"
        />
      </svg>
      <span className="h-px w-10 bg-linear-to-l from-transparent to-[#c4a265]" />
    </div>
  )
}
