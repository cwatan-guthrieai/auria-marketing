import { useEffect, useRef, useState, type ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

export function scrollToManifestoTop() {
  scrollToStudio("portfolio")
}

export function scrollToStudio(id: string) {
  const target = document.getElementById(id)
  if (!target) return

  const root = document.documentElement
  root.style.scrollSnapType = "none"

  target.scrollIntoView({ behavior: "smooth", block: "start" })

  let settleTimer = 0
  const restoreSnap = () => {
    root.style.removeProperty("scroll-snap-type")
    window.removeEventListener("scroll", onScroll)
  }
  const onScroll = () => {
    window.clearTimeout(settleTimer)
    settleTimer = window.setTimeout(restoreSnap, 140)
  }

  window.addEventListener("scroll", onScroll, { passive: true })
  settleTimer = window.setTimeout(restoreSnap, 900)
}

const NAV = [
  { to: "/", label: "Manifesto" },
  { to: "/welcome", label: "Scan" },
  { to: "/about", label: "About" },
] as const

export function StudioFrame({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  return (
    <article data-studio className="relative min-h-svh bg-transparent text-neutral-950">
      <header className="studio-chrome pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-7">
        <div className="pointer-events-auto flex items-center gap-2">
          <Link
            to="/"
            className="studio-mark inline-flex items-center"
            onClick={() => {
              if (pathname === "/") scrollToManifestoTop()
            }}
          >
            <img src="/auria-logo.png" alt="Auria" className="studio-mark-img" />
          </Link>
        </div>
        <nav className="pointer-events-auto flex items-center gap-2">
          {NAV.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "inline-flex h-[47px] items-center rounded-[26px] px-4 text-[16px] transition",
                pathname === link.to
                  ? "bg-neutral-950 text-white"
                  : "bg-[#fdfcfa] text-neutral-950 hover:bg-white",
                link.to === "/" && "hidden md:inline-flex",
              )}
              onClick={() => {
                if (link.to === "/" && pathname === "/") scrollToManifestoTop()
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {children}

      <footer className="studio-footer">
        <p>Auria Music by Auria Labs Inc. 2026 All Rights Reserved</p>
        <p>
          Contact{" "}
          <a href="mailto:admin@aurialabs.co">admin@aurialabs.co</a>
        </p>
      </footer>
    </article>
  )
}

export function StudioChapter({
  id,
  n,
  title,
  body,
  first = false,
  tone = "cream",
  mark,
  layout = "hero",
  align = "end",
  children,
}: {
  id: string
  n?: string
  title: readonly string[]
  body?: string
  first?: boolean
  tone?: "cream" | "lilac" | "blush" | "lime" | "ink"
  mark?: ReactNode
  layout?: "hero" | "board" | "circuit" | "royalties" | "audience" | "cta"
  align?: "end" | "center"
  children?: ReactNode
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
          return
        }
        seen.current = false
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
      className="studio-slide relative h-svh snap-start overflow-hidden bg-transparent"
    >
      <div
        data-tone={tone}
        className={cn(
          "studio-slide-frame relative flex h-full flex-col",
          layout === "circuit"
            ? "justify-stretch px-5 pb-6 pt-20 sm:px-8"
            : align === "center"
              ? "justify-center px-6 py-28 sm:px-12 lg:px-20"
              : "justify-between px-6 pb-16 pt-28 sm:px-12 lg:px-20",
        )}
      >
      <div
        key={tick}
        className={cn(
          "studio-play flex min-h-0 flex-1 flex-col",
          align === "center" && layout !== "circuit" && "justify-center",
        )}
      >
        {layout === "circuit" ? (
          children
        ) : layout === "cta" ? (
          <div className="studio-cta-panel">{children}</div>
        ) : layout === "royalties" ? (
          <div className="royalties-board">
            <div className="royalties-copy">
              <h2 className="studio-title">
                {n ? <span className="studio-num">{n}</span> : null}
                <span>
                  {title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </h2>
              {body ? <p className="studio-body royalties-dek">{body}</p> : null}
            </div>
            <div className="royalties-side">{children}</div>
          </div>
        ) : layout === "audience" ? (
          <div className="audience-board">
            <div className="audience-copy">
              <h2 className="audience-title">
                {title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              {body ? <p className="audience-dek">{body}</p> : null}
            </div>
            <div className="audience-cards">{children}</div>
          </div>
        ) : (
          <>
            {mark ? (
              <div className="mb-10 flex min-h-0 flex-1 items-stretch">{mark}</div>
            ) : null}
            <div
              className={cn(
                "grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]",
                align === "center" ? "items-center" : "items-end",
                layout === "board" && align !== "center" && "items-start",
                layout === "hero" && !mark && align !== "center" && "mt-auto",
              )}
            >
              <h2 className={cn("studio-title", layout === "board" && "studio-title-board")}>
                {n ? <span className="studio-num">{n}</span> : null}
                <span>
                  {title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </h2>
              {body ? (
                <p
                  className={cn(
                    "studio-body max-w-md justify-self-start lg:justify-self-end",
                    align !== "center" && "lg:mt-3",
                  )}
                >
                  {body}
                </p>
              ) : null}
            </div>
            {children}
          </>
        )}
      </div>
      </div>
    </section>
  )
}
