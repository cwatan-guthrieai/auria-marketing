import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { ArtistSuggest } from "@/components/artist-suggest"
import { StudioFrame } from "@/components/studio-frame"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { analyzeSoundchartsArtist, type CatalogAnalysis } from "@/lib/catalog-analysis"
import { scanPublicCatalog } from "@/lib/catalog-scan"
import { saveScanResult } from "@/lib/scan-result-store"
import type { SoundchartsProfile } from "@/lib/soundcharts"

const SCAN_COPY = [
  "Pulling your catalog…",
  "Finding your recordings…",
  "Checking what's already registered…",
  "Looking for missing filings…",
]

function goToResults(navigate: ReturnType<typeof useNavigate>, result: CatalogAnalysis) {
  saveScanResult(result)
  navigate("/results", { state: { result } })
}

export function WelcomePage() {
  const navigate = useNavigate()
  const inputId = useId()
  const errorId = useId()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<(typeof SCAN_COPY)[number] | "">("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  async function runScan(input: { name: string; id?: string }) {
    if (!input.name && !input.id) {
      setError("Enter an artist name or a profile link.")
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setBusy(true)
    setError("")
    setStatus(SCAN_COPY[0])

    let tick = 0
    const timer = window.setInterval(() => {
      tick += 1
      setStatus(SCAN_COPY[tick % SCAN_COPY.length])
    }, 900)
    const started = Date.now()

    try {
      const analysis = await analyzeSoundchartsArtist(
        { id: input.id, name: input.name },
        controller.signal,
      )
      if (controller.signal.aborted) {
        return
      }
      if (analysis.recordingCount === 0 && analysis.covers.length === 0 && analysis.tracks.length === 0) {
        const fallback = await scanPublicCatalog(input.name, controller.signal)
        if (fallback.covers.length === 0 && fallback.tracks.length === 0) {
          setError("We couldn't match that name or link. Try the artist name as it appears on Spotify or Apple Music.")
          return
        }
        const wait = 2400 - (Date.now() - started)
        if (wait > 0) {
          await new Promise((resolve) => setTimeout(resolve, wait))
        }
        if (controller.signal.aborted) {
          return
        }
        goToResults(navigate, {
          artistName: fallback.artistName || input.name,
          artistId: "",
          imageUrl: fallback.tracks.find((track) => track.imageUrl)?.imageUrl ?? fallback.covers[0],
          recordingCount: Math.max(fallback.albumCount, fallback.tracks.length),
          albumCount: fallback.albumCount,
          sampledCount: fallback.tracks.length,
          missingRegistrations: fallback.tracks.length,
          potentialLow: fallback.tracks.length * 180,
          potentialHigh: fallback.tracks.length * 420,
          fanCountries: [],
          covers: fallback.covers,
          tracks: fallback.tracks,
        })
        return
      }
      const wait = 2400 - (Date.now() - started)
      if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait))
      }
      if (controller.signal.aborted) {
        return
      }
      goToResults(navigate, analysis)
    } catch (caught) {
      if (controller.signal.aborted) {
        return
      }
      if (caught instanceof DOMException && caught.name === "AbortError") {
        return
      }
      setError("The catalog analysis is unavailable right now. Try again in a moment.")
    } finally {
      window.clearInterval(timer)
      setBusy(false)
      setStatus("")
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void runScan({ name: query.trim() })
  }

  function onSelectProfile(profile: SoundchartsProfile) {
    setQuery(profile.name)
    void runScan({ name: profile.name, id: profile.id })
  }

  return (
    <StudioFrame>
      <section id="scan" className="studio-slide relative h-svh snap-start overflow-hidden bg-transparent">
        <div
          data-tone="ink"
          className="studio-slide-frame relative flex h-full flex-col justify-center px-6 sm:px-12 lg:px-20"
        >
          <div className="about-hero">
            <p className="about-kicker">Catalog Analysis</p>
            <h1 className="studio-title about-display">
              <span>
                <span className="block">SEE WHAT'S</span>
                <span className="block">ALREADY</span>
                <span className="block">OUT THERE</span>
              </span>
            </h1>
            <p className="studio-body about-dek">
              <span className="block">Type your name or paste a profile link.</span>
              <span className="block">We'll find your catalog and scan it.</span>
            </p>

            <form onSubmit={onSubmit} className="studio-waitlist scan-form">
              <Label htmlFor={inputId} className="sr-only">
                Artist name or profile link
              </Label>
              <div className="studio-waitlist-row">
                <ArtistSuggest
                  id={inputId}
                  value={query}
                  disabled={busy}
                  invalid={Boolean(error)}
                  describedBy={error ? errorId : undefined}
                  onValueChange={setQuery}
                  onSelect={onSelectProfile}
                />
                <Button type="submit" className="about-next" disabled={busy} aria-label={busy ? "Scanning" : "Scan"}>
                  <ArrowRight strokeWidth={2.4} />
                </Button>
              </div>
            </form>

            <p className="sr-only" aria-live="polite">
              {status || error}
            </p>

            {busy ? (
              <div className="scan-loading" role="status" aria-live="polite">
                <span className="scan-loading-spinner" aria-hidden />
                <p className="about-kicker scan-status">{status}</p>
              </div>
            ) : null}

            {error ? (
              <p id={errorId} className="scan-error">
                {error}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </StudioFrame>
  )
}
