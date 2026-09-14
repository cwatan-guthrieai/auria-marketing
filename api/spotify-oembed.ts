export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 })
  }

  const url = new URL(req.url)
  const spotifyUrl = url.searchParams.get("url")?.trim() ?? ""
  if (!spotifyUrl) {
    return Response.json({ error: "url is required" }, { status: 400 })
  }

  const upstream = await fetch(
    `https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`,
    { headers: { Accept: "application/json" } },
  )

  if (!upstream.ok) {
    return Response.json({ error: "Spotify lookup failed" }, { status: upstream.status })
  }

  const payload = await upstream.json()
  return Response.json(payload)
}
