import { useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowDown, ArrowRight, AudioLines } from "lucide-react"
import { PillCover } from "@/components/pill-cover"
import { scrollToManifestoTop, scrollToStudio, StudioChapter, StudioFrame } from "@/components/studio-frame"
import { CircuitMap } from "@/components/circuit-map"
import { WaitlistJoin } from "@/components/waitlist-join"
import {
  manifestoAudience,
  manifestoDoes,
  manifestoProblem,
  manifestoRoyalties,
} from "@/content/manifesto"

export function HomePage() {
  useEffect(() => {
    scrollToManifestoTop()
  }, [])

  return (
    <StudioFrame>
      <PillCover />

      <StudioChapter
        id="royalties"
        tone="ink"
        align="center"
        layout="royalties"
        title={manifestoRoyalties.title}
        body={manifestoRoyalties.dek}
      >
        <ul className="kind-pills">
          <li className="pill-row">
            <span className="kind-pill" data-hue="blue">
              {manifestoRoyalties.kinds[0].name}
            </span>
            <span className="kind-disc" data-hue="orange" aria-hidden>
              <ArrowDown strokeWidth={2.4} />
            </span>
          </li>
          <li className="pill-row">
            <span className="kind-pill" data-hue="pink">
              {manifestoRoyalties.kinds[1].name}
            </span>
            <span className="kind-pill" data-hue="cream">
              {manifestoRoyalties.kinds[2].name}
            </span>
          </li>
          <li className="pill-row">
            <span className="kind-disc" data-hue="green" aria-hidden>
              <AudioLines strokeWidth={2.2} />
            </span>
            <span className="kind-pill" data-hue="lilac">
              {manifestoRoyalties.kinds[3].name}
            </span>
          </li>
          <li className="pill-row">
            <span className="kind-pill" data-hue="red">
              {manifestoRoyalties.kinds[4].name}
            </span>
            <span className="kind-disc" data-hue="outline" aria-hidden />
          </li>
        </ul>
        <Link to="/welcome" className="pill-row studio-audit">
          <span className="kind-disc" data-hue="lime" aria-hidden>
            <ArrowRight strokeWidth={2.4} />
          </span>
          <span className="kind-pill" data-hue="white">
            {manifestoRoyalties.cta}
          </span>
        </Link>
      </StudioChapter>

      <StudioChapter
        id="problem"
        tone="ink"
        align="center"
        title={["NO SONG SHOULD", "LOSE MONEY"]}
        body={manifestoProblem.body[0]}
      />

      <StudioChapter
        id="does"
        tone="ink"
        align="center"
        title={["WE OPEN", "THE BOX"]}
        body={manifestoDoes.body}
      />

      <StudioChapter
        id="work"
        n="5"
        tone="ink"
        layout="circuit"
        title={["THE WORK"]}
      >
        <CircuitMap />
      </StudioChapter>

      <StudioChapter
        id="audience"
        tone="ink"
        align="center"
        layout="audience"
        title={["WHO", "FIRST"]}
        body={manifestoAudience.dek}
      >
        {manifestoAudience.items.map((item) => (
          <button
            key={item.title}
            type="button"
            className="audience-card"
            data-hue={item.hue}
            onClick={() => scrollToStudio("join")}
          >
            <span className="audience-card-title">{item.title}</span>
            <span className="audience-card-body">{item.body}</span>
            <span className="audience-card-go" aria-hidden>
              <ArrowRight strokeWidth={2.4} />
            </span>
            <span className="sr-only">Join the waitlist</span>
          </button>
        ))}
      </StudioChapter>

      <StudioChapter id="join" tone="ink" align="center" layout="cta" title={[]}>
        <WaitlistJoin />
      </StudioChapter>
    </StudioFrame>
  )
}
