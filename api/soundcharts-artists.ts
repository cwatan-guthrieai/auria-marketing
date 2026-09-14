import { searchSoundchartsArtists } from "../src/lib/soundcharts-server.ts"
import { soundchartsCredsFromEnv } from "./soundcharts-creds.ts"

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 })
  }

  const creds = soundchartsCredsFromEnv()
  if (!creds) {
    return Response.json({ error: "Soundcharts is not configured" }, { status: 503 })
  }

  const url = new URL(req.url)
  const query = url.searchParams.get("q") ?? ""
  const result = await searchSoundchartsArtists(creds, query)

  if ("error" in result) {
    return Response.json({ error: result.error }, { status: result.status })
  }

  return Response.json({ items: result.items })
}
