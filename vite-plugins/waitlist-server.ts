import { readFileSync } from "node:fs"
import path from "node:path"
import type { IncomingMessage } from "node:http"
import { loadEnv } from "vite"
import {
  subscribeToWaitlist,
  type WaitlistConfig,
  type WaitlistPayload,
} from "../src/lib/waitlist-server.ts"

export type { WaitlistConfig, WaitlistPayload }
export { subscribeToWaitlist }

function parseSiblingEnv(filePath: string) {
  const values: Record<string, string> = {}
  try {
    for (const line of readFileSync(filePath, "utf8").split("\n")) {
      const match = line.match(/^(RESEND_[A-Z0-9_]+|EMAIL_RESEND_API_KEY)=(.*)$/)
      if (match) {
        values[match[1]] = match[2].trim()
      }
    }
  } catch {
    return values
  }
  return values
}

export function waitlistConfig(root: string, mode: string): WaitlistConfig | null {
  const fromVite = loadEnv(mode, root, "")
  const fromSibling = parseSiblingEnv(path.resolve(root, "../auria-platform/.env"))
  const apiKey =
    fromVite.RESEND_API_KEY ||
    fromVite.EMAIL_RESEND_API_KEY ||
    fromSibling.RESEND_API_KEY ||
    fromSibling.EMAIL_RESEND_API_KEY

  if (!apiKey) return null

  const segmentId = fromVite.RESEND_SEGMENT_ID || fromSibling.RESEND_SEGMENT_ID
  const audienceId = fromVite.RESEND_AUDIENCE_ID || fromSibling.RESEND_AUDIENCE_ID

  return {
    apiKey,
    segmentId: segmentId || undefined,
    audienceId: audienceId || undefined,
  }
}

export function readWaitlistBody(req: IncomingMessage): Promise<WaitlistPayload | null> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = []
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
    req.on("end", () => {
      try {
        const payload = JSON.parse(Buffer.concat(chunks).toString("utf8")) as WaitlistPayload
        const email = payload.email?.trim() ?? ""
        if (!email.includes("@")) {
          resolve(null)
          return
        }
        resolve({
          email,
          name: payload.name?.trim() ?? "",
          artist: payload.artist?.trim() ?? "",
          track: payload.track?.trim() ?? "",
        })
      } catch {
        resolve(null)
      }
    })
    req.on("error", () => resolve(null))
  })
}
