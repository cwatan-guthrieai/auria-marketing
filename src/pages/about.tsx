import { ArrowDown } from "lucide-react"
import { scrollToStudio, StudioFrame } from "@/components/studio-frame"
import { howAuriaSteps, howAuriaWorks } from "@/content/how-auria-works"

export function AboutPage() {
  return (
    <StudioFrame>
      <section id="how" className="studio-slide relative h-svh snap-start overflow-hidden bg-transparent">
        <div
          data-tone="ink"
          className="studio-slide-frame relative flex h-full flex-col justify-center px-6 sm:px-12 lg:px-20"
        >
          <div className="about-hero">
            <p className="about-kicker">{howAuriaWorks.kicker}</p>
            <h1 className="studio-title about-display">
              <span>
                {howAuriaWorks.title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </h1>
            <p className="studio-body about-dek">{howAuriaWorks.dek}</p>
            <button
              type="button"
              className="about-next"
              onClick={() => scrollToStudio(howAuriaSteps[0].id)}
            >
              <span className="sr-only">Next</span>
              <ArrowDown strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </section>

      {howAuriaSteps.map((step, index) => {
        const next = howAuriaSteps[index + 1]
        return (
          <section
            key={step.id}
            id={step.id}
            className="studio-slide relative h-svh snap-start overflow-hidden bg-transparent"
          >
            <div
              data-tone="ink"
              className="studio-slide-frame relative flex h-full flex-col justify-center px-6 sm:px-12 lg:px-20"
            >
              <div className="about-step">
                <p className="about-step-num">{step.n}</p>
                <h2 className="about-step-title">{step.title}</h2>
                <p className="studio-body about-step-body">{step.body}</p>
                {next ? (
                  <button
                    type="button"
                    className="about-next"
                    onClick={() => scrollToStudio(next.id)}
                  >
                    <span className="sr-only">Next</span>
                    <ArrowDown strokeWidth={2.4} />
                  </button>
                ) : null}
              </div>
            </div>
          </section>
        )
      })}
    </StudioFrame>
  )
}
