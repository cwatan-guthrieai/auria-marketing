import { mapSoundchartsArtists } from "./soundcharts.ts"
import type {
  CatalogAnalysis,
  CatalogTrack,
  FanCountry,
  MissingRegistration,
} from "./catalog-analysis.ts"
import {
  RECORDING_RECOVERY_HIGH,
  RECORDING_RECOVERY_LOW,
  trackRecovery,
} from "./catalog-analysis.ts"
const SAMPLE_SIZE = 10
const TRACK_PREVIEW = 6

const PERFORMANCE_CODES = new Set([
  "ascap",
  "bmi",
  "sesac",
  "gmr",
  "prs",
  "sacem",
  "gema",
  "socan",
])
const STREAMING_CODES = new Set(["mlc", "hfa", "harryfox", "cmrra"])

type Creds = { baseUrl: string; appId: string; apiKey: string }

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function itemsOf(payload: unknown): Record<string, unknown>[] {
  const root = asRecord(payload)
  if (!root) return []
  if (Array.isArray(root.items)) {
    return root.items.filter((item) => asRecord(item)) as Record<string, unknown>[]
  }
  return []
}

function pageTotal(payload: unknown) {
  const page = asRecord(asRecord(payload)?.page)
  const total = page?.total
  return typeof total === "number" ? total : itemsOf(payload).length
}

function songImage(song: Record<string, unknown>, fallback?: string) {
  if (typeof song.imageUrl === "string") return song.imageUrl
  if (typeof song.coverUrl === "string") return song.coverUrl
  const album = asRecord(song.album)
  if (typeof album?.imageUrl === "string") return album.imageUrl
  if (typeof album?.coverUrl === "string") return album.coverUrl
  return fallback
}

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  UK: "United Kingdom",
  DE: "Germany",
  FR: "France",
  CA: "Canada",
  AU: "Australia",
  BR: "Brazil",
  MX: "Mexico",
  ES: "Spain",
  IT: "Italy",
  NL: "Netherlands",
  SE: "Sweden",
  NO: "Norway",
  JP: "Japan",
  KR: "South Korea",
  IN: "India",
  ID: "Indonesia",
  PH: "Philippines",
  NG: "Nigeria",
  ZA: "South Africa",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  PL: "Poland",
  TR: "Turkey",
  IE: "Ireland",
  NZ: "New Zealand",
  PT: "Portugal",
  BE: "Belgium",
  CH: "Switzerland",
  AT: "Austria",
  DK: "Denmark",
  FI: "Finland",
}

function countryName(code: string) {
  const upper = code.toUpperCase()
  return COUNTRY_NAMES[upper] ?? upper
}

function latestItem(payload: unknown) {
  const items = itemsOf(payload)
  if (items.length === 0) return null
  return [...items].sort((a, b) => String(a.date ?? "").localeCompare(String(b.date ?? ""))).at(-1) ?? null
}

function latestMetric(payload: unknown) {
  const item = latestItem(payload)
  if (!item) return undefined
  if (typeof item.value === "number") return item.value
  if (typeof item.followerCount === "number") return item.followerCount
  if (typeof item.latestValue === "number") return item.latestValue
  return undefined
}

function fanCountriesFrom(payload: unknown): FanCountry[] {
  const latest = latestItem(payload)
  const plots = Array.isArray(latest?.cityPlots) ? latest.cityPlots : itemsOf(payload)
  const byCode = new Map<string, FanCountry>()
  for (const plot of plots) {
    const item = asRecord(plot)
    if (!item) continue
    const code = String(item.countryCode ?? item.countryIsoCode ?? item.code ?? "").toUpperCase()
    if (!code || code.length > 3) continue
    const value = typeof item.value === "number" ? item.value : 0
    const current = byCode.get(code) ?? {
      code,
      name: typeof item.countryName === "string" ? item.countryName : countryName(code),
      share: 0,
    }
    current.share = (current.share ?? 0) + value
    byCode.set(code, current)
  }
  return [...byCode.values()]
    .sort((a, b) => (b.share ?? 0) - (a.share ?? 0))
    .slice(0, 3)
}

