import { useEffect, useRef } from "react"

export function ManifestoVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => {
      if (media.matches) {
        node.pause()
        node.currentTime = 0
        return
      }
      void node.play().catch(() => undefined)
    }
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <video
        ref={ref}
        className="size-full object-cover"
        src="/videos/black-hole.mov"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
      />
      <div className="absolute inset-0 bg-black/70" />
    </div>
  )
}
