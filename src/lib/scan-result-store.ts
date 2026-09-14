import type { CatalogAnalysis } from "@/lib/catalog-analysis"

const KEY = "auria-scan-result"

export function saveScanResult(result: CatalogAnalysis) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(result))
  } catch {
    // Ignore quota or privacy mode errors.
  }
}

export function loadScanResult(): CatalogAnalysis | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as CatalogAnalysis
  } catch {
    return null
  }
}