function artistFrom(payload: unknown, fallbackName: string, fallbackId: string) {
  const object = asRecord(asRecord(payload)?.object) ?? asRecord(asRecord(payload)?.related)
  return {
    name: typeof object?.name === "string" ? object.name : fallbackName,
    id: typeof object?.uuid === "string" ? object.uuid : fallbackId,
    country: typeof object?.countryCode === "string" ? object.countryCode : undefined,
    imageUrl: typeof object?.imageUrl === "string" ? object.imageUrl : undefined,
  }
}

async function soundchartsGet(creds: Creds, path: string) {
  const response = await fetch(`${creds.baseUrl}${path}`, {
    headers: { "x-app-id": creds.appId, "x-api-key": creds.apiKey },
  })
  if (!response.ok) {
    throw new Error(`Soundcharts ${response.status}`)
  }
  return response.json()
}

function identifierValue(item: Record<string, unknown>) {
  if (typeof item.identifier === "string") return item.identifier
  if (typeof item.value === "string") return item.value
  if (typeof item.externalId === "string") return item.externalId
  if (typeof item.id === "string") return item.id
  return undefined
}

function songRowCodes(song: Record<string, unknown>) {
  return {
    isrc: typeof song.isrc === "string" ? song.isrc : undefined,
    iswc: typeof song.iswc === "string" ? song.iswc : undefined,
  }
}

function inspectSongIdentifiers(payload: unknown) {
  let performance = false
  let streaming = false
  let composition = false
  let isrc: string | undefined
  let iswc: string | undefined

  for (const item of itemsOf(payload)) {
    const code = String(item.platformCode ?? item.platform ?? "").toLowerCase()
    const name = String(item.platformName ?? item.name ?? "").toLowerCase()
    const blob = `${code} ${name}`
    const value = identifierValue(item)

    if (code === "isrc" || name.includes("isrc")) {
      isrc = value ?? isrc
    }
    if (code === "iswc" || name.includes("iswc")) {
      iswc = value ?? iswc
    }
    if (PERFORMANCE_CODES.has(code) || /ascap|bmi|sesac|performance/.test(blob)) {
      performance = true
    }
    if (STREAMING_CODES.has(code) || /mlc|harry.?fox|\bhfa\b|mechanical/.test(blob)) {
      streaming = true
    }
    if (code === "iswc" || name.includes("iswc") || blob.includes("iswc")) {
      composition = true
    }
  }

  const missing: MissingRegistration[] = []
  if (!performance) missing.push("Performance")
  if (!streaming) missing.push("Streaming")
  if (!composition) missing.push("Composition")

  return { missing, isrc, iswc }
}

function buildTrack(
  track: Omit<CatalogTrack, "recoveryLow" | "recoveryHigh">,
): CatalogTrack {
  const recovery = trackRecovery(track.missing)
  return {
    ...track,
    recoveryLow: recovery?.low ?? 0,
    recoveryHigh: recovery?.high ?? 0,
  }
}

async function resolveArtistId(creds: Creds, query: string) {
  const payload = await soundchartsGet(
    creds,
    `/api/v2/artist/search/${encodeURIComponent(query)}?offset=0&limit=5`,
  )
  const first = mapSoundchartsArtists(payload)[0]
  return first?.id ?? ""
}

