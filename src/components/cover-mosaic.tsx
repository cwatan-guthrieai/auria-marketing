import { useMemo } from "react"
import { cn } from "@/lib/utils"

const COLUMN_COUNT = 8
const SPEEDS = [42, 56, 38, 64, 48, 72, 36, 58]

function columnsFrom(covers: string[]) {
  const columns: string[][] = Array.from({ length: COLUMN_COUNT }, () => [])
  const source = covers.length > 0 ? covers : [""]
  source.forEach((cover, index) => {
    columns[index % COLUMN_COUNT].push(cover)
  })
  return columns.map((column, index) => {
    const filled = [...column]
    while (filled.length < 8) {
      filled.push(source[(index + filled.length) % source.length])
    }
    return filled
  })
}

export function CoverMosaic({
  covers,
  scanning,
  veil = "default",
}: {
  covers: string[]
  scanning: boolean
  veil?: "default" | "thin"
}) {
  const columns = useMemo(() => columnsFrom(covers), [covers])

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden bg-black"
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex gap-0.5">
        {columns.map((column, index) => (
          <div key={index} className="relative min-w-0 flex-1 overflow-hidden">
            <div
              className={cn(
                "flex flex-col gap-0.5 will-change-transform",
                "motion-safe:animate-cover-marquee",
                index % 2 === 1 && "motion-safe:animate-cover-marquee-reverse",
              )}
              style={{ animationDuration: `${SPEEDS[index]}s` }}
            >
              {[0, 1].map((copy) => (
                <div key={copy} className="flex flex-col gap-0.5">
                  {column.map((src, artIndex) => (
                    <div
                      key={`${copy}-${artIndex}`}
                      className="aspect-square w-full bg-neutral-900"
                    >
                      {src ? (
                        <img
                          src={src}
                          alt=""
                          className="size-full object-cover"
                          decoding="async"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {scanning ? <div className="cover-scan-line" /> : null}
      <div className={cn("absolute inset-0", veil === "thin" ? "bg-black/45" : "bg-black/25")} />
      <div
        className={cn(
          "absolute inset-0",
          veil === "thin"
            ? "bg-[radial-gradient(ellipse_at_center,rgb(0_0_0_/_0.15)_0%,rgb(0_0_0_/_0.55)_58%,rgb(0_0_0_/_0.88)_100%)]"
            : "bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.78)_100%)]",
        )}
      />
    </div>
  )
}
