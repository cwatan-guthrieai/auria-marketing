import { ArrowDown, ArrowRight, Music2 } from "lucide-react"

export function PillCover() {
  return (
    <section id="portfolio" className="pill-cover snap-start">
      <div className="pill-cover-frame">
        <h1 className="pill-stack">
          <span className="sr-only">Your digital rights portfolio</span>
          <div className="pill-row" aria-hidden>
            <span className="pill-disc pill-disc-lime">
              <ArrowRight strokeWidth={2.4} />
            </span>
            <span className="pill-word">Your</span>
          </div>
          <div className="pill-row" aria-hidden>
            <span className="pill-word pill-word-cream">Digital</span>
            <span className="pill-word">Rights</span>
          </div>
          <div className="pill-row" aria-hidden>
            <span className="pill-disc pill-disc-teal">
              <ArrowDown strokeWidth={2.4} />
            </span>
            <span className="pill-word">Portfolio</span>
          </div>
          <div className="pill-row" aria-hidden>
            <span className="pill-disc pill-disc-teal">
              <Music2 strokeWidth={2.2} />
            </span>
          </div>
        </h1>
      </div>
    </section>
  )
}
