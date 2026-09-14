export type MissingRegistration = "Performance" | "Streaming" | "Composition"

export const RECORDING_RECOVERY_LOW = 180
export const RECORDING_RECOVERY_HIGH = 420

export type CatalogTrack = {
  id: string
  name: string
  imageUrl?: string
  isrc?: string
  iswc?: string
  missing: MissingRegistration[]
  recoveryLow?: number
  recoveryHigh?: number
}

export type FanCountry = {
  code: string
  name: string
  share?: number
}

export type CatalogAnalysis = {
  artistName: string
  artistId: string
  country?: string
  imageUrl?: string
  recordingCount: number
  albumCount: number
  sampledCount: number
  missingRegistrations: number
  potentialLow: number
  potentialHigh: number
  monthlyListeners?: number
  fanCountries: FanCountry[]
  covers: string[]
  tracks: CatalogTrack[]
}

export async function analyzeSoundchartsArtist(
  params: { id?: string; name?: string },
  signal?: AbortSignal,
): Promise<CatalogAnalysis> {
  const query = new URLSearchParams()
  if (params.id) query.set("id", params.id)
  if (params.name) query.set("q", params.name)
  const response = await fetch(`/lookup/soundcharts/analysis?${query}`, { signal })
  if (!response.ok) {
    throw new Error("Catalog analysis failed")
  }
  const data = (await response.json()) as CatalogAnalysis
  return {
    ...data,
    tracks: data.tracks ?? [],
    fanCountries: data.fanCountries ?? [],
  }
}

export function trackRecovery(missing: MissingRegistration[]) {
  if (missing.length === 0) return null
  const share = missing.length / 3
  return {
    low: Math.round(RECORDING_RECOVERY_LOW * share),
    high: Math.round(RECORDING_RECOVERY_HIGH * share),
  }
}

export function formatRecoveryRange(low: number, high: number) {
  if (low <= 0 && high <= 0) return null
  if (low === high) return formatUsd(low)
  return `${formatUsd(low)}–${formatUsd(high)}`
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCompact(amount: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount)
}
