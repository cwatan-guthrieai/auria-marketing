import type { SoundchartsCreds } from "../../src/lib/soundcharts-server.ts"

export function soundchartsCredsFromEnv(): SoundchartsCreds | null {
  const appId = process.env.SOUNDCHARTS_APP_ID
  const apiKey = process.env.SOUNDCHARTS_API_KEY
  if (!appId || !apiKey) return null

  return {
    baseUrl: (
      process.env.SOUNDCHARTS_API_BASE_URL || "https://customer.api.soundcharts.com"
    ).replace(/\/$/, ""),
    appId,
    apiKey,
  }
}