export async function analyzeSoundchartsCatalog(
  creds: Creds,
  input: { id?: string; query?: string },
): Promise<CatalogAnalysis> {
  let artistId = input.id?.trim() ?? ""
  if (!artistId && input.query) {
    artistId = await resolveArtistId(creds, input.query)
  }
  if (!artistId) {
    throw new Error("No Soundcharts artist")
  }

  const [detail, songs, albums, listening, streaming] = await Promise.all([
    soundchartsGet(creds, `/api/v2.9/artist/${artistId}`).catch(() => null),
    soundchartsGet(
      creds,
      `/api/v2.21/artist/${artistId}/songs?limit=40&offset=0&sortBy=releaseDate&sortOrder=desc`,
    ),
    soundchartsGet(creds, `/api/v2.34/artist/${artistId}/albums?limit=20`).catch(() => null),
    soundchartsGet(creds, `/api/v2/artist/${artistId}/streaming/spotify/listening`).catch(
      () => null,
    ),
    soundchartsGet(creds, `/api/v2/artist/${artistId}/streaming/spotify`).catch(() => null),
  ])

  const artist = artistFrom(detail ?? albums, input.query ?? "Artist", artistId)
  const songRows = itemsOf(songs)
  const recordingCount = Math.max(pageTotal(songs), songRows.length)
  const albumCount = albums ? Math.max(pageTotal(albums), itemsOf(albums).length) : 0

  const covers: string[] = []
  if (artist.imageUrl) covers.push(artist.imageUrl)
  for (const song of songRows) {
    const image = songImage(song)
    if (image) covers.push(image)
  }

  const sample = songRows.slice(0, SAMPLE_SIZE)
  const inspected: CatalogTrack[] = []
  let missingSample = 0
  for (const song of sample) {
    const songId = typeof song.uuid === "string" ? song.uuid : ""
    const name = typeof song.name === "string" ? song.name : "Untitled"
    const imageUrl = songImage(song, artist.imageUrl)
    const rowCodes = songRowCodes(song)
    if (!songId) {
      missingSample += 1
      inspected.push(
        buildTrack({
          id: `${name}-${inspected.length}`,
          name,
          imageUrl,
          isrc: rowCodes.isrc,
          iswc: rowCodes.iswc,
          missing: ["Performance", "Streaming", "Composition"],
        }),
      )
      continue
    }
    try {
      const identifiers = await soundchartsGet(creds, `/api/v2/song/${songId}/identifiers`)
      const parsed = inspectSongIdentifiers(identifiers)
      if (parsed.missing.length > 0) missingSample += 1
      inspected.push(
        buildTrack({
          id: songId,
          name,
          imageUrl,
          isrc: parsed.isrc ?? rowCodes.isrc,
          iswc: parsed.iswc ?? rowCodes.iswc,
          missing: parsed.missing,
        }),
      )
    } catch {
      missingSample += 1
      inspected.push(
        buildTrack({
          id: songId,
          name,
          imageUrl,
          isrc: rowCodes.isrc,
          iswc: rowCodes.iswc,
          missing: ["Performance", "Streaming", "Composition"],
        }),
      )
    }
    await new Promise((resolve) => setTimeout(resolve, 80))
  }

  const withGaps = inspected.filter((track) => track.missing.length > 0)
  const complete = inspected.filter((track) => track.missing.length === 0)
  const tracks = [...withGaps, ...complete].slice(0, TRACK_PREVIEW)
  if (tracks.length < TRACK_PREVIEW) {
    for (const song of songRows) {
      const id = typeof song.uuid === "string" ? song.uuid : ""
      const name = typeof song.name === "string" ? song.name : "Untitled"
      const imageUrl = songImage(song, artist.imageUrl)
      if (!id || tracks.some((track) => track.id === id)) continue
      tracks.push(
        buildTrack({
          id,
          name,
          imageUrl,
          isrc: songRowCodes(song).isrc,
          iswc: songRowCodes(song).iswc,
          missing: ["Performance", "Streaming", "Composition"],
        }),
      )
      if (tracks.length >= TRACK_PREVIEW) break
    }
  }

  const sampledCount = sample.length
  const missingRate = sampledCount > 0 ? missingSample / sampledCount : 0
  const missingRegistrations = Math.round(missingRate * recordingCount)
  const potentialLow = missingRegistrations * RECORDING_RECOVERY_LOW
  const potentialHigh = missingRegistrations * RECORDING_RECOVERY_HIGH

  return {
    artistName: artist.name,
    artistId: artist.id,
    country: artist.country,
    imageUrl: artist.imageUrl,
    recordingCount,
    albumCount,
    sampledCount,
    missingRegistrations,
    potentialLow,
    potentialHigh,
    monthlyListeners: latestMetric(listening),
    fanCountries: fanCountriesFrom(streaming),
    covers: [...new Set(covers)],
    tracks,
  }
}
