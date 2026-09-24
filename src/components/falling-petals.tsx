"use client"

const PETALS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 8) % 96}%`,
  delay: `${(i * 0.37) % 6}s`,
  duration: `${7 + (i % 5) * 1.4}s`,
  size: 8 + (i % 4) * 3,
  drift: (i % 2 === 0 ? 1 : -1) * (18 + (i % 5) * 8),
  rotate: 220 + (i % 7) * 40,
  opacity: 0.45 + (i % 4) * 0.12,
}))

export function FallingPetals() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden>
      {PETALS.map((petal) => (
        <span
          key={petal.id}
          className="petal"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size * 0.72,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            ["--drift" as string]: `${petal.drift}px`,
            ["--spin" as string]: `${petal.rotate}deg`,
            opacity: petal.opacity,
          }}
        />
      ))}
    </div>
  )
}
