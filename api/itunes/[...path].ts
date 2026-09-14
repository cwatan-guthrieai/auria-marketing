export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 })
  }

  const url = new URL(req.url)
  const path = url.pathname.replace(/^\/api\/itunes/, "") || "/"
  const upstream = await fetch(`https://itunes.apple.com${path}${url.search}`, {
    headers: { Accept: "application/json" },
  })

  if (!upstream.ok) {
    return Response.json({ error: "iTunes lookup failed" }, { status: upstream.status })
  }

  const payload = await upstream.json()
  return Response.json(payload)
}
