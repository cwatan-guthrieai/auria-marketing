export type SoundchartsProfile = {
  id: string
  name: string
  country?: string
  imageUrl?: string
}

type SoundchartsPayload = {
  items?: unknown
  object?: { items?: unknown } | unknown[]
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function firstString(item: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = item[key]
    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  }
  return ""
}

function coerceItems(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return payload.filter((item) => asRecord(item)) as Record<string, unknown>[]
  }
  const root = asRecord(payload)
  if (!root) {
    return []
  }
  const data = root as SoundchartsPayload
  if (Array.isArray(data.items)) {
    return data.items.filter((item) => asRecord(item)) as Record<string, unknown>[]
  }
  if (Array.isArray(data.object)) {
    return data.object.filter((item) => asRecord(item)) as Record<string, unknown>[]
  }
  const nested = asRecord(data.object)
  if (nested && Array.isArray(nested.items)) {
    return nested.items.filter((item) => asRecord(item)) as Record<string, unknown>[]
  }
  return []
}

export function mapSoundchartsArtists(payload: unknown): SoundchartsProfile[] {
  const profiles: SoundchartsProfile[] = []
  for (const item of coerceItems(payload)) {
    const id = firstString(item, ["uuid", "id"])
    const name = firstString(item, ["name", "displayName"])
    if (!id || !name) {
      continue
    }
    const country = firstString(item, ["countryCode", "country"])
    const imageUrl = firstString(item, ["imageUrl", "pictureUrl", "picture"])
    profiles.push({
      id,
      name,
      country: country || undefined,
      imageUrl: imageUrl || undefined,
    })
  }
  return profiles
}

export async function searchSoundchartsArtists(
  query: string,
  signal?: AbortSignal,
): Promise<SoundchartsProfile[]> {
  const response = await fetch(
    `/lookup/soundcharts/artists?q=${encodeURIComponent(query)}`,
    { signal },
  )
  if (!response.ok) {
    throw new Error("Soundcharts search failed")
  }
  const payload = (await response.json()) as { items?: SoundchartsProfile[] }
  return payload.items ?? []
}
