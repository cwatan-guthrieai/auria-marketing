import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ScanResults } from "@/components/scan-results"
import { StudioFrame } from "@/components/studio-frame"
import type { CatalogAnalysis } from "@/lib/catalog-analysis"
import { loadScanResult } from "@/lib/scan-result-store"

type ResultsLocationState = {
  result?: CatalogAnalysis
}

export function ResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ResultsLocationState | null
  const result = state?.result ?? loadScanResult()

  useEffect(() => {
    if (!result) {
      navigate("/welcome", { replace: true })
    }
  }, [navigate, result])

  if (!result) {
    return null
  }

  return (
    <StudioFrame>
      <section className="studio-slide relative min-h-svh overflow-y-auto bg-transparent">
        <div
          data-tone="ink"
          className="studio-slide-frame relative flex min-h-svh flex-col px-6 pb-16 pt-28 sm:px-12 lg:px-20"
        >
          <h1 className="scan-results-page-title">Here's your free catalog report!</h1>
          <ScanResults result={result} />
        </div>
      </section>
    </StudioFrame>
  )
}
