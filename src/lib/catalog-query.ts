export type CatalogQuery = {
  source: "name" | "spotify" | "apple" | "youtube" | "soundcloud" | "deezer"
  searchTerm: string
  appleArtistId?: string
  spotifyUrl?: string
}

function slugToName(slug: string) {
  return decodeURIComponent(slug).replace(/[-_+]+/g, " ").trim()
}

export function parseCatalogQuery(raw: string): CatalogQuery {
  const input = raw.trim()
  if (!input) {
    return { source: "name", searchTerm: "" }
  }

  let url: URL | null = null
  try {
    url = new URL(input.includes("://") ? input : `https://${input}`)
  } catch {
    url = null
  }

  if (!url || !url.hostname.includes(".")) {
    return { source: "name", searchTerm: input }
  }

  const host = url.hostname.replace(/^www\./, "")
  const parts = url.pathname.split("/").filter(Boolean)

  if (host.includes("spotify.com")) {
    return {
      source: "spotify",
      searchTerm: input,
      spotifyUrl: `https://open.spotify.com${url.pathname}`,
    }
  }

  if (host.includes("music.apple.com") || host.includes("itunes.apple.com")) {
    const artistIndex = parts.indexOf("artist")
    const idPart = artistIndex >= 0 ? parts[artistIndex + 2] : parts.find((p) => /^\d+$/.test(p))
    const slug = artistIndex >= 0 ? parts[artistIndex + 1] : ""
    return {
      source: "apple",
      searchTerm: slug ? slugToName(slug) : input,
      appleArtistId: idPart && /^\d+$/.test(idPart) ? idPart : undefined,
    }
  }

  if (host.includes("youtube.com") || host.includes("youtu.be") || host.includes("music.youtube.com")) {
    const channel = parts[0] === "channel" || parts[0] === "c" || parts[0] === "@"
      ? parts[parts[0] === "@" ? 0 : 1]
      : parts.at(-1)
    return {
      source: "youtube",
      searchTerm: slugToName((channel ?? "").replace(/^@/, "")) || input,
    }
  }

  if (host.includes("soundcloud.com")) {
    return { source: "soundcloud", searchTerm: slugToName(parts[0] ?? input) }
  }

  if (host.includes("deezer.com")) {
    const artistIndex = parts.indexOf("artist")
    const slug = artistIndex >= 0 ? parts[artistIndex + 1] : parts[0]
    return { source: "deezer", searchTerm: slugToName(slug ?? input) }
  }

  return { source: "name", searchTerm: input }
}
