import { mapSoundchartsArtists } from "./soundcharts.ts"
import { analyzeSoundchartsCatalog } from "./soundcharts-analysis.ts"

export type SoundchartsCreds = {
  baseUrl: string
  appId: string
  apiKey: string
}

export async function searchSoundchartsArtists(
  creds: SoundchartsCreds,
  query: string,
): Promise<{ items: ReturnType<typeof mapSoundchartsArtists> } | { error: string; status: number }> {
  const trimmed = query.trim()
  if (trimmed.length < 2) {
    return { items: [] }
  }

  const upstream = await fetch(
    `${creds.baseUrl}/api/v2/artist/search/${encodeURIComponent(trimmed)}?offset=0&limit=8`,
    { headers: { "x-app-id": creds.appId, "x-api-key": creds.apiKey } },
  )

  if (!upstream.ok) {
    return { error: "Soundcharts search failed", status: upstream.status }
  }

  const payload = await upstream.json()
  return { items: mapSoundchartsArtists(payload) }
}

export async function analyzeSoundchartsArtist(
  creds: SoundchartsCreds,
  input: { id?: string; query?: string },
): Promise<
  { analysis: Awaited<ReturnType<typeof analyzeSoundchartsCatalog>> } | { error: string; status: number }
> {
  const id = input.id?.trim() ?? ""
  const query = input.query?.trim() ?? ""
  if (!id && query.length < 2) {
    return { error: "Artist is required", status: 400 }
  }

  try {
    const analysis = await analyzeSoundchartsCatalog(creds, { id, query })
    return { analysis }
  } catch {
    return { error: "Soundcharts analysis failed", status: 502 }
  }
}

export { analyzeSoundchartsCatalog }
