export function Monogram({
  className = "",
  size = "default",
  letters = "dh",
}: {
  className?: string
  size?: "default" | "hero" | "seal"
  letters?: "dh" | "hd"
}) {
  const src =
    letters === "hd"
      ? size === "seal"
        ? "/scenes/logo-hd-groom-seal.png?v=5"
        : "/scenes/logo-hd-groom.png?v=5"
      : size === "seal"
        ? "/scenes/logo-dh-seal.png"
        : "/scenes/logo-dh.png"

  return (
    <div
      className={`logo-halo relative mx-auto grid place-items-center ${size === "seal" ? "is-seal" : ""} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Deepshikha and Harshit monogram"
        width={660}
        height={720}
        className="h-[92%] w-[92%] object-contain"
      />
    </div>
  )
}
