import { useEffect, useRef, useState, type ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { ManifestoVideo } from "@/components/manifesto-video"
import { cn } from "@/lib/utils"

export function scrollToChapter(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

export function ManifestoChapter({
  id,
  first = false,
  wide = false,
  pack = "quiet",
  mark,
  children,
}: {
  id: string
  first?: boolean
  wide?: boolean
  pack?: "quiet" | "maximal"
  mark?: ReactNode
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const [tick, setTick] = useState(first ? 1 : 0)
  const seen = useRef(first)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!seen.current) {
            seen.current = true
            setTick((value) => value + 1)
          }
          node.dataset.active = "true"
          return
        }
        seen.current = false
        node.dataset.active = "false"
      },
      { threshold: 0.45 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id={id}
      ref={ref}
      data-active={first ? "true" : "false"}
      data-wide={wide ? "true" : undefined}
      className={cn(
        "relative z-10 flex min-h-svh snap-start flex-col px-6 py-24",
        pack === "maximal"
          ? "items-stretch justify-start pt-28 pb-16 sm:px-10"
          : "items-center justify-center",
      )}
    >
      <div
        key={tick}
        className={cn(
          "manifesto-copy manifesto-play flex w-full flex-col",
          pack === "maximal"
            ? "mx-auto max-w-[1400px] items-stretch text-left"
            : cn("items-center text-center", wide ? "max-w-[1100px]" : "max-w-[700px]"),
        )}
      >
        {children}
      </div>
      {mark ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center text-white">
          {mark}
        </div>
      ) : null}
    </section>
  )
}

export function ManifestoFrame({
  chapters,
  children,
}: {
  chapters: readonly string[]
  children: ReactNode
}) {
  const { pathname } = useLocation()
  const [active, setActive] = useState(0)

  useEffect(() => {
    const nodes = chapters
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible?.target.id) return
        const index = chapters.indexOf(visible.target.id)
        if (index >= 0) setActive(index)
      },
      { threshold: 0.55 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [chapters])

  return (
    <article data-manifesto className="relative bg-black text-white">
      <ManifestoVideo />
      <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5">
        <Link to="/" className="text-sm text-white/50 hover:text-white">
          Auria
        </Link>
        <div className="flex gap-5 text-sm text-white/25">
          {[
            { to: "/", label: "Manifesto" },
            { to: "/welcome", label: "Scan" },
            { to: "/about", label: "About" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn("hover:text-white", pathname === link.to && "text-white")}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <nav
        aria-label="Chapters"
        className="fixed right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 md:flex"
      >
        {chapters.map((id, index) => (
          <button
            key={id}
            type="button"
            aria-label={`Chapter ${index + 1}`}
            aria-current={active === index ? "true" : undefined}
            className={cn(
              "size-1.5 rounded-full transition",
              active === index ? "bg-white" : "bg-white/25 hover:bg-white/50",
            )}
            onClick={() => scrollToChapter(id)}
          />
        ))}
      </nav>

      {children}
    </article>
  )
}

export function ManifestoLines({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </>
  )
}

export function ManifestoPill({
  to,
  children,
  onClick,
}: {
  to?: string
  children: ReactNode
  onClick?: () => void
}) {
  const className =
    "mt-8 rounded-full bg-neutral-800 px-6 py-2.5 text-base text-white transition duration-300 hover:bg-neutral-700 hover:scale-[1.03]"
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  )
}
