import {
  trackRecovery,
  type CatalogTrack,
  type MissingRegistration,
} from "@/lib/catalog-analysis"
import { parseCatalogQuery } from "@/lib/catalog-query"

export type CatalogScan = {
  artistName: string
  albumCount: number
  covers: string[]
  tracks: CatalogTrack[]
}

type ItunesAlbum = {
  wrapperType?: string
  collectionType?: string
  artistName?: string
  collectionName?: string
  trackName?: string
  trackId?: number
  artworkUrl100?: string
}

function largerArt(url: string) {
  return url.replace("100x100bb", "300x300bb")
}

async function itunesJson(path: string, signal?: AbortSignal) {
  const response = await fetch(`/lookup/itunes${path}`, { signal })
  if (!response.ok) {
    throw new Error("Catalog lookup failed")
  }
  return response.json() as Promise<{ results?: ItunesAlbum[] }>
}

async function spotifyTitle(spotifyUrl: string, signal?: AbortSignal) {
  const response = await fetch(
    `/lookup/spotify-oembed?url=${encodeURIComponent(spotifyUrl)}`,
    { signal },
  )
  if (!response.ok) {
    throw new Error("Spotify lookup failed")
  }
  const data = (await response.json()) as { title?: string }
  return data.title?.replace(/\s+-\s+song\s+and\s+lyrics.+$/i, "").trim() ?? ""
}

function toTracks(results: ItunesAlbum[]): CatalogTrack[] {
  const seen = new Set<string>()
  const tracks: CatalogTrack[] = []
  for (const item of results) {
    const name = item.trackName ?? item.collectionName
    const imageUrl = item.artworkUrl100 ? largerArt(item.artworkUrl100) : undefined
    if (!name || !imageUrl || seen.has(name)) continue
    seen.add(name)
    const missing: MissingRegistration[] = ["Performance", "Streaming", "Composition"]
    const recovery = trackRecovery(missing)
    tracks.push({
      id: String(item.trackId ?? name),
      name,
      imageUrl,
      missing,
      recoveryLow: recovery?.low,
      recoveryHigh: recovery?.high,
    })
    if (tracks.length >= 8) break
  }
  return tracks
}

function toScan(results: ItunesAlbum[]): CatalogScan {
  const albums = results.filter(
    (item) => item.wrapperType === "collection" || item.collectionType === "Album",
  )
  const covers = albums
    .map((item) => (item.artworkUrl100 ? largerArt(item.artworkUrl100) : ""))
    .filter(Boolean)
  const unique = [...new Set(covers)]
  const artistName = albums[0]?.artistName ?? results[0]?.artistName ?? ""
  return {
    artistName,
    albumCount: unique.length || albums.length,
    covers: unique,
    tracks: toTracks(results),
  }
}

export async function scanPublicCatalog(
  raw: string,
  signal?: AbortSignal,
): Promise<CatalogScan> {
  const parsed = parseCatalogQuery(raw)

  if (parsed.spotifyUrl) {
    const title = await spotifyTitle(parsed.spotifyUrl, signal)
    if (!title) {
      return { artistName: "", albumCount: 0, covers: [], tracks: [] }
    }
    const data = await itunesJson(
      `/search?term=${encodeURIComponent(title)}&entity=album&limit=50`,
      signal,
    )
    const scan = toScan(data.results ?? [])
    return { ...scan, artistName: scan.artistName || title }
  }

  if (parsed.appleArtistId) {
    const data = await itunesJson(
      `/lookup?id=${parsed.appleArtistId}&entity=album&limit=50`,
      signal,
    )
    const scan = toScan(data.results ?? [])
    if (scan.covers.length > 0) {
      return scan
    }
  }

  if (!parsed.searchTerm) {
    return { artistName: "", albumCount: 0, covers: [], tracks: [] }
  }

  const [albums, songs] = await Promise.all([
    itunesJson(
      `/search?term=${encodeURIComponent(parsed.searchTerm)}&entity=album&limit=50`,
      signal,
    ),
    itunesJson(
      `/search?term=${encodeURIComponent(parsed.searchTerm)}&entity=song&limit=20`,
      signal,
    ),
  ])
  const data = {
    results: [...(songs.results ?? []), ...(albums.results ?? [])],
  }
  const scan = toScan(data.results ?? [])
  return {
    ...scan,
    artistName: scan.artistName || parsed.searchTerm,
  }
}
